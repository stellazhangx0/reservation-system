import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Footer from './components/Footer';
import Portrait from './components/Portrait';
import LinkedInPhoto from './components/LinkedInPhoto';
import Yearbook from './components/Yearbook';
import About from './components/About';
import Reservation from './components/Reservation'; 
import BookingForm from './components/BookingForm';
import Success from './components/Success';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard'; 

function App() {
  return (
    <Router>
      <div className="App-container">
        <div className="App">
          <Sidebar />
          <div className="page-content-wrapper">
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio/portrait" element={<Portrait />} />
                <Route path="/portfolio/linkedin-photo" element={<LinkedInPhoto />} />
                <Route path="/portfolio/yearbook" element={<Yearbook />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/reservation/booking/:date/:time" element={<BookingForm />} />
                <Route path="/success" element={<Success />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}


export default App; 
