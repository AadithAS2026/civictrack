export type ComplaintCategory = 
  | 'pothole'
  | 'garbage'
  | 'water_leakage'
  | 'streetlight'
  | 'drainage'
  | 'fallen_tree'
  | 'traffic_sign'
  | 'other';

export type ComplaintStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type Department = 
  | 'Public Works & Roads'
  | 'Solid Waste Management'
  | 'Water Supply & Sewerage'
  | 'Electricity & Street Lighting'
  | 'Parks & Urban Forestry'
  | 'Traffic & Public Safety';

export interface Comment {
  id: string;
  authorName: string;
  authorRole: 'resident' | 'authority' | 'admin';
  text: string;
  createdAt: string;
  avatar?: string;
}

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  officerName?: string;
  department?: Department;
  proofImageUrl?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  ward: string;
  imageUrl: string;
  resolvedImageUrl?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  reporterName: string;
  reporterContact?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  userHasUpvoted?: boolean;
  comments: Comment[];
  timeline: TimelineEvent[];
  assignedDepartment?: Department;
  assignedOfficer?: string;
  estimatedResolutionHours?: number;
}

export interface CivicNotification {
  id: string;
  title: string;
  message: string;
  type: 'status_change' | 'comment' | 'upvote' | 'official_update' | 'resolved';
  complaintId: string;
  createdAt: string;
  read: boolean;
}

export interface CivicStats {
  totalReported: number;
  resolvedCount: number;
  inProgressCount: number;
  underReviewCount: number;
  submittedCount: number;
  avgResolutionHours: number;
  resolutionRate: number;
  categoryCounts: Record<ComplaintCategory, number>;
  wardPerformance: {
    ward: string;
    total: number;
    resolved: number;
    rate: number;
  }[];
}
