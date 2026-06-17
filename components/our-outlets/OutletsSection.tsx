'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronRight, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Outlet } from '@/lib/branches';

type Props = {
  outlets: Outlet[];
};

const OutletsSection: React.FC<Props> = ({ outlets }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedThana, setSelectedThana] = useState<string>('');
  const [hoveredOutlet, setHoveredOutlet] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Record<string, any>>({});

  const districts = useMemo(
    () =>
      Array.from(
        new Set(outlets.map((o) => o.address.split(',').pop()?.trim() ?? '')),
      ).filter(Boolean),
    [outlets],
  );

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).L) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity =
            'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.body.appendChild(script);
        });
      }

      setMapLoaded(true);
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;

    const map = L.map(mapRef.current, {
      zoomControl: true,
    }).setView([24.2, 89.8], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const redIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative;">
          <svg width="32" height="42" viewBox="0 0 32 42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 13 16 26 16 26s16-13 16-26C32 7.163 24.837 0 16 0z" fill="#DC2626"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });

    outlets.forEach((outlet) => {
      const marker = L.marker([outlet.lat, outlet.lng], {
        icon: redIcon,
      }).addTo(map);

      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 4px; color: #111; font-size: 14px;">${outlet.name}</h3>
          <p style="font-size: 12px; color: #DC2626; margin-bottom: 6px; font-weight: 600;">[${outlet.id}]</p>
          <p style="font-size: 12px; color: #666; line-height: 1.4; margin: 0;">${outlet.address}</p>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedOutlet(outlet.id);
        setHoveredOutlet(outlet.id);
      });

      marker.on('mouseover', () => setHoveredOutlet(outlet.id));
      marker.on('mouseout', () => {
        if (selectedOutlet !== outlet.id) setHoveredOutlet(null);
      });

      markersRef.current[outlet.id] = marker;
    });
  }, [mapLoaded, outlets, selectedOutlet]);

  const handleOutletHover = (outletId: string) => setHoveredOutlet(outletId);
  const handleOutletLeave = () => {
    if (selectedOutlet) return;
    setHoveredOutlet(null);
  };
  const handleOutletClick = (outlet: Outlet) => {
    setSelectedOutlet(outlet.id);
    setHoveredOutlet(outlet.id);

    const map = mapInstanceRef.current;
    const marker = markersRef.current[outlet.id];

    if (map && marker) {
      map.flyTo([outlet.lat, outlet.lng], 14, { duration: 1.5 });
      setTimeout(() => marker.openPopup(), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-[95rem] px-4 py-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Our Outlets</h1>
          <p className="text-gray-600">Find your nearest store location</p>
        </div>

        <div className="grid h-[700px] gap-6 lg:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedThana} onValueChange={setSelectedThana}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Thana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Thanas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {outlets.map((outlet) => (
                <Card
                  key={outlet.id}
                  className={`mx-2 mt-1 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                    hoveredOutlet === outlet.id || selectedOutlet === outlet.id
                      ? 'scale-[1.02] border-red-500 shadow-lg'
                      : 'border-transparent hover:border-red-300'
                  }`}
                  onMouseEnter={() => handleOutletHover(outlet.id)}
                  onMouseLeave={handleOutletLeave}
                  onClick={() => handleOutletClick(outlet)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-red-100 p-3">
                        <Store className="h-6 w-6 text-red-600" />
                      </div>

                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="text-lg font-bold text-gray-900">
                            {outlet.name}
                            <span className="ml-2 text-sm font-normal text-red-600">
                              [{outlet.id}]
                            </span>
                          </h3>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {outlet.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
            <div
              ref={mapRef}
              className="h-full w-full"
              style={{ minHeight: '100%', zIndex: 0 }}
            />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutletsSection;
