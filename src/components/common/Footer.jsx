import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <Link to="/" className="footer-brand-logo">
              <div className="footer-logo-icon">
                <ShoppingBag size={20} />
              </div>
              <span className="footer-brand-name">
                Campus<span>Market</span>
              </span>
            </Link>
            <p className="footer-desc">
              Buy. Sell. Discover. Around Campus. The trusted student-focused marketplace built for universities and polytechnics.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheck size={16} />
              <span>Dedicated student peer-to-peer commerce</span>
            </div>
          </div>

          {/* Campuses */}
          <div>
            <h4 className="footer-col-title">Campuses Supported</h4>
            <ul className="footer-links">
              <li>
                <Link to="/explore?campus=UNILAG" className="footer-link">
                  <MapPin size={14} className="footer-link-icon" />
                  <span>University of Lagos (UNILAG)</span>
                </Link>
              </li>
              <li>
                <Link to="/explore?campus=YABATECH" className="footer-link">
                  <MapPin size={14} className="footer-link-icon" />
                  <span>Yaba College of Tech (YABATECH)</span>
                </Link>
              </li>
              <li>
                <Link to="/explore?campus=LASU" className="footer-link">
                  <MapPin size={14} className="footer-link-icon" />
                  <span>Lagos State University (LASU)</span>
                </Link>
              </li>
              <li style={{ fontSize: '0.75rem', color: '#475569', paddingTop: '0.25rem' }}>
                More campuses rolling out soon across Nigeria!
              </li>
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="footer-col-title">Marketplace</h4>
            <ul className="footer-links">
              <li>
                <Link to="/explore" className="footer-link">
                  Explore All Listings
                </Link>
              </li>
              <li>
                <Link to="/sell" className="footer-link">
                  Sell Something
                </Link>
              </li>
              <li>
                <Link to="/explore?sort=newest" className="footer-link">
                  Recent Postings
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="footer-link">
                  Saved Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Safety */}
          <div>
            <h4 className="footer-col-title">Trust & Support</h4>
            <ul className="footer-links">
              <li>
                <Link to="/safety" className="footer-link">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About CampusMarket
                </Link>
              </li>
              <li style={{ color: '#64748B', fontSize: '0.875rem' }}>
                Inquiries: support@campusmarket.ng
              </li>
              <li style={{ paddingTop: '0.5rem', fontSize: '0.75rem', color: '#475569', lineHeight: '1.6' }}>
                Always meet on campus in daylight, inspect items before payment, and never share banking OTPs.
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CampusMarket. Built for Nigerian students.</p>
          <div>
            <span>Psalmstrings Digital</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
