import { ComplaintCategory, ComplaintStatus, SeverityLevel, Department } from '../types';

export const CATEGORY_METADATA: Record<ComplaintCategory, {
  label: string;
  iconName: string;
  emoji: string;
  color: string;
  bgLight: string;
  borderLight: string;
  defaultDepartment: Department;
  sampleImages: string[];
}> = {
  pothole: {
    label: 'Pothole & Road Hazard',
    iconName: 'AlertTriangle',
    emoji: '🕳️',
    color: '#ea580c',
    bgLight: 'bg-orange-50 text-orange-700 border-orange-200',
    borderLight: 'border-orange-500',
    defaultDepartment: 'Public Works & Roads',
    sampleImages: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578874691223-a49267b0995f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  garbage: {
    label: 'Garbage & Waste Overflow',
    iconName: 'Trash2',
    emoji: '🗑️',
    color: '#ca8a04',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    borderLight: 'border-amber-500',
    defaultDepartment: 'Solid Waste Management',
    sampleImages: [
      'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80'
    ]
  },
  water_leakage: {
    label: 'Water Leakage & Pipe Burst',
    iconName: 'Droplet',
    emoji: '💧',
    color: '#0284c7',
    bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
    borderLight: 'border-sky-500',
    defaultDepartment: 'Water Supply & Sewerage',
    sampleImages: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
    ]
  },
  streetlight: {
    label: 'Broken Streetlight / Electric',
    iconName: 'Lightbulb',
    emoji: '💡',
    color: '#eab308',
    bgLight: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    borderLight: 'border-yellow-500',
    defaultDepartment: 'Electricity & Street Lighting',
    sampleImages: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    ]
  },
  drainage: {
    label: 'Drainage & Sewage Blockage',
    iconName: 'Waves',
    emoji: '🌊',
    color: '#0891b2',
    bgLight: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    borderLight: 'border-cyan-500',
    defaultDepartment: 'Water Supply & Sewerage',
    sampleImages: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80'
    ]
  },
  fallen_tree: {
    label: 'Fallen Tree / Park Hazard',
    iconName: 'Trees',
    emoji: '🌳',
    color: '#16a34a',
    bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderLight: 'border-emerald-500',
    defaultDepartment: 'Parks & Urban Forestry',
    sampleImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  traffic_sign: {
    label: 'Traffic Sign & Public Safety',
    iconName: 'ShieldAlert',
    emoji: '🛑',
    color: '#dc2626',
    bgLight: 'bg-rose-50 text-rose-800 border-rose-200',
    borderLight: 'border-rose-500',
    defaultDepartment: 'Traffic & Public Safety',
    sampleImages: [
      'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80'
    ]
  },
  other: {
    label: 'Other Civic Issue',
    iconName: 'HelpCircle',
    emoji: '📌',
    color: '#64748b',
    bgLight: 'bg-slate-50 text-slate-700 border-slate-200',
    borderLight: 'border-slate-500',
    defaultDepartment: 'Public Works & Roads',
    sampleImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ]
  }
};

export const STATUS_METADATA: Record<ComplaintStatus, {
  label: string;
  badgeClass: string;
  dotColor: string;
  stepIndex: number;
  description: string;
}> = {
  submitted: {
    label: 'Submitted',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-500',
    stepIndex: 1,
    description: 'Complaint recorded in public ledger. Awaiting initial officer triage.'
  },
  under_review: {
    label: 'Under Review',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
    stepIndex: 2,
    description: 'Assigned to jurisdictional ward officer. Site inspection pending.'
  },
  in_progress: {
    label: 'In Progress',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-600',
    stepIndex: 3,
    description: 'Field crew and equipment dispatched. Active repairs underway.'
  },
  resolved: {
    label: 'Resolved',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-600',
    stepIndex: 4,
    description: 'Issue successfully fixed and verified with resolution proof.'
  }
};

export const SEVERITY_METADATA: Record<SeverityLevel, {
  label: string;
  badgeClass: string;
  iconColor: string;
}> = {
  low: {
    label: 'Low Urgency',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    iconColor: 'text-slate-400'
  },
  medium: {
    label: 'Medium Priority',
    badgeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    iconColor: 'text-yellow-500'
  },
  high: {
    label: 'High Priority',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    iconColor: 'text-orange-500'
  },
  critical: {
    label: 'Emergency / Critical',
    badgeClass: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
    iconColor: 'text-red-600'
  }
};

export const WARDS = [
  'All Wards',
  'Ward 12 - Downtown Metro',
  'Ward 15 - North Park & Greenfield',
  'Ward 18 - Central Market & Commercial',
  'Ward 22 - West Riverdale & Harbor',
  'Ward 27 - South University Enclave',
  'Ward 34 - East Industrial & Tech Park'
];

export const DEPARTMENTS: Department[] = [
  'Public Works & Roads',
  'Solid Waste Management',
  'Water Supply & Sewerage',
  'Electricity & Street Lighting',
  'Parks & Urban Forestry',
  'Traffic & Public Safety'
];

// Sample default coordinates (Metro Downtown center)
export const DEFAULT_MAP_CENTER: [number, number] = [40.7128, -74.0060];
