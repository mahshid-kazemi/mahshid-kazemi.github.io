const menu = document.querySelector(".menu-toggle");
const links = document.getElementById("nav-links");
menu.hidden = false;
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  links.classList.remove("open");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  links.classList.toggle("open", open);
});
links.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("nav")) closeMenu();
});
const dialog = document.getElementById("lightbox");
const image = document.getElementById("lightbox-image");
let opener;
document.querySelectorAll(".preview").forEach((link) =>
  link.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = link.dataset.caption;
    document.getElementById("full-image").href = link.href;
    document.getElementById("lightbox-caption").textContent =
      link.dataset.caption;
    dialog.showModal();
  }),
);
document
  .getElementById("close-preview")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => opener?.focus());
document.getElementById("copy").addEventListener("click", async () => {
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText("kazemi.mahshid75@gmail.com");
    status.textContent = "Email address copied.";
  } catch {
    status.textContent = "Email: kazemi.mahshid75@gmail.com";
  }
});
const sections = [...document.querySelectorAll("main section")];
function updateNavigation() {
  const current =
    sections
      .filter((s) => s.getBoundingClientRect().top <= innerHeight * 0.4)
      .at(-1) || sections[0];
  links.querySelectorAll("a").forEach((a) => {
    const active = a.hash === "#" + current.id;
    a.classList.toggle("on", active);
    if (active) a.setAttribute("aria-current", "location");
    else a.removeAttribute("aria-current");
  });
  document.getElementById("bar").style.transform =
    `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
}
addEventListener("scroll", updateNavigation, { passive: true });
updateNavigation();
if (
  matchMedia("(min-width: 1025px)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  import("./network.js").then((module) => module.initNetwork()).catch(() => {});
}
