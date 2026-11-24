(() => {
  "use strict";

  const role = document.body.dataset.role || "student";
  const currentModule = document.body.dataset.module || "dashboard";
  const pageTitle = document.body.dataset.title || "Campus services";
  const pageDescription = document.body.dataset.description || "";
  const root = document.querySelector("#app-root");
  const template = document.querySelector("#module-content-template");

  const portals = {
    student: {
      name: "Student workspace",
      badge: "STUDENT CONSOLE",
      identity: "Demo Student",
      code: "Roll DEMO-0001 · sample",
      mark: "S",
      modules: [
        ["dashboard", "Overview", "⌂"],
        ["timetable", "Timetable", "◷"],
        ["attendance", "Attendance", "✓"],
        ["notices", "Notices", "▤"],
        ["regular-exam", "Regular exam", "▣"],
        ["backlog-exam", "Backlog exam", "↻"],
        ["materials", "Study materials", "▧"],
        ["academic-details", "Academic details", "◈"],
        ["faculty", "Faculty directory", "♙"],
        ["leave", "Leave application", "✎"],
        ["requests", "Requests", "◎"],
        ["profile", "My profile", "○"],
        ["fees", "Fees", "¤"]
      ]
    },
    teacher: {
      name: "Teacher workspace",
      badge: "FACULTY CONSOLE",
      identity: "Demo Teacher",
      code: "Faculty DEMO-F001 · sample",
      mark: "T",
      modules: [
        ["dashboard", "Overview", "⌂"],
        ["profile", "My profile", "○"],
        ["classes", "Classes & subjects", "▦"],
        ["timetable", "Timetable", "◷"],
        ["attendance", "Student attendance", "✓"],
        ["marks", "Marks & results", "▤"],
        ["materials", "Study materials", "▧"],
        ["notices", "Notices", "▤"],
        ["applications", "Applications & requests", "◎"],
        ["salary", "Salary & payslips", "¤"],
        ["employee-attendance", "Employee attendance", "◉"]
      ]
    },
    employee: {
      name: "Employee attendance",
      badge: "STAFF CONSOLE",
      identity: "Demo Employee",
      code: "Employee record · sample",
      mark: "E",
      modules: [["attendance", "My attendance", "◉"]]
    }
  };

  const portal = portals[role] || portals.student;
  const activeModule = portal.modules.find((item) => item[0] === currentModule);
  const headingGlyph = activeModule ? activeModule[2] : portal.mark;
  const rootLink = "../../index.html";
  const dashboardLink = role === "employee" ? "../../index.html" : "../dashboard/index.html";
  const profileLink = role === "employee" ? "../../index.html" : "../profile/index.html";
  const roleParam = role === "student" ? "STUDENT" : role === "teacher" ? "TEACHER" : "EMPLOYEE";

  if (!root) return;

  const navigation = portal.modules.map(function (item) {
    const slug = item[0];
    const label = item[1];
    const icon = item[2];
    const href = role === "employee" ? "index.html" : "../" + slug + "/index.html";
    const active = slug === currentModule;

    return '<a class="nav-link' + (active ? " is-active" : "") + '" href="' + href + '"' +
      (active ? ' aria-current="page"' : "") + '><span class="nav-icon" aria-hidden="true">' +
      icon + '</span><span>' + label + "</span></a>";
  }).join("");
  const navigationSearch = portal.modules.length > 4
    ? '<label class="nav-search-label" for="module-search">Find a module</label>' +
      '<input class="nav-search" id="module-search" type="search" data-nav-search ' +
      'aria-label="Search portal modules" placeholder="Search modules" autocomplete="off">' +
      '<p class="nav-search-empty" data-nav-search-empty role="status" hidden>No modules match.</p>'
    : "";

  root.innerHTML = [
    '<div class="portal-shell" data-role="' + role + '">',
    '<button class="sidebar-scrim" type="button" data-menu-close aria-label="Close navigation"></button>',
    '<aside class="sidebar" id="portal-sidebar" aria-label="' + portal.name + '">',
    '<a class="brand sidebar-brand" href="' + rootLink + '"><span class="brand-mark" aria-hidden="true">A</span>',
    '<span class="brand-name">Astra<span>Campus</span></span></a>',
    '<div class="workspace-label">' + portal.badge + '</div>',
    navigationSearch,
    '<nav class="portal-nav" aria-label="' + portal.name + ' navigation">' + navigation + '</nav>',
    '<div class="sidebar-bottom"><div class="sidebar-help"><span class="help-icon" aria-hidden="true">?</span>',
    '<span><b>Need help?</b><small>Contact your college office.</small></span></div>',
    '<a class="signout-link" href="../../login.html?role=' + roleParam + '">Sign out <span aria-hidden="true">↗</span></a></div>',
    '</aside><div class="portal-main"><header class="topbar">',
    '<button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="portal-sidebar" aria-label="Open navigation">☰</button>',
    '<div class="breadcrumb"><a href="' + dashboardLink + '">AstraCampus</a><span aria-hidden="true">/</span><span>' + pageTitle + '</span></div>',
    '<div class="topbar-actions"><button class="command-trigger" type="button" data-command-open aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">',
    '<span class="command-search-icon" aria-hidden="true">⌕</span><span class="command-trigger-label">Quick jump</span><kbd data-command-shortcut>Ctrl K</kbd></button>',
    '<a class="user-chip" href="' + profileLink + '"><span class="user-avatar" aria-hidden="true">' + portal.mark + '</span>',
    '<span><b>' + portal.identity + '</b><small>' + portal.code + '</small></span><span class="profile-chevron" aria-hidden="true">⌄</span></a></div>',
    '</header><main class="portal-content" id="main-content" tabindex="-1">',
    '<div class="demo-strip"><span class="status-dot" aria-hidden="true"></span><b>PREVIEW MODE</b>',
    '<span>Sample data only · no college account is connected.</span></div>',
    '<section class="page-heading"><div><p class="eyebrow"><span class="eyebrow-dot"></span>' + portal.name + '</p>',
    '<h1>' + pageTitle + '</h1><p>' + pageDescription + '</p></div>',
    '<div class="heading-aside"><span class="heading-date" data-local-date></span><span class="heading-time"><span class="heading-live-dot" aria-hidden="true"></span><time data-local-time></time> local time</span></div>',
    '<span class="heading-glyph" aria-hidden="true">' + headingGlyph + '</span></section>',
    '<div class="module-grid" id="module-content"></div>',
    '<footer class="portal-footer"><span>AstraCampus · Academic Service Portal</span>',
    '<span>Access follows the signed-in account and college permissions.</span></footer>',
    '</main></div></div>',
    '<dialog class="command-dialog" data-command-dialog aria-labelledby="command-title">',
    '<div class="command-dialog-head"><div><span class="eyebrow"><span class="eyebrow-dot"></span>QUICK NAVIGATION</span><h2 id="command-title">Where do you want to go?</h2></div>',
    '<button class="command-close" type="button" data-command-close aria-label="Close quick navigation">Esc</button></div>',
    '<label class="command-input-wrap"><span aria-hidden="true">⌕</span><input type="search" data-command-search placeholder="Search this workspace…" autocomplete="off" aria-label="Search workspace modules"></label>',
    '<nav class="command-results" data-command-results aria-label="Workspace modules"></nav>',
    '<p class="command-empty" data-command-empty role="status" hidden>No matching modules. Try another search.</p>',
    '<div class="command-dialog-foot"><span>Navigate with the results below</span><span>Ctrl / ⌘ + K to open · Esc to close</span></div>',
    '</dialog>'
  ].join("");

  const content = document.querySelector("#module-content");
  if (template && content) content.appendChild(template.content.cloneNode(true));
  const commandResults = document.querySelector("[data-command-results]");
  if (commandResults) {
    document.querySelectorAll(".portal-nav .nav-link").forEach((link) => {
      const result = link.cloneNode(true);
      result.classList.add("command-link");
      commandResults.appendChild(result);
    });
  }
  document.title = pageTitle + " | AstraCampus";
})();
