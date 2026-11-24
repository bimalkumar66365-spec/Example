(() => {
  "use strict";

  const search = document.querySelector("[data-faculty-search]");
  const department = document.querySelector("[data-faculty-department]");
  const cards = Array.from(document.querySelectorAll("[data-faculty-card]"));
  const emptyState = document.querySelector("[data-empty-state]");
  if (!search || !department) return;

  function filterFaculty() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const matchesName = !query ||
        (card.dataset.name + " " + card.textContent).toLowerCase().includes(query);
      const matchesDepartment = department.value === "ALL" ||
        card.dataset.department === department.value;
      card.hidden = !(matchesName && matchesDepartment);
      if (!card.hidden) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible > 0;
  }

  search.addEventListener("input", filterFaculty);
  department.addEventListener("change", filterFaculty);
  filterFaculty();
})();