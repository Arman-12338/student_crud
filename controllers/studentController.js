import Student from '../models/Student.js';

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Public
 */
export const createStudent = async (req, res, next) => {
  try {
    const { name, email, course } = req.body;

    // Explicitly check for missing required fields to return custom message
    if (!name || !email || !course) {
      res.status(400);
      throw new Error('Please provide all required fields: name, email, and course');
    }

    const student = await Student.create({ name, email, course });

    res.status(201).json({
      message: 'Student created successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Public
 */
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student by ID
 * @route   GET /api/students/:id
 * @access  Public
 */
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error(`Student not found with ID: ${req.params.id}`);
    }

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student by ID
 * @route   PUT /api/students/:id
 * @access  Public
 */
export const updateStudent = async (req, res, next) => {
  try {
    // Check if student exists first
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404);
      throw new Error(`Student not found with ID: ${req.params.id}`);
    }

    // Update student details.
    // 'new: true' returns the updated document.
    // 'runValidators: true' forces Mongoose validation on update.
    await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Student updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student by ID
 * @route   DELETE /api/students/:id
 * @access  Public
 */
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error(`Student not found with ID: ${req.params.id}`);
    }

    // Delete student
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
