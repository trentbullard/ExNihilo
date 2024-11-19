To implement session management for Google One-Tap Sign-In where the user remains logged in for 7 days unless they manually log out, the **best practice** is to use a combination of:

1. **Short-lived access tokens** (stored in memory or `localStorage`).
2. **Refresh tokens** (stored in `HttpOnly, Secure` cookies).

This ensures security while providing a seamless login experience.

---

### **Plan Overview**
1. **Google One-Tap Sign-In**:
   - Use Google to authenticate the user and obtain an ID token.
   - Verify the ID token on your backend.

2. **Session Management**:
   - Issue a short-lived **access token** (e.g., valid for 1 hour) for user authentication on the client side.
   - Issue a long-lived **refresh token** (e.g., valid for 7 days) stored securely in a cookie.

3. **Token Refresh Mechanism**:
   - When the access token expires, the client silently requests a new access token from the server using the refresh token.

---

### **Step-by-Step Implementation**

#### **Frontend**

##### **1. Handle One-Tap Sign-In and Token Storage**

**`auth.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your backend URL
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  initializeGoogleOneTap(): void {
    (window as any).google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    (window as any).google.accounts.id.prompt(); // Display One-Tap prompt
  }

  private handleCredentialResponse(response: any): void {
    const idToken = response.credential;

    // Send the ID token to the backend for verification
    this.http.post(`${this.apiUrl}/google`, { idToken }).subscribe({
      next: (res: any) => {
        this.accessToken = res.accessToken; // Store the access token in memory
        console.log('User authenticated successfully:', res);
      },
      error: (err) => {
        console.error('Authentication failed:', err);
      },
    });
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  refreshToken(): void {
    this.http.post(`${this.apiUrl}/refresh`, {}).subscribe({
      next: (res: any) => {
        this.accessToken = res.accessToken; // Update the access token
      },
      error: (err) => {
        console.error('Failed to refresh token:', err);
      },
    });
  }

  logout(): void {
    this.accessToken = null;
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      console.log('Logged out successfully');
    });
  }
}
```

---

##### **2. Refresh Token Automatically When Needed**

**`app.interceptor.ts`**
Create an HTTP interceptor to refresh the token when the access token expires.

```typescript
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Attempt to refresh the token
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const refreshedToken = this.authService.getAccessToken();
              if (refreshedToken) {
                req = req.clone({
                  setHeaders: { Authorization: `Bearer ${refreshedToken}` },
                });
              }
              return next.handle(req);
            }),
            catchError((refreshError) => {
              console.error('Token refresh failed:', refreshError);
              return throwError(refreshError);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
```

Register the interceptor in your `app.module.ts`:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
```

---

#### **Backend**

##### **1. Authenticate the User**

**`auth.controller.js`**
```javascript
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const ACCESS_TOKEN_SECRET = 'access_token_secret';
const REFRESH_TOKEN_SECRET = 'refresh_token_secret';

const client = new OAuth2Client(CLIENT_ID);

const users = {}; // Example in-memory user store

exports.googleSignIn = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload.sub;

    // Store or retrieve user
    let user = users[userId];
    if (!user) {
      user = { id: userId, email: payload.email, name: payload.name };
      users[userId] = user;
    }

    // Generate tokens
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Send tokens
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid ID token' });
  }
};
```

---

##### **2. Refresh Tokens**

**`auth.controller.js`**
```javascript
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const { userId } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};
```

---

##### **3. Logout**

**`auth.controller.js`**
```javascript
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};
```

---

### **Security Best Practices**

1. **Use HTTPS**: Always serve your app over HTTPS to secure cookie transmission.
2. **Secure Cookies**: Use `HttpOnly`, `Secure`, and `SameSite` attributes for refresh tokens.
3. **Token Rotation**: Implement refresh token rotation to limit the exposure of long-lived tokens.
4. **Logout Handling**: Clear cookies and revoke tokens on logout.

---

### **How It Works**

1. User logs in via Google One-Tap.
2. Backend verifies the Google ID token and issues:
   - A short-lived **access token** (1 hour).
   - A long-lived **refresh token** (7 days).
3. Access tokens are used for API requests.
4. When the access token expires, the client silently refreshes it using the refresh token.
5. User remains logged in until:
   - The refresh token expires (7 days).
   - The user manually logs out.

Let me know if you need help setting this up!

To integrate session management with user profile storage and mapping in the database, we can enhance the backend to store user information in a database (e.g., PostgreSQL). This allows us to maintain user profiles and map sessions (tokens) to database records.

Here’s how the process would look:

---

### **Database Schema for Users and Sessions**

1. **Users Table**
   Stores user profile information retrieved during Google One-Tap authentication.

   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       google_id VARCHAR(255) NOT NULL UNIQUE,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       picture TEXT,
       date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Sessions Table**
   Tracks active sessions and stores refresh tokens securely.

   ```sql
   CREATE TABLE sessions (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       refresh_token TEXT NOT NULL UNIQUE,
       expires_at TIMESTAMP NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

---

### **Step-by-Step Integration**

#### **1. Store User Profile in the Database**

Modify the Google One-Tap authentication process to check if the user already exists in the `users` table. If not, create a new user.

**`auth.controller.js`**
```javascript
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Database connection instance

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const ACCESS_TOKEN_SECRET = 'access_token_secret';
const REFRESH_TOKEN_SECRET = 'refresh_token_secret';
const client = new OAuth2Client(CLIENT_ID);

exports.googleSignIn = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;

    // Check if user exists in the database
    let user = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

    if (user.rows.length === 0) {
      // Create new user if not found
      const insertQuery = `
        INSERT INTO users (google_id, name, email, picture)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      user = await db.query(insertQuery, [googleId, payload.name, payload.email, payload.picture]);
    } else {
      user = user.rows[0];
    }

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Save the refresh token in the database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.query(
      `INSERT INTO sessions (user_id, refresh_token, expires_at)
       VALUES ($1, $2, $3) ON CONFLICT (refresh_token) DO NOTHING`,
      [user.id, refreshToken, expiresAt]
    );

    // Send tokens to the client
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });
    res.json({ accessToken, user: { name: user.name, email: user.email, picture: user.picture } });
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

---

#### **2. Refresh Token Validation**

When the client requests a new access token, validate the refresh token by checking it against the `sessions` table and update it.

**`auth.controller.js`**
```javascript
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const session = await db.query(
      `SELECT * FROM sessions WHERE refresh_token = $1 AND expires_at > NOW()`,
      [refreshToken]
    );

    if (session.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const userId = payload.userId;

    // Issue a new access token
    const newAccessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};
```

---

#### **3. Logout**

Clear the session and delete the refresh token from the `sessions` table.

**`auth.controller.js`**
```javascript
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ error: 'No refresh token provided' });
  }

  try {
    await db.query('DELETE FROM sessions WHERE refresh_token = $1', [refreshToken]);
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};
```

---

### **Database Integration**

#### **Database Queries**

**Database Connection File (`db.js`)**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your-db-user',
  host: 'localhost',
  database: 'your-db-name',
  password: 'your-db-password',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```

#### **Example: Retrieving User Profile**
```javascript
exports.getUserProfile = async (req, res) => {
  const { userId } = req.user; // Extract from JWT in middleware

  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

---

### **Frontend Integration**

Update your frontend to display user profiles dynamically after login:

**`auth.service.ts`**
```typescript
getUserProfile(): Observable<any> {
  return this.http.get('http://localhost:3000/api/user/profile');
}
```

**`app.component.ts`**
```typescript
ngOnInit(): void {
  this.authService.getUserProfile().subscribe((profile) => {
    console.log('User Profile:', profile);
    this.user = profile;
  });
}
```

---

### **Security Best Practices**

1. **Encrypt Refresh Tokens**: Use strong encryption if refresh tokens are stored in the database.
2. **Token Expiry**: Ensure access tokens expire quickly (e.g., 1 hour).
3. **Revoke Tokens on Logout**: Always delete refresh tokens from the database when logging out.
4. **Use HTTPS**: Always transmit tokens over secure HTTPS connections.

---

Let me know if you want to dive deeper into any specific part of this integration!