import React from 'react';
import { MapPin, PhoneCall, RotateCcw, ShieldCheck, Heart } from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export const Footer: React.FC = () => {
  const { resetToDemoData, setActiveTab } = useCivic();

  return (
    <footer className="mt-20 bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <MapPin className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span>Civic<span className="text-brand-500">Track</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open civic complaint tracking platform connecting residents with municipal public works departments for faster, transparent problem resolution.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Public Service Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Public Ledger
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-white transition-colors">
                  Interactive City Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('issues')} className="hover:text-white transition-colors">
                  Public Complaints Feed
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('stats')} className="hover:text-white transition-colors">
                  Transparency Scoreboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-reports')} className="hover:text-white transition-colors">
                  Resident Activity
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Municipal 24/7 Hotlines</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Pothole / Road Collapse:</span>
                <strong className="text-slate-200">1800-ROADS</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Main Burst:</span>
                <strong className="text-slate-200">1800-WATER</strong>
              </div>
              <div className="flex justify-between">
                <span>Electrical Hazards:</span>
                <strong className="text-slate-200">1800-POWER</strong>
              </div>
              <div className="flex justify-between">
                <span>Sanitation & Waste:</span>
                <strong className="text-slate-200">1800-CLEAN</strong>
              </div>
            </div>
          </div>

          {/* Demo Data Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Developer & Demo
            </h4>
            <p className="text-xs text-slate-400">
              CivicTrack simulates a production-grade municipal infrastructure portal with local storage persistence.
            </p>
            <button
              onClick={resetToDemoData}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 CivicTrack Municipal Initiative. Built for transparency and civic action.</p>
          <p className="flex items-center gap-1">
            Empowering residents to build cleaner, safer cities
          </p>
        </div>
      </div>
    </footer>
  );
};
