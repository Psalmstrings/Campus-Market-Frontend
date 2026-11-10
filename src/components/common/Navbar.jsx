import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Heart,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  MapPin,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCampuses } from '../../services/campusService';
import BrandLogo from './BrandLogo';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, selectedCampus, setSelectedCampus } = useAuth();
  const [campuses, setCampuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCampusesList = async () => {
      try {
        const res = await getCampuses();
        if (res.success && res.data) {
          setCampuses(res.data);
        }
      } catch (err) {
        console.error('Failed to load campuses for navbar:', err);
      }
    };
    fetchCampusesList();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCampusDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const currentCampusObj = campuses.find(
    (c) => c._id === selectedCampus || c.shortName === selectedCampus
  );
  const currentCampusLabel = currentCampusObj ? currentCampusObj.shortName : 'All Campuses';

  return (
    <header className="navbar">
      {user && !user.isVerified && user.role !== 'admin' && (
        <div style={{ backgroundColor: '#d97706', color: '#ffffff', fontSize: '0.8125rem', padding: '0.375rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 500 }}>
          <span>⚠️ Please verify your student email address to unlock verified student badges and post listings.</span>
          <Link to="/verify-email" style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: 700, marginLeft: '0.75rem', whiteSpace: 'nowrap' }}>
            Verify Now &rarr;
          </Link>
        </div>
      )}
      <div className="navbar-inner">
        <div className="navbar-row">
          {/* Brand Logo & Campus Selector */}
          <div className="navbar-brand">
            <Link to="/" className="flex items-center gap-2" aria-label="CampusMart Home">
              <BrandLogo size="md" subtitleText="Campus Hub" />
            </Link>

            {/* Campus Selector Badge */}
            <div className="campus-selector">
              <button
                type="button"
                onClick={() => setCampusDropdownOpen((prev) => !prev)}
                className="campus-btn"
                title="Filter by campus"
              >
                <MapPin size={13} />
                <span className="truncate">{currentCampusLabel}</span>
                <ChevronDown size={12} />
              </button>

              {campusDropdownOpen && (
                <div className="campus-dropdown">
                  <div className="campus-dropdown-title">Select Your Campus</div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCampus('all');
                      setCampusDropdownOpen(false);
                    }}
                    className={`campus-dropdown-item ${selectedCampus === 'all' ? 'active' : ''}`}
                  >
                    <span>All Campuses</span>
                    {selectedCampus === 'all' && <span className="dot" />}
                  </button>
                  {campuses.map((camp) => (
                    <button
                      type="button"
                      key={camp._id}
                      onClick={() => {
                        setSelectedCampus(camp._id);
                        setCampusDropdownOpen(false);
                      }}
                      className={`campus-dropdown-item ${selectedCampus === camp._id ? 'active' : ''}`}
                    >
                      <div>
                        <div className="campus-item-name">{camp.shortName}</div>
                        <div className="campus-item-sub">{camp.name}</div>
                      </div>
                      {selectedCampus === camp._id && <span className="dot" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search bar (Desktop & Tablet) */}
          <form onSubmit={handleSearchSubmit} className="navbar-search">
            <Search size={16} className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search laptops, textbooks, phones, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
            />
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="navbar-links">
            <Link
              to="/explore"
              className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
            >
              Explore Marketplace
            </Link>
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About CampusMart
            </Link>
            <Link
              to="/safety"
              className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`}
            >
              Safety Tips
            </Link>
          </nav>

          {/* User actions */}
          <div className="navbar-actions">
            {/* Sell CTA button */}
            <Link to="/sell" className="navbar-sell-btn">
              <PlusCircle size={16} />
              <span>Sell on Campus</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Favorites icon */}
                <Link
                  to="/favorites"
                  className="navbar-icon-btn"
                  title="Saved Items"
                >
                  <Heart size={20} />
                </Link>

                {/* Profile menu dropdown */}
                <div className="user-menu">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="user-menu-trigger"
                    aria-label="User menu"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.firstName}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-initials">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </div>
                    )}
                    <ChevronDown size={14} />
                  </button>

                  {userDropdownOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="user-dropdown-email">{user?.email}</div>
                        <div className="user-dropdown-badges">
                          <span className="badge badge-primary">{user?.role}</span>
                          {user?.isVerified && (
                            <span className="badge badge-success">✓ Verified</span>
                          )}
                        </div>
                      </div>

                      <div style={{ padding: '0.25rem 0' }}>
                        <Link to="/dashboard" className="user-dropdown-item">
                          <LayoutDashboard size={16} className="item-icon" />
                          <span>Seller Dashboard</span>
                        </Link>
                        <Link to="/profile" className="user-dropdown-item">
                          <User size={16} className="item-icon" />
                          <span>My Profile</span>
                        </Link>
                        <Link to="/favorites" className="user-dropdown-item">
                          <Heart size={16} className="item-icon" />
                          <span>Saved Items</span>
                        </Link>

                        {isAdmin && (
                          <Link to="/admin" className="user-dropdown-item admin-item">
                            <Shield size={16} className="item-icon text-primary" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="user-dropdown-divider" />

                      <div style={{ padding: '0.25rem 0' }}>
                        <button
                          type="button"
                          onClick={logout}
                          className="user-dropdown-item danger"
                        >
                          <LogOut size={16} className="item-icon" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Desktop-only auth buttons — hidden on mobile (use hamburger instead) */
              <div className="navbar-auth navbar-auth-desktop">
                <Link to="/login" className="navbar-login-btn">
                  Log In
                </Link>
                <Link to="/register" className="navbar-signup-btn">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="navbar-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="navbar-mobile-search">
          <form onSubmit={handleSearchSubmit} className="navbar-mobile-search-form">
            <Search size={16} className="navbar-mobile-search-icon" />
            <input
              type="text"
              placeholder="Search items on campus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-mobile-search-input"
            />
          </form>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            {/* Nav links */}
            <Link to="/explore" className="mobile-nav-link">
              Explore Marketplace
            </Link>
            <Link to="/about" className="mobile-nav-link">
              About CampusMart
            </Link>
            <Link to="/safety" className="mobile-nav-link">
              Safety Guidelines
            </Link>
            <Link to="/sell" className="mobile-nav-link primary">
              + Sell an Item
            </Link>

            {isAdmin && (
              <Link to="/admin" className="mobile-nav-link" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                Admin Dashboard
              </Link>
            )}

            {/* Auth section inside hamburger */}
            {isAuthenticated ? (
              <div className="mobile-menu-auth-section">
                <div className="mobile-menu-auth-user">
                  <div className="mobile-menu-auth-avatar">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.firstName} />
                    ) : (
                      <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                    )}
                  </div>
                  <div>
                    <div className="mobile-menu-auth-name">{user?.firstName} {user?.lastName}</div>
                    <div className="mobile-menu-auth-email">{user?.email}</div>
                  </div>
                </div>
                <div className="mobile-menu-auth-links">
                  <Link to="/dashboard" className="mobile-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/profile" className="mobile-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/favorites" className="mobile-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={16} /> Saved Items
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="mobile-nav-logout-btn"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="mobile-menu-auth-section">
                <Link to="/login" className="mobile-nav-login-btn">
                  Log In
                </Link>
                <Link to="/register" className="mobile-nav-signup-btn">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
