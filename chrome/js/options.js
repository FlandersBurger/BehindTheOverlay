var chrome = chrome || browser;

var checkbox = document.getElementById('autoActive');

chrome.storage.local.get({ autoActive: false }, function(items) {
  checkbox.checked = items.autoActive;
});

checkbox.addEventListener('change', function() {
  chrome.storage.local.set({ autoActive: checkbox.checked });
});
