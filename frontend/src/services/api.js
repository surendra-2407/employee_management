/**
 * API Service for Employee Management System
 */

// If VITE_API_URL is provided, use it; otherwise fallback to '/api' for Vite / Nginx reverse proxy
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Check backend server health
  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      return { status: 'down', error: err.message };
    }
  },

  // Fetch employees list with query parameters
  async getEmployees({ search = '', department = 'All', sortBy = 'createdAt', order = 'desc' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (department && department !== 'All') params.append('department', department);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);

    const res = await fetch(`${BASE_URL}/employees?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch employees');
    }
    return data;
  },

  // Fetch dashboard summary statistics
  async getStats() {
    const res = await fetch(`${BASE_URL}/employees/stats`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch statistics');
    }
    return data.data;
  },

  // Get single employee by ID
  async getEmployeeById(id) {
    const res = await fetch(`${BASE_URL}/employees/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch employee details');
    }
    return data.data;
  },

  // Create new employee
  async createEmployee(employeeData) {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || (data.errors ? data.errors.join(', ') : 'Failed to create employee'));
    }
    return data;
  },

  // Update existing employee
  async updateEmployee(id, employeeData) {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || (data.errors ? data.errors.join(', ') : 'Failed to update employee'));
    }
    return data;
  },

  // Delete employee
  async deleteEmployee(id) {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete employee');
    }
    return data;
  },

  // Seed sample demo data
  async seedDemoEmployees(force = false) {
    const res = await fetch(`${BASE_URL}/employees/seed?force=${force}`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to seed sample data');
    }
    return data;
  },
};
