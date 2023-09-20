import React, { useState, useEffect } from 'react';
import ReservationList from './ReservationList';
import AvailabilityList from './AvailabilityList';

const Dashboard = () => {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingAvailability, setIsAddingAvailability] = useState(false);

  const fetchData = async () => {
    try {
      const res1 = await fetch('http://localhost:3001/api/reservations', {
        headers: {
          'x-admin-secret': adminSecret,
        },
      });
      const data1 = await res1.json();
      // Assuming reservations also have a date field to sort by
      const sortedReservations = data1.sort((a, b) => a.date.localeCompare(b.date));
      setReservations(sortedReservations);

      const res2 = await fetch('http://localhost:3001/api/availability', {
        headers: {
          'x-admin-secret': adminSecret,
        },
      });
      const data2 = await res2.json();
      const sortedAvailability = data2.sort((a, b) => a.date.localeCompare(b.date));
      // Sort the slots within each date
      sortedAvailability.forEach(item => {
        item.slots.sort((a, b) => a.localeCompare(b));
      });
      setAvailability(sortedAvailability);
      
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Refresh data function
  const refreshData = () => {
    if (isAuthenticated && adminSecret) {
      fetchData();
    }
  };

  useEffect(() => {
    refreshData();
  }, [adminSecret, isAuthenticated]);


  const checkAuthentication = () => {
    fetch('http://localhost:3001/admin', {
      headers: {
        'x-admin-secret': adminSecret,
      },
    })
    .then(response => {
      console.log('Raw response:', response);  // log the raw response
      if(response.status === 403) {
        alert('Forbidden: Incorrect Admin Secret');
        setIsAuthenticated(false);
        return null; // Returning null so that the next .then() block won't execute
      } else if(response.status === 200 && response.headers.get('Content-Type').includes('application/json')) {
        setIsAuthenticated(true);
        return response.json();  // Assuming your /admin API returns JSON
      } else {
        // Handle other status codes and content types as necessary
        console.log(`Received unexpected status code ${response.status} or content type ${response.headers.get('Content-Type')}`);
        return null;
      }
    })
    .then(data => {
      if(data) {
        // Handle the fetched data here
        console.log(data);
      }
    })
    .catch(error => console.log('Error:', error));
  };
  

  const updateReservations = (updatedReservations) => {
    setReservations(updatedReservations);
  };

  const updateAvailability = (updatedAvailability) => {
    setAvailability(updatedAvailability);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <h1>Admin Login</h1>
          <input
            type="password"
            placeholder="Enter Admin Secret"
            value={adminSecret}
            onChange={e => setAdminSecret(e.target.value)}
          />
          <button onClick={checkAuthentication}>Authenticate</button>
        </div>
      ) : (
        <div>
          <h1>Admin Dashboard</h1>
          <button onClick={refreshData}>Refresh</button>
          <ReservationList 
            adminSecret={adminSecret} 
            reservations={reservations}
            updateReservations={updateReservations}
            isAdding={isAdding} 
            setIsAdding={setIsAdding} 
          />
          <AvailabilityList 
            adminSecret={adminSecret} 
            availability={availability}
            updateParentAvailability={updateAvailability}
            setAvailability={setAvailability}
            isAddingAvailability={isAddingAvailability}
            setIsAddingAvailability={setIsAddingAvailability}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
