import React, { useState, useEffect } from 'react';
import { donorService } from '../services/api';
import { indianCities, findSimilarCities, autoCorrectCity } from '../utils/cityData';
import DonorList from './DonorList';

const Search = () => {
  const [searchData, setSearchData] = useState({
    bloodGroup: '',
    city: ''
  });
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [correctedCity, setCorrectedCity] = useState('');
  const [originalCity, setOriginalCity] = useState('');

  useEffect(() => {
    if (searchData.city.length > 1) {
      const similarCities = findSimilarCities(searchData.city);
      setSuggestions(similarCities);
      setShowSuggestions(similarCities.length > 0);
      
      // Auto-correct for minor spelling mistakes
      if (similarCities.length > 0 && searchData.city.length > 2) {
        const corrected = autoCorrectCity(searchData.city);
        if (corrected !== searchData.city) {
          setCorrectedCity(corrected);
          setOriginalCity(searchData.city);
        } else {
          setCorrectedCity('');
          setOriginalCity('');
        }
      } else {
        setCorrectedCity('');
        setOriginalCity('');
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setCorrectedCity('');
      setOriginalCity('');
    }
  }, [searchData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });

    // Auto-search when city has at least 3 characters
    if (name === 'city' && value.length >= 3) {
      debouncedSearch(value, searchData.bloodGroup);
    }
  };

  const debouncedSearch = React.useMemo(
    () => debounce(async (city, bloodGroup) => {
      if (!city) return;
      
      setIsLoading(true);
      try {
        const corrected = autoCorrectCity(city) || city;
        const results = await donorService.search({
          bloodGroup,
          city: corrected
        });
        
        setDonors(results);
        
        if (results.length === 0) {
          setMessage(`No donors found in ${corrected}. Try a different city.`);
        } else if (corrected !== city) {
          setMessage(`Showing results for "${corrected}" (you entered "${city}")`);
        } else {
          setMessage(`Found ${results.length} donor(s) in ${corrected}`);
        }
      } catch (error) {
        setMessage('Search failed. Please try again.');
        setDonors([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSuggestionClick = (suggestion) => {
    setSearchData({
      ...searchData,
      city: suggestion
    });
    setShowSuggestions(false);
    setCorrectedCity('');
    setOriginalCity('');
    
    // Trigger search immediately when suggestion is clicked
    handleSearchClick(suggestion);
  };

  const handleSearchClick = async (city = searchData.city) => {
    if (!city || city.length < 2) {
      setMessage('Please enter at least 2 characters for city name');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setShowSuggestions(false);
    
    try {
      const corrected = autoCorrectCity(city) || city;
      const results = await donorService.search({
        bloodGroup: searchData.bloodGroup,
        city: corrected
      });
      
      setDonors(results);
      
      if (results.length === 0) {
        setMessage(`No donors found in ${corrected}. Try a different city.`);
      } else if (corrected !== city) {
        setMessage(`Showing results for "${corrected}" (you entered "${city}")`);
      } else {
        setMessage(`Found ${results.length} donor(s) in ${corrected}`);
      }
    } catch (error) {
      setMessage(error.message || 'Search failed');
      setDonors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchClick();
  };

  const handleUseCorrectedCity = () => {
    setSearchData(prev => ({ ...prev, city: correctedCity }));
    setCorrectedCity('');
    setOriginalCity('');
    handleSearchClick(correctedCity);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div className="search-header">
        <h2>Find Blood Donors</h2>
        <p>Search for donors by blood group and city - Spelling mistakes are automatically corrected!</p>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-fields">
          <div className="form-group">
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              value={searchData.bloodGroup}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          <div className="form-group city-input-container">
            <label>City (type at least 3 characters)</label>
            <div className="city-input-wrapper">
              <input
                type="text"
                name="city"
                placeholder="Start typing city name..."
                value={searchData.city}
                onChange={handleChange}
                className="form-input"
                autoComplete="off"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  <div className="suggestion-header">Did you mean:</div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-text">{suggestion}</span>
                      <span className="suggestion-hint">Click to search</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {correctedCity && originalCity && (
              <div className="correction-suggestion">
                <span>Showing results for: </span>
                <strong>{correctedCity}</strong>
                <span> (you entered "{originalCity}")</span>
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isLoading || !searchData.city}
            className="search-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              'Search Now'
            )}
          </button>
        </div>
        
        <div className="search-tip">
          <p>💡 <strong>Tip:</strong> You can type "mumbi", "delhi", "banglor", "hydrabad" - we'll correct it automatically!</p>
        </div>
      </form>

      {message && (
        <div className={`search-message ${donors.length === 0 ? 'message-warning' : 'message-info'}`}>
          {message}
        </div>
      )}

      <DonorList donors={donors} />
    </div>
  );
};

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Search;