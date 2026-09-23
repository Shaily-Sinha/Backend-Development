# Eisenhower Todo Application

A Todo web application built using Node.js, Express.js, EJS, and MongoDB.

The application organizes tasks using the Eisenhower Matrix based on their urgency and importance.

## Features

- Add new tasks
- View tasks in a 4-quadrant Eisenhower Matrix
  - Do - Urgent and Important
  - Schedule - Not Urgent and Important
  - Delegate - Urgent and Not Important
  - Eliminate - Not Urgent and Not Important
- Edit existing tasks
- Delete tasks
- Filter tasks by category and tag
- Add categories and tags to tasks
- Add due dates
- Responsive layout using CSS Grid
- MongoDB database storage

## Technologies Used

- Node.js
- Express.js
- EJS
- MongoDB
- HTML
- CSS

## Project Structure

    public/
        style.css

    views/
        edit.ejs
        index.ejs
        new.ejs

    app.js
    package.json
    package-lock.json
    README.md

## How to Run

1. Make sure Node.js and MongoDB are installed and MongoDB is running.

2. Open a terminal in the project directory.

3. Install the required dependencies:

    npm install

4. Start the application:

    node app.js

5. Open the following URL in a browser:

    http://localhost:3000

## MongoDB Configuration

The application uses the following MongoDB configuration:

- Database: `todo_lab`
- Collection: `tasks`
- Default MongoDB URL: `mongodb://127.0.0.1:27017`

The MongoDB connection URL can also be provided using the `MONGODB_URI` environment variable.

## Task Information

Each task can contain:

- Title
- Description
- Urgent status
- Important status
- Category
- Tags
- Due date
- Creation date

## Author

Shaily Sinha