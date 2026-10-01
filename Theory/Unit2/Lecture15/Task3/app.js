const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/student_management')
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('Connection error:', error));


// Define Student Schema
const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    branch: {
        type: String,
        enum: ['CSE', 'ECE', 'IT', 'ME', 'CE']
    },

    enrollmentDate: {
        type: Date,
        default: Date.now
    },

    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});


// Create Model
const Student = mongoose.model('Student', studentSchema);


// ---------------- CREATE ----------------

async function createStudent() {

    const student = new Student({
        name: 'Aarav',
        email: 'aarav@upes.ac.in',
        branch: 'CSE'
    });

    await student.save();

    console.log('Student Created:');
    console.log(student);

    return student;
}


// ---------------- READ ----------------

async function findStudents() {

    const cseStudents = await Student.find({
        branch: 'CSE'
    });

    console.log('CSE Students:');
    console.log(cseStudents);
}


// ---------------- UPDATE ----------------

async function updateStudent(id) {

    const student = await Student.findByIdAndUpdate(
        id,
        { branch: 'ECE' },
        { new: true }
    );

    console.log('Updated Student:');
    console.log(student);
}


// ---------------- DELETE ----------------

async function deleteStudent(id) {

    await Student.findByIdAndDelete(id);

    console.log('Student Deleted Successfully');
}

async function main() {

    // CREATE
    const student = await createStudent();

    // READ
    await findStudents();

    // UPDATE
    await updateStudent(student._id);

    // DELETE
    await deleteStudent(student._id);

    // Close database connection
    await mongoose.connection.close();
}

main();