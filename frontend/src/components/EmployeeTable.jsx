import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Edit3,
  Trash2,
  Mail,
  Briefcase,
  DollarSign,
  UserPlus,
  ArrowUpDown,
  Building2,
  Sparkles,
  Download,
  Eye,
  Check,
  Copy,
  Calendar,
  BadgeCheck,
  X,
  ExternalLink,
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Human Resources',
  'Operations',
];

const DEPT_BADGES = {
  Engineering: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  Product: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  Design: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800',
  Marketing: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
  Sales: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  Finance: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  'Human Resources': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800',
  Operations: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
};

function RupeeIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  );
}

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatSalary = (salary) => {
  if (!salary && salary !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(salary);
};

export default function EmployeeTable({
  employees,
  isLoading,
  search,
  setSearch,
  department,
  setDepartment,
  sortBy,
  setSortBy,
  order,
  setOrder,
  viewMode,
  setViewMode,
  onEdit,
  onDelete,
  onOpenAddModal,
  onSeedData,
  currentUser,
  showToast,
}) {
  const [viewingProfile, setViewingProfile] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState('');

  const handleExportCSV = () => {
    if (!employees || employees.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Position', 'Department', 'Salary', 'Date Added'];
    const rows = employees.map((emp) => [
      emp._id || emp.id || '',
      `"${(emp.name || '').replace(/"/g, '""')}"`,
      emp.email || '',
      `"${(emp.position || '').replace(/"/g, '""')}"`,
      emp.department || '',
      emp.salary || 0,
      emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StaffPulse_Employees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast(`Downloaded ${employees.length} employee records as CSV!`, 'success');
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2000);
    if (showToast) showToast('Email copied to clipboard!', 'info');
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'name-asc') {
      setSortBy('name');
      setOrder('asc');
    } else if (val === 'name-desc') {
      setSortBy('name');
      setOrder('desc');
    } else if (val === 'salary-desc') {
      setSortBy('salary');
      setOrder('desc');
    } else if (val === 'salary-asc') {
      setSortBy('salary');
      setOrder('asc');
    } else if (val === 'newest') {
      setSortBy('createdAt');
      setOrder('desc');
    } else if (val === 'oldest') {
      setSortBy('createdAt');
      setOrder('asc');
    }
  };

  const currentSortKey = `${sortBy}-${order}`;

  return (
    <div className="space-y-4">
      {/* Department Quick Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {DEPARTMENTS.map((dept) => {
          const count = dept === 'All'
            ? employees.length
            : employees.filter((e) => e.department === dept).length;
          const isActive = department === dept;
          return (
            <button
              key={dept}
              onClick={() => setDepartment(dept)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <span>{dept}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls: Search, Filter, Sort, View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name, role, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side controls: Department filter, Sort, View Toggle, Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department dropdown */}
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={currentSortKey}
              onChange={handleSortChange}
              className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="salary-desc">Salary (High → Low)</option>
              <option value="salary-asc">Salary (Low → High)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Download employees as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Table / Grid View Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50/50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid cards view"
              aria-label="Grid cards view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && employees.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No employees found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {search || department !== 'All'
              ? 'Try adjusting your search criteria or clearing department filters.'
              : 'Your employee directory is empty. Start by adding team members or load sample demo data.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add First Employee</span>
            </button>
            <button
              onClick={onSeedData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Populate Demo Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Content: Table View */}
      {!isLoading && employees.length > 0 && viewMode === 'table' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th scope="col" className="px-6 py-4">Employee</th>
                  <th scope="col" className="px-6 py-4">Position / Role</th>
                  <th scope="col" className="px-6 py-4">Department</th>
                  <th scope="col" className="px-6 py-4">Salary</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {employees.map((emp) => {
                  const badgeClass =
                    DEPT_BADGES[emp.department] ||
                    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

                  return (
                    <tr
                      key={emp._id || emp.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                            {getInitials(emp.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {emp.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{emp.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{emp.position}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}
                        >
                          {emp.department}
                        </span>
                      </td>

                      {/* Salary */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-slate-900 dark:text-emerald-400">
                          {formatSalary(emp.salary)}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">/yr</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingProfile(emp)}
                            className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 dark:hover:text-sky-400 transition-colors"
                            title="View Profile Details"
                            aria-label={`View ${emp.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(emp)}
                            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
                            title="Edit employee"
                            aria-label={`Edit ${emp.name}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(emp)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                            title="Delete employee"
                            aria-label={`Delete ${emp.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content: Grid / Cards View */}
      {!isLoading && employees.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {employees.map((emp) => {
            const badgeClass =
              DEPT_BADGES[emp.department] ||
              'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

            return (
              <div
                key={emp._id || emp.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
                          {emp.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {emp.position}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}
                    >
                      {emp.department}
                    </span>
                  </div>

                  {/* Card info */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <RupeeIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-mono font-semibold text-slate-900 dark:text-emerald-400">
                        {formatSalary(emp.salary)}
                      </span>
                      <span className="text-[11px] text-slate-400">annual compensation</span>
                    </div>
                  </div>
                </div>

                {/* Card actions bottom */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    ID: {(emp._id || emp.id).slice(-6)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingProfile(emp)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
                      title="View Profile Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => onEdit(emp)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(emp)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Employee Profile Details Modal */}
      {viewingProfile && (
        <EmployeeProfileModal
          employee={viewingProfile}
          onClose={() => setViewingProfile(null)}
          onEdit={(emp) => {
            setViewingProfile(null);
            onEdit(emp);
          }}
          onCopyEmail={handleCopyEmail}
          copiedEmail={copiedEmail}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

/* ── Employee Profile Details Modal ────────────────────────────── */
function EmployeeProfileModal({ employee, onClose, onEdit, onCopyEmail, copiedEmail, currentUser }) {
  if (!employee) return null;
  const isManagerOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const monthlySalary = employee.salary ? Math.round(employee.salary / 12) : 0;
  const badgeClass =
    DEPT_BADGES[employee.department] ||
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Modal Top Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 relative px-6 flex items-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="translate-y-1/2 flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-lg">
              <div className="h-full w-full rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                {getInitials(employee.name)}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="pt-12 p-6 sm:p-8 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {employee.name}
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <BadgeCheck className="w-3.5 h-3.5" /> Active
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>{employee.position}</span>
              </p>
            </div>
            <span className={`inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
              {employee.department}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Email */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Work Email</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{employee.email}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCopyEmail(employee.email)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                    title="Copy Email"
                  >
                    {copiedEmail === employee.email ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`mailto:${employee.email}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                    title="Send Email"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Annual Compensation</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-bold text-slate-900 dark:text-emerald-400">
                  {formatSalary(employee.salary)}
                </span>
                <span className="text-xs text-slate-400">/yr</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Approx. ₹{monthlySalary.toLocaleString('en-IN')}/month</p>
            </div>

            {/* Employee ID */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Employee Reference ID</p>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                EMP-{(employee._id || employee.id || '000000').slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Member Since */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Joined Date</p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently Added'}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {isManagerOrAdmin && (
              <button
                onClick={() => onEdit(employee)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all"
              >
                Edit Employee
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
