import { useEffect, useState } from 'react';

function storageKey(hotelId) {
  return `voyage:reviews:${hotelId}`;
}

function readReviews(hotelId) {
  try {
    const stored = window.localStorage.getItem(storageKey(hotelId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useReviews(hotelId) {
  const [reviews, setReviews] = useState(() => readReviews(hotelId));

  useEffect(() => {
    setReviews(readReviews(hotelId));
  }, [hotelId]);

  const addReview = (review) => {
    setReviews((prev) => {
      const next = [
        { ...review, id: `${Date.now()}`, date: new Date().toISOString() },
        ...prev,
      ];
      try {
        window.localStorage.setItem(storageKey(hotelId), JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  };

  return { reviews, addReview };
}
