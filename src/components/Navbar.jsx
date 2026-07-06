import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useTheme } from '../hooks/useTheme.js';

export default function Navbar() {
  const { favoriteIds } = useFavorites();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">V</span>
          Vaycay
        </NavLink>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            Search
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            Saved
            {favoriteIds.size > 0 && <span className="nav-count">{favoriteIds.size}</span>}
          </NavLink>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </nav>
      </div>
    </header>
  );
}
