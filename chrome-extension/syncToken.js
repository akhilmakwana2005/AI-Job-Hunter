// Runs on localhost:5173 to sync the token with the extension
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (token) {
    chrome.runtime.sendMessage({
      action: 'SYNC_TOKEN',
      token: token
    });
  }

  // Also listen for changes in localStorage in case the user logs in while the tab is open
  window.addEventListener('storage', (e) => {
    if (e.key === 'token' && e.newValue) {
      chrome.runtime.sendMessage({
        action: 'SYNC_TOKEN',
        token: e.newValue
      });
    }
  });
});
