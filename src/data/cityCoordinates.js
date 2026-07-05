// Approximate, illustrative positions on a stylized (not geographically precise)
// outline of India, in a 300x400 viewBox. Used only for the map view visualization.
export const CITY_COORDINATES = {
  Delhi: { x: 168, y: 108 },
  Noida: { x: 178, y: 114 },
  Gurgaon: { x: 160, y: 116 },
  Chandigarh: { x: 158, y: 78 },
  Lucknow: { x: 205, y: 138 },
  Jaipur: { x: 135, y: 140 },
  Ahmedabad: { x: 95, y: 205 },
  Surat: { x: 92, y: 225 },
  Mumbai: { x: 100, y: 250 },
  Pune: { x: 112, y: 272 },
  Goa: { x: 95, y: 305 },
  Hyderabad: { x: 155, y: 285 },
  Bengaluru: { x: 138, y: 335 },
  Chennai: { x: 175, y: 345 },
  Kochi: { x: 130, y: 375 },
  Kolkata: { x: 250, y: 215 },
};

export const DEFAULT_COORDINATE = { x: 150, y: 250 };

export function getCityCoordinate(city) {
  return CITY_COORDINATES[city] || DEFAULT_COORDINATE;
}
