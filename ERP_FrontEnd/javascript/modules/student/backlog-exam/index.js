(() => {
  "use strict";

  const choices = Array.from(document.querySelectorAll('input[name="backlog"]'));
  const count = document.querySelector("[data-selection-count]");
  const names = document.querySelector("[data-selection-names]");
  const continueButton = document.querySelector("[data-payment-action]");

  function updateSummary() {
    const selected = choices.filter((choice) => choice.checked);
    if (count) {
      count.textContent = selected.length +
        (selected.length === 1 ? " subject selected" : " subjects selected");
    }
    if (names) {
      names.textContent = selected.length
        ? selected.map((choice) => choice.value + " · " + choice.dataset.subjectName).join("  |  ")
        : "Select subjects to build the final summary.";
    }
    if (continueButton) continueButton.disabled = selected.length === 0;
  }

  choices.forEach((choice) => choice.addEventListener("change", updateSummary));
  continueButton?.addEventListener("click", () => {
    const selected = choices.filter((choice) => choice.checked);
    if (!selected.length) return;

    const codes = selected.map((choice) => choice.value).join(",");
    window.location.href = "../../payment-handoff.html?type=backlog&subjects=" +
      encodeURIComponent(codes);
  });

  updateSummary();
})();