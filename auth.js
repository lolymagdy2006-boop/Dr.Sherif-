/*
  Simple client-side auth helper (localStorage-based)
  - Preset username/password (edit below)
  - Protect pages by calling Auth.requireAuth({ ... }) early in the page
  - Login page should call Auth.handleLoginForm(...)

  NOTE: This is not secure for real applications (credentials are in the frontend).
*/

(function (global) {
  'use strict';

  const DEFAULTS = {
    // Change these credentials as needed
    presetUsername: 'admin',
    presetPassword: '1234',

    // Files in this folder
    loginPage: 'login.html',
    defaultRedirect: 'index.html',

    // localStorage keys
    storageKey: 'dw_auth',
    redirectKey: 'dw_auth_redirect'
  };

  function nowMs() {
    return Date.now();
  }

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function readSession(opts) {
    const raw = localStorage.getItem(opts.storageKey);
    if (!raw) return null;
    const data = safeJsonParse(raw, null);
    if (!data || typeof data !== 'object') return null;
    return data;
  }

  function writeSession(opts, data) {
    localStorage.setItem(opts.storageKey, JSON.stringify(data));
  }

  function clearSession(opts) {
    localStorage.removeItem(opts.storageKey);
  }

  function normalizeOpts(custom) {
    return Object.assign({}, DEFAULTS, custom || {});
  }

  function isLoggedIn(customOpts) {
    const opts = normalizeOpts(customOpts);
    const session = readSession(opts);
    return !!(session && session.loggedIn === true);
  }

  function login(username, password, customOpts) {
    const opts = normalizeOpts(customOpts);

    const ok = username === opts.presetUsername && password === opts.presetPassword;
    if (!ok) return { ok: false, message: 'Invalid username or password.' };

    writeSession(opts, {
      loggedIn: true,
      username: username,
      loggedInAt: nowMs()
    });

    return { ok: true };
  }

  function logout(customOpts) {
    const opts = normalizeOpts(customOpts);
    clearSession(opts);
  }

  function setRedirectAfterLogin(path, customOpts) {
    const opts = normalizeOpts(customOpts);
    localStorage.setItem(opts.redirectKey, path);
  }

  function consumeRedirectAfterLogin(customOpts) {
    const opts = normalizeOpts(customOpts);
    const path = localStorage.getItem(opts.redirectKey);
    if (path) localStorage.removeItem(opts.redirectKey);
    return path;
  }

  function currentPathForRedirect() {
    // Use just the file name if possible (keeps it portable when copied)
    const full = window.location.href;
    const file = window.location.pathname.split('/').pop();
    return file || full;
  }

  function redirectTo(url) {
    window.location.href = url;
  }

  function requireAuth(customOpts) {
    const opts = normalizeOpts(customOpts);

    if (isLoggedIn(opts)) return;

    // Remember where the user wanted to go
    setRedirectAfterLogin(currentPathForRedirect(), opts);

    // Go to login
    redirectTo(opts.loginPage);
  }

  function getReturnToFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('returnTo');
  }

  function handleLoginForm(formOrSelector, customOpts) {
    const opts = normalizeOpts(customOpts);

    const form = typeof formOrSelector === 'string'
      ? document.querySelector(formOrSelector)
      : formOrSelector;

    if (!form) {
      throw new Error('Auth.handleLoginForm: form not found');
    }

    const userInput = form.querySelector('[name="username"]');
    const passInput = form.querySelector('[name="password"]');
    const errorEl = form.querySelector('[data-auth-error]');

    if (!userInput || !passInput) {
      throw new Error('Auth.handleLoginForm: username/password inputs not found');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = (userInput.value || '').trim();
      const password = passInput.value || '';

      const result = login(username, password, opts);

      if (!result.ok) {
        if (errorEl) {
          errorEl.textContent = result.message || 'Login failed.';
          errorEl.style.display = 'block';
        } else {
          alert(result.message || 'Login failed.');
        }
        return;
      }

      const queryReturnTo = getReturnToFromQuery();
      const storedReturnTo = consumeRedirectAfterLogin(opts);
      const returnTo = queryReturnTo || storedReturnTo || opts.defaultRedirect;

      redirectTo(returnTo);
    });
  }

  function attachLogout(buttonOrSelector, customOpts) {
    const opts = normalizeOpts(customOpts);

    const btn = typeof buttonOrSelector === 'string'
      ? document.querySelector(buttonOrSelector)
      : buttonOrSelector;

    if (!btn) return;

    btn.addEventListener('click', () => {
      logout(opts);
      redirectTo(opts.loginPage);
    });
  }

  global.Auth = {
    DEFAULTS,
    isLoggedIn,
    login,
    logout,
    requireAuth,
    handleLoginForm,
    attachLogout,
    setRedirectAfterLogin,
    consumeRedirectAfterLogin
  };
})(window);
