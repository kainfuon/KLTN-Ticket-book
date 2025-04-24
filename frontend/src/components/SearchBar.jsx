import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const SearchBar = ({ onSearch, onFilter, totalEvents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'Âm nhạc', name: 'Âm nhạc' },
    { id: 'Kịch', name: 'Kịch' },
    { id: 'Workshop', name: 'Workshop' },
    { id: 'Triển lãm', name: 'Triển lãm' },
    { id: 'Thể thao', name: 'Thể thao' },
    { id: 'Dịch vụ', name: 'Dịch vụ' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const newSearches = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        return newSearches;
      });
      // Call onSearch with just the search term
      onSearch(searchTerm.trim());
      setIsSearchFocused(false);
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchTerm(search);
    // Call onSearch with just the search term
    onSearch(search);
    setIsSearchFocused(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsFilterOpen(false);
    onFilter(categoryId);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Find Your Event
        </h1>
        <span className="text-gray-600">
          {totalEvents} {totalEvents === 1 ? 'Event' : 'Events'} Available
        </span>
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          {/* Search Input Container */}
          <div ref={searchRef} className="flex-1">
            <div className={`flex items-center bg-gray-50 rounded-full transition-all ${
              isSearchFocused ? 'border border-gray-500' : 'border border-gray-200'
            }`}>
              <div className="pl-4">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search events..."
                className="w-full py-2.5 px-4 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500"
                aria-label="Search events"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    onSearch('');
                  }}
                  className="pr-4 hover:text-gray-700 text-gray-400"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-[56px] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                {/* Recent Searches */}
                {recentSearches.length > 0 && !searchTerm && (
                  <div className="p-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500 px-3 py-1">Recent Searches</div>
                      <button
                        type="button"
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('recentSearches');
                        }}
                        className="text-xs text-blue-500 hover:text-blue-700 px-3 py-1"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 flex items-center"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          <FaSearch className="h-4 w-4 text-gray-400 mr-2" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Suggestions */}
                {searchTerm && (
                  <div className="border-t">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-3 py-1">
                        Suggestions
                      </div>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 flex items-center"
                        onClick={handleSubmit}
                      >
                        <FaSearch className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="flex-1">Search for "{searchTerm}"</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-full px-4 rounded-full border ${
                selectedCategory 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              } hover:bg-gray-100 flex items-center gap-2 min-w-[120px] justify-center`}
            >
              <FaFilter className="h-4 w-4" />
              <span className="hidden sm:inline">
                {selectedCategory 
                  ? categories.find(cat => cat.id === selectedCategory)?.name 
                  : 'Category'}
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
