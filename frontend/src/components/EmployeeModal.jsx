import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Building, Mail, DollarSign, Loader2 } from 'lucide-react';

const DEPARTMENTS = [
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
];

export default function EmployeeModal({ isOpen, onClose, onSubmit, employee }) {
  const isEditing = Boolean(employee);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Engineering',
    email: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        position: employee.position || '',
        department: employee.department || 'Engineering',
        email: employee.email || '',
        salary: employee.salary !== undefined ? String(employee.salary) : '',
      });
    } else {
      setFormData({
        name: '',
        position: '',
        department: 'Engineering',
        email: '',
        salary: '',
      });
    }
    setErrors({});
    setServerError('');
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Job position is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.salary || isNaN(formData.salary) || Number(formData.salary) < 0) {
      newErrors.salary = 'Please enter a valid positive salary amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        salary: Number(formData.salary),
      });
      onClose();
    } catch (err) {
      setServerError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing ? 'Update the details for this team member' : 'Fill in the information to add a team member'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.name
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="e.g. jane.doe@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
          </div>

          {/* Position & Department (2-col grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Position / Role *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Staff Software Engineer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.position
                      ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.position && <p className="mt-1 text-xs text-rose-500">{errors.position}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Department *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Annual Salary (INR - ₹) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="5000"
                placeholder="e.g. 1200000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.salary
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.salary && <p className="mt-1 text-xs text-rose-500">{errors.salary}</p>}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Employee'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
