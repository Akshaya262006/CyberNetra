/* ==========================================================================
   CyberNetra Public User Panel API Services
   ========================================================================== */

(function () {
  const data = window.CyberNetraMockData;

  function delay(ms = 400) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 1. GET PUBLIC DASHBOARD STATS & RECENT ACTIVITIES
  async function getPublicDashboard() {
    await delay(300);
    const checkedCount = data.profileScans.length;
    const verifiedCount = data.mediaScans.length;
    const reportsCount = data.reports.length;
    const watchlistCount = data.watchlist.length;

    // Combine recent scans, reports, notifications for recent activity
    const activities = [
      ...data.profileScans.map(p => ({
        type: "profile",
        title: `Profile Check: @${p.username}`,
        date: p.date,
        status: p.riskClass,
        score: p.riskScore,
        rawId: p.id,
        icon: "fa-user-ninja"
      })),
      ...data.mediaScans.map(m => ({
        type: "media",
        title: `Media Verified: ${m.fileName}`,
        date: m.date,
        status: m.riskClass,
        score: m.riskScore,
        rawId: m.id,
        icon: m.fileType === "audio" ? "fa-microphone" : m.fileType === "video" ? "fa-video" : "fa-image"
      })),
      ...data.reports.map(r => ({
        type: "report",
        title: `Complaint Submitted: #${r.id}`,
        date: r.dateSubmitted,
        status: r.status.toUpperCase().replace("-", " "),
        rawId: r.id,
        icon: "fa-file-shield"
      }))
    ];

    // Sort by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      stats: {
        checkedCount,
        verifiedCount,
        reportsCount,
        watchlistCount
      },
      recentActivity: activities.slice(0, 5),
      alerts: data.alerts.slice(0, 3)
    };
  }

  const RISK_SCORING_CONFIG = {
    weights: {
      recentAccount: 4,
      suspiciousRatio: 4,
      repeatedPosting: 6,
      usernameLookalike: 8,
      biographyCopied: 8,
      imageReused: 15,
      postsCopied: 7,
      suspiciousLink: 5,
      previouslyReported: 5
    },
    limits: {
      behavior: 25,
      identity: 25,
      image: 25,
      content: 15,
      links: 10
    }
  };

  function calculateProfileRiskScore(findings) {
    let behaviorScore = 0;
    if (findings.behavior.recentAccount) behaviorScore += RISK_SCORING_CONFIG.weights.recentAccount;
    if (findings.behavior.suspiciousRatio) behaviorScore += RISK_SCORING_CONFIG.weights.suspiciousRatio;
    if (findings.behavior.repeatedPosting) behaviorScore += RISK_SCORING_CONFIG.weights.repeatedPosting;
    behaviorScore = Math.min(behaviorScore, RISK_SCORING_CONFIG.limits.behavior);

    let identityScore = 0;
    if (findings.identity.usernameLookalike) identityScore += RISK_SCORING_CONFIG.weights.usernameLookalike;
    if (findings.identity.biographyCopied) identityScore += RISK_SCORING_CONFIG.weights.biographyCopied;
    identityScore = Math.min(identityScore, RISK_SCORING_CONFIG.limits.identity);

    let imageScore = 0;
    if (findings.image.imageReused) imageScore += RISK_SCORING_CONFIG.weights.imageReused;
    imageScore = Math.min(imageScore, RISK_SCORING_CONFIG.limits.image);

    let contentScore = 0;
    if (findings.content.postsCopied) contentScore += RISK_SCORING_CONFIG.weights.postsCopied;
    contentScore = Math.min(contentScore, RISK_SCORING_CONFIG.limits.content);

    let linksScore = 0;
    if (findings.links.suspiciousLink) linksScore += RISK_SCORING_CONFIG.weights.suspiciousLink;
    if (findings.links.previouslyReported) linksScore += RISK_SCORING_CONFIG.weights.previouslyReported;
    linksScore = Math.min(linksScore, RISK_SCORING_CONFIG.limits.links);

    const total = behaviorScore + identityScore + imageScore + contentScore + linksScore;
    
    let classification = "Low Risk";
    let action = "Profile appears regular. Maintain standard digital safety protocols.";
    if (total > 75) {
      classification = "Highly Suspicious";
      action = "Multiple identity, image reuse and behaviour warning signals were detected.";
    } else if (total > 50) {
      classification = "High Risk";
      action = "Suspicious markers found. Do not share sensitive documents.";
    } else if (total > 25) {
      classification = "Caution";
      action = "Review identity credentials before connecting.";
    }

    return {
      totalScore: total,
      classification,
      action,
      breakdown: {
        behavior: behaviorScore,
        identity: identityScore,
        image: imageScore,
        content: contentScore,
        links: linksScore
      }
    };
  }

  // 2. ANALYSE PROFILE (DYNAMIC WEIGHTED ANALYSIS ENGINE)
  async function analyseProfile(platform, username, profileUrl, profilePhotoFile, optionalData = {}) {
    await delay(1800); // Simulate longer processing time for scans

    const cleanUsername = (username || "").toLowerCase().trim();

    // Check if we already have a mock result for this username
    const existing = data.profileScans.find(p => p.username.toLowerCase() === cleanUsername);
    if (existing) {
      return { ok: true, result: existing };
    }

    // Determine findings dynamically based on input parameters
    const isAnanyaLookalike = cleanUsername.includes("ananya_officia") || cleanUsername.includes("ananya_sharma");
    const isNewUser = cleanUsername === "new_user_join";

    const findings = {
      behavior: {
        recentAccount: isNewUser || isAnanyaLookalike || optionalData.recentAccount || Math.random() > 0.5,
        suspiciousRatio: isAnanyaLookalike || optionalData.suspiciousRatio || Math.random() > 0.6,
        repeatedPosting: isAnanyaLookalike || optionalData.repeatedPosting || Math.random() > 0.7
      },
      identity: {
        usernameLookalike: isAnanyaLookalike || (cleanUsername.length > 5 && calculateUsernameSimilarity(cleanUsername, "ananya_official") > 85),
        biographyCopied: isAnanyaLookalike || optionalData.biographyCopied || Math.random() > 0.6
      },
      image: {
        imageReused: isAnanyaLookalike || !!profilePhotoFile || Math.random() > 0.5
      },
      content: {
        postsCopied: isAnanyaLookalike || optionalData.postsCopied || Math.random() > 0.6
      },
      links: {
        suspiciousLink: isAnanyaLookalike || analyseExternalLink(profileUrl).flagged || Math.random() > 0.8,
        previouslyReported: data.reports.some(r => r.suspect.toLowerCase() === cleanUsername)
      }
    };

    // Override if normal new account is selected
    if (isNewUser) {
      findings.behavior.recentAccount = true;
      findings.behavior.suspiciousRatio = false;
      findings.behavior.repeatedPosting = false;
      findings.identity.usernameLookalike = false;
      findings.identity.biographyCopied = false;
      findings.image.imageReused = false;
      findings.content.postsCopied = false;
      findings.links.suspiciousLink = false;
      findings.links.previouslyReported = false;
    }

    const scoreResults = calculateProfileRiskScore(findings);

    const newScan = {
      id: `SCAN-P-${Math.floor(Math.random() * 900) + 100}`,
      username: username || "anonymous_user",
      displayName: isAnanyaLookalike ? "Ananya Sharma" : (username ? username.replace(/_/g, " ") : "Citizen User"),
      biography: isAnanyaLookalike ? "Verified Financial Consultant | MBA Finance | Helping citizens build secure wealth portfolios." : "Social profile page description details.",
      platform: platform || "instagram",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      riskScore: scoreResults.totalScore,
      riskClass: scoreResults.classification,
      action: scoreResults.action,
      posts: isNewUser ? 2 : (isAnanyaLookalike ? 12 : Math.floor(Math.random() * 60) + 5),
      followers: isNewUser ? 15 : (isAnanyaLookalike ? 240 : Math.floor(Math.random() * 5000) + 50),
      following: isNewUser ? 40 : (isAnanyaLookalike ? 3200 : Math.floor(Math.random() * 4000) + 80),
      verified: false,
      claimedLocation: isAnanyaLookalike ? "Mumbai, India" : "India",
      claimedProfession: isAnanyaLookalike ? "Financial Consultant" : "Executive",
      externalWebsite: profileUrl || "",
      behavior: {
        unusualPosting: findings.behavior.repeatedPosting || findings.behavior.suspiciousRatio,
        repeatedComments: findings.behavior.repeatedPosting,
        burstActivity: findings.behavior.recentAccount && findings.behavior.repeatedPosting,
        recentAccount: findings.behavior.recentAccount,
        suspiciousRatio: findings.behavior.suspiciousRatio,
        lowEngagement: findings.behavior.suspiciousRatio || Math.random() > 0.5,
        automatedActions: findings.behavior.repeatedPosting && findings.behavior.suspiciousRatio,
        coordinatedPosting: isAnanyaLookalike
      },
      consistency: {
        copiedUsername: findings.identity.usernameLookalike,
        copiedBio: findings.identity.biographyCopied,
        similarAccounts: findings.identity.usernameLookalike,
        duplicateIndicators: findings.identity.biographyCopied || findings.image.imageReused,
        locationInconsistent: findings.links.suspiciousLink || Math.random() > 0.5,
        identityMismatch: findings.identity.usernameLookalike,
        linksSuspicious: findings.links.suspiciousLink
      },
      imageAuthenticity: {
        matchesFound: findings.image.imageReused ? (isAnanyaLookalike ? 1 : Math.floor(Math.random() * 4) + 1) : 0,
        originalSource: findings.image.imageReused ? (isAnanyaLookalike ? "https://instagram.com/ananya_official" : "Public directory listing") : "Unique original image",
        croppedVersions: findings.image.imageReused,
        reuseTimeline: findings.image.imageReused ? "Detected across coordinate databases recently" : "No matches found"
      },
      aiMedia: {
        aiGeneratedProb: isAnanyaLookalike ? 12 : (findings.image.imageReused ? Math.floor(Math.random() * 40) + 40 : 5),
        faceManipProb: isAnanyaLookalike ? 78 : (findings.image.imageReused ? Math.floor(Math.random() * 30) + 40 : 8),
        deepfakeProb: 0,
        editIndicators: findings.image.imageReused,
        confidence: "High Confidence"
      },
      reasons: []
    };

    // Populate reasons list
    if (newScan.consistency.copiedUsername) {
      newScan.reasons.push("Username contains look-alike characters matching a verified profile.");
    }
    if (newScan.consistency.copiedBio) {
      newScan.reasons.push("Biography matches verified consultant template profile.");
    }
    if (newScan.imageAuthenticity.matchesFound > 0) {
      newScan.reasons.push(`Profile photograph matches visual indices on ${newScan.imageAuthenticity.matchesFound} other accounts.`);
    }
    if (newScan.behavior.automatedActions) {
      newScan.reasons.push("High frequency posting pattern matching automated script signatures.");
    }
    if (newScan.linksSuspicious) {
      newScan.reasons.push("External link matches reported fake portal hosts.");
    }
    if (newScan.reasons.length === 0) {
      newScan.reasons.push("No highly suspicious markers detected in public account data.");
    }

    data.profileScans.unshift(newScan);
    return { ok: true, result: newScan };
  }

  // 3. COMPARE PROFILES
  async function compareProfiles(source, target) {
    await delay(1200);

    const similarity = Math.floor(Math.random() * 70) + 20; // 20% to 90%

    return {
      ok: true,
      result: {
        similarityScore: similarity,
        usernameSimilarity: similarity > 60 ? "High Similarity (Obfuscated spelling)" : "Low Similarity",
        photoSimilarity: similarity > 70 ? "98% Pixel Match (Reused image)" : "Different Image",
        bioSimilarity: similarity > 50 ? "Exact Text Match in parts" : "No Match",
        postSimilarity: similarity > 40 ? "Duplicate images found in posts" : "Different content",
        followerDifferences: "Suspiciously different follower lists",
        creationDifferences: "Target account was created recently",
        verificationStatus: "Source has blue badge, Target is unverified",
        duplicateContentIndicators: similarity > 60 ? "Highly Suspicious duplicates" : "None"
      }
    };
  }

  // 4. VERIFY MEDIA
  async function verifyMedia(file, fileType) {
    const formData = new FormData();
    formData.append("media", file);

    let endpoint = "/api/media/check-image";
    if (fileType === "video") {
      endpoint = "/api/media/check-video";
    } else if (fileType === "audio") {
      endpoint = "/api/media/check-audio";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return { ok: false, message: errJson.message || `Server returned error status ${response.status}` };
      }

      const resData = await response.json();
      if (!resData.success) {
        return { ok: false, message: resData.message || "Provider analysis failed." };
      }

      // Convert backend unified result structure to match frontend expectations
      // Risk ranges (Low: 0-39, Medium: 40-74, High: 75-100)
      const score = resData.aiPercentage;
      
      let riskClass = "Caution";
      if (score >= 75) riskClass = "Highly Suspicious";
      else if (score <= 39) riskClass = "Low Risk";
      else riskClass = "High Risk"; // matches 40-74 (Medium/High)

      const newScan = {
        id: `SCAN-M-${Math.floor(Math.random() * 900) + 100}`,
        fileName: file.name,
        fileType,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        riskScore: score,
        riskClass,
        summary: resData.summary
      };

      if (fileType === "audio") {
        newScan.audio = {
          voiceCloningProb: score,
          syntheticSpeech: score,
          audioManip: score > 50 ? score - 20 : 10,
          confidence: 90,
          waveformPoints: Array.from({ length: 20 }, () => Math.floor(Math.random() * 85) + 10)
        };
      } else if (fileType === "video") {
        newScan.video = {
          deepfakeProb: score,
          suspiciousFrames: resData.details && resData.details.length > 0 
            ? resData.details 
            : ["Frame analysis verified. No distinct splicing patterns found."],
          faceSwapIndicators: score,
          lipSyncInconsistencies: score > 40 ? score - 15 : 5,
          confidence: 92
        };
      } else {
        newScan.image = {
          similarImages: 0,
          originalSource: "Direct forensic capture",
          otherWebsites: [],
          croppedVersions: false,
          aiGeneratedProb: score,
          manipulationProb: score > 50 ? score - 10 : 5
        };
      }

      data.mediaScans.unshift(newScan);
      return { ok: true, result: newScan };
    } catch (err) {
      console.error("Forensic verifyMedia network error:", err);
      return { ok: false, message: "Network connection error. Server offline." };
    }
  }

  // 5. CREATE REPORT
  async function createReport(incidentData) {
    await delay(1000);

    const refNum = `CN-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`;

    const newReport = {
      id: refNum,
      category: incidentData.category || "other",
      suspect: incidentData.username || incidentData.profileUrl || incidentData.phone || "Unknown Suspect",
      dateSubmitted: new Date().toISOString().slice(0, 16).replace("T", " "),
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "submitted",
      evidenceCount: incidentData.evidenceCount || 0,
      description: incidentData.description || "",
      timeline: [
        {
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          title: "Report Submitted",
          desc: "Citizen lodged report successfully. Verified reference code generated."
        }
      ],
      messages: []
    };

    data.reports.unshift(newReport);

    // Create a system notification about this
    data.notifications.unshift({
      id: `NT-${Math.floor(Math.random() * 9000) + 1000}`,
      type: "complaint-status",
      title: "Report Filed Successfully",
      text: `Your report ${refNum} has been logged in the system.`,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      unread: true,
      refId: refNum
    });

    return { ok: true, referenceNumber: refNum, report: newReport };
  }

  // 6. GET USER REPORTS
  async function getUserReports() {
    await delay(200);
    return { ok: true, reports: data.reports };
  }

  // 7. GET REPORT DETAILS
  async function getReportDetails(id) {
    await delay(200);
    const report = data.reports.find(r => r.id === id);
    if (!report) {
      return { ok: false, message: "Report not found." };
    }
    return { ok: true, report };
  }

  // 8. GET CYBER ALERTS
  async function getCyberAlerts() {
    await delay(200);
    return { ok: true, alerts: data.alerts };
  }

  // 9. GET SAFETY RESOURCES
  async function getSafetyResources() {
    await delay(200);
    return {
      ok: true,
      articles: data.safetyArticles,
      quizzes: data.quizzes
    };
  }

  // 10. GET WATCHLIST
  async function getWatchlist() {
    await delay(200);
    return { ok: true, watchlist: data.watchlist };
  }

  // 11. GET NOTIFICATIONS
  async function getNotifications() {
    await delay(100);
    return { ok: true, notifications: data.notifications };
  }

  // 12. UPDATE USER SETTINGS
  async function updateUserSettings(profileDetails) {
    await delay(400);
    data.userProfile = {
      ...data.userProfile,
      ...profileDetails
    };
    return { ok: true, profile: data.userProfile };
  }

  // 13. DELETE ANALYSIS (PROFILE OR MEDIA)
  async function deleteAnalysis(id, type) {
    await delay(300);
    if (type === "profile") {
      data.profileScans = data.profileScans.filter(p => p.id !== id);
    } else {
      data.mediaScans = data.mediaScans.filter(m => m.id !== id);
    }
    return { ok: true };
  }

  // --- UTILITY ALGORITHMS ---

  // 1. Username Similarity using Levenshtein distance & homoglyph normalization
  function normalizeHomoglyphs(str) {
    if (!str) return "";
    return str.toLowerCase()
      .replace(/0/g, "o")
      .replace(/1/g, "i")
      .replace(/l/g, "i")
      .replace(/rn/g, "m")
      .replace(/vv/g, "w")
      .replace(/_/g, "")
      .replace(/\./g, "");
  }

  function getLevenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,    // deletion
            dp[i][j - 1] + 1,    // insertion
            dp[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }
    return dp[m][n];
  }

  function calculateUsernameSimilarity(u1, u2) {
    const rawU1 = u1.replace(/@/g, "").trim();
    const rawU2 = u2.replace(/@/g, "").trim();
    
    // Exact match
    if (rawU1 === rawU2) return 100;

    // Normalised homoglyph match
    const normU1 = normalizeHomoglyphs(rawU1);
    const normU2 = normalizeHomoglyphs(rawU2);
    
    const distance = getLevenshteinDistance(normU1, normU2);
    const maxLength = Math.max(normU1.length, normU2.length);
    
    if (maxLength === 0) return 0;
    const score = Math.round((1 - distance / maxLength) * 100);
    return score;
  }

  // Detects homoglyph lookalikes in a username
  function detectLookalikeCharacters(username) {
    const indicators = [];
    const lower = username.toLowerCase();
    if (lower.includes("0")) indicators.push("Zero ('0') substituted for letter 'O'.");
    if (lower.includes("1")) indicators.push("Digit '1' substituted for letter 'I' or 'L'.");
    if (lower.includes("rn")) indicators.push("Letter group 'rn' substituted for letter 'm'.");
    if (lower.includes("vv")) indicators.push("Double 'v' ('vv') substituted for 'w'.");
    if (lower.includes("_")) indicators.push("Underscores ('_') added to disguise duplicate handle.");
    return indicators;
  }

  // 2. Cosine Text Similarity using simple bag of words
  function getBagOfWords(text) {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 2);
    
    const freq = {};
    words.forEach(w => {
      freq[w] = (freq[w] || 0) + 1;
    });
    return freq;
  }

  function calculateTextSimilarity(t1, t2) {
    if (!t1 || !t2) return 0;
    const f1 = getBagOfWords(t1);
    const f2 = getBagOfWords(t2);

    const allWords = new Set([...Object.keys(f1), ...Object.keys(f2)]);
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    allWords.forEach(w => {
      const val1 = f1[w] || 0;
      const val2 = f2[w] || 0;
      dotProduct += val1 * val2;
      magnitude1 += val1 * val1;
      magnitude2 += val2 * val2;
    });

    const mag1 = Math.sqrt(magnitude1);
    const mag2 = Math.sqrt(magnitude2);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    return Math.round((dotProduct / (mag1 * mag2)) * 100);
  }

  // 3. Perceptual Hashing (Difference Hash Simulation)
  function generateImageHashes(file) {
    let hash = "";
    const possible = "0123456789abcdef";
    const seed = file ? (file.name.length + file.size) % 16 : 10;
    for (let i = 0; i < 16; i++) {
      hash += possible[(seed + i * 7) % 16];
    }
    return hash;
  }

  // 4. Safe URL Domain Verification
  function analyseExternalLink(url) {
    if (!url) return { flagged: false, category: "safe", domain: "" };
    
    let domain = "";
    try {
      const parsed = new URL(url);
      domain = parsed.hostname;
    } catch (e) {
      domain = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    }

    domain = domain.toLowerCase();

    const isBlacklisted = data.reportedDomains.includes(domain);
    if (isBlacklisted) {
      return { flagged: true, category: "blacklisted", domain };
    }

    if (domain.includes("netra") && (domain.includes("kyc") || domain.includes("auth") || domain.includes("secure"))) {
      return { flagged: true, category: "suspicious-lookalike", domain };
    }

    if (url.startsWith("http://")) {
      return { flagged: true, category: "unsecured-http", domain };
    }

    return { flagged: false, category: "safe", domain };
  }

  // 5. OCR Details Screenshot Extraction
  async function extractProfileDetailsFromScreenshot(file) {
    await delay(1200);

    const name = file ? file.name.toLowerCase() : "";
    if (name.includes("ananya") || name.includes("screenshot")) {
      return {
        ok: true,
        data: {
          username: "ananya_officia1",
          displayName: "Ananya Sharma",
          followers: 240,
          following: 3200,
          posts: 12,
          biography: "Verified Financial Consultant | MBA Finance | Helping citizens build secure wealth portfolios. Business enquiries: contact@ananyasharma.in",
          externalWebsite: "https://ananyasharma-secure-pay.in",
          verified: false
        }
      };
    }

    return {
      ok: true,
      data: {
        username: "extracted_username",
        displayName: "Extracted Display Name",
        followers: 1200,
        following: 540,
        posts: 45,
        biography: "OCR extraction result placeholder. Edit as needed.",
        externalWebsite: "https://example.com",
        verified: false
      }
    };
  }

  // Export services globally
  window.CyberNetraServices = {
    getPublicDashboard,
    analyseProfile,
    compareProfiles,
    verifyMedia,
    createReport,
    getUserReports,
    getReportDetails,
    getCyberAlerts,
    getSafetyResources,
    getWatchlist,
    getNotifications,
    updateUserSettings,
    deleteAnalysis,
    calculateUsernameSimilarity,
    calculateTextSimilarity,
    detectLookalikeCharacters,
    generateImageHashes,
    analyseExternalLink,
    extractProfileDetailsFromScreenshot
  };
})();
