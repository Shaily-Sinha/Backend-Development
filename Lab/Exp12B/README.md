# Experiment 12B - Session and Cookie Management in Node.js

## Aim

To understand state management in Node.js applications by implementing sessions and cookies using Express.js.

This experiment demonstrates how sessions and cookies can be used to maintain user-specific information across multiple HTTP requests.

---

## Technologies Used

- Node.js
- Express.js
- express-session
- cookie-parser
- JavaScript
- HTML

---

## Concepts Covered

- Stateless nature of HTTP
- State management
- Sessions
- Cookies
- Session creation and destruction
- Session-based visit tracking
- Setting, retrieving, and deleting cookies
- Maintaining login state using sessions
- Session cookies
- Cookie expiration
- `HttpOnly` cookies
- Login and logout flow

---

## Project Structure

```text
Exp12B/
│
├── screenshots/
│   ├── cookie-delete.png
│   ├── cookie-get.png
│   ├── cookie-set.png
│   ├── logged-in.png
│   ├── login-page.png
│   ├── session-counter.png
│   └── session-first-visit.png
│
├── session-cookie-demo/
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── cookie-example.js
├── session-express.js
└── README.md

---

# 1. Session Management

The `session-express.js` file demonstrates basic session management using the `express-session` package.

The application keeps track of how many times a user visits the page during the same session.

## Dependencies

```bash
npm install express express-session
```

## Session Configuration

```javascript
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));
```

### Configuration Options

- `secret` - used to sign the session ID cookie
- `resave: false` - prevents unchanged sessions from being saved again
- `saveUninitialized: true` - saves newly created sessions

---

## Visit Counter

The application stores the number of visits in:

```javascript
req.session.views
```

On the first visit:

```text
Welcome to the session demo. Refresh to count visits.
```

After refreshing the page:

```text
Welcome back! You visited 2 times.
```

The count continues increasing while the same session exists.

---

## Destroy Session

The session can be destroyed using:

```text
GET /destroy
```

The application uses:

```javascript
req.session.destroy()
```

After destroying the session, the visit counter starts again when a new session is created.

---

## Session Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Creates/updates the visit counter |
| GET | `/destroy` | Destroys the current session |

---

# 2. Cookie Management

The `cookie-example.js` file demonstrates how cookies can be created, retrieved, and deleted using `cookie-parser`.

## Dependencies

```bash
npm install express cookie-parser
```

---

## Set Cookie

Route:

```text
GET /set-cookie
```

The application creates a cookie using:

```javascript
res.cookie('username', 'JohnDoe', {
    maxAge: 900000
});
```

The cookie contains:

```text
Name: username
Value: JohnDoe
```

and remains valid for the specified `maxAge`.

---

## Get Cookie

Route:

```text
GET /get-cookie
```

The stored cookie is accessed using:

```javascript
req.cookies['username']
```

Example response:

```text
Cookie Retrieved: JohnDoe
```

---

## Delete Cookie

Route:

```text
GET /delete-cookie
```

The cookie is deleted using:

```javascript
res.clearCookie('username');
```

Example response:

```text
Cookie deleted
```

---

## Cookie Routes

| Method | Route | Description |
|---|---|---|
| GET | `/set-cookie` | Creates the `username` cookie |
| GET | `/get-cookie` | Retrieves the `username` cookie |
| GET | `/delete-cookie` | Deletes the `username` cookie |

---

# 3. Combined Session and Cookie Demo

The `session-cookie-demo` combines sessions and cookies in a simple login/logout application.

It demonstrates how a server can remember a user after login.

## Dependencies

```bash
npm install express express-session cookie-parser
```

---

## Middleware Used

### Cookie Parser

```javascript
app.use(cookieParser());
```

This allows the application to work with cookies.

### Form Data

```javascript
app.use(express.urlencoded({ extended: true }));
```

This parses the username submitted through the HTML login form.

### Session Middleware

```javascript
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
```

The session cookie expires after:

```text
60000 ms = 1 minute
```

---

# Login Flow

When the user first opens:

```text
http://localhost:3000
```

there is no username stored in the session, so the application displays a login form.

```text
Enter username
      ↓
    Login
```

When the form is submitted:

```text
POST /login
```

the username is stored in:

```javascript
req.session.username = username;
```

The application then redirects the user back to `/`.

---

## Remembering the User

After login, the home route checks:

```javascript
req.session.username
```

If a username exists, the application displays:

```text
Welcome back, username!
Logout
```

Therefore, the user remains recognized across subsequent requests while the session is active.

---

# Theme Cookie

During login, the application also creates a sample cookie:

```javascript
res.cookie('theme', 'dark', {
    maxAge: 900000,
    httpOnly: true
});
```

The cookie stores:

```text
theme = dark
```

### `httpOnly`

The `httpOnly: true` option prevents normal client-side JavaScript from accessing the cookie.

### `maxAge`

The theme cookie remains valid for:

```text
900000 ms = 15 minutes
```

---

# Logout

Route:

```text
GET /logout
```

When the user logs out:

```javascript
req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
});
```

The application:

1. Destroys the server-side session
2. Clears the `connect.sid` session cookie
3. Redirects the user back to the home page

---

# Combined Demo Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Displays login form or welcome message |
| POST | `/login` | Stores username in the session and creates theme cookie |
| GET | `/logout` | Destroys session and redirects to home |

---

# Application Workflow

```text
User visits /
      ↓
Is username stored in session?
      ↓
     No
      ↓
Display Login Form
      ↓
User enters username
      ↓
POST /login
      ↓
Store username in session
      +
Create theme cookie
      ↓
Redirect to /
      ↓
Display "Welcome back"
      ↓
User clicks Logout
      ↓
Destroy session
      ↓
Clear connect.sid
      ↓
Redirect to Login
```

---

# Sessions vs Cookies

| Feature | Session | Cookie |
|---|---|---|
| Main storage | Server | Browser |
| Browser normally stores | Session ID | Cookie data |
| Access in this experiment | `req.session` | `req.cookies` |
| Create/store | `req.session.property` | `res.cookie()` |
| Delete | `req.session.destroy()` | `res.clearCookie()` |
| Example in this experiment | Username / visit count | Username / theme |

---

# Running the Experiment

> All three applications use port `3000`, so run only one of them at a time.

## Session Example

Run:

```bash
node session-express.js
```

Open:

```text
http://localhost:3000
```

Refresh the page several times to observe the session counter.

Destroy the session using:

```text
http://localhost:3000/destroy
```

---

## Cookie Example

Run:

```bash
node cookie-example.js
```

Test the routes in this order:

```text
http://localhost:3000/set-cookie
http://localhost:3000/get-cookie
http://localhost:3000/delete-cookie
```

---

## Combined Session-Cookie Demo

Navigate to:

```bash
cd session-cookie-demo
```

Install dependencies if required:

```bash
npm install
```

Run:

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

Enter a username and click **Login**.

The application will remember the username using the session until logout or session expiration.

---

# Important Methods and Properties

| Method / Property | Purpose |
|---|---|
| `req.session` | Access session data |
| `req.session.views` | Store visit count |
| `req.session.username` | Store logged-in username |
| `req.session.destroy()` | Destroy current session |
| `res.cookie()` | Create a cookie |
| `req.cookies` | Access cookies |
| `res.clearCookie()` | Delete a cookie |
| `res.redirect()` | Redirect to another route |
| `express.urlencoded()` | Parse HTML form data |

---

# Screenshots

The following screenshots demonstrate the working session, cookie, and combined login implementations.

## Session Management

### First Visit

![Session First Visit](screenshots/session-first-visit.png)

### Session Visit Counter

![Session Counter](screenshots/session-counter.png)

---

## Cookie Management

### Cookie Created

![Cookie Created](screenshots/cookie-set.png)

### Cookie Retrieved

![Cookie Retrieved](screenshots/cookie-get.png)

### Cookie Deleted

![Cookie Deleted](screenshots/cookie-delete.png)

---

## Combined Session and Cookie Demo

### Login Page

![Login Page](screenshots/login-page.png)

### Logged-in User

![Logged-in User](screenshots/logged-in.png)

---

# Security Notes

This experiment is intended for learning session and cookie fundamentals.

Some important practices for real-world applications include:

- Do not store passwords or sensitive information directly in cookies
- Keep sensitive user state on the server where appropriate
- Use `HttpOnly` for cookies that should not be accessible through client-side JavaScript
- Use secure cookies over HTTPS
- Keep secrets outside the source code using environment variables
- Use a persistent session store for production applications

---

# Learning Outcomes

After completing this experiment, I learned how to:

- Understand why state management is needed with HTTP
- Create and maintain sessions using `express-session`
- Store values inside `req.session`
- Track user activity using session variables
- Destroy an existing session
- Create cookies using `res.cookie()`
- Read cookies using `req.cookies`
- Delete cookies using `res.clearCookie()`
- Maintain a simple login state using sessions
- Use sessions and cookies together
- Implement basic login and logout flow

---

# Result

Successfully implemented state management using sessions and cookies in Node.js and Express.js.

The experiment demonstrates three implementations:

1. **Session Management** - tracking page visits and destroying sessions.
2. **Cookie Management** - creating, retrieving, and deleting cookies.
3. **Combined Session and Cookie Demo** - maintaining a user's login state using sessions while also storing a sample theme preference in a cookie.