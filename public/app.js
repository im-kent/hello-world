// vanilla JS — no frameworks
(function () {
  'use strict';

  var root = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');
  var themeLabel = document.getElementById('themeLabel');
  var themeStatus = document.getElementById('themeStatus');
  var clock = document.getElementById('clock');
  var year = document.getElementById('year');
  var helloBtn = document.getElementById('helloBtn');
  var timeBtn = document.getElementById('timeBtn');
  var greeting = document.getElementById('greeting');
  var toast = document.getElementById('toast');
  var viewport = document.getElementById('viewport');
  var serverStatus = document.getElementById('serverStatus');

  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 1rem)';
    }, 2200);
  }

  // year
  if (year) year.textContent = String(new Date().getFullYear());

  // theme: system -> light -> dark cycle, persisted
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(mode) {
    var dark = mode === 'dark' || (mode === 'system' && systemPrefersDark());
    root.classList.toggle('dark', dark);
    if (themeLabel) themeLabel.textContent = dark ? 'Light' : 'Dark';
    if (themeStatus) themeStatus.textContent = mode + (mode === 'system' ? (dark ? ' (dark)' : ' (light)') : '');
    try { localStorage.setItem('hw-theme', mode); } catch (e) {}
  }
  var initial = 'system';
  try { initial = localStorage.getItem('hw-theme') || 'system'; } catch (e) {}
  applyTheme(initial);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = 'system';
      try { current = localStorage.getItem('hw-theme') || 'system'; } catch (e) {}
      var next = current === 'system' ? (systemPrefersDark() ? 'light' : 'dark') : current === 'light' ? 'dark' : 'system';
      // simpler toggle: light <-> dark, long-press for system? keep cycle short: light<->dark
      if (current === 'system') next = systemPrefersDark() ? 'light' : 'dark';
      else if (current === 'light') next = 'dark';
      else if (current === 'dark') next = 'light';
      applyTheme(next);
    });
  }
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () {
      var saved = 'system';
      try { saved = localStorage.getItem('hw-theme') || 'system'; } catch (e) {}
      if (saved === 'system') applyTheme('system');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // clock
  function tick() {
    if (!clock) return;
    var now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);

  // viewport
  function updateViewport() {
    if (viewport) viewport.textContent = window.innerWidth + ' × ' + window.innerHeight;
  }
  updateViewport();
  window.addEventListener('resize', updateViewport);

  // server health
  fetch('/api/health', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (serverStatus) serverStatus.textContent = 'ok · ' + (j.time || '').slice(11, 19) + ' UTC';
    })
    .catch(function () {
      if (serverStatus) serverStatus.textContent = 'unreachable (static preview?)';
    });

  var hellos = [
    'Hello, world! 👋',
    'Hello, friend. Glad you are here.',
    'Hello from a tiny Node server.',
    'Hello — clean, calm, and responsive.',
    'Hello again. Nice to see you.'
  ];
  var helloIndex = 0;

  function sayHello() {
    var msg = hellos[helloIndex % hellos.length];
    helloIndex += 1;
    if (greeting) {
      greeting.textContent = msg;
      greeting.animate(
        [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
    }
    showToast(msg);
  }

  if (helloBtn) helloBtn.addEventListener('click', sayHello);

  if (timeBtn) {
    timeBtn.addEventListener('click', function () {
      var now = new Date();
      var msg = 'It is ' + now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' — ' + now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
      if (greeting) greeting.textContent = msg;
      showToast(msg);
    });
  }

  // keyboard: press "h" for hello, "t" for theme
  document.addEventListener('keydown', function (e) {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'h' || e.key === 'H') sayHello();
    if (e.key === 't' || e.key === 'T') { if (themeBtn) themeBtn.click(); }
  });
})();
