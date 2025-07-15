import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// PUBLIC_INTERFACE
function Sidebar({ activeTheme, toggleTheme, onTradeClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span role="img" aria-label="stocks" style={{ fontSize: 32 }}>📈</span>
        <h1 className="sidebar-title">StockPM</h1>
      </div>
      <nav className="sidebar-nav">
        <NavLink exact="true" to="/" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span role="img" aria-label="home">🏠</span> Dashboard
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span role="img" aria-label="chart">📊</span> Analytics
        </NavLink>
        <button className="sidebar-link sidebar-action" onClick={onTradeClick}>
          <span role="img" aria-label="trade">💸</span> New Trade
        </button>
        <button className="sidebar-link sidebar-theme" onClick={toggleTheme}>
          {activeTheme === 'dark' ? '☀️ Light' : '🌙 Dark'} Mode
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
