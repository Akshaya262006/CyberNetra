/* ==========================================================================
   CyberNetra Citizen Portal Interactivity Logic
   ========================================================================== */

(function () {
  const auth = window.CyberNetraAuth;
  const services = window.CyberNetraServices;

  // DOM REFERENCES
  const shell = document.getElementById("dashboard-shell");
  const navItems = document.querySelectorAll("[data-target-view]");
  const views = document.querySelectorAll(".portal-view-section");
  const pageTitleText = document.getElementById("page-title-text");

  // State Management
  let currentView = "overview";
  let activeProfileScanId = null;
  let activeMediaScanId = null;
  let activeReportId = null;
  let activeAlertId = null;
  let userSession = null;
  let notificationsList = [];
  let unreadNotificationsCount = 0;

  // SOUND SYNTHESIS
  function playNotificationBeep(type = "success") {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.25);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.32);
      }
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  }

  // TOAST MESSAGES
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    else if (type === "warning") icon = "fa-triangle-exclamation";
    else if (type === "error") icon = "fa-circle-xmark";

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideInToast 0.3s ease reverse forwards";
      toast.addEventListener("animationend", () => toast.remove());
    }, 3500);
  }

  // DIALOG/MODALS INTERACTION
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("active");
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("active");
  };

  // INITIALIZATION
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Authenticate check
    userSession = auth.requireRole("public");
    if (!userSession) return;

    // Load initial info
    document.querySelectorAll("[data-user-name]").forEach((el) => {
      el.textContent = userSession.name;
    });
    document.getElementById("user-profile-email").textContent = userSession.mobile || userSession.email;

    // Collapsible Left Sidebar toggle
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener("click", () => {
        shell.classList.toggle("sidebar-collapsed");
        shell.classList.toggle("mobile-sidebar-active");
      });
    }

    // Header profile dropdown menu togglers
    const profileDropdownTrigger = document.getElementById("profile-dropdown-trigger");
    const headerProfileMenu = document.getElementById("header-profile-menu");
    if (profileDropdownTrigger && headerProfileMenu) {
      profileDropdownTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        headerProfileMenu.classList.toggle("active");
      });
      document.addEventListener("click", () => {
        headerProfileMenu.classList.remove("active");
      });
    }

    // Sidebar navigation bindings
    navItems.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = btn.dataset.targetView;
        switchTab(target);
        shell.classList.remove("mobile-sidebar-active"); // Close drawer on mobile
      });
    });

    // Wire up default logs and views
    switchTab("overview");
    initOverviewPanel();
    initNotifications();

    // Check query params to redirect directly to a tab
    const urlParams = new URLSearchParams(window.location.search);
    const viewTab = urlParams.get("view");
    if (viewTab) {
      switchTab(viewTab);
    }
  });

  // NAVIGATION TABS
  function switchTab(viewId) {
    currentView = viewId;

    // Update active nav button state
    navItems.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.targetView === viewId);
    });

    // Update visibility container active view
    views.forEach((container) => {
      container.classList.toggle("active", container.id === `view-${viewId}`);
    });

    // Set page title text
    const titleMap = {
      overview: "Citizen Portal",
      "check-profile": "Profile Integrity Scan",
      "verify-media": "Media Authenticity Lab",
      "my-reports": "Complaint Registry & Tracking",
      "cyber-alerts": "Advisory Alerts Stream",
      "safety-hub": "Cyber Safety Learning Hub",
      "saved-watchlist": "Intelligence Monitor Watchlist",
      notifications: "Notifications Center",
      settings: "Portal Settings & Privacy"
    };
    pageTitleText.textContent = titleMap[viewId] || "Cyber Netra Portal";

    // Bind tab initialization hooks
    if (viewId === "overview") initOverviewPanel();
    else if (viewId === "check-profile") initCheckProfilePanel();
    else if (viewId === "verify-media") initVerifyMediaPanel();
    else if (viewId === "my-reports") initMyReportsPanel();
    else if (viewId === "cyber-alerts") initCyberAlertsPanel();
    else if (viewId === "safety-hub") initSafetyHubPanel();
    else if (viewId === "saved-watchlist") initSavedWatchlistPanel();
    else if (viewId === "settings") initSettingsPanel();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 1. CITIZEN OVERVIEW PANEL
  async function initOverviewPanel() {
    const dashboardData = await services.getPublicDashboard();

    // Stats
    document.getElementById("stat-checked-count").textContent = dashboardData.stats.checkedCount;
    document.getElementById("stat-verified-count").textContent = dashboardData.stats.verifiedCount;
    document.getElementById("stat-reports-count").textContent = dashboardData.stats.reportsCount;
    document.getElementById("stat-watchlist-count").textContent = dashboardData.stats.watchlistCount;

    // Recent Activity strip rendering
    const container = document.getElementById("recent-activity-container");
    if (!container) return;

    if (dashboardData.recentActivity.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <i class="fa-solid fa-list-check"></i>
          <h4>No recent activity logs.</h4>
          <p>Scan profiles or submit cases to build report streams.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = dashboardData.recentActivity
      .map((item) => {
        let riskClassBadge = "";
        if (item.score !== undefined) {
          const badgeClass = item.score > 75 ? "badge-red" : item.score > 50 ? "badge-orange" : "badge-green";
          riskClassBadge = `<span class="badge ${badgeClass}">${item.score}% Risk</span>`;
        } else {
          riskClassBadge = `<span class="badge badge-muted">${item.status}</span>`;
        }

        return `
        <div class="activity-strip">
          <div class="activity-strip-icon">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div class="activity-strip-info">
            <h5>${item.title}</h5>
            <span>Checked: ${item.date}</span>
          </div>
          <div class="activity-strip-status">
            ${riskClassBadge}
            <button class="btn btn-ghost btn-sm" onclick="window.viewActivityDetails('${item.type}', '${item.rawId}')">Details &rarr;</button>
          </div>
        </div>
      `;
      })
      .join("");

    // Quick Alerts panel
    const alertsContainer = document.getElementById("overview-alerts-container");
    if (alertsContainer) {
      alertsContainer.innerHTML = dashboardData.alerts
        .map((alert) => {
          const badgeClass = alert.severity === "critical" ? "badge-red" : alert.severity === "high" ? "badge-orange" : "badge-green";
          return `
          <div class="activity-strip">
            <div class="activity-strip-info">
              <span class="badge ${badgeClass}" style="margin-bottom:6px">${alert.severity.toUpperCase()}</span>
              <h5>${alert.title}</h5>
              <span>Published: ${alert.date}</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.viewAlertDetail('${alert.id}')">Read</button>
          </div>
        `;
        })
        .join("");
    }

    // Rotating Safety Tip
    const tipText = document.getElementById("safety-tip-text");
    if (tipText) {
      const tips = window.CyberNetraMockData.safetyTips;
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      tipText.textContent = randomTip;
    }
  }

  // Global Handler to Open Detail View from strip row
  window.viewActivityDetails = function (type, id) {
    if (type === "profile") {
      activeProfileScanId = id;
      switchTab("check-profile");
      renderProfileResultScreen();
    } else if (type === "media") {
      activeMediaScanId = id;
      switchTab("verify-media");
      renderMediaResultScreen();
    } else if (type === "report") {
      activeReportId = id;
      switchTab("my-reports");
      renderReportDetailScreen();
    }
  };

  // 2. CHECK PROFILE PROCESSOR
  function initCheckProfilePanel() {
    const checkForm = document.getElementById("profile-check-form");
    if (!checkForm) return;

    // Reset view visibility
    document.getElementById("profile-input-screen").style.display = "block";
    document.getElementById("profile-loading-screen").style.display = "none";
    document.getElementById("profile-results-screen").style.display = "none";
    document.getElementById("profile-compare-screen").style.display = "none";

    // Bind Platform buttons
    const platformBtns = checkForm.querySelectorAll(".select-pill-btn");
    let selectedPlatform = "instagram";
    platformBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        platformBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedPlatform = btn.dataset.platform;
      });
    });

    // Single click handler to trigger scan pipeline
    checkForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("profile-username").value.trim();
      const profileUrl = document.getElementById("profile-url").value.trim();

      if (!username && !profileUrl) {
        showToast("Enter a profile URL or username to scan.", "warning");
        return;
      }

      // Enter loading state
      document.getElementById("profile-input-screen").style.display = "none";
      document.getElementById("profile-loading-screen").style.display = "block";

      // Scan logs loop
      const logsBox = document.getElementById("scanning-logs-box");
      logsBox.innerHTML = "";
      const scanStages = [
        "Reading profile details",
        "Analysing behaviour",
        "Checking identity consistency",
        "Searching for image reuse",
        "Checking AI-media indicators",
        "Preparing risk score"
      ];

      for (let i = 0; i < scanStages.length; i++) {
        const item = document.createElement("div");
        item.className = "scanning-log-item";
        item.textContent = `⏳ ${scanStages[i]}...`;
        logsBox.appendChild(item);
        logsBox.scrollTop = logsBox.scrollHeight;
        await new Promise((r) => setTimeout(r, 450));
        item.textContent = `✓ ${scanStages[i]} - Complete.`;
        item.style.color = "var(--accent-cyan)";
      }

      // Call Mock API
      const response = await services.analyseProfile(selectedPlatform, username || "analysed_profile", profileUrl);
      if (response.ok) {
        activeProfileScanId = response.result.id;
        playNotificationBeep(response.result.riskScore > 75 ? "error" : "success");
        renderProfileResultScreen();
      } else {
        showToast("Unable to complete profile scan. Retry.", "error");
        document.getElementById("profile-input-screen").style.display = "block";
        document.getElementById("profile-loading-screen").style.display = "none";
      }
    });
  }

  // RENDER DETAILED SCAN RESULTS SCREEN
  async function renderProfileResultScreen() {
    document.getElementById("profile-input-screen").style.display = "none";
    document.getElementById("profile-loading-screen").style.display = "none";
    document.getElementById("profile-results-screen").style.display = "block";

    const scans = window.CyberNetraMockData.profileScans;
    const scan = scans.find((s) => s.id === activeProfileScanId);
    if (!scan) return;

    // Meta details
    document.getElementById("res-username").textContent = `@${scan.username}`;
    document.getElementById("res-platform").textContent = scan.platform.toUpperCase();
    document.getElementById("res-date").textContent = `Analysis Date: ${scan.date}`;

    // Risk Meter Ring progress
    const progressRing = document.getElementById("res-risk-circle");
    const riskScore = scan.riskScore;
    const circumference = 251.2; // 2 * PI * r (40)
    const offset = circumference - (circumference * riskScore) / 100;
    progressRing.style.strokeDashoffset = offset;

    // Set ring colors based on index metrics
    let badgeClass = "badge-green";
    let scoreColor = "#39d98a";
    if (riskScore > 75) {
      badgeClass = "badge-red";
      scoreColor = "#ff4d5e";
    } else if (riskScore > 50) {
      badgeClass = "badge-orange";
      scoreColor = "#ff9f43";
    } else if (riskScore > 25) {
      badgeClass = "badge-cyan";
      scoreColor = "#00d2ff";
    }
    progressRing.style.stroke = scoreColor;

    document.getElementById("res-risk-percent").textContent = `${riskScore}%`;
    document.getElementById("res-risk-class").className = `badge ${badgeClass}`;
    document.getElementById("res-risk-class").textContent = scan.riskClass.toUpperCase();
    document.getElementById("res-recommendation").textContent = scan.action;

    // Render tabs: default show Behaviour Analysis
    renderProfileTab(scan, "behavior");

    const tabs = document.querySelectorAll(".profile-res-tab-btn");
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tabName === "behavior");
      tab.onclick = () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        renderProfileTab(scan, tab.dataset.tabName);
      };
    });

    // Control actions
    document.getElementById("res-action-save").onclick = () => {
      showToast("Scan report saved to Saved & Watchlist successfully.", "success");
    };
    document.getElementById("res-action-watchlist").onclick = () => {
      // Add to watchlist mock
      const watchlist = window.CyberNetraMockData.watchlist;
      const already = watchlist.find((w) => w.username === scan.username);
      if (!already) {
        watchlist.push({
          id: `WL-${Math.floor(Math.random() * 900) + 100}`,
          platform: scan.platform,
          username: scan.username,
          url: `https://${scan.platform}.com/${scan.username}`,
          prevScore: scan.riskScore,
          currScore: scan.riskScore,
          lastChecked: scan.date,
          statusChange: "Added to active watchlist."
        });
      }
      showToast(`@${scan.username} added to watchlist successfully.`, "success");
    };
    document.getElementById("res-action-download").onclick = () => {
      showToast("Forensic evidence report PDF generated and downloaded.", "success");
    };
    document.getElementById("res-action-compare").onclick = () => {
      openCompareScreen(scan);
    };
    document.getElementById("res-action-report").onclick = () => {
      switchTab("my-reports");
      // Pre-fill creation flow steps
      document.getElementById("incident-suspect-username").value = scan.username;
      document.getElementById("incident-suspect-url").value = `https://${scan.platform}.com/${scan.username}`;
    };
    document.getElementById("res-action-flag-incorrect").onclick = () => {
      showToast("Incorrect result logged. Specialists will review this profile score.", "info");
    };
    document.getElementById("res-action-delete").onclick = async () => {
      if (confirm("Delete this scan result permanently?")) {
        await services.deleteAnalysis(scan.id, "profile");
        showToast("Analysis report deleted.", "warning");
        switchTab("check-profile");
      }
    };
  }

  // RENDER INDIVIDUAL TABS IN SCAN RESULTS
  function renderProfileTab(scan, tabName) {
    const list = document.getElementById("res-findings-list");
    if (!list) return;

    list.innerHTML = "";

    if (tabName === "behavior") {
      const b = scan.behavior;
      list.innerHTML = `
        <div class="finding-row ${b.unusualPosting ? "flagged" : "good"}">
          <i class="fa-solid ${b.unusualPosting ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Unusual Posting Pattern</h5>
            <p>${b.unusualPosting ? "High anomaly. Post timings indicate off-peak bulk sharing coordinates." : "Low risk. Normal human sharing timelines."}</p>
          </div>
        </div>
        <div class="finding-row ${b.repeatedComments ? "flagged" : "good"}">
          <i class="fa-solid ${b.repeatedComments ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Repeated Comments</h5>
            <p>${b.repeatedComments ? "High risk. Automated spamming comments detected across posts." : "Safe. Unique user comments verified."}</p>
          </div>
        </div>
        <div class="finding-row ${b.burstActivity ? "flagged" : "good"}">
          <i class="fa-solid ${b.burstActivity ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Sudden Activity Bursts</h5>
            <p>${b.burstActivity ? "Caution. High spike in account activity after long periods of silence." : "Safe. Steady profile activity timelines."}</p>
          </div>
        </div>
        <div class="finding-row ${b.recentAccount ? "flagged" : "good"}">
          <i class="fa-solid ${b.recentAccount ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Recently Created Account</h5>
            <p>${b.recentAccount ? "High risk. Account created within the last 15 days, a common pattern for scam handles." : "Safe. Mature profile lifespan verified."}</p>
          </div>
        </div>
        <div class="finding-row ${b.suspiciousRatio ? "flagged" : "good"}">
          <i class="fa-solid ${b.suspiciousRatio ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Suspicious Follower/Following Ratio</h5>
            <p>${b.suspiciousRatio ? "Flagged. Profile follows a large volume of users but has very few return followers." : "Safe. Normal friend follower ratio."}</p>
          </div>
        </div>
        <div class="finding-row ${b.lowEngagement ? "flagged" : "good"}">
          <i class="fa-solid ${b.lowEngagement ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Low Engagement Compared with Follower Count</h5>
            <p>${b.lowEngagement ? "Caution. Account follower count is high but post likes/comments are near zero." : "Safe. Regular user interactions verified."}</p>
          </div>
        </div>
        <div class="finding-row ${b.automatedActions ? "flagged" : "good"}">
          <i class="fa-solid ${b.automatedActions ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Possible Automated Behaviour</h5>
            <p>${b.automatedActions ? "Flagged. User-agent activity indicators reveal high probability of bot scripts." : "Safe. Natural human session interactions."}</p>
          </div>
        </div>
        <div class="finding-row ${b.coordinatedPosting ? "flagged" : "good"}">
          <i class="fa-solid ${b.coordinatedPosting ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Coordinated Posting Signals</h5>
            <p>${b.coordinatedPosting ? "Caution. Matches identical post templates shared concurrently by duplicate networks." : "Safe. No coordinate network flags found."}</p>
          </div>
        </div>
      `;
    } else if (tabName === "consistency") {
      const c = scan.consistency;
      list.innerHTML = `
        <div class="finding-row ${c.copiedUsername ? "flagged" : "good"}">
          <i class="fa-solid ${c.copiedUsername ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Copied Username</h5>
            <p>${c.copiedUsername ? "High risk. Username uses lookalike characters (homoglyphs) to mimic verified names." : "Safe. Unique handle spelling."}</p>
          </div>
        </div>
        <div class="finding-row ${c.copiedBio ? "flagged" : "good"}">
          <i class="fa-solid ${c.copiedBio ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Copied Biography</h5>
            <p>${c.copiedBio ? "High risk. Text matches bio templates of existing public figures or business sites." : "Safe. Biography is unique."}</p>
          </div>
        </div>
        <div class="finding-row ${c.similarAccounts ? "flagged" : "good"}">
          <i class="fa-solid ${c.similarAccounts ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Similar Account Names</h5>
            <p>${c.similarAccounts ? "Caution. Multiple profiles exist with identical or closely related name prefixes." : "Safe. No redundant account name clusters."}</p>
          </div>
        </div>
        <div class="finding-row ${c.duplicateIndicators ? "flagged" : "good"}">
          <i class="fa-solid ${c.duplicateIndicators ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Duplicate-Profile Indicators</h5>
            <p>${c.duplicateIndicators ? "Flagged. Multiple profile pages share matching photos and bio details." : "Safe. No duplicates found."}</p>
          </div>
        </div>
        <div class="finding-row ${c.locationInconsistent ? "flagged" : "good"}">
          <i class="fa-solid ${c.locationInconsistent ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Location Inconsistency</h5>
            <p>${c.locationInconsistent ? "Flagged. Account registration country does not align with targeted local posts." : "Safe. Local region coordinates verified."}</p>
          </div>
        </div>
        <div class="finding-row ${c.identityMismatch ? "flagged" : "good"}">
          <i class="fa-solid ${c.identityMismatch ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Identity Mismatch</h5>
            <p>${c.identityMismatch ? "Caution. Stated name does not match email handle prefixes or link details." : "Safe. Account identity markers match."}</p>
          </div>
        </div>
        <div class="finding-row ${c.duplicateIndicators ? "flagged" : "good"}">
          <i class="fa-solid ${c.duplicateIndicators ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Possible Impersonation</h5>
            <p>${c.duplicateIndicators ? "Flagged. Account exhibits coordinates to copycat existing citizen contacts." : "Safe. Original identity."}</p>
          </div>
        </div>
        <div class="finding-row ${c.linksSuspicious ? "flagged" : "good"}">
          <i class="fa-solid ${c.linksSuspicious ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
          <div class="finding-row-text">
            <h5>Links to Suspicious Websites</h5>
            <p>${c.linksSuspicious ? "Flagged. Bio link redirects to blacklisted domain lists or phishing portals." : "Safe. Links direct to safe portals."}</p>
          </div>
        </div>
      `;
    } else if (tabName === "images") {
      const img = scan.imageAuthenticity;
      list.innerHTML = `
        <div class="finding-row ${img.matchesFound > 0 ? "flagged" : "good"}">
          <i class="fa-solid fa-copy"></i>
          <div class="finding-row-text">
            <h5>Same Image Found on Other Accounts</h5>
            <p>${img.matchesFound > 0 ? `Flagged. Profile picture is identical to images detected on <strong>${img.matchesFound} other accounts</strong>.` : "Unique profile photograph. No duplicates found."}</p>
          </div>
        </div>
        <div class="finding-row ${img.croppedVersions ? "flagged" : "good"}">
          <i class="fa-solid fa-crop"></i>
          <div class="finding-row-text">
            <h5>Cropped or Edited Versions</h5>
            <p>${img.croppedVersions ? "Flagged. Reused image exhibits cropping, rotation, and filter alteration flags." : "No editing marks detected on profile image."}</p>
          </div>
        </div>
        <div class="finding-row ${img.matchesFound > 0 ? "flagged" : "good"}">
          <i class="fa-solid fa-globe"></i>
          <div class="finding-row-text">
            <h5>Possible Original Image Source</h5>
            <p>${img.matchesFound > 0 ? `Match detected: <a href="#" class="btn-ghost" style="text-decoration:underline">${img.originalSource}</a>` : "No matches in public stock directories."}</p>
          </div>
        </div>
        <div class="finding-row ${img.matchesFound > 0 ? "flagged" : "good"}">
          <i class="fa-solid fa-circle-nodes"></i>
          <div class="finding-row-text">
            <h5>Number of Image Matches</h5>
            <p>Reverse lookup search matches found: <strong>${img.matchesFound} matches</strong>.</p>
          </div>
        </div>
        <div class="finding-row ${img.matchesFound > 0 ? "flagged" : "good"}">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <div class="finding-row-text">
            <h5>Image Reuse Timeline</h5>
            <p>${img.matchesFound > 0 ? img.reuseTimeline : "No historical image reuse detected."}</p>
          </div>
        </div>
      `;
    } else if (tabName === "ai") {
      const ai = scan.aiMedia;
      list.innerHTML = `
        <div class="finding-row ${ai.aiGeneratedProb > 50 ? "flagged" : "good"}">
          <i class="fa-solid fa-brain"></i>
          <div class="finding-row-text">
            <h5>AI-Generated Probability</h5>
            <p>Score: <strong>${ai.aiGeneratedProb}%</strong>. Evaluated chance of synthetic GAN face generation.</p>
          </div>
        </div>
        <div class="finding-row ${ai.faceManipProb > 50 ? "flagged" : "good"}">
          <i class="fa-solid fa-mask"></i>
          <div class="finding-row-text">
            <h5>Face Manipulation Probability</h5>
            <p>Score: <strong>${ai.faceManipProb}%</strong>. Boundary pixel irregularities check.</p>
          </div>
        </div>
        <div class="finding-row good">
          <i class="fa-solid fa-clapperboard"></i>
          <div class="finding-row-text">
            <h5>Deepfake Probability</h5>
            <p>Score: <strong>0%</strong>. No face-swap video components detected (Static Avatar profile image only).</p>
          </div>
        </div>
        <div class="finding-row ${ai.editIndicators ? "flagged" : "good"}">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <div class="finding-row-text">
            <h5>Editing Indicators</h5>
            <p>${ai.editIndicators ? "Caution. High rating of local blurring or pixel cloning edits." : "No photo editing indicator marks found."}</p>
          </div>
        </div>
        <div class="finding-row good">
          <i class="fa-solid fa-shield-halved"></i>
          <div class="finding-row-text">
            <h5>Confidence Level</h5>
            <p>Confidence index: <strong>${ai.confidence}</strong>.</p>
          </div>
        </div>
      `;
    }
  }

  // 3. PROFILE COMPARISON WIZARD
  function openCompareScreen(baseScan) {
    document.getElementById("profile-results-screen").style.display = "none";
    document.getElementById("profile-compare-screen").style.display = "block";

    const genuineInput = document.getElementById("comp-genuine-url");
    const suspectInput = document.getElementById("comp-suspect-url");

    // Reset layout
    genuineInput.value = "";
    suspectInput.value = baseScan ? `https://${baseScan.platform}.com/${baseScan.username}` : "";
    document.getElementById("compare-results-area").style.display = "none";

    const compForm = document.getElementById("profile-comparison-form");
    compForm.onsubmit = async (e) => {
      e.preventDefault();
      const genuine = genuineInput.value.trim();
      const suspect = suspectInput.value.trim();

      if (!genuine || !suspect) {
        showToast("Enter both profile URLs to execute analysis.", "warning");
        return;
      }

      // Loader
      const compareBtn = compForm.querySelector('button[type="submit"]');
      const origText = compareBtn.textContent;
      compareBtn.disabled = true;
      compareBtn.textContent = "Computing similarity metrics...";

      const response = await services.compareProfiles(genuine, suspect);
      compareBtn.disabled = false;
      compareBtn.textContent = origText;

      if (response.ok) {
        playNotificationBeep();
        document.getElementById("compare-results-area").style.display = "block";
        const result = response.result;

        // Render Similarity Score
        const simScoreEl = document.getElementById("comp-similarity-score");
        simScoreEl.textContent = `${result.similarityScore}%`;
        simScoreEl.className = result.similarityScore > 60 ? "red" : "orange";

        // Bind comparison rows
        document.getElementById("comp-row-username").textContent = result.usernameSimilarity;
        document.getElementById("comp-row-photo").textContent = result.photoSimilarity;
        document.getElementById("comp-row-bio").textContent = result.bioSimilarity;
        document.getElementById("comp-row-post").textContent = result.postSimilarity;
        document.getElementById("comp-row-followers").textContent = result.followerDifferences;
        document.getElementById("comp-row-creation").textContent = result.creationDifferences;
        document.getElementById("comp-row-badge").textContent = result.verificationStatus;
        document.getElementById("comp-row-indicator").textContent = result.duplicateContentIndicators;

        document.getElementById("res-action-compare-save").onclick = () => {
          showToast("Comparison report saved.", "success");
        };
      }
    };
  }

  // 4. VERIFY MEDIA LAB
  function initVerifyMediaPanel() {
    const container = document.getElementById("view-verify-media");
    if (!container) return;

    // Reset default screen states
    document.getElementById("media-input-screen").style.display = "block";
    document.getElementById("media-results-screen").style.display = "none";

    // Bind Media Type Tabs (Image, Video, Audio)
    const mediaTabs = container.querySelectorAll(".media-tab-selector");
    let activeMediaType = "image";

    mediaTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        mediaTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        activeMediaType = tab.dataset.mediaType;

        // Hide/Show dropzone descriptions
        document.getElementById("dropzone-desc-type").textContent = activeMediaType.toUpperCase();
      });
    });

    // File selection listeners
    const dropzone = document.getElementById("media-dropzone");
    const fileInput = document.getElementById("media-file-input");

    dropzone.onclick = () => fileInput.click();

    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "var(--accent)";
      dropzone.style.background = "rgba(15, 127, 254, 0.08)";
    };

    dropzone.ondragleave = () => {
      dropzone.style.borderColor = "rgba(15, 127, 254, 0.3)";
      dropzone.style.background = "rgba(4, 9, 20, 0.5)";
    };

    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "rgba(15, 127, 254, 0.3)";
      dropzone.style.background = "rgba(4, 9, 20, 0.5)";
      if (e.dataTransfer.files.length) {
        processUploadedMedia(e.dataTransfer.files[0], activeMediaType);
      }
    };

    fileInput.onchange = () => {
      if (fileInput.files.length) {
        processUploadedMedia(fileInput.files[0], activeMediaType);
      }
    };
  }

  // Process file upload & call api
  async function processUploadedMedia(file, fileType) {
    // Show spinner loader state on Dropzone
    const dropzone = document.getElementById("media-dropzone");
    const origHtml = dropzone.innerHTML;

    dropzone.innerHTML = `
      <div class="scanning-radar-ring"></div>
      <h4>Forensic Processing Active...</h4>
      <p>Running neural network analysis stages on file ${file.name}</p>
    `;

    const response = await services.verifyMedia(file, fileType);
    dropzone.innerHTML = origHtml; // restore UI

    if (response.ok) {
      activeMediaScanId = response.result.id;
      playNotificationBeep(response.result.riskScore > 75 ? "error" : "success");
      renderMediaResultScreen();
    } else {
      showToast("Media analysis failed.", "error");
    }
  }

  // RENDER MEDIA ANALYSIS RESULTS
  function renderMediaResultScreen() {
    document.getElementById("media-input-screen").style.display = "none";
    document.getElementById("media-results-screen").style.display = "block";

    const scans = window.CyberNetraMockData.mediaScans;
    const scan = scans.find((s) => s.id === activeMediaScanId);
    if (!scan) return;

    // Bind basic meta
    document.getElementById("m-res-filename").textContent = scan.fileName;
    document.getElementById("m-res-type").textContent = scan.fileType.toUpperCase();
    document.getElementById("m-res-date").textContent = `Verified: ${scan.date}`;

    // Risk Meter Ring progress
    const progressRing = document.getElementById("m-res-risk-circle");
    const riskScore = scan.riskScore;
    const circumference = 251.2;
    const offset = circumference - (circumference * riskScore) / 100;
    progressRing.style.strokeDashoffset = offset;

    let badgeClass = "badge-green";
    let scoreColor = "#39d98a";
    if (riskScore > 75) {
      badgeClass = "badge-red";
      scoreColor = "#ff4d5e";
    } else if (riskScore > 50) {
      badgeClass = "badge-orange";
      scoreColor = "#ff9f43";
    }
    progressRing.style.stroke = scoreColor;

    document.getElementById("m-res-risk-percent").textContent = `${riskScore}%`;
    document.getElementById("m-res-risk-class").className = `badge ${badgeClass}`;
    document.getElementById("m-res-risk-class").textContent = scan.riskClass.toUpperCase();
    document.getElementById("m-res-summary").textContent = scan.summary;

    // Hide all sub panels
    const imgDetails = document.getElementById("media-result-details-image");
    const vidDetails = document.getElementById("media-result-details-video");
    const audDetails = document.getElementById("media-result-details-audio");

    imgDetails.style.display = "none";
    vidDetails.style.display = "none";
    audDetails.style.display = "none";

    // Bind sub tabs logic
    if (scan.fileType === "image") {
      imgDetails.style.display = "block";
      const imageInfo = scan.image;
      document.getElementById("m-img-score").textContent = `${imageInfo.aiGeneratedProb}%`;
      document.getElementById("m-img-match-count").textContent = imageInfo.similarImages;
      document.getElementById("m-img-manip").textContent = `${imageInfo.manipulationProb}%`;
      document.getElementById("m-img-source").textContent = imageInfo.originalSource || "Unique Capture";
    } else if (scan.fileType === "video") {
      vidDetails.style.display = "block";
      const videoInfo = scan.video;
      document.getElementById("m-vid-score").textContent = `${videoInfo.deepfakeProb}%`;
      document.getElementById("m-vid-swap").textContent = `${videoInfo.faceSwapIndicators}%`;
      document.getElementById("m-vid-lips").textContent = `${videoInfo.lipSyncInconsistencies}%`;

      const frameContainer = document.getElementById("m-vid-frames-list");
      frameContainer.innerHTML = videoInfo.suspiciousFrames
        .map((f) => `<div class="finding-row flagged"><i class="fa-solid fa-eye-slash"></i> <div class="finding-row-text"><h5>Suspicious Sequence</h5><p>${f}</p></div></div>`)
        .join("");
    } else if (scan.fileType === "audio") {
      audDetails.style.display = "block";
      const audioInfo = scan.audio;
      document.getElementById("m-aud-score").textContent = `${audioInfo.voiceCloningProb}%`;
      document.getElementById("m-aud-synth").textContent = `${audioInfo.syntheticSpeech}%`;
      document.getElementById("m-aud-manip").textContent = `${audioInfo.audioManip}%`;

      // Render custom CSS waveform points
      const waveContainer = document.getElementById("m-aud-waveform-points");
      waveContainer.innerHTML = audioInfo.waveformPoints
        .map((val) => `<span class="audio-waveform-bar" style="height: ${val}%"></span>`)
        .join("");
    }

    // Action buttons
    document.getElementById("m-res-save").onclick = () => {
      showToast("Media analysis result saved.", "success");
    };
    document.getElementById("m-res-delete").onclick = async () => {
      if (confirm("Delete this media report permanently?")) {
        await services.deleteAnalysis(scan.id, "media");
        showToast("Media scan deleted.", "warning");
        switchTab("verify-media");
      }
    };
  }

  // 5. MY REPORTS & INCIDENT WIZARD
  function initMyReportsPanel() {
    const listScreen = document.getElementById("reports-list-screen");
    const createScreen = document.getElementById("reports-create-screen");
    const detailScreen = document.getElementById("reports-detail-screen");

    listScreen.style.display = "block";
    createScreen.style.display = "none";
    detailScreen.style.display = "none";

    renderReportsTable();

    // Search & filter bindings
    const searchInput = document.getElementById("reports-search-input");
    const filterSelect = document.getElementById("reports-status-filter");

    const searchAction = () => {
      const q = searchInput.value.toLowerCase();
      const status = filterSelect.value;
      renderReportsTable(q, status);
    };

    searchInput.oninput = searchAction;
    filterSelect.onchange = searchAction;

    // Creation wizard trigger
    document.getElementById("trigger-new-report-btn").onclick = () => {
      openReportWizard();
    };

    // Tracking search bar overview
    document.getElementById("overview-track-btn").onclick = () => {
      const trackingCode = document.getElementById("overview-track-code").value.trim();
      if (!trackingCode) {
        showToast("Enter a Complaint Reference number to track.", "warning");
        return;
      }
      activeReportId = trackingCode;
      renderReportDetailScreen();
    };
  }

  // Render list of complaints
  async function renderReportsTable(query = "", statusFilter = "all") {
    const response = await services.getUserReports();
    if (!response.ok) return;

    let items = response.reports;

    // Filters
    if (query) {
      items = items.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.suspect.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== "all") {
      items = items.filter((r) => r.status === statusFilter);
    }

    const tbody = document.getElementById("reports-table-body");
    if (!tbody) return;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="empty-state-card" style="padding: 24px">
              <i class="fa-solid fa-folder-closed"></i>
              <h4>No complaints found.</h4>
              <p>Change your search filters or file a new incident report.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items
      .map((r) => {
        let statusBadge = "";
        if (r.status === "submitted") statusBadge = `<span class="badge badge-muted">SUBMITTED</span>`;
        else if (r.status === "info-requested") statusBadge = `<span class="badge badge-orange">INFO REQUESTED</span>`;
        else if (r.status === "action-taken") statusBadge = `<span class="badge badge-green">ACTION TAKEN</span>`;
        else statusBadge = `<span class="badge badge-cyan">${r.status.toUpperCase()}</span>`;

        return `
        <tr>
          <td><strong>#${r.id}</strong></td>
          <td>${r.category.toUpperCase().replace("-", " ")}</td>
          <td>${r.suspect}</td>
          <td>${r.dateSubmitted}</td>
          <td>${statusBadge}</td>
          <td>${r.evidenceCount} Files</td>
          <td><button class="btn btn-secondary btn-sm" onclick="window.viewReportDetail('${r.id}')">View</button></td>
        </tr>
      `;
      })
      .join("");
  }

  // Toggle View Report Details
  window.viewReportDetail = function (id) {
    activeReportId = id;
    renderReportDetailScreen();
  };

  async function renderReportDetailScreen() {
    document.getElementById("reports-list-screen").style.display = "none";
    document.getElementById("reports-create-screen").style.display = "none";
    document.getElementById("reports-detail-screen").style.display = "block";

    const response = await services.getReportDetails(activeReportId);
    if (!response.ok) {
      showToast("Report detail could not be loaded. Confirm code.", "error");
      switchTab("my-reports");
      return;
    }

    const report = response.report;

    document.getElementById("det-report-id").textContent = `COMPLAINT #${report.id}`;
    document.getElementById("det-report-category").textContent = report.category.toUpperCase().replace("-", " ");
    document.getElementById("det-report-date").textContent = `Filed: ${report.dateSubmitted}`;
    document.getElementById("det-report-suspect").textContent = report.suspect;
    document.getElementById("det-report-desc").textContent = report.description;

    // Timeline Tracker
    const timelineEl = document.getElementById("det-report-timeline");
    if (timelineEl) {
      timelineEl.innerHTML = report.timeline
        .map((t, index) => {
          const isLast = index === report.timeline.length - 1;
          const statusClass = isLast ? "active" : "completed";
          return `
          <div class="status-timeline-node ${statusClass}">
            <div class="status-node-bullet"></div>
            <div class="status-node-content">
              <span>${t.date}</span>
              <h5>${t.title}</h5>
              <p>${t.desc}</p>
            </div>
          </div>
        `;
        })
        .join("");
    }

    // Message input responses
    const messageSection = document.getElementById("det-report-messages-box");
    const listMessages = document.getElementById("det-report-messages-list");
    if (report.messages && report.messages.length > 0) {
      messageSection.style.display = "block";
      listMessages.innerHTML = report.messages
        .map((m) => `
        <div class="activity-strip" style="margin-bottom:8px">
          <div class="activity-strip-info">
            <span style="font-size:10px; color:var(--accent-orange)">OFFICER REQUEST [${m.date}]</span>
            <p style="margin:4px 0 0; color:#fff; font-size:13px">${m.text}</p>
          </div>
        </div>
      `)
        .join("");
    } else {
      messageSection.style.display = "none";
    }

    // Upload more evidence event bindings
    document.getElementById("det-add-evidence-btn").onclick = () => {
      // simulate upload additional evidence
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = () => {
        if (input.files.length) {
          report.evidenceCount += 1;
          report.timeline.push({
            date: new Date().toISOString().slice(0, 16).replace("T", " "),
            title: "Additional Evidence Uploaded",
            desc: `File ${input.files[0].name} logged successfully.`
          });
          showToast(`File ${input.files[0].name} uploaded to evidence pool.`, "success");
          renderReportDetailScreen();
        }
      };
      input.click();
    };

    document.getElementById("det-withdraw-btn").onclick = () => {
      if (confirm("Are you sure you want to withdraw this complaint? This action is irreversible.")) {
        report.status = "closed";
        report.timeline.push({
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          title: "Complaint Withdrawn",
          desc: "Citizen requested withdrawal of complaint logs."
        });
        showToast("Complaint withdrawn successfully.", "warning");
        renderReportDetailScreen();
      }
    };
  }

  // WIZARD FOR REPORT CREATION
  function openReportWizard() {
    document.getElementById("reports-list-screen").style.display = "none";
    document.getElementById("reports-create-screen").style.display = "block";

    let step = 1;
    const totalSteps = 5;

    function renderStep() {
      // Steppers node statuses
      for (let i = 1; i <= totalSteps; i++) {
        const node = document.getElementById(`report-step-node-${i}`);
        node.classList.toggle("active", i === step);
        node.classList.toggle("completed", i < step);
      }

      // Stepper visibility
      document.querySelectorAll("[data-report-step]").forEach((el) => {
        el.style.display = Number(el.dataset.reportStep) === step ? "block" : "none";
      });

      // Hide or show controls
      document.getElementById("wizard-prev-btn").style.visibility = step === 1 ? "hidden" : "visible";
      document.getElementById("wizard-next-btn").textContent = step === totalSteps ? "Submit Report" : "Next Step";
    }

    renderStep();

    // Category options bindings
    const catGrid = document.getElementById("wizard-categories-grid");
    catGrid.innerHTML = window.CyberNetraMockData.incidentTypes
      .map((c) => `<button type="button" class="select-pill-btn" data-category="${c.value}">${c.label}</button>`)
      .join("");

    let selectedCategory = "";
    catGrid.querySelectorAll(".select-pill-btn").forEach((btn) => {
      btn.onclick = () => {
        catGrid.querySelectorAll(".select-pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCategory = btn.dataset.category;
      };
    });

    // Evidence file lists mock
    const fileLists = document.getElementById("wizard-evidence-list");
    fileLists.innerHTML = "";
    let uploadedFilesCount = 0;

    document.getElementById("wizard-file-zone").onclick = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = () => {
        if (input.files.length) {
          uploadedFilesCount += 1;
          const strip = document.createElement("div");
          strip.className = "evidence-upload-strip";
          strip.innerHTML = `
            <span><i class="fa-solid fa-file-image"></i> ${input.files[0].name} (${(input.files[0].size / 1024).toFixed(1)} KB)</span>
            <button class="btn btn-ghost" onclick="this.parentElement.remove();"><i class="fa-solid fa-trash red"></i></button>
          `;
          fileLists.appendChild(strip);
        }
      };
      input.click();
    };

    // Form inputs gathering for preview
    function compileSummary() {
      document.getElementById("preview-cat").textContent = selectedCategory ? selectedCategory.toUpperCase().replace("-", " ") : "Not Selected";
      document.getElementById("preview-suspect").textContent = document.getElementById("incident-suspect-username").value || "Unknown";
      document.getElementById("preview-desc").textContent = document.getElementById("incident-statement").value || "None";
    }

    // Step navigators
    document.getElementById("wizard-prev-btn").onclick = () => {
      if (step > 1) {
        step -= 1;
        renderStep();
      }
    };

    document.getElementById("wizard-next-btn").onclick = async () => {
      if (step === 1 && !selectedCategory) {
        showToast("Please select an incident type category.", "warning");
        return;
      }

      if (step === 3 && !document.getElementById("incident-statement").value.trim()) {
        showToast("Please provide details of the incident.", "warning");
        return;
      }

      if (step < totalSteps) {
        step += 1;
        if (step === 4) compileSummary();
        renderStep();
      } else {
        // Step 5: Submit API calls
        const consent = document.getElementById("consent-declaration").checked;
        if (!consent) {
          showToast("You must declare and consent to the privacy guidelines.", "warning");
          return;
        }

        const details = {
          category: selectedCategory,
          username: document.getElementById("incident-suspect-username").value,
          profileUrl: document.getElementById("incident-suspect-url").value,
          description: document.getElementById("incident-statement").value,
          evidenceCount: uploadedFilesCount
        };

        const res = await services.createReport(details);
        if (res.ok) {
          playNotificationBeep();
          showToast("Complaint registered successfully.", "success");

          // Render Success screen content
          document.getElementById("created-ref-number").textContent = res.referenceNumber;
          step = 5;
          renderStep();

          // Successful controls
          document.getElementById("wizard-receipt-btn").onclick = () => {
            showToast("Receipt document download completed.", "success");
          };
          document.getElementById("wizard-finish-btn").onclick = () => {
            switchTab("my-reports");
          };
        }
      }
    };
  }

  // 6. CYBER ALERTS CARD LAYOUT
  async function initCyberAlertsPanel() {
    const container = document.getElementById("alerts-grid-container");
    if (!container) return;

    const response = await services.getCyberAlerts();
    if (!response.ok) return;

    const alerts = response.alerts;

    // Filter categories bindings
    const filterContainer = document.getElementById("alerts-filters-row");
    filterContainer.innerHTML = `
      <button class="select-pill-btn active" data-alert-filter="all">All Alerts</button>
      <button class="select-pill-btn" data-alert-filter="critical">Critical Only</button>
      <button class="select-pill-btn" data-alert-filter="identity-theft">Identity Theft</button>
      <button class="select-pill-btn" data-alert-filter="deepfakes">Deepfakes</button>
      <button class="select-pill-btn" data-alert-filter="job-scams">Job Scams</button>
    `;

    function renderFilteredAlerts(filterType) {
      let filtered = alerts;
      if (filterType === "critical") {
        filtered = alerts.filter((a) => a.severity === "critical");
      } else if (filterType !== "all") {
        filtered = alerts.filter((a) => a.category === filterType);
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state-card" style="grid-column: span 3">
            <i class="fa-solid fa-magnifying-glass"></i>
            <h4>No alerts found.</h4>
            <p>We haven't logged any current alerts for this filter.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered
        .map((alert) => {
          const badgeClass = alert.severity === "critical" ? "badge-red" : alert.severity === "high" ? "badge-orange" : "badge-green";
          return `
          <div class="alert-item-card">
            <div class="alert-card-meta">
              <span class="badge ${badgeClass}">${alert.severity.toUpperCase()}</span>
              <span>${alert.date}</span>
            </div>
            <h4>${alert.title}</h4>
            <p>${alert.summary}</p>
            <button class="btn btn-primary btn-sm btn-block" onclick="window.viewAlertDetail('${alert.id}')">Read Full Alert</button>
          </div>
        `;
        })
        .join("");
    }

    renderFilteredAlerts("all");

    filterContainer.querySelectorAll(".select-pill-btn").forEach((btn) => {
      btn.onclick = () => {
        filterContainer.querySelectorAll(".select-pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderFilteredAlerts(btn.dataset.alertFilter);
      };
    });
  }

  // Alert detailed modal popups
  window.viewAlertDetail = function (alertId) {
    const alerts = window.CyberNetraMockData.alerts;
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    document.getElementById("alert-det-title").textContent = alert.title;
    document.getElementById("alert-det-date").textContent = `Published: ${alert.date} | Category: ${alert.category.toUpperCase()}`;
    document.getElementById("alert-det-desc").textContent = alert.description;

    // Warning signs
    const signsList = document.getElementById("alert-det-warnings");
    signsList.innerHTML = alert.warningSigns.map((s) => `<li>${s}</li>`).join("");

    // Recommended Actions
    const actionsList = document.getElementById("alert-det-actions");
    actionsList.innerHTML = alert.recommendedActions.map((a) => `<li>${a}</li>`).join("");

    document.getElementById("alert-det-source").textContent = alert.officialSource;

    openModal("alert-detail-modal");

    document.getElementById("alert-det-action-share").onclick = () => {
      navigator.clipboard.writeText(window.location.href);
      showToast("Alert link copied to clipboard.", "success");
    };
  };

  // 7. SAFETY HUB EDUCATIONAL
  async function initSafetyHubPanel() {
    const resources = await services.getSafetyResources();
    if (!resources.ok) return;

    // Render Articles list
    const articlesBox = document.getElementById("safety-articles-container");
    if (articlesBox) {
      articlesBox.innerHTML = resources.articles
        .map((art) => `
        <div class="safety-resource-card">
          <span class="badge badge-cyan" style="width:fit-content">${art.category.toUpperCase()}</span>
          <h4>${art.title}</h4>
          <p>${art.summary}</p>
          <button class="btn btn-secondary btn-sm" onclick="window.readSafetyArticle('${art.id}')">Read Lesson</button>
        </div>
      `)
        .join("");
    }

    // Render Quiz cards
    const quizBox = document.getElementById("safety-quiz-container");
    if (quizBox) {
      const quiz = resources.quizzes[0];
      quizBox.innerHTML = `
        <div class="safety-resource-card" style="border-color: var(--accent)">
          <span class="badge badge-orange" style="width:fit-content">INTERACTIVE CHALLENGE</span>
          <h4>${quiz.title}</h4>
          <div id="quiz-question-box">
            <!-- Questions populated dynamically -->
          </div>
        </div>
      `;

      let currentQuestionIdx = 0;
      let score = 0;

      function renderQuestion() {
        const qBox = document.getElementById("quiz-question-box");
        const qData = quiz.questions[currentQuestionIdx];

        qBox.innerHTML = `
          <p style="margin: 12px 0 16px; color:#fff; font-weight:600">Question ${currentQuestionIdx + 1}/${quiz.questions.length}: ${qData.q}</p>
          <div class="quiz-options-list">
            ${qData.options
              .map((opt, idx) => `<button type="button" class="quiz-option-button" data-option-idx="${idx}">${opt}</button>`)
              .join("")}
          </div>
        `;

        qBox.querySelectorAll(".quiz-option-button").forEach((btn) => {
          btn.onclick = () => {
            const chosen = Number(btn.dataset.optionIdx);
            const buttons = qBox.querySelectorAll(".quiz-option-button");

            buttons.forEach((b) => {
              b.disabled = true;
              const idx = Number(b.dataset.optionIdx);
              if (idx === qData.correct) b.classList.add("correct");
              else if (idx === chosen) b.classList.add("wrong");
            });

            if (chosen === qData.correct) {
              score += 1;
              playNotificationBeep("success");
            } else {
              playNotificationBeep("error");
            }

            // delay & next
            setTimeout(() => {
              currentQuestionIdx += 1;
              if (currentQuestionIdx < quiz.questions.length) {
                renderQuestion();
              } else {
                qBox.innerHTML = `
                  <div class="empty-state-card" style="padding:16px">
                    <i class="fa-solid fa-award green"></i>
                    <h4>Challenge Completed!</h4>
                    <p>You scored ${score} out of ${quiz.questions.length} questions correctly.</p>
                    <button class="btn btn-primary btn-sm" id="quiz-retry-btn">Retry Quiz</button>
                  </div>
                `;
                document.getElementById("quiz-retry-btn").onclick = () => {
                  currentQuestionIdx = 0;
                  score = 0;
                  renderQuestion();
                };
              }
            }, 2000);
          };
        });
      }

      renderQuestion();
    }
  }

  // Safety article detailed reader
  window.readSafetyArticle = function (id) {
    const articles = window.CyberNetraMockData.safetyArticles;
    const art = articles.find((a) => a.id === id);
    if (!art) return;

    document.getElementById("art-det-title").textContent = art.title;
    document.getElementById("art-det-category").textContent = `Category: ${art.category.toUpperCase()}`;
    document.getElementById("art-det-body").textContent = art.content;

    openModal("article-detail-modal");
  };

  // 8. SAVED & WATCHLIST TABS
  async function initSavedWatchlistPanel() {
    const listRes = await services.getWatchlist();
    if (!listRes.ok) return;

    // Render Watchlist items
    const wlContainer = document.getElementById("watchlist-items-container");
    if (wlContainer) {
      if (listRes.watchlist.length === 0) {
        wlContainer.innerHTML = `
          <div class="empty-state-card">
            <i class="fa-solid fa-eye-slash"></i>
            <h4>Watchlist is empty.</h4>
            <p>Add suspicious profiles from scan results to monitor activity changes.</p>
          </div>
        `;
      } else {
        wlContainer.innerHTML = listRes.watchlist
          .map((item) => `
          <div class="watchlist-widget-item">
            <div class="wl-widget-identity">
              <i class="fa-brands fa-${item.platform} wl-widget-logo-platform"></i>
              <strong>@${item.username}</strong>
            </div>
            <div class="wl-widget-scores">
              <span class="badge badge-muted">Prev: ${item.prevScore}%</span>
              <span class="badge badge-red">Curr: ${item.currScore}%</span>
            </div>
            <div style="font-size:12px; color:var(--accent-orange); flex:1; margin-left: 20px">${item.statusChange}</div>
            <button class="btn btn-ghost" onclick="window.removeWatchlistItem('${item.id}')"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `)
          .join("");
      }
    }

    // Render Saved scan results lists
    const savedContainer = document.getElementById("saved-scans-container");
    if (savedContainer) {
      const scans = window.CyberNetraMockData.profileScans;
      if (scans.length === 0) {
        savedContainer.innerHTML = `
          <div class="empty-state-card">
            <i class="fa-solid fa-floppy-disk"></i>
            <h4>No saved scans found.</h4>
            <p>Save scan records to view offline evidence summaries.</p>
          </div>
        `;
      } else {
        savedContainer.innerHTML = scans
          .map((scan) => `
          <div class="watchlist-widget-item">
            <div class="wl-widget-identity">
              <i class="fa-brands fa-${scan.platform} wl-widget-logo-platform"></i>
              <strong>SCAN: @${scan.username}</strong>
            </div>
            <span class="badge badge-red">${scan.riskScore}% RISK</span>
            <span>Date: ${scan.date}</span>
            <button class="btn btn-primary btn-sm" onclick="window.viewActivityDetails('profile', '${scan.id}')">View</button>
          </div>
        `)
          .join("");
      }
    }
  }

  // Remove watchlist item handler
  window.removeWatchlistItem = function (id) {
    const list = window.CyberNetraMockData.watchlist;
    window.CyberNetraMockData.watchlist = list.filter((w) => w.id !== id);
    showToast("Profile removed from watchlist.", "warning");
    initSavedWatchlistPanel();
  };

  // 9. NOTIFICATIONS CONTROL CENTER
  async function initNotifications() {
    const response = await services.getNotifications();
    if (!response.ok) return;

    notificationsList = response.notifications;
    unreadNotificationsCount = notificationsList.filter((n) => n.unread).length;

    // Header bell icon badge
    const badge = document.getElementById("notifications-badge");
    if (badge) {
      if (unreadNotificationsCount > 0) {
        badge.style.display = "flex";
        badge.textContent = unreadNotificationsCount;
      } else {
        badge.style.display = "none";
      }
    }

    // Notification dropdown header list popup
    const headerList = document.getElementById("header-notifications-list");
    if (headerList) {
      if (notificationsList.length === 0) {
        headerList.innerHTML = `<div style="padding: 16px; text-align:center; color:var(--text-muted); font-size:12px">No notifications.</div>`;
      } else {
        headerList.innerHTML = notificationsList
          .slice(0, 4)
          .map((n) => `
          <div class="dropdown-item ${n.unread ? "unread-notif-item" : ""}" onclick="window.readNotification('${n.id}')" style="cursor:pointer; display:flex; flex-direction:column; align-items:flex-start; gap:4px; border-bottom: 1px solid rgba(255,255,255,0.04)">
            <strong style="color: #fff; font-size:12.5px">${n.title}</strong>
            <p style="margin:0; font-size:11px; color:var(--text-muted); line-height:1.4">${n.text}</p>
            <span style="font-size:9px; color:var(--accent-cyan)">${n.date}</span>
          </div>
        `)
          .join("");
      }
    }

    // Full Notifications center screen view panel
    const listScreen = document.getElementById("notifications-center-list");
    if (listScreen && currentView === "notifications") {
      if (notificationsList.length === 0) {
        listScreen.innerHTML = `
          <div class="empty-state-card">
            <i class="fa-solid fa-bell-slash"></i>
            <h4>Your notification box is empty.</h4>
          </div>
        `;
        return;
      }

      listScreen.innerHTML = notificationsList
        .map((n) => {
          return `
          <div class="activity-strip ${n.unread ? "unread-notif-strip" : ""}" style="border-left: 3px solid ${n.unread ? "var(--accent)" : "transparent"}; margin-bottom:10px">
            <div class="activity-strip-info">
              <h5>${n.title}</h5>
              <p style="margin:4px 0 0; color:var(--text-muted); font-size:13px">${n.text}</p>
              <span style="font-size:10px; margin-top:4px; display:inline-block">${n.date}</span>
            </div>
            <div>
              ${n.unread ? `<button class="btn btn-outline btn-sm" onclick="window.readNotification('${n.id}')">Mark Read</button>` : ""}
              <button class="btn btn-ghost btn-sm" onclick="window.deleteNotification('${n.id}')"><i class="fa-solid fa-trash red"></i></button>
            </div>
          </div>
        `;
        })
        .join("");
    }
  }

  // Mark notification read handler
  window.readNotification = function (id) {
    const notif = notificationsList.find((n) => n.id === id);
    if (notif) {
      notif.unread = false;
      showToast("Notification marked as read.", "success");
      initNotifications();

      // If it points to an active report or alert, redirect
      if (notif.type === "complaint-status") {
        viewActivityDetails("report", notif.refId);
      } else if (notif.type === "cyber-alert") {
        window.viewAlertDetail(notif.refId);
      } else if (notif.type === "watchlist-change") {
        switchTab("saved-watchlist");
      }
    }
  };

  // Delete notification
  window.deleteNotification = function (id) {
    window.CyberNetraMockData.notifications = window.CyberNetraMockData.notifications.filter((n) => n.id !== id);
    showToast("Notification deleted.", "warning");
    initNotifications();
  };

  // Mark all notifications read
  document.getElementById("btn-mark-all-read").onclick = () => {
    window.CyberNetraMockData.notifications.forEach((n) => (n.unread = false));
    showToast("All notifications marked as read.", "success");
    initNotifications();
  };

  // 9. PROFILE & SETTINGS FORMS
  function initSettingsPanel() {
    const user = window.CyberNetraMockData.userProfile;

    // Load Personal Information
    document.getElementById("sett-full-name").value = user.name;
    document.getElementById("sett-email").value = user.email;
    document.getElementById("sett-mobile").value = user.mobile;
    document.getElementById("sett-state").value = user.state;
    document.getElementById("sett-district").value = user.district;

    const langSelect = document.getElementById("sett-language");
    langSelect.innerHTML = Object.entries(window.CyberNetraMockData.languages)
      .map(([key, val]) => `<option value="${key}" ${key === user.language ? "selected" : ""}>${val}</option>`)
      .join("");

    const profileForm = document.getElementById("settings-profile-form");
    profileForm.onsubmit = async (e) => {
      e.preventDefault();
      const updated = {
        name: document.getElementById("sett-full-name").value.trim(),
        email: document.getElementById("sett-email").value.trim(),
        state: document.getElementById("sett-state").value,
        district: document.getElementById("sett-district").value,
        language: langSelect.value
      };
      await services.updateUserSettings(updated);
      showToast("Profile details updated successfully.", "success");
      switchTab("overview");
    };

    // Delete accounts privacy warning toggles
    document.getElementById("sett-btn-delete-data").onclick = () => {
      if (confirm("Download backup? All stored analyses, media scans and saved watchlist logs will be erased.")) {
        window.CyberNetraMockData.profileScans = [];
        window.CyberNetraMockData.mediaScans = [];
        window.CyberNetraMockData.watchlist = [];
        showToast("All uploaded scans and personal intelligence data purged successfully.", "warning");
        switchTab("overview");
      }
    };
  }
})();
