import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Export the Student model
const Student = mongoose.model('Student', studentSchema);

export default Student;
