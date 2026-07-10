(function () {
  const auth = window.CyberNetraAuth;
  const page = document.body.dataset.authPage;

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function setError(form, name, message) {
    const target = qs(`[data-error-for="${name}"]`, form);
    if (target) target.textContent = message || "";
  }

  function clearErrors(form) {
    qsa("[data-error-for]", form).forEach((item) => {
      item.textContent = "";
    });
  }

  function wirePasswordToggles(scope = document) {
    qsa("[data-password-toggle]", scope).forEach((button) => {
      button.addEventListener("click", () => {
        const input = qs(`#${button.dataset.passwordToggle}`);
        if (!input) return;
        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
      });
    });
  }

  function wireMobileLimit(scope = document) {
    qsa("[data-mobile]", scope).forEach((input) => {
      input.addEventListener("input", () => {
        input.value = auth.onlyDigits(input.value).slice(0, 10);
      });
    });
  }

  function showLoading(button, label) {
    const previous = button.textContent;
    button.disabled = true;
    button.textContent = label || "Please wait...";
    return () => {
      button.disabled = false;
      button.textContent = previous;
    };
  }

  function initPublicLogin() {
    const form = qs("#public-login-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);
      const mobile = qs("#mobile", form).value;
      const password = qs("#password", form).value;
      let valid = true;
      if (!auth.isValidMobile(mobile)) {
        setError(form, "mobile", "Enter exactly 10 digits.");
        valid = false;
      }
      if (!password) {
        setError(form, "password", "Enter your password.");
        valid = false;
      }
      if (!valid) return;
      const result = auth.loginPublic(mobile, password);
      if (!result.ok) {
        setError(form, "form", result.message);
        return;
      }
      window.location.href = "../../public/dashboard/";
    });
  }

  function initPoliceLogin() {
    const form = qs("#police-login-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);
      const identifier = qs("#identifier", form).value.trim();
      const password = qs("#password", form).value;
      let valid = true;
      if (!identifier) {
        setError(form, "identifier", "Enter registered mobile number or official user ID.");
        valid = false;
      }
      if (!password) {
        setError(form, "password", "Enter your password.");
        valid = false;
      }
      if (!valid) return;
      const result = auth.loginPolice(identifier, password);
      if (!result.ok) {
        setError(form, "form", result.message);
        return;
      }
      window.location.href = "../../police/dashboard/";
    });
  }

  function otpInputsValue() {
    return qsa("[data-otp-box]").map((input) => input.value).join("");
  }

  function wireOtpInputs(scope = document) {
    qsa("[data-otp-box]", scope).forEach((input, index, items) => {
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
  }

  function renderPasswordChecklist(password, confirm) {
    const status = auth.passwordStatus(password);
    const checklist = qs("#password-checklist");
    if (checklist) {
      Object.entries(status.checks).forEach(([key, value]) => {
        const item = qs(`[data-check="${key}"]`, checklist);
        if (item) item.classList.toggle("is-valid", value);
      });
      const matchItem = qs('[data-check="match"]', checklist);
      if (matchItem) matchItem.classList.toggle("is-valid", Boolean(password) && password === confirm);
    }
    const strength = qs("#password-strength");
    const label = qs("#password-strength-label");
    if (strength) {
      strength.className = `strength is-${status.label.toLowerCase()}`;
    }
    if (label) label.textContent = status.label;
    return status;
  }

  function startCountdown(seconds) {
    const target = qs("#resend-countdown");
    let remaining = seconds;
    if (!target) return;
    target.textContent = `${remaining}s`;
    const timer = setInterval(() => {
      remaining -= 1;
      target.textContent = remaining > 0 ? `${remaining}s` : "now";
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
  }

  function initSignup() {
    let mobile = "";
    let otpVerified = false;
    const steps = qsa("[data-step]");

    function showStep(step) {
      steps.forEach((item) => {
        item.hidden = item.dataset.step !== step;
      });
      if (step === "otp") {
        qs("#masked-mobile").textContent = `+91 XXXXX XX${mobile.slice(-3)}`;
        startCountdown(30);
        const firstOtp = qs("[data-otp-box]");
        if (firstOtp) firstOtp.focus();
      }
    }

    const mobileInput = qs("#signup-mobile");
    const sendButton = qs("#send-otp");
    mobileInput.addEventListener("input", () => {
      sendButton.disabled = !auth.isValidMobile(mobileInput.value);
    });

    qs("#mobile-step-form").addEventListener("submit", (event) => {
      event.preventDefault();
      mobile = mobileInput.value;
      if (!auth.isValidMobile(mobile)) return;
      const done = showLoading(sendButton, "Sending...");
      setTimeout(() => {
        done();
        showStep("otp");
      }, 450);
    });

    qs("#otp-step-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const error = qs('[data-error-for="otp"]');
      if (!auth.verifyOtp(otpInputsValue())) {
        error.textContent = "Invalid OTP. Use 123456 for the demo.";
        return;
      }
      error.textContent = "";
      otpVerified = true;
      showStep("password");
    });

    qs("#change-mobile").addEventListener("click", () => showStep("mobile"));

    const password = qs("#new-password");
    const confirm = qs("#confirm-password");
    const createButton = qs("#create-account");
    function updatePasswordState() {
      const status = renderPasswordChecklist(password.value, confirm.value);
      createButton.disabled = !(otpVerified && status.valid && password.value === confirm.value);
    }
    password.addEventListener("input", updatePasswordState);
    confirm.addEventListener("input", updatePasswordState);

    qs("#password-step-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (createButton.disabled) return;
      auth.registerPublic(mobile, password.value);
      showStep("success");
    });
  }

  function initForgotPassword() {
    let mobile = "";
    qsa("[data-forgot-step]").forEach((item, index) => {
      item.hidden = index !== 0;
    });
    function showStep(step) {
      qsa("[data-forgot-step]").forEach((item) => {
        item.hidden = item.dataset.forgotStep !== step;
      });
      if (step === "otp") startCountdown(30);
    }

    const mobileForm = qs("#forgot-mobile-form");
    mobileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      mobile = qs("#forgot-mobile").value;
      if (!auth.isValidMobile(mobile)) {
        setError(mobileForm, "mobile", "Enter exactly 10 digits.");
        return;
      }
      showStep("otp");
    });

    qs("#forgot-otp-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const error = qs('[data-error-for="otp"]');
      if (!auth.verifyOtp(otpInputsValue())) {
        error.textContent = "Invalid OTP. Use 123456 for the demo.";
        return;
      }
      error.textContent = "";
      showStep("password");
    });

    const password = qs("#new-password");
    const confirm = qs("#confirm-password");
    const resetButton = qs("#reset-password");
    function updatePasswordState() {
      const status = renderPasswordChecklist(password.value, confirm.value);
      resetButton.disabled = !(status.valid && password.value === confirm.value);
    }
    password.addEventListener("input", updatePasswordState);
    confirm.addEventListener("input", updatePasswordState);

    qs("#forgot-password-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!resetButton.disabled) showStep("success");
    });
  }

  function initDashboard(role) {
    const session = auth.requireRole(role);
    if (!session) return;
    const name = qs("[data-user-name]");
    if (name) name.textContent = session.name;
    qsa("[data-logout]").forEach((button) => {
      button.addEventListener("click", () => {
        auth.clearSession();
        window.location.href = "../../index (3).html";
      });
    });
  }

  wirePasswordToggles();
  wireMobileLimit();
  wireOtpInputs();

  if (page === "public-login") initPublicLogin();
  if (page === "police-login") initPoliceLogin();
  if (page === "signup") initSignup();
  if (page === "forgot-password") initForgotPassword();
  if (page === "public-dashboard") initDashboard("public");
  if (page === "police-dashboard") initDashboard("police");
})();
