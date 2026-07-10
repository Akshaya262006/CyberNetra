/* ==========================================================================
   CyberNetra Secure Application Logic
   ========================================================================== */

// --- MOCK DATASTORE ---
const complaints = [
    // 1. ACTIVE COMPLAINTS (HIGH RISK)
    {
        id: "CN-2026-92",
        category: "active-complaints",
        title: "CEO Deepfake Impersonation Wire Fraud",
        complainerName: "Rajesh Kumar",
        email: "rajesh.k@corporate.com",
        date: "2026-07-09 18:24 UTC",
        statement: "A highly sophisticated deepfake video of our CEO was broadcast to our finance team over a Slack direct call. The fake executive ordered an immediate emergency wire transfer of $50,000 to an offshore account. The voice tone, facial expressions, and background matched perfectly. Fortunately, verification protocols prevented transaction completion.",
        evidence: "Forensic visual grid evaluation detected synthetic neural-network artifacting around the lip borders. Compression discrepancies match audio synthesis signatures from deep generative models.",
        risk: 95,
        fileName: "deepfake_analysis_mesh.png",
        fileSize: "1.8 MB",
        status: "unresolved"
    },
    {
        id: "CN-2026-88",
        category: "active-complaints",
        title: "Instagram Executive Identity Theft & Extortion",
        complainerName: "Sneha Reddy",
        email: "sneha.reddy99@gmail.com",
        date: "2026-07-08 09:12 UTC",
        statement: "An attacker cloned my social media profiles using high-resolution images. They are contacting my business partners, sending forged chat logs claiming I am hospitalized, and requesting direct bank transfers. They also emailed me demanding 1.5 BTC to take down the clone profiles and cease contact.",
        evidence: "IP tracking on the fake account login details pinpoints node routing via a bulletproof proxy network. Social engineering vectors match known active credential harvest lists.",
        risk: 88,
        fileName: "cloned_profile_alert.png",
        fileSize: "950 KB",
        status: "unresolved"
    },
    {
        id: "CN-2026-82",
        category: "active-complaints",
        title: "Bank Portal Cloned Interface Scam",
        complainerName: "Vikram Malhotra",
        email: "vikram.m@outlook.com",
        date: "2026-07-07 14:05 UTC",
        statement: "Received an SMS alert asking me to update my KYC or suffer account suspension. Clicking the link loaded an exact copy of the Netra Bank web interface. After typing my customer ID and OTP, I received a security alert indicating a login attempt from an unknown device attempting to authorize an external beneficiary.",
        evidence: "The domain 'netrabank-kyc-auth.com' was registered 6 hours prior. Source code analysis reveals direct forms posting scripts to an anonymous Telegram bot endpoint.",
        risk: 82,
        fileName: "bank_phishing_report.html",
        fileSize: "244 KB",
        status: "unresolved"
    },
    {
        id: "CN-2026-74",
        category: "active-complaints",
        title: "Hostage Ransom Extortion via Voice Cloning",
        complainerName: "Priya Sharma",
        email: "priya.s@gmail.com",
        date: "2026-07-05 21:40 UTC",
        statement: "My home phone received an urgent call. The voice sounded exactly like my teenage daughter, crying hysterically and saying she had been in an accident and needed immediate money. Another male voice came on, claiming she was held hostage and demanded 50,000 Rupees. I verified my daughter was safe at school, but the voice clone was indistinguishable.",
        evidence: "Spectrograph analysis of the audio recording reveals periodic noise injection characteristic of real-time synthetic voice conversion networks.",
        risk: 74,
        fileName: "voice_spectral_analysis.wav",
        fileSize: "4.2 MB",
        status: "unresolved"
    },

    // 2. PREVIOUS COMPLAINTS (LOW RISK, UNSOLVED BACKLOG)
    {
        id: "CN-2026-35",
        category: "previous-complaints",
        title: "Automated Comment Bot Flood",
        complainerName: "Amit Patel",
        email: "amit.blog@tech.in",
        date: "2026-06-15 07:11 UTC",
        statement: "Our company blog is being targeted by an automated spam bot cluster. Every post gets flooded with hundreds of comments advertising sketchy online pharmacies. They are bypass-linking using obfuscated redirects.",
        evidence: "IP logs indicate requests coming from a compromised botnet consisting mostly of unsecured smart home devices in Southeast Asia.",
        risk: 35,
        fileName: "comment_ip_spamlist.csv",
        fileSize: "1.2 MB",
        status: "unresolved"
    },
    {
        id: "CN-2026-22",
        category: "previous-complaints",
        title: "Product Image Copyright Scraping",
        complainerName: "Divya Nair",
        email: "divya.photography@gmail.com",
        date: "2026-06-02 11:30 UTC",
        statement: "I discovered that a local drop-shipping storefront is scraping and using my original watermarked product photography on their listings, violating digital copyright agreements and diverting sales.",
        evidence: "Image metadata checks indicate exact match of digital watermarks and camera EXIF information. Scraping logs showed automated user-agent crawls.",
        risk: 22,
        fileName: "stolen_image_diff.png",
        fileSize: "2.1 MB",
        status: "unresolved"
    },
    {
        id: "CN-2026-15",
        category: "previous-complaints",
        title: "Restaurant Parody Social Page",
        complainerName: "Rohan Gupta",
        email: "rohan.g@yahoo.com",
        date: "2026-05-20 16:45 UTC",
        statement: "An anonymous user created a parody account of our local diner. The bio has a small disclaimer saying it is a parody, but they post exaggerated jokes about our staff and food that confuse some local customers.",
        evidence: "Social media profile links and customer screenshots. The page follows standard platform terms of service regarding satire, resulting in platform rejection of takedown request.",
        risk: 15,
        fileName: "parody_tweet_logs.png",
        fileSize: "820 KB",
        status: "unresolved"
    },

    // 3. ONLINE FRAUD CALLS
    {
        id: "CN-2026-44",
        category: "fraud-calls",
        title:"Police Fraud Call to the Family About Their Family Member Being Arrested",
        complainerName: "Thakphasa",
        email: "thakphasa@gmail.com",
        date: "2026-07-10 11:32 UTC",
        statement:"Received a call from someone impersonating a police officer who claimed that a family member had been arrested and demanded money for immediate release.",
        evidence:"The caller used intimidation tactics, falsely identified themselves as a police officer, and requested an urgent bank transfer.",
        risk:95,
        fraudphone :"+91 9234567890",
        status : "Unresolved"
    },
    {
        id: "CN-2026-91",
        category: "fraud-calls",
        title: "KBC Lottery Winner Prize Fraud Call",
        complainerName: "Ramesh Chenoy",
        email: "ramesh.c@gmail.com",
        date: "2026-07-10 11:32 UTC",
        statement: "Received a WhatsApp call from an unknown number showing a logo of KBC. The caller claimed I won a lottery jackpot of 25 Lakh Rupees. In order to release the funds, they requested me to deposit a processing fee of 15,000 Rupees into a private bank account details shared via text.",
        evidence: "The WhatsApp caller used social engineering tactics to pressurize the victim. Bank account details provided were flagged for immediate locking.",
        risk: 91,
        fraudPhone: "+91 98765 43210",
        status: "unresolved"
    },
    {
        id: "CN-2026-86",
        category: "fraud-calls",
        title: "Rogue Electricity Bill Payment Warning",
        complainerName: "Sunita Rao",
        email: "sunita.rao@hotmail.com",
        date: "2026-07-09 15:40 UTC",
        statement: "Caller posing as a supervisor from State Electricity Board. They asserted that my power connection would be severed within one hour due to an unpaid bill. They demanded I download an app and pay immediately using their dynamic payment link.",
        evidence: "The phone numbers used match a known spoofing gateway. The link shared downloads a malicious payload containing an Android remote administrative tool.",
        risk: 86,
        fraudPhone: "+91 87654 32109",
        status: "unresolved"
    },
    {
        id: "CN-2026-78",
        category: "fraud-calls",
        title: "AnyDesk Antivirus Subscription Refund Trick",
        complainerName: "K. Srinivasan",
        email: "srinivasan.k@gmail.com",
        date: "2026-07-07 10:15 UTC",
        statement: "Received a fraud call explaining my tech support license had auto-renewed for $399. The caller offered a refund, guiding me to install AnyDesk remote access software so they could walk me through banking procedures. They then blanked my screen and initiated unauthorized wire transfers.",
        evidence: "AnyDesk session logs identify remote IP nodes. Network traces capture malicious outbound socket transfers.",
        risk: 78,
        fraudPhone: "+91 76543 21098",
        status: "unresolved"
    },
    {
        id: "CN-2026-84",
        category: "fraud-calls",
        title: "Urgent KYC Verification Card Deactivation Scam",
        complainerName: "Meera Deshmukh",
        email: "meera.d@gmail.com",
        date: "2026-07-06 13:50 UTC",
        statement: "The caller pretended to be from the card services division of my bank. They warned me that my debit card had been blocked due to a missing KYC update. They requested my card number, expiry, CVV, and subsequently the OTP to reactivate the card.",
        evidence: "GSM carrier tower tracking shows the caller location near a known cybercrime hotbed. Multiple target reports filed against the same number.",
        risk: 84,
        fraudPhone: "+91 65432 10987",
        status: "unresolved"
    }
];

// --- APP STATE ---
let activeTab = 'active-complaints';
let selectedComplaintId = null;

// --- DOM ELEMENTS REFS ---
const landingView = document.getElementById('landing-view');
const dashboardView = document.getElementById('dashboard-view');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const complaintsListContainer = document.getElementById('complaints-list-container');
const detailPanel = document.getElementById('detail-panel');
const detailPlaceholder = document.getElementById('detail-placeholder');
const detailContent = document.getElementById('detail-content');
const toastContainer = document.getElementById('toast-container');

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    renderStats();
    switchTab('active-complaints'); // Automatically render active threats tab on dashboard launch
});

// --- TOAST NOTIFICATIONS SYSTEM ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    if (type === 'error') iconClass = 'fa-circle-xmark';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <div class="toast-content">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Automatically remove toast after 4s
    setTimeout(() => {
        toast.style.animation = 'slideInToast 0.3s ease reverse forwards';
        toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
}

// --- SOUND SYNTHESIS (WEB AUDIO API) ---
function playCyberAlertSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Dynamic dual oscillator synth tone for secure operation confirmed
        const now = audioCtx.currentTime;
        
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(300, now);
        osc1.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(150, now);
        osc2.frequency.exponentialRampToValueAtTime(300, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(900, now + 0.35);

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc1.start(now);
        osc2.start(now);
        
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
    } catch (e) {
        console.warn("Audio Context blocked or unsupported:", e);
    }
}

// --- LOGIN FLOW MANAGEMENT ---
function openLoginModal() {
    loginModal.classList.add('active');
}

function closeLoginModal() {
    loginModal.classList.remove('active');
}

function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate cyber-auth clearance validation
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Transition views
        loginModal.classList.remove('active');
        landingView.classList.remove('active');
        
        // Reveal Dashboard
        dashboardView.classList.add('active');
        
        // Set Default Active View
        switchTab('active-complaints');
        
        showToast("Secure Analyst Credentials Authenticated. Welcome, Operator.", "success");
    }, 1200);
}

function handleLogout() {
    dashboardView.classList.remove('active');
    landingView.classList.add('active');
    selectedComplaintId = null;
    
    showToast("Session terminated securely. Analyst signed out.", "info");
}

// --- DASHBOARD NAVIGATION & DATA ROUTING ---
function switchTab(tabId) {
    activeTab = tabId;
    selectedComplaintId = null;
    
    // Update active visual tags
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    
    // Update List Panel Title
    const panelTitle = document.getElementById('panel-title-text');
    if (tabId === 'active-complaints') {
        panelTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation red"></i> Active Threat Stream`;
    } else if (tabId === 'previous-complaints') {
        panelTitle.innerHTML = `<i class="fa-solid fa-folder-open orange"></i> Low-Risk Backlog Queue`;
    } else if (tabId === 'fraud-calls') {
        panelTitle.innerHTML = `<i class="fa-solid fa-phone-slash cyan"></i> Rogue Voice Logs`;
    }

    renderComplaintsList();
    renderComplaintDetails();
}

function updateBadges() {
    const activeCount = complaints.filter(c => c.category === 'active-complaints').length;
    const previousCount = complaints.filter(c => c.category === 'previous-complaints').length;
    const fraudCount = complaints.filter(c => c.category === 'fraud-calls').length;
    
    document.getElementById('badge-active').textContent = activeCount;
    document.getElementById('badge-previous').textContent = previousCount;
    document.getElementById('badge-fraud').textContent = fraudCount;
}

function renderStats() {
    const currentTabComplaints = complaints.filter(c => c.category === activeTab);
    if(currentTabComplaints.length === 0) return;
    
    // Calculate Average Risk Factor
    const sumRisk = currentTabComplaints.reduce((acc, c) => acc + c.risk, 0);
    const avgRisk = Math.round(sumRisk / currentTabComplaints.length);
    
    const unresolvedCount = currentTabComplaints.filter(c => (c.status || '').toLowerCase() === 'unresolved').length;
    
    document.getElementById('stat-avg-risk').textContent = `${avgRisk}%`;
    document.getElementById('stat-avg-risk').className = `stat-val ${avgRisk > 80 ? 'red' : 'orange'}`;
    
    document.getElementById('stat-action-count').textContent = `${unresolvedCount} case${unresolvedCount === 1 ? '' : 's'}`;
    
    document.querySelector('.risk-bar-fill').style.width = `${avgRisk}%`;
}

// --- RENDER LIST ---
function renderComplaintsList() {
    complaintsListContainer.innerHTML = "";
    
    // Filter and Sort Data based on rules:
    // "complaints which are displayed after calculating the risk factor with the list of complaints based on the percentage of the risk factor"
    let listData = complaints.filter(c => c.category === activeTab);
    
    // Sort descending by risk percentage
    listData.sort((a, b) => b.risk - a.risk);
    
    if (listData.length === 0) {
        complaintsListContainer.innerHTML = `
            <div class="empty-list-indicator">
                <i class="fa-solid fa-folder-closed"></i>
                <p>No recorded incidents in this threat index.</p>
            </div>
        `;
        return;
    }
    
    listData.forEach(item => {
        const isSelected = item.id === selectedComplaintId;
        const card = document.createElement('div');
        card.className = `complaint-item-card ${isSelected ? 'active' : ''}`;
        card.setAttribute('onclick', `selectComplaint('${item.id}')`);
        
        let riskClass = 'risk-level-low';
        if (item.risk > 80) riskClass = 'risk-level-high';
        else if (item.risk >= 50) riskClass = 'risk-level-med';
        
        let statusBadgeText = (item.status || '').toLowerCase() === 'unresolved' ? 'UNSOLVED' : 'INVESTIGATING';
        let statusClass = (item.status || '').toLowerCase() === 'unresolved' ? 'unresolved' : 'investigating';
        
        // Define specific display tag for visual category tracking
        let categoryTag = "CYBER THREAT";
        if (item.fileName && item.fileName.includes("deepfake")) categoryTag = "AI DEEPFAKE";
        else if (item.fileName && item.fileName.includes("phishing")) categoryTag = "PHISHING CLONE";
        else if (item.fileName && item.fileName.includes("voice")) categoryTag = "VOICE CLONE";
        else if (item.fraudPhone || item.fraudphone) categoryTag = "FRAUD CALL";
        else if (item.fileName && item.fileName.includes("spam")) categoryTag = "SPAM BOT";
        else if (item.fileName && item.fileName.includes("copyright")) categoryTag = "IP SCRAPE";
        
        card.innerHTML = `
            <div class="card-top">
                <span class="cyber-tag">${categoryTag}</span>
                <div class="card-risk-badge ${riskClass}">
                    <span class="risk-dot"></span>
                    <span class="risk-pct">${item.risk}% Risk</span>
                </div>
            </div>
            <h4 class="card-title">${item.title}</h4>
            <p class="card-summary">${item.statement}</p>
            <div class="card-meta">
                <span class="complainer-name"><i class="fa-solid fa-user-shield"></i> ${item.complainerName}</span>
                <span class="status-pill ${statusClass}">${statusBadgeText}</span>
            </div>
        `;
        
        complaintsListContainer.appendChild(card);
    });
}

function selectComplaint(id) {
    selectedComplaintId = id;
    renderComplaintsList();
    renderComplaintDetails();
}

// --- RENDER DETAIL PANE ---
function renderComplaintDetails() {
    if (!selectedComplaintId) {
        detailPlaceholder.classList.remove('hidden');
        detailContent.classList.add('hidden');
        return;
    }
    
    const caseItem = complaints.find(c => c.id === selectedComplaintId);
    if (!caseItem) return;
    
    // Hide placeholder, show content card
    detailPlaceholder.classList.add('hidden');
    detailContent.classList.remove('hidden');
    
    // Load Case ID and Status Badge
    document.getElementById('detail-case-id').textContent = `CASE #${caseItem.id}`;
    const statusBadge = document.getElementById('detail-status-badge');
    if ((caseItem.status || '').toLowerCase() === 'unresolved') {
        statusBadge.textContent = "PENDING INVESTIGATION";
        statusBadge.className = "badge badge-red";
    } else {
        statusBadge.textContent = "INVESTIGATION CONFIRMED";
        statusBadge.className = "badge badge-green";
    }
    
    // Update circular progress gauge
    const riskCircle = document.getElementById('detail-risk-circle');
    const riskPercentText = document.getElementById('detail-risk-percent');
    const severityText = document.getElementById('detail-risk-severity');
    
    riskPercentText.textContent = `${caseItem.risk}%`;
    
    // Circle circumference is 2 * PI * r = 2 * Math.PI * 40 ≈ 251.2
    const circumference = 251.2;
    const offset = circumference - (circumference * caseItem.risk / 100);
    riskCircle.style.strokeDashoffset = offset;
    
    // Set circle stroke color based on risk levels
    if (caseItem.risk > 80) {
        riskCircle.style.stroke = "var(--accent-red)";
        severityText.textContent = "Critical Danger Level";
        severityText.style.color = "var(--accent-red)";
    } else if (caseItem.risk >= 50) {
        riskCircle.style.stroke = "var(--accent-orange)";
        severityText.textContent = "Moderate Severity Threat";
        severityText.style.color = "var(--accent-orange)";
    } else {
        riskCircle.style.stroke = "var(--text-secondary)";
        severityText.textContent = "Low Impact Risk Backlog";
        severityText.style.color = "var(--text-secondary)";
    }
    
    // Set details texts
    document.getElementById('detail-complainer-name').textContent = caseItem.complainerName;
    document.getElementById('detail-complainer-email').textContent = caseItem.email;
    document.getElementById('detail-complainer-date').textContent = caseItem.date;
    document.getElementById('detail-statement-text').textContent = `"${caseItem.statement}"`;
    document.getElementById('detail-evidence-desc').textContent = caseItem.evidence;
    
    // Handle conditional structures based on threat categories (e.g. Fraud Call mobile numbers)
    const fraudNumberBlock = document.getElementById('fraud-number-block');
    const imageEvidenceBlock = document.getElementById('image-evidence-block');
    
    if (caseItem.category === 'fraud-calls' && (caseItem.fraudPhone || caseItem.fraudphone)) {
        fraudNumberBlock.classList.remove('hidden');
        imageEvidenceBlock.classList.add('hidden');
        document.getElementById('detail-fraud-phone').textContent = caseItem.fraudPhone || caseItem.fraudphone;
    } else {
        fraudNumberBlock.classList.add('hidden');
        imageEvidenceBlock.classList.remove('hidden');
        
        document.getElementById('detail-file-name').textContent = caseItem.fileName || "unnamed_evidence.bin";
        document.getElementById('detail-file-name').href = "#";
        document.querySelector('.file-size').textContent = caseItem.fileSize || "Unknown size";
        
        // Render beautiful responsive inline vector mock graphics inside canvas based on threat types
        const mediaContainer = document.getElementById('detail-media-preview');
        mediaContainer.innerHTML = "";
        
        const graphicCard = document.createElement('div');
        graphicCard.className = "cyber-canvas-mock";
        
        let subGraphicContent = "";
        if (caseItem.id.includes("92")) { // Deepfake
            subGraphicContent = `
                <div class="face-mesh-mock">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" stroke-dasharray="2 3"/>
                        <circle cx="35" cy="40" r="4" fill="currentColor"/>
                        <circle cx="65" cy="40" r="4" fill="currentColor"/>
                        <path d="M 35,40 Q 50,45 65,40" stroke-width="1"/>
                        <path d="M 50,25 L 50,60 L 40,65 Q 50,75 60,65 Z" stroke-width="1.5"/>
                        <line x1="10" y1="50" x2="90" y2="50" stroke-dasharray="1 1"/>
                        <line x1="50" y1="10" x2="50" y2="90" stroke-dasharray="1 1"/>
                    </svg>
                </div>
            `;
        } else if (caseItem.id.includes("74")) { // Voice clone
            subGraphicContent = `
                <div class="mock-waveform">
                    <span style="animation-delay: 0.1s"></span>
                    <span style="animation-delay: 0.3s"></span>
                    <span style="animation-delay: 0.5s"></span>
                    <span style="animation-delay: 0.2s"></span>
                    <span style="animation-delay: 0.4s"></span>
                    <span style="animation-delay: 0.7s"></span>
                    <span style="animation-delay: 0.1s"></span>
                    <span style="animation-delay: 0.6s"></span>
                    <span style="animation-delay: 0.3s"></span>
                </div>
            `;
        } else if (caseItem.id.includes("82")) { // Phishing bank clone
            subGraphicContent = `
                <div class="phish-mock">
                    <div>GET /login.html HTTP/1.1</div>
                    <div style="color: #607d8b">> Host: netrabank-kyc-auth.com</div>
                    <div style="color: #607d8b">> User-Agent: Mozilla/5.0...</div>
                    <div class="red-alert">> SUSPICIOUS POST: payload redirect</div>
                    <div style="color: var(--accent-orange)">> TARGET ENDPOINT: @tele_bot_api</div>
                </div>
            `;
        } else { // Standard file mockup logo
            subGraphicContent = `
                <i class="fa-solid fa-file-shield" style="font-size: 55px; color: var(--accent-cyan); filter: drop-shadow(0 0 10px rgba(0,210,255,0.4))"></i>
            `;
        }
        
        graphicCard.innerHTML = `
            <div class="scanline-effect"></div>
            <i class="fa-solid fa-shield-halved media-logo-bg"></i>
            ${subGraphicContent}
        `;
        mediaContainer.appendChild(graphicCard);
    }
    
    // Set Action button states
    const actionBtn = document.getElementById('btn-confirm-action');
    if ((caseItem.status || '').toLowerCase() === 'investigating') {
        actionBtn.className = "btn btn-confirm-investigation investigating-confirmed";
        actionBtn.innerHTML = `
            <span class="btn-icon"><i class="fa-solid fa-circle-check"></i></span>
            <span class="btn-lbl">Forensic Investigation Active</span>
        `;
        actionBtn.disabled = true;
    } else {
        actionBtn.className = "btn btn-confirm-investigation";
        actionBtn.innerHTML = `
            <span class="btn-icon"><i class="fa-solid fa-fingerprint"></i></span>
            <span class="btn-lbl">Confirm Threat & Begin Investigation</span>
        `;
        actionBtn.disabled = false;
    }
}

// --- INVESTIGATION STATUS UPDATER ---
function confirmInvestigation() {
    if (!selectedComplaintId) return;
    
    const caseItem = complaints.find(c => c.id === selectedComplaintId);
    if (!caseItem || (caseItem.status || '').toLowerCase() === 'investigating') return;
    
    const actionBtn = document.getElementById('btn-confirm-action');
    const origHtml = actionBtn.innerHTML;
    
    // Set loading state
    actionBtn.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-circle-notch fa-spin"></i></span> <span class="btn-lbl">Registering Security Protocol...</span>`;
    actionBtn.disabled = true;
    
    setTimeout(() => {
        // Update model status
        caseItem.status = 'investigating';
        
        // Play interactive success beep
        playCyberAlertSound();
        
        // Update lists and counts
        updateBadges();
        renderStats();
        renderComplaintsList();
        renderComplaintDetails();
        
        showToast(`Case #${caseItem.id} validated. Federal investigation procedures initiated.`, "success");
    }, 1000);
}

// --- SECURE COPY TOsecure CLIPBOARD ---
function copyPhoneNumber() {
    const phoneNum = document.getElementById('detail-fraud-phone').textContent;
    
    navigator.clipboard.writeText(phoneNum).then(() => {
        showToast(`Rogue Caller ID (${phoneNum}) copied to secure buffer clipboard.`, "success");
    }).catch(err => {
        showToast("Failed to write to clipboard.", "error");
    });
}
