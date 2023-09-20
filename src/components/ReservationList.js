import React, { useEffect, useState } from 'react';

const ReservationList = ({ adminSecret, reservations, updateReservations, isAdding, setIsAdding }) => {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [newReservation, setNewReservation] = useState({
    date: '',
    time: '',
    name: '',
    typeOfPhotoshoot: '',
    visaPhoto: false,
    makeup: false,
    contact: '',
    notes: '',
  });

  // Delete a reservation
  const deleteReservation = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': adminSecret,
        },
      });

      if (response.ok) {
        // Remove the deleted reservation from the state
        const updatedReservations = reservations.filter((reservation) => reservation._id !== id);
        updateReservations(updatedReservations);
      } else {
        console.error('Failed to delete reservation');
      }
    } catch (error) {
      console.error('There was a problem deleting the reservation:', error);
    }

    
  };

  // Start editing a reservation
  const startEditing = (reservation) => {
    setEditing(reservation._id);
    setFormData(reservation);
  };

  // Update a reservation
  const updateReservation = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify(formData),
      });

      const updatedReservation = await response.json();

      if (response.ok) {
        // Update the reservation in the state
        const updatedReservations = reservations.map((reservation) => 
          (reservation._id === id ? updatedReservation : reservation)
        );
        updateReservations(updatedReservations);
        setEditing(null);
      } else {
        console.error('Failed to update reservation');
      }
    } catch (error) {
      console.error('There was a problem updating the reservation:', error);
    }

    
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(null);
  };

  const addReservation = () => {
    fetch('http://localhost:3001/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify(newReservation),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Server Response:", data); 
      if (data.success) {
        // Update the reservations state to include the new reservation
        const updatedReservations = [...reservations, newReservation];
        updateReservations(updatedReservations);
        // Reset the form
        setNewReservation({
          date: '',
          time: '',
          name: '',
          typeOfPhotoshoot: '',
          visaPhoto: false,
          makeup: false,
          contact: '',
          notes: '',
        });
        setIsAdding(false); // Close the add reservation form
        
        // If you want to automatically refresh the list of reservations here, you can call a function that fetches them again.
      } else {
        console.log('Error from the server:', data.message);
      }
    })
    .catch(error => console.log('Error adding reservation:', error));
  };
  
  


  return (
    <div>
      {isAdding ? (
        <div>
          <h2>Add Reservation</h2>
          {/* Form fields for adding a new reservation */}
          <label>Date: </label>
          <input type="date" value={newReservation.date} onChange={e => setNewReservation({...newReservation, date: e.target.value})} /><br />
          <label>Time: </label>
          <input type="text" value={newReservation.time} onChange={e => setNewReservation({...newReservation, time: e.target.value})} /><br />
          <label>Type of Photoshoot: </label>
          <input type="text" value={newReservation.typeOfPhotoshoot} onChange={e => setNewReservation({...newReservation, typeOfPhotoshoot: e.target.value})} /><br />
          <label>Makeup: </label>
          <input type="checkbox" checked={newReservation.makeup} onChange={e => setNewReservation({...newReservation, makeup: e.target.checked})} /><br />
          <label>Visa Photo: </label>
          <input type="checkbox" checked={newReservation.visaPhoto} onChange={e => setNewReservation({...newReservation, visaPhoto: e.target.checked})} /><br />
          <label>Name: </label>
          <input type="text" value={newReservation.name} onChange={e => setNewReservation({...newReservation, name: e.target.value})} /><br />
          <label>Contact: </label>
          <input type="text" value={newReservation.contact} onChange={e => setNewReservation({...newReservation, contact: e.target.value})} /><br />
          <label>Notes: </label>
          <input type="text" value={newReservation.notes} onChange={e => setNewReservation({...newReservation, notes: e.target.value})} /><br />

          <button onClick={addReservation}>Save</button>
          <button onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <h2>Reserved Time Slots</h2>
          <button onClick={() => setIsAdding(true)}>Add</button>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Name</th>
                <th>Type of Photoshoot</th>
                <th>Makeup</th>
                <th>Visa Photo</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  {editing === reservation._id ? (
                    <>
                      {/* Render input fields for editing */}
                      <td><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></td>
                      <td><input type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} /></td>
                      <td><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></td>
                      <td><input type="text" value={formData.typeOfPhotoshoot} onChange={e => setFormData({...formData, typeOfPhotoshoot: e.target.value})} /></td>
                      <td><input type="checkbox" checked={formData.makeup} onChange={e => setFormData({...formData, makeup: e.target.checked})} /></td>
                      <td><input type="checkbox" checked={formData.visaPhoto} onChange={e => setFormData({...formData, visaPhoto: e.target.checked})} /></td>
                      <td><input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} /></td>
                      <td><input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></td>
                    </>
                  ) : (
                    <>
                      {/* Render reservation data */}
                      <td>{reservation.date}</td>
                      <td>{reservation.time}</td>
                      <td>{reservation.name}</td>
                      <td>{reservation.typeOfPhotoshoot}</td>
                      <td>{reservation.makeup ? 'Yes' : 'No'}</td>
                      <td>{reservation.visaPhoto ? 'Yes' : 'No'}</td>
                      <td>{reservation.contact}</td>
                      <td>{reservation.notes}</td>
                    </>
                  )}
                  <td>
                    {editing === reservation._id ? (
                      <>
                        <button onClick={() => updateReservation(reservation._id)}>Save</button>
                        <button onClick={() => cancelEditing()}>Cancel</button>
                      </>  
                    ) : (
                      <>
                        <button onClick={() => startEditing(reservation)}>Update</button>
                        <button onClick={() => deleteReservation(reservation._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )} 
    </div>
  );
};

export default ReservationList;
