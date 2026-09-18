/**
 * Runs the overlay remover in the background, without user interaction,
 * whenever the "Always remove overlays automatically" toggle is on.
 */

(function() {
  var chrome = chrome || browser;
  var observer = null;
  var pendingTimer = null;

  function scheduleRun() {
    if (pendingTimer)
      return;
    pendingTimer = setTimeout(function() {
      pendingTimer = null;
      try {
        overlayRemoverRun(true);
      } catch (e) {
        // Ignore errors from pages that mutate the DOM in ways we don't expect.
      }
    }, 400);
  }

  function startWatching() {
    if (observer)
      return;
    scheduleRun();
    observer = new MutationObserver(scheduleRun);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stopWatching() {
    if (!observer)
      return;
    observer.disconnect();
    observer = null;
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  }

  function applyState(isActive) {
    if (isActive)
      startWatching();
    else
      stopWatching();
  }

  chrome.storage.local.get({ autoActive: false }, function(items) {
    applyState(items.autoActive);
  });

  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === 'local' && changes.autoActive) {
      applyState(changes.autoActive.newValue);
    }
  });
})();
