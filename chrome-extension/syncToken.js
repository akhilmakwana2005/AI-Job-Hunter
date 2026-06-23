// Runs on the web application to sync auth token and API URL with the extension
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:5000/api/v1';
  
  if (token) {
    chrome.runtime.sendMessage({
      action: 'SYNC_TOKEN',
      token: token,
      apiUrl: apiUrl
    });
  }

  // Also listen for changes in localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === 'token' && e.newValue) {
      const currentApiUrl = localStorage.getItem('apiUrl') || 'http://localhost:5000/api/v1';
      chrome.runtime.sendMessage({
        action: 'SYNC_TOKEN',
        token: e.newValue,
        apiUrl: currentApiUrl
      });
    }
  });
});
