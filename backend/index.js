const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const CLIENT_ID = '222659911685-ulfsp7uu4fd6usp3mdmmrfio4bubud1q.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  console.log('req:', req.body);
  const { credential } = req.body; // Extract ID token from request body

  if (!credential) {
    return res.status(400).json({ error: 'Credential token is missing' });
  }

  try {
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    // Extract user information from the token
    const payload = ticket.getPayload();

    // Example payload fields:
    // payload.name, payload.email, payload.picture

    console.log('User info:', payload);

    // TODO: Add your own logic here (e.g., check if user exists, create user, issue a session token, etc.)
    // For example:
    // const user = await findOrCreateUser(payload);

    res.status(200).json({
      message: 'Authentication successful',
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ error: 'Invalid ID token' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
