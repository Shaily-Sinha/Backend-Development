# Sessions and Cookies in Express.js

This project demonstrates how **Cookies** and **Sessions** work in an Express.js application.

Both are commonly used to maintain information about a user across multiple HTTP requests.

---

## Technologies Used

- Node.js
- Express.js
- cookie-parser
- express-session

---

# Part 1: Cookies

Cookies are small pieces of data stored in the user's browser.

In this example, a cookie named `username` is created, accessed, and deleted using Express.js.

## Installation

Install the required dependencies:

```bash
npm install express cookie-parser
```

## Run the Application

```bash
node app.js
```

The server runs on:

```text
http://localhost:3000
```

## Cookie Routes

### Set Cookie

```text
GET /setcookie
```

Open:

```text
http://localhost:3000/setcookie
```

This creates a cookie:

```text
username = JohnDoe
```

The cookie is configured with:

- `maxAge: 3600000` - expires after 1 hour
- `httpOnly: true` - prevents access through client-side JavaScript
- `secure: false` - allows the cookie to work over HTTP during local development

Expected response:

```text
Cookie has been set!
```

### Read Cookie

```text
GET /getcookie
```

Open:

```text
http://localhost:3000/getcookie
```

The server reads the `username` cookie.

Expected response:

```text
Welcome back, JohnDoe
```

If the cookie does not exist:

```text
No cookie found.
```

### Delete Cookie

```text
GET /deletecookie
```

Open:

```text
http://localhost:3000/deletecookie
```

This removes the `username` cookie.

Expected response:

```text
Cookie deleted.
```

---

# Part 2: Sessions

Sessions are used to store user-specific information on the server.

The browser receives a session ID cookie, which allows the server to identify the user's session across different requests.

## Installation

Install the required dependencies:

```bash
npm install express express-session
```

## Session Configuration

The application configures sessions using:

```javascript
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
```

The session cookie expires after **1 minute**.

## Session Routes

### Login

```text
GET /login
```

Open:

```text
http://localhost:3000/login
```

This stores the username in the session:

```javascript
req.session.username = 'JohnDoe';
```

Expected response:

```text
Session started for JohnDoe
```

### Access Profile

```text
GET /profile
```

Open:

```text
http://localhost:3000/profile
```

If the session exists:

```text
Welcome JohnDoe
```

If there is no active session:

```text
Please log in first.
```

### Logout

```text
GET /logout
```

Open:

```text
http://localhost:3000/logout
```

The session is destroyed using:

```javascript
req.session.destroy()
```

Expected response:

```text
Session destroyed successfully
```

After logout, accessing `/profile` will display:

```text
Please log in first.
```

---

# Cookies vs Sessions

| Cookies | Sessions |
|---|---|
| Data is stored in the browser | Session data is stored on the server |
| Sent with relevant HTTP requests | Browser typically stores a session ID cookie |
| Can have an expiry time | Sessions can also have an expiry time |
| Useful for small client-side state | Useful for maintaining server-side user state |

---

# Testing

## Cookies

Test the routes in this order:

```text
/setcookie
     ↓
/getcookie
     ↓
/deletecookie
     ↓
/getcookie
```

The final `/getcookie` request should display:

```text
No cookie found.
```

## Sessions

Test the routes in this order:

```text
/login
    ↓
/profile
    ↓
/logout
    ↓
/profile
```

The final `/profile` request should display:

```text
Please log in first.
```

---

## Conclusion

This implementation demonstrates the basic use of **Cookies and Sessions in Express.js**.

Cookies store information in the browser, while sessions maintain user-specific information on the server and use a session identifier to recognize the client across requests.