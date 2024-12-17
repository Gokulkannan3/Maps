import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLat = localStorage.getItem('latitude');
    const savedLng = localStorage.getItem('longitude');
    if (savedLat && savedLng) {
      setLatitude(savedLat);
      setLongitude(savedLng);
    }
  }, []);

  const startTracking = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        
        // Store latitude and longitude in localStorage
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('longitude', longitude);
      });
      setWatchId(id);
      setIsTracking(true);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  const handleRedirect = () => {
    navigate('/map');  // Directly navigate to the map page
  };

  return (
    <div>
      <h1>Live Location</h1>
      <div>
        {!isTracking ? (
          <button onClick={startTracking}>Start Tracking</button>
        ) : (
          <button onClick={stopTracking}>Stop Tracking</button>
        )}
      </div>
      <div>
        {latitude && longitude ? (
          <div>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
          </div>
        ) : (
          <p>No location data available</p>
        )}
      </div>
      <button onClick={handleRedirect}>Go to Map</button>
    </div>
  );
};

export default LiveLocation;
