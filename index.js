const express = require('express');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6996;
const CLIENT_ID = '881592279822-fkq9tr5sb3eq44opskkfei2baotve9dq.apps.googleusercontent.com';
const CLIENT_SECRET = '';
const REDIRECT_URI = 'https://utils.stemplace.org/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'];

app.get('/', (req, res) => {
  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  app.use(express.static(__dirname));
});

app.get('/oauth2callback', (req, res) => {
  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const { code } = req.query;
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error getting token:', err);
      res.status(500).send('Error getting token: ${err}');
      return;
    }
    oauth2Client.setCredentials(token);
    const html = `
      <html>
        <body>
          <h1>Google OAuth2 Example</h1>
          <p>Token:</p>
          <pre>${JSON.stringify(token, null, 2)}</pre>
        </body>
      </html>
    `;
    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
