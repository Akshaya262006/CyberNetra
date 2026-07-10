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

  // 2. ANALYSE PROFILE (SIMULATED SCANNING DETAILS)
  async function analyseProfile(platform, username, profileUrl, profilePhotoFile) {
    await delay(1800); // Simulate longer processing time for scans

    // Check if we already have a mock result for this username
    const existing = data.profileScans.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return { ok: true, result: existing };
    }

    // Generate dynamic mock scan result if not found
    const dynamicScore = Math.floor(Math.random() * 85) + 15; // 15 to 99
    let riskClass = "Low Risk";
    let action = "Profile appears regular. Maintain standard digital safety protocols.";
    if (dynamicScore > 75) {
      riskClass = "Highly Suspicious";
      action = "Avoid communication and do not share financial details.";
    } else if (dynamicScore > 50) {
      riskClass = "High Risk";
      action = "Suspicious markers found. Do not share sensitive documents.";
    } else if (dynamicScore > 25) {
      riskClass = "Caution";
      action = "Review identity credentials before connecting.";
    }

    const newScan = {
      id: `SCAN-P-${Math.floor(Math.random() * 900) + 100}`,
      username: username || "anonymous_user",
      platform: platform || "instagram",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      riskScore: dynamicScore,
      riskClass,
      action,
      behavior: {
        unusualPosting: dynamicScore > 40,
        repeatedComments: dynamicScore > 65,
        burstActivity: dynamicScore > 50,
        recentAccount: dynamicScore > 30,
        suspiciousRatio: dynamicScore > 70,
        lowEngagement: dynamicScore > 45,
        automatedActions: dynamicScore > 80,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: dynamicScore > 75,
        copiedBio: dynamicScore > 60,
        similarAccounts: dynamicScore > 50,
        duplicateIndicators: dynamicScore > 70,
        locationInconsistent: dynamicScore > 55,
        identityMismatch: dynamicScore > 65,
        linksSuspicious: dynamicScore > 80
      },
      imageAuthenticity: {
        matchesFound: dynamicScore > 50 ? Math.floor(Math.random() * 6) + 1 : 0,
        originalSource: dynamicScore > 50 ? "Public web directory catalog" : "Unique original image",
        croppedVersions: dynamicScore > 50,
        reuseTimeline: dynamicScore > 50 ? "Matches detected across multiple forums recently" : "No matches found"
      },
      aiMedia: {
        aiGeneratedProb: dynamicScore > 60 ? Math.floor(Math.random() * 50) + 40 : 5,
        faceManipProb: dynamicScore > 70 ? Math.floor(Math.random() * 40) + 40 : 10,
        deepfakeProb: 0,
        editIndicators: dynamicScore > 40,
        confidence: "High Confidence"
      },
      reasons: []
    };

    // Populate reason codes
    if (newScan.imageAuthenticity.matchesFound > 0) {
      newScan.reasons.push(`Profile photograph matches ${newScan.imageAuthenticity.matchesFound} existing external web directories.`);
    }
    if (newScan.behavior.automatedActions) {
      newScan.reasons.push("High frequency posting pattern matching automated script signatures.");
    }
    if (newScan.consistency.copiedBio) {
      newScan.reasons.push("Profile biography matches existing verified account biography templates.");
    }
    if (newScan.aiMedia.aiGeneratedProb > 50) {
      newScan.reasons.push(`Facial outline exhibits ${newScan.aiMedia.aiGeneratedProb}% probability of generative AI creation.`);
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
    await delay(1600); // Simulate processing

    const name = file ? file.name : `uploaded_evidence.${fileType === "audio" ? "mp3" : fileType === "video" ? "mp4" : "png"}`;
    const sizeStr = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "2.4 MB";

    const score = Math.floor(Math.random() * 75) + 25; // 25 to 100
    let riskClass = "Caution";
    if (score > 75) riskClass = "Highly Suspicious";
    else if (score > 50) riskClass = "High Risk";

    const newScan = {
      id: `SCAN-M-${Math.floor(Math.random() * 900) + 100}`,
      fileName: name,
      fileType,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      riskScore: score,
      riskClass,
      summary: ""
    };

    if (fileType === "audio") {
      newScan.audio = {
        voiceCloningProb: score,
        syntheticSpeech: Math.max(score - 10, 15),
        audioManip: Math.max(score - 30, 10),
        confidence: 92,
        waveformPoints: Array.from({ length: 20 }, () => Math.floor(Math.random() * 85) + 10)
      };
      newScan.summary = `Voice analysis reveals ${score}% cloning match. Periodic noise spectrogram shows synthetic text-to-speech network patterns.`;
    } else if (fileType === "video") {
      newScan.video = {
        deepfakeProb: score,
        suspiciousFrames: [`0:02 - Lip alignment discrepancy`, `0:09 - Eyebrow motion blur`],
        faceSwapIndicators: Math.max(score - 5, 20),
        lipSyncInconsistencies: Math.max(score - 12, 15),
        confidence: 95
      };
      newScan.summary = `Video analysis confirms ${score}% deepfake probability. Detected facial region overlay artifacts matching generative face-swap nets.`;
    } else {
      newScan.image = {
        similarImages: score > 50 ? Math.floor(Math.random() * 8) + 1 : 0,
        originalSource: score > 50 ? "https://corporate-photo-repository.org" : "Unique source",
        otherWebsites: score > 50 ? ["https://recruits-portal.net", "https://investments-scam-list.co"] : [],
        croppedVersions: score > 50,
        aiGeneratedProb: Math.max(score - 15, 5),
        manipulationProb: Math.max(score - 25, 10)
      };
      newScan.summary = `Image reverse lookup flagged ${newScan.image.similarImages} exact matches. Pixel forensic check reports high probability of editing manipulations.`;
    }

    data.mediaScans.unshift(newScan);
    return { ok: true, result: newScan };
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
    deleteAnalysis
  };
})();
