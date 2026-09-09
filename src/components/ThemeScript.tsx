/**
 * Runs before first paint so the correct theme is on <html> immediately — without it
 * a dark-mode reader gets a white flash on every navigation.
 */
export default function ThemeScript() {
  const script = `(function(){try{var stored=localStorage.getItem('theme')||'system';var dark=stored==='dark'||(stored==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',dark?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
