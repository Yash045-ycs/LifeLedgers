// ─── Mock Obligations ─────────────────────────────────────────────
export const OBLIGATIONS = [
  { id: 1,  title: 'Electricity Bill',        category: 'Utility',      amount: 142,   dueDate: '2025-02-18', recurrence: 'Monthly',  priority: 'High',     status: 'Overdue'   },
  { id: 2,  title: 'Car Insurance Renewal',   category: 'Insurance',    amount: 890,   dueDate: '2025-02-21', recurrence: 'Annual',   priority: 'High',     status: 'Due Today' },
  { id: 3,  title: 'Netflix Subscription',    category: 'Subscription', amount: 15.99, dueDate: '2025-02-28', recurrence: 'Monthly',  priority: 'Low',      status: 'Upcoming'  },
  { id: 4,  title: 'Rent Payment',            category: 'Housing',      amount: 1800,  dueDate: '2025-03-01', recurrence: 'Monthly',  priority: 'Critical', status: 'Upcoming'  },
  { id: 5,  title: 'Gym Membership',          category: 'Health',       amount: 49,    dueDate: '2025-03-05', recurrence: 'Monthly',  priority: 'Medium',   status: 'Upcoming'  },
  { id: 6,  title: 'Water Bill',              category: 'Utility',      amount: 68,    dueDate: '2025-02-10', recurrence: 'Monthly',  priority: 'Medium',   status: 'Completed' },
  { id: 7,  title: 'Internet Plan',           category: 'Utility',      amount: 79.99, dueDate: '2025-03-10', recurrence: 'Monthly',  priority: 'High',     status: 'Upcoming'  },
  { id: 8,  title: 'Health Insurance',        category: 'Insurance',    amount: 320,   dueDate: '2025-02-15', recurrence: 'Monthly',  priority: 'Critical', status: 'Overdue'   },
  { id: 9,  title: 'Property Tax',            category: 'Housing',      amount: 1200,  dueDate: '2025-03-31', recurrence: 'Quarterly',priority: 'High',     status: 'Upcoming'  },
  { id: 10, title: 'Dentist Appointment',     category: 'Health',       amount: 120,   dueDate: '2025-03-08', recurrence: 'One-time', priority: 'Medium',   status: 'Upcoming'  },
];

// ─── Mock Documents ───────────────────────────────────────────────
export const DOCUMENTS = [
  { id: 1, name: 'Passport',                expiry: '2025-08-14', daysLeft: 174 },
  { id: 2, name: "Driver's License",        expiry: '2025-03-30', daysLeft: 37  },
  { id: 3, name: 'Vehicle Registration',    expiry: '2025-02-28', daysLeft: 7   },
  { id: 4, name: 'Home Insurance Policy',   expiry: '2026-01-01', daysLeft: 314 },
  { id: 5, name: 'Work Visa',               expiry: '2025-04-15', daysLeft: 53  },
  { id: 6, name: 'Health Insurance Card',   expiry: '2025-12-31', daysLeft: 313 },
];

// ─── Mock Subscriptions ───────────────────────────────────────────
export const SUBSCRIPTIONS = [
  { id: 1, name: 'Netflix',               cost: 15.99, renewal: 'Feb 28, 2025', status: 'Active',    icon: '▶', color: '#E50914' },
  { id: 2, name: 'Spotify',               cost: 9.99,  renewal: 'Mar 3, 2025',  status: 'Active',    icon: '♪', color: '#1DB954' },
  { id: 3, name: 'Adobe Creative Cloud',  cost: 54.99, renewal: 'Mar 15, 2025', status: 'Active',    icon: '✦', color: '#FF0000' },
  { id: 4, name: 'GitHub Pro',            cost: 4.00,  renewal: 'Mar 20, 2025', status: 'Active',    icon: '◈', color: '#24292F' },
  { id: 5, name: 'Notion',                cost: 8.00,  renewal: 'Apr 1, 2025',  status: 'Cancelled', icon: '◻', color: '#000000' },
  { id: 6, name: '1Password',             cost: 2.99,  renewal: 'Apr 5, 2025',  status: 'Active',    icon: '⬡', color: '#0093D9' },
];

// ─── Analytics Chart Data ─────────────────────────────────────────
export const MONTHLY_OBLIGATIONS = [
  { month: 'Sep', count: 12 },
  { month: 'Oct', count: 15 },
  { month: 'Nov', count: 10 },
  { month: 'Dec', count: 18 },
  { month: 'Jan', count: 14 },
  { month: 'Feb', count: 18 },
];

export const MONTHLY_COST = [
  { month: 'Sep', cost: 1980 },
  { month: 'Oct', cost: 2100 },
  { month: 'Nov', cost: 2050 },
  { month: 'Dec', cost: 2400 },
  { month: 'Jan', cost: 2200 },
  { month: 'Feb', cost: 2437 },
];

export const CATEGORY_ICONS = {
  Utility:      '⚡',
  Insurance:    '🛡',
  Housing:      '🏠',
  Health:       '❤',
  Subscription: '↻',
  Other:        '📋',
};