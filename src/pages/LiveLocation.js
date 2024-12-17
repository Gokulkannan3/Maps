import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();

  const sendLocationToBackend = (latitude, longitude) => {
    fetch(`https://maps-backend-69fc.onrender.com/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send location to backend');
        }
        return response.json();
      })
      .then(() => {
        console.log('Location sent successfully:', { latitude, longitude });
      })
      .catch((error) => {
        console.error('Error sending location to backend:', error);
      });
  };

  const fetchUpdatedLocation = () => {
    fetch(`https://maps-backend-69fc.onrender.com/getlocation`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch location from backend');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched updated location:', data);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  };

  const startTracking = () => {
    if (navigator.geolocation) {
      const id = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
            sendLocationToBackend(latitude, longitude);
          },
          (error) => {
            console.error('Error fetching location:', error);
          }
        );
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

  useEffect(() => {
    const fetchId = setInterval(() => {
      fetchUpdatedLocation();
    }, 1000);

    return () => clearInterval(fetchId);
  }, []);

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
