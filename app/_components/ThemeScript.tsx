import Script from "next/script";

export default function ThemeScript() {
  const code = `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (systemDark ? 'dark' : 'light');
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  } catch {}
})();
`.trim();

  return (
    <Script
    suppressHydrationWarning={true}
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}