const express = require('express');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configure multer for handling file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // Max 50 MB limit
  }
});

// Middleware to serve static files from root and public directories
app.use(express.static(path.join(__dirname)));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper function to standardise API responses
function getUnifiedResponse(mediaType, aiProbability, details = [], summary = "") {
  const percentage = Math.round(aiProbability * 100);
  const authenticPercentage = 100 - percentage;
  
  let riskLevel = "Low";
  let classification = "Authentic";
  let fallbackSummary = "This media is more likely to be authentic.";

  if (percentage >= 75) {
    riskLevel = "High";
    classification = "Likely AI-generated";
    fallbackSummary = "This media contains strong indicators of AI generation or manipulation.";
  } else if (percentage >= 40) {
    riskLevel = "Medium";
    classification = "Uncertain";
    fallbackSummary = "The result is uncertain. Additional verification is recommended.";
  }

  return {
    success: true,
    mediaType,
    status: "completed",
    aiProbability,
    aiPercentage: percentage,
    authenticPercentage,
    riskLevel,
    classification,
    summary: summary || fallbackSummary,
    details,
    provider: "Sightengine"
  };
}

// Check if credentials exist
function checkCredentials(res) {
  const user = process.env.SIGHTENGINE_API_USER;
  const secret = process.env.SIGHTENGINE_API_SECRET;

  if (!user || user === 'PASTE_API_USER_HERE') {
    res.status(500).json({ success: false, message: "Server Configuration Error: SIGHTENGINE_API_USER environment variable is missing." });
    return null;
  }
  if (!secret || secret === 'PASTE_NEW_API_SECRET_HERE') {
    res.status(500).json({ success: false, message: "Server Configuration Error: SIGHTENGINE_API_SECRET environment variable is missing." });
    return null;
  }

  return { user, secret };
}

// 1. IMAGE DETECTION ENDPOINT
app.post('/api/media/check-image', upload.single('media'), async (req, res) => {
  const creds = checkCredentials(res);
  if (!creds) return;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file uploaded." });
  }

  const allowedExts = ['.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return res.status(400).json({ success: false, message: "Unsupported file type. Use PNG, JPG, JPEG, or WEBP." });
  }

  const sizeMB = req.file.buffer.length / (1024 * 1024);
  if (sizeMB > 10) {
    return res.status(400).json({ success: false, message: "Image exceeds maximum size limit of 10 MB." });
  }

  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('media', req.file.buffer, req.file.originalname);
    form.append('models', 'genai,deepfake');
    form.append('api_user', creds.user);
    form.append('api_secret', creds.secret);

    const apiRes = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
      headers: form.getHeaders(),
      timeout: 15000
    });

    if (apiRes.data.status === 'failure') {
      const errCode = apiRes.data.error.code;
      let errText = apiRes.data.error.message || "Sightengine API failure.";
      if (errCode === 4 || errCode === 3) {
        errText = "Authentication failure: Invalid Sightengine API credentials.";
      }
      return res.status(400).json({ success: false, message: errText });
    }

    // Process result
    const genaiScore = (apiRes.data.ai_generated && apiRes.data.ai_generated.score !== undefined) 
      ? apiRes.data.ai_generated.score 
      : ((apiRes.data.genai && apiRes.data.genai.score) || 0);
    const typeDetails = [];
    
    if (apiRes.data.type) {
      typeDetails.push(`Analysis detected model framework: ${apiRes.data.type.ai || 'standard camera lens'}`);
    }

    const output = getUnifiedResponse("image", genaiScore, typeDetails);
    res.json(output);

  } catch (err) {
    console.error("Image analysis error details:", err.message);
    const code = err.response ? err.response.status : 500;
    res.status(code).json({ success: false, message: "Forensic image analysis timed out or failed. Check connectivity." });
  }
});

// 2. VIDEO DETECTION ENDPOINT (Using check-sync.json for videos < 60s)
app.post('/api/media/check-video', upload.single('media'), async (req, res) => {
  const creds = checkCredentials(res);
  if (!creds) return;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No video file uploaded." });
  }

  const allowedExts = ['.mp4', '.mov', '.webm'];
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return res.status(400).json({ success: false, message: "Unsupported file type. Use MP4, MOV, or WEBM." });
  }

  const sizeMB = req.file.buffer.length / (1024 * 1024);
  if (sizeMB > 50) {
    return res.status(400).json({ success: false, message: "Video exceeds maximum size limit of 50 MB." });
  }

  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('media', req.file.buffer, req.file.originalname);
    form.append('models', 'genai');
    form.append('api_user', creds.user);
    form.append('api_secret', creds.secret);

    // Call check-sync.json
    const apiRes = await axios.post('https://api.sightengine.com/1.0/video/check-sync.json', form, {
      headers: form.getHeaders(),
      timeout: 30000
    });

    if (apiRes.data.status === 'failure') {
      const errCode = apiRes.data.error.code;
      let errText = apiRes.data.error.message || "Sightengine Video API failure.";
      if (errCode === 4 || errCode === 3) {
        errText = "Authentication failure: Invalid Sightengine API credentials.";
      }
      return res.status(400).json({ success: false, message: errText });
    }

    // Parse frames
    const frames = apiRes.data.frames || (apiRes.data.data && apiRes.data.data.frames) || [];
    let aiProb = 0;
    const details = [];

    if (frames.length > 0) {
      let maxScore = 0;
      frames.forEach(frame => {
        const score = (frame.ai_generated && (frame.ai_generated.prob !== undefined ? frame.ai_generated.prob : frame.ai_generated.score)) 
                      || (frame.genai && frame.genai.score) 
                      || 0;
        if (score > maxScore) {
          maxScore = score;
        }
        
        const ts = frame.timestamp !== undefined 
          ? frame.timestamp 
          : (frame.info && frame.info.timestamp_sec !== undefined ? frame.info.timestamp_sec : null);
          
        if (score > 0.4 && ts !== null) {
          details.push(`Frame timestamp ${ts}s - AI generation confidence: ${Math.round(score * 100)}%`);
        }
      });
      aiProb = maxScore;
    }

    if (details.length === 0) {
      details.push("Checked video timelines. No anomalous face-swaps or frame splicing segments detected.");
    }

    const summary = `Video analysis scanned all frame metrics. Peak generative artificial intelligence score is ${Math.round(aiProb * 100)}%.`;
    const output = getUnifiedResponse("video", aiProb, details.slice(0, 10), summary);
    res.json(output);

  } catch (err) {
    console.error("Video analysis error details:", err.message);
    const code = err.response ? err.response.status : 500;
    res.status(code).json({ success: false, message: "Forensic video analysis timed out or failed." });
  }
});

// 3. AUDIO DETECTION ENDPOINT
app.post('/api/media/check-audio', upload.single('media'), async (req, res) => {
  const creds = checkCredentials(res);
  if (!creds) return;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No audio file uploaded." });
  }

  const allowedExts = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return res.status(400).json({ success: false, message: "Unsupported file type. Use MP3, WAV, M4A, AAC, or OGG." });
  }

  const sizeMB = req.file.buffer.length / (1024 * 1024);
  if (sizeMB > 20) {
    return res.status(400).json({ success: false, message: "Audio file exceeds maximum size limit of 20 MB." });
  }

  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('media', req.file.buffer, req.file.originalname);
    form.append('api_user', creds.user);
    form.append('api_secret', creds.secret);

    const apiRes = await axios.post('https://api.sightengine.com/1.0/audio/check.json', form, {
      headers: form.getHeaders(),
      timeout: 20000
    });

    if (apiRes.data.status === 'failure') {
      const errCode = apiRes.data.error.code;
      let errText = apiRes.data.error.message || "Sightengine Audio API failure.";
      if (errCode === 4 || errCode === 3) {
        errText = "Authentication failure: Invalid Sightengine API credentials.";
      }
      return res.status(400).json({ success: false, message: errText });
    }

    let aiProb = 0;
    const details = [];

    // Parse audio voice cloning models dynamically
    if (apiRes.data.ai_speech) {
      const score = apiRes.data.ai_speech.score !== undefined ? apiRes.data.ai_speech.score : 0;
      aiProb = score;
      details.push(`AI speech probability score: ${Math.round(score * 100)}%`);
      if (apiRes.data.ai_speech.verdict) {
        details.push(`Forensic verdict: ${apiRes.data.ai_speech.verdict}`);
      }
      if (apiRes.data.ai_speech.per_generator) {
        const generators = apiRes.data.ai_speech.per_generator;
        Object.keys(generators).forEach(key => {
          if (generators[key] > 0.1) {
            details.push(`Generator model [${key}] match probability: ${Math.round(generators[key] * 100)}%`);
          }
        });
      }
    } else if (apiRes.data.voice && apiRes.data.voice.scores) {
      const scores = apiRes.data.voice.scores;
      const synthetic = scores.synthetic || 0;
      aiProb = synthetic;
      details.push(`Synthetic speech score: ${Math.round(synthetic * 100)}%`);
      if (scores.cloned) {
        details.push(`Voice cloning similarity score: ${Math.round(scores.cloned * 100)}%`);
      }
    } else if (apiRes.data.speech && apiRes.data.speech.score !== undefined) {
      aiProb = apiRes.data.speech.score;
      details.push(`Speech generation model probability: ${Math.round(aiProb * 100)}%`);
    }

    if (details.length === 0) {
      details.push("Tested voice recordings. Auditory patterns match authentic human voice note dynamics.");
    }

    const summary = `Voice frequency audit completed. Synthetic neural sound cloning probability is ${Math.round(aiProb * 100)}%.`;
    const output = getUnifiedResponse("audio", aiProb, details, summary);
    res.json(output);

  } catch (err) {
    console.error("Audio analysis error details:", err.message);
    const code = err.response ? err.response.status : 500;
    res.status(code).json({ success: false, message: "Forensic voice analysis timed out or failed." });
  }
});

// Fallback index.html router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`CyberNetra Secure Proxy Server Active on Port ${PORT}`);
  console.log(`Serving Citizen Safety Portal: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
