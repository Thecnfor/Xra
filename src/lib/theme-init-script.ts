export const themeInitScript = `(() => {
  const eventName = "xra:theme";
  const root = document.documentElement;
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const normalizeTheme = (value) => (value === "light" || value === "dark" ? value : null);
  const getSystemTheme = () => (mql.matches ? "dark" : "light");
  const applyTheme = (theme) => {
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.dataset.themeMode = theme;
    root.dataset.themeResolved = theme;
    root.style.colorScheme = theme;
    try {
      window.dispatchEvent(
        new CustomEvent(eventName, { detail: { mode: theme, resolved: theme } }),
      );
    } catch {}
  };

  const lsBrowserThemeKey = "xra:theme.browser";
  const lsCurrentThemeKey = "xra:theme.current";

  const readLs = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeLs = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  };

  const removeLs = (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  const systemTheme = getSystemTheme();

  const snapshotBrowserTheme = normalizeTheme(readLs(lsBrowserThemeKey));
  const snapshotCurrentTheme = normalizeTheme(readLs(lsCurrentThemeKey));

  let bootTheme = systemTheme;
  if (snapshotBrowserTheme && snapshotBrowserTheme !== systemTheme) {
    bootTheme = systemTheme;
    writeLs(lsBrowserThemeKey, systemTheme);
    writeLs(lsCurrentThemeKey, systemTheme);
  } else if (snapshotCurrentTheme) {
    bootTheme = snapshotCurrentTheme;
  }

  applyTheme(bootTheme);
})();`;
