// Light/dark mode for the site. Follows the visitor's OS preference until they
// press the toggle; the choice is then kept in localStorage under "color-mode".
// Written in ES5 because jekyll-minifier's uglifier does not parse newer syntax.
(function () {
  var KEY = 'color-mode';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try {
      var m = localStorage.getItem(KEY);
      return (m === 'light' || m === 'dark') ? m : null;
    } catch (e) { return null; }
  }

  // What the page shows right now: the attribute set on <html>, else the saved
  // choice, else the OS setting. Reading the attribute first keeps the toggle
  // working where storage is unavailable (private windows, sandboxed previews).
  function current() {
    var shown = root.getAttribute('data-theme');
    if (shown === 'light' || shown === 'dark') { return shown; }
    return saved() || ((media && media.matches) ? 'dark' : 'light');
  }

  function apply(mode) {
    root.setAttribute('data-theme', mode);
    var button = document.getElementById('themeToggle');
    if (!button) { return; }
    var toDark = mode === 'light';
    button.textContent = toDark ? '☾' : '☀'; // ☾ when light, ☀ when dark
    button.setAttribute('aria-label', toDark ? 'Switch to dark mode' : 'Switch to light mode');
    button.setAttribute('title', toDark ? 'Switch to dark mode' : 'Switch to light mode');
  }

  window.toggleColorMode = function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  };

  if (media) {
    var onChange = function () { if (!saved()) { apply(media.matches ? 'dark' : 'light'); } };
    if (media.addEventListener) { media.addEventListener('change', onChange); }
    else if (media.addListener) { media.addListener(onChange); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(current()); });
  } else {
    apply(current());
  }
})();
