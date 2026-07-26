export const NOTIFICATION_CATEGORIES = {
  project: {
    key: 'project',
    label: 'Project',
    badge: 'bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] text-[#1D4ED8] ring-[#2563EB]/15',
    iconBg: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#2563EB]',
  },
  task: {
    key: 'task',
    label: 'Task',
    badge: 'bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] text-[#047857] ring-[#10B981]/20',
    iconBg: 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669]',
  },
  meeting: {
    key: 'meeting',
    label: 'Meeting',
    badge: 'bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] text-[#6D28D9] ring-[#8B5CF6]/20',
    iconBg: 'bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] text-[#7C3AED]',
  },
  files: {
    key: 'files',
    label: 'Files',
    badge: 'bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] text-[#B45309] ring-[#F59E0B]/25',
    iconBg: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#D97706]',
  },
  alert: {
    key: 'alert',
    label: 'Alert',
    badge: 'bg-gradient-to-r from-[#FEF2F2] to-[#FEE2E2] text-[#B91C1C] ring-[#EF4444]/20',
    iconBg: 'bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] text-[#DC2626]',
  },
  system: {
    key: 'system',
    label: 'System',
    badge: 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 ring-slate-200/80',
    iconBg: 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500',
  },
  mention: {
    key: 'mention',
    label: 'Mention',
    badge: 'bg-gradient-to-r from-[#EFF6FF] to-[#E0E7FF] text-[#3730A3] ring-[#6366F1]/20',
    iconBg: 'bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-[#4F46E5]',
  },
};

export const AVATAR_TONES = {
  AL: 'from-[#2563EB] to-[#1D4ED8]',
  SK: 'from-[#8B5CF6] to-[#6D28D9]',
  AH: 'from-[#0EA5E9] to-[#2563EB]',
  MR: 'from-[#10B981] to-[#059669]',
  LN: 'from-[#F59E0B] to-[#D97706]',
  SY: 'from-[#64748B] to-[#475569]',
};

export const NOTIFICATION_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'projects', label: 'Projects' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'tasks', label: 'Tasks' },
];

/** Static dummy notifications for the panel */
export const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Ali invited you to Project Alpha',
    description: 'You have been added as a collaborator on Project Alpha.',
    time: '2m ago',
    unread: true,
    category: 'project',
    avatar: 'AL',
    mention: false,
  },
  {
    id: '2',
    title: 'Project CRM System has been updated',
    description: 'Sara pushed new milestones and updated the project status.',
    time: '18m ago',
    unread: true,
    category: 'project',
    avatar: 'SK',
    mention: false,
  },
  {
    id: '3',
    title: 'Task Dashboard UI has been completed',
    description: 'Ahsan marked Dashboard UI as Done in Sprint 12.',
    time: '45m ago',
    unread: true,
    category: 'task',
    avatar: 'AH',
    mention: false,
  },
  {
    id: '4',
    title: 'Meeting scheduled for tomorrow at 10:00 AM',
    description: 'Product Sync was added to your calendar.',
    time: '1h ago',
    unread: true,
    category: 'meeting',
    avatar: 'MR',
    mention: false,
  },
  {
    id: '5',
    title: 'New file uploaded to HR Portal',
    description: 'Employee handbook.pdf was uploaded to Files.',
    time: '2h ago',
    unread: false,
    category: 'files',
    avatar: 'LN',
    mention: false,
  },
  {
    id: '6',
    title: 'You were mentioned in Tasks',
    description: '@Ahsan please review the API Integration checklist.',
    time: '3h ago',
    unread: true,
    category: 'mention',
    avatar: 'SK',
    mention: true,
  },
  {
    id: '7',
    title: 'Storage usage is at 64%',
    description: 'Consider upgrading if you plan large media uploads.',
    time: '5h ago',
    unread: false,
    category: 'alert',
    avatar: 'SY',
    mention: false,
  },
  {
    id: '8',
    title: 'Weekly digest is ready',
    description: 'Your workspace summary for this week is available.',
    time: 'Yesterday',
    unread: false,
    category: 'system',
    avatar: 'SY',
    mention: false,
  },
];

export const filterNotifications = (items, { tab = 'all', query = '' } = {}) => {
  const q = query.trim().toLowerCase();
  return items.filter((n) => {
    const matchesTab =
      tab === 'all' ||
      (tab === 'unread' && n.unread) ||
      (tab === 'mentions' && (n.mention || n.category === 'mention')) ||
      (tab === 'projects' && n.category === 'project') ||
      (tab === 'meetings' && n.category === 'meeting') ||
      (tab === 'tasks' && n.category === 'task');

    const matchesQuery =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q);

    return matchesTab && matchesQuery;
  });
};
