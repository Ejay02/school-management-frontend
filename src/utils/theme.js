export function adjustColorBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = R > 0 ? R : 0;
  G = G > 0 ? G : 0;
  B = B > 0 ? B : 0;

  const rHex = R.toString(16).padStart(2, "0");
  const gHex = G.toString(16).padStart(2, "0");
  const bHex = B.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

export function updateCssVariables(primary, secondary) {
  if (!primary || !secondary) return;
  let styleEl = document.getElementById("custom-theme-styles");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "custom-theme-styles";
    document.head.appendChild(styleEl);
  }

  const primaryHover = adjustColorBrightness(primary, -12);
  const secondaryHover = adjustColorBrightness(secondary, -12);

  styleEl.innerHTML = `
    :root {
      --color-primary: ${primary};
      --color-primary-hover: ${primaryHover};
      --color-secondary: ${secondary};
      --color-secondary-hover: ${secondaryHover};
    }

    /* Target Tailwind Indigo backgrounds, text, and borders */
    .bg-indigo-500 { background-color: var(--color-primary) !important; }
    .bg-indigo-650 { background-color: var(--color-primary) !important; }
    .bg-indigo-600 { background-color: var(--color-primary) !important; }
    .bg-indigo-700 { background-color: var(--color-primary-hover) !important; }
    .hover\\:bg-indigo-50:hover { background-color: rgba(99, 102, 241, 0.05) !important; }
    .hover\\:bg-indigo-700:hover { background-color: var(--color-primary-hover) !important; }
    
    .text-indigo-600 { color: var(--color-primary) !important; }
    .text-indigo-700 { color: var(--color-primary-hover) !important; }
    .hover\\:text-indigo-700:hover { color: var(--color-primary-hover) !important; }

    .border-indigo-300 { border-color: var(--color-primary) !important; }
    .border-indigo-500 { border-color: var(--color-primary) !important; }
    .focus\\:border-indigo-500:focus { border-color: var(--color-primary) !important; }
    .focus\\:ring-indigo-500:focus { --tw-ring-color: var(--color-primary) !important; }
    .focus\\:ring-indigo-200:focus { --tw-ring-color: rgba(99, 102, 241, 0.2) !important; }

    /* Target general purple indicators */
    .bg-eduPurple { background-color: var(--color-primary) !important; }
    .bg-eduPurpleLight { background-color: rgba(99, 102, 241, 0.1) !important; }
    .text-eduPurple { color: var(--color-primary) !important; }

    /* Gradients */
    .from-indigo-600 {
      --tw-gradient-from: var(--color-primary) !important;
      --tw-gradient-to: var(--color-secondary) !important;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    }
    .to-purple-600 {
      --tw-gradient-to: var(--color-secondary) !important;
    }
    .via-violet-600 {
      --tw-gradient-to: var(--color-secondary) !important;
    }
  `;
}

export function loadSavedTheme() {
  const theme = localStorage.getItem("school_theme");
  if (theme) {
    try {
      const parsed = JSON.parse(theme);
      if (parsed.primary && parsed.secondary) {
        updateCssVariables(parsed.primary, parsed.secondary);
      }
    } catch {
      localStorage.removeItem("school_theme");
    }
  }
}
