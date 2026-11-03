const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  seedEmployees,
} = require('../controllers/employeeController');

// Metrics / stats route (must come before /:id)
router.get('/stats', getEmployeeStats);

// Seed route for demo purposes
router.post('/seed', seedEmployees);

// Standard CRUD routes
router.route('/')
  .get(getAllEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
