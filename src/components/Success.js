import React from 'react';
import { useLocation } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const location = useLocation();
  const formData = location.state.formData;

  return (
    <div className='success'>
      <h1>Success</h1>
      <p>Your time slot is reserved. Please transfer your deposit in 24 hours to confirm your appointment.</p>
      <div>
        <h2>Your Booking Details</h2>
        <p>Date: {formData.date}</p>
        <p>Time: {formData.time}</p>
        <p>Name: {formData.name}</p>
        <p>Type of Photoshoot: {formData.typeOfPhotoshoot}</p>
        <p>Visa Photo: {formData.visaPhoto ? 'Yes' : 'No'}</p>
        <p>Makeup: {formData.makeup ? 'Yes' : 'No'}</p>
        <p>Contact: {formData.contact}</p>
        <p>Notes: {formData.notes}</p>
      </div>
    </div>
  );
};

export default Success;
