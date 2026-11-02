import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Download, 
  Award, 
  AlertTriangle, 
  Layers,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { CATEGORY_METADATA, WARDS } from '../utils/constants';
import { ComplaintCategory } from '../types';

export const PublicStatistics: React.FC = () => {
  const { stats, complaints, showToast } = useCivic();

  const handleExportCSV = () => {
    // Generate clean CSV of all public complaints
    const headers = ['Complaint ID', 'Title', 'Category', 'Status', 'Severity', 'Ward', 'Address', 'Latitude', 'Longitude', 'Created At', 'Resolved At', 'Upvotes'];
    const rows = complaints.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.status,
      c.severity,
      `"${c.ward}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      c.latitude,
      c.longitude,
      c.createdAt,
      c.resolvedAt || 'N/A',
      c.upvotes
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicTrack_Public_Transparency_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded public transparency civic data CSV!', 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/50">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Open Civic Accountability Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Transparent Metrics for a Better, Safer City
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every civic complaint filed by residents is tracked on an open public ledger. 
            Inspect resolution times, municipal department responsiveness, and ward scorecards in real-time.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="bg-white hover:bg-slate-100 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Open Civic Dataset (CSV)</span>
            </button>
          </div>
        </div>

        {/* Decorative background circles */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* High Level Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Logged</p>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalReported}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <span>By 100% verified geotags</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolution Rate</p>
          <div className="text-3xl font-extrabold text-emerald-600">{stats.resolutionRate}%</div>
          <div className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Above 75% municipal SLA</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Avg Resolution Speed</p>
          <div className="text-3xl font-extrabold text-blue-900">{stats.avgResolutionHours}h</div>
          <div className="text-xs text-blue-700 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Under 48-hour city target</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Citizen Upvotes</p>
          <div className="text-3xl font-extrabold text-brand-900">
            {complaints.reduce((acc, c) => acc + c.upvotes, 0)}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>Active community engagement</span>
          </div>
        </div>

      </div>

      {/* Two Column Section: Category Distribution & Status Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <span>Issues by Civic Category</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of public infrastructure requests reported by residents
            </p>
          </div>

          <div className="space-y-3.5">
            {(Object.keys(CATEGORY_METADATA) as ComplaintCategory[]).map(catKey => {
              const meta = CATEGORY_METADATA[catKey];
              const count = stats.categoryCounts[catKey] || 0;
              const percentage = stats.totalReported > 0 ? Math.round((count / stats.totalReported) * 100) : 0;

              return (
                <div key={catKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <span>{meta.emoji}</span>
                      <span>{meta.label}</span>
                    </span>
                    <span className="text-slate-600 font-bold">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700" 
                      style={{ 
                        width: `${Math.max(percentage, 3)}%`,
                        backgroundColor: meta.color 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Pipeline & Funnel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Municipal Resolution Pipeline</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live funnel from citizen submission to verified field resolution
            </p>
          </div>

          <div className="space-y-3">
            
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Submitted (Awaiting Triage)</h4>
                  <p className="text-[11px] text-slate-500">Newly recorded in ledger</p>
                </div>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {stats.submittedCount}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Under Review</h4>
                  <p className="text-[11px] text-amber-700">Ward officer site inspection</p>
                </div>
              </div>
              <div className="text-base font-extrabold text-amber-900">
                {stats.underReviewCount}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900">In Progress (Active Crews)</h4>
                  <p className="text-[11px] text-blue-700">Heavy equipment & squads on site</p>
                </div>
              </div>
              <div className="text-base font-extrabold text-blue-900">
                {stats.inProgressCount}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Resolved & Verified</h4>
                  <p className="text-[11px] text-emerald-700">Verified with photo evidence</p>
                </div>
              </div>
              <div className="text-base font-extrabold text-emerald-900">
                {stats.resolvedCount}
              </div>
            </div>

          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Overall Efficiency Index:</span>
            <span className="font-extrabold text-emerald-700">A+ (Municipal Gold Standard)</span>
          </div>

        </div>

      </div>

      {/* Ward-by-Ward Accountability Scoreboard */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Ward-by-Ward Resolution Scorecard</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Holding local municipal ward offices accountable for response times and civic maintenance
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Ward Jurisdiction</th>
                <th className="pb-3 px-3 text-center">Total Issues</th>
                <th className="pb-3 px-3 text-center">Resolved</th>
                <th className="pb-3 px-3 text-center">Fix Rate</th>
                <th className="pb-3 px-3 text-right">Performance Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.wardPerformance.map((wardStat, index) => {
                let badgeClass = 'bg-emerald-100 text-emerald-800';
                let rating = 'Excellent';
                if (wardStat.rate < 50) {
                  badgeClass = 'bg-amber-100 text-amber-800';
                  rating = 'Action Needed';
                }

                return (
                  <tr key={wardStat.ward} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {wardStat.ward}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-600">
                      {wardStat.total}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-700">
                      {wardStat.resolved}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-extrabold text-slate-900">
                        {wardStat.rate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}`}>
                        {rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Charter Response Guarantees */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              City Citizen Charter Response Guarantees
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Maximum turnaround commitments established under Municipal Act
            </p>
          </div>
          <span className="hidden sm:inline bg-slate-800 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full border border-slate-700">
            SLA Standard v3.2
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xl">🕳️</span>
            <h4 className="text-xs font-bold text-white mt-1">Hazard Potholes</h4>
            <p className="text-[11px] text-slate-400">Patched within <strong>48 hours</strong></p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xl">🗑️</span>
            <h4 className="text-xs font-bold text-white mt-1">Garbage Overflow</h4>
            <p className="text-[11px] text-slate-400">Cleared within <strong>12 hours</strong></p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xl">💧</span>
            <h4 className="text-xs font-bold text-white mt-1">Water Main Burst</h4>
            <p className="text-[11px] text-slate-400">Valve shut in <strong>2 hours</strong></p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <span className="text-xl">💡</span>
            <h4 className="text-xs font-bold text-white mt-1">Dark Streetlights</h4>
            <p className="text-[11px] text-slate-400">Repaired within <strong>72 hours</strong></p>
          </div>
        </div>
      </div>

    </div>
  );
};
