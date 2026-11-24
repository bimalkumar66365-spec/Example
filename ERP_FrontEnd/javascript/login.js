(() => {
  "use strict";

  const roleField = document.querySelector("#account-role");
  const roleMessage = document.querySelector("#role-guidance");
  const guidance = {
    STUDENT: "Student access is linked to a verified college account.",
    TEACHER: "Teacher accounts are created and verified by the institution.",
    EMPLOYEE: "Employee access is institution-managed; attendance permissions depend on college rules."
  };

  function updateGuidance() {
    if (roleField && roleMessage) {
      roleMessage.textContent = guidance[roleField.value] || "";
    }
  }

  roleField?.addEventListener("change", updateGuidance);
  updateGuidance();
})();
