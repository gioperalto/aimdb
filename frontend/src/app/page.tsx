"use client";

// App.js - Main application component
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

// Home Page Component with Search Functionality
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: number; title: string; year: number; rating: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const search = (e: { preventDefault: () => void; }) => {
    // Mock data - replace with actual API response
    const mockResults = [
      { id: 1, title: "The Matrix", year: 1999, rating: 8.7 },
      { id: 2, title: "Inception", year: 2010, rating: 8.8 },
      { id: 3, title: "Interstellar", year: 2014, rating: 8.6 },
      { id: 4, title: "The Dark Knight", year: 2008, rating: 9.0 },
      { id: 5, title: "Pulp Fiction", year: 1994, rating: 8.9 },
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(mockResults);
  };

  // Mock search function - would be replaced with actual API call
  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSearchQuery('');
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleResultClick = (id: any) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center">
      <header className="w-full p-6 flex justify-center">
        <h1 className="text-4xl font-bold "><span className="text-red-400">AI</span><span className="text-blue-400">MDB</span></h1>
      </header>
      
      <main className="w-full max-w-4xl px-4 flex-1 flex flex-col items-center">
        <div className="mt-24 mb-12 w-full max-w-2xl">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={
                  (e) => {
                    setSearchQuery(e.target.value);
                    search(e);
                  }
                }
                placeholder="Search for movies, TV shows, actors..."
                className="w-full px-6 py-4 rounded-full bg-gray-800 border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bg-blue-500 p-2 rounded-full hover:bg-blue-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {isSearching && (
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!isSearching && !searchQuery && searchResults.length > 0 && (
          <div className="w-full">
            <h2 className="text-2xl mb-4 font-semibold">Search Results</h2>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              {searchResults.map((result) => (
                <div 
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium">{result.title}</h3>
                    <p className="text-gray-400">{result.year}</p>
                  </div>
                  <div className="bg-blue-500 px-2 py-1 rounded-md flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {result.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isSearching && searchQuery && (
          <div className="text-center p-8">
            <p className="text-xl text-gray-400">{searchResults.length} results found for "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Detail Page Component
const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<{ id: number; title: string; year: number; rating: number; director: string; description: string } | null>(null);

  React.useEffect(() => {
    // Mock API call to fetch details
    setTimeout(() => {
      // Sample data - would be replaced with actual API response
      const mockData = {
        id: parseInt(id || '0'),
        title: ["The Matrix", "Inception", "Interstellar", "The Dark Knight", "Pulp Fiction"][parseInt(id || '0') - 1],
        year: [1999, 2010, 2014, 2008, 1994][parseInt(id || '0') - 1],
        rating: [8.7, 8.8, 8.6, 9.0, 8.9][parseInt(id || '0') - 1],
        director: ["Wachowski Sisters", "Christopher Nolan", "Christopher Nolan", "Christopher Nolan", "Quentin Tarantino"][parseInt(id || '0') - 1],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Pellentesque id nibh tortor id aliquet lectus proin nibh nisl."
      };
      
      setItem(mockData);
      setLoading(false);
    }, 800);
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="w-full p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-blue-400 cursor-pointer" onClick={() => navigate('/')}>AIMDB</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          Back to Search
        </button>
      </header>
      
      <main className="w-full max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="w-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : item ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{item.title}</h1>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-400 mr-4">{item.year}</span>
                    <div className="bg-blue-500 px-2 py-1 rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {item.rating}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500 hover:bg-blue-400 transition-colors rounded-full p-3 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-gray-700 rounded-lg aspect-w-2 aspect-h-3 overflow-hidden">
                    <div className="w-full h-64 bg-gray-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-2">Details</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-400">Director:</span> {item.director}
                      </div>
                      <div>
                        <span className="text-gray-400">Release Year:</span> {item.year}
                      </div>
                      <div>
                        <span className="text-gray-400">Rating:</span> {item.rating}/10
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">AI-Powered Analysis</h3>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-500 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <span className="text-lg font-medium">AI Recommendation Score: 92%</span>
                      </div>
                      <p className="text-gray-300">Our AI analysis suggests this content aligns with your viewing preferences based on similar thematic elements and directorial style that you've enjoyed in the past.</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex space-x-4">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-400 transition-colors py-3 rounded-lg font-medium flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch Trailer
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 transition-colors py-3 rounded-lg font-medium flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      More Options
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-xl text-gray-400">Item not found</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
