// popup.js
document.getElementById('exportButton').addEventListener('click', function() {
  const format = document.getElementById('outputFormat').value;
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("popup - exportButton onclick - format: " + format);
    browser.tabs.sendMessage(tabs[0].id, {action: "exportAnnotations", format: format});
  });
});


browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "displayError") {
    // Display the error message to the user
    document.getElementById('errorMessage').textContent = request.error;
  }
});
