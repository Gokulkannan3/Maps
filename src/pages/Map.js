import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import './LiveLocation.css'; // Assuming the required CSS file

// Custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

const Map = () => {
  const [position, setPosition] = useState([localStorage.getItem('latitude'), localStorage.getItem('longitude')]);

  useEffect(() => {
    const savedLat = localStorage.getItem('latitude');
    const savedLng = localStorage.getItem('longitude');
    console.log(savedLat, savedLng);

    if (savedLat && savedLng) {
      setPosition([parseFloat(savedLat), parseFloat(savedLng)]);
    }
  }, []);

  return (
    <div className="map-wrapper">
      <div className="App">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="leaflet-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={customIcon}>
            <Popup>
              Latitude: {position[0]} <br /> Longitude: {position[1]}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
