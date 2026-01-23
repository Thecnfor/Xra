export const themeInitScript = `(() => {
  const storageKey = "theme";
  const eventName = "xra:theme";
  const root = document.documentElement;
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const normalizeMode = (value) =>
    value === "light" || value === "dark" || value === "system" ? value : "system";
  const getSystemResolved = () => (mql.matches ? "dark" : "light");
  const applyResolved = (resolved, mode) => {
    root.classList.toggle("dark", resolved === "dark");
    root.classList.toggle("light", resolved === "light");
    root.dataset.themeMode = mode;
    root.dataset.themeResolved = resolved;
    root.style.colorScheme = resolved;
    try {
      window.dispatchEvent(new CustomEvent(eventName, { detail: { mode, resolved } }));
    } catch {}
  };
  const readStoredMode = () => {
    try {
      return normalizeMode(localStorage.getItem(storageKey));
    } catch {
      return "system";
    }
  };
  const applyMode = (mode) => {
    const resolved = mode === "system" ? getSystemResolved() : mode;
    applyResolved(resolved, mode);
  };

  applyMode(readStoredMode());

  const onSystemChange = () => {
    const mode = readStoredMode();
    if (mode !== "system") return;
    applyMode("system");
  };

  if (mql.addEventListener) mql.addEventListener("change", onSystemChange);
  else mql.addListener(onSystemChange);

  window.addEventListener("storage", (e) => {
    if (e.key !== storageKey) return;
    applyMode(normalizeMode(e.newValue));
  });
})();`;

