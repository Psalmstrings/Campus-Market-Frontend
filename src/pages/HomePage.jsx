import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Sparkles,
  MapPin,
  Smartphone,
  Laptop,
  BookOpen,
  Shirt,
  UtensilsCrossed,
  Wrench,
  Package,
} from 'lucide-react';
import { getListings } from '../services/listingService';
import { getCampuses } from '../services/campusService';
import { getCategories } from '../services/categoryService';
import ListingCard from '../components/listing/ListingCard';
import { ListingCardSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';

// Icon mapping helper
const CATEGORY_ICONS = {
  electronics: Smartphone,
  'phones-accessories': Smartphone,
  computers: Laptop,
  'books-academics': BookOpen,
  fashion: Shirt,
  'shoes-bags': ShoppingBag,
  food: UtensilsCrossed,
  services: Wrench,
};

export const HomePage = () => {
  const { selectedCampus, setSelectedCampus } = useAuth();
  const navigate = useNavigate();

  const [heroSearch, setHeroSearch] = useState('');
  const [campuses, setCampuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [campusRes, catRes, featuredRes, recentRes] = await Promise.all([
          getCampuses(),
          getCategories(),
          getListings({ featured: 'true', limit: 4 }),
          getListings({ sort: 'newest', limit: 8 }),
        ]);

        if (campusRes.success) setCampuses(campusRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (featuredRes.success) setFeaturedListings(featuredRes.data.listings);
        if (recentRes.success) setRecentListings(recentRes.data.listings);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleSelectCampus = (campusId) => {
    setSelectedCampus(campusId);
    navigate(`/explore?campus=${campusId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-blobs">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
        </div>

        <div className="hero-inner">
          {/* Trust pill */}
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            <span>Empowering students across UNILAG, YABATECH & LASU</span>
          </div>

          {/* Hero Headlines */}
          <h1 className="hero-title">
            Buy. Sell. Discover. <br />
            <span className="hero-gradient-text">
              Around Your Campus.
            </span>
          </h1>

          <p className="hero-subtitle">
            The dedicated campus marketplace. Get laptops, textbooks, fashion, snacks, and student services right in your halls and faculties.
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="hero-search-input-wrap">
              <Search size={18} className="hero-search-icon" />
              <input
                type="text"
                placeholder="What are you looking for today? (e.g. HP Laptop, Calculus, Shoes)"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="hero-search-btn">
              Search
            </button>
          </form>

          {/* Hero CTA buttons */}
          <div className="hero-ctas">
            <Link to="/sell" className="btn btn-primary btn-lg">
              Start Selling
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              Explore Listings
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CAMPUS SELECTION CARDS */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Select Your Campus</h2>
            <p className="section-desc">Browse listings specific to your university community</p>
          </div>
          <Link to="/explore" className="section-link">
            <span>View all campuses</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="campus-cards-grid">
          {campuses.map((camp) => (
            <div
              key={camp._id}
              onClick={() => handleSelectCampus(camp._id)}
              className="campus-card"
            >
              <div className="campus-card-top">
                <span className="campus-card-abbr">
                  {camp.shortName}
                </span>
                <span className="campus-active-badge">
                  Active
                </span>
              </div>
              <div>
                <h3 className="campus-card-name">{camp.name}</h3>
                <p className="campus-card-loc">
                  <MapPin size={12} />
                  <span>{camp.location}</span>
                </p>
              </div>
              <div className="campus-card-cta">
                <span>Browse Campus Deals</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Popular Categories</h2>
            <p className="section-desc">Find what you need across student essentials</p>
          </div>
          <Link to="/explore" className="section-link">
            <span>All Categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="categories-grid">
          {categories.slice(0, 7).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || Package;
            return (
              <Link
                key={cat._id}
                to={`/explore?category=${cat.slug}`}
                className="category-card"
              >
                <div className="category-icon">
                  <Icon size={22} />
                </div>
                <span className="category-name">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED LISTINGS */}
      {featuredListings.length > 0 && (
        <section className="container">
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="featured-icon-wrap">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="section-title">Featured On Campus</h2>
                <p className="section-desc">Top verified listings picked for students</p>
              </div>
            </div>
            <Link to="/explore?sort=views" className="section-link">
              <span>See more</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="listings-grid listings-grid-4">
            {featuredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* 5. RECENT LISTINGS */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Listings</h2>
            <p className="section-desc">Fresh items posted by students around your campus</p>
          </div>
          <Link to="/explore?sort=newest" className="section-link">
            <span>Explore all</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="listings-grid listings-grid-4">
            {[...Array(8)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="listings-grid listings-grid-4">
            {recentListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="how-section">
        <div className="container">
          <h2 className="how-title">How CampusMarket Works</h2>
          <p className="how-subtitle">Three simple steps to safe, fast campus peer-to-peer commerce</p>

          <div className="how-steps">
            <div className="how-step">
              <div className="how-step-num step-1">1</div>
              <h3 className="how-step-title">Find</h3>
              <p className="how-step-desc">
                Search for what you need—from laptops to textbooks and snacks—within your own campus or faculty.
              </p>
            </div>

            <div className="how-step">
              <div className="how-step-num step-2">2</div>
              <h3 className="how-step-title">Connect</h3>
              <p className="how-step-desc">
                Contact the student seller directly via WhatsApp or phone call to confirm availability and discuss details.
              </p>
            </div>

            <div className="how-step">
              <div className="how-step-num step-3">3</div>
              <h3 className="how-step-title">Buy Safely</h3>
              <p className="how-step-desc">
                Meet in daylight at a public campus location (e.g. SUB or Library), inspect your item, and pay on the spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SELL CTA SECTION */}
      <section className="sell-cta-section container">
        <div className="sell-cta-card">
          <div className="sell-cta-bg-glow" />
          <div className="sell-cta-bg-glow-2" />
          <div className="sell-cta-content">
            <div className="sell-cta-tag">Got something to sell?</div>
            <h2 className="sell-cta-title">Turn your unused student gear into cash today.</h2>
            <p className="sell-cta-desc">
              List textbooks from last semester, older electronics, sneakers, or offer your skills to thousands of verified students around your campus.
            </p>
            <Link to="/sell" className="sell-cta-btn">
              <span>Sell Something Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SAFETY REMINDER SECTION */}
      <section className="safety-section container">
        <div className="safety-banner">
          <div className="safety-banner-left">
            <div className="safety-banner-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="safety-banner-title">Student Safety First</h3>
              <p className="safety-banner-desc">
                Always meet on campus in daylight, inspect items thoroughly before payment, and never disclose bank OTPs, PINs, or transfer money before seeing the item.
              </p>
            </div>
          </div>
          <Link to="/safety" className="safety-banner-btn">
            Read Safety Tips
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
