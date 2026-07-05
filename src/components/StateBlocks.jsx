import React from 'react';

export function LoadingState() {
  return (
    <div className="state-block">
      <div className="spinner" />
      <h3>Boarding your results…</h3>
      <p>Fetching hotels from the API.</p>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="state-block">
      <h3>We couldn't reach the hotel API</h3>
      <p>{message || 'Please check your connection and try again.'}</p>
    </div>
  );
}

export function EmptyState({ onReset }) {
  return (
    <div className="state-block">
      <h3>No hotels match those filters</h3>
      <p>Try widening your price range or clearing a filter.</p>
      {onReset && (
        <button type="button" className="reset-filters" onClick={onReset} style={{ marginTop: 12 }}>
          Clear all filters
        </button>
      )}
    </div>
  );
}
