(function () {
  const AUTH_KEY = "cybernetra.auth";
  const USERS_KEY = "cybernetra.publicUsers";
  const OTP = "123456";

  const demoUsers = [
    {
      mobile: "9876543210",
      password: "Public@123",
      role: "public",
      name: "Public Demo User"
    },
    {
      mobile: "9123456780",
      userId: "POLICE-CN-001",
      password: "Police@123",
      role: "police",
      name: "Police Demo Officer"
    }
  ];

  function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function isValidMobile(value) {
    return /^\d{10}$/.test(onlyDigits(value));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY));
    } catch (error) {
      return null;
    }
  }

  function getStoredPublicUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveStoredPublicUser(user) {
    const users = getStoredPublicUsers().filter((item) => item.mobile !== user.mobile);
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function setSession(user) {
    const session = {
      mobile: user.mobile,
      userId: user.userId || "",
      role: user.role,
      name: user.name,
      signedInAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    localStorage.removeItem(AUTH_KEY);
  }

  function loginPublic(mobile, password) {
    const publicUsers = demoUsers.filter((item) => item.role === "public").concat(getStoredPublicUsers());
    const user = publicUsers.find((item) => item.mobile === onlyDigits(mobile));
    if (!user || user.password !== password) {
      return { ok: false, message: "Invalid mobile number or password." };
    }
    return { ok: true, session: setSession(user) };
  }

  function loginPolice(identifier, password) {
    const normalized = String(identifier || "").trim();
    const digits = onlyDigits(normalized);
    const user = demoUsers.find((item) => (
      item.role === "police" &&
      (item.mobile === digits || item.userId.toLowerCase() === normalized.toLowerCase())
    ));
    if (!user || user.password !== password) {
      return { ok: false, message: "Secure login failed. Check your credentials." };
    }
    return { ok: true, session: setSession(user) };
  }

  function registerPublic(mobile, password) {
    const user = {
      mobile: onlyDigits(mobile),
      password,
      role: "public",
      name: "Cyber Netra Citizen"
    };
    saveStoredPublicUser(user);
    return setSession(user);
  }

  function verifyOtp(value) {
    return String(value || "") === OTP;
  }

  function passwordStatus(password) {
    const value = String(password || "");
    const checks = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[^A-Za-z0-9]/.test(value)
    };
    const score = Object.values(checks).filter(Boolean).length;
    return {
      checks,
      score,
      label: score <= 2 ? "Weak" : score <= 4 ? "Medium" : "Strong",
      valid: score === 5
    };
  }

  function requireRole(role) {
    const session = getSession();
    if (!session) {
      window.location.href = role === "police" ? "../../login/police/" : "../../login/public/";
      return null;
    }
    if (session.role !== role) {
      window.location.href = "../../unauthorized/";
      return null;
    }
    return session;
  }

  window.CyberNetraAuth = {
    demoUsers,
    onlyDigits,
    isValidMobile,
    getSession,
    setSession,
    clearSession,
    loginPublic,
    loginPolice,
    registerPublic,
    verifyOtp,
    passwordStatus,
    requireRole,
    developmentOtp: OTP
  };
})();
