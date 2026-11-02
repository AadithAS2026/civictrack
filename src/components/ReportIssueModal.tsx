import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, 
  Camera, 
  MapPin, 
  Upload, 
  Crosshair, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Layers,
  Info
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { ComplaintCategory, SeverityLevel, Department } from '../types';
import { CATEGORY_METADATA, WARDS, DEFAULT_MAP_CENTER } from '../utils/constants';

interface ReportIssueModalProps {
  onClose: () => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ onClose }) => {
  const { submitComplaint, setSelectedComplaint, setActiveTab, showToast } = useCivic();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('pothole');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [ward, setWard] = useState<string>(WARDS[1]);
  const [address, setAddress] = useState('458 Central Boulevard');
  const [landmark, setLandmark] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Geotag coordinates state
  const [latitude, setLatitude] = useState<number>(DEFAULT_MAP_CENTER[0] + 0.004);
  const [longitude, setLongitude] = useState<number>(DEFAULT_MAP_CENTER[1] - 0.003);
  const [isGeotagged, setIsGeotagged] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Photo state
  const [imagePreview, setImagePreview] = useState<string>(
    CATEGORY_METADATA.pothole.sampleImages[0]
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Mini Map Reference
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Preset sample photos for easy testing
  const samplePresets = [
    { label: '🕳️ Pothole', category: 'pothole' as ComplaintCategory, url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80', defaultTitle: 'Deep Pothole damaging vehicles', defaultAddr: 'Corner of 4th Ave & Elm St' },
    { label: '🗑️ Garbage', category: 'garbage' as ComplaintCategory, url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80', defaultTitle: 'Overflowing dumpsters on sidewalk', defaultAddr: '89 Mulberry Way' },
    { label: '💧 Water Burst', category: 'water_leakage' as ComplaintCategory, url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80', defaultTitle: 'Clean water main gushing under pavement', defaultAddr: '15 Wallaby Blvd' },
    { label: '💡 Broken Light', category: 'streetlight' as ComplaintCategory, url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80', defaultTitle: 'Streetlights out along dark alleyway', defaultAddr: 'Greenway Promenade Post 48' },
    { label: '🌊 Blocked Drain', category: 'drainage' as ComplaintCategory, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', defaultTitle: 'Monsoon storm sewer choked with trash', defaultAddr: '428 Grand Ave Bus Stand' }
  ];

  // Initialize mini Leaflet map for interactive pin placement
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (miniMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'pin-picker',
      html: `
        <div class="relative cursor-move">
          <div class="civic-marker-pin" style="background-color: #ea580c;">
            <span class="civic-marker-icon">📍</span>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    const marker = L.marker([latitude, longitude], {
      icon: pinIcon,
      draggable: true
    }).addTo(map);

    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      setLatitude(position.lat);
      setLongitude(position.lng);
      setIsGeotagged(true);
      setAddress(`Near ${position.lat.toFixed(4)}°N, ${Math.abs(position.lng).toFixed(4)}°W`);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
      setIsGeotagged(true);
      setAddress(`Near ${e.latlng.lat.toFixed(4)}°N, ${Math.abs(e.latlng.lng).toFixed(4)}°W`);
    });

    miniMapRef.current = map;
    markerRef.current = marker;

    // Ensure modal layout animation finishes before sizing map
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      miniMapRef.current = null;
    };
  }, []);

  // Sync pin when coordinates change programmatically
  useEffect(() => {
    if (miniMapRef.current && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      miniMapRef.current.setView([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          setIsUploading(false);
          // Auto-trigger geotagging when user uploads a photo
          handleDetectLiveGPS();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Preset Sample Photo
  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setImagePreview(preset.url);
    setCategory(preset.category);
    if (!title) setTitle(preset.defaultTitle);
    if (address === '458 Central Boulevard') setAddress(preset.defaultAddr);
    showToast(`Preset loaded for ${preset.label}`, 'info');
  };

  // Browser Geolocation Geotagging
  const handleDetectLiveGPS = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLatitude(lat);
        setLongitude(lng);
        setIsGeotagged(true);
        setIsLocating(false);
        setAddress(`Geotagged Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
        showToast('Exact GPS Coordinates captured!', 'success');
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        setIsLocating(false);
        showToast('Could not access device GPS. You can pin location manually on the map.', 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please provide a short summary title for the issue.', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('Please provide details in the description.', 'warning');
      return;
    }

    const defaultDept = CATEGORY_METADATA[category]?.defaultDepartment || 'Public Works & Roads';

    const newIssue = submitComplaint({
      title: title.trim(),
      description: description.trim(),
      category,
      severity,
      ward,
      address: address.trim() || 'Reported Location',
      landmark: landmark.trim() || undefined,
      latitude,
      longitude,
      imageUrl: imagePreview,
      reporterName: isAnonymous ? 'Anonymous Resident' : (reporterName.trim() || 'Civic Contributor'),
      reporterContact: reporterContact.trim() || undefined,
      isAnonymous,
      assignedDepartment: defaultDept
    });

    onClose();
    // Open the newly created issue details and set map or issues tab
    setSelectedComplaint(newIssue);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Report a Civic Issue
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Photo evidence + Automatic GPS Geotagging
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 sm:px-8 space-y-6">

          {/* Section 1: Photo Upload & Geotag */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Photo Evidence & Automatic GPS Geotagging <span className="text-red-500">*</span>
            </label>

            {/* Quick Demo Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500">Quick Test Presets:</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Photo Card Preview */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 group hover:border-brand-500 transition-colors">
              {imagePreview ? (
                <div className="relative h-56 sm:h-64 w-full">
                  <img 
                    src={imagePreview} 
                    alt="Upload preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-brand-600" />
                      <span>Change Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {/* Automatic Geotag Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-mono text-[11px]">
                      GPS Geotagged: {latitude.toFixed(4)}°N, {Math.abs(longitude).toFixed(4)}°W
                    </span>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <Upload className="w-10 h-10 text-slate-400 mb-2 stroke-[1.5]" />
                  <span className="text-sm font-bold text-slate-700">Click to upload photo or take picture</span>
                  <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP with camera geotagging</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>

          {/* Section 2: Interactive Map Location Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>2. Map Location Pin & Geotag</span>
              </label>

              <button
                type="button"
                onClick={handleDetectLiveGPS}
                disabled={isLocating}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg border border-brand-200 transition-colors"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting GPS...' : 'Use My Current GPS'}</span>
              </button>
            </div>

            {/* Mini Map */}
            <div className="h-48 w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
              <div ref={mapContainerRef} className="w-full h-full z-10" />
              <div className="absolute bottom-2 right-2 z-20 bg-white/90 backdrop-blur-md text-[10px] text-slate-600 font-semibold px-2 py-0.5 rounded shadow-xs pointer-events-none">
                💡 Drag pin or click map to set location
              </div>
            </div>

            {/* Address & Landmark Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Street Address / Area
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 458 Central Boulevard"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ward Jurisdiction
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden cursor-pointer"
                >
                  {WARDS.filter(w => w !== 'All Wards').map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Landmark (Optional helper for inspection crew)
              </label>
              <input
                type="text"
                placeholder="e.g., Opposite Metro Gate 2, near Coffee Shop"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 3: Category & Urgency */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Issue Category & Severity
            </label>

            {/* Category selection grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_METADATA) as ComplaintCategory[]).map((catKey) => {
                const meta = CATEGORY_METADATA[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setCategory(catKey);
                      if (meta.sampleImages?.[0] && imagePreview.includes('unsplash.com')) {
                        setImagePreview(meta.sampleImages[0]);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-brand-600 bg-brand-50/70 shadow-xs ring-2 ring-brand-500/20' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{meta.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Severity Radio pills */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Severity / Safety Urgency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'low' as SeverityLevel, label: 'Low', desc: 'Minor cosmetic' },
                  { id: 'medium' as SeverityLevel, label: 'Medium', desc: 'Needs attention' },
                  { id: 'high' as SeverityLevel, label: 'High Priority', desc: 'Active hindrance' },
                  { id: 'critical' as SeverityLevel, label: 'Emergency', desc: 'Hazard to life' }
                ].map(sev => {
                  const isSelected = severity === sev.id;
                  return (
                    <button
                      key={sev.id}
                      type="button"
                      onClick={() => setSeverity(sev.id)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? 'border-red-500 bg-red-50 text-red-900 font-bold ring-2 ring-red-400/20' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs">{sev.label}</div>
                      <div className="text-[10px] text-slate-400">{sev.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Title & Description */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4. Complaint Details
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Issue Summary Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Deep crater pothole expanding near pedestrian school crossing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe how long this issue has persisted, risks to pedestrians or vehicles, and any specific details for the repair squad..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Section 5: Reporter Contact & Privacy */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Reporter Information
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded-sm text-brand-600 focus:ring-brand-500"
                />
                <span>Submit as Anonymous</span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Email or Phone (for status SMS/Email)"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-600/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Civic Complaint</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
