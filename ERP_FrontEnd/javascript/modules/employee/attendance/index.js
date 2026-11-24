(() => {
  "use strict";

  const monthFilter = document.querySelector("[data-attendance-month]");
  const yearFilter = document.querySelector("[data-attendance-year]");
  const rows = Array.from(document.querySelectorAll("tbody tr[data-month]"));
  const emptyState = document.querySelector("[data-empty-state]");
  if (!monthFilter || !yearFilter) return;

  function filterAttendance() {
    let visible = 0;
    rows.forEach((row) => {
      const matchesMonth = row.dataset.month === monthFilter.value;
      const matchesYear = row.dataset.year === yearFilter.value;
      row.hidden = !(matchesMonth && matchesYear);
      if (!row.hidden) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  }

  monthFilter.addEventListener("change", filterAttendance);
  yearFilter.addEventListener("change", filterAttendance);
  filterAttendance();
})();