import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle,
  X,
  Layers,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { CATEGORY_METADATA, STATUS_METADATA, WARDS } from '../utils/constants';
import { ComplaintCard } from './ComplaintCard';

interface PublicDashboardProps {
  isMyReportsOnly?: boolean;
}

export const PublicDashboard: React.FC<PublicDashboardProps> = ({ isMyReportsOnly = false }) => {
  const { 
    complaints, 
    setSelectedComplaint, 
    setIsReportModalOpen,
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
    stats,
    userRole
  } = useCivic();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      // If My Reports tab: filter by upvoted by user or reported by user/anonymous
      if (isMyReportsOnly) {
        const isMine = c.userHasUpvoted || c.reporterName.includes('Marcus') || c.reporterName.includes('You');
        if (!isMine) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        const matchesAddr = c.address.toLowerCase().includes(q);
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesWard = c.ward.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAddr && !matchesId && !matchesWard) {
          return false;
        }
      }

      // Category
      if (filterCategory !== 'all' && c.category !== filterCategory) return false;

      // Status
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;

      // Ward
      if (filterWard !== 'All Wards' && c.ward !== filterWard) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      if (sortBy === 'comments') {
        return b.comments.length - a.comments.length;
      }
      if (sortBy === 'severity') {
        const rank = { critical: 4, high: 3, medium: 2, low: 1 };
        return rank[b.severity] - rank[a.severity];
      }
      // 'newest' default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [complaints, isMyReportsOnly, searchQuery, filterCategory, filterStatus, filterWard, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Top Civic Health KPI Cards (Only on general dashboard) */}
      {!isMyReportsOnly && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Logged</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.totalReported}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Across 6 Municipal Wards</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              📋
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Field Work</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1">{stats.inProgressCount}</h3>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">Crews actively on-site</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              🚧
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Fixed & Verified</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1">{stats.resolvedCount}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">With photo proof</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✅
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Resolution Rate</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-900 mt-1">{stats.resolutionRate}%</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Benchmark avg 32 hrs</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              ⚡
            </div>
          </div>

        </div>
      )}

      {/* Header Title for My Reports */}
      {isMyReportsOnly && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              My Civic Activity & Tracked Submissions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Issues you have submitted or upvoted to follow real-time repair progress.
            </p>
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Issue</span>
          </button>
        </div>
      )}

      {/* Filters & Search Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Top search & sorting row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by issue title, landmark, ward, or #CT-2026-XXXX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none focus:outline-hidden cursor-pointer text-xs font-bold text-slate-800"
              >
                <option value="newest">Newest First</option>
                <option value="upvotes">Most Upvoted 🔥</option>
                <option value="severity">Highest Severity ⚠️</option>
                <option value="comments">Most Discussed 💬</option>
              </select>
            </div>

            {/* Ward Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 w-full sm:w-auto">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="bg-transparent border-none focus:outline-hidden cursor-pointer text-xs font-semibold text-slate-800 max-w-[130px] sm:max-w-[160px] truncate"
              >
                {WARDS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Status ({complaints.length})
          </button>

          {(['submitted', 'under_review', 'in_progress', 'resolved'] as ComplaintStatus[]).map((status) => {
            const count = complaints.filter(c => c.status === status).length;
            const meta = STATUS_METADATA[status];
            const isSelected = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : meta.dotColor}`}></span>
                <span>{meta.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-brand-100 text-brand-800 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✨ All Categories
          </button>
          {(Object.keys(CATEGORY_METADATA) as ComplaintCategory[]).map(catKey => {
            const meta = CATEGORY_METADATA[catKey];
            const isSelected = filterCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setFilterCategory(catKey)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-brand-100 text-brand-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900 font-bold">{filteredComplaints.length}</strong> complaints
        </span>
        {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterWard !== 'All Wards' ? (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setFilterStatus('all');
              setFilterWard('All Wards');
            }}
            className="text-brand-600 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        ) : null}
      </div>

      {/* Complaints Cards Grid / List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-3xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No civic issues match your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your category, status, or search query to find reported issues.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setFilterStatus('all');
              setFilterWard('All Wards');
            }}
            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            : "space-y-4"
        }>
          {filteredComplaints.map(complaint => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onOpenDetails={setSelectedComplaint}
            />
          ))}
        </div>
      )}

    </div>
  );
};
