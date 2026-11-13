/* PagePilot live monitor v1. No persistence, analytics endpoint or request payloads. */
(function () {
  'use strict';

  var script = document.currentScript;
  var configuredOrigin = script && script.getAttribute('data-manager-origin');
  var managerOrigin;
  try {
    var parsedOrigin = new URL(configuredOrigin);
    if (!/^https?:$/.test(parsedOrigin.protocol) || parsedOrigin.origin !== configuredOrigin) return;
    managerOrigin = parsedOrigin.origin;
  } catch (_) { return; }
  if (window.__pagepilotMonitorInstalled) return;
  try { window.__pagepilotMonitorInstalled = true; } catch (_) { return; }

  var target = null;
  var session = null;
  var heartbeat = 0;
  var sequence = 0;
  var allowance = 100;
  var allowanceReset = Date.now();
  var restore = [];
  var installed = false;
  var MAX_TEXT = 400;
  var LEASE_MS = 60000;

  function safeUrl(value) {
    if (typeof value !== 'string' || !value) return '';
    try {
      var url = new URL(value, window.location.href);
      if (!/^https?:$/.test(url.protocol)) return '[afgeschermde URL]';
      var path = url.pathname.replace(/(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]+/g, '[afgeschermd]')
        .replace(/[A-Za-z0-9_-]{48,}/g, '[afgeschermd]');
      return (url.origin + path).slice(0, MAX_TEXT);
    } catch (_) { return '[onbekende URL]'; }
  }

  function safeText(value) {
    if (typeof value !== 'string') return '[inhoud niet verzameld]';
    // Process the bounded input before truncating its output to avoid leaking half a secret.
    return value.slice(0, 4000)
      .replace(/https?:\/\/[^\s<>"')]+/gi, function (url) { return safeUrl(url); })
      .replace(/\bBearer\s+[^\s,;]+/gi, 'Bearer [afgeschermd]')
      .replace(/(?:github_pat_|gh[pousr]_|sk-(?:proj-)?)[A-Za-z0-9_-]+/g, '[afgeschermd]')
      .replace(/\b(?:api[-_ ]?key|access[-_ ]?token|token|secret|password|authorization)\s*["']?\s*[:=]\s*["']?[^\s"'&,;]+/gi, '[afgeschermd]')
      .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[afgeschermd]')
      .replace(/[A-Za-z0-9_-]{48,}/g, '[afgeschermd]')
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
      .slice(0, MAX_TEXT);
  }

  function active() {
    return !!(target && session && Date.now() - heartbeat <= LEASE_MS);
  }

  function send(type, payload) {
    if (!active()) return;
    try { target.postMessage(Object.assign({ type: type, session: session }, payload), managerOrigin); }
    catch (_) { /* Diagnostics must never interrupt the monitored page. */ }
  }

  function report(event, originalSession) {
    try {
      if (!active() || (originalSession && originalSession !== session)) return;
      if (Date.now() - allowanceReset >= 60000) {
        allowance = 100;
        allowanceReset = Date.now();
      }
      if (allowance <= 0) return;
      allowance -= 1;
      event.id = 'live-' + Date.now() + '-' + (++sequence);
      event.severity = 'error';
      event.timestamp = new Date().toISOString();
      send('pagepilot:event', { event: event });
      if (allowance === 0) send('pagepilot:limit', { message: 'Maximaal 100 meldingen per minuut. Nieuwe meldingen worden tijdelijk overgeslagen.' });
    } catch (_) { /* Never alter application behavior if reporting fails. */ }
  }

  function errorMessage(reason) {
    try {
      if (reason && typeof reason.message === 'string') return safeText(reason.message);
      if (typeof reason === 'string') return safeText(reason);
    } catch (_) { /* Ignore user-defined getters. */ }
    return 'Promise afgewezen; de inhoud wordt niet verzameld.';
  }

  function replace(object, key, replacement, original) {
    try {
      object[key] = replacement;
      if (object[key] === replacement) restore.push(function () {
        if (object[key] === replacement) object[key] = original;
      });
    } catch (_) { /* Frozen platform APIs remain untouched. */ }
  }

  function install() {
    if (installed) return;
    installed = true;
    function onError(event) {
      try {
        if (typeof event.message === 'string' && event.message) {
          report({ category: 'runtime', kind: 'javascript', message: safeText(event.message),
            file: safeUrl(event.filename), line: Number(event.lineno) || null, column: Number(event.colno) || null });
        } else if (event.target && event.target !== window) {
          var resource = event.target.currentSrc || event.target.src || event.target.href;
          report({ category: 'network', kind: 'resource', message: 'Een afbeelding, script of stylesheet kon niet laden.', url: safeUrl(resource) });
        }
      } catch (_) { /* Ignore inaccessible event metadata. */ }
    }
    function onRejection(event) {
      report({ category: 'runtime', kind: 'promise', message: errorMessage(event.reason), file: '', line: null, column: null });
    }
    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onRejection);
    restore.push(function () {
      window.removeEventListener('error', onError, true);
      window.removeEventListener('unhandledrejection', onRejection);
    });

    if (window.console && typeof window.console.error === 'function') {
      var originalConsoleError = window.console.error;
      var wrappedConsoleError = function () {
        var result = Reflect.apply(originalConsoleError, this, arguments);
        try {
          // Do not serialize objects, Error stacks, or additional arguments/payloads.
          var message = typeof arguments[0] === 'string' ? safeText(arguments[0]) : 'console.error aangeroepen; de inhoud wordt niet verzameld.';
          report({ category: 'runtime', kind: 'console', message: message, file: '', line: null, column: null });
        } catch (_) { /* Preserve console behavior. */ }
        return result;
      };
      replace(window.console, 'error', wrappedConsoleError, originalConsoleError);
    }

    if (typeof window.fetch === 'function') {
      var originalFetch = window.fetch;
      var wrappedFetch = function () {
        var args = arguments;
        var requestUrl = '';
        var requestSession = active() ? session : null;
        try { requestUrl = safeUrl(typeof args[0] === 'string' ? args[0] : args[0] && args[0].url); } catch (_) { /* Ignore getters. */ }
        var result;
        try { result = Reflect.apply(originalFetch, this, args); }
        catch (error) {
          if (requestSession) report({ category: 'network', kind: 'fetch', message: 'Netwerkverzoek kon niet starten.', url: requestUrl, status: null }, requestSession);
          throw error;
        }
        return result.then(function (response) {
          try {
            if (requestSession && !response.ok && response.status !== 0) {
              report({ category: 'network', kind: 'fetch', message: 'API-verzoek mislukt: HTTP ' + response.status + '.',
                url: safeUrl(response.url) || requestUrl, status: response.status }, requestSession);
            }
          } catch (_) { /* Preserve fulfilled responses even if metadata access fails. */ }
          return response;
        }, function (error) {
          // Abort is frequently an intentional cancellation, not an application error.
          if (requestSession && (!error || error.name !== 'AbortError')) report({ category: 'network', kind: 'fetch',
            message: 'Netwerkverzoek mislukt. Controleer de verbinding, URL en CORS-instellingen.', url: requestUrl, status: null }, requestSession);
          throw error;
        });
      };
      replace(window, 'fetch', wrappedFetch, originalFetch);
    }

    if (window.XMLHttpRequest && window.XMLHttpRequest.prototype) {
      var proto = window.XMLHttpRequest.prototype;
      var originalOpen = proto.open;
      var originalSend = proto.send;
      var urls = new WeakMap();
      var wrappedOpen = function () {
        var result = Reflect.apply(originalOpen, this, arguments);
        urls.set(this, safeUrl(typeof arguments[1] === 'string' ? arguments[1] : ''));
        return result;
      };
      var wrappedSend = function () {
        var xhr = this;
        var requestSession = active() ? session : null;
        var aborted = false;
        var timedOut = false;
        function onAbort() { aborted = true; }
        function onTimeout() { timedOut = true; }
        function cleanup() {
          xhr.removeEventListener('abort', onAbort);
          xhr.removeEventListener('timeout', onTimeout);
          xhr.removeEventListener('loadend', onEnd);
        }
        function onEnd() {
          cleanup();
          if (!requestSession || aborted) return;
          try {
            if (xhr.status >= 400 || xhr.status === 0 || timedOut) {
              report({ category: 'network', kind: 'xhr',
                message: timedOut ? 'API-verzoek heeft de tijdslimiet overschreden.' : xhr.status ? 'API-verzoek mislukt: HTTP ' + xhr.status + '.' : 'API-verzoek kon geen verbinding maken.',
                url: safeUrl(xhr.responseURL) || urls.get(xhr) || '', status: xhr.status || null }, requestSession);
            }
          } catch (_) { /* Ignore inaccessible response metadata. */ }
        }
        xhr.addEventListener('abort', onAbort);
        xhr.addEventListener('timeout', onTimeout);
        xhr.addEventListener('loadend', onEnd);
        try { return Reflect.apply(originalSend, xhr, arguments); }
        catch (error) { cleanup(); throw error; }
      };
      replace(proto, 'open', wrappedOpen, originalOpen);
      replace(proto, 'send', wrappedSend, originalSend);
    }
  }

  function disconnect() {
    target = null;
    session = null;
    restore.splice(0).forEach(function (fn) { try { fn(); } catch (_) {} });
    installed = false;
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== managerOrigin || !event.source || event.source === window) return;
    if (event.source !== window.parent && event.source !== window.opener) return;
    var data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'pagepilot:stop' && event.source === target && data.session === session) {
      disconnect();
      return;
    }
    if (data.type !== 'pagepilot:hello' || typeof data.session !== 'string' || !/^[A-Za-z0-9_-]{32,128}$/.test(data.session)) return;
    // A different valid manager window/session replaces the old live session.
    if (session !== data.session || target !== event.source) disconnect();
    target = event.source;
    session = data.session;
    heartbeat = Date.now();
    install();
    send('pagepilot:ready', { version: 1 });
  });

  window.addEventListener('pagehide', disconnect);
  window.setInterval(function () { if (session && !active()) disconnect(); }, 15000);
  [window.parent, window.opener].forEach(function (candidate, index, all) {
    if (!candidate || candidate === window || all.indexOf(candidate) !== index) return;
    try { candidate.postMessage({ type: 'pagepilot:available', version: 1 }, managerOrigin); } catch (_) {}
  });
})();
