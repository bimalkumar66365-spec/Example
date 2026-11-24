(() => {
  "use strict";

  const subject = document.querySelector("[data-subject-contact]");
  const contact = document.querySelector("[data-contact-output]");
  if (!subject || !contact) return;

  subject.addEventListener("change", () => {
    const selected = subject.selectedOptions[0];
    contact.textContent = selected.dataset.contact ||
      "Contact details are not available for this subject.";
  });
})();