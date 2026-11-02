import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { PublicDashboard } from './components/PublicDashboard';
import { PublicStatistics } from './components/PublicStatistics';
import { ReportIssueModal } from './components/ReportIssueModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Footer } from './components/Footer';
import { useCivic } from './context/CivicContext';
import { 
  PlusCircle, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isReportModalOpen, 
    setIsReportModalOpen, 
    selectedComplaint, 
    setSelectedComplaint,
    toastMessage,
    clearToast,
    complaints,
    userRole
  } = useCivic();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800' 
              : toastMessage.type === 'warning'
              ? 'bg-amber-950 text-amber-100 border-amber-800'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            <span>
              {toastMessage.type === 'success' ? '✅' : toastMessage.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{toastMessage.text}</span>
            <button 
              onClick={clearToast}
              className="ml-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar onOpenNotifications={() => setIsNotifOpen(true)} />

      {/* Authority Mode Alert Banner (if in Authority Mode) */}
      {userRole === 'admin' && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 border-b border-amber-600/20 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-900 animate-ping"></span>
          <span>Municipal Authority Mode Active: You have permission to update complaint statuses, assign departments, and upload resolution proof photos.</span>
        </div>
      )}

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: MAP VIEW */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                  <span className="p-2 bg-brand-100 text-brand-700 rounded-xl">🗺️</span>
                  <span>Interactive Civic Map & Incident Pins</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Explore geotagged complaints in your neighborhood. Click any pin to inspect photos, upvote, or track repair status.
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-600/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report at My Location</span>
              </button>
            </div>

            {/* Interactive Leaflet Map */}
            <InteractiveMap heightClass="h-[620px]" />

            {/* Quick Urgent Issues Carousel / Row */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span>Active Critical & High Urgency Issues</span>
                </h3>
                <button
                  onClick={() => setActiveTab('issues')}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>View all in feed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complaints
                  .filter(c => (c.severity === 'critical' || c.severity === 'high') && c.status !== 'resolved')
                  .slice(0, 3)
                  .map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center"
                    >
                      <img 
                        src={c.imageUrl} 
                        alt={c.title} 
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          <span>{c.severity.toUpperCase()} PRIORITY</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{c.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.address}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PUBLIC ISSUES FEED */}
        {activeTab === 'issues' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                  <span className="p-2 bg-brand-100 text-brand-700 rounded-xl">📋</span>
                  <span>Civic Issues Ledger</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Public municipal dashboard of road hazards, sanitation backlogs, water leaks, and public lighting.
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-600/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Civic Issue</span>
              </button>
            </div>

            <PublicDashboard isMyReportsOnly={false} />
          </div>
        )}

        {/* VIEW 3: MY REPORTS */}
        {activeTab === 'my-reports' && (
          <div className="space-y-6 animate-fadeIn">
            <PublicDashboard isMyReportsOnly={true} />
          </div>
        )}

        {/* VIEW 4: TRANSPARENCY & STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fadeIn">
            <PublicStatistics />
          </div>
        )}

      </main>

      {/* Report Issue Modal */}
      {isReportModalOpen && (
        <ReportIssueModal onClose={() => setIsReportModalOpen(false)} />
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal 
          complaint={selectedComplaint} 
          onClose={() => setSelectedComplaint(null)} 
        />
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />

      {/* Global Footer */}
      <Footer />

    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
