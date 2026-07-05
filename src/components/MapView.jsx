import React, { useMemo } from 'react';
import { getCityCoordinate } from '../data/cityCoordinates';

export default function MapView({ hotels, onSelectCity }) {
  const cityCounts = useMemo(() => {
    const counts = new Map();
    hotels.forEach((hotel) => {
      counts.set(hotel.location, (counts.get(hotel.location) || 0) + 1);
    });
    return [...counts.entries()].map(([city, count]) => ({
      city,
      count,
      ...getCityCoordinate(city),
    }));
  }, [hotels]);

  const maxCount = Math.max(1, ...cityCounts.map((c) => c.count));

  return (
    <div className="map-wrap">
      <svg className="map-svg" viewBox="0 0 300 400" role="img" aria-label="Map of hotel availability by city">
        <path
          d="M110 20 L170 25 L195 55 L215 70 L240 95 L255 130 L270 170 L260 210 L245 220 L255 250 L235 270 L220 300 L205 330 L190 350 L165 385 L145 390 L130 365 L110 345 L95 320 L100 290 L80 270 L70 240 L65 200 L75 165 L65 130 L80 95 L95 60 Z"
          fill="var(--paper-dim)"
          stroke="var(--line)"
          strokeWidth="1.5"
        />
        {cityCounts.map(({ city, count, x, y }) => {
          const radius = 6 + (count / maxCount) * 12;
          return (
            <g
              key={city}
              className="map-marker"
              transform={`translate(${x}, ${y})`}
              onClick={() => onSelectCity(city)}
              role="button"
              aria-label={`Show ${count} hotels in ${city}`}
            >
              <circle r={radius} opacity="0.85" />
              <text y={-radius - 4} textAnchor="middle">
                {city}
              </text>
              <text className="marker-count" textAnchor="middle" dy="3">
                {count}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="map-hint">Circle size reflects how many hotels are listed in that city. Tap a city to filter.</p>
    </div>
  );
}
