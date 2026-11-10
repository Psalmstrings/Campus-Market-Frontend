import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/common/BrandLogo';

export const AboutPage = () => {
  return (
    <div className="content-page">
      <div className="content-page-hero">
        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <BrandLogo size="xl" />
        </div>
        <h1 className="content-page-title">About CampusMart</h1>
        <p className="content-page-desc">
          The marketplace built for Nigerian campus life — designed to make it simple, safe, and affordable for students to buy, sell, and discover essentials right within their campus communities.
        </p>
      </div>

      <div className="prose-card">
        <h2>Our Mission</h2>
        <p>
          Students across Nigerian higher educational institutions face recurring challenges buying textbooks from seniors, passing down hostel appliances, finding trusted roommates, selling electronics before graduating, or discovering campus freelancers and food vendors.
        </p>
        <p>
          CampusMart eliminates the friction of noisy WhatsApp groups, expired status updates, and untrusted bulletin boards by providing a structured, campus-localized commerce platform built specifically for students.
        </p>

        <h2>Current Active Campuses</h2>
        <div className="campus-info-grid">
          <div className="campus-info-card">
            <div className="campus-info-name">University of Lagos</div>
            <div className="campus-info-badge">UNILAG • Akoka</div>
          </div>
          <div className="campus-info-card">
            <div className="campus-info-name">Yaba College of Technology</div>
            <div className="campus-info-badge">YABATECH • Yaba</div>
          </div>
          <div className="campus-info-card">
            <div className="campus-info-name">Lagos State University</div>
            <div className="campus-info-badge">LASU • Ojo</div>
          </div>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '1rem' }}>
          More tertiary institutions across Lagos, Ibadan, Ife, Ilorin, and Nigeria are being integrated through our modular campus architecture.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <Link to="/explore" className="btn btn-primary btn-lg">
          <span>Explore CampusMart</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
