'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { biblicalPlaces } from '../data/biblicalPlaces';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Search, 
  BookOpen, 
  Compass, 
  ExternalLink, 
  Navigation, 
  Layers, 
  ChevronRight,
  Sparkles,
  Map as MapIcon,
  X,
  Maximize2
} from 'lucide-react';

export default function BiblicalPlacesPage() {
  const [selectedPlaceId, setSelectedPlaceId] = useState('jerusalem');
  const [searchQuery, setSearchQuery] = useState('');
  const [testamentFilter, setTestamentFilter] = useState('all'); // 'all', 'ot', 'nt'
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const filteredPlaces = useMemo(() => {
    return biblicalPlaces.filter(place => {
      if (testamentFilter === 'ot' && place.testament === 'nt') return false;
      if (testamentFilter === 'nt' && place.testament === 'ot') return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = place.name.toLowerCase().includes(q);
        const matchesAncient = place.ancientName.toLowerCase().includes(q);
        const matchesRegion = place.region.toLowerCase().includes(q);
        const matchesSummary = place.summary.toLowerCase().includes(q);
        return matchesName || matchesAncient || matchesRegion || matchesSummary;
      }
      return true;
    });
  }, [searchQuery, testamentFilter]);

  const selectedPlace = useMemo(() => {
    return biblicalPlaces.find(p => p.id === selectedPlaceId) || biblicalPlaces[0];
  }, [selectedPlaceId]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isCancelled = false;

    async function initOrUpdateMap() {
      if (typeof window === 'undefined') return;

      const container = document.getElementById('biblical-interactive-map');
      if (!container) return;

      const L = (await import('leaflet')).default;
      if (isCancelled) return;

      if (!mapInstanceRef.current) {
        // Create Leaflet instance
        const map = L.map('biblical-interactive-map', {
          center: [selectedPlace.lat, selectedPlace.lng],
          zoom: selectedPlace.zoom || 13,
          zoomControl: true,
          scrollWheelZoom: true
        });
        mapInstanceRef.current = map;

        // OpenStreetMap raster tiles (Zero API key required, permitted in CSP)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Add pins for all places
        biblicalPlaces.forEach(p => {
          const isSelected = p.id === selectedPlace.id;
          const marker = L.circleMarker([p.lat, p.lng], {
            radius: isSelected ? 12 : 7,
            fillColor: isSelected ? '#f59e0b' : '#3b82f6',
            color: '#ffffff',
            weight: isSelected ? 3 : 2,
            opacity: 1,
            fillOpacity: 0.95
          }).addTo(map);

          marker.bindTooltip(`<strong>${p.name}</strong><br/>${p.region}`, {
            direction: 'top',
            offset: [0, -8]
          });

          marker.on('click', () => {
            setSelectedPlaceId(p.id);
          });

          markersRef.current[p.id] = marker;
        });

        setMapLoaded(true);
      } else {
        const map = mapInstanceRef.current;
        
        // Smoothly fly to selected place
        map.flyTo([selectedPlace.lat, selectedPlace.lng], selectedPlace.zoom || 13, {
          duration: 1.2
        });

        // Highlight selected pin
        biblicalPlaces.forEach(p => {
          const marker = markersRef.current[p.id];
          if (marker) {
            const isSelected = p.id === selectedPlace.id;
            marker.setStyle({
              radius: isSelected ? 12 : 7,
              fillColor: isSelected ? '#f59e0b' : '#3b82f6',
              weight: isSelected ? 3 : 2
            });
            if (isSelected) {
              marker.bringToFront();
            }
          }
        });
      }
    }

    initOrUpdateMap();

    return () => {
      isCancelled = true;
    };
  }, [selectedPlaceId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleRecenter = () => {
    if (mapInstanceRef.current && selectedPlace) {
      mapInstanceRef.current.setView([selectedPlace.lat, selectedPlace.lng], selectedPlace.zoom || 13);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            color: '#15803d',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <MapIcon size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Biblical Places & Sacred Maps
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Explore the geography of the Holy Land, ancient sites, and journeys of faith
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side places list & filters, Right side map + details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Search & Place Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search Box */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search biblical locations..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
              {[
                { id: 'all', label: `All (${biblicalPlaces.length})` },
                { id: 'ot', label: 'Old Testament' },
                { id: 'nt', label: 'New Testament' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTestamentFilter(f.id)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: testamentFilter === f.id ? 'var(--accent-blue)' : 'var(--border-color)',
                    backgroundColor: testamentFilter === f.id ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
                    color: testamentFilter === f.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Places List Scrollable Box */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '620px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {filteredPlaces.length === 0 ? (
              <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No biblical places found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredPlaces.map((p) => {
                const isSelected = selectedPlace.id === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPlaceId(p.id);
                    }}
                    className="card"
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      borderLeft: isSelected ? '4px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'var(--bg-card)' : 'var(--bg-card)',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: isSelected ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                          {p.name}
                        </h4>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          padding: '1px 6px', 
                          borderRadius: '4px',
                          backgroundColor: p.testament === 'ot' ? '#fef3c7' : p.testament === 'nt' ? '#e0e7ff' : '#dcfce7',
                          color: p.testament === 'ot' ? '#b45309' : p.testament === 'nt' ? '#4338ca' : '#15803d'
                        }}>
                          {p.testament === 'both' ? 'OT & NT' : p.testament.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {p.region}
                      </p>
                    </div>

                    <ChevronRight size={18} style={{ color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)' }} />
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Native Interactive Leaflet Map & Deep Dive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Interactive Leaflet Map Container (NO IFRAME, 100% RELIABLE) */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ position: 'relative', width: '100%', height: '360px', background: '#e2e8f0' }}>
              <div 
                id="biblical-interactive-map" 
                style={{ width: '100%', height: '100%', zIndex: 1 }}
              />

              {/* Coordinates Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 10
              }}>
                <Compass size={14} style={{ color: '#38bdf8' }} />
                <span>{selectedPlace.lat.toFixed(4)}°N, {selectedPlace.lng.toFixed(4)}°E</span>
              </div>

              {/* Recenter Button */}
              <button
                onClick={handleRecenter}
                title="Recenter on selected place"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <Navigation size={12} style={{ color: '#fbbf24' }} />
                <span>Focus {selectedPlace.name}</span>
              </button>
            </div>
          </div>

          {/* Place Details Card */}
          <div className="card fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Title & Scripture Link */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {selectedPlace.name}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                  {selectedPlace.ancientName} &bull; {selectedPlace.region}
                </p>
              </div>

              <Link
                href={`/bible?book=${encodeURIComponent(selectedPlace.book)}&chapter=${selectedPlace.chapter}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-blue-grad)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <BookOpen size={16} />
                <span>Read in {selectedPlace.book} {selectedPlace.chapter}</span>
              </Link>
            </div>

            {/* Historical Summary */}
            <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              {selectedPlace.summary}
            </p>

            {/* Key Scripture Quote Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.12) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              borderLeft: '4px solid var(--accent-gold)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Sparkles size={16} />
                {selectedPlace.scriptureRef}
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)', fontStyle: 'italic', fontWeight: 500 }}>
                &ldquo;{selectedPlace.scriptureText}&rdquo;
              </p>
            </div>

            {/* Major Biblical Events */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 12px', letterSpacing: '0.5px' }}>
                Major Biblical Events Here
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPlace.keyEvents.map((evt, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px'
                    }}
                  >
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.8rem' }}>&bull;</span>
                    <span>{evt}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
