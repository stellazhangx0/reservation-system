import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './BookingForm.css';

const BookingForm = () => {
  const { date, time } = useParams();
  const navigate = useNavigate();
  const [typeOfPhotoshoot, setTypeOfPhotoshoot] = useState('');
  const [makeup, setMakeup] = useState("No");
  const [visaPhoto, setVisaPhoto] = useState("No");
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassportOption, setShowPassportOption] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const visaPhotoBool = visaPhoto === "Yes" ? true : false; 
    const makeupBool = makeup === "Yes" ? true : false;
    console.log({
      typeOfPhotoshoot, 
      makeup: makeup === "Yes" ? true : false, 
      date, 
      time, 
      name, 
      contact, 
      notes, 
      visaPhoto: visaPhoto === "Yes" ? true : false
    });
    // Perform API call to book the slot and save the reservation
    try {
      const response = await fetch(`http://localhost:3001/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeOfPhotoshoot, visaPhoto: visaPhotoBool, makeup: makeupBool, date, time, name, contact, notes })  
      });

      if (response.ok) {
        // Redirect to success page
        navigate('/success', { state: { formData: { typeOfPhotoshoot, visaPhoto: visaPhotoBool, makeup: makeupBool, date, time, name, contact, notes } }});
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during reservation:', error);
    }
  };

  const handleBack = () => {
    navigate('/reservation');
  };

  useEffect(() => {
    if (typeOfPhotoshoot === 'Yearbook' || typeOfPhotoshoot === 'Portrait' || typeOfPhotoshoot === 'LinkedIn Photo') {
      setShowPassportOption(true);
    } else {
      setShowPassportOption(false);
    }
  }, [typeOfPhotoshoot]);

  

  return (
    <div className="booking-container">
      <div className="text-section">
        <strong>Basic Package $100</strong>
        <ul>
          <li>Retouch 1 photo</li>
          <li>1 digital copy</li>
          <li>Print one 6-inch photo, four 2-inch photos/two 3-inch photos</li>
        </ul>
  
        <strong>Four-Grid Combo Package $160</strong>
        <ul>
          <li>Retouch 4 photos</li>
          <li>4 digital copies</li>
          <li>Print four 6-inch photos, one 6-inch 4-grid photo, four 2-inch photos/two 3-inch photos</li>
        </ul>
  
        <strong>Visa Photo $60</strong>
        <ul>
          <li>Retouch 1 photo</li>
          <li>1 digital copy</li>
          <li>Print four 2-inch photos/eight 1-inch photos/or other visa photo sizes as required</li>
          <li>Optional background color: Black/White</li>
        </ul>
  
        <p>Add Visa photo to any other package for $40</p>
        <p>Makeup Service for ID/LinkedIn Headshot $30, American/New Chinese style $50</p>
        <p>Additional Retouched Digital Copy $20 per photo</p>
        <p>Additional Print $5 per copy</p>
  
        <strong>Additional Information</strong>
        <ul>
          <li>Full payment is required when making a reservation.</li>
          <li>Negatives are not provided.</li>
          <li>Please arrive 5 minutes early. Being late will result in not being able to receive the retouched photos on the same day.</li>
          <li>Charges for changes in clothing/style/background color will be based on the second package rate.</li>
          <li>A limited number of props and outfits are available. For the best results, please communicate your clothing and size requirements in advance, or bring your own props and outfits.</li>
          <li>Come with a friend and receive an additional 6-inch print or an instant photo as a bonus.</li>
        </ul>
      </div>
  
      <div className="form-section">
        <h2>Book Slot on {date} at {time}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-item">
            <label>Type of Photoshoot:</label>
            <select 
              value={typeOfPhotoshoot} 
              onChange={(e) => setTypeOfPhotoshoot(e.target.value)} 
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="Portrait">Portrait</option>
              <option value="Yearbook">Yearbook</option>
              <option value="LinkedIn Photo">LinkedIn Photo</option>
              <option value="Visa Photo">Visa Photo</option>
            </select>
            <small>Please choose the type of photo you want. For multiple bookings, reserve another time slot.</small>
          </div>

          {showPassportOption && (
            <div className="form-item">
              <label>Visa Photo:</label>
              <select value={visaPhoto} onChange={(e) => setVisaPhoto(e.target.value)}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          )}

          <div className="form-item">
            <label>Makeup: </label>
            <select value={makeup} onChange={(e) => setMakeup(e.target.value)}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="form-item">
            <label>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-item">
            <label>Contact: </label>
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
          </div>

          <div className="form-item">
            <label>Notes: </label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>


          <div className="button-container">
            <button type="submit" className="submit-button">Make a Reservation</button>
            <button type="button" className="back-button" onClick={handleBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );

  
};

export default BookingForm;
