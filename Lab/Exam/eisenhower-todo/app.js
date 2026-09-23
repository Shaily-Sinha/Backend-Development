const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const mongoURL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const client = new MongoClient(mongoURL);

let tasksCollection;

function normaliseTags(tags) {
    return (tags || "")
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .filter((tag, index, allTags) => allTags.indexOf(tag) === index);
}

// -------------------------
// Middleware
// -------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// -------------------------
// Connect MongoDB
// -------------------------

async function connectDB() {
    await client.connect();

    const database = client.db("todo_lab");

    tasksCollection = database.collection("tasks");

    console.log("Connected to MongoDB");
}


// -------------------------
// Home Page
// -------------------------

app.get("/", async (req, res) => {

    try {

        const allTasks = await tasksCollection
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        const category = (req.query.category || "").trim();
        const tag = (req.query.tag || "").trim().toLowerCase();

        const tasks = allTasks
            .map((task) => ({
                ...task,
                category: task.category || "General",
                tags: Array.isArray(task.tags) ? task.tags : [],
                dueDate: task.dueDate || ""
            }))
            .filter((task) => !category || task.category === category)
            .filter((task) => !tag || task.tags.includes(tag));

        const categories = [...new Set(allTasks.map((task) => task.category || "General"))]
            .sort((first, second) => first.localeCompare(second));
        const tags = [...new Set(allTasks.flatMap((task) => task.tags || []))]
            .sort((first, second) => first.localeCompare(second));

        res.render("index", {
            tasks,
            categories,
            tags,
            filters: { category, tag }
        });

    } catch (error) {

        console.log(error);
        res.status(500).send("Error retrieving tasks");

    }

});


// -------------------------
// Add Task Page
// -------------------------

app.get("/tasks/new", (req, res) => {

    res.render("new");

});


// -------------------------
// Add Task
// -------------------------

app.post("/tasks", async (req, res) => {

    try {

        const {
            title,
            description,
            isUrgent,
            isImportant,
            category,
            tags,
            dueDate
        } = req.body;


        // Validation
        if (!title || title.trim() === "") {

            return res.status(400).send("Title is required");

        }


        const task = {

            title: title.trim(),

            description: description || "",

            isUrgent: isUrgent === "on",

            isImportant: isImportant === "on",

            category: category?.trim() || "General",

            tags: normaliseTags(tags),

            dueDate: dueDate || "",

            createdAt: new Date()

        };


        await tasksCollection.insertOne(task);


        res.redirect("/");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error adding task");

    }

});


// -------------------------
// Edit Task Page
// -------------------------

app.get("/tasks/:id/edit", async (req, res) => {

    try {

        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid task ID");
        }

        const task = await tasksCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!task) {
            return res.status(404).send("Task not found");
        }

        res.render("edit", { task });

    } catch (error) {

        console.log(error);
        res.status(500).send("Error retrieving task");

    }

});


// -------------------------
// Update Task
// -------------------------

app.post("/tasks/:id/update", async (req, res) => {

    try {

        const id = req.params.id;
        const { title, description, isUrgent, isImportant, category, tags, dueDate } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid task ID");
        }

        if (!title || title.trim() === "") {
            return res.status(400).send("Title is required");
        }

        const result = await tasksCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: title.trim(),
                    description: description || "",
                    isUrgent: isUrgent === "on",
                    isImportant: isImportant === "on",
                    category: category?.trim() || "General",
                    tags: normaliseTags(tags),
                    dueDate: dueDate || "",
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send("Task not found");
        }

        res.redirect("/");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error updating task");

    }

});


// -------------------------
// Delete Task
// -------------------------

app.post("/tasks/:id/delete", async (req, res) => {

    try {

        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid task ID");
        }

        await tasksCollection.deleteOne({
            _id: new ObjectId(id)
        });


        res.redirect("/");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error deleting task");

    }

});


// -------------------------
// Start Server
// -------------------------

connectDB()
    .then(() => {

        app.listen(PORT, () => {

            console.log(`Server running at http://localhost:${PORT}`);

        });

    })
    .catch((error) => {

        console.log("MongoDB connection failed:", error);

    });
