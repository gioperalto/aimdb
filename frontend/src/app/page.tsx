"use client";

// App.js - Main application component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('./pages/home'), { ssr: false });
const DetailsPage = dynamic(() => import('./pages/details'), { ssr: false });

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
