const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;

