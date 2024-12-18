// popup.js

// Listen for the export button click
// and send the format to the content script
document.getElementById('exportButton').addEventListener('click', function() {
  const format = document.getElementById('outputFormat').value;
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("popup - exportButton onclick - format: " + format);
    browser.tabs.sendMessage(tabs[0].id, {action: "exportAnnotations", format: format});
  });
});


// Listen for messages from the content script
// and display the error message
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "displayError") {
    // Display the error message to the user
    document.getElementById('errorMessage').textContent = request.error;
  }
});
