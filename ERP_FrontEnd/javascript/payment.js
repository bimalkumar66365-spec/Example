(() => {
  "use strict";

  const query = new URLSearchParams(window.location.search);
  const type = query.get("type");
  const titles = {
    regular: ["Regular exam booking", "Subjects linked to your active enrollment."],
    backlog: ["Backlog exam booking", "Eligible backlog subjects selected from sample records."],
    fee: ["Fee payment", "Pending fee record supplied by the Accounts Cell."]
  };
  const selected = titles[type] || [
    "Payment hand-off",
    "Review the items supplied by the college system."
  ];

  document.querySelector("#payment-title").textContent = selected[0];
  document.querySelector("#payment-description").textContent = selected[1];

  const backLink = document.querySelector("#back-to-module");
  if (type === "backlog") backLink.href = "student/backlog-exam/index.html";
  if (type === "fee") backLink.href = "student/fees/index.html";

  const subjects = {
    "CS-201": "Data Structures",
    "CS-204": "Discrete Mathematics",
    "CS-205": "Digital Logic"
  };
  const codes = (query.get("subjects") || "")
    .split(",")
    .filter(function (code) {
      return Object.prototype.hasOwnProperty.call(subjects, code);
    });
  const feeCode = query.get("code");
  let items;

  if (type === "backlog" && codes.length) {
    items = codes.map(function (code) {
      return code + " · " + subjects[code];
    });
  } else if (type === "regular") {
    items = ["All regular subjects linked to active enrollment"];
  } else if (type === "fee") {
    items = ["Fee item · " + (feeCode || "supplied by Accounts Cell")];
  } else {
    items = ["Items supplied by the college system"];
  }

  const list = document.querySelector("#payment-items");
  list.replaceChildren.apply(list, items.map(function (text) {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
})();
