import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLat = localStorage.getItem('latitude');
    const savedLng = localStorage.getItem('longitude');
    if (savedLat && savedLng) {
      setLatitude(savedLat);
      setLongitude(savedLng);
    }
  }, []);

  const sendLocationToBackend = (latitude, longitude) => {
    fetch(`https://maps-backend-oi5f.onrender.com/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response from backend:', data);
        if (data.latitude && data.longitude) {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          localStorage.setItem('latitude', data.latitude);
          localStorage.setItem('longitude', data.longitude);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const startTracking = () => {
    if (navigator.geolocation) {
      const id = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          sendLocationToBackend(latitude, longitude);
        });
      }, 1000);
      setIntervalId(id);
      setIsTracking(true);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const stopTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsTracking(false);
    }
  };

  const handleRedirect = () => {
    navigate('/map');
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
