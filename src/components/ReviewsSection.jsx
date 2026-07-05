import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews';

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ReviewsSection({ hotelId }) {
  const { reviews, addReview } = useReviews(hotelId);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    addReview({ name: name.trim(), rating: Number(rating), comment: comment.trim() });
    setName('');
    setComment('');
    setRating(5);
  };

  return (
    <div className="reviews-section">
      <h2 style={{ marginBottom: 12 }}>Guest reviews ({reviews.length})</h2>

      {reviews.length === 0 && (
        <p className="detail-description" style={{ marginBottom: 12 }}>
          No reviews yet. These reviews are stored only in this browser, for demo purposes.
        </p>
      )}

      {reviews.map((review) => (
        <div className="review-card" key={review.id}>
          <div className="review-card-head">
            <span className="review-name">{review.name}</span>
            <span className="review-date">{formatDate(review.date)}</span>
          </div>
          <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
            {'★'.repeat(review.rating)}
            {'☆'.repeat(5 - review.rating)}
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}

      <form className="review-form" onSubmit={submit}>
        <div className="review-form-row">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <select value={rating} onChange={(event) => setRating(event.target.value)}>
            <option value={5}>★★★★★ Excellent</option>
            <option value={4}>★★★★☆ Good</option>
            <option value={3}>★★★☆☆ Okay</option>
            <option value={2}>★★☆☆☆ Poor</option>
            <option value={1}>★☆☆☆☆ Bad</option>
          </select>
        </div>
        <textarea
          placeholder="Share a bit about your stay"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
        />
        <button type="submit" className="review-submit">
          Post review
        </button>
      </form>
    </div>
  );
}
