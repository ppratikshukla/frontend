import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Home' },
  { id: 'subjects', icon: '📚', label: 'Subjects' },
  { id: 'history', icon: '📅', label: 'History' },
  { id: 'about', icon: '👨‍💻', label: 'About' },
];

const MobileNav = ({ activePage, onPageChange }) => {
  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => onPageChange(item.id)}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
