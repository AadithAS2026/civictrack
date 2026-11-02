import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Complaint, 
  CivicNotification, 
  ComplaintStatus, 
  ComplaintCategory, 
  Department, 
  CivicStats, 
  TimelineEvent, 
  Comment 
} from '../types';
import { INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { WARDS } from '../utils/constants';

interface CivicContextType {
  complaints: Complaint[];
  userRole: 'resident' | 'admin';
  setUserRole: (role: 'resident' | 'admin') => void;
  activeTab: 'map' | 'issues' | 'my-reports' | 'stats';
  setActiveTab: (tab: 'map' | 'issues' | 'my-reports' | 'stats') => void;
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  notifications: CivicNotification[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterWard: string;
  setFilterWard: (ward: string) => void;
  sortBy: 'newest' | 'upvotes' | 'comments' | 'severity';
  setSortBy: (sort: 'newest' | 'upvotes' | 'comments' | 'severity') => void;
  toggleUpvote: (complaintId: string) => void;
  addComment: (complaintId: string, text: string, authorName?: string) => void;
  submitComplaint: (data: Partial<Complaint>) => Complaint;
  updateComplaintStatus: (
    complaintId: string, 
    newStatus: ComplaintStatus, 
    officerNotes?: string, 
    proofImageUrl?: string, 
    department?: Department,
    officerName?: string
  ) => void;
  assignDepartment: (complaintId: string, department: Department, officerName?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
  stats: CivicStats;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;
  clearToast: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

const STORAGE_KEY_COMPLAINTS = 'civictrack_complaints_v1';
const STORAGE_KEY_NOTIFS = 'civictrack_notifications_v1';
const STORAGE_KEY_ROLE = 'civictrack_role_v1';

export const CivicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial complaints from localStorage or fallback to INITIAL_COMPLAINTS
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load complaints from localStorage', e);
    }
    return INITIAL_COMPLAINTS;
  });

  // Load notifications
  const [notifications, setNotifications] = useState<CivicNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // User role
  const [userRole, setUserRoleState] = useState<'resident' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      if (saved === 'admin' || saved === 'resident') return saved;
    } catch (e) {
      // fallback
    }
    return 'resident';
  });

  const setUserRole = (role: 'resident' | 'admin') => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEY_ROLE, role);
    showToast(`Switched to ${role === 'admin' ? 'Municipal Authority (Admin)' : 'Resident'} Mode`, 'info');
  };

  // UI States
  const [activeTab, setActiveTab] = useState<'map' | 'issues' | 'my-reports' | 'stats'>('issues');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWard, setFilterWard] = useState<string>('All Wards');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'comments' | 'severity'>('newest');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('Error saving complaints', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  }, [notifications]);

  // Keep selectedComplaint fresh when complaints list updates
  useEffect(() => {
    if (selectedComplaint) {
      const fresh = complaints.find(c => c.id === selectedComplaint.id);
      if (fresh) setSelectedComplaint(fresh);
    }
  }, [complaints]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const clearToast = () => setToastMessage(null);

  // Upvote handling
  const toggleUpvote = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const currentlyUpvoted = !!c.userHasUpvoted;
        const newUpvotes = currentlyUpvoted ? Math.max(0, c.upvotes - 1) : c.upvotes + 1;
        
        if (!currentlyUpvoted) {
          showToast(`Upvoted! "${c.title.substring(0, 30)}..." prioritized in civic queue.`, 'success');
        }

        return {
          ...c,
          upvotes: newUpvotes,
          userHasUpvoted: !currentlyUpvoted
        };
      }
      return c;
    }));
  };

  // Add comment
  const addComment = (complaintId: string, text: string, authorName?: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: authorName || (userRole === 'admin' ? 'Municipal Supervisor' : 'Resident Contributor'),
      authorRole: userRole === 'admin' ? 'authority' : 'resident',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          comments: [...c.comments, newComment],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    // Add notification
    const newNotif: CivicNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Comment on Report',
      message: `${newComment.authorName}: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`,
      type: 'comment',
      complaintId,
      createdAt: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast('Your comment was published to the public record.', 'success');
  };

  // Submit Complaint
  const submitComplaint = (data: Partial<Complaint>): Complaint => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `CT-2026-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const initialTimeline: TimelineEvent = {
      id: `t-${Date.now()}`,
      status: 'submitted',
      title: 'Complaint Registered',
      description: `Report filed with GPS coordinates (${data.latitude?.toFixed(4)}, ${data.longitude?.toFixed(4)}).`,
      timestamp: nowIso
    };

    const newComplaint: Complaint = {
      id: newId,
      title: data.title || 'Civic Issue Reported',
      description: data.description || '',
      category: data.category || 'other',
      status: 'submitted',
      severity: data.severity || 'medium',
      latitude: data.latitude || 40.7128,
      longitude: data.longitude || -74.0060,
      address: data.address || 'Reported Location',
      landmark: data.landmark || '',
      ward: data.ward || WARDS[1],
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
      reporterName: data.isAnonymous ? 'Anonymous Resident' : (data.reporterName || 'Concerned Resident'),
      reporterContact: data.reporterContact || '',
      isAnonymous: !!data.isAnonymous,
      createdAt: nowIso,
      updatedAt: nowIso,
      upvotes: 1,
      userHasUpvoted: true,
      comments: [],
      timeline: [initialTimeline],
      assignedDepartment: data.assignedDepartment
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Push notification
    const newNotif: CivicNotification = {
      id: `notif-${Date.now()}`,
      title: 'Complaint Logged Successfully',
      message: `Your report #${newId} is queued for municipal inspection.`,
      type: 'status_change',
      complaintId: newId,
      createdAt: nowIso,
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Complaint #${newId} submitted with GPS geotag!`, 'success');
    return newComplaint;
  };

  // Admin status update
  const updateComplaintStatus = (
    complaintId: string, 
    newStatus: ComplaintStatus, 
    officerNotes?: string, 
    proofImageUrl?: string, 
    department?: Department,
    officerName?: string
  ) => {
    const nowIso = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const titleMap: Record<ComplaintStatus, string> = {
          submitted: 'Reopened / Triage Review',
          under_review: 'Under Officer Review',
          in_progress: 'Field Work Dispatched & In Progress',
          resolved: 'Marked as Resolved & Verified'
        };

        const newTimelineEvent: TimelineEvent = {
          id: `t-${Date.now()}`,
          status: newStatus,
          title: titleMap[newStatus],
          description: officerNotes || `Status advanced to ${newStatus.replace('_', ' ')}.`,
          timestamp: nowIso,
          officerName: officerName || 'Municipal Operations Officer',
          department: department || c.assignedDepartment,
          proofImageUrl: proofImageUrl || (newStatus === 'resolved' ? c.resolvedImageUrl : undefined)
        };

        return {
          ...c,
          status: newStatus,
          updatedAt: nowIso,
          resolutionNotes: officerNotes ? officerNotes : c.resolutionNotes,
          resolvedImageUrl: proofImageUrl ? proofImageUrl : c.resolvedImageUrl,
          resolvedAt: newStatus === 'resolved' ? nowIso : (c.status === 'resolved' ? c.resolvedAt : undefined),
          assignedDepartment: department || c.assignedDepartment,
          assignedOfficer: officerName || c.assignedOfficer,
          timeline: [...c.timeline, newTimelineEvent]
        };
      }
      return c;
    }));

    // Notification
    const notifType = newStatus === 'resolved' ? 'resolved' : 'status_change';
    const newNotif: CivicNotification = {
      id: `notif-${Date.now()}`,
      title: `Status Updated: #${complaintId} is now ${newStatus.replace('_', ' ').toUpperCase()}`,
      message: officerNotes || `Official status updated by Municipal Authority.`,
      type: notifType,
      complaintId,
      createdAt: nowIso,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Status of #${complaintId} changed to ${newStatus.replace('_', ' ')}`, 'success');
  };

  // Assign department
  const assignDepartment = (complaintId: string, department: Department, officerName?: string) => {
    const nowIso = new Date().toISOString();
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const event: TimelineEvent = {
          id: `t-${Date.now()}`,
          status: c.status,
          title: 'Department Assigned',
          description: `Assigned to ${department}${officerName ? ` (Officer: ${officerName})` : ''}.`,
          timestamp: nowIso,
          officerName: officerName || 'Admin Desk',
          department
        };
        return {
          ...c,
          assignedDepartment: department,
          assignedOfficer: officerName || c.assignedOfficer,
          updatedAt: nowIso,
          timeline: [...c.timeline, event]
        };
      }
      return c;
    }));
    showToast(`Assigned to ${department}`, 'info');
  };

  // Notifications read/unread
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Reset demo data
  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Restored default civic data successfully', 'info');
  };

  // Computed public statistics
  const stats: CivicStats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const underReview = complaints.filter(c => c.status === 'under_review').length;
    const submitted = complaints.filter(c => c.status === 'submitted').length;

    // Calculate category breakdown
    const categoryCounts: Record<ComplaintCategory, number> = {
      pothole: 0,
      garbage: 0,
      water_leakage: 0,
      streetlight: 0,
      drainage: 0,
      fallen_tree: 0,
      traffic_sign: 0,
      other: 0
    };

    complaints.forEach(c => {
      if (categoryCounts[c.category] !== undefined) {
        categoryCounts[c.category]++;
      } else {
        categoryCounts.other++;
      }
    });

    // Ward performance
    const wardMap: Record<string, { total: number; resolved: number }> = {};
    WARDS.filter(w => w !== 'All Wards').forEach(w => {
      wardMap[w] = { total: 0, resolved: 0 };
    });

    complaints.forEach(c => {
      if (!wardMap[c.ward]) {
        wardMap[c.ward] = { total: 0, resolved: 0 };
      }
      wardMap[c.ward].total++;
      if (c.status === 'resolved') {
        wardMap[c.ward].resolved++;
      }
    });

    const wardPerformance = Object.entries(wardMap).map(([ward, data]) => ({
      ward,
      total: data.total,
      resolved: data.resolved,
      rate: data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 100
    })).sort((a, b) => b.total - a.total);

    return {
      totalReported: total,
      resolvedCount: resolved,
      inProgressCount: inProgress,
      underReviewCount: underReview,
      submittedCount: submitted,
      avgResolutionHours: 32, // realistic municipal benchmark
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      categoryCounts,
      wardPerformance
    };
  }, [complaints]);

  return (
    <CivicContext.Provider
      value={{
        complaints,
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        selectedComplaint,
        setSelectedComplaint,
        isReportModalOpen,
        setIsReportModalOpen,
        notifications,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        filterWard,
        setFilterWard,
        sortBy,
        setSortBy,
        toggleUpvote,
        addComment,
        submitComplaint,
        updateComplaintStatus,
        assignDepartment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData,
        stats,
        toastMessage,
        clearToast,
        showToast
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = (): CivicContextType => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
