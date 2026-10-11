const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_URL = 'mongodb://localhost:27017/userdb';

mongoose.connect(DB_URL)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// User Model
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
        res.send(`
        <h1>User Management System</h1>

        <h2>Register New User</h2>

        <form action="/signup" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Sign Up</button>
        </form>

        <hr>

        <h2>Login</h2>

        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>

        <hr>

        <h2>View All Users</h2>

        <form action="/users" method="GET">
            <button type="submit">Show All Registered Users</button>
        </form>
    `);
});

app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username: username,
            email: email,
            password: password
        });

        await newUser.save();

        res.send(`
            <h2>User registered successfully!</h2>
            <p>Username: ${username}</p>
            <p>Email: ${email}</p>
            <a href="/">Go back to home</a>
        `);

    } catch (error) {
        if (error.code === 11000) {
            res.send(`
                <h2>Error: Username or email already exists</h2>
                <a href="/">Go back and try again</a>
            `);
        } else {
            res.send(`
                <h2>Error: ${error.message}</h2>
                <a href="/">Go back and try again</a>
            `);
        }
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user in MongoDB
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.send(`
                <h2>User not found</h2>
                <a href="/">Go back and try again</a>
            `);
        }

        if (user.password !== password) {
            return res.send(`
                <h2>Incorrect password</h2>
                <a href="/">Go back and try again</a>
            `);
        }

        res.send(`
            <h2>Login successful!</h2>
            <p>Welcome back, ${user.username}!</p>
            <p>Email: ${user.email}</p>
            <p>Account created: ${user.createdAt.toDateString()}</p>
            <a href="/">Go back to home</a>
        `);

    } catch (error) {
        res.send(`
            <h2>Error: ${error.message}</h2>
            <a href="/">Go back and try again</a>
        `);
    }
});

app.get('/users', async (req, res) => {
    try {
        const allUsers = await User.find();

        if (allUsers.length === 0) {
            return res.send(`
                <h2>No users registered yet</h2>
                <a href="/">Go back to home</a>
            `);
        }

        let userList = '<h2>Registered Users</h2><ul>';

        allUsers.forEach(user => {
            userList += `
                <li>
                    <strong>Username:</strong> ${user.username} |
                    <strong>Email:</strong> ${user.email} |
                    <strong>Joined:</strong> ${user.createdAt.toDateString()}
                </li>
            `;
        });

        userList += '</ul><a href="/">Go back to home</a>';

        res.send(userList);

    } catch (error) {
        res.send(`
            <h2>Error: ${error.message}</h2>
            <a href="/">Go back to home</a>
        `);
    }
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});