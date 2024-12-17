import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import './LiveLocation.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

const Map = () => {
  const [position, setPosition] = useState([13.0843, 80.2705]);

  useEffect(() => {
    const fetchLocation = () => {
      fetch('https://maps-backend-69fc.onrender.com/getlocation/')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch location');
          }
          return response.json();
        })
        .then((data) => {
          if (data.latitude && data.longitude) {
            const newPosition = [parseFloat(data.latitude), parseFloat(data.longitude)];
            setPosition(newPosition);
          }
        })
        .catch((error) => {
          console.error('Error fetching location:', error);
        });
    };

    fetchLocation();
    const intervalId = setInterval(fetchLocation, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="map-wrapper">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="leaflet-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Latitude: {position[0]} <br /> Longitude: {position[1]}
          </Popup>
        </Marker>
      </MapContainer>
      <div className="location-info">
        <p>Latitude: {position[0]}</p>
        <p>Longitude: {position[1]}</p>
      </div>
    </div>
  );
};

export default Map;
