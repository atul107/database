const express = require('express');
const { google } = require('googleapis');
const cors = require('cors'); 


const app = express();
const port = 3000; 

const allowedOrigins = ['https://magnificent-kelpie-5e7738.netlify.app/'];

// Use the cors middleware with specific options
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const apiKey = 'AIzaSyAl4fRk6B9cBZfpaR2auQUI-MouNoWld7Q';

const sheets = google.sheets({
  version: 'v4',
  auth: apiKey,
});

app.post('/saveUserData', express.json(), (req, res) => {
  const { username, mobileNumber } = req.body;

  const spreadsheetId = '1KblXjAKssuutBElGZVuXjMIPKYq8ZWsoCT-48GDX8RA';

  const sheetName = 'Sheet1';

  const values = [[username, mobileNumber]];

  sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption: 'RAW',
    resource: {
      values,
    },
  }, (err, response) => {
    if (err) {
      console.error('The API returned an error:', err);
      return res.status(500).json({ error: 'Failed to save data to Google Sheet' });
    }

    console.log('Data saved successfully:', response.data);
    res.status(200).json({ message: 'Data saved successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
