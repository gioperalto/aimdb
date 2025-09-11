import './App.css'

// App.js - Main application component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import DetailsPage from './pages/Detail';

// Main App Component
const App = () => {
  // const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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