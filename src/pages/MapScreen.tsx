import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Briefcase, 
  GraduationCap, 
  Home, 
  ChevronRight, 
  Info,
  Compass,
  Star,
  Sparkles
} from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { demoTrainingProviders } from '../data/qualifications';
import { demoOpportunities } from '../data/opportunities';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

interface MapScreenProps {
  onNext: () => void;
}

export default function MapScreen({ onNext }: MapScreenProps) {
  const { state } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const beneficiary = getDemoBeneficiary();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'training' | 'opportunities'>('all');
  const [selectedEntity, setSelectedEntity] = useState<{
    id: string;
    title: string;
    type: 'home' | 'training' | 'opportunity';
    distanceKm: number;
    description: string;
    locationName: string;
    lat?: number;
    lng?: number;
  } | null>({
    id: 'home',
    title: beneficiary.name + ' (Home)',
    type: 'home',
    distanceKm: 0,
    description: `Registered location: ${beneficiary.location.town}, ${beneficiary.location.district}. Preferred mobility range: 10 km.`,
    locationName: `${beneficiary.location.town}, ${beneficiary.location.district}`,
    lat: beneficiary.location.coordinates?.lat || 19.5772,
    lng: beneficiary.location.coordinates?.lng || 74.2132,
  });

  const centerLat = beneficiary.location.coordinates?.lat || 19.5772;
  const centerLng = beneficiary.location.coordinates?.lng || 74.2132;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Mobility Radius Circle (10km)
      L.circle([centerLat, centerLng], {
        radius: 10000,
        color: '#4f46e5',
        fillColor: '#6366f1',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6, 6',
      }).addTo(map);

      // Custom Home Marker
      const homeIcon = L.divIcon({
        className: 'custom-home-pin',
        html: `<div style="background-color: #4f46e5; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 16px;">🏡</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker([centerLat, centerLng], { icon: homeIcon })
        .addTo(map)
        .bindPopup(`<b>${beneficiary.name} (Home)</b><br/>${beneficiary.location.town}`)
        .on('click', () => {
          setSelectedEntity({
            id: 'home',
            title: beneficiary.name + ' (Home)',
            type: 'home',
            distanceKm: 0,
            description: `Home base in ${beneficiary.location.town}. Mobility preference: within 10 km.`,
            locationName: beneficiary.location.town,
            lat: centerLat,
            lng: centerLng,
          });
        });

      // Training Provider Markers
      demoTrainingProviders.forEach(tp => {
        if (!tp.location.coordinates) return;
        const tpIcon = L.divIcon({
          className: 'custom-tp-pin',
          html: `<div style="background-color: #0284c7; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.25); font-size: 14px;">🎓</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        L.marker([tp.location.coordinates.lat, tp.location.coordinates.lng], { icon: tpIcon })
          .addTo(map)
          .bindPopup(`<b>${tp.name}</b><br/>Distance: ${tp.distanceKm} km<br/>Rating: ${tp.rating || 4.0}★`)
          .on('click', () => {
            setSelectedEntity({
              id: tp.id,
              title: tp.name,
              type: 'training',
              distanceKm: tp.distanceKm || 1.5,
              description: `Affiliated NSQF Skill Training Centre offering ${tp.sectors.join(', ')}.`,
              locationName: `${tp.location.town}, ${tp.location.district}`,
              lat: tp.location.coordinates?.lat,
              lng: tp.location.coordinates?.lng,
            });
          });
      });

      // Opportunity Markers
      demoOpportunities.forEach(opp => {
        if (!opp.location.coordinates) return;
        const oppIcon = L.divIcon({
          className: 'custom-opp-pin',
          html: `<div style="background-color: #059669; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.25); font-size: 14px;">💼</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        L.marker([opp.location.coordinates.lat, opp.location.coordinates.lng], { icon: oppIcon })
          .addTo(map)
          .bindPopup(`<b>${opp.title}</b><br/>${opp.distanceKm} km away<br/>Match: ${opp.matchScore}%`)
          .on('click', () => {
            setSelectedEntity({
              id: opp.id,
              title: opp.title,
              type: 'opportunity',
              distanceKm: opp.distanceKm,
              description: opp.description,
              locationName: `${opp.location.town}, ${opp.location.district}`,
              lat: opp.location.coordinates?.lat,
              lng: opp.location.coordinates?.lng,
            });
          });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLng, beneficiary]);

  const flyToEntity = (lat?: number, lng?: number) => {
    if (mapInstanceRef.current && lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], 14);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 relative">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-4 pt-5 pb-4 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <div>
              <h1 className="font-extrabold text-base md:text-lg leading-tight">{tr('mapTitle')}</h1>
              <p className="text-indigo-200 text-xs">स्थानिक क्लस्टर मॅप — {beneficiary.location.district} District • PM-AJAY GIA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-indigo-900/70 border border-indigo-500/30 px-3 py-1 rounded-full text-xs text-indigo-200">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>10 km Mobility Constraint Radius</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTab === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            All Pins
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'training' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <GraduationCap className="w-3 h-3" /> Training Centers ({demoTrainingProviders.length})
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'opportunities' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Briefcase className="w-3 h-3" /> Local Opportunities ({demoOpportunities.length})
          </button>
        </div>
      </div>

      {/* Responsive Split View: Map on Left, Explorer on Right on desktop */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative w-full h-[45vh] lg:h-[calc(100vh-160px)] min-h-[300px]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Legend */}
          <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
              <span className="font-bold text-slate-800">Your Home (Sangamner)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
              <span className="text-slate-600">Training Centres</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
              <span className="text-slate-600">Local Opportunities</span>
            </div>
          </div>
        </div>

        {/* Right Side Explorer Drawer on Desktop / Bottom Sheet on Mobile */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col h-auto lg:h-[calc(100vh-160px)] overflow-y-auto">
          {/* Active Pin Card */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            {selectedEntity ? (
              <motion.div
                key={selectedEntity.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl text-white ${
                      selectedEntity.type === 'home' ? 'bg-indigo-600' : selectedEntity.type === 'training' ? 'bg-sky-600' : 'bg-emerald-600'
                    }`}>
                      {selectedEntity.type === 'home' ? <Home className="w-4 h-4" /> : selectedEntity.type === 'training' ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{selectedEntity.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {selectedEntity.locationName} • {selectedEntity.distanceKm === 0 ? 'Home Base' : `${selectedEntity.distanceKm} km`}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    &le;10 km OK
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                  {selectedEntity.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => flyToEntity(selectedEntity.lat, selectedEntity.lng)}
                    className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Compass className="w-3.5 h-3.5" /> Center on Map
                  </button>

                  <button
                    onClick={() => flyToEntity(centerLat, centerLng)}
                    className="text-xs text-slate-500 font-medium hover:underline"
                  >
                    Reset Home
                  </button>
                </div>
              </motion.div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-2">Tap any pin on the map to inspect details.</p>
            )}
          </div>

          {/* Directory of Cluster Entities */}
          <div className="flex-1 p-4 space-y-2.5 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Corridor Entities in Range
            </h4>

            {demoTrainingProviders.map(tp => (
              <div
                key={tp.id}
                onClick={() => {
                  setSelectedEntity({
                    id: tp.id,
                    title: tp.name,
                    type: 'training',
                    distanceKm: tp.distanceKm || 1.5,
                    description: `Affiliated NSQF Skill Training Centre offering ${tp.sectors.join(', ')}.`,
                    locationName: `${tp.location.town}, ${tp.location.district}`,
                    lat: tp.location.coordinates?.lat,
                    lng: tp.location.coordinates?.lng,
                  });
                  flyToEntity(tp.location.coordinates?.lat, tp.location.coordinates?.lng);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all text-xs flex items-center justify-between ${
                  selectedEntity?.id === tp.id ? 'border-sky-500 bg-sky-50/60' : 'border-slate-100 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <h5 className="font-bold text-slate-900">{tp.name}</h5>
                  <p className="text-[11px] text-slate-500">{tp.sectors[0]} • {tp.distanceKm} km</p>
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Training</span>
              </div>
            ))}

            {demoOpportunities.slice(0, 3).map(opp => (
              <div
                key={opp.id}
                onClick={() => {
                  setSelectedEntity({
                    id: opp.id,
                    title: opp.title,
                    type: 'opportunity',
                    distanceKm: opp.distanceKm,
                    description: opp.description,
                    locationName: `${opp.location.town}, ${opp.location.district}`,
                    lat: opp.location.coordinates?.lat,
                    lng: opp.location.coordinates?.lng,
                  });
                  flyToEntity(opp.location.coordinates?.lat, opp.location.coordinates?.lng);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all text-xs flex items-center justify-between ${
                  selectedEntity?.id === opp.id ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-100 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <h5 className="font-bold text-slate-900">{opp.title}</h5>
                  <p className="text-[11px] text-slate-500">{opp.distanceKm === 0 ? 'Home' : `${opp.distanceKm} km`} • Match: {opp.matchScore}%</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Opportunity</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Step 7 of 8</p>
            <p className="text-sm font-bold text-slate-900">Your 90-Day Livelihood Action Plan</p>
          </div>
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
          >
            <span>{tr('nextPlan')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
