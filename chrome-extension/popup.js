document.addEventListener('DOMContentLoaded', async () => {
  const noJobDiv = document.getElementById('no-job');
  const jobDetailsDiv = document.getElementById('job-details');
  const actionsDiv = document.getElementById('actions');
  const titleEl = document.getElementById('job-title');
  const companyEl = document.getElementById('job-company');
  const saveBtn = document.getElementById('save-job-btn');
  const genCoverBtn = document.getElementById('gen-cover-btn');
  const statusMsg = document.getElementById('status-msg');

  let currentJobData = null;

  // Query the active tab to see if we are on a job page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url && tab.url.includes('linkedin.com/jobs/')) {
    // Inject content script to extract details if not already injected
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      // Send message to content script to get job info
      chrome.tabs.sendMessage(tab.id, { action: "GET_JOB_DATA" }, (response) => {
        if (response && response.success) {
          currentJobData = response.data;
          
          noJobDiv.classList.add('hidden');
          jobDetailsDiv.classList.remove('hidden');
          actionsDiv.classList.remove('hidden');
          
          titleEl.textContent = currentJobData.title;
          companyEl.textContent = currentJobData.company;
        } else {
          noJobDiv.textContent = "Could not extract job details. Please ensure the job page is fully loaded.";
        }
      });
    });
  }

  saveBtn.addEventListener('click', async () => {
    if (!currentJobData) return;
    statusMsg.textContent = "Saving to Kanban board...";
    
    // In a real scenario, we send this to background.js which makes the API call
    // using the user's stored auth token.
    chrome.runtime.sendMessage({
      action: "SAVE_JOB",
      data: currentJobData
    }, (res) => {
      if (res && res.success) {
        statusMsg.textContent = "✅ Saved successfully!";
        statusMsg.style.color = "#10b981";
      } else {
        statusMsg.textContent = "❌ Failed to save. Are you logged in?";
        statusMsg.style.color = "#ef4444";
      }
    });
  });

  genCoverBtn.addEventListener('click', async () => {
    if (!currentJobData) return;
    statusMsg.textContent = "Generating Cover Letter with AI (this takes a few seconds)...";
    
    chrome.runtime.sendMessage({
      action: "GENERATE_COVER_LETTER",
      data: currentJobData
    }, async (res) => {
      if (res && res.success && res.coverLetter) {
        try {
          await navigator.clipboard.writeText(res.coverLetter);
          statusMsg.textContent = "✅ Generated and copied to clipboard!";
          statusMsg.style.color = "#10b981";
        } catch(e) {
          statusMsg.textContent = "✅ Generated, but failed to copy to clipboard.";
          statusMsg.style.color = "#f59e0b";
        }
      } else {
        const errorMsg = (res && res.error) ? res.error : "Failed to generate.";
        statusMsg.textContent = "❌ " + errorMsg + (errorMsg === 'Not logged in' ? ' (Please open the web app first)' : '');
        statusMsg.style.color = "#ef4444";
      }
    });
  });
});
