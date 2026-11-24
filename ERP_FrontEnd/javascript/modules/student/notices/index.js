(() => {
  "use strict";

  const search = document.querySelector("[data-notice-search]");
  const notices = Array.from(document.querySelectorAll(".searchable-card"));
  const emptyState = document.querySelector("[data-empty-state]");
  if (!search || !notices.length) return;

  function searchNotices() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;

    notices.forEach((notice) => {
      const match = notice.textContent.toLowerCase().includes(query);
      notice.hidden = !match;
      if (match) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible > 0;
  }

  search.addEventListener("input", searchNotices);
  searchNotices();
})();