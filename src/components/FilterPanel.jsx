import React from 'react';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function FilterPanel({ bounds, filters, onChange, onReset }) {
  return (
    <aside className="filter-panel">
      <div className="filter-group">
        <label className="filter-title" htmlFor="maxPrice">
          Max price per night
        </label>
        <input
          id="maxPrice"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={100}
          value={filters.maxPrice}
          onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
        />
        <div className="range-values">
          <span>{currency.format(bounds.min)}</span>
          <span>{currency.format(filters.maxPrice)}</span>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-title">Guest rating</span>
        <div className="rating-options">
          {[0, 3, 4, 4.5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === value}
                onChange={() => onChange({ ...filters, minRating: value })}
              />
              {value === 0 ? 'Any rating' : `${value.toFixed(1)}+ stars`}
            </label>
          ))}
        </div>
      </div>

      <button type="button" className="reset-filters" onClick={onReset}>
        Reset all filters
      </button>
    </aside>
  );
}
