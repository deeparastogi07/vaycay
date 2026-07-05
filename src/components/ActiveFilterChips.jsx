import React from 'react';

export default function ActiveFilterChips({ filters, defaultMaxPrice, onChange, onClearAll }) {
  const chips = [];

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `“${filters.search}”`,
      onRemove: () => onChange({ ...filters, search: '' }),
    });
  }
  if (filters.location) {
    chips.push({
      key: 'location',
      label: filters.location,
      onRemove: () => onChange({ ...filters, location: '' }),
    });
  }
  if (filters.minRating > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating.toFixed(1)}+ stars`,
      onRemove: () => onChange({ ...filters, minRating: 0 }),
    });
  }
  if (filters.maxPrice < defaultMaxPrice) {
    chips.push({
      key: 'price',
      label: `Under ₹${filters.maxPrice.toLocaleString('en-IN')}`,
      onRemove: () => onChange({ ...filters, maxPrice: defaultMaxPrice }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="chip-row">
      {chips.map((chip) => (
        <span className="chip" key={chip.key}>
          {chip.label}
          <button type="button" onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
            ✕
          </button>
        </span>
      ))}
      <button type="button" className="chip-clear" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
}
