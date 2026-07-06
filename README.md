# Alla Tokar site

Static bilingual website for Alla Tokar with:

- German as the main language and English toggle
- Separate pricing page
- Booking form prepared for Google Sheets integration
- Placeholder legal pages for `Impressum` and `Datenschutz`

## Files

- `index.html` - main presentation page
- `prices.html` - services and pricing
- `impressum.html` - placeholder legal notice
- `datenschutz.html` - placeholder privacy page
- `config.js` - project configuration
- `google-apps-script-example.gs` - sample Google Apps Script for form submissions

## Connect booking form to Google Sheets

1. Create a Google Sheet.
2. Open `Extensions -> Apps Script`.
3. Paste the code from `google-apps-script-example.gs`.
4. Deploy it as a Web App with access for anyone who has the link.
5. Copy the Web App URL.
6. Open `config.js` and paste the URL into `bookingEndpoint`.

After that, form submissions will be sent directly to the sheet.
