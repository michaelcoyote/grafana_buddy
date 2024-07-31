// content_script.js
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "exportAnnotations") {
    exportAnnotations(request.format);
  }
});

function exportAnnotations(format) {
  // Extract dashboard ID from URL
  let dashboardId = window.location.pathname.split('/').pop();

  // Get Grafana API URL from the current page
  let apiUrl = window.location.origin + '/api';
  console.log("Accessing API URL: " + apiUrl);
  console.log("content script - exportAnnotations - format: " + format);

  fetch(`${apiUrl}/annotations?dashboardId=${dashboardId}`, {
    method: 'GET',
    credentials: 'include', // Send existing cookies with the request
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    //browser.runtime.sendMessage({action: "saveAnnotations", annotations: data});
    if (format === 'csv') {
      const csvData = convertToCSV(data);
      browser.runtime.sendMessage({action: "saveAnnotations", data: csvData, format: 'csv'});
    } else {
      browser.runtime.sendMessage({action: "saveAnnotations", data: data, format: 'json'});
      //console.log("json data option: " + JSON.stringify(data, null, 2));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // You might want to send an error message to the user here
    browser.runtime.sendMessage({action: "showError", error: error.message});
  });
}

function convertToCSV(annotations) {
  const fields = ['id', 'dashboardId', 'panelId', 'time', 'timeEnd', 'text', 'tags'];
  let csv = fields.join(',') + "\n";
  
  annotations.forEach(annotation => {
    let row = fields.map(field => {
      let value = annotation[field];
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""'); // Escape double quotes
        if (value.includes(',') || value.includes("\n") || value.includes('"')) {
          value = `"${value}"`; // Wrap in quotes if contains comma, newline, or quote
        }
      } else if (Array.isArray(value)) {
        value = `"${value.join(',')}"`; // Join array values and wrap in quotes
      }
      return value;
    }).join(',');
    csv += row + "\n";
  });
  
  return csv;
}
