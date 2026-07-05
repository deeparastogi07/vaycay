import React, { useState } from 'react';

export default function SearchBar({ locations, filters, onChange }) {
  const [keyword, setKeyword] = useState(filters.search);

  const submit = (event) => {
    event.preventDefault();
    onChange({ ...filters, search: keyword.trim() });
  };

  return (
    <form className="search-panel" onSubmit={submit}>
      <div className="search-field">
        <label className="search-label" htmlFor="keyword">
          Hotel or vibe
        </label>
        <input
          id="keyword"
          type="text"
          placeholder="Try “rooftop pool” or “Hotel Regal”"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>

      <div className="search-field">
        <label className="search-label" htmlFor="destination">
          Destination
        </label>
        <select
          id="destination"
          value={filters.location}
          onChange={(event) => onChange({ ...filters, location: event.target.value })}
        >
          <option value="">All cities</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label className="search-label" htmlFor="minRating">
          Minimum rating
        </label>
        <select
          id="minRating"
          value={filters.minRating}
          onChange={(event) => onChange({ ...filters, minRating: Number(event.target.value) })}
        >
          <option value={0}>Any rating</option>
          <option value={3}>3.0+</option>
          <option value={4}>4.0+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </div>

      <div className="search-field">
        <label className="search-label" htmlFor="sortBy">
          Sort by
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(event) => onChange({ ...filters, sortBy: event.target.value })}
        >
          <option value="recommended">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Rating: highest first</option>
        </select>
      </div>

      <button type="submit" className="search-submit">
        Search
      </button>
    </form>
  );
}
