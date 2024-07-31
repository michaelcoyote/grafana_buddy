// background.js

function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHour()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${year}_${month}_${day}__${hour}${min}`;
}

function saveAnnotationsToFile(data, format) {
  console.log("background - saveAnnotationsToFile - format type: " + format + "\n");
  let blob, filename;
  if (format === 'csv') { 
    blob = new Blob([data], {type: "text/csv;charset=utf8;"});
    filename = 'grafana_export_' + getCurrentDate() + '.csv';
  } else { 
    blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    filename = 'grafana_export_' + getCurrentDate() + '.json';
  }

  let url = URL.createObjectURL(blob);
 //  console.log("download URL is:" + url);

  browser.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  });
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "saveAnnotations") {
    saveAnnotationsToFile(request.data, request.format);
  } else if (request.action === "showError") {
    browser.runtime.sendMessage({action: "displayError", error: request.error});
  }
});
