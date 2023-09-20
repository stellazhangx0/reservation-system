import React, { useEffect, useState } from 'react';

const AvailabilityList = ({ adminSecret, isAddingAvailability, setIsAddingAvailability,updateParentAvailability }) => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [newAvailability, setNewAvailability] = useState({
    date: '',
    slots: [],
  });

  const addAvailability = async () => {
    fetch('http://localhost:3001/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify(newAvailability),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const updatedAvailableTimes = [...availableTimes, newAvailability];
        updatedAvailableTimes.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAvailableTimes(updatedAvailableTimes);
        updateParentAvailability(updatedAvailableTimes);
        setNewAvailability({ date: '', slots: [] });
        setIsAddingAvailability(false);
      } else {
        console.error('Error from the server:', data.message);
      }
    })
    .catch(err => console.error('Error:', err));
  };

  // Fetch all available times
  useEffect(() => {
    fetch('http://localhost:3001/api/availability', {
      headers: {
        'x-admin-secret': adminSecret,
      }
    })
    .then(res => res.json())
    .then(data => setAvailableTimes(data))
    .catch(err => console.error(err));
  }, [adminSecret]);

  // Delete an available time
  const deleteAvailability = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/availability/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': adminSecret,
        },
      });

      if (response.ok) {
        const newAvailableTimes = availableTimes.filter(time => time._id !== id);
        setAvailableTimes(newAvailableTimes);
        updateParentAvailability(newAvailableTimes); 
      } else {
        console.error('Failed to delete availability');
      }
    } catch (error) {
      console.error('There was a problem deleting the availability:', error);
    }
  };

  // Start editing an available time
  const startEditing = (time) => {
    setEditing(time._id);
    setFormData(time);
  };

  // Update an available time
  const updateAvailability = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/availability/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify(formData),
      });

      const updatedTime = await response.json();

      if (response.ok) {
        const newAvailableTimes = availableTimes.map(time => (time._id === id ? updatedTime : time));
        newAvailableTimes.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAvailableTimes(newAvailableTimes);
        updateParentAvailability(newAvailableTimes);  
        setEditing(null);
      } else {
        console.error('Failed to update availability');
      }
    } catch (error) {
      console.error('There was a problem updating the availability:', error);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(null);
  };

  return (
    <div>
      <h2>Available Time Slots</h2>
      {isAddingAvailability ? (
        <div>
          <h3>Add New Availability</h3>
          <input type="date" value={newAvailability.date} onChange={e => setNewAvailability({ ...newAvailability, date: e.target.value })} />
          <input type="text" placeholder="Enter slots separated by commas" value={newAvailability.slots.join(', ')} onChange={e => setNewAvailability({ ...newAvailability, slots: e.target.value.split(', ') })} />
          <button onClick={addAvailability}>Save</button>
          <button onClick={() => setIsAddingAvailability(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsAddingAvailability(true)}>Add</button>
      )}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Slots</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {availableTimes.map(dateRecord => (
            <tr key={dateRecord._id}>
              {editing === dateRecord._id ? (
                <>
                  <td><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></td>
                  <td>
                    <input type="text" value={formData.slots.join(', ')} onChange={e => setFormData({...formData, slots: e.target.value.split(', ')})} />
                  </td>
                </>
              ) : (
                <>
                  <td>{dateRecord.date}</td>
                  <td>{dateRecord.slots.join(', ')}</td>
                </>
              )}
              <td>
                {editing === dateRecord._id ? (
                  <>
                    <button onClick={() => updateAvailability(dateRecord._id)}>Save</button>
                    <button onClick={() => cancelEditing()}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(dateRecord)}>Update</button>
                    <button onClick={() => deleteAvailability(dateRecord._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityList;