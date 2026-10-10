import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, totalNotes, filteredCount }) => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          id="search-notes-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title or description..."
          className="search-input"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="search-status-tag">
          Showing {filteredCount} of {totalNotes} {totalNotes === 1 ? 'note' : 'notes'}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
