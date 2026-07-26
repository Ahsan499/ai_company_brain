/**
 * Static enterprise search index for the Command Palette.
 * Fuse.js is prepared here for future wiring — filtering stays client-side / static for now.
 */
import Fuse from 'fuse.js';
import {
  FolderKanban,
  UserRound,
  Building2,
  CheckSquare,
  Users,
  CalendarDays,
  FileText,
  BarChart3,
  ShieldCheck,
  Terminal,
  LayoutDashboard,
  UserPlus,
  Upload,
  ClipboardList,
} from 'lucide-react';

export const QUICK_ACTIONS = [
  {
    id: 'qa-project',
    title: 'Create Project',
    description: 'Start a new workspace project',
    icon: FolderKanban,
    tone: 'from-[#EFF6FF] to-[#BFDBFE] text-[#2563EB]',
  },
  {
    id: 'qa-task',
    title: 'Create Task',
    description: 'Add a task to your board',
    icon: CheckSquare,
    tone: 'from-[#ECFDF5] to-[#A7F3D0] text-[#059669]',
  },
  {
    id: 'qa-invite',
    title: 'Invite User',
    description: 'Add a teammate to the org',
    icon: UserPlus,
    tone: 'from-[#F5F3FF] to-[#DDD6FE] text-[#7C3AED]',
  },
  {
    id: 'qa-meeting',
    title: 'Schedule Meeting',
    description: 'Book time on the calendar',
    icon: CalendarDays,
    tone: 'from-[#FFFBEB] to-[#FDE68A] text-[#D97706]',
  },
  {
    id: 'qa-upload',
    title: 'Upload File',
    description: 'Add documents to storage',
    icon: Upload,
    tone: 'from-[#EFF6FF] to-[#DBEAFE] text-[#1D4ED8]',
  },
  {
    id: 'qa-reports',
    title: 'View Reports',
    description: 'Open analytics & insights',
    icon: BarChart3,
    tone: 'from-[#ECFEFF] to-[#A5F3FC] text-[#0891B2]',
  },
  {
    id: 'qa-dashboard',
    title: 'Go to Dashboard',
    description: 'Return to home overview',
    icon: LayoutDashboard,
    tone: 'from-[#F8FAFC] to-[#E2E8F0] text-[#475569]',
  },
];

export const RECENT_SEARCHES = [
  { id: 'rs-1', title: 'CRM Dashboard', category: 'Projects' },
  { id: 'rs-2', title: 'Authentication', category: 'Modules' },
  { id: 'rs-3', title: 'HR Portal', category: 'Projects' },
  { id: 'rs-4', title: 'John Smith', category: 'Users' },
  { id: 'rs-5', title: 'Sprint Planning', category: 'Meetings' },
];

export const RECENTLY_OPENED = [
  { id: 'ro-1', title: 'CRM Dashboard', category: 'Projects' },
  { id: 'ro-2', title: 'Project Alpha', category: 'Projects' },
  { id: 'ro-3', title: 'Authentication Module', category: 'Modules' },
  { id: 'ro-4', title: 'Weekly Reports', category: 'Reports' },
];

export const COMMANDS = [
  { id: 'cmd-p', title: 'New Project', shortcut: '⌘ P', keys: ['Meta', 'p'] },
  { id: 'cmd-t', title: 'New Task', shortcut: '⌘ T', keys: ['Meta', 't'] },
  { id: 'cmd-m', title: 'New Meeting', shortcut: '⌘ M', keys: ['Meta', 'm'] },
  { id: 'cmd-u', title: 'Upload File', shortcut: '⌘ U', keys: ['Meta', 'u'] },
  { id: 'cmd-r', title: 'Reports', shortcut: '⌘ R', keys: ['Meta', 'r'] },
  { id: 'cmd-d', title: 'Dashboard', shortcut: '⌘ D', keys: ['Meta', 'd'] },
];

/** Category metadata for headings & badges */
export const CATEGORY_META = {
  Projects: { icon: FolderKanban, tone: 'bg-blue-50 text-primary ring-primary/10' },
  Users: { icon: UserRound, tone: 'bg-violet-50 text-violet-600 ring-violet-500/10' },
  Departments: { icon: Building2, tone: 'bg-slate-100 text-slate-600 ring-slate-400/15' },
  Tasks: { icon: CheckSquare, tone: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10' },
  Teams: { icon: Users, tone: 'bg-indigo-50 text-indigo-600 ring-indigo-500/10' },
  Meetings: { icon: CalendarDays, tone: 'bg-amber-50 text-amber-700 ring-amber-500/10' },
  Files: { icon: FileText, tone: 'bg-sky-50 text-sky-600 ring-sky-500/10' },
  Reports: { icon: BarChart3, tone: 'bg-cyan-50 text-cyan-700 ring-cyan-500/10' },
  'Audit Logs': { icon: ShieldCheck, tone: 'bg-rose-50 text-rose-600 ring-rose-500/10' },
  Commands: { icon: Terminal, tone: 'bg-slate-100 text-slate-700 ring-slate-400/15' },
  Modules: { icon: ClipboardList, tone: 'bg-blue-50 text-primary ring-primary/10' },
};

export const SEARCH_RESULTS = [
  {
    id: 'sr-1',
    title: 'CRM Dashboard',
    description: 'Customer pipeline, deals, and account health overview',
    category: 'Projects',
    shortcut: '↵',
  },
  {
    id: 'sr-2',
    title: 'Ahsan Taqweem',
    description: 'Super Administrator · ahsan@example.com',
    category: 'Users',
    shortcut: '↵',
  },
  {
    id: 'sr-3',
    title: 'Dashboard UI Task',
    description: 'Polish layout, charts, and responsive spacing',
    category: 'Tasks',
    shortcut: '↵',
  },
  {
    id: 'sr-4',
    title: 'Sprint Planning Meeting',
    description: 'Thursday 10:00 AM · Conference Room B',
    category: 'Meetings',
    shortcut: '↵',
  },
  {
    id: 'sr-5',
    title: 'Project Documentation',
    description: 'Architecture notes, API specs, and onboarding guide',
    category: 'Files',
    shortcut: '↵',
  },
  {
    id: 'sr-6',
    title: 'Monthly Reports',
    description: 'Revenue, utilization, and delivery performance',
    category: 'Reports',
    shortcut: '↵',
  },
  {
    id: 'sr-7',
    title: 'Engineering Department',
    description: '48 members · Product & Platform teams',
    category: 'Departments',
    shortcut: '↵',
  },
  {
    id: 'sr-8',
    title: 'Platform Squad',
    description: 'Core infrastructure and developer experience',
    category: 'Teams',
    shortcut: '↵',
  },
  {
    id: 'sr-9',
    title: 'Login Audit Trail',
    description: 'Security events from the last 30 days',
    category: 'Audit Logs',
    shortcut: '↵',
  },
  {
    id: 'sr-10',
    title: 'HR Portal',
    description: 'People ops, leave, and employee directory',
    category: 'Projects',
    shortcut: '↵',
  },
  {
    id: 'sr-11',
    title: 'Sara Khan',
    description: 'Product Manager · sara@example.com',
    category: 'Users',
    shortcut: '↵',
  },
  {
    id: 'sr-12',
    title: 'Authentication Module',
    description: 'SSO, MFA, and session management',
    category: 'Projects',
    shortcut: '↵',
  },
];

export const CATEGORY_ORDER = [
  'Projects',
  'Users',
  'Departments',
  'Tasks',
  'Teams',
  'Meetings',
  'Files',
  'Reports',
  'Audit Logs',
  'Commands',
];

/** Fuse index — ready for real fuzzy search later */
export const searchFuse = new Fuse(SEARCH_RESULTS, {
  keys: [
    { name: 'title', weight: 0.55 },
    { name: 'description', weight: 0.3 },
    { name: 'category', weight: 0.15 },
  ],
  threshold: 0.38,
  includeScore: true,
});

/**
 * Lightweight filter for the UI. Uses Fuse when query is present;
 * returns the full static catalog when empty (browse mode).
 */
export function filterSearchResults(query) {
  const q = query.trim();
  if (!q) return SEARCH_RESULTS;

  // Structure prepared with Fuse — currently used for static client filtering only
  const hits = searchFuse.search(q);
  return hits.map((h) => h.item);
}

export function groupResultsByCategory(results) {
  const groups = {};
  CATEGORY_ORDER.forEach((c) => {
    groups[c] = [];
  });
  results.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });
  return CATEGORY_ORDER.filter((c) => groups[c]?.length).map((c) => ({
    category: c,
    items: groups[c],
  }));
}
