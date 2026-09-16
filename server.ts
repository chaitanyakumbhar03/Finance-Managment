import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'die-makes-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  }
}));

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL}/api/auth/google/callback`
);

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Auth Routes
app.get('/api/auth/google/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.json({ url });
});

app.get(['/api/auth/google/callback', '/api/auth/google/callback/'], async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    (req.session as any).tokens = tokens;
    
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/auth/status', (req, res) => {
  res.json({ isAuthenticated: !!(req.session as any).tokens });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Sheets API Routes
app.post('/api/sheets/sync', async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) {
    return res.status(401).json({ error: 'Not authenticated with Google' });
  }

  const { spreadsheetId, clients, karagirs, direction } = req.body;
  if (!spreadsheetId) {
    return res.status(400).json({ error: 'Spreadsheet ID is required' });
  }

  oauth2Client.setCredentials(tokens);
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  try {
    if (direction === 'push') {
      // Push data to sheets
      // We'll have two sheets: "Clients" and "Karagirs"
      
      // 1. Update Clients
      const clientHeaders = ['ID', 'Client Name', 'Business Name', 'Address', 'Phone', 'Email', 'Die Type', 'Size', 'Quantity', 'Material', 'Notes', 'Amount Received', 'Amount Pending', 'Created At'];
      const clientRows = clients.map((c: any) => [
        c.id, c.clientName, c.businessName, c.address, c.phoneNumber, c.emailId, c.dieType, c.size, c.quantity, c.material || '', c.notes || '', c.amountReceived, c.amountPending, c.createdAt
      ]);

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Clients!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [clientHeaders, ...clientRows],
        },
      });

      // 2. Update Karagirs
      const karagirHeaders = ['ID', 'Name', 'Address', 'Phone', 'Work Type', 'Amount Given', 'Amount Pending', 'Assigned Work', 'Created At'];
      const karagirRows = karagirs.map((k: any) => [
        k.id, k.name, k.address, k.phoneNumber, k.workType, k.amountGiven, k.amountPending, k.assignedWork, k.createdAt
      ]);

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Karagirs!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [karagirHeaders, ...karagirRows],
        },
      });

      res.json({ success: true, message: 'Data pushed to Google Sheets successfully' });
    } else {
      // Pull data from sheets
      const clientRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Clients!A2:N',
      });
      const karagirRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Karagirs!A2:I',
      });

      const clientsFromSheet = (clientRes.data.values || []).map(row => ({
        id: row[0],
        clientName: row[1],
        businessName: row[2],
        address: row[3],
        phoneNumber: row[4],
        emailId: row[5],
        dieType: row[6],
        size: Number(row[7]),
        quantity: Number(row[8]),
        material: row[9],
        notes: row[10],
        amountReceived: Number(row[11]),
        amountPending: Number(row[12]),
        createdAt: row[13],
      }));

      const karagirsFromSheet = (karagirRes.data.values || []).map(row => ({
        id: row[0],
        name: row[1],
        address: row[2],
        phoneNumber: row[3],
        workType: row[4],
        amountGiven: Number(row[5]),
        amountPending: Number(row[6]),
        assignedWork: row[7],
        createdAt: row[8],
      }));

      res.json({ success: true, clients: clientsFromSheet, karagirs: karagirsFromSheet });
    }
  } catch (error: any) {
    console.error('Sheets API Error:', error);
    if (error.code === 404) {
      // Sheet might not exist, try to initialize it
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              { addSheet: { properties: { title: 'Clients' } } },
              { addSheet: { properties: { title: 'Karagirs' } } }
            ]
          }
        });
        res.status(200).json({ success: true, message: 'Sheets initialized. Please try syncing again.' });
      } catch (initError) {
        res.status(500).json({ error: 'Failed to initialize sheets. Make sure the Spreadsheet ID is correct and you have access.' });
      }
    } else {
      res.status(500).json({ error: error.message || 'Failed to sync with Google Sheets' });
    }
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
