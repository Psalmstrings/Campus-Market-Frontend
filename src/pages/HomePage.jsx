import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
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
  CheckCircle,
  Tag,
  Users,
  Compass,
  PlusCircle,
  TrendingUp,
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
  const { setSelectedCampus } = useAuth();
  const navigate = useNavigate();

  const [heroSearch, setHeroSearch] = useState('');
  const [campuses, setCampuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [howItWorksTab, setHowItWorksTab] = useState('buyers'); // 'buyers' | 'sellers'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem' }}>
      {/* ────────────────────────────────────────────────────────
          SECTION 2: HERO SECTION
          Eyebrow: "THE MARKETPLACE BUILT FOR CAMPUS LIFE"
          Headline: "Everything you need, right around campus."
          Copy: "Discover affordable essentials, shop from fellow students..."
          CTAs: "Explore Marketplace" & "Start Selling"
          ──────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-content">
              {/* Official Eyebrow Pill */}
              <div className="hero-pill">
                <span className="hero-pill-dot" />
                <span>THE MARKETPLACE BUILT FOR CAMPUS LIFE</span>
              </div>

              {/* Official Headline */}
              <h1 className="hero-title">
                Everything you need, <br />
                <span className="hero-highlight">right around campus.</span>
              </h1>

              {/* Official Supporting Copy */}
              <p className="hero-subtitle">
                Discover affordable essentials, shop from fellow students, and find great deals within your campus community. Looking to sell? Reach students who are already looking for what you have.
              </p>

              {/* Section 3: Prominent Search Box */}
              <form onSubmit={handleSearch} className="hero-search-form">
                <div className="hero-search-input-wrap">
                  <Search size={18} className="hero-search-icon" />
                  <input
                    type="text"
                    placeholder="Search for books, gadgets, fashion, and more…"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="hero-search-input"
                  />
                </div>
                <button type="submit" className="hero-search-btn">
                  Search
                </button>
              </form>

              {/* Official CTAs */}
              <div className="hero-ctas">
                <Link to="/explore" className="btn btn-primary btn-lg">
                  <Compass size={18} />
                  <span>Explore Marketplace</span>
                </Link>
                <Link to="/sell" className="btn btn-secondary btn-lg">
                  <PlusCircle size={18} />
                  <span>Start Selling</span>
                </Link>
              </div>
            </div>

            {/* Hero Visual Composition: Student Discovery Cards */}
            <div className="hero-visual">
              <div className="hero-card-stack">
                {/* Visual Card 1: Study Essentials */}
                <div className="hero-preview-card featured-card">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80"
                    alt="Engineering Textbooks"
                    className="hero-preview-thumb"
                  />
                  <div className="hero-preview-info">
                    <span className="hero-preview-badge gold">
                      <Sparkles size={11} /> Featured Deal
                    </span>
                    <div className="hero-preview-title">Engineering Calculus & Notes</div>
                    <div className="hero-preview-price">₦4,500</div>
                    <div className="hero-preview-campus">
                      <MapPin size={11} /> Faculty of Engineering • UNILAG
                    </div>
                  </div>
                </div>

                {/* Visual Card 2: Campus Tech */}
                <div className="hero-preview-card">
                  <img
                    src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80"
                    alt="HP Laptop Student Sale"
                    className="hero-preview-thumb"
                  />
                  <div className="hero-preview-info">
                    <span className="hero-preview-badge">
                      <CheckCircle size={11} /> Verified Seller
                    </span>
                    <div className="hero-preview-title">HP Pavilion Core i5 8GB/256GB</div>
                    <div className="hero-preview-price">₦185,000</div>
                    <div className="hero-preview-campus">
                      <MapPin size={11} /> New Hall Hostel • UNILAG
                    </div>
                  </div>
                </div>

                {/* Visual Card 3: Student Fashion */}
                <div className="hero-preview-card">
                  <img
                    src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&auto=format&fit=crop&q=80"
                    alt="Campus Fashion Sneakers"
                    className="hero-preview-thumb"
                  />
                  <div className="hero-preview-info">
                    <span className="hero-preview-badge">
                      <Tag size={11} /> Like New
                    </span>
                    <div className="hero-preview-title">Nike Air Low Sneakers (Size 43)</div>
                    <div className="hero-preview-price">₦16,000</div>
                    <div className="hero-preview-campus">
                      <MapPin size={11} /> Bakassi Hostel • YABATECH
                    </div>
                  </div>
                </div>

                {/* Floating Trust Badge */}
                <div className="hero-floating-stat">
                  <div className="hero-stat-icon">
                    <Users size={18} />
                  </div>
                  <div className="hero-stat-text">
                    <span className="hero-stat-val">100% Student Peers</span>
                    <span className="hero-stat-label">In-person campus meetups</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 4: BROWSE POPULAR CATEGORIES
          Heading: "Find what you need."
          Supporting copy: "Explore the essentials, extras, and great finds available around your campus."
          ──────────────────────────────────────────────────────── */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Find what you need.</h2>
            <p className="section-desc">
              Explore the essentials, extras, and great finds available around your campus.
            </p>
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

      {/* ────────────────────────────────────────────────────────
          SECTION 5: FEATURED LISTINGS (When Available)
          ──────────────────────────────────────────────────────── */}
      {featuredListings.length > 0 && (
        <section className="container">
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="featured-icon-wrap">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="section-title">Featured On Campus</h2>
                <p className="section-desc">Top handpicked and verified listings</p>
              </div>
            </div>
            <Link to="/explore?sort=views" className="section-link">
              <span>View featured</span>
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

      {/* ────────────────────────────────────────────────────────
          SECTION 5: RECENT PRODUCTS
          Heading: "Good finds from your campus."
          Supporting copy: "Explore products listed by people in your campus community."
          ──────────────────────────────────────────────────────── */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Good finds from your campus.</h2>
            <p className="section-desc">
              Explore products listed by people in your campus community.
            </p>
          </div>
          <Link to="/explore?sort=newest" className="section-link">
            <span>Explore all items</span>
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

      {/* ────────────────────────────────────────────────────────
          SECTION 6: WHY CAMPUSMARKET?
          Heading: "Campus shopping, made easier."
          4 core pillars:
          - Built around campus life
          - Discover affordable finds
          - Buy and sell within your community
          - Make selling simpler
          ──────────────────────────────────────────────────────── */}
      <section className="why-section">
        <div className="container">
          <div className="why-header">
            <h2 className="why-title">Campus shopping, made easier.</h2>
            <p className="why-subtitle">
              A peer-to-peer marketplace built thoughtfully to eliminate clutter, protect student budgets, and empower campus entrepreneurs.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon">
                <BookOpen size={22} />
              </div>
              <h3 className="why-card-title">Built around campus life</h3>
              <p className="why-card-desc">
                Discover items relevant to student needs, from study materials and past questions to dorm electronics and everyday campus essentials.
              </p>
            </div>

            <div className="why-card">
              <div className="why-card-icon">
                <TrendingUp size={22} />
              </div>
              <h3 className="why-card-title">Discover affordable finds</h3>
              <p className="why-card-desc">
                Browse available listings and compare fair student prices to find options that fit your budget without unnecessary middleman markups.
              </p>
            </div>

            <div className="why-card">
              <div className="why-card-icon">
                <Users size={22} />
              </div>
              <h3 className="why-card-title">Buy & sell in your community</h3>
              <p className="why-card-desc">
                Connect with fellow students through direct WhatsApp or call. Inspect items in broad daylight on campus before completing payment.
              </p>
            </div>

            <div className="why-card">
              <div className="why-card-icon">
                <PlusCircle size={22} />
              </div>
              <h3 className="why-card-title">Make selling simpler</h3>
              <p className="why-card-desc">
                Create product listings in minutes, showcase photos, and put what you have in front of thousands of active buyers on your campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 7: DEDICATED SELLER SECTION
          Heading: "Your next customer could be right on campus."
          Supporting copy: "Have books you no longer need, gadgets to sell..."
          CTAs: "Start Selling" & "Explore the Marketplace"
          Deep Navy background with white text and Emerald Green actions!
          ──────────────────────────────────────────────────────── */}
      <section className="seller-section container">
        <div className="seller-card">
          <div className="seller-card-grid">
            <div>
              <div className="seller-tag">STUDENT COMMERCE & SELLING</div>
              <h2 className="seller-title">
                Your next customer could be right on campus.
              </h2>
              <p className="seller-desc">
                Have books you no longer need, gadgets to sell, fashion items to share, or products other students might love? Put your listings in front of your campus community with CampusMart.
              </p>

              <div className="seller-benefits-list">
                <div className="seller-benefit-item">
                  <CheckCircle size={16} className="seller-benefit-check" />
                  <span>Create product listings in 2 minutes</span>
                </div>
                <div className="seller-benefit-item">
                  <CheckCircle size={16} className="seller-benefit-check" />
                  <span>Upload high-quality product photos</span>
                </div>
                <div className="seller-benefit-item">
                  <CheckCircle size={16} className="seller-benefit-check" />
                  <span>Set your own prices & campus meeting spot</span>
                </div>
                <div className="seller-benefit-item">
                  <CheckCircle size={16} className="seller-benefit-check" />
                  <span>Manage listings easily via your seller dashboard</span>
                </div>
              </div>

              <div className="seller-ctas">
                <Link to="/sell" className="btn btn-primary btn-lg">
                  <PlusCircle size={18} />
                  <span>Start Selling</span>
                </Link>
                <Link to="/explore" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                  <span>Explore the Marketplace</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Seller Preview Steps */}
            <div className="seller-preview-panel">
              <div className="seller-panel-title">How selling works</div>
              <div className="seller-panel-steps">
                <div className="seller-panel-step">
                  <div className="seller-panel-step-num">1</div>
                  <div>
                    <strong>Sign in or register</strong> with your verified student profile.
                  </div>
                </div>
                <div className="seller-panel-step">
                  <div className="seller-panel-step-num">2</div>
                  <div>
                    <strong>Snap & upload photos</strong> of your textbooks, gadget, or item.
                  </div>
                </div>
                <div className="seller-panel-step">
                  <div className="seller-panel-step-num">3</div>
                  <div>
                    <strong>Add your price & details</strong> alongside your campus location.
                  </div>
                </div>
                <div className="seller-panel-step">
                  <div className="seller-panel-step-num">4</div>
                  <div>
                    <strong>Receive buyer enquiries</strong> directly via WhatsApp or phone call.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 8: HOW IT WORKS (Dual Journey: Buyers & Sellers)
          ──────────────────────────────────────────────────────── */}
      <section className="how-section">
        <div className="container">
          <h2 className="how-title">How CampusMart Works</h2>
          <p className="how-subtitle">
            A transparent and dependable peer-to-peer experience designed for campus life.
          </p>

          <div className="how-tabs">
            <button
              type="button"
              onClick={() => setHowItWorksTab('buyers')}
              className={`how-tab-btn ${howItWorksTab === 'buyers' ? 'active' : ''}`}
            >
              For Campus Buyers
            </button>
            <button
              type="button"
              onClick={() => setHowItWorksTab('sellers')}
              className={`how-tab-btn ${howItWorksTab === 'sellers' ? 'active' : ''}`}
            >
              For Student Sellers
            </button>
          </div>

          {howItWorksTab === 'buyers' ? (
            <div className="how-steps-grid">
              <div className="how-step-card">
                <div className="how-step-badge">1</div>
                <h3 className="how-step-title">Browse or Search</h3>
                <p className="how-step-text">
                  Look up textbooks, gadgets, hostel items, and services listed within your university or nearby campuses.
                </p>
              </div>

              <div className="how-step-card">
                <div className="how-step-badge">2</div>
                <h3 className="how-step-title">Review the Details</h3>
                <p className="how-step-text">
                  Examine item photos, condition tag (New, Good, Fair), price, and seller department information.
                </p>
              </div>

              <div className="how-step-card">
                <div className="how-step-badge">3</div>
                <h3 className="how-step-title">Contact Seller</h3>
                <p className="how-step-text">
                  Reach out directly through one-click WhatsApp message or phone call to verify item availability.
                </p>
              </div>

              <div className="how-step-card">
                <div className="how-step-badge">4</div>
                <h3 className="how-step-title">Meet & Pay Safely</h3>
                <p className="how-step-text">
                  Meet in daylight at a public campus spot (library, student union), inspect the item thoroughly, and pay on the spot.
                </p>
              </div>
            </div>
          ) : (
            <div className="how-steps-grid">
              <div className="how-step-card">
                <div className="how-step-badge">1</div>
                <h3 className="how-step-title">Create Account</h3>
                <p className="how-step-text">
                  Sign in or create your student account and select your campus community to unlock seller features.
                </p>
              </div>

              <div className="how-step-card">
                <div className="how-step-badge">2</div>
                <h3 className="how-step-title">Create a Listing</h3>
                <p className="how-step-text">
                  Upload clear photos, write a descriptive title, choose the category, and set your fair student price.
                </p>
              </div>

              <div className="how-step-card">
                <div className="how-step-badge">3</div>
                <h3 className="how-step-title">Publish & Connect</h3>
                <p className="how-step-text">
                  Your listing is published across campus feeds where interested peers can discover it instantly.
                </p>
              </div>

              <div className="how-step-card">
                <div className="how-step-badge">4</div>
                <h3 className="how-step-title">Manage & Close Deals</h3>
                <p className="how-step-text">
                  Track views and enquiries in your seller dashboard, and mark items as sold once deals are concluded.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 9: CAMPUS COMMUNITY SECTION
          Heading: "Made for the way campus moves."
          Supporting copy: "From lecture notes and textbooks to everyday essentials..."
          ──────────────────────────────────────────────────────── */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Made for the way campus moves.</h2>
            <p className="section-desc">
              From lecture notes and textbooks to everyday essentials and personal finds, CampusMart brings campus buying and selling into one convenient place.
            </p>
          </div>
          <Link to="/explore" className="section-link">
            <span>Explore all campuses</span>
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
                  Active Campus
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
                <span>Browse {camp.shortName} Listings</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 10: FINAL HOMEPAGE CTA
          Heading: "Find your next great deal."
          Supporting copy: "Explore what’s available around your campus, or list something another student might need."
          Buttons: Explore Marketplace & Start Selling
          ──────────────────────────────────────────────────────── */}
      <section className="final-cta-section container">
        <div className="final-cta-card">
          <div className="final-cta-tag">JOIN THE CAMPUS MARKETPLACE</div>
          <h2 className="final-cta-title">Find your next great deal.</h2>
          <p className="final-cta-desc">
            Explore what’s available around your campus, or list something another student might need.
          </p>

          <div className="final-cta-btns">
            <Link to="/explore" className="btn btn-primary btn-lg">
              <Compass size={18} />
              <span>Explore Marketplace</span>
            </Link>
            <Link to="/sell" className="btn btn-secondary btn-lg">
              <PlusCircle size={18} />
              <span>Start Selling</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Student Safety Reminder Notice */}
      <section className="safety-section container">
        <div className="safety-banner">
          <div className="safety-banner-left">
            <div className="safety-banner-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="safety-banner-title">Student Safety First</h3>
              <p className="safety-banner-desc">
                Always meet on campus in daylight, inspect items thoroughly before payment, and never disclose bank OTPs, PINs, or transfer money before seeing the item in person.
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
