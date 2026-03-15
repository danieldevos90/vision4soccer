import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';

// Fix for default marker icons in react-leaflet (webpack/vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Custom marker icon matching previous Google Maps styling:
 * Green circle (#33A27B) with white border
 */
const createCustomIcon = () =>
  L.divIcon({
    className: styles.customMarker,
    html: `<div class="${styles.markerCircle}"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

// Coordinates for Scorpius 161, 2132 LR Hoofddorp, Nederland
const COORDINATES = [52.3000, 4.6500];

/**
 * Map Component using OpenStreetMap (Leaflet)
 * Esri World Gray Canvas - light minimal style, no overlay banners
 */
export const Map = () => {
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={COORDINATES}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={true}
        className={styles.leafletMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={COORDINATES} icon={createCustomIcon()}>
          <Popup>Scorpius 161<br />2132 LR Hoofddorp<br />Nederland</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
