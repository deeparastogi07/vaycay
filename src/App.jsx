import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import HotelDetail from './pages/HotelDetail.jsx';
import Favorites from './pages/Favorites.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels/:hotelId" element={<HotelDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <footer className="footer">
        Built with the Demo Hotels API · Voyage is a student project, not a real booking service.
      </footer>
    </div>
  );
}
