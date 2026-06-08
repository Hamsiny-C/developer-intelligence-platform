/**
 * auth.js — DevIntel Authentication
 * ─────────────────────────────────
 * • Handles login / register API calls
 * • Guards index.html (redirects to login if not logged in)
 * • Provides logout helper
 * • Draws particle canvas on auth pages
 * • No external dependencies · works in Spring Boot /static
 */

"use strict";

/* ═══════════════════════════════════════════════════
   1.  ROUTE GUARD  — call on every protected page
   ═══════════════════════════════════════════════════ */

/**
 * Call at the top of script.js (or any protected page).
 * If user is not logged in, redirect to login page.
 */
function requireAuth() {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("/login.html");
  }
}

/* ═══════════════════════════════════════════════════
   2.  LOGOUT
   ═══════════════════════════════════════════════════ */

/**
 * Clears session and redirects to login.
 * Wire this to your logout button:
 *   document.getElementById("logout-btn").addEventListener("click", logout);
 */
function logout() {
  localStorage.clear();
  window.location.replace("/login.html");
}

// Auto-wire any element with id="logout-btn" or class="logout-btn"
document.addEventListener("DOMContentLoaded", function () {
  const btns = document.querySelectorAll("#logout-btn, .logout-btn");
  btns.forEach(function (btn) {
    btn.addEventListener("click", logout);
  });
});

/* ═══════════════════════════════════════════════════
   3.  PARTICLE CANVAS  (auth pages background)
   ═══════════════════════════════════════════════════ */

function initAuthCanvas() {
  const canvas = document.getElementById("auth-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x   = Math.random() * W;
    this.y   = Math.random() * H;
    this.r   = Math.random() * 1.4 + 0.3;
    this.vx  = (Math.random() - 0.5) * 0.25;
    this.vy  = (Math.random() - 0.5) * 0.25;
    this.a   = Math.random() * 0.45 + 0.08;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  function init() {
    resize();
    particles = [];
    const count = Math.min(100, Math.floor((W * H) / 12000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(function (p) {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,229,255," + p.a + ")";
      ctx.fill();
    });

    // Connecting lines between nearby particles
    var len = particles.length;
    for (var i = 0; i < len; i++) {
      for (var j = i + 1; j < len; j++) {
        var dx   = particles[i].x - particles[j].x;
        var dy   = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(0,229,255," + (0.07 * (1 - dist / 110)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", function () { init(); });
  init();
  draw();
}

/* ═══════════════════════════════════════════════════
   4.  SHARED UTILITIES
   ═══════════════════════════════════════════════════ */

/** Show an alert box (.auth-alert) */
function showAlert(el, type, message) {
  if (!el) return;
  el.className = "auth-alert " + type + " show";
  el.querySelector(".alert-msg").textContent = message;
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/** Hide an alert box */
function hideAlert(el) {
  if (!el) return;
  el.className = "auth-alert";
}

/** Set button to loading state */
function setBtnLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.classList.add("loading");
    btn.disabled = true;
  } else {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

/** Simple email validator */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Password strength  →  1 (weak) … 4 (strong) */
function getPasswordStrength(pw) {
  var score = 0;
  if (pw.length >= 8)                       score++;
  if (/[A-Z]/.test(pw))                     score++;
  if (/[0-9]/.test(pw))                     score++;
  if (/[^A-Za-z0-9]/.test(pw))             score++;
  return score;
}

var PW_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

/* ═══════════════════════════════════════════════════
   5.  REGISTER PAGE
   ═══════════════════════════════════════════════════ */

function initRegisterPage() {
  initAuthCanvas();

  var form      = document.getElementById("register-form");
  var alertBox  = document.getElementById("reg-alert");
  var btn       = document.getElementById("reg-btn");
  var pwInput   = document.getElementById("reg-password");
  var pwBar     = document.getElementById("pw-strength");
  var pwLabel   = document.getElementById("pw-label");
  var togglePw  = document.getElementById("toggle-pw");

  if (!form) return;

  /* ── Password strength meter ── */
  if (pwInput && pwBar) {
    pwInput.addEventListener("input", function () {
      var val = pwInput.value;
      if (val.length === 0) {
        pwBar.classList.remove("show");
        return;
      }
      pwBar.classList.add("show");
      var level = getPasswordStrength(val);
      pwBar.setAttribute("data-level", level);
      if (pwLabel) pwLabel.textContent = PW_LABELS[level];
    });
  }

  /* ── Show/hide password ── */
  if (togglePw && pwInput) {
    togglePw.addEventListener("click", function () {
      var isText = pwInput.type === "text";
      pwInput.type = isText ? "password" : "text";
      togglePw.querySelector("i").className = isText
        ? "fa-regular fa-eye"
        : "fa-regular fa-eye-slash";
    });
  }

  /* ── Form submit ── */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideAlert(alertBox);

    var name     = document.getElementById("reg-name").value.trim();
    var email    = document.getElementById("reg-email").value.trim();
    var github   = document.getElementById("reg-github").value.trim();
    var password = pwInput ? pwInput.value : "";

    /* ── Client-side validation ── */
    var valid = true;

    if (!name) {
      showFieldError("err-name", "Full name is required.");
      valid = false;
    } else hideFieldError("err-name");

    if (!isValidEmail(email)) {
      showFieldError("err-email", "Enter a valid email address.");
      valid = false;
    } else hideFieldError("err-email");

    if (!github) {
      showFieldError("err-github", "GitHub username is required.");
      valid = false;
    } else hideFieldError("err-github");

    if (password.length < 6) {
      showFieldError("err-password", "Password must be at least 6 characters.");
      valid = false;
    } else hideFieldError("err-password");

    if (!valid) return;

    /* ── API call ── */
    setBtnLoading(btn, true);

    try {
      var response = await fetch("/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:           name,
          email:          email,
          githubUsername: github,
          password:       password
        })
      });

      var text = await response.text();

      if (response.ok && text.toLowerCase().includes("successful")) {
        showAlert(alertBox, "success",
          "🎉 Account created! Redirecting to login…");
        form.reset();
        if (pwBar) pwBar.classList.remove("show");
        setTimeout(function () {
          window.location.href = "/login.html";
        }, 1800);
      } else {
        /* Map common backend messages to user-friendly text */
        var errMsg = text || "Registration failed. Please try again.";
        if (errMsg.toLowerCase().includes("email") &&
            errMsg.toLowerCase().includes("exist")) {
          errMsg = "This email is already registered. Please log in.";
        }
        showAlert(alertBox, "error", errMsg);
      }
    } catch (err) {
      console.error("Register error:", err);
      showAlert(alertBox, "error",
        "Cannot connect to server. Make sure the backend is running.");
    } finally {
      setBtnLoading(btn, false);
    }
  });
}

/* ═══════════════════════════════════════════════════
   6.  LOGIN PAGE
   ═══════════════════════════════════════════════════ */

function initLoginPage() {
  initAuthCanvas();

  var form     = document.getElementById("login-form");
  var alertBox = document.getElementById("login-alert");
  var btn      = document.getElementById("login-btn");
  var pwInput  = document.getElementById("login-password");
  var togglePw = document.getElementById("toggle-pw");

  if (!form) return;

  /* Already logged in → skip login page */
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.replace("/index.html");
    return;
  }

  /* ── Show/hide password ── */
  if (togglePw && pwInput) {
    togglePw.addEventListener("click", function () {
      var isText = pwInput.type === "text";
      pwInput.type = isText ? "password" : "text";
      togglePw.querySelector("i").className = isText
        ? "fa-regular fa-eye"
        : "fa-regular fa-eye-slash";
    });
  }

  /* ── Form submit ── */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideAlert(alertBox);

    var email    = document.getElementById("login-email").value.trim();
    var password = pwInput ? pwInput.value : "";

    /* ── Client-side validation ── */
    var valid = true;

    if (!isValidEmail(email)) {
      showFieldError("err-login-email", "Enter a valid email address.");
      valid = false;
    } else hideFieldError("err-login-email");

    if (!password) {
      showFieldError("err-login-password", "Password is required.");
      valid = false;
    } else hideFieldError("err-login-password");

    if (!valid) return;

    /* ── API call ── */
    setBtnLoading(btn, true);

    try {
      var response = await fetch("/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:    email,
          password: password
        })
      });

      var text = await response.text();

      if (response.ok && text.toLowerCase().includes("successful")) {
        /* Save session */
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        showAlert(alertBox, "success", "Login successful! Redirecting…");

        setTimeout(function () {
          window.location.replace("/index.html");
        }, 900);
      } else {
        var errMsg = text || "Invalid email or password.";
        if (errMsg.toLowerCase().includes("not found") ||
            errMsg.toLowerCase().includes("invalid") ||
            errMsg.toLowerCase().includes("incorrect")) {
          errMsg = "Invalid email or password. Please try again.";
        }
        showAlert(alertBox, "error", errMsg);

        /* Shake the card */
        var card = document.querySelector(".auth-card");
        if (card) {
          card.classList.add("shake");
          setTimeout(function () { card.classList.remove("shake"); }, 500);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert(alertBox, "error",
        "Cannot connect to server. Make sure the backend is running.");
    } finally {
      setBtnLoading(btn, false);
    }
  });
}

/* ── Shake animation (added dynamically) ── */
(function injectShake() {
  var style = document.createElement("style");
  style.textContent =
    "@keyframes shake{" +
    "0%,100%{transform:translateX(0)}" +
    "20%{transform:translateX(-8px)}" +
    "40%{transform:translateX(8px)}" +
    "60%{transform:translateX(-6px)}" +
    "80%{transform:translateX(6px)}" +
    "}" +
    ".shake{animation:shake .45s ease both;}";
  document.head.appendChild(style);
})();

/* ── Field-level error helpers ── */
function showFieldError(id, msg) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = "⚠ " + msg;
  el.classList.add("show");
  /* Also mark input */
  var input = el.previousElementSibling
    ? el.previousElementSibling.querySelector(".form-input")
    : null;
  if (!input) {
    /* traverse up to form-group then find input */
    var group = el.closest ? el.closest(".form-group") : null;
    if (group) input = group.querySelector(".form-input");
  }
  if (input) input.classList.add("error-state");
}
function hideFieldError(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("show");
  var group = el.closest ? el.closest(".form-group") : null;
  if (group) {
    var input = group.querySelector(".form-input");
    if (input) input.classList.remove("error-state");
  }
}

/* ── Clear field errors on input ── */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".form-input").forEach(function (inp) {
    inp.addEventListener("input", function () {
      inp.classList.remove("error-state");
      var group = inp.closest ? inp.closest(".form-group") : null;
      if (group) {
        var errEl = group.querySelector(".field-error");
        if (errEl) errEl.classList.remove("show");
      }
    });
  });

  /* Auto-boot whichever page we're on */
  if (document.getElementById("register-form")) initRegisterPage();
  if (document.getElementById("login-form"))    initLoginPage();
});