import React, { useState } from 'react';

export default function ShareButton({ title, url }) {
  const [showToast, setShowToast] = useState(false);

  const flashToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to clipboard if the share sheet is dismissed or fails
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flashToast();
    } catch {
      flashToast();
    }
  };

  return (
    <button type="button" className="share-btn" onClick={handleShare}>
      {showToast && <span className="share-toast">Link copied</span>}
      ⤴ Share
    </button>
  );
}
