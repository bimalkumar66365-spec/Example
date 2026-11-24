(() => {
  "use strict";

  const filter = document.querySelector("[data-day-filter]");
  const rows = Array.from(document.querySelectorAll("tbody tr[data-day]"));
  if (!filter || !rows.length) return;

  const today = new Intl.DateTimeFormat("en", { weekday: "long" }).format(new Date());
  const hasToday = rows.some((row) => row.dataset.day === today);
  filter.value = filter.value === "TODAY" ? (hasToday ? today : "ALL") : filter.value;

  function showSelectedDay() {
    let visible = 0;
    rows.forEach((row) => {
      const show = filter.value === "ALL" || row.dataset.day === filter.value;
      row.hidden = !show;
      if (show) visible += 1;
    });
    const emptyState = document.querySelector("[data-empty-state]");
    if (emptyState) emptyState.hidden = visible > 0;
  }

  filter.addEventListener("change", showSelectedDay);
  showSelectedDay();
})();