(() => {
  "use strict";

  const yearFilter = document.querySelector("[data-salary-year]");
  const rows = Array.from(document.querySelectorAll("tbody tr[data-salary-year]"));
  const emptyState = document.querySelector("[data-empty-state]");
  if (!yearFilter) return;

  function filterSalary() {
    const year = yearFilter.value.slice(0, 4);
    let visible = 0;

    rows.forEach((row) => {
      row.hidden = row.dataset.salaryYear !== year;
      if (!row.hidden) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible > 0;
  }

  yearFilter.addEventListener("change", filterSalary);
  filterSalary();
})();