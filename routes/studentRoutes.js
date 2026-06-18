import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';

const router = express.Router();

// Route mappings for /api/students
router.route('/')
  .post(createStudent)
  .get(getAllStudents);

// Route mappings for /api/students/:id
router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

export default router;
