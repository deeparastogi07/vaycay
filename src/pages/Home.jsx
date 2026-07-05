import React, { useMemo, useState } from 'react';
import { API_CITIES } from '../api/hotelApi.js';
import { useHotels } from '../hooks/useHotels.js';
import { useHotelSearch } from '../hooks/useHotelSearch.js';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed.js';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import ActiveFilterChips from '../components/ActiveFilterChips.jsx';
import HotelGrid from '../components/HotelGrid.jsx';
import Pagination from '../components/Pagination.jsx';
import MapView from '../components/MapView.jsx';
import RecentlyViewedStrip from '../components/RecentlyViewedStrip.jsx';
import { LoadingState, ErrorState, EmptyState } from '../components/StateBlocks.jsx';

const PAGE_SIZE = 12;

const DEFAULT_FILTERS = {
  search: '',
  location: '',
  minRating: 0,
  maxPrice: 10000,
  sortBy: 'recommended',
};

export default function Home() {
  const { hotels: catalog, status: catalogStatus } = useHotels();
  const { recentIds } = useRecentlyViewed();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const priceBounds = useMemo(() => {
    if (catalog.length === 0) return { min: 1000, max: 10000 };
    const prices = catalog.map((hotel) => hotel.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [catalog]);

  const defaultMaxPrice = priceBounds.max;

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      maxPrice: filters.maxPrice >= defaultMaxPrice ? undefined : filters.maxPrice,
    }),
    [filters, defaultMaxPrice]
  );

  const {
    hotels: searchResults,
    totalCount,
    status: searchStatus,
    error: searchError,
  } = useHotelSearch(
    {
      search: effectiveFilters.search,
      location: effectiveFilters.location,
      maxPrice: effectiveFilters.maxPrice ?? defaultMaxPrice,
      minRating: effectiveFilters.minRating,
      sortBy: effectiveFilters.sortBy,
    },
    page,
    PAGE_SIZE,
    { fetchAll: viewMode === 'map' }
  );

  const locations = useMemo(() => {
    const fromCatalog = [...new Set(catalog.map((hotel) => hotel.location))].sort();
    return fromCatalog.length > 0 ? fromCatalog : API_CITIES;
  }, [catalog]);

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS, maxPrice: defaultMaxPrice });
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const recentlyViewedHotels = useMemo(
    () =>
      recentIds
        .map((id) => catalog.find((hotel) => hotel.id === id))
        .filter(Boolean),
    [recentIds, catalog]
  );

  const handleSelectCity = (city) => {
    handleFiltersChange({ ...filters, location: city });
    setViewMode('grid');
  };

  const isInitialLoad = catalogStatus === 'loading' && searchStatus === 'loading';
  const hasError = searchStatus === 'error';
  const isReady = searchStatus === 'ready';

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">500 stays · 15 cities</p>
          <h1>Find a room worth writing home about.</h1>
          <p>
            Search live inventory from the Demo Hotels API, filter by budget and rating, and
            save your favorites for later.
          </p>

          {(isReady || catalogStatus === 'ready') && (
            <SearchBar locations={locations} filters={filters} onChange={handleFiltersChange} />
          )}
        </div>
      </section>

      <div className="container">
        {isInitialLoad && <LoadingState />}
        {hasError && <ErrorState message={searchError?.message} />}

        {!isInitialLoad && !hasError && (
          <div className="layout-with-sidebar" style={{ marginTop: 32 }}>
            <FilterPanel
              bounds={{ ...priceBounds, max: defaultMaxPrice }}
              filters={{ ...filters, maxPrice: filters.maxPrice || defaultMaxPrice }}
              onChange={handleFiltersChange}
              onReset={handleReset}
            />

            <div>
              <div className="results-bar">
                <span className="results-count">
                  {searchStatus === 'loading' ? (
                    'Searching…'
                  ) : (
                    <>
                      <strong>{totalCount}</strong> hotels found
                    </>
                  )}
                </span>
                <div className="view-toggle">
                  <button
                    type="button"
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    className={viewMode === 'map' ? 'active' : ''}
                    onClick={() => setViewMode('map')}
                  >
                    Map
                  </button>
                </div>
              </div>

              <ActiveFilterChips
                filters={filters}
                defaultMaxPrice={defaultMaxPrice}
                onChange={handleFiltersChange}
                onClearAll={handleReset}
              />

              {searchStatus === 'loading' && viewMode === 'grid' ? (
                <LoadingState />
              ) : viewMode === 'map' ? (
                <MapView hotels={searchResults} onSelectCity={handleSelectCity} />
              ) : totalCount === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <>
                  <HotelGrid hotels={searchResults} />
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
              )}

              <RecentlyViewedStrip hotels={recentlyViewedHotels} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
