const User = require('../models/User');

const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || 'suripallapothu18@gmail.com';
const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD || 'Surendra@2407';
const ADMIN_NAME = process.env.VITE_ADMIN_NAME || 'Surendra';

// Seed default users into MongoDB Atlas if they do not exist
const seedInitialUsers = async () => {
  try {
    const defaults = [
      {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        password: ADMIN_PASSWORD,
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Surendra (Admin)',
        email: 'surendrap2407@gmail.com',
        password: ADMIN_PASSWORD,
        role: 'admin',
        status: 'active',
      },
      {
        name: 'System Admin',
        email: 'admin@staffpulse.io',
        password: ADMIN_PASSWORD,
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Operations Manager',
        email: 'manager@staffpulse.io',
        password: 'manager123',
        role: 'manager',
        status: 'active',
      },
      {
        name: 'Demo Employee User',
        email: 'employee@staffpulse.io',
        password: 'employee123',
        role: 'employee',
        status: 'active',
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@company.internal',
        password: 'employee123',
        role: 'employee',
        status: 'active',
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@company.internal',
        password: 'employee123',
        role: 'employee',
        status: 'active',
      },
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@company.internal',
        password: 'employee123',
        role: 'employee',
        status: 'active',
      },
    ];

    for (const def of defaults) {
      const exists = await User.findOne({ email: def.email });
      if (!exists) {
        await User.create(def);
        console.log(`[Auth Seed] Created default ${def.role} user: ${def.email}`);
      }
    }
  } catch (err) {
    console.error('[Auth Seed] Error seeding default users:', err.message);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    // Check user in MongoDB Atlas
    let user = await User.findOne({ email });

    // Master password check (Surendra@2407) works as override for quick demo
    const isMasterPassword = password === ADMIN_PASSWORD;

    if (user) {
      if (user.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'This account has been suspended by an administrator.' });
      }

      const isPasswordValid = user.password === password || isMasterPassword;
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Incorrect password for this account.' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Login successful via MongoDB Atlas verification.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          status: user.status,
        },
      });
    }

    // If user does not exist in MongoDB:
    // 1. If password is the master admin password, auto-create as Admin
    if (isMasterPassword) {
      const name = email.split('@')[0].replace(/[._-]/g, ' ');
      user = await User.create({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        password,
        role: role === 'admin' ? 'admin' : (role || 'admin'),
        status: 'active',
      });

      return res.status(200).json({
        success: true,
        message: 'Master authentication granted. User registered in MongoDB Atlas.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          status: user.status,
        },
      });
    }

    // 2. If logging into Employee or Manager portal with password >= 4 chars, auto-register in MongoDB
    if ((role === 'employee' || role === 'manager') && password.length >= 4) {
      const name = email.split('@')[0].replace(/[._-]/g, ' ');
      user = await User.create({
        name: name.charAt(0).toUpperCase() + name.slice(1) || `${role} User`,
        email,
        password,
        role: role,
        status: 'active',
      });

      return res.status(200).json({
        success: true,
        message: `New ${role} account created and verified in MongoDB Atlas.`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          status: user.status,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Account not found. Please register or verify your credentials.',
    });
  } catch (error) {
    console.error('[Auth Error] Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication: ' + error.message });
  }
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists in MongoDB.' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email,
      password,
      role: role || 'employee',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully in MongoDB Atlas.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        picture: newUser.picture,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('[Auth Error] Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration: ' + error.message });
  }
};

// GET /api/auth/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users: ' + error.message });
  }
};

// PUT /api/auth/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['employee', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'Role updated successfully.', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update role: ' + error.message });
  }
};

// PUT /api/auth/users/:id/status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${user.status}.`,
      data: { id: user._id, status: user.status },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle status: ' + error.message });
  }
};

// DELETE /api/auth/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.email === ADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Cannot delete primary admin account.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted from MongoDB Atlas.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user: ' + error.message });
  }
};

module.exports = {
  seedInitialUsers,
  login,
  register,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
};

