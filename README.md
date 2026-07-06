# Vaycay — Hotel Explorer

A React + Vite frontend for the [Demo Hotels API](https://demohotelsapi.pythonanywhere.com/), built as
the final assignment for the frontend module.

## Features

- **Search & filter** by keyword, destination city, minimum rating, and maximum price
- **Sort** by price (low→high / high→low) or rating
- **Hotel detail page** with a full photo gallery
- **Favorites / wishlist**, persisted locally in the browser (no backend required)
- **Pagination** over the filtered result set
- **Map view** — a stylized city map of India with markers sized by hotel count; click a city to filter
- **Recently viewed** — a strip of the last hotels you opened, persisted locally
- **Booking form** — pick check-in/check-out dates and guest count, see a live nightly total, and get a confirmation screen (no real payment processing)
- **Share** — copies a shareable link to the hotel (uses the native share sheet on supported devices)
- **Reviews** — post and read guest reviews per hotel, stored locally only (not sent anywhere)
- **Dark mode** toggle, persisted locally
- Responsive layout, keyboard-focus states, and loading/error/empty states

## Tech stack

- React 18
- React Router 6
- Vite 5
- Plain CSS with a small design-token system (no UI framework dependency)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── api/
│   └── hotelApi.js         # fetch + normalize data from the Demo Hotels API
├── data/
│   └── cityCoordinates.js  # approximate marker positions for the map view
├── components/              # presentational, reusable UI pieces
│   ├── ActiveFilterChips.jsx
│   ├── FilterPanel.jsx
│   ├── HotelCard.jsx
│   ├── HotelGrid.jsx
│   ├── MapView.jsx          # stylized city map with clickable markers
│   ├── Navbar.jsx           # includes the dark mode toggle
│   ├── Pagination.jsx
│   ├── RatingStamp.jsx
│   ├── RecentlyViewedStrip.jsx
│   ├── ReviewsSection.jsx   # review list + submission form (local only)
│   ├── SearchBar.jsx
│   ├── ShareButton.jsx      # Web Share API with clipboard fallback
│   └── StateBlocks.jsx      # loading / error / empty states
├── context/
│   └── FavoritesContext.jsx # favorites state + localStorage persistence
├── hooks/
│   ├── useHotels.js          # loads the hotel list once, exposes status/error
│   ├── useRecentlyViewed.js  # tracks last-viewed hotel ids in localStorage
│   ├── useReviews.js         # per-hotel reviews in localStorage
│   └── useTheme.js           # dark/light mode, persisted in localStorage
├── pages/
│   ├── Home.jsx             # search, filters, grid/map toggle, pagination
│   ├── HotelDetail.jsx      # gallery, booking form, reviews, share
│   └── Favorites.jsx        # saved hotels list
├── App.jsx                  # route definitions + shell layout
├── main.jsx                 # React root, router & context providers
└── index.css                # design tokens + all component styles
```

## Notes on the added features

- **Map view** uses an illustrative (not geographically precise) outline and a hand-picked coordinate table for major Indian cities in `src/data/cityCoordinates.js`. Cities not in that table fall back to a default position.
- **Bookings** and **reviews** are entirely client-side (localStorage) — there's no backend to receive them, so this satisfies the assignment's "interactive" requirement without overstating what the API supports.

## API notes

- Base URL: `https://demohotelsapi.pythonanywhere.com`
- **Search & list** — `GET /hotels/` with query params: `search`, `location`,
  `min_price`, `max_price`, `min_rating`, `max_rating`, `order_by`, `limit`, `skip`
- **Single hotel** — `GET /hotels/:id/`
- The home page uses server-side filtering, sorting, and pagination via the API.
  The full catalog is loaded once for favorites, map markers, and price bounds.
- Each hotel includes `id`, `name`, `price` (string, parsed to a number), `rating`,
  `location`, `description`, `thumbnail`, and a `photos` array used for the gallery.

## Deploying / submitting

1. `npm install`
2. Commit the project (an appropriate `.gitignore` is included so `node_modules`
   and `dist` won't be pushed)
3. Push to your GitHub repository before the deadline