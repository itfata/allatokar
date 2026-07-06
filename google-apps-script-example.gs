function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bookings") ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet("Bookings");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Created At",
      "Language",
      "Name",
      "Phone",
      "Email",
      "Service",
      "Duration",
      "Preferred Date",
      "Message"
    ]);
  }

  const data = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    data.createdAt || "",
    data.language || "",
    data.name || "",
    data.phone || "",
    data.email || "",
    data.service || "",
    data.duration || "",
    data.date || "",
    data.message || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
