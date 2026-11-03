const mongoose = require('mongoose');
const Employee = require('../models/Employee');

// Initial seed data for demo / quick start
const sampleEmployees = [
  {
    name: 'Sarah Connor',
    position: 'Lead Full Stack Architect',
    department: 'Engineering',
    email: 'sarah.connor@cyberdyne.io',
    salary: 145000,
  },
  {
    name: 'Alex Rivera',
    position: 'Senior DevOps Engineer',
    department: 'Engineering',
    email: 'alex.rivera@company.internal',
    salary: 132000,
  },
  {
    name: 'Maya Lin',
    position: 'Principal Product Designer',
    department: 'Design',
    email: 'maya.lin@company.internal',
    salary: 118000,
  },
  {
    name: 'David Kim',
    position: 'Director of Product Management',
    department: 'Product',
    email: 'david.kim@company.internal',
    salary: 155000,
  },
  {
    name: 'Elena Rostova',
    position: 'Senior Financial Analyst',
    department: 'Finance',
    email: 'elena.rostova@company.internal',
    salary: 105000,
  },
  {
    name: 'Marcus Johnson',
    position: 'Global VP of Sales',
    department: 'Sales',
    email: 'marcus.j@company.internal',
    salary: 160000,
  },
  {
    name: 'Priya Sharma',
    position: 'People Operations Manager',
    department: 'Human Resources',
    email: 'priya.sharma@company.internal',
    salary: 98000,
  },
  {
    name: 'Liam Vance',
    position: 'Growth Marketing Lead',
    department: 'Marketing',
    email: 'liam.vance@company.internal',
    salary: 112000,
  },
];

// @desc    Get all employees (with search, filter, and sorting)
// @route   GET /api/employees
const getAllEmployees = async (req, res) => {
  try {
    const { search, department, sortBy, order } = req.query;

    const filter = {};

    if (department && department !== 'All') {
      filter.department = department;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { position: regex },
        { department: regex },
        { email: regex },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy) {
      const sortDirection = order === 'asc' ? 1 : -1;
      sortOptions = { [sortBy]: sortDirection };
    }

    const employees = await Employee.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employees',
      error: error.message,
    });
  }
};

// @desc    Get dashboard metrics & stats
// @route   GET /api/employees/stats
const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    if (totalEmployees === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalEmployees: 0,
          totalPayroll: 0,
          averageSalary: 0,
          highestSalary: 0,
          lowestSalary: 0,
          departmentStats: [],
        },
      });
    }

    const [salaryStats] = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalPayroll: { $sum: '$salary' },
          averageSalary: { $avg: '$salary' },
          highestSalary: { $max: '$salary' },
          lowestSalary: { $min: '$salary' },
        },
      },
    ]);

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          totalSalary: { $sum: '$salary' },
          avgSalary: { $avg: '$salary' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalPayroll: salaryStats ? salaryStats.totalPayroll : 0,
        averageSalary: salaryStats ? Math.round(salaryStats.averageSalary) : 0,
        highestSalary: salaryStats ? salaryStats.highestSalary : 0,
        lowestSalary: salaryStats ? salaryStats.lowestSalary : 0,
        departmentStats,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message,
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Employee ID format',
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee',
      error: error.message,
    });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const { name, position, department, email, salary } = req.body;

    // Check if email already exists
    const existing = await Employee.findOne({ email: email?.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `An employee with email '${email}' already exists.`,
      });
    }

    const employee = await Employee.create({
      name,
      position,
      department,
      email,
      salary: Number(salary),
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Employee ID format',
      });
    }

    const { name, position, department, email, salary } = req.body;

    // Check if email belongs to someone else
    if (email) {
      const conflict = await Employee.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: id },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `The email '${email}' is already in use by another employee.`,
        });
      }
    }

    const updatedData = {
      name,
      position,
      department,
      email,
    };
    if (salary !== undefined) {
      updatedData.salary = Number(salary);
    }

    const employee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message,
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Employee ID format',
      });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Employee '${employee.name}' deleted successfully`,
      data: { id: employee._id },
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};

// @desc    Seed sample employees
// @route   POST /api/employees/seed
const seedEmployees = async (req, res) => {
  try {
    const existingCount = await Employee.countDocuments();
    if (existingCount > 0 && !req.query.force) {
      return res.status(200).json({
        success: true,
        message: `Database already has ${existingCount} employee records. Pass ?force=true to overwrite.`,
        count: existingCount,
      });
    }

    if (req.query.force === 'true') {
      await Employee.deleteMany({});
    }

    const inserted = await Employee.insertMany(sampleEmployees);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} sample employees!`,
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error('Error seeding employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed sample employees',
      error: error.message,
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  seedEmployees,
};
