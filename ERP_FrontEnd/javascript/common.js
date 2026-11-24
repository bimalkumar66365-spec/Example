(() => {
  "use strict";

  function showMessage(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("error", Boolean(isError));
  }

  document.querySelectorAll("[data-term-filter]").forEach((filter) => {
    const rows = Array.from(document.querySelectorAll("tbody tr[data-term]"));
    if (!rows.length) return;

    const emptyState = document.querySelector("[data-empty-state]");
    function filterTermRows() {
      let visible = 0;
      rows.forEach((row) => {
        row.hidden = row.dataset.term !== filter.value;
        if (!row.hidden) visible += 1;
      });
      if (emptyState) emptyState.hidden = visible > 0;
    }

    filter.addEventListener("change", filterTermRows);
    filterTermRows();
  });

  const navigationSearch = document.querySelector("[data-nav-search]");
  if (navigationSearch) {
    const links = Array.from(document.querySelectorAll(".portal-nav .nav-link"));
    const emptyState = document.querySelector("[data-nav-search-empty]");

    navigationSearch.addEventListener("input", () => {
      const query = navigationSearch.value.trim().toLowerCase();
      let visible = 0;

      links.forEach((link) => {
        link.hidden = !link.textContent.toLowerCase().includes(query);
        if (!link.hidden) visible += 1;
      });

      if (emptyState) emptyState.hidden = visible > 0;
    });
  }

  const commandDialog = document.querySelector("[data-command-dialog]");
  const commandSearch = document.querySelector("[data-command-search]");
  const commandResults = document.querySelector("[data-command-results]");
  const commandEmpty = document.querySelector("[data-command-empty]");
  const isApplePlatform = /Mac|iPhone|iPad/.test(navigator.platform || "");
  document.querySelectorAll("[data-command-shortcut]").forEach((hint) => {
    hint.textContent = isApplePlatform ? "⌘ K" : "Ctrl K";
  });

  function filterCommandResults() {
    if (!commandSearch || !commandResults) return;
    const query = commandSearch.value.trim().toLowerCase();
    const links = Array.from(commandResults.querySelectorAll(".command-link"));
    let visible = 0;
    links.forEach((link) => {
      link.hidden = !link.textContent.toLowerCase().includes(query);
      if (!link.hidden) visible += 1;
    });
    if (commandEmpty) commandEmpty.hidden = visible > 0;
  }

  function openCommandDialog() {
    if (!commandDialog || typeof commandDialog.showModal !== "function") return;
    commandDialog.showModal();
    if (commandSearch) {
      commandSearch.value = "";
      filterCommandResults();
      commandSearch.focus();
    }
  }

  document.querySelector("[data-command-open]")?.addEventListener("click", openCommandDialog);
  document.querySelector("[data-command-close]")?.addEventListener("click", () => commandDialog?.close());
  commandSearch?.addEventListener("input", filterCommandResults);
  commandDialog?.addEventListener("click", (event) => {
    if (event.target === commandDialog) commandDialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (commandDialog && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (commandDialog?.open) commandDialog.close();
      else openCommandDialog();
    }
  });

  const localDate = document.querySelector("[data-local-date]");
  const localTime = document.querySelector("[data-local-time]");
  if (localDate || localTime) {
    const updateLocalTime = () => {
      const now = new Date();
      if (localDate) {
        localDate.textContent = new Intl.DateTimeFormat(undefined, {
          weekday: "long", month: "short", day: "numeric"
        }).format(now);
      }
      if (localTime) {
        localTime.dateTime = now.toISOString();
        localTime.textContent = new Intl.DateTimeFormat(undefined, {
          hour: "2-digit", minute: "2-digit"
        }).format(now);
      }
    };
    updateLocalTime();
    window.setInterval(updateLocalTime, 30000);
  }

  const landingRoles = {
    student: {
      headline: "Your week, organized.",
      subtitle: "Classes, exams, attendance and student services.",
      link: "student/dashboard/index.html",
      action: "Explore student workspace",
      tiles: [["◷", "Timetable", "Classes and sessions"], ["✓", "Attendance", "Your semester at a glance"], ["▤", "Academic records", "Results and notices"], ["◎", "Student services", "Requests and fees"]]
    },
    teacher: {
      headline: "Teaching, in rhythm.",
      subtitle: "Assigned classes, student records and requests.",
      link: "teacher/dashboard/index.html",
      action: "Explore teacher workspace",
      tiles: [["▦", "Classes", "Subjects and sections"], ["✓", "Attendance", "Assigned sessions"], ["▤", "Results", "Marks and submissions"], ["◎", "Requests", "Items routed to you"]]
    },
    employee: {
      headline: "Your workday, in view.",
      subtitle: "Personal attendance and staff services in one place.",
      link: "employee/attendance/index.html",
      action: "Explore employee workspace",
      tiles: [["◉", "Attendance", "Your monthly record"], ["◷", "Check-in", "Daily time entries"], ["✎", "Leave", "Requests and status"], ["○", "Profile", "Your employee details"]]
    }
  };

  function selectLandingRole(roleName) {
    const roleData = landingRoles[roleName];
    if (!roleData) return;
    document.querySelectorAll("[data-landing-role]").forEach((tab) => {
      const selected = tab.dataset.landingRole === roleName;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const headline = document.querySelector("[data-preview-headline]");
    const subtitle = document.querySelector("[data-preview-subtitle]");
    const action = document.querySelector("[data-preview-action-link]");
    if (headline) headline.textContent = roleData.headline;
    if (subtitle) subtitle.textContent = roleData.subtitle;
    if (action) {
      action.href = roleData.link;
      action.querySelector("[data-preview-action-label]").textContent = roleData.action;
    }
    const previewPanel = document.querySelector("#workspace-preview-grid");
    const selectedTab = document.querySelector('[data-landing-role="' + roleName + '"]');
    if (previewPanel && selectedTab) previewPanel.setAttribute("aria-labelledby", selectedTab.id);
    document.querySelectorAll("[data-preview-tile]").forEach((tile, index) => {
      const data = roleData.tiles[index];
      if (!data) return;
      tile.querySelector("[data-preview-icon]").textContent = data[0];
      tile.querySelector("[data-preview-title]").textContent = data[1];
      tile.querySelector("[data-preview-detail]").textContent = data[2];
    });
  }

  document.querySelectorAll("[data-landing-role]").forEach((tab, index, tabs) => {
    tab.addEventListener("click", () => selectLandingRole(tab.dataset.landingRole));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      selectLandingRole(next.dataset.landingRole);
      next.focus();
    });
  });

  const greeting = document.querySelector("[data-dashboard-greeting]");
  if (greeting) {
    const hour = new Date().getHours();
    greeting.textContent = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  }

  const revealTargetSet = new Set(document.querySelectorAll([
    ".demo-strip", ".page-heading", ".module-grid > *", ".module-grid [class*='-card']", ".module-grid .card",
    ".module-grid article", ".module-grid .metric-card",
    ".module-grid .quick-link", ".module-grid .service-grid > a", ".module-grid .choice-card", ".module-grid .holo-tile",
    ".module-grid .notice-card", ".module-grid .resource-card", ".module-grid .faculty-card", ".module-grid .assignment-card",
    ".module-grid .profile-grid article", ".module-grid .status-list > div", ".module-grid .status",
    ".module-grid .field", ".module-grid .callout", ".module-grid .selection-summary", ".module-grid .contact-chip",
    ".module-grid .resource-icon", ".module-grid .assignment-icon", ".module-grid .faculty-avatar",
    ".module-grid .profile-avatar", ".module-grid .attendance-choice label", ".module-grid .welcome-art",
    ".module-grid .table-wrap", ".module-grid .details-card summary",
    ".module-grid .permission-gate", ".module-grid .file-policy", ".module-grid .details-card",
    ".module-grid .profile-banner", ".module-grid .welcome-grid", ".module-grid .next-class",
    ".module-grid .filter-row", ".module-grid input", ".module-grid select", ".module-grid textarea",
    ".module-grid .data-table tbody tr", ".module-grid .payment-items li", ".module-grid .button", ".module-grid .text-link",
    ".hero-copy", ".hero-visual", ".holo-tile", ".button-row > *", ".preview-switcher button", ".preview-open",
    ".portal-choice-grid .portal-choice", ".feature-rail > div",
    ".auth-layout", ".auth-card > *", ".auth-card .field", ".auth-card .button", ".auth-card input",
    ".auth-card select", ".auth-card textarea", ".payment-main > *", ".payment-card", ".payment-card .payment-items li",
    ".payment-card .button", ".payment-card .form-message",
    ".portal-nav .nav-link", ".sidebar-brand", ".sidebar-bottom", ".topbar .breadcrumb", ".topbar-actions > *"
  ].join(",")));
  const motionBoxSet = new Set();
  document.querySelectorAll("main, .portal-shell, .site-header, .site-footer, .auth-layout, .payment-main").forEach((root) => {
    root.querySelectorAll("div, section, article, li, a, button, input, select, textarea, label, summary, tr, span").forEach((target) => {
      if (target.hidden || target.closest("[hidden]")) return;
      const style = window.getComputedStyle(target);
      const hasBorder = ["Top", "Right", "Bottom", "Left"].some((side) =>
        parseFloat(style["border" + side + "Width"]) > 0 && style["border" + side + "Style"] !== "none"
      );
      const hasBackground = (style.backgroundColor !== "transparent" && !/,\s*0(?:\.0+)?\)$/.test(style.backgroundColor)) || style.backgroundImage !== "none";
      const hasShadow = style.boxShadow !== "none";
      const fieldGroup = target.matches(".field, .filter-row");
      const chromeSurface = target.matches(".sidebar, .topbar, .portal-shell, .portal-main, .portal-content, .site-header, .site-footer, .auth-layout, .payment-main");
      if (hasBorder || hasBackground || hasShadow || fieldGroup) {
        revealTargetSet.add(target);
        if (!target.matches("tr, input, select, textarea") && !chromeSurface) motionBoxSet.add(target);
      }
      if (target.matches("input, select, textarea")) revealTargetSet.add(target);
    });
  });
  const revealTargets = Array.from(revealTargetSet).filter((target) => !target.hidden && !target.closest("[hidden]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealTargets.length && !reduceMotion) {
    const revealObserver = "IntersectionObserver" in window
      ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -36px 0px" })
      : null;
    revealTargets.forEach((target, index) => {
      target.classList.add("motion-reveal");
      if (motionBoxSet.has(target)) target.classList.add("motion-box");
      if (target.matches("input, select, textarea")) target.classList.add("motion-control");
      target.style.setProperty("--motion-delay", Math.min((index % 6) * 75, 375) + "ms");
      if (revealObserver) revealObserver.observe(target);
      else target.classList.add("is-revealed");
    });
    document.body.classList.add("motion-ready");
  }

  document.addEventListener("click", function (event) {
    const toggle = event.target.closest("[data-menu-toggle]");
    const close = event.target.closest("[data-menu-close]");
    const sidebar = document.querySelector(".sidebar");

    if (toggle && sidebar) {
      const open = sidebar.classList.toggle("is-open");
      document.body.classList.toggle("menu-is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    }

    if ((close || event.target.closest(".nav-link")) && sidebar) {
      sidebar.classList.remove("is-open");
      document.body.classList.remove("menu-is-open");
      document.querySelector("[data-menu-toggle]")?.setAttribute("aria-expanded", "false");
    }

    const previewButton = event.target.closest("[data-preview-action]");
    if (previewButton) {
      const scope = previewButton.closest("[data-preview-scope]") || previewButton.parentElement;
      const message = scope && scope.querySelector("[data-form-message]");
      showMessage(message, previewButton.dataset.previewAction ||
        "Preview only. No data was sent or saved.", false);
    }

    const passwordButton = event.target.closest("[data-password-toggle]");
    if (passwordButton) {
      const input = document.querySelector(passwordButton.dataset.passwordToggle);
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      passwordButton.textContent = show ? "Hide" : "Show";
      passwordButton.setAttribute("aria-label", show ? "Hide password" : "Show password");
    }
  });

  document.addEventListener("submit", function (event) {
    const form = event.target.closest("[data-preview-form]");
    if (!form) return;

    event.preventDefault();
    const message = form.querySelector("[data-form-message]");
    const password = form.querySelector('[name="password"]');
    const confirmation = form.querySelector('[name="confirmPassword"]');

    if (!form.checkValidity()) {
      form.reportValidity();
      showMessage(message, "Check the required fields and try again.", true);
      return;
    }

    if (password && confirmation && password.value !== confirmation.value) {
      confirmation.setCustomValidity("Passwords do not match.");
      confirmation.reportValidity();
      confirmation.setCustomValidity("");
      showMessage(message, "The passwords do not match.", true);
      return;
    }

    showMessage(message, form.dataset.previewSuccess ||
      "Preview only. Nothing was submitted or saved.", false);
  });
})();
