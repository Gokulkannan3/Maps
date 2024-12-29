import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import './LiveLocation.css';
import busimage from '../images/bus57.png';

const customIcon = new L.Icon({
  iconUrl: busimage,
  iconSize: [35, 35],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

const Map = () => {
  const [position, setPosition] = useState([13.0418, 80.2049]);

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
    const intervalId = setInterval(fetchLocation, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className='heading'>BUS 57 LIVE LOCATION</h1>
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
    </div>
  );
};

export default Map;
