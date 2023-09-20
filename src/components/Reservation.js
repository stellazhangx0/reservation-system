import React, { useEffect, useState } from 'react';
import './Reservation.css';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};  

const Reservation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState({});

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/availability?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`);
        const data = await response.json();
        // console.log("Fetched data:", data); // Debug line

        const newAvailableTimes = {};
        data.forEach((entry) => {
          if (entry.date && entry.slots.length > 0) {
            newAvailableTimes[entry.date] = entry.slots;
          } else if (entry.date) {
            newAvailableTimes[entry.date] = ["Unavailable"];
          }
        });

        setAvailableTimes(newAvailableTimes);
      } catch (error) {
        console.error('Error fetching available times:', error);
      }
    };
    
    fetchAvailability();
  }, [currentDate]);

  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const navigate = useNavigate();

  const bookSlot = (date, time) => {
    navigate(`/reservation/booking/${date}/${time}`);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const daysInPrevMonth = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];
    const today = new Date();
  
    today.setHours(0, 0, 0, 0);
  
    for (let i = daysInPrevMonth - startDay + 1; i <= daysInPrevMonth; i++) {
      days.push(
        <div className="calendar-day empty" key={`prev-${i}`}>
          {i}
        </div>
      );
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      dayDate.setHours(0, 0, 0, 0);
  
      const isToday = today.getDate() === i && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
  
      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
  
      let times;
      if (dayDate < today) {
        times = ["Past"];
      } else {
        times = availableTimes[dateKey] || ["Unavailable"];
      }
  
      days.push(
        <div className={`calendar-day ${isToday ? 'today' : ''} ${dayDate < today ? 'past' : ''}`} key={`day-${i}`}>
            <div className="day-header">{i}</div>
            <div className="day-content">
                <div className="available-times">
                    {times.map((time, index) => (
                        <div
                          key={index}
                          className={time !== "Unavailable" && time !== "Past" ? 'clickable-time' : 'non-clickable-time'}
                          onClick={() => {
                            if (time !== "Unavailable" && time !== "Past") {
                              bookSlot(dateKey, time);
                            }
                          }}
                        >
                          {time}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
      

    }

    const nextDays = 35 - days.length;
    for (let i = 1; i <= nextDays; i++) {
      days.push(
        <div className="calendar-day empty" key={`next-${i}`}>
          {i}
        </div>
      );
    }
  
    return days;
  };
  

  return (
    <div className="reservation-container">
        <div className='calendar-container'>
            <div className="calendar-header">
                <button onClick={goToPreviousMonth} style={{ marginRight: '10px',  border: 'none', background: 'none', fontSize: '16px', cursor: 'pointer'}}>{"<"}</button>
                <span>{`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</span>
                <button onClick={goToNextMonth} style={{ marginLeft: '10px',  border: 'none', background: 'none', fontSize: '16px', cursor: 'pointer'}}>{">"}</button>
            </div>

            <div className="day-names">
                {daysOfWeek.map((day) => (
                    <div className="day-name" key={day}>{day}</div>
                ))}
            </div>

            <div className="calendar">
                {renderDays()}
            </div>
        </div>
    </div>
);
};

export default Reservation;
