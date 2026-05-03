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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* Impactful Hero Header */}
      <div 
        className="search-header" 
        style={{ 
          background: 'linear-gradient(135deg, #dc3545 0%, #a71d2a 100%)', 
          color: 'white',
          padding: '50px 20px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(220, 53, 69, 0.3)',
          marginBottom: '30px'
        }}
      >
        <h2 style={{ color: 'white', fontSize: '3rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          Find a Blood Donor
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginTop: '10px' }}>
          Every drop counts. Connect with donors near you instantly.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="search-form"
        style={{
          position: 'relative',
          zIndex: 10
        }}
      >
        <div 
          className="search-fields"
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr auto',
            gap: '20px',
            alignItems: 'center'
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '8px' }}>Blood Group</label>
            <select
              name="bloodGroup"
              value={searchData.bloodGroup}
              onChange={handleChange}
              className="form-input"
              style={{ padding: '16px', fontSize: '1.1rem', fontWeight: '500' }}
            >
              <option value="">Any Group</option>
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
          
          <div className="form-group city-input-container" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '8px' }}>City Location</label>
            <div className="city-input-wrapper">
              <input
                type="text"
                name="city"
                placeholder="Enter city name..."
                value={searchData.city}
                onChange={handleChange}
                className="form-input"
                autoComplete="off"
                style={{ padding: '16px', fontSize: '1.1rem', fontWeight: '500' }}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  <div className="suggestion-header">Suggestions</div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ fontSize: '1.1rem', padding: '12px 20px' }}
                    >
                      <span className="suggestion-text">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Subtle correction message instead of bulky box */}
            {correctedCity && originalCity && (
              <div style={{ position: 'absolute', bottom: '-22px', left: '5px', fontSize: '0.85rem', color: '#28a745', fontWeight: '500' }}>
                ✓ Searching for {correctedCity}
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isLoading || !searchData.city}
            className="search-button"
            style={{ 
              padding: '16px 35px', 
              fontSize: '1.1rem',
              height: '100%',
              marginTop: '28px'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Searching
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '40px' }}>
        {message && (
          <div className={`search-message ${donors.length === 0 ? 'message-warning' : 'message-info'}`} style={{ borderRadius: '10px', fontSize: '1.1rem' }}>
            {message}
          </div>
        )}

        <DonorList donors={donors} />
      </div>
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