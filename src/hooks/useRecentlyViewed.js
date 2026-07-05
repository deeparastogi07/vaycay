import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'voyage:recently-viewed';
const MAX_ITEMS = 8;

function readStoredIds() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState(readStoredIds);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore storage failures
    }
  }, [ids]);

  const recordView = useCallback((hotelId) => {
    setIds((prev) => {
      const next = [hotelId, ...prev.filter((id) => id !== hotelId)];
      return next.slice(0, MAX_ITEMS);
    });
  }, []);

  return { recentIds: ids, recordView };
}
