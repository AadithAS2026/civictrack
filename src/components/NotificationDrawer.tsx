import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { CivicNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    complaints, 
    setSelectedComplaint 
  } = useCivic();

  if (!isOpen) return null;

  const handleNotificationClick = (notif: CivicNotification) => {
    markNotificationAsRead(notif.id);
    const target = complaints.find(c => c.id === notif.complaintId);
    if (target) {
      setSelectedComplaint(target);
      onClose();
    }
  };

  const getNotifIcon = (type: CivicNotification['type']) => {
    switch (type) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'upvote':
        return <ThumbsUp className="w-4 h-4 text-amber-500" />;
      case 'status_change':
      default:
        return <AlertCircle className="w-4 h-4 text-brand-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Bell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Civic Notifications
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-12 h-12 stroke-[1.2] mb-3 text-slate-300" />
              <p className="font-bold text-sm text-slate-700">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You'll receive alerts when your reported issues change status or get comments.
              </p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  !notif.read
                    ? 'bg-brand-50/60 border-brand-200/80 hover:bg-brand-50'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getNotifIcon(notif.type)}
                    <span className="font-bold text-xs text-slate-900">
                      {notif.title}
                    </span>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pl-6 pt-1 text-[10px] text-slate-400">
                  <span className="font-mono font-semibold text-slate-500">
                    #{notif.complaintId}
                  </span>
                  <span>
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Connected to Municipal Live Dispatch System
        </div>

      </div>
    </div>
  );
};
