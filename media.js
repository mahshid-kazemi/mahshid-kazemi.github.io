/* Original images stay intact. Color changes cross-fade two SVG-filtered layers. */
(() => {
  const palettes = [
    ["original", "Original", "Unchanged original screenshot"],
    ["ocean", "Ocean", "Navy, blue and copper"],
    ["amber", "Amber", "Gold and violet"],
  ];
  const matrices = {
    ocean:
      ".6126 .7152 -.3278 0 0 .3126 .7152 -.0278 0 0 -.2674 .7152 .5522 0 0 0 0 0 1 0",
    amber:
      ".4126 .7152 -.1278 0 0 .4626 .7152 -.1778 0 0 -.1374 .7152 .4222 0 0 0 0 0 1 0",
  };
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  defs.classList.add("palette-defs");
  defs.setAttribute("width", "0");
  defs.setAttribute("height", "0");
  defs.setAttribute("aria-hidden", "true");
  defs.setAttribute("focusable", "false");
  defs.innerHTML =
    "<defs>" +
    Object.entries(matrices)
      .map(
        ([name, values]) =>
          `<filter id="image-tone-${name}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${values}"/></filter>`,
      )
      .join("") +
    "</defs>";
  document.body.prepend(defs);
  let current = "original";
  try {
    current = localStorage.getItem("mahshid-image-palette") || current;
  } catch {}
  if (!palettes.some(([key]) => key === current)) current = "original";
  const stacks = [];
  function wrapImage(image) {
    const stack = document.createElement("span");
    stack.className = "palette-image";
    image.before(stack);
    stack.append(image);
    image.classList.add("palette-original");
    for (const [key] of palettes.slice(1)) {
      const layer = image.cloneNode(false);
      layer.removeAttribute("id");
      layer.className = "tint-layer";
      layer.dataset.tone = key;
      layer.alt = "";
      layer.setAttribute("aria-hidden", "true");
      stack.append(layer);
    }
    stacks.push(stack);
    return stack;
  }
  document.querySelectorAll(".gallery .preview > img").forEach(wrapImage);
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxStack = wrapImage(lightboxImage);
  function toolbar(before, label) {
    const group = document.createElement("div");
    group.className = "palette-toolbar";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    group.innerHTML =
      '<span class="palette-label">Image palette</span>' +
      palettes
        .map(
          ([key, label, title]) =>
            `<button type="button" data-palette-choice="${key}" aria-pressed="false" title="${title}"><span class="palette-swatch swatch-${key}" aria-hidden="true"></span>${label}</button>`,
        )
        .join("");
    before.before(group);
  }
  document
    .querySelectorAll(".gallery")
    .forEach((gallery, index) =>
      toolbar(gallery, `Image color palette for case study ${index + 1}`),
    );
  toolbar(lightboxStack, "Preview image color palette");
  function sync() {
    stacks.forEach((stack) => (stack.dataset.palette = current));
    document
      .querySelectorAll("[data-palette-choice]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.paletteChoice === current),
        ),
      );
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-palette-choice]");
    if (!button) return;
    current = button.dataset.paletteChoice;
    try {
      localStorage.setItem("mahshid-image-palette", current);
    } catch {}
    sync();
  });
  window.PortfolioMedia = {
    syncPreview() {
      lightboxStack
        .querySelectorAll(".tint-layer")
        .forEach((layer) => (layer.src = lightboxImage.src));
      sync();
    },
  };
  sync();

  // Native non-modal popover: outside click, Escape, and keyboard access.
  const portrait = document.getElementById("portrait-card");
  if (!portrait || typeof portrait.showPopover !== "function") return;
  const triggers = [...document.querySelectorAll(".portrait-trigger")];
  let activeTrigger;
  function positionPortrait() {
    if (!activeTrigger) return;
    const rect = activeTrigger.getBoundingClientRect();
    const width = Math.min(268, innerWidth - 32);
    portrait.style.width = width + "px";
    const height = portrait.offsetHeight;
    portrait.style.left =
      Math.max(16, Math.min(rect.left, innerWidth - width - 16)) + "px";
    portrait.style.top =
      Math.max(16, Math.min(rect.bottom + 12, innerHeight - height - 16)) +
      "px";
  }
  triggers.forEach((trigger) => {
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-controls", "portrait-card");
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      if (portrait.matches(":popover-open") && activeTrigger === trigger) {
        portrait.hidePopover();
        return;
      }
      activeTrigger = trigger;
      portrait.showPopover();
      positionPortrait();
      triggers.forEach((item) =>
        item.setAttribute("aria-expanded", String(item === trigger)),
      );
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
        trigger.click();
      }
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && portrait.matches(":popover-open")) {
      event.preventDefault();
      portrait.hidePopover();
      activeTrigger?.focus();
    }
  });
  portrait.addEventListener("toggle", (event) => {
    if (event.newState === "closed")
      triggers.forEach((trigger) =>
        trigger.setAttribute("aria-expanded", "false"),
      );
  });
  portrait.querySelector(".portrait-close").addEventListener("click", () => {
    portrait.hidePopover();
    activeTrigger?.focus();
  });
  addEventListener("resize", positionPortrait, { passive: true });
  addEventListener(
    "scroll",
    () => {
      if (portrait.matches(":popover-open")) portrait.hidePopover();
    },
    { passive: true },
  );
})();
