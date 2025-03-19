// "use client";

// App.js - Main application component
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

// Detail Page Component
const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorited, setFavorited] = useState<boolean>(false);
    const [starred, setStarred] = useState<boolean>(false);
    const [item, setItem] = useState< any | null>(null);
    const API_BASE_URL = 'http://localhost:5000/api';

    const visitWebsite = () => {
      window.open(item.tomatoes.website, '_blank', 'noopener,noreferrer');
    };

    const toggleFavorited = () => {
      setFavorited(!favorited);
    }

    const toggleStarred = () => {
      setStarred(!starred);
    }

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
                
                if (response.data.status === 'success') {
                    console.log(response.data.movie);
                    setItem(response.data.movie);
                } else {
                    setError('Failed to fetch movie');
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.message || 'An error occurred while fetching movie');
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <header className="w-full p-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-400 cursor-pointer" onClick={() => navigate('/')}><span className="text-red-400">AI</span><span className="text-blue-400">MDB</span></h1>
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
                      <div className="bg-blue-500 px-2 py-1 rounded-md flex items-center cursor-pointer" onClick={toggleStarred}>
                        { starred ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                        {item.rating}
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-500 hover:bg-blue-400 transition-colors rounded-full p-3 cursor-pointer" onClick={toggleFavorited}>
                    { favorited ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-gray-700 rounded-lg aspect-w-2 aspect-h-3 overflow-hidden">
                      <div className="w-full h-64 bg-gray-600 flex items-center justify-center">
                        <img className="w-auto max-h-full" src={item.poster} alt="image description" />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-2">Details</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-400">Director(s):</span> {item.directors.join(', ')}
                        </div>
                        <div>
                          <span className="text-gray-400">Release Year:</span> {item.year}
                        </div>
                        <div>
                          <span className="text-gray-400">Rating:</span> {item.imdb.rating}/10
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">Overview</h3>
                    <p className="text-gray-300 leading-relaxed">{item.plot}</p>
                    
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
                      <button 
                        className="flex-1 bg-blue-500 hover:bg-blue-400 transition-colors py-3 rounded-lg font-medium flex items-center justify-center cursor-pointer"
                        onClick={visitWebsite}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" stroke-width={2} d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        Visit Website
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

  export default DetailPage;