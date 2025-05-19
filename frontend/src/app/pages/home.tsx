"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Home Page Component with Search Functionality
const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCount, setSearchCount] = useState(0);
    const [searchResults, setSearchResults] = useState<{ _id: number; title: string; year: number; rating: number }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timerId = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:5000/api';
  
    const search = async (e: { preventDefault: () => void; }) => {
      setIsSearching(true);
      clearTimeout(timerId.current as ReturnType<typeof setTimeout>);

      timerId.current = setTimeout(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/movies/count`, {
            params: { title: searchQuery }
          });
          
          if (response.data.status === 'success') {
            setSearchCount(response.data.count);
          } else {
            setError('Failed to fetch movie count');
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.message || 'An error occurred while fetching movie count');
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setIsSearching(false);
        }
      }, 300); // Adjust the delay as needed (e.g., 300ms)
    };
  
    const handleSearch = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();

      setIsSearching(true);
      console.log(searchQuery);
      
      // Simulate API call with timeout
      // setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/movies/search`, {
          params: { title: searchQuery }
        });
        
        if (response.data.status === 'success') {
          setSearchResults(response.data.movies);
        } else {
          setError('Failed to fetch movies');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message || 'An error occurred while fetching movies');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsSearching(false);
      }

      setSearchQuery('');
      // }, 800);
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
                  className="absolute right-2 top-2 bg-blue-500 p-2 rounded-full hover:bg-blue-400 transition-colors cursor-pointer"
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
                    key={result._id}
                    onClick={() => handleResultClick(result._id)}
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
          
          {!isSearching && searchQuery && searchQuery.length >= 2 && (
            <div className="text-center p-8">
              <p className="text-xl text-gray-400">{searchCount} results found for "{searchQuery}"</p>
            </div>
          )}
        </main>
      </div>
    );
  };

  export default HomePage;