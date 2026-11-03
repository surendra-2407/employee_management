import React from 'react';
import { Users, TrendingUp, Building2 } from 'lucide-react';

function RupeeIcon({ className = "w-5 h-5" }) {
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

export default function EmployeeStats({ stats }) {
  const formatCurrency = (val) => {
    if (!val && val !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees ?? 0,
      subtext: `${stats?.departmentStats?.length || 0} active departments`,
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      lightBg: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Payroll',
      value: formatCurrency(stats?.totalPayroll),
      subtext: 'Annual employee expenditure',
      icon: RupeeIcon,
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Average Salary',
      value: formatCurrency(stats?.averageSalary),
      subtext: stats?.highestSalary ? `Top: ${formatCurrency(stats.highestSalary)}` : 'Compensation benchmark',
      icon: TrendingUp,
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
    },
    {
      title: 'Leading Department',
      value: stats?.departmentStats?.[0]?._id || 'None',
      subtext: stats?.departmentStats?.[0] ? `${stats.departmentStats[0].count} team members` : 'No departments yet',
      icon: Building2,
      gradient: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.lightBg} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Value */}
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                {card.value}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                {card.subtext}
              </p>
            </div>

            {/* Subtle bottom gradient accent */}
            <div
              className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
          </div>
        );
      })}
    </div>
  );
}
