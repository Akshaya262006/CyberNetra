(function () {
  const root = document.createElement("div");
  root.id = "auth-modal-root";
  document.body.appendChild(root);

  function closeModal() {
    root.innerHTML = "";
    document.body.classList.remove("auth-modal-open");
  }

  function openModal(content) {
    root.innerHTML = `
      <div class="auth-overlay" data-close-modal>
        <section class="auth-modal" role="dialog" aria-modal="true" aria-label="Cyber Netra authentication">
          <button class="auth-close" type="button" aria-label="Close" data-close-modal>&times;</button>
          ${content}
        </section>
      </div>
    `;
    document.body.classList.add("auth-modal-open");
    const firstControl = root.querySelector("button, input, a");
    if (firstControl) firstControl.focus();
  }

  function loginTemplate() {
    return `
      <div class="single-login">
        <div class="login-panel">
          <div class="login-role-tabs" role="tablist" aria-label="Login role">
            <button class="is-active" type="button" role="tab" aria-selected="true" data-login-role="public">Public</button>
            <button type="button" role="tab" aria-selected="false" data-login-role="police">Police</button>
          </div>

          <div class="auth-heading compact-heading">
            <span class="auth-eyebrow">Secure Access</span>
            <h2 data-login-title>Public Login</h2>
            <p data-login-copy>Access your citizen dashboard, profile checks, media verification and cybercrime reports.</p>
          </div>

          <form class="auth-form" id="modal-login-form" novalidate>
            <label class="auth-field" for="modal-identifier">
              <span data-identifier-label>Mobile Number</span>
              <span class="auth-input-wrap">
                <span class="auth-icon" aria-hidden="true" data-identifier-icon>TEL</span>
                <span class="auth-prefix" data-country-prefix>+91</span>
                <input id="modal-identifier" data-mobile type="tel" inputmode="numeric" autocomplete="tel" maxlength="10" placeholder="9876543210">
              </span>
              <span class="auth-error" data-error-for="identifier"></span>
            </label>

            <label class="auth-field" for="modal-password">Password
              <span class="auth-input-wrap">
                <input id="modal-password" type="password" autocomplete="current-password" placeholder="Enter password">
                <button class="password-toggle" type="button" data-modal-password-toggle="modal-password">Show</button>
              </span>
              <span class="auth-error" data-error-for="password"></span>
            </label>

            <p class="auth-warning police-only" hidden>Authorized personnel only. Access attempts may be logged and audited.</p>
            <span class="auth-error" data-error-for="form"></span>

            <button class="auth-btn auth-btn-primary login-submit" type="submit" data-login-submit>Log In</button>

            <div class="auth-link-row public-only">
              <a class="auth-link" href="forgot-password/">Forgot Password?</a>
              <a class="auth-link" href="signup/" data-open-signup>New user? Sign In</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function signupTemplate() {
    return `
      <div class="single-login signup-popup">
        <div class="login-panel">
          <div class="auth-heading compact-heading">
            <span class="auth-eyebrow" data-signup-step-label>Step 1</span>
            <h2 data-signup-title>Create Your Cyber Netra Account</h2>
            <p data-signup-copy>Enter your mobile number to begin.</p>
          </div>

          <div data-modal-signup-step="mobile">
            <form class="auth-form" id="modal-mobile-step-form" novalidate>
              <label class="auth-field" for="modal-signup-mobile">Mobile Number
                <span class="auth-input-wrap">
                  <span class="auth-icon" aria-hidden="true">TEL</span>
                  <span class="auth-prefix">+91</span>
                  <input id="modal-signup-mobile" data-mobile type="tel" inputmode="numeric" autocomplete="tel" maxlength="10" placeholder="9876543210">
                </span>
                <span class="auth-error" data-error-for="signup-mobile"></span>
              </label>

              <button class="auth-btn auth-btn-primary login-submit" id="modal-send-otp" type="submit" disabled>Send OTP</button>
              <div class="auth-link-row">
                <a class="auth-link" href="login/public/" data-open-login>Already have an account? Login</a>
              </div>
            </form>
          </div>

          <div data-modal-signup-step="otp" hidden>
            <form class="auth-form" id="modal-otp-step-form" novalidate>
              <div class="otp-grid" aria-label="Enter six digit OTP">
                <input data-modal-otp-box type="text" inputmode="numeric" maxlength="1" aria-label="OTP digit 1">
                <input data-modal-otp-box type="text" inputmode="numeric" maxlength="1" aria-label="OTP digit 2">
                <input data-modal-otp-box type="text" inputmode="numeric" maxlength="1" aria-label="OTP digit 3">
                <input data-modal-otp-box type="text" inputmode="numeric" maxlength="1" aria-label="OTP digit 4">
                <input data-modal-otp-box type="text" inputmode="numeric" maxlength="1" aria-label="OTP digit 5">
                <input data-modal-otp-box type="text" inputmode="numeric" maxlength="1" aria-label="OTP digit 6">
              </div>
              <span class="auth-error" data-error-for="signup-otp"></span>
              <p class="modal-helper">OTP sent to <span id="modal-masked-mobile">+91 XXXXX XX000</span>. Resend available in <span id="modal-resend-countdown">30s</span>.</p>
              <div class="auth-actions">
                <button class="auth-btn auth-btn-primary" type="submit">Verify OTP</button>
                <button class="auth-secondary" id="modal-change-mobile" type="button">Change Mobile Number</button>
              </div>
            </form>
          </div>

          <div data-modal-signup-step="password" hidden>
            <form class="auth-form" id="modal-password-step-form" novalidate>
              <label class="auth-field" for="modal-new-password">Create Password
                <span class="auth-input-wrap">
                  <input id="modal-new-password" type="password" autocomplete="new-password">
                  <button class="password-toggle" type="button" data-modal-signup-password-toggle="modal-new-password">Show</button>
                </span>
              </label>
              <label class="auth-field" for="modal-confirm-password">Confirm Password
                <span class="auth-input-wrap">
                  <input id="modal-confirm-password" type="password" autocomplete="new-password">
                  <button class="password-toggle" type="button" data-modal-signup-password-toggle="modal-confirm-password">Show</button>
                </span>
              </label>
              <div class="strength" id="modal-password-strength"><span></span></div>
              <p class="modal-helper">Password strength: <strong id="modal-password-strength-label">Weak</strong></p>
              <ul class="checklist" id="modal-password-checklist">
                <li data-check="length">Minimum 8 characters</li>
                <li data-check="upper">One uppercase letter</li>
                <li data-check="lower">One lowercase letter</li>
                <li data-check="number">One number</li>
                <li data-check="special">One special character</li>
                <li data-check="match">Passwords match</li>
              </ul>
              <button class="auth-btn auth-btn-primary login-submit" id="modal-create-account" type="submit" disabled>Create Account</button>
            </form>
          </div>

          <div data-modal-signup-step="success" hidden>
            <div class="success-mark">✓</div>
            <div class="auth-heading compact-heading">
              <span class="auth-eyebrow">Step 4</span>
              <h2>Account Created Successfully</h2>
              <p>Your mobile number has been verified and your Cyber Netra account is ready.</p>
            </div>
            <a class="auth-btn auth-btn-primary login-submit" href="public/dashboard/">Continue to Dashboard</a>
          </div>
        </div>
      </div>
    `;
  }

  function setError(name, message) {
    const target = root.querySelector(`[data-error-for="${name}"]`);
    if (target) target.textContent = message || "";
  }

  function clearLoginErrors() {
    root.querySelectorAll("[data-error-for]").forEach((item) => {
      item.textContent = "";
    });
  }

  function setSignupHeader(step) {
    const label = root.querySelector("[data-signup-step-label]");
    const title = root.querySelector("[data-signup-title]");
    const copy = root.querySelector("[data-signup-copy]");
    const content = {
      mobile: ["Step 1", "Create Your Cyber Netra Account", "Enter your mobile number to begin."],
      otp: ["Step 2", "Verify Your Mobile Number", "Enter the 6-digit OTP sent to your mobile number."],
      password: ["Step 3", "Create a Secure Password", "Use a strong password for your Cyber Netra account."],
      success: ["Step 4", "Account Created Successfully", "Your mobile number has been verified and your Cyber Netra account is ready."]
    }[step];
    if (!content || !label || !title || !copy) return;
    label.textContent = content[0];
    title.textContent = content[1];
    copy.textContent = content[2];
  }

  function showSignupStep(step) {
    root.querySelectorAll("[data-modal-signup-step]").forEach((item) => {
      item.hidden = item.dataset.modalSignupStep !== step;
    });
    setSignupHeader(step);
  }

  function modalOtpValue() {
    return Array.from(root.querySelectorAll("[data-modal-otp-box]")).map((input) => input.value).join("");
  }

  function startModalCountdown(seconds) {
    const target = root.querySelector("#modal-resend-countdown");
    let remaining = seconds;
    if (!target) return;
    target.textContent = `${remaining}s`;
    const timer = setInterval(() => {
      if (!root.contains(target)) {
        clearInterval(timer);
        return;
      }
      remaining -= 1;
      target.textContent = remaining > 0 ? `${remaining}s` : "now";
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
  }

  function renderModalPasswordChecklist(password, confirm) {
    const status = window.CyberNetraAuth.passwordStatus(password);
    const checklist = root.querySelector("#modal-password-checklist");
    if (checklist) {
      Object.entries(status.checks).forEach(([key, value]) => {
        const item = checklist.querySelector(`[data-check="${key}"]`);
        if (item) item.classList.toggle("is-valid", value);
      });
      const matchItem = checklist.querySelector('[data-check="match"]');
      if (matchItem) matchItem.classList.toggle("is-valid", Boolean(password) && password === confirm);
    }
    const strength = root.querySelector("#modal-password-strength");
    const label = root.querySelector("#modal-password-strength-label");
    if (strength) strength.className = `strength is-${status.label.toLowerCase()}`;
    if (label) label.textContent = status.label;
    return status;
  }

  function updateLoginRole(role) {
    const isPublic = role === "public";
    const identifier = root.querySelector("#modal-identifier");
    const title = root.querySelector("[data-login-title]");
    const copy = root.querySelector("[data-login-copy]");
    const label = root.querySelector("[data-identifier-label]");
    const icon = root.querySelector("[data-identifier-icon]");
    const prefix = root.querySelector("[data-country-prefix]");
    const submit = root.querySelector("[data-login-submit]");

    root.querySelectorAll("[data-login-role]").forEach((button) => {
      const selected = button.dataset.loginRole === role;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });

    root.querySelectorAll(".public-only").forEach((item) => {
      item.hidden = !isPublic;
    });
    root.querySelectorAll(".police-only").forEach((item) => {
      item.hidden = isPublic;
    });

    title.textContent = isPublic ? "Public Login" : "Police Login";
    copy.textContent = isPublic
      ? "Access your citizen dashboard, profile checks, media verification and cybercrime reports."
      : "Restricted access for authorized police officers and cybercrime investigators.";
    label.textContent = isPublic ? "Mobile Number" : "Registered mobile number or official user ID";
    icon.textContent = isPublic ? "TEL" : "ID";
    prefix.hidden = !isPublic;
    submit.textContent = isPublic ? "Log In" : "Secure Login";

    identifier.value = "";
    identifier.type = isPublic ? "tel" : "text";
    identifier.placeholder = isPublic ? "9876543210" : "9123456780 or POLICE-CN-001";
    identifier.toggleAttribute("data-mobile", isPublic);
    identifier.inputMode = isPublic ? "numeric" : "text";
    identifier.maxLength = isPublic ? 10 : 32;
    root.querySelector("#modal-password").value = "";
    root.querySelector("#modal-login-form").dataset.role = role;
    clearLoginErrors();
  }

  function attachLoginHandlers() {
    const form = root.querySelector("#modal-login-form");
    if (!form) return;

    updateLoginRole("public");

    root.querySelectorAll("[data-login-role]").forEach((button) => {
      button.addEventListener("click", () => updateLoginRole(button.dataset.loginRole));
    });

    const identifier = root.querySelector("#modal-identifier");
    identifier.addEventListener("input", () => {
      if (form.dataset.role === "public") {
        identifier.value = window.CyberNetraAuth.onlyDigits(identifier.value).slice(0, 10);
      }
    });

    root.querySelector("[data-modal-password-toggle]").addEventListener("click", (event) => {
      const password = root.querySelector(`#${event.currentTarget.dataset.modalPasswordToggle}`);
      password.type = password.type === "password" ? "text" : "password";
      event.currentTarget.textContent = password.type === "password" ? "Show" : "Hide";
    });

    root.querySelectorAll("[data-open-signup]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(signupTemplate());
        attachSignupHandlers();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearLoginErrors();
      const role = form.dataset.role || "public";
      const value = identifier.value.trim();
      const password = root.querySelector("#modal-password").value;
      let valid = true;

      if (role === "public" && !window.CyberNetraAuth.isValidMobile(value)) {
        setError("identifier", "Enter exactly 10 digits.");
        valid = false;
      }
      if (role === "police" && !value) {
        setError("identifier", "Enter registered mobile number or official user ID.");
        valid = false;
      }
      if (!password) {
        setError("password", "Enter your password.");
        valid = false;
      }
      if (!valid) return;

      const result = role === "public"
        ? window.CyberNetraAuth.loginPublic(value, password)
        : window.CyberNetraAuth.loginPolice(value, password);

      if (!result.ok) {
        setError("form", result.message);
        return;
      }

      window.location.href = role === "public" ? "public/dashboard/" : "police/dashboard/";
    });
  }

  function attachSignupHandlers() {
    let mobile = "";
    let otpVerified = false;
    const auth = window.CyberNetraAuth;
    const mobileInput = root.querySelector("#modal-signup-mobile");
    const sendButton = root.querySelector("#modal-send-otp");

    showSignupStep("mobile");

    root.querySelectorAll("[data-open-login]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(loginTemplate());
        attachLoginHandlers();
      });
    });

    mobileInput.addEventListener("input", () => {
      mobileInput.value = auth.onlyDigits(mobileInput.value).slice(0, 10);
      sendButton.disabled = !auth.isValidMobile(mobileInput.value);
      setError("signup-mobile", "");
    });

    root.querySelector("#modal-mobile-step-form").addEventListener("submit", (event) => {
      event.preventDefault();
      mobile = mobileInput.value;
      if (!auth.isValidMobile(mobile)) {
        setError("signup-mobile", "Enter exactly 10 digits.");
        return;
      }
      sendButton.disabled = true;
      sendButton.textContent = "Sending...";
      setTimeout(() => {
        if (!root.querySelector("#modal-mobile-step-form")) return;
        sendButton.textContent = "Send OTP";
        sendButton.disabled = false;
        root.querySelector("#modal-masked-mobile").textContent = `+91 XXXXX XX${mobile.slice(-3)}`;
        showSignupStep("otp");
        startModalCountdown(30);
        const firstOtp = root.querySelector("[data-modal-otp-box]");
        if (firstOtp) firstOtp.focus();
      }, 350);
    });

    root.querySelectorAll("[data-modal-otp-box]").forEach((input, index, items) => {
      input.addEventListener("input", () => {
        input.value = auth.onlyDigits(input.value).slice(0, 1);
        if (input.value && items[index + 1]) items[index + 1].focus();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && items[index - 1]) items[index - 1].focus();
      });
      input.addEventListener("paste", (event) => {
        event.preventDefault();
        const digits = auth.onlyDigits(event.clipboardData.getData("text")).slice(0, 6);
        digits.split("").forEach((digit, pasteIndex) => {
          if (items[pasteIndex]) items[pasteIndex].value = digit;
        });
        if (items[Math.min(digits.length, 5)]) items[Math.min(digits.length, 5)].focus();
      });
    });

    root.querySelector("#modal-otp-step-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!auth.verifyOtp(modalOtpValue())) {
        setError("signup-otp", "Invalid OTP. Use 123456 for the demo.");
        return;
      }
      setError("signup-otp", "");
      otpVerified = true;
      showSignupStep("password");
    });

    root.querySelector("#modal-change-mobile").addEventListener("click", () => {
      showSignupStep("mobile");
    });

    root.querySelectorAll("[data-modal-signup-password-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = root.querySelector(`#${button.dataset.modalSignupPasswordToggle}`);
        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
      });
    });

    const password = root.querySelector("#modal-new-password");
    const confirm = root.querySelector("#modal-confirm-password");
    const createButton = root.querySelector("#modal-create-account");
    function updatePasswordState() {
      const status = renderModalPasswordChecklist(password.value, confirm.value);
      createButton.disabled = !(otpVerified && status.valid && password.value === confirm.value);
    }
    password.addEventListener("input", updatePasswordState);
    confirm.addEventListener("input", updatePasswordState);

    root.querySelector("#modal-password-step-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (createButton.disabled) return;
      auth.registerPublic(mobile, password.value);
      showSignupStep("success");
    });
  }

  function attachCloseHandlers() {
    root.addEventListener("click", (event) => {
      if (event.target.matches("[data-close-modal]")) closeModal();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && root.innerHTML) closeModal();
    });
  }

  document.addEventListener("cybernetra:action", (event) => {
    if (event.detail.action === "Login") {
      openModal(loginTemplate());
      attachLoginHandlers();
    }
    if (event.detail.action === "Sign In") {
      openModal(signupTemplate());
      attachSignupHandlers();
    }
  });

  attachCloseHandlers();
})();
