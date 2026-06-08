/**
 * DevIntel — script.js
 * SaaS Dashboard · Spring Boot static · Vanilla JS
 * ──────────────────────────────────────────────────
 * • Route guard (requireAuth from auth.js)
 * • Fetches all 9 APIs once on Analyze
 * • Store data globally; sidebar clicks just re-render
 * • Each section has its own focused render function
 */

"use strict";

/* ════════════════════════════════════════════════════
   0.  ROUTE GUARD
   ════════════════════════════════════════════════════ */
(function guard() {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("/login.html");
  }
})();

/* ════════════════════════════════════════════════════
   1.  GLOBAL STATE
   ════════════════════════════════════════════════════ */
var DATA = {              // all API responses
  profile:     null,
  github:      null,
  score:       null,
  languages:   null,
  recommendations: null,
  report:      null,
  roadmap:     null,
  recruiter:   null,
  interview:   null
};
var currentUsername    = "";
var currentSection     = "empty";   // active sidebar section id
var loaderStepTimer    = null;

/* Language color palette */
var LANG_COLORS = [
  "#00e5ff","#4a7bff","#8b5cf6","#f472b6",
  "#22d3a5","#fbbf24","#f87171","#34d399",
  "#60a5fa","#a78bfa","#fb923c","#e879f9"
];
/* Reco icon list */
var RECO_ICONS  = ["💡","🚀","🔧","🌐","🤖","🎯","📦","⚡","🔥","🛠️","🧠","🎨"];
var RECO_COLORS = [
  "rgba(0,229,255,.12)","rgba(74,123,255,.12)","rgba(139,92,246,.12)",
  "rgba(34,211,165,.12)","rgba(251,191,36,.12)","rgba(248,113,113,.12)"
];

/* ════════════════════════════════════════════════════
   2.  DOM READY
   ════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {

  /* Show logged-in user */
  var email = localStorage.getItem("userEmail") || "";
  q("#topbar-email").textContent  = email || "user@devIntel.io";
  q("#topbar-initial").textContent = email ? email.charAt(0).toUpperCase() : "U";

  /* Sidebar nav clicks */
  qAll(".sb-item[data-section]").forEach(function (item) {
    item.addEventListener("click", function () {
      var sec = item.getAttribute("data-section");
      if (sec) switchSection(sec);
      closeSidebar();
    });
  });

  /* Enter key on search */
  q("#username-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") analyzeUser();
  });

  /* Show empty state initially */
  switchSection("empty");

  /* Init empty hero canvas */
  initEmptyCanvas();

  /* Update time in topbar */
  updateTopbarTime();
});

/* ════════════════════════════════════════════════════
   3.  SIDEBAR HELPERS
   ════════════════════════════════════════════════════ */
function toggleSidebar() {
  q("#sidebar").classList.toggle("open");
  q("#sb-overlay").classList.toggle("active");
}
function closeSidebar() {
  q("#sidebar").classList.remove("open");
  q("#sb-overlay").classList.remove("active");
}

/* ════════════════════════════════════════════════════
   4.  SECTION SWITCHER
   ════════════════════════════════════════════════════ */
var SECTION_NAMES = {
  "empty":           "Welcome",
  "overview":        "Overview",
  "github-profile":  "GitHub Profile",
  "developer-score": "Developer Score",
  "recruiter-view":  "Recruiter View",
  "languages":       "Languages",
  "recommendations": "Recommendations",
  "roadmap":         "Career Roadmap",
  "interview":       "Interview Questions",
  "repositories":    "Repositories",
  "resume-history": "Resume History",
  "resume-analyzer": "Resume Analyzer"
};

function switchSection(name) {
  /* Hide all panels */
  qAll(".section-panel").forEach(function (p) { p.classList.remove("active"); });

  /* Show target */
  var panel = q("#section-" + name);
  if (panel) panel.classList.add("active");

  /* Update breadcrumb */
  var bc = q("#bc-current");
  if (bc) bc.textContent = SECTION_NAMES[name] || name;

  /* Update sidebar active */
  qAll(".sb-item[data-section]").forEach(function (item) {
    item.classList.toggle("active", item.getAttribute("data-section") === name);
  });

  currentSection = name;

  /* Trigger renders only if data exists */
  if (currentUsername) renderSection(name);
}

function renderSection(name) {
  switch (name) {
    case "overview":        renderOverview();        break;
    case "github-profile":  renderGithubProfile();   break;
    case "developer-score": renderDeveloperScore();  break;
    case "recruiter-view":  renderRecruiter();       break;
    case "languages":       renderLanguages();       break;
    case "recommendations": renderRecommendations(); break;
    case "roadmap":         renderRoadmap();         break;
    case "interview":       renderInterview();       break;
    case "repositories":    renderRepositories();    break;
    case "resume-analyzer":  break;
    case "resume-history": loadResumeHistory(); break;
  }
}

/* ════════════════════════════════════════════════════
   5.  ANALYZE  (main entry point)
   ════════════════════════════════════════════════════ */
function analyzeUser() {
  var raw = q("#username-input").value.trim();
  if (!raw) { showToast("Please enter a GitHub username."); return; }

  var username = raw;
  currentUsername = username;

  /* Update UI */
  q("#loader-uname").textContent = username;
  q("#current-uname-display").textContent = username;
  q("#current-user-tag").style.display = "flex";

  /* Show loader */
  showLoader();

  /* Fetch all APIs in parallel */
  Promise.allSettled([
    apiFetch("/profile/"            + username),   // 0
    apiFetch("/github/"             + username),   // 1
    apiFetch("/score/"              + username),   // 2
    apiFetch("/languages/"          + username),   // 3
    apiFetch("/recommendations/"    + username),   // 4
    apiFetch("/developer-report/"   + username),   // 5
    apiFetch("/roadmap/"            + username),   // 6
    apiFetch("/recruiter-view/"     + username),   // 7
    apiFetch("/interview-questions/"+ username)    // 8
  ]).then(function (results) {

    /* Store results */
    DATA.profile         = val(results[0]);
    DATA.github          = val(results[1]);
    DATA.score           = val(results[2]);
    DATA.languages       = val(results[3]);
    DATA.recommendations = val(results[4]);
    DATA.report          = val(results[5]);
    DATA.roadmap         = val(results[6]);
    DATA.recruiter       = val(results[7]);
    DATA.interview       = val(results[8]);

    /* Verify at least profile or github loaded */
    if (!DATA.profile && !DATA.github) {
      hideLoader();
      showToast("Could not find GitHub user: " + username);
      currentUsername = "";
      q("#current-user-tag").style.display = "none";
      return;
    }

    hideLoader();
    switchSection("overview");

  }).catch(function (err) {
    hideLoader();
    showToast("An error occurred. Please try again.");
    console.error(err);
  });
}

function val(settled) {
  return settled.status === "fulfilled" ? settled.value : null;
}

/* ════════════════════════════════════════════════════
   6.  API FETCH  (relative URLs — works in Spring Boot)
   ════════════════════════════════════════════════════ */
async function apiFetch(path) {
  var res = await fetch(path);
  if (!res.ok) throw new Error("HTTP " + res.status + " " + path);
  var ct = (res.headers.get("content-type") || "");
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

/* ════════════════════════════════════════════════════
   7.  LOADER
   ════════════════════════════════════════════════════ */
var STEPS = ["ls1","ls2","ls3","ls4"];
var stepIdx = 0;

function showLoader() {
  var loader = q("#global-loader");
  loader.classList.add("active");
  stepIdx = 0;
  STEPS.forEach(function (id) {
    var el = q("#" + id);
    el.classList.remove("active","done");
    el.querySelector("i").className = "fa-regular fa-circle";
  });
  advanceStep();
}

function advanceStep() {
  if (stepIdx >= STEPS.length) return;
  var el = q("#" + STEPS[stepIdx]);
  el.classList.add("active");
  el.querySelector("i").className = "fa-solid fa-circle-dot fa-spin";
  loaderStepTimer = setTimeout(function () {
    el.querySelector("i").className = "fa-solid fa-circle-check";
    el.classList.remove("active"); el.classList.add("done");
    stepIdx++;
    advanceStep();
  }, 700 + stepIdx * 250);
}

function hideLoader(){
  clearTimeout(loaderStepTimer);
  q("#global-loader").classList.remove("active");
}

/* ════════════════════════════════════════════════════
8.  TOAST
════════════════════════════════════════════════════*/
var toastTimer = null;
function showToast(msg) {
  q("#toast-msg").textContent = msg;
  q("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 5000);
}
function hideToast() { q("#toast").classList.remove("show"); }

/* ════════════════════════════════════════════════════
   9.  OVERVIEW  RENDER
   ════════════════════════════════════════════════════ */
function renderOverview() {
  var profile = DATA.profile || DATA.github || {};

  /* Badge */
  setText("#ov-username-badge", currentUsername);

  /* Avatar + name */
  var avatar = q("#ov-avatar");
  avatar.src = profile.avatarUrl || profile.avatar_url ||
    "https://avatars.githubusercontent.com/" + currentUsername + "?v=4";
  avatar.alt = currentUsername;
  setText("#ov-name",  profile.name  || profile.login || currentUsername);
  setText("#ov-login", "@" + (profile.login || currentUsername));

  var ghLink = q("#ov-gh-link");
  ghLink.href = profile.htmlUrl || profile.html_url || ("https://github.com/" + currentUsername);

  /* Score */
  var score = extractScore(DATA.score);
  setText("#ov-score", score !== null ? score : "—");

  /* Hire score */
  var hire = extractHireScore(DATA.recruiter);
  setText("#ov-hire", hire !== null ? hire : "—");
  setText("#ov-hire-label", hire !== null ? getHireLabel(hire) : "—");

  /* Repos */
  setText("#ov-repos", fmtNum(profile.publicRepos || profile.public_repos || 0));

  /* Top 3 languages */
  var langList = q("#ov-langs-list");
  langList.innerHTML = "";
  var langs = normalizeLangs(DATA.languages);
  if (langs.length === 0) {
    langList.innerHTML = '<div class="no-data" style="padding:12px"><i class="fa-solid fa-code"></i>No data</div>';
  } else {
    langs.slice(0, 3).forEach(function (l, i) {
      var div = make("div","olc-item");
      div.innerHTML =
        '<div class="olc-dot" style="background:' + LANG_COLORS[i] + '"></div>' +
        '<span class="olc-name">' + esc(l.name) + '</span>' +
        '<span class="olc-pct">' + (l.pct ? Math.round(l.pct) + "%" : "") + '</span>';
      langList.appendChild(div);
    });
  }

  /* Report */
  var report = extractText(DATA.report);
  q("#ov-report-text").textContent = report
    ? trunc(report, 400)
    : "No developer report available for this profile.";
}

/* ════════════════════════════════════════════════════
   10.  GITHUB PROFILE  RENDER
   ════════════════════════════════════════════════════ */
function renderGithubProfile() {
  var d = DATA.profile || DATA.github || {};

  q("#ghp-avatar").src = d.avatarUrl || d.avatar_url ||
    "https://avatars.githubusercontent.com/" + currentUsername + "?v=4";
  setText("#ghp-name",  d.name  || d.login || currentUsername);
  setText("#ghp-login", "@" + (d.login || currentUsername));
  setText("#ghp-bio",   d.bio   || "");

  /* Meta */
  var meta = q("#ghp-meta");
  meta.innerHTML = "";
  var metaFields = [
    { icon: "fa-location-dot",  val: d.location  || d.city },
    { icon: "fa-building",      val: d.company },
    { icon: "fa-link",          val: d.blog || d.website },
    { icon: "fa-envelope",      val: d.email },
    { icon: "fa-twitter",       val: d.twitterUsername || d.twitter_username }
  ];
  metaFields.forEach(function (f) {
    if (f.val) {
      var span = make("div","ghp-meta-item");
      span.innerHTML = '<i class="fa-solid ' + f.icon + '"></i>' + esc(f.val);
      meta.appendChild(span);
    }
  });

  /* Stats */
  setText("#ghps-repos",     fmtNum(d.publicRepos    || d.public_repos    || 0));
  setText("#ghps-followers", fmtNum(d.followers      || 0));
  setText("#ghps-following", fmtNum(d.following      || 0));
  setText("#ghps-gists",     fmtNum(d.publicGists    || d.public_gists    || 0));

  /* GitHub link */
  q("#ghp-link").href = d.htmlUrl || d.html_url || ("https://github.com/" + currentUsername);

  /* Info extra */
  var extra = q("#ghp-info-extra");
  extra.innerHTML = '<div class="gac-title"><i class="fa-solid fa-circle-info"></i> Profile Info</div>';
  var infoHtml = "";
  if (d.nodeId || d.node_id) infoHtml += kv("Node ID", d.nodeId || d.node_id);
  if (d.type)       infoHtml += kv("Account Type", d.type);
  if (d.siteAdmin !== undefined) infoHtml += kv("Site Admin", d.siteAdmin ? "Yes" : "No");
  extra.innerHTML += '<div class="gac-grid">' + (infoHtml || '<p class="orc-text">Basic profile information.</p>') + '</div>';

  /* Details grid */
  var dg = q("#ghp-details-grid");
  dg.innerHTML = "";
  var detFields = [
    { l: "Created", v: fmtDate(d.createdAt || d.created_at) },
    { l: "Updated", v: fmtDate(d.updatedAt || d.updated_at) },
    { l: "Public Repos", v: fmtNum(d.publicRepos || d.public_repos || 0) },
    { l: "Public Gists", v: fmtNum(d.publicGists || d.public_gists || 0) },
    { l: "Followers",    v: fmtNum(d.followers   || 0) },
    { l: "Following",    v: fmtNum(d.following   || 0) }
  ];
  detFields.forEach(function (f) {
    if (f.v && f.v !== "Invalid Date") {
      var div = make("div","gac-item");
      div.innerHTML = '<div class="gac-item-label">' + esc(f.l) + '</div><div class="gac-item-val">' + esc(f.v) + '</div>';
      dg.appendChild(div);
    }
  });
}

function kv(label, val) {
  return '<div class="gac-item"><div class="gac-item-label">' + esc(label) +
         '</div><div class="gac-item-val">' + esc(String(val)) + '</div></div>';
}

/* ════════════════════════════════════════════════════
   11.  DEVELOPER SCORE  RENDER
   ════════════════════════════════════════════════════ */
function renderDeveloperScore() {
  var score = extractScore(DATA.score);
  score = score !== null ? Math.min(100, Math.max(0, Math.round(Number(score)))) : 0;

  /* Big ring */
  setText("#score-big-num", score);
  var circle = q("#score-ring-circle");
  var circ   = 414.69;
  setTimeout(function () {
    circle.style.strokeDashoffset = circ - (circ * score / 100);
  }, 100);

  /* Label */
  var labels = ["Beginner","Developing","Intermediate","Proficient","Advanced","Expert"];
  q("#score-ring-label").textContent = labels[Math.min(5, Math.floor(score / 17))];

  /* Bars */
  var bars = extractScoreBars(DATA.score);
  var container = q("#score-bars-container");
  container.innerHTML = "";
  if (bars.length === 0) {
    /* Synthesise from overall score */
    bars = [
      { label: "Code Activity",    value: Math.min(100, score + 8) },
      { label: "Tech Diversity",   value: Math.max(0, score - 12) },
      { label: "Project Strength", value: Math.min(100, score + 4) }
    ];
  }
  var barColors = ["var(--cyan)","var(--blue)","var(--violet)","var(--green)","var(--amber)"];
  bars.forEach(function (b, i) {
    var div = make("div","sbar-item");
    div.innerHTML =
      '<div class="sbar-meta"><span>' + esc(b.label) + '</span>' +
      '<span class="sbar-val">' + Math.round(b.value) + '%</span></div>' +
      '<div class="sbar-track"><div class="sbar-fill" style="width:0%;background:' + barColors[i % barColors.length] + '"></div></div>';
    container.appendChild(div);
    setTimeout(function () {
      div.querySelector(".sbar-fill").style.width = b.value + "%";
    }, 200 + i * 120);
  });

  /* Report */
  var report = extractText(DATA.report);
  q("#score-report-body").innerHTML = report
    ? '<p>' + esc(trunc(report, 600)) + '</p>'
    : '<p class="orc-text">No report data available.</p>';
}

/* ════════════════════════════════════════════════════
   12.  RECRUITER VIEW  RENDER
   ════════════════════════════════════════════════════ */
function renderRecruiter() {
  var hire = extractHireScore(DATA.recruiter);
  hire = hire !== null ? Math.min(100, Math.max(0, Math.round(Number(hire)))) : 0;

  setText("#rec-score-num", hire || "—");
  setTimeout(function () {
    q("#rec-gauge-fill").style.width = hire + "%";
  }, 200);

  /* Verdict badge */
  var verdict = extractField(DATA.recruiter, ["recommendation","verdict","status","recommendation"]) || getHireLabel(hire);
  setText("#rec-verdict-badge", verdict);

  /* Details grid */
  var dg = q("#rec-details-grid"); dg.innerHTML = "";
  var detFields = [
    { l: "Hire Score",      v: hire + "/100" },
    { l: "Verdict",         v: verdict },
    { l: "Recommended Role",v: extractField(DATA.recruiter, ["recommendedRole","role","position","suggestedRole"]) },
    { l: "Experience Level",v: extractField(DATA.recruiter, ["experienceLevel","level","seniority"]) },
    { l: "Risk Level",      v: extractField(DATA.recruiter, ["riskLevel","risk"]) },
    { l: "Tech Stack",      v: extractField(DATA.recruiter, ["techStack","technologies","stack"]) }
  ];
  detFields.forEach(function (f) {
    if (f.v) {
      var div = make("div","rdc-item");
      div.innerHTML = '<div class="rdc-label">' + esc(f.l) + '</div><div class="rdc-val">' + esc(trunc(String(f.v),80)) + '</div>';
      dg.appendChild(div);
    }
  });
  if (dg.children.length === 0) dg.innerHTML = noData("briefcase","No recruiter details available");

  /* Insights */
  var insightsList = q("#rec-insights-list"); insightsList.innerHTML = "";
  var insights = extractListItems(DATA.recruiter);
  if (insights.length === 0) {
    insightsList.innerHTML = noData("magnifying-glass-chart","No insights available");
  } else {
    insights.slice(0,7).forEach(function (item) {
      var li = make("li");
      li.textContent = trunc(String(item), 180);
      insightsList.appendChild(li);
    });
  }
}

/* ════════════════════════════════════════════════════
   13.  LANGUAGES  RENDER
   ════════════════════════════════════════════════════ */
function renderLanguages() {
  var langs = normalizeLangs(DATA.languages);

  /* Bars */
  var barsContainer = q("#langs-bars-container"); barsContainer.innerHTML = "";
  if (langs.length === 0) {
    barsContainer.innerHTML = noData("code","No language data available");
  } else {
    var max = langs[0].pct || 1;
    langs.forEach(function (l, i) {
      var pct = Math.round((l.pct / max) * 100);
      var div = make("div","lang-bar-item");
      div.innerHTML =
        '<div class="lang-bar-meta"><span>' + esc(l.name) + '</span>' +
        '<span class="lang-bar-pct">' + (l.pct ? Math.round(l.pct) + "%" : "") + '</span></div>' +
        '<div class="lang-bar-track"><div class="lang-bar-fill" style="width:0%;background:' + LANG_COLORS[i % LANG_COLORS.length] + '"></div></div>';
      barsContainer.appendChild(div);
      setTimeout(function () {
        div.querySelector(".lang-bar-fill").style.width = pct + "%";
      }, 150 + i * 80);
    });
  }

  /* Cards */
  var wrap = q("#langs-cards-wrap"); wrap.innerHTML = "";
  langs.slice(0,12).forEach(function (l, i) {
    var color = LANG_COLORS[i % LANG_COLORS.length];
    var card = make("div","lang-card");
    card.innerHTML =
      '<div class="lang-card-dot" style="background:' + color + '"></div>' +
      '<div class="lang-card-name">' + esc(l.name) + '</div>' +
      (l.pct ? '<div class="lang-card-pct">' + Math.round(l.pct) + '%</div>' : '') +
      '<div class="lang-card-bar"><div class="lang-card-bar-fill" style="width:0%;background:' + color + '"></div></div>';
    wrap.appendChild(card);
    setTimeout(function () {
      card.querySelector(".lang-card-bar-fill").style.width = (l.pct || 0) + "%";
    }, 200 + i * 60);
  });
}

/* ════════════════════════════════════════════════════
   14.  RECOMMENDATIONS  RENDER
   ════════════════════════════════════════════════════ */
function renderRecommendations() {
  var grid = q("#reco-grid"); grid.innerHTML = "";
  var items = normalizeList(DATA.recommendations);

  if (items.length === 0) {
    grid.innerHTML = noData("lightbulb","No recommendations available");
    return;
  }

  items.slice(0,12).forEach(function (item, i) {
    var title = extractField(item, ["title","name","project","topic"]) || ("Recommendation " + (i+1));
    var desc  = extractField(item, ["description","desc","details","summary","content","text"]) || (typeof item === "string" ? item : "");
    var tag   = extractField(item, ["tag","type","category","difficulty","level"]) || "";

    var card = make("div","reco-card");
    card.innerHTML =
      '<div class="reco-card-icon" style="background:' + RECO_COLORS[i % RECO_COLORS.length] + '">' + RECO_ICONS[i % RECO_ICONS.length] + '</div>' +
      '<div class="reco-card-title">' + esc(trunc(title, 70)) + '</div>' +
      (desc ? '<div class="reco-card-desc">'  + esc(trunc(desc, 140)) + '</div>' : '') +
      (tag  ? '<span class="reco-card-tag">'  + esc(tag)              + '</span>' : '');
    grid.appendChild(card);
  });
}

/* ════════════════════════════════════════════════════
   15.  ROADMAP  RENDER
   ════════════════════════════════════════════════════ */
var RM_COLORS = ["var(--cyan)","var(--blue)","var(--violet)","var(--pink,#f472b6)","var(--green)","var(--amber)"];

function renderRoadmap() {
  var timeline = q("#roadmap-timeline"); timeline.innerHTML = "";
  var steps = normalizeList(DATA.roadmap);

  /* If string, split by line */
  if (steps.length === 0 && typeof DATA.roadmap === "string") {
    steps = DATA.roadmap.split(/\n|;/).map(function (s, i) {
      return { phase: "Phase " + (i+1), title: s.trim() };
    }).filter(function (s) { return s.title.length > 5; }).slice(0, 10);
  }

  if (steps.length === 0) {
    timeline.innerHTML = noData("map","No roadmap data available");
    return;
  }

  steps.slice(0,10).forEach(function (step, i) {
    var phase = extractField(step, ["phase","stage","level","step","period","timeframe"]) || ("Step " + (i+1));
    var title = extractField(step, ["title","name","goal","milestone","objective","skill"]) || (typeof step === "string" ? step : "");
    var desc  = extractField(step, ["description","desc","details","content","action","tasks","skills"]) || "";
    var color = RM_COLORS[i % RM_COLORS.length];

    var div = make("div","rm-step");
    div.innerHTML =
      '<div class="rm-line-col">' +
        '<div class="rm-dot" style="border-color:' + color + ';color:' + color + ';background:' + color + '18">' + (i+1) + '</div>' +
        '<div class="rm-connector" style="background:linear-gradient(to bottom,' + color + ',transparent)"></div>' +
      '</div>' +
      '<div class="rm-content">' +
        '<div class="rm-phase" style="color:' + color + '">' + esc(trunc(String(phase),50)) + '</div>' +
        '<div class="rm-title">' + esc(trunc(String(title),100)) + '</div>' +
        (desc ? '<div class="rm-desc">' + esc(trunc(String(desc),200)) + '</div>' : '') +
      '</div>';
    timeline.appendChild(div);
  });
}

/* ════════════════════════════════════════════════════
   16.  INTERVIEW QUESTIONS  RENDER
   ════════════════════════════════════════════════════ */
function renderInterview() {
  var grid = q("#interview-grid"); grid.innerHTML = "";
  var questions = normalizeQuestions(DATA.interview);

  if (questions.length === 0) {
    grid.innerHTML = noData("circle-question","No interview questions available");
    return;
  }

  questions.slice(0,16).forEach(function (qText, i) {
    var card = make("div","iq-card");
    card.innerHTML =
      '<span class="iq-num">Q' + (i+1) + '</span>' +
      '<span class="iq-text">' + esc(trunc(String(qText), 220)) + '</span>';
    grid.appendChild(card);
  });
}

/* ════════════════════════════════════════════════════
   17.  REPOSITORIES  RENDER
   ════════════════════════════════════════════════════ */
function renderRepositories() {
  var grid = q("#repo-grid"); grid.innerHTML = "";
  var repos = normalizeRepos(DATA.github);

  setText("#repo-total-badge", repos.length ? repos.length + " repos" : "");

  if (repos.length === 0) {
    grid.innerHTML = noData("book-open","No repository data available");
    return;
  }

  repos.slice(0,24).forEach(function (r, i) {
    var name   = r.name || r.repoName || "repo-" + i;
    var desc   = r.description || r.desc || "";
    var stars  = r.stargazersCount || r.stargazers_count || r.stars || 0;
    var forks  = r.forksCount     || r.forks_count      || r.forks || 0;
    var lang   = r.language || r.primaryLanguage || "";
    var url    = r.htmlUrl  || r.html_url || r.url || ("https://github.com/" + currentUsername + "/" + name);
    var langColor = LANG_COLORS[Math.abs(name.charCodeAt(0) % LANG_COLORS.length)];

    var card = make("div","repo-card");
    card.innerHTML =
      '<div class="repo-name"><i class="fa-regular fa-folder"></i>' + esc(name) + '</div>' +
      (desc  ? '<div class="repo-desc">'  + esc(desc)  + '</div>' : '') +
      '<div class="repo-meta">' +
        (lang  ? '<span class="repo-meta-item"><div class="repo-lang-dot" style="background:' + langColor + '"></div>' + esc(lang) + '</span>' : '') +
        '<span class="repo-meta-item"><i class="fa-regular fa-star"></i>' + fmtNum(stars) + '</span>' +
        '<span class="repo-meta-item"><i class="fa-solid fa-code-fork"></i>' + fmtNum(forks) + '</span>' +
      '</div>';

    card.addEventListener("click", function () {
      window.open(url, "_blank");
    });
    grid.appendChild(card);
  });
}

/* ════════════════════════════════════════════════════
   18.  EMPTY CANVAS  (particle network on welcome screen)
   ════════════════════════════════════════════════════ */
function initEmptyCanvas() {
  var canvas = q("#empty-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var particles = [];
  var W, H;

  function resize() {
    var parent = canvas.parentElement;
    W = canvas.width  = parent.offsetWidth;
    H = canvas.height = parent.offsetHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.22;
    this.vy = (Math.random() - 0.5) * 0.22;
    this.a  = Math.random() * 0.4 + 0.08;
  }

  Particle.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  };

  function init() {
    resize();
    particles = [];
    var n = Math.min(80, Math.floor(W * H / 10000));
    for (var i = 0; i < n; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      p.update();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = "rgba(0,229,255," + p.a + ")";
      ctx.fill();
    });
    for (var i = 0; i < particles.length; i++) {
      for (var j = i+1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(0,229,255," + (0.08*(1-d/100)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", init);
  init(); draw();
}

/* ════════════════════════════════════════════════════
   19.  DATA NORMALIZERS  (make any API shape work)
   ════════════════════════════════════════════════════ */

/** Extract a numeric developer score */
function extractScore(data) {
  if (data === null || data === undefined) return null;
  if (typeof data === "number") return data;
  if (typeof data === "string") { var n = parseFloat(data); return isNaN(n) ? null : n; }
  if (typeof data === "object") {
    var keys = ["score","totalScore","developerScore","overallScore","total","value"];
    for (var k of keys) {
      if (data[k] !== undefined && !isNaN(Number(data[k]))) return Number(data[k]);
    }
  }
  return null;
}

/** Extract hire score from recruiter data */
function extractHireScore(data) {
  if (data === null || data === undefined) return null;
  if (typeof data === "number") return data;
  if (typeof data === "object") {
    var keys = ["hireScore","score","recruitScore","rating","overallScore"];
    for (var k of keys) {
      if (data[k] !== undefined && !isNaN(Number(data[k]))) return Number(data[k]);
    }
  }
  return null;
}

/** Extract sub-score bars [{label,value}] */
function extractScoreBars(data) {
  if (!data || typeof data !== "object") return [];
  var skip = new Set(["score","totalScore","developerScore","overallScore","summary","description","feedback","report"]);
  return Object.entries(data)
    .filter(function (e) { return !skip.has(e[0]) && typeof e[1] === "number" && e[1] <= 100; })
    .slice(0,5)
    .map(function (e) { return { label: camelCase(e[0]), value: e[1] }; });
}

/** Extract text body from various response shapes */
function extractText(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    var keys = ["summary","report","description","content","feedback","overview","text","body","analysis"];
    for (var k of keys) {
      if (data[k] && typeof data[k] === "string") return data[k];
    }
    /* Last resort: first long string value */
    for (var v of Object.values(data)) {
      if (typeof v === "string" && v.length > 40) return v;
    }
  }
  return "";
}

/** Extract a named field from an object by trying multiple keys */
function extractField(obj, keys) {
  if (!obj || typeof obj !== "object") return "";
  for (var k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) {
      var v = obj[k];
      if (Array.isArray(v)) return v.join(", ");
      return String(v);
    }
  }
  return "";
}

/** Extract bullet-point insights from recruiter object */
function extractListItems(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.map(function (x) { return typeof x === "string" ? x : JSON.stringify(x); });
  if (typeof data === "object") {
    /* Find the first array field */
    var arr = Object.values(data).find(function (v) { return Array.isArray(v); });
    if (arr) return arr.map(function (x) { return typeof x === "string" ? x : (x.text || x.insight || JSON.stringify(x)); });
    /* Or collect string values */
    return Object.values(data)
      .filter(function (v) { return typeof v === "string" && v.length > 15; })
      .slice(0, 7);
  }
  if (typeof data === "string") return data.split(/\n/).filter(function (s) { return s.trim().length > 10; });
  return [];
}

/** Normalize language data to [{name, pct}] */
function normalizeLangs(data) {
  if (!data) return [];
  var result = [];

  if (typeof data === "object" && !Array.isArray(data)) {
    result = Object.entries(data).map(function (e) {
      return { name: e[0], pct: parseFloat(e[1]) || 0 };
    });
  } else if (Array.isArray(data)) {
    result = data.map(function (item) {
      if (typeof item === "string") return { name: item, pct: 0 };
      return { name: item.name || item.language || "Unknown", pct: parseFloat(item.percentage || item.percent || item.count || item.value || 0) };
    });
  } else if (typeof data === "string") {
    return [];
  }

  return result.filter(function (l) { return l.name; })
    .sort(function (a,b) { return b.pct - a.pct; });
}

/** Normalize any data to an array of items */
function normalizeList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    var arr = Object.values(data).find(function (v) { return Array.isArray(v); });
    if (arr) return arr;
    return Object.entries(data).map(function (e) { return { title: camelCase(e[0]), description: String(e[1]) }; });
  }
  if (typeof data === "string") {
    return data.split(/\n/)
      .map(function (s) { return s.trim().replace(/^[-*•\d\.]+\s*/,""); })
      .filter(function (s) { return s.length > 5; });
  }
  return [];
}
/** Normalize interview questions to array of strings */
function normalizeQuestions(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(function (q) {
      if (typeof q === "string") return q;
      return q.question || q.text || q.content || q.q || JSON.stringify(q);
    });
  }
  if (typeof data === "object") {
    var arr = Object.values(data).find(function (v) { return Array.isArray(v); });
    if (arr) return arr.map(function (q) { return typeof q === "string" ? q : (q.question || q.text || JSON.stringify(q)); });
    return Object.values(data).filter(function (v) { return typeof v === "string" && v.length > 8; });
  }
  if (typeof data === "string") {
    return data.split(/\n|\?/)
      .map(function (s) { return s.trim().replace(/^\d+[\.\)]\s*/,""); })
      .filter(function (s) { return s.length > 8; })
      .map(function (s) { return s.endsWith("?") ? s : s + "?"; });
  }
  return [];
}

/** Normalize github response to get repos array */
function normalizeRepos(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    var arr = Object.values(data).find(function (v) { return Array.isArray(v); });
    if (arr) return arr;
  }
  return [];
}

/* ════════════════════════════════════════════════════
   20.  UTILITIES
   ════════════════════════════════════════════════════ */

function q(selector)   { return document.querySelector(selector); }
function qAll(sel)     { return document.querySelectorAll(sel); }

function make(tag, cls) {
  var el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}

function setText(selector, text) {
  var el = q(selector);
  if (el) el.textContent = String(text || "");
}

function esc(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(String(str || "")));
  return div.innerHTML;
}

function trunc(str, max) {
  str = String(str || "");
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function fmtNum(n) {
  n = Number(n) || 0;
  if (n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/,"") + "k";
  return String(n);
}

function fmtDate(str) {
  if (!str) return "";
  var d = new Date(str);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
}

function camelCase(str) {
  return str.replace(/([A-Z])/g," $1").replace(/^./, function (c) { return c.toUpperCase(); }).trim();
}

function getHireLabel(score) {
  if (score >= 80) return "Highly Recommended";
  if (score >= 60) return "Recommended";
  if (score >= 40) return "Consider";
  return "Needs Review";
}

function noData(icon, msg) {
  return '<div class="no-data"><i class="fa-solid fa-' + icon + '"></i><span>' + esc(msg) + '</span></div>';
}

function updateTopbarTime() {
  /* optional: show nothing or a small clock */
}
async function analyzeResume() {
  const resumeText = document.getElementById("resume-text").value.trim();
  const targetRole = document.getElementById("target-role").value;

  if (!resumeText) {
    showToast("Please paste your resume text first.");
    return;
  }

  const response = await fetch("/resume/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      resumeText,
      targetRole
    })
  });

  const data = await response.json();

  document.getElementById("resume-result").innerHTML = `
    <div class="resume-score-box">
      <div class="resume-score-num">${data.atsScore}</div>
      <div>ATS Score for ${data.targetRole}</div>
    </div>

    <div class="resume-result-section">
      <h4>Matched Skills</h4>
      <ul>${data.matchedSkills.map(skill => `<li>${skill}</li>`).join("")}</ul>
    </div>

    <div class="resume-result-section">
      <h4>Missing Skills</h4>
      <ul>${data.missingSkills.map(skill => `<li>${skill}</li>`).join("") || "<li>No missing skills</li>"}</ul>
    </div>

    <div class="resume-result-section">
      <h4>Suggestions</h4>
      <ul>${data.suggestions.map(s => `<li>${s}</li>`).join("")}</ul>
    </div>
  `;
}
async function analyzeResumePdf() {
  const fileInput = document.getElementById("resume-file");
  const file = fileInput.files[0];

  if (!file) {
    showToast("Please choose a resume PDF first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/resume-upload/analyze", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  document.getElementById("resume-result").innerHTML = `
    <div class="resume-score-box">
      <div class="resume-score-num">${data.overallAtsScore}</div>
      <div>Overall ATS Score</div>
      <div>${data.matchLevel}</div>
    </div>

    <h4>Best Suitable Role</h4>
    <p>${data.bestRole}</p>

    <h4>Top Matching Roles</h4>
    <ul>
      ${data.roleMatches.map(r => `<li>${r.role} - ${r.score}%</li>`).join("")}
    </ul>

    <h4>Matched Skills</h4>
    <ul>
      ${data.matchedSkills.map(s => `<li>${s}</li>`).join("")}
    </ul>

    <h4>Missing Skills</h4>
    <ul>
      ${data.missingSkills.slice(0, 10).map(s => `<li>${s}</li>`).join("")}
    </ul>

    <h4>Suggestions</h4>
    <ul>
      ${data.suggestions.map(s => `<li>${s}</li>`).join("")}
    </ul>
  `;
}
async function downloadAtsReport() {
  const fileInput = document.getElementById("resume-file");
  const file = fileInput.files[0];

  if (!file) {
    showToast("Please upload a resume PDF first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/resume-report/download", {
    method: "POST",
    body: formData
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "DevIntel_ATS_Report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}
async function loadResumeHistory() {
  const response = await fetch("/resume-history");
  const data = await response.json();

  const box = document.getElementById("resume-history-list");

  if (!data || data.length === 0) {
    box.innerHTML = "<p>No resume history found.</p>";
    return;
  }

  box.innerHTML = data.map(item => `
    <div class="glass-card" style="margin-bottom:12px;">
      <h3>${item.fileName}</h3>
      <p>ATS Score: ${item.atsScore}</p>
      <p>Best Role: ${item.bestRole}</p>
      <p>Match Level: ${item.matchLevel}</p>
      <p>Date: ${item.analyzedAt}</p>
    </div>
  `).join("");
}