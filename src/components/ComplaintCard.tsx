import React from 'react';
import { 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';
import { CATEGORY_METADATA, STATUS_METADATA, SEVERITY_METADATA } from '../utils/constants';
import { useCivic } from '../context/CivicContext';

interface ComplaintCardProps {
  complaint: Complaint;
  onOpenDetails: (complaint: Complaint) => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ 
  complaint, 
  onOpenDetails 
}) => {
  const { toggleUpvote, userRole, updateComplaintStatus } = useCivic();

  const catMeta = CATEGORY_METADATA[complaint.category] || CATEGORY_METADATA.other;
  const statusMeta = STATUS_METADATA[complaint.status];
  const severityMeta = SEVERITY_METADATA[complaint.severity];

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvote(complaint.id);
  };

  return (
    <div 
      onClick={() => onOpenDetails(complaint)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Media Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={complaint.imageUrl} 
          alt={complaint.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient scrim for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs ${statusMeta.badgeClass}`}>
            <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`}></span>
            {statusMeta.label}
          </span>

          {/* Severity Badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${severityMeta.badgeClass}`}>
            {severityMeta.label}
          </span>
        </div>

        {/* Bottom image overlay metadata */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs pointer-events-none">
          <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold">
            #{complaint.id}
          </span>
          <span className="bg-brand-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
            <span>{catMeta.emoji}</span>
            <span>{catMeta.label}</span>
          </span>
        </div>

        {/* Resolved Ribbon if finished */}
        {complaint.status === 'resolved' && (
          <div className="absolute top-10 -right-12 bg-emerald-600 text-white font-bold text-[10px] tracking-wider uppercase py-1 px-12 rotate-45 shadow-md">
            Verified Fixed
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1 leading-snug">
            {complaint.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {complaint.description}
          </p>

          {/* Geotagged Address & Ward */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-500">
            <div className="flex items-start gap-1.5 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{complaint.address}</span>
            </div>
            <div className="flex items-center gap-2 pl-5 text-[11px] text-slate-400">
              <span>{complaint.ward}</span>
              <span>•</span>
              <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                {complaint.latitude.toFixed(4)}°, {complaint.longitude.toFixed(4)}°
              </span>
            </div>
          </div>
        </div>

        {/* Admin Quick Action Bar (Only visible in Authority Admin mode) */}
        {userRole === 'admin' && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Triage:</span>
            </div>
            <select
              value={complaint.status}
              onChange={(e) => updateComplaintStatus(complaint.id, e.target.value as ComplaintStatus)}
              className="bg-white border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
            >
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}

        {/* Card Footer: Upvote, Comments, Timestamp */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          {/* Upvote button */}
          <button
            onClick={handleUpvoteClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              complaint.userHasUpvoted
                ? 'bg-brand-600 text-white shadow-xs scale-102'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Upvote this complaint to raise civic urgency"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${complaint.userHasUpvoted ? 'fill-white stroke-white' : ''}`} />
            <span>{complaint.upvotes}</span>
          </button>

          {/* Comments count */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{complaint.comments.length}</span>
          </div>

          {/* Timestamp */}
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(complaint.createdAt)}</span>
          </div>

          {/* View Details Arrow */}
          <div className="text-brand-600 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>

        </div>

      </div>
    </div>
  );
};
