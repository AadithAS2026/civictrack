import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  Share2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ExternalLink, 
  User, 
  Send, 
  Camera, 
  Layers, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Complaint, ComplaintStatus, Department } from '../types';
import { CATEGORY_METADATA, STATUS_METADATA, SEVERITY_METADATA, DEPARTMENTS } from '../utils/constants';
import { useCivic } from '../context/CivicContext';

interface ComplaintDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ 
  complaint, 
  onClose 
}) => {
  const { 
    toggleUpvote, 
    addComment, 
    userRole, 
    updateComplaintStatus,
    assignDepartment,
    showToast 
  } = useCivic();

  // Photo view toggle for resolved issues
  const [photoViewMode, setPhotoViewMode] = useState<'reported' | 'resolved'>('reported');

  // Comment input state
  const [newCommentText, setNewCommentText] = useState('');
  const [commenterName, setCommenterName] = useState(userRole === 'admin' ? 'Officer K. Thorne' : '');

  // Admin update state
  const [adminStatus, setAdminStatus] = useState<ComplaintStatus>(complaint.status);
  const [adminDepartment, setAdminDepartment] = useState<Department>(complaint.assignedDepartment || 'Public Works & Roads');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminProofUrl, setAdminProofUrl] = useState(complaint.resolvedImageUrl || '');

  const catMeta = CATEGORY_METADATA[complaint.category] || CATEGORY_METADATA.other;
  const statusMeta = STATUS_METADATA[complaint.status];
  const severityMeta = SEVERITY_METADATA[complaint.severity];

  // Leaflet map reference for location preview
  const detailMapContainerRef = useRef<HTMLDivElement>(null);
  const detailMapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!detailMapContainerRef.current) return;
    if (detailMapInstanceRef.current) {
      detailMapInstanceRef.current.remove();
      detailMapInstanceRef.current = null;
    }

    const map = L.map(detailMapContainerRef.current, {
      center: [complaint.latitude, complaint.longitude],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'detail-pin',
      html: `
        <div class="civic-marker-pin" style="background-color: ${catMeta.color};">
          <span class="civic-marker-icon">${catMeta.emoji}</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    L.marker([complaint.latitude, complaint.longitude], { icon: pinIcon }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    detailMapInstanceRef.current = map;

    return () => {
      map.remove();
      detailMapInstanceRef.current = null;
    };
  }, [complaint.latitude, complaint.longitude, catMeta.color, catMeta.emoji]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(complaint.id, newCommentText, commenterName.trim() || undefined);
    setNewCommentText('');
  };

  const handleAdminUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaintStatus(
      complaint.id,
      adminStatus,
      adminNotes.trim() || `Status updated to ${adminStatus.replace('_', ' ')}.`,
      adminProofUrl.trim() || undefined,
      adminDepartment,
      userRole === 'admin' ? 'Municipal Operations Desk' : undefined
    );

    if (adminStatus === 'resolved') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('🎉 Issue marked as Resolved! Confetti celebration triggered.', 'success');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Complaint public link copied to clipboard!', 'info');
    }
  };

  // Status Stepper Steps
  const steps: { key: ComplaintStatus; label: string; desc: string }[] = [
    { key: 'submitted', label: '1. Submitted', desc: 'Complaint registered' },
    { key: 'under_review', label: '2. Under Review', desc: 'Officer site triage' },
    { key: 'in_progress', label: '3. In Progress', desc: 'Active field repair' },
    { key: 'resolved', label: '4. Resolved', desc: 'Fixed & verified proof' }
  ];

  const currentStepIndex = STATUS_METADATA[complaint.status].stepIndex;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200/80 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span className="font-mono text-xs sm:text-sm font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
              #{complaint.id}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusMeta.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`}></span>
              {statusMeta.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${severityMeta.badgeClass}`}>
              {severityMeta.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Share issue link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 sm:px-8 space-y-6">

          {/* Photo Section with Resolution Comparison */}
          <div className="space-y-3">
            {complaint.status === 'resolved' && complaint.resolvedImageUrl ? (
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-sm">
                <button
                  type="button"
                  onClick={() => setPhotoViewMode('reported')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    photoViewMode === 'reported' 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📷 Before (Hazard)
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoViewMode('resolved')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    photoViewMode === 'resolved' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>After (Fixed Proof)</span>
                </button>
              </div>
            ) : null}

            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <img 
                src={photoViewMode === 'resolved' && complaint.resolvedImageUrl ? complaint.resolvedImageUrl : complaint.imageUrl} 
                alt={complaint.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                {photoViewMode === 'resolved' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Resolution Verification Photo</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Resident Geotagged Evidence Photo</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Issue Title, Category & Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <span className="text-xl">{catMeta.emoji}</span>
              <span className="font-bold text-slate-800">{catMeta.label}</span>
              <span>•</span>
              <span className="text-slate-500">Reported by: <strong>{complaint.reporterName}</strong></span>
              {complaint.isAnonymous && (
                <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 font-semibold">
                  Anonymous
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {complaint.title}
            </h2>

            <p className="text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              {complaint.description}
            </p>
          </div>

          {/* Location Details & Map Coordinates Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Location & GPS Geotag Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">{complaint.address}</p>
                {complaint.landmark && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>Landmark:</strong> {complaint.landmark}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Jurisdiction:</strong> {complaint.ward}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {complaint.latitude.toFixed(6)}°, {complaint.longitude.toFixed(6)}°
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
                  >
                    <span>View on External Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Pin Preview */}
            <div className="h-40 w-full rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
              <div ref={detailMapContainerRef} className="w-full h-full z-10" />
            </div>
          </div>

          {/* Visual Status Progress Stepper */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Resolution Lifecycle Progress</span>
              </h4>
              <span className="text-xs font-semibold text-slate-500">
                Department: <strong className="text-slate-800">{complaint.assignedDepartment || 'Public Works'}</strong>
              </span>
            </div>

            {/* Stepper bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isPassed = stepNum <= currentStepIndex;
                const isCurrent = stepNum === currentStepIndex;

                let colorClasses = 'border-slate-200 bg-white text-slate-400';
                if (isCurrent) {
                  colorClasses = 'border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-500/20';
                } else if (isPassed) {
                  colorClasses = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                }

                return (
                  <div key={step.key} className={`p-3 rounded-xl border flex flex-col justify-between ${colorClasses}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold">{step.label}</span>
                      {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Audit Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit & Work Event Timeline ({complaint.timeline.length} updates)
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.timeline.map((evt) => (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-brand-600 shadow-xs"></div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-sm text-slate-900">{evt.title}</span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(evt.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{evt.description}</p>
                    {evt.officerName && (
                      <div className="text-[11px] text-brand-700 font-semibold pt-1">
                        Inspector: {evt.officerName} {evt.department ? `(${evt.department})` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Management Panel (Available for Municipal Authority or Role Switch) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-sm text-amber-950">
                  Municipal Operations & Triage Controls
                </h4>
              </div>
              <span className="text-[11px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                {userRole === 'admin' ? 'Officer Mode Active' : 'Authority Action Panel'}
              </span>
            </div>

            <form onSubmit={handleAdminUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Status selector */}
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Update Workflow Status
                  </label>
                  <select
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value as ComplaintStatus)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="submitted">Submitted (Awaiting Triage)</option>
                    <option value="under_review">Under Review (Inspection Pending)</option>
                    <option value="in_progress">In Progress (Field Crew Dispatched)</option>
                    <option value="resolved">Resolved (Work Completed & Verified)</option>
                  </select>
                </div>

                {/* Assigned Department */}
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Assign Municipal Department
                  </label>
                  <select
                    value={adminDepartment}
                    onChange={(e) => setAdminDepartment(e.target.value as Department)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Update Note */}
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Official Status Note / Dispatch Remark
                </label>
                <input
                  type="text"
                  placeholder="e.g., Road repair squad deployed with asphalt batch #4. Work scheduled for 2 PM."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Resolution Proof Photo URL (useful when marking resolved) */}
              {adminStatus === 'resolved' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-emerald-900">
                      Resolution Proof Photo URL
                    </label>
                    <button
                      type="button"
                      onClick={() => setAdminProofUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80')}
                      className="text-[11px] text-emerald-700 hover:underline font-semibold"
                    >
                      Use Demo Fixed Proof Photo
                    </button>
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... (proof of completed work)"
                    value={adminProofUrl}
                    onChange={(e) => setAdminProofUrl(e.target.value)}
                    className="w-full bg-white border border-emerald-400 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Official Status</span>
                </button>
              </div>
            </form>
          </div>

          {/* Community Comments & Discussion Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                <span>Community Discussion & Authority Responses ({complaint.comments.length})</span>
              </h4>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {complaint.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No comments yet. Residents and ward officers can leave updates below.
                </p>
              ) : (
                complaint.comments.map(c => {
                  const isOfficer = c.authorRole === 'authority' || c.authorRole === 'admin';
                  return (
                    <div 
                      key={c.id} 
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        isOfficer 
                          ? 'bg-amber-50/70 border-amber-200' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.authorName}</span>
                          {isOfficer && (
                            <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Official Response
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{c.text}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or status observation..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => toggleUpvote(complaint.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              complaint.userHasUpvoted
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${complaint.userHasUpvoted ? 'fill-white stroke-white' : ''}`} />
            <span>{complaint.userHasUpvoted ? 'Upvoted' : 'Upvote Issue'} ({complaint.upvotes})</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
