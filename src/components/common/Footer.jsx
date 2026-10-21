import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Sparkles, PlusCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <Link to="/" className="footer-brand-logo" aria-label="BimsMart Home">
              <BrandLogo size="md" light={true} subtitleText="Campus Market" />
            </Link>
            <p className="footer-desc">
              The premier campus marketplace connecting students to discover, buy, and sell essentials safely within their university communities.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheck size={16} />
              <span>Verified student peer-to-peer commerce</span>
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
              <li style={{ fontSize: '0.75rem', color: '#94A3B8', paddingTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Sparkles size={12} style={{ color: '#F0B429' }} />
                <span>Expanding to more campus communities</span>
              </li>
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="footer-col-title">Marketplace</h4>
            <ul className="footer-links">
              <li>
                <Link to="/explore" className="footer-link">
                  Explore Marketplace
                </Link>
              </li>
              <li>
                <Link to="/sell" className="footer-link" style={{ color: '#15966A', fontWeight: '600' }}>
                  <PlusCircle size={14} />
                  <span>Start Selling</span>
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
                  About BimsMart
                </Link>
              </li>
              <li style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>
                Campus Inquiries: support@bimsmart.ng
              </li>
              <li style={{ paddingTop: '0.5rem', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.6' }}>
                Tip: Always meet on campus in daylight, inspect items before payment, and never disclose bank OTPs.
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 BimsMart. The marketplace built for campus life.</p>
          <div>
            <span>Community • Trust • Value</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
