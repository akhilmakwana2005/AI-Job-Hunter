// This script runs directly inside the LinkedIn page

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_JOB_DATA") {
    try {
      // Logic for LinkedIn Jobs Page
      let title = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText || 
                  document.querySelector('h1.t-24')?.innerText || 
                  'Unknown Title';
                  
      let company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText || 
                    document.querySelector('.jobs-unified-top-card__company-name')?.innerText || 
                    'Unknown Company';
                    
      let description = document.querySelector('.jobs-description-content__text')?.innerText || 
                        document.querySelector('#job-details')?.innerText || 
                        '';

      let location = document.querySelector('.job-details-jobs-unified-top-card__primary-description')?.innerText.split('·')[0].trim() || 'Unknown Location';

      // Clean up text
      title = title.trim();
      company = company.trim();
      description = description.trim();

      if (title && company) {
        sendResponse({
          success: true,
          data: {
            title,
            company,
            description,
            location,
            url: window.location.href
          }
        });
      } else {
        sendResponse({ success: false, error: "Could not find job elements." });
      }
    } catch (e) {
      sendResponse({ success: false, error: e.message });
    }
  }
  return true; // Indicates we will send response asynchronously
});
