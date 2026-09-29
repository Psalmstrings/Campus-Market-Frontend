import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, Heart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-inner">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        {/* Explore */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Compass size={20} />
          <span>Explore</span>
        </NavLink>

        {/* Sell (Elevated Action Button) */}
        <NavLink to="/sell" className="mobile-nav-sell">
          <div className="mobile-nav-sell-btn">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <span className="mobile-nav-sell-label">Sell</span>
        </NavLink>

        {/* Favorites */}
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Heart size={20} />
          <span>Saved</span>
        </NavLink>

        {/* Profile / Account */}
        <NavLink
          to={isAuthenticated ? '/dashboard' : '/login'}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <User size={20} />
          <span>{isAuthenticated ? 'Account' : 'Login'}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
