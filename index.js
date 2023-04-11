const express = require('express');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6996;
const CLIENT_ID = '881592279822-fkq9tr5sb3eq44opskkfei2baotve9dq.apps.googleusercontent.com';
const CLIENT_SECRET = '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T';
const REDIRECT_URI = 'https://utils.stemplace.org/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'];

app.get('/', (req, res) => {
  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  const html = `
    <html>
        <head>
            <title>STEMPlace Site Utils</title>
            <style>
                h1 {
                    color: #fff;
		    text-align: center;
                }
                .container {
                    margin: 0 auto;
                    padding: 50px;
                    background: linear-gradient(to bottom right, #F472B6, #BD10E0, #FFD700);
                    color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                    font-family: Arial, Helvetica, sans-serif;
                }
                @media screen and (max-width: 768px) {
                    .container {
                        padding: 30px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
              <h1>STEMPlace OAuth Verification Tool</h1>
              <p>This tool is useful for retrieving data for verifying
              your identity on STEMPlace. <b>DO NOT</b> share the information
              provided by this website, it may be sensitive!<br><br><br>
	      This tool is intended for people who:
	      <ul>
	        <li>Initially signed up with their personal email (not @(s.)stemk12.org)</li>
		<li>Are soon going to graduate (congrats!)</li>
		<li>Former members of the STEM community</li>
		<li>Anyone who was active and ended in good standing on STEMPlace v1 and v2</li>
	      </ul>
              </p>
              <a href="${authUrl}">Authorize</a>
            </div>
        </body>
    </html>
  `;
  res.send(html);
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
