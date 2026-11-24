(() => {
  "use strict";

  const filters = Array.from(document.querySelectorAll("[data-material-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-material-card]"));
  const emptyState = document.querySelector("[data-empty-state]");
  if (!filters.length || !cards.length) return;

  function filterResources() {
    const subject = document.querySelector('[data-material-filter="subject"]').value;
    const type = document.querySelector('[data-material-filter="type"]').value;
    let visible = 0;

    cards.forEach((card) => {
      const subjectMatches = subject === "ALL" || card.dataset.subject === subject;
      const typeMatches = type === "ALL" || card.dataset.type === type;
      card.hidden = !(subjectMatches && typeMatches);
      if (!card.hidden) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible > 0;
  }

  filters.forEach((filter) => filter.addEventListener("change", filterResources));
  filterResources();
})();