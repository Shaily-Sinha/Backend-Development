// ================================
// GET HTML ELEMENTS
// ================================

const noteInput = document.getElementById("noteInput");
const categoryInput = document.getElementById("categoryInput");
const addNoteBtn = document.getElementById("addNoteBtn");

const notesContainer = document.getElementById("notesContainer");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const themeBtn = document.getElementById("themeBtn");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");


// ================================
// LOAD NOTES FROM LOCAL STORAGE
// ================================

let notes = JSON.parse(localStorage.getItem("notes")) || [];

notes = notes.map(function (note) {

    return {
        id: note.id,
        text: note.text,
        category: note.category || "General",
        completed: note.completed || false,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt || note.createdAt
    };

});

// ================================
// SAVE NOTES
// ================================

function saveNotes() {

    localStorage.setItem("notes", JSON.stringify(notes));

}


// ================================
// ADD NEW NOTE
// ================================

addNoteBtn.addEventListener("click", function () {

    const text = noteInput.value.trim();

    const category = categoryInput.value.trim() || "General";


    // Don't allow empty notes

    if (text === "") {

        alert("Please write something first.");

        return;
    }


    // Create note object

    const note = {

        id: Date.now(),

        text: text,

        category: category,

        completed: false,

        createdAt: new Date().toLocaleString(),

        updatedAt: new Date().toLocaleString()

    };


    // Add note to array

    notes.push(note);


    // Save

    saveNotes();


    // Display

    displayNotes();


    // Clear inputs

    noteInput.value = "";

    categoryInput.value = "";

});


// ================================
// DISPLAY NOTES
// ================================

function displayNotes() {

    notesContainer.innerHTML = "";


    // Get search text

    const searchText = searchInput.value.toLowerCase().trim();


    // Get selected filter

    const filter = filterSelect.value;


    // Filter notes

    const filteredNotes = notes.filter(function (note) {


        // Search filter

        const matchesSearch =
            note.text.toLowerCase().includes(searchText) ||
            note.category.toLowerCase().includes(searchText);


        // Status filter

        let matchesStatus = true;


        if (filter === "active") {

            matchesStatus = !note.completed;

        }


        if (filter === "completed") {

            matchesStatus = note.completed;

        }


        return matchesSearch && matchesStatus;

    });


    // Display filtered notes

    filteredNotes.forEach(function (note) {


        const noteElement = document.createElement("div");


        noteElement.className = "note";


        // Add completed class

        if (note.completed) {

            noteElement.classList.add("completed");

        }


        // Allow dragging

        noteElement.draggable = true;


        noteElement.dataset.id = note.id;


        noteElement.innerHTML = `

            <div class="note-text">
                ${note.text}
            </div>

            <div class="note-category">
                ${note.category}
            </div>

            <div class="note-date">

                Created: ${note.createdAt}

                <br>

                Updated: ${note.updatedAt}

            </div>

            <div class="note-actions">

                <button
                    class="complete-btn"
                    onclick="toggleComplete(${note.id})"
                >
                    ${note.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>


                <button
                    class="edit-btn"
                    onclick="editNote(${note.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteNote(${note.id})"
                >
                    Delete
                </button>

            </div>

        `;


        // Drag events

        noteElement.addEventListener(
            "dragstart",
            handleDragStart
        );


        noteElement.addEventListener(
            "dragover",
            handleDragOver
        );


        noteElement.addEventListener(
            "drop",
            handleDrop
        );


        noteElement.addEventListener(
            "dragend",
            handleDragEnd
        );


        notesContainer.appendChild(noteElement);

    });


    // Show message if no notes

    if (filteredNotes.length === 0) {

        notesContainer.innerHTML =
            "<p>No notes found.</p>";

    }

}


// ================================
// EDIT NOTE
// ================================

function editNote(id) {

    const note = notes.find(function (note) {

        return note.id === id;

    });


    if (!note) {

        return;

    }


    const newText = prompt(
        "Edit your note:",
        note.text
    );


    if (newText === null) {

        return;

    }


    const updatedText = newText.trim();


    if (updatedText === "") {

        alert("Note cannot be empty.");

        return;

    }


    const newCategory = prompt(
        "Edit category:",
        note.category
    );


    if (newCategory === null) {

        return;

    }


    note.text = updatedText;

    note.category =
        newCategory.trim() || "General";


    // Update timestamp

    note.updatedAt =
        new Date().toLocaleString();


    saveNotes();

    displayNotes();

}


// ================================
// DELETE NOTE
// ================================

function deleteNote(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this note?"
    );


    if (!confirmed) {

        return;

    }


    notes = notes.filter(function (note) {

        return note.id !== id;

    });


    saveNotes();

    displayNotes();

}


// ================================
// MARK COMPLETE / INCOMPLETE
// ================================

function toggleComplete(id) {

    const note = notes.find(function (note) {

        return note.id === id;

    });


    if (!note) {

        return;

    }


    note.completed = !note.completed;


    note.updatedAt =
        new Date().toLocaleString();


    saveNotes();

    displayNotes();

}


// ================================
// SEARCH
// ================================

searchInput.addEventListener(
    "input",
    displayNotes
);


// ================================
// FILTER
// ================================

filterSelect.addEventListener(
    "change",
    displayNotes
);


// ================================
// DARK / LIGHT MODE
// ================================

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent =
            "☀️ Light Mode";

    } else {

        document.body.classList.remove("dark");

        themeBtn.textContent =
            "🌙 Dark Mode";

    }

}


// Load saved theme

const savedTheme =
    localStorage.getItem("theme") || "light";


applyTheme(savedTheme);


// Toggle theme

themeBtn.addEventListener("click", function () {

    const currentTheme =
        document.body.classList.contains("dark")
            ? "dark"
            : "light";


    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";


    localStorage.setItem(
        "theme",
        newTheme
    );


    applyTheme(newTheme);

});


// ================================
// EXPORT NOTES AS JSON
// ================================

exportBtn.addEventListener("click", function () {

    const jsonData =
        JSON.stringify(notes, null, 2);


    const blob = new Blob(
        [jsonData],
        { type: "application/json" }
    );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = "notes.json";


    link.click();


    URL.revokeObjectURL(url);

});


// ================================
// IMPORT NOTES
// ================================

importBtn.addEventListener("click", function () {

    importInput.click();

});


importInput.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function (event) {

            try {

                const importedNotes =
                    JSON.parse(event.target.result);


                if (!Array.isArray(importedNotes)) {

                    throw new Error(
                        "Invalid file format"
                    );

                }


                notes = importedNotes;


                saveNotes();

                displayNotes();


                alert("Notes imported successfully.");

            }

            catch (error) {

                alert(
                    "Invalid JSON file."
                );

            }

        };


        reader.readAsText(file);


        // Allow selecting the same file again

        importInput.value = "";

    }
);


// ================================
// DRAG AND DROP
// ================================

let draggedId = null;


// Drag start

function handleDragStart(event) {

    draggedId =
        Number(event.currentTarget.dataset.id);


    event.currentTarget.classList.add(
        "dragging"
    );

}


// Drag over

function handleDragOver(event) {

    event.preventDefault();

}


// Drop

function handleDrop(event) {

    event.preventDefault();


    const targetId =
        Number(event.currentTarget.dataset.id);


    if (
        draggedId === null ||
        draggedId === targetId
    ) {

        return;

    }


    const draggedIndex =
        notes.findIndex(function (note) {

            return note.id === draggedId;

        });


    const targetIndex =
        notes.findIndex(function (note) {

            return note.id === targetId;

        });


    if (
        draggedIndex === -1 ||
        targetIndex === -1
    ) {

        return;

    }


    // Remove dragged note

    const draggedNote =
        notes.splice(draggedIndex, 1)[0];


    // Insert before target

    notes.splice(
        targetIndex,
        0,
        draggedNote
    );


    saveNotes();

    displayNotes();

}


// Drag end

function handleDragEnd(event) {

    event.currentTarget.classList.remove(
        "dragging"
    );

}


// ================================
// DISPLAY NOTES WHEN PAGE LOADS
// ================================

displayNotes();