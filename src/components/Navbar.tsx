import React, { useState } from 'react';
import { 
  MapPin, 
  PlusCircle, 
  Bell, 
  ShieldAlert, 
  User, 
  BarChart3, 
  LayoutGrid, 
  Map as MapIcon, 
  Layers, 
  CheckCircle2, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const { 
    userRole, 
    setUserRole, 
    activeTab, 
    setActiveTab, 
    setIsReportModalOpen, 
    notifications,
    stats
  } = useCivic();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro ticker for municipal transparency */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Open Civic Ledger Live
          </span>
          <span className="text-slate-500">•</span>
          <span>Metro Municipal Operations Active</span>
          <span className="text-slate-500">•</span>
          <span>Resolution Benchmark: <strong className="text-white">~32 Hours</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Total Fixed This Month: <span className="text-emerald-400 font-semibold">{stats.resolvedCount} Issues</span></span>
          <span className="text-slate-500">•</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
            {stats.resolutionRate}% Success Rate
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('issues')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                    Civic<span className="text-brand-600">Track</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded-sm">
                    Public
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  Report • Geotag • Track • Resolve
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Map View</span>
            </button>

            <button
              onClick={() => setActiveTab('issues')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'issues'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Complaints Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('my-reports')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'my-reports'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Transparency Stats</span>
            </button>
          </nav>

          {/* Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setUserRole('resident')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  userRole === 'resident'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="View as a Resident"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Resident</span>
              </button>

              <button
                onClick={() => setUserRole('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  userRole === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to Municipal Officer Mode"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Authority</span>
                {userRole === 'admin' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping"></span>
                )}
              </button>
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Primary Report CTA */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white px-3.5 sm:px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-600/30 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 py-2">
            <button
              onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'map' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <MapIcon className="w-4 h-4 text-brand-600" />
              Map View
            </button>
            <button
              onClick={() => { setActiveTab('issues'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'issues' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-brand-600" />
              Complaints
            </button>
            <button
              onClick={() => { setActiveTab('my-reports'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'my-reports' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Layers className="w-4 h-4 text-brand-600" />
              My Reports
            </button>
            <button
              onClick={() => { setActiveTab('stats'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'stats' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Stats
            </button>
          </div>
          
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Operating as: <strong className="text-slate-800 uppercase">{userRole}</strong></span>
            <span className="text-emerald-600 font-semibold">{stats.resolutionRate}% City Fix Rate</span>
          </div>
        </div>
      )}
    </header>
  );
};
