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
      id: "SCAN-P-902",
      username: "ananya_realtor_invest",
      platform: "instagram",
      date: "2026-07-10 14:05",
      riskScore: 89,
      riskClass: "Highly Suspicious",
      action: "Avoid communication and do not share financial details.",
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
        matchesFound: 5,
        originalSource: "https://stock.images.example/photos/female-executive-headshot.jpg",
        croppedVersions: true,
        reuseTimeline: "First seen 3 months ago on 4 unrelated accounts"
      },
      aiMedia: {
        aiGeneratedProb: 84,
        faceManipProb: 76,
        deepfakeProb: 0,
        editIndicators: true,
        confidence: "High Confidence"
      },
      reasons: [
        "Profile photograph matches an existing corporate stock directory photo used on 5 other accounts.",
        "Account follower/following ratio indicates coordinated bot network engagement.",
        "Biography text is duplicate of an authentic verified financial advisor account.",
        "High volume of copy-paste promotional comments detected across news pages within 10 minutes."
      ]
    },
    {
      id: "SCAN-P-814",
      username: "police_helpline_mumbai",
      platform: "facebook",
      date: "2026-07-09 11:20",
      riskScore: 92,
      riskClass: "Highly Suspicious",
      action: "Report account for impersonation. Do not send identity proofs or payments.",
      behavior: {
        unusualPosting: true,
        repeatedComments: false,
        burstActivity: true,
        recentAccount: true,
        suspiciousRatio: true,
        lowEngagement: true,
        automatedActions: false,
        coordinatedPosting: true
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
        matchesFound: 3,
        originalSource: "Official Mumbai Police website contact banner",
        croppedVersions: true,
        reuseTimeline: "Reused across multiple rogue social groups"
      },
      aiMedia: {
        aiGeneratedProb: 15,
        faceManipProb: 40,
        deepfakeProb: 10,
        editIndicators: true,
        confidence: "Medium Confidence"
      },
      reasons: [
        "Impersonation of government entity logo and name without verification badges.",
        "Account registered location points to a mobile gateway outside local district borders.",
        "Bio contains direct personal bank transfer account numbers for 'fines collection'."
      ]
    },
    {
      id: "SCAN-P-403",
      username: "rohit_investments_netra",
      platform: "linkedin",
      date: "2026-07-05 09:15",
      riskScore: 42,
      riskClass: "Caution",
      action: "Verify corporate credentials before sharing resumes or bank logs.",
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
        duplicateIndicators: false,
        locationInconsistent: false,
        identityMismatch: false,
        linksSuspicious: false
      },
      imageAuthenticity: {
        matchesFound: 1,
        originalSource: "Corporate portal catalog",
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
        "Account biography matches template logs of bulk automated recruiters.",
        "Follower interaction is low, but account posts repeated promotional task threads."
      ]
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
