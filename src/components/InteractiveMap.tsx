import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Filter, 
  Crosshair, 
  RotateCcw, 
  MapPin, 
  ExternalLink, 
  ThumbsUp, 
  MessageSquare, 
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { CATEGORY_METADATA, STATUS_METADATA, DEFAULT_MAP_CENTER } from '../utils/constants';

interface InteractiveMapProps {
  onSelectComplaint?: (complaint: Complaint) => void;
  heightClass?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  onSelectComplaint,
  heightClass = "h-[650px]"
}) => {
  const { 
    complaints, 
    setSelectedComplaint, 
    toggleUpvote, 
    filterCategory, 
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    userRole
  } = useCivic();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_MAP_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    // Add clean modern tile layer (CartoDB Positron / OSM style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Ensure map tiles render sharply after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Filter complaints for map view
  const filteredComplaints = complaints.filter(c => {
    if (activeCategoryFilter !== 'all' && c.category !== activeCategoryFilter) return false;
    if (activeStatusFilter !== 'all' && c.status !== activeStatusFilter) return false;
    return true;
  });

  // Render markers whenever filtered complaints update
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredComplaints.forEach(complaint => {
      const catMeta = CATEGORY_METADATA[complaint.category] || CATEGORY_METADATA.other;
      const statusMeta = STATUS_METADATA[complaint.status];
      const isCritical = complaint.severity === 'critical' && complaint.status !== 'resolved';

      // Status color for pin body
      let pinColor = '#475569'; // default slate
      if (complaint.status === 'resolved') pinColor = '#10b981'; // green
      else if (complaint.status === 'in_progress') pinColor = '#2563eb'; // blue
      else if (complaint.status === 'under_review') pinColor = '#f59e0b'; // amber
      else if (complaint.status === 'submitted') pinColor = isCritical ? '#ef4444' : '#64748b'; // red or slate

      // HTML custom pin
      const iconHtml = `
        <div class="relative group cursor-pointer">
          ${isCritical ? '<div class="civic-pulse-ring"></div>' : ''}
          <div class="civic-marker-pin" style="background-color: ${pinColor};">
            <span class="civic-marker-icon">${catMeta.emoji}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-civic-pin',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([complaint.latitude, complaint.longitude], { icon: customIcon });

      // Create rich interactive popup HTML
      const popupHtml = document.createElement('div');
      popupHtml.className = 'w-72 overflow-hidden bg-white rounded-xl shadow-lg';
      popupHtml.innerHTML = `
        <div class="relative h-32 w-full overflow-hidden bg-slate-100">
          <img src="${complaint.imageUrl}" alt="${complaint.title}" class="w-full h-full object-cover" />
          <div class="absolute top-2 left-2 flex gap-1">
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs ${statusMeta.badgeClass}">
              ${statusMeta.label}
            </span>
            ${isCritical ? '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">Critical</span>' : ''}
          </div>
          <div class="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
            ${complaint.id}
          </div>
        </div>
        <div class="p-3.5 space-y-2">
          <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>${catMeta.emoji}</span>
            <span>${catMeta.label}</span>
          </div>
          <h4 class="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
            ${complaint.title}
          </h4>
          <p class="text-xs text-slate-600 line-clamp-2">
            ${complaint.description}
          </p>
          <div class="text-[11px] text-slate-500 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            <span class="truncate">${complaint.address}</span>
          </div>
          
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3 text-xs text-slate-600">
              <span class="flex items-center gap-1 font-semibold text-slate-700">
                👍 ${complaint.upvotes}
              </span>
              <span class="flex items-center gap-1 text-slate-500">
                💬 ${complaint.comments.length}
              </span>
            </div>
            <button id="btn-inspect-${complaint.id}" class="inline-flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs">
              <span>View Issue</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      // Click listener for details button inside popup
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${complaint.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedComplaint(complaint);
            if (onSelectComplaint) onSelectComplaint(complaint);
          };
        }
      });

      marker.addTo(markersGroup);
    });

  }, [filteredComplaints, setSelectedComplaint, onSelectComplaint]);

  // Center on User Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { animate: true });
          
          // Add temporary pulsing blue circle for user location
          const userIcon = L.divIcon({
            className: 'user-loc-pin',
            html: '<div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md ring-4 ring-blue-400/40 animate-pulse"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<b>You are here</b><br>Nearest civic complaints will appear around you.')
            .openPopup();
        }
      },
      (err) => {
        console.warn('Geolocation failed or permission denied, staying centered on Metro Downtown.');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(DEFAULT_MAP_CENTER, 14);
        }
      }
    );
  };

  // Reset to default downtown center
  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DEFAULT_MAP_CENTER, 14);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
      
      {/* Map Control Bar Overlay (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-100px)]">
        
        {/* Category Filter Chips Dropdown or Pills */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-transparent border-none focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Categories ({complaints.length})</option>
            <option value="pothole">🕳️ Potholes & Road Hazards</option>
            <option value="garbage">🗑️ Garbage & Waste Overflow</option>
            <option value="water_leakage">💧 Water Leakage & Burst</option>
            <option value="streetlight">💡 Broken Streetlights</option>
            <option value="drainage">🌊 Drainage & Flooding</option>
            <option value="fallen_tree">🌳 Fallen Trees</option>
            <option value="traffic_sign">🛑 Traffic Signs</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2">
          <select
            value={activeStatusFilter}
            onChange={(e) => setActiveStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-transparent border-none focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">⏳ Submitted</option>
            <option value="under_review">🔍 Under Review</option>
            <option value="in_progress">🚧 In Progress</option>
            <option value="resolved">✅ Resolved</option>
          </select>
        </div>

        {/* Quick count tag */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 text-white text-xs font-medium px-3 py-1.5 rounded-xl shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{filteredComplaints.length} Issues on Map</span>
        </div>
      </div>

      {/* Floating Action Buttons (Top Right under Zoom) */}
      <div className="absolute top-24 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          title="Detect Current GPS Location"
          className="bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-xl shadow-md border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <Crosshair className="w-5 h-5 text-brand-600" />
        </button>
        <button
          onClick={handleResetCenter}
          title="Reset Map Center"
          className="bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-xl shadow-md border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-md border border-slate-200/80 hidden md:block">
        <div className="text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
          <MapPin className="w-3 h-3 text-brand-600" />
          <span>Status Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span className="text-slate-600">Submitted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Under Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-slate-600 font-medium">Resolved</span>
          </div>
        </div>
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-red-600 font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>Pulsing Pin: High Urgency / Critical</span>
        </div>
      </div>

      {/* Mobile Bottom Quick Status Indicator */}
      <div className="md:hidden absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-md border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{filteredComplaints.length} mapped issues</span>
        </div>
        <button 
          onClick={handleLocateMe}
          className="text-brand-600 font-semibold text-xs flex items-center gap-1"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Near Me</span>
        </button>
      </div>

    </div>
  );
};
