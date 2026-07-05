import React from 'react';

export default function RatingStamp({ rating }) {
  return (
    <span className="rating-stamp" title={`${rating.toFixed(1)} out of 5`}>
      ★ {rating.toFixed(1)}
    </span>
  );
}
