/* ==========================================================================
   CyberNetra Public User Panel Mock Data
   ========================================================================== */

const CyberNetraMockData = {
  // USER PROFILE
  userProfile: {
    name: "Phanidhar Kumar",
    email: "phani.kumar@netra-citizen.in",
    mobile: "9876543210",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    language: "en"
  },

  // ROTATING SAFETY TIPS
  safetyTips: [
    "Never share OTPs, banking passwords or identity documents with an unknown social-media profile.",
    "Be cautious of unsolicited job offers on WhatsApp or Telegram that request payments for training or equipment.",
    "Verify the identity of family members calling from unknown numbers in distress using a pre-agreed safety word.",
    "Always double-check URL domains before signing in to public portal bank accounts or digital services.",
    "Reverse-image search unknown profile photographs to identify if they are copied from online stock directories."
  ],

  // COMPLAINT/REPORT CATEGORIES
  incidentTypes: [
    { value: "fake-profile", label: "Fake Profile" },
    { value: "identity-impersonation", label: "Identity Impersonation" },
    { value: "stolen-photograph", label: "Stolen Photograph" },
    { value: "deepfake-content", label: "Deepfake Content" },
    { value: "voice-cloning-fraud", label: "Voice-Cloning Fraud" },
    { value: "financial-scam", label: "Financial Scam" },
    { value: "fake-job-offer", label: "Fake Job Offer" },
    { value: "romance-scam", label: "Romance Scam" },
    { value: "cyberbullying", label: "Cyberbullying / Harassment" },
    { value: "account-takeover", label: "Account Takeover" },
    { value: "other", label: "Other Threat" }
  ],

  // RECENT CYBER ALERTS
  alerts: [
    {
      id: "AL-2026-09",
      title: "Fake Police Profile Requesting Direct Bank Payments",
      summary: "Attackers are cloning official state cyber police profiles and messaging citizens claiming they have a pending cyber complaint. They demand an immediate penalty payment to avoid formal arrest. Never transfer funds or share documents. Verify identity.",
      description: "We have detected multiple coordinate campaigns where actors impersonate law enforcement agents on Instagram, WhatsApp, and Telegram. They contact victims showing fake arrest warrants and request quick payment transfers via UPI.",
      severity: "critical",
      category: "identity-theft",
      date: "2026-07-10",
      affectedAudience: "General Public, Social Media Users",
      warningSigns: [
        "Urgent requests for online bank transfers or UPI payments from official accounts.",
        "Refusal to meet at local police headquarters or share verified police ID card copies.",
        "Warrants sent via chat channels containing spelling errors and incorrect logos."
      ],
      recommendedActions: [
        "Do not pay any money. Real police never demand cash or bank transfers online.",
        "Report the suspicious account immediately to CyberNetra or your local Cyber Cell.",
        "Call the national cybercrime helpline at 1930 to confirm complaint records."
      ],
      officialSource: "National Cyber Crime Coordination Centre (NCCC)"
    },
    {
      id: "AL-2026-08",
      title: "AI Voice-Cloning Distress Calls Extorting Families",
      summary: "Scammers use AI to clone voices of children or family members from brief public audio clips. They call parents claiming the child is in immediate danger or arrested, demanding money. Verify independently before acting.",
      description: "Using just 3 seconds of reference audio harvested from public social media profiles, generative networks can replicate voices with near-perfect likeness. Scammers call parents, play synthetic distress audios, and demand emergency ransoms.",
      severity: "high",
      category: "deepfakes",
      date: "2026-07-09",
      affectedAudience: "Parents and family circles",
      warningSigns: [
        "Unscheduled incoming calls from unknown mobile numbers playing emotional family distress statements.",
        "Immediate demand for cash deposits via digital payment platforms to solve a crisis.",
        "Refusal to let you talk directly with the family member or ask verification queries."
      ],
      recommendedActions: [
        "Stay calm and end the call. Call your family member directly on their known regular phone number.",
        "Ask the caller a private personal question only your real family member would know.",
        "Secure your public videos and voices online by locking social media profiles."
      ],
      officialSource: "CERT-In Cyber Safety Advisory"
    },
    {
      id: "AL-2026-07",
      title: "Fraudulent Part-Time Work Recruitment Scams",
      summary: "Job offers claiming high daily earnings for liking videos, rating hotels, or doing simple clicks. Scammers request upfront fees or security deposits, then disappear. Avoid online task-based job groups.",
      description: "Citizens receive text alerts offering flexible part-time jobs. Once enrolled in groups, they are given nominal tasks. They are later prompted to deposit large sums into 'investment pools' to unlock higher tasks, only to have their accounts locked.",
      severity: "medium",
      category: "job-scams",
      date: "2026-07-08",
      affectedAudience: "Students, Job seekers",
      warningSigns: [
        "Part-time jobs offering 5,000-20,000 Rupees daily for trivial online tasks.",
        "Requirement to pay registration charges, equipment setups, or task security deposits.",
        "Communication conducted strictly on anonymous messaging channels like Telegram."
      ],
      recommendedActions: [
        "Do not invest money to get job tasks. Authentic agencies do not ask candidates to pay.",
        "Verify company registration and contact details independently via corporate portals.",
        "Report fraud payment links and UPI IDs to your bank immediately."
      ],
      officialSource: "RBI Public Warning Portal"
    }
  ],

  // MOCK PROFILE ANALYSES
  profileScans: [
    {
      id: "SCAN-P-001",
      username: "ananya_official",
      displayName: "Ananya Sharma",
      biography: "Verified Financial Consultant | MBA Finance | Helping citizens build secure wealth portfolios. Business enquiries: contact@ananyasharma.in",
      platform: "instagram",
      date: "2026-07-10 10:00",
      riskScore: 8,
      riskClass: "Low Risk",
      action: "Authentic profile. Standard security settings verified.",
      posts: 142,
      followers: 12500,
      following: 340,
      verified: true,
      claimedLocation: "Mumbai, India",
      claimedProfession: "Financial Consultant",
      externalWebsite: "https://ananyasharma.in",
      behavior: {
        unusualPosting: false,
        repeatedComments: false,
        burstActivity: false,
        recentAccount: false,
        suspiciousRatio: false,
        lowEngagement: false,
        automatedActions: false,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: false,
        copiedBio: false,
        similarAccounts: false,
        duplicateIndicators: false,
        locationInconsistent: false,
        identityMismatch: false,
        linksSuspicious: false
      },
      imageAuthenticity: {
        matchesFound: 0,
        originalSource: "Unique original photo",
        croppedVersions: false,
        reuseTimeline: "No matches found"
      },
      aiMedia: {
        aiGeneratedProb: 3,
        faceManipProb: 8,
        deepfakeProb: 0,
        editIndicators: false,
        confidence: "High Confidence"
      },
      reasons: ["No suspicious indicators detected."]
    },
    {
      id: "SCAN-P-002",
      username: "ananya_officia1",
      displayName: "Ananya Sharma",
      biography: "Verified Financial Consultant | MBA Finance | Helping citizens build secure wealth portfolios. Business enquiries: contact@ananyasharma.in",
      platform: "instagram",
      date: "2026-07-10 14:05",
      riskScore: 88,
      riskClass: "Highly Suspicious",
      action: "Report this impersonating copycat account immediately. Do not share credentials or money.",
      posts: 12,
      followers: 240,
      following: 3200,
      verified: false,
      claimedLocation: "Mumbai, India",
      claimedProfession: "Financial Consultant",
      externalWebsite: "https://ananyasharma-secure-pay.in",
      behavior: {
        unusualPosting: true,
        repeatedComments: true,
        burstActivity: true,
        recentAccount: true,
        suspiciousRatio: true,
        lowEngagement: true,
        automatedActions: true,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: true,
        copiedBio: true,
        similarAccounts: true,
        duplicateIndicators: true,
        locationInconsistent: true,
        identityMismatch: true,
        linksSuspicious: true
      },
      imageAuthenticity: {
        matchesFound: 1,
        originalSource: "https://instagram.com/ananya_official",
        croppedVersions: true,
        reuseTimeline: "Matches detected on @ananya_official profile avatar"
      },
      aiMedia: {
        aiGeneratedProb: 12,
        faceManipProb: 78,
        deepfakeProb: 0,
        editIndicators: true,
        confidence: "High Confidence"
      },
      reasons: [
        "Username is 94% similar to verified account @ananya_official (look-alike spelling).",
        "Biography text is 100% duplicate of verified account @ananya_official.",
        "Profile photograph matches verified user @ananya_official avatar file.",
        "External URL links to unverified bank gateway portal."
      ]
    },
    {
      id: "SCAN-P-003",
      username: "investor_helper_netra",
      displayName: "Netra Investments Desk",
      biography: "Official wealth advisors. DM for secure earnings. Double your wealth in 30 days guaranteed. Chat link below.",
      platform: "facebook",
      date: "2026-07-09 11:20",
      riskScore: 78,
      riskClass: "High Risk",
      action: "Avoid connection. Reused profile picture found across multiple spam handles.",
      posts: 5,
      followers: 840,
      following: 12,
      verified: false,
      claimedLocation: "Delhi, India",
      claimedProfession: "Investment Advisory",
      externalWebsite: "https://unverified-portal-forms.org/invest",
      behavior: {
        unusualPosting: false,
        repeatedComments: true,
        burstActivity: false,
        recentAccount: true,
        suspiciousRatio: false,
        lowEngagement: true,
        automatedActions: false,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: false,
        copiedBio: true,
        similarAccounts: false,
        duplicateIndicators: true,
        locationInconsistent: true,
        identityMismatch: true,
        linksSuspicious: true
      },
      imageAuthenticity: {
        matchesFound: 4,
        originalSource: "Corporate stock directory catalog",
        croppedVersions: true,
        reuseTimeline: "Picture found on 4 other financial groups"
      },
      aiMedia: {
        aiGeneratedProb: 15,
        faceManipProb: 40,
        deepfakeProb: 10,
        editIndicators: true,
        confidence: "Medium Confidence"
      },
      reasons: [
        "Profile photograph matches 4 unrelated accounts on public web directories.",
        "Account created recently within the last 10 days.",
        "Biography uses high-risk double-your-wealth marketing templates."
      ]
    },
    {
      id: "SCAN-P-004",
      username: "rohit_kumar_financials",
      displayName: "Rohit Kumar",
      biography: "Wealth Specialist | Ex-ICICI | Financial Planner. Helping you manage equity investment plans.",
      platform: "linkedin",
      date: "2026-07-08 09:15",
      riskScore: 81,
      riskClass: "Highly Suspicious",
      action: "Avoid communication. Biography is copied from a verified corporate member.",
      posts: 8,
      followers: 120,
      following: 950,
      verified: false,
      claimedLocation: "Bangalore, India",
      claimedProfession: "Financial Planner",
      externalWebsite: "https://rohit-wealth-advisors.xyz",
      behavior: {
        unusualPosting: false,
        repeatedComments: true,
        burstActivity: false,
        recentAccount: true,
        suspiciousRatio: true,
        lowEngagement: true,
        automatedActions: false,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: false,
        copiedBio: true,
        similarAccounts: true,
        duplicateIndicators: false,
        locationInconsistent: true,
        identityMismatch: true,
        linksSuspicious: false
      },
      imageAuthenticity: {
        matchesFound: 1,
        originalSource: "Corporate portal listings catalog",
        croppedVersions: false,
        reuseTimeline: "First matches found 1 month ago"
      },
      aiMedia: {
        aiGeneratedProb: 5,
        faceManipProb: 10,
        deepfakeProb: 0,
        editIndicators: false,
        confidence: "High Confidence"
      },
      reasons: [
        "Biography matches template logs of verified ICICI planner with 96% overlap.",
        "3 of the latest 5 post captions are exact matches of verified posts from another handle."
      ]
    },
    {
      id: "SCAN-P-005",
      username: "botnet_agent_24",
      displayName: "Crypto Desk Agent",
      biography: "Crypto trading agent. DM for safe returns. High daily profits guaranteed.",
      platform: "instagram",
      date: "2026-07-07 16:30",
      riskScore: 91,
      riskClass: "Highly Suspicious",
      action: "Coordinated bot network profile. Do not click links.",
      posts: 50,
      followers: 9800,
      following: 85,
      verified: false,
      claimedLocation: "Anonymous",
      claimedProfession: "Crypto Trader",
      externalWebsite: "https://invest-double-earn.xyz",
      behavior: {
        unusualPosting: true,
        repeatedComments: true,
        burstActivity: true,
        recentAccount: true,
        suspiciousRatio: true,
        lowEngagement: true,
        automatedActions: true,
        coordinatedPosting: true
      },
      consistency: {
        copiedUsername: false,
        copiedBio: false,
        similarAccounts: true,
        duplicateIndicators: true,
        locationInconsistent: true,
        identityMismatch: true,
        linksSuspicious: true
      },
      imageAuthenticity: {
        matchesFound: 8,
        originalSource: "Stock profile generator database",
        croppedVersions: false,
        reuseTimeline: "Active cluster matches found across 12 bot accounts"
      },
      aiMedia: {
        aiGeneratedProb: 98,
        faceManipProb: 88,
        deepfakeProb: 0,
        editIndicators: true,
        confidence: "High Confidence"
      },
      reasons: [
        "Coordinated posting template matching 12 active duplicate network profiles.",
        "High volume comment spam matches automated scripting patterns.",
        "Avatar photo displays 98% probability of generative AI creation."
      ]
    },
    {
      id: "SCAN-P-006",
      username: "new_user_join",
      displayName: "Amit Kumar",
      biography: "Student | Tech enthusiast | Sports lover. Just joined social media!",
      platform: "twitter",
      date: "2026-07-06 11:20",
      riskScore: 18,
      riskClass: "Low Risk",
      action: "Account is recently created, but shows normal student engagement signals.",
      posts: 2,
      followers: 15,
      following: 40,
      verified: false,
      claimedLocation: "Pune, India",
      claimedProfession: "Student",
      externalWebsite: "",
      behavior: {
        unusualPosting: false,
        repeatedComments: false,
        burstActivity: false,
        recentAccount: true,
        suspiciousRatio: false,
        lowEngagement: false,
        automatedActions: false,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: false,
        copiedBio: false,
        similarAccounts: false,
        duplicateIndicators: false,
        locationInconsistent: false,
        identityMismatch: false,
        linksSuspicious: false
      },
      imageAuthenticity: {
        matchesFound: 0,
        originalSource: "Unique source image",
        croppedVersions: false,
        reuseTimeline: "No matches found"
      },
      aiMedia: {
        aiGeneratedProb: 4,
        faceManipProb: 5,
        deepfakeProb: 0,
        editIndicators: false,
        confidence: "High Confidence"
      },
      reasons: ["No suspicious indicators detected."]
    },
    {
      id: "SCAN-P-007",
      username: "double_crypto_gain",
      displayName: "Wealth Double Crypto",
      biography: "Double your investments safely in hours. Click below for official KYC details.",
      platform: "instagram",
      date: "2026-07-05 14:15",
      riskScore: 84,
      riskClass: "Highly Suspicious",
      action: "Avoid external links. URL redirects to a reported cybercrime host.",
      posts: 15,
      followers: 1200,
      following: 54,
      verified: false,
      claimedLocation: "Hyderabad, India",
      claimedProfession: "Investment Advisory",
      externalWebsite: "https://netrabank-kyc-auth.com",
      behavior: {
        unusualPosting: false,
        repeatedComments: true,
        burstActivity: true,
        recentAccount: true,
        suspiciousRatio: false,
        lowEngagement: true,
        automatedActions: false,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: false,
        copiedBio: false,
        similarAccounts: false,
        duplicateIndicators: false,
        locationInconsistent: true,
        identityMismatch: true,
        linksSuspicious: true
      },
      imageAuthenticity: {
        matchesFound: 2,
        originalSource: "Stock vectors catalog",
        croppedVersions: false,
        reuseTimeline: "Matches found on 2 external sales pages"
      },
      aiMedia: {
        aiGeneratedProb: 8,
        faceManipProb: 15,
        deepfakeProb: 0,
        editIndicators: false,
        confidence: "High Confidence"
      },
      reasons: [
        "Bio URL links to suspicious domain netrabank-kyc-auth.com, blacklisted in Cyber Netra database.",
        "Location registration points to proxy server nodes outside India."
      ]
    },
    {
      id: "SCAN-P-008",
      username: "standard_citizen",
      displayName: "Ramesh Sen",
      biography: "Associate Manager at Tata Steel | IIT Kharagpur Alumnus",
      platform: "linkedin",
      date: "2026-07-04 09:30",
      riskScore: 5,
      riskClass: "Low Risk",
      action: "Profile exhibits natural posting history and verified associations.",
      posts: 95,
      followers: 840,
      following: 610,
      verified: false,
      claimedLocation: "Kolkata, India",
      claimedProfession: "Associate Manager",
      externalWebsite: "",
      behavior: {
        unusualPosting: false,
        repeatedComments: false,
        burstActivity: false,
        recentAccount: false,
        suspiciousRatio: false,
        lowEngagement: false,
        automatedActions: false,
        coordinatedPosting: false
      },
      consistency: {
        copiedUsername: false,
        copiedBio: false,
        similarAccounts: false,
        duplicateIndicators: false,
        locationInconsistent: false,
        identityMismatch: false,
        linksSuspicious: false
      },
      imageAuthenticity: {
        matchesFound: 0,
        originalSource: "Unique avatar file",
        croppedVersions: false,
        reuseTimeline: "No matches found"
      },
      aiMedia: {
        aiGeneratedProb: 2,
        faceManipProb: 4,
        deepfakeProb: 0,
        editIndicators: false,
        confidence: "High Confidence"
      },
      reasons: ["No warning indicators found."]
    }
  ],

  // MOCK MEDIA ANALYSES
  mediaScans: [
    {
      id: "SCAN-M-701",
      fileName: "financial_transfer_order.wav",
      fileType: "audio",
      date: "2026-07-10 12:30",
      riskScore: 88,
      riskClass: "Highly Suspicious",
      audio: {
        voiceCloningProb: 92,
        syntheticSpeech: 86,
        audioManip: 65,
        confidence: 94,
        waveformPoints: [10, 45, 12, 85, 30, 95, 20, 60, 10, 35, 75, 45, 15, 80, 5, 25, 90, 40, 10]
      },
      summary: "Spectrogram analysis reveals synthetic voice matching AI voice conversion footprints. Voice clone similarity is extremely high, matching voice patterns of known public accounts."
    },
    {
      id: "SCAN-M-650",
      fileName: "ceo_boardroom_update.mp4",
      fileType: "video",
      date: "2026-07-09 18:40",
      riskScore: 96,
      riskClass: "Highly Suspicious",
      video: {
        deepfakeProb: 98,
        suspiciousFrames: ["0:04 - Facial mesh boundary anomaly", "0:12 - Lip-sync mismatch with audio wave", "0:25 - Synthetic texture blending issue"],
        faceSwapIndicators: 94,
        lipSyncInconsistencies: 87,
        confidence: 99
      },
      summary: "Critical video deepfake detection. Face mesh analysis confirms temporal inconsistencies in lip positioning. Forensics highlight face-swapping indicators from deep generative networks."
    },
    {
      id: "SCAN-M-203",
      fileName: "profile_avatar_verification.png",
      fileType: "image",
      date: "2026-07-08 14:15",
      riskScore: 78,
      riskClass: "High Risk",
      image: {
        similarImages: 6,
        originalSource: "https://images.example/staff/member34.jpg",
        otherWebsites: ["https://recruiter-portal-fake.in", "https://freelance-listings-spam.com"],
        croppedVersions: true,
        aiGeneratedProb: 88,
        manipulationProb: 45
      },
      summary: "Image matches corporate portal databases and has been cropped and reused across multiple spam directories. Deep neural networks classify this avatar face as highly likely AI-generated."
    }
  ],

  // MOCK CITIZEN REPORTS
  reports: [
    {
      id: "CN-2026-001245",
      category: "fake-profile",
      suspect: "ananya_realtor_invest",
      dateSubmitted: "2026-07-10 14:15",
      lastUpdated: "2026-07-10 14:20",
      status: "submitted",
      evidenceCount: 2,
      description: "Cloned profile claiming to be my investment manager. They are requesting a direct payment of 10,000 INR. I uploaded screenshots of the chat logs.",
      timeline: [
        { date: "2026-07-10 14:15", title: "Report Submitted", desc: "Citizen filed report CN-2026-001245 successfully." },
        { date: "2026-07-10 14:20", title: "System Pre-screening Complete", desc: "AI engine linked incident logs with suspect profile SCAN-P-902." }
      ],
      messages: []
    },
    {
      id: "CN-2026-001180",
      category: "financial-scam",
      suspect: "+91 98765 43210 (KBC Lottery scam)",
      dateSubmitted: "2026-07-08 09:30",
      lastUpdated: "2026-07-09 11:45",
      status: "info-requested",
      evidenceCount: 1,
      description: "Scammer called via WhatsApp claiming lottery winning. They asked for processing fees. I transferred 15,000 INR via UPI.",
      timeline: [
        { date: "2026-07-08 09:30", title: "Report Created", desc: "Citizen submitted details of lottery ticket cash fraud." },
        { date: "2026-07-08 15:00", title: "Assigned for Review", desc: "Case files logged and sent to cyber cell node inspectors." },
        { date: "2026-07-09 11:45", title: "Information Requested", desc: "Officer requested UPI transaction screenshot showing payment reference." }
      ],
      messages: [
        { sender: "system-analyst", text: "Please upload the bank statement page or UPI debit confirmation showing transaction ID for the 15,000 INR payment.", date: "2026-07-09 11:45" }
      ]
    },
    {
      id: "CN-2026-000954",
      category: "deepfake-content",
      suspect: "CEO Impersonator post links",
      dateSubmitted: "2026-07-02 10:00",
      lastUpdated: "2026-07-05 16:30",
      status: "action-taken",
      evidenceCount: 3,
      description: "AI-generated deepfake video of CEO circulating in company chat groups ordering emergency transactions.",
      timeline: [
        { date: "2026-07-02 10:00", title: "Report Submitted", desc: "Report details filed with video samples." },
        { date: "2026-07-02 16:00", title: "Forensic Analysis Complete", desc: "Analysis confirmed 98% deepfake rating." },
        { date: "2026-07-03 11:00", title: "Under Investigation", desc: "Cyber Cell assigned lead specialist case CN-2026-000954." },
        { date: "2026-07-05 16:30", title: "Action Taken", desc: "Domain registration netrabank-kyc-auth.com suspended. Fake group chats blocked." }
      ],
      messages: []
    }
  ],

  // MOCK WATCHLIST ITEMS
  watchlist: [
    {
      id: "WL-01",
      platform: "instagram",
      username: "ananya_realtor_invest",
      url: "https://instagram.com/ananya_realtor_invest",
      prevScore: 82,
      currScore: 89,
      lastChecked: "2026-07-10 14:05",
      statusChange: "Risk score increased. Profile image matches new duplicate clusters.",
      avatar: "assets/home-page.png" // placeholder graphic or default
    },
    {
      id: "WL-02",
      platform: "facebook",
      username: "pay_tax_online_fast",
      url: "https://facebook.com/pay_tax_online_fast",
      prevScore: 65,
      currScore: 65,
      lastChecked: "2026-07-09 10:00",
      statusChange: "No status changes. Monitoring profile posts.",
      avatar: ""
    }
  ],

  // MOCK NOTIFICATIONS
  notifications: [
    {
      id: "NT-01",
      type: "complaint-status",
      title: "Additional Evidence Requested",
      text: "Investigator has requested a transaction statement screenshot for report CN-2026-001180.",
      date: "2026-07-09 11:45",
      unread: true,
      refId: "CN-2026-001180"
    },
    {
      id: "NT-02",
      type: "watchlist-change",
      title: "Risk Score Increased",
      text: "Monitored account 'ananya_realtor_invest' risk factor rose from 82% to 89%.",
      date: "2026-07-10 14:05",
      unread: true,
      refId: "WL-01"
    },
    {
      id: "NT-03",
      type: "cyber-alert",
      title: "New Critical Cyber Alert",
      text: "ALERT: Fake police profiles contacting citizens requesting UPI transfers.",
      date: "2026-07-10 09:30",
      unread: true,
      refId: "AL-2026-09"
    },
    {
      id: "NT-04",
      type: "media-complete",
      title: "Deepfake Analysis Complete",
      text: "Video file 'ceo_boardroom_update.mp4' analysis complete: Scored 96% risk.",
      date: "2026-07-09 18:40",
      unread: false,
      refId: "SCAN-M-650"
    }
  ],

  // SAFETY HUB ARTICLES & RESOURCES
  safetyArticles: [
    {
      id: "ART-01",
      category: "recognize",
      title: "How to Detect Fake Social Media Profiles",
      summary: "Fake profiles use clean headshots, recently created tags, and high following counts but have zero engagement. Learn to recognize them.",
      content: "Scammers often generate pictures using artificial intelligence (faces look clean but borders are blurry, ears look uneven, background has details merged). Always look at the profile creation date, comment logs, and cross-reference details using reverse image engines."
    },
    {
      id: "ART-02",
      category: "protect",
      title: "Securing Your Social Media Profiles",
      summary: "Simple steps to limit profile scraping, prevent logins, and set up 2-Factor Authentication.",
      content: "Lock your profile accounts so unknown circles cannot view your photogrid or record your voice tags. Set up 2-Factor Authentication (2FA) using auth apps rather than SMS gateways to avoid SIM swap issues."
    },
    {
      id: "ART-03",
      category: "respond",
      title: "What to Do If Impersonated Online",
      summary: "Actions to take: collect evidence links, request report codes, and file records with cyber authorities.",
      content: "Do not panic. Capture screenshots immediately. Copy the absolute profile link URLs (since they contain official account numbers). Report impersonation directly to the social media platforms and lodge a report on CyberNetra or call 1930."
    }
  ],

  // SAFETY QUIZZES
  quizzes: [
    {
      id: "QZ-01",
      title: "Cyber Security Basics Quiz",
      questions: [
        {
          q: "What should you do if someone claiming to be your child calls requesting urgent payment from an unknown number?",
          options: [
            "Transfer money immediately to make sure they are safe.",
            "Ignore it completely and block the number immediately.",
            "(Recommended) Hang up, call your child directly on their normal number, and ask a private confirmation question."
          ],
          correct: 2
        },
        {
          q: "A social media account with an attractive profile picture requests connection and immediately sends a link for free crypto token trades. What is this likely to be?",
          options: [
            "A genuine business opportunity from a helpful consultant.",
            "(Recommended) A social engineering fake profile attempt to steal credentials or download malware.",
            "A platform glitch showing random profile recommendations."
          ],
          correct: 1
        }
      ]
    }
  ],

  // MOCK REPORTED DOMAINS
  reportedDomains: [
    "netrabank-kyc-auth.com",
    "fastupi-pay.in",
    "invest-double-earn.xyz",
    "unverified-portal-forms.org"
  ],

  // LANGUAGES
  languages: {
    en: "English",
    hi: "हिन्दी (Hindi)",
    te: "తెలుగు (Telugu)",
    ta: "தமிழ் (Tamil)",
    kn: "ಕನ್ನಡ (Kannada)",
    ml: "മലയാളം (Malayalam)",
    mr: "मराठी (Marathi)",
    bn: "বাংলা (Bengali)",
    gu: "ગુજરાતી (Gujarati)",
    pa: "ਪੰਜਾਬੀ (Punjabi)",
    ur: "اردو (Urdu)"
  }
};

// Share mock data globally
window.CyberNetraMockData = CyberNetraMockData;
