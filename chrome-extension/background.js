// Background service worker for handling API calls to our Node.js Backend

// Change this to your production API URL before publishing (e.g., https://your-backend.onrender.com/api/v1)
const API_BASE_URL = 'http://localhost:5000/api/v1';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === "SYNC_TOKEN") {
    chrome.storage.local.set({ authToken: request.token });
    return false;
  }

  if (request.action === "SAVE_JOB") {
    chrome.storage.local.get(['authToken'], (result) => {
      if (!result.authToken) {
        sendResponse({ success: false, error: "Not logged in" });
        return;
      }
      
      fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.authToken}`
        },
        body: JSON.stringify({
          company: request.data.company,
          position: request.data.title,
          status: 'Saved',
          jobDescription: request.data.description,
          notes: `Applied via LinkedIn Chrome Extension.\nURL: ${request.data.url}`
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data._id) sendResponse({ success: true, message: "Job saved to backend" });
        else sendResponse({ success: false, error: data.message });
      })
      .catch(err => sendResponse({ success: false, error: err.message }));
    });
    
    return true; // Keep message channel open for async response
  }

  if (request.action === "GENERATE_COVER_LETTER") {
    chrome.storage.local.get(['authToken'], (result) => {
      if (!result.authToken) {
        sendResponse({ success: false, error: "Not logged in" });
        return;
      }

      fetch(`${API_BASE_URL}/cover-letters/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.authToken}`
        },
        body: JSON.stringify({
          targetCompany: request.data.company,
          targetRole: request.data.title,
          jobDescription: request.data.description
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.content) {
          sendResponse({ success: true, coverLetter: data.content });
        } else {
          sendResponse({ success: false, error: data.message });
        }
      })
      .catch(err => sendResponse({ success: false, error: err.message }));
    });
    
    return true;
  }
});
