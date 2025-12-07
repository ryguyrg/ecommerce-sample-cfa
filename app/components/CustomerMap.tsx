'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { CustomerLocation } from '@/types';

interface CustomerMapProps {
  data: CustomerLocation[];
}

export default function CustomerMap({ data }: CustomerMapProps) {
  useEffect(() => {
    // Fix for leaflet icon issue in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Calculate center of USA for initial view
  const center: [number, number] = [39.8283, -98.5795];

  return (
    <div className="card">
      <h3>Customer Locations (Last 90 Days)</h3>
      <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer
          center={center}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.map((location, index) => {
            const radius = Math.min(Math.max(location.orderCount * 2, 5), 30);
            return (
              <CircleMarker
                key={index}
                center={[location.lat, location.lng]}
                radius={radius}
                fillColor="#667eea"
                color="#4c51bf"
                weight={2}
                fillOpacity={0.6}
              >
                <Popup>
                  <div>
                    <strong>{location.city}, {location.state}</strong><br />
                    Orders: {location.orderCount}<br />
                    Revenue: ${location.totalRevenue.toLocaleString()}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
