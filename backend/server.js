import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync(process.env.SSL_KEY, 'utf-8');
  const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');
  const ca = fs.readFileSync(process.env.SSL_CA, 'utf8');
  const credentials = { key: privateKey, cert: certificate, ca: ca };
  https.createServer(credentials, app).listen(port, () => {
    console.log(`Listening securely on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};
