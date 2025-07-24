import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserRequest = () => {
  const [ticketId, setTicketId] = useState(null);
  const [status, setStatus] = useState('Not requested');
  const [predictedGate, setPredictedGate] = useState(null);

  const requestCar = async () => {
    try {
      const res = await axios.post('https://valet-x-backend.onrender.com/api/valet/request', {
        userId: 'user123',
        carDetails: 'Black Tesla Model 3',
      });
      setTicketId(res.data.ticketId);
      setStatus('Car requested. Tracking movement...');
    } catch (err) {
      console.error('Error requesting car:', err);
    }
  };

  useEffect(() => {
    if (!ticketId) return;

    const interval = setInterval(async () => {
      const simulatedSensorData = {
        ble: { A: Math.random() * 30, B: Math.random() * 30, C: 95, D: Math.random() * 30 },
        vector: { A: 0, B: 0, C: 90, D: 0 },
        dwell: { A: 0, B: 0, C: 80, D: 0 },
      };

      try {
        const res = await axios.post('https://valet-x-backend.onrender.com/api/valet/update', {
          ticketId,
          sensors: simulatedSensorData,
        });

        setPredictedGate(res.data.predictedGate);
        setStatus(res.data.status);
      } catch (err) {
        console.error('Sensor update failed:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ticketId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🚘 Intelligent Valet Request</h2>

      <button
        onClick={requestCar}
        disabled={ticketId}
        style={{
          ...styles.button,
          backgroundColor: ticketId ? '#ccc' : '#007BFF',
          cursor: ticketId ? 'not-allowed' : 'pointer',
        }}
      >
        Request My Car
      </button>

      <div style={styles.infoBox}>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Predicted Gate:</strong> {predictedGate || '---'}</p>
        <p><strong>Ticket ID:</strong> {ticketId || '---'}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  button: {
    padding: '12px 20px',
    fontSize: '1rem',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    width: '100%',
    transition: '0.3s',
  },
  infoBox: {
    marginTop: '25px',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
};

export default UserRequest;
