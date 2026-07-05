const BASE_URL = 'https://demohotelsapi.pythonanywhere.com';

/** Cities supported by the Demo Hotels API (from API playground). */
export const API_CITIES = [
  'Ahmedabad',
  'Bengaluru',
  'Chennai',
  'Delhi',
  'Goa',
  'Gurgaon',
  'Hyderabad',
  'Jaipur',
  'Kolkata',
  'Mumbai',
  'Noida',
  'Pune',
];

const SORT_TO_ORDER_BY = {
  recommended: undefined,
  'price-asc': 'price',
  'price-desc': '-price',
  'rating-desc': '-rating',
};

/**
 * Normalizes a raw hotel object from the API (string price → number, etc.).
 */
export function normalizeHotel(hotel) {
  if (!hotel) return null;
  return {
    ...hotel,
    price: Number(hotel.price),
    rating: Number(hotel.rating),
    photos: Array.isArray(hotel.photos) ? hotel.photos : [],
  };
}

function buildQuery(params) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`Hotel API responded with status ${response.status}`);
  }
  return response.json();
}

/**
 * Search hotels using the Demo Hotels API query parameters.
 * @see https://demohotelsapi.pythonanywhere.com/
 */
export async function searchHotels({
  search = '',
  location = '',
  minPrice,
  maxPrice,
  minRating = 0,
  maxRating,
  sortBy = 'recommended',
  limit,
  skip,
} = {}) {
  const query = buildQuery({
    search: search.trim() || undefined,
    location: location || undefined,
    min_price: minPrice,
    max_price: maxPrice,
    min_rating: minRating > 0 ? minRating : undefined,
    max_rating: maxRating,
    order_by: SORT_TO_ORDER_BY[sortBy],
    limit,
    skip,
  });

  const payload = await parseResponse(await fetch(`${BASE_URL}/hotels/${query}`));
  const rawHotels = Array.isArray(payload?.data) ? payload.data : [];

  return {
    hotels: rawHotels.map(normalizeHotel),
    count: payload.count ?? rawHotels.length,
    returned: payload.returned ?? rawHotels.length,
    message: payload.message,
  };
}

/**
 * Fetches a single hotel by ID.
 * GET /hotels/:id/
 */
export async function fetchHotelById(id) {
  const payload = await parseResponse(await fetch(`${BASE_URL}/hotels/${id}/`));
  return normalizeHotel(payload?.data);
}

/**
 * Fetches the full hotel catalog (all 500 hotels).
 * Used for favorites, map markers, and location lists.
 */
export async function fetchAllHotels() {
  const result = await searchHotels();
  return result.hotels;
}

/** @deprecated Use searchHotels or fetchAllHotels instead. */
export async function fetchHotels() {
  return fetchAllHotels();
}
