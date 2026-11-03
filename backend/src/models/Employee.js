const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    position: {
      type: String,
      required: [true, 'Position/Title is required'],
      trim: true,
      maxlength: [100, 'Position cannot exceed 100 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Engineering',
          'Product',
          'Marketing',
          'Sales',
          'Human Resources',
          'Finance',
          'Design',
          'Operations',
          'Legal',
          'Other',
        ],
        message: '{VALUE} is not a supported department',
      },
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Please provide a valid email address'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary must be a positive number'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for search optimization
employeeSchema.index({ name: 'text', position: 'text', email: 'text' });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
