const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const port = 3000;

const allowedOrigins = ['*'];

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

app.post('/saveUserData', express.json(), async (req, res) => {
  const { username, mobileNumber } = req.body;

  const spreadsheetId = '1KblXjAKssuutBElGZVuXjMIPKYq8ZWsoCT-48GDX8RA';
  const sheetName = 'Sheet1';
  const values = [[username, mobileNumber]];

  try {
    // Load credentials from 'credentials.json'
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })

    const client = await auth.getClient();
    const sheets = google.sheets({
      version: 'v4',
      auth: client,
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'RAW',
      resource: {
        values,
      },
    });

    console.log('Data saved successfully:', response.data);
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('The API returned an error:', err);
    res.status(500).json({ error: 'Failed to save data to Google Sheet' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
