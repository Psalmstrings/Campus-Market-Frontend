import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="content-page">
      <div className="content-page-hero">
        <div className="content-page-icon primary-bg">
          <ShoppingBag size={28} />
        </div>
        <h1 className="content-page-title">About CampusMarket</h1>
        <p className="content-page-desc">
          The student-focused marketplace designed to make it easier for students to discover products, services, and opportunities around their campus.
        </p>
      </div>

      <div className="prose-card">
        <h2>Our Mission</h2>
        <p>
          Students across Nigerian higher educational institutions face recurring challenges buying textbooks from seniors, passing down hostel appliances, finding trusted roommates, selling electronics before graduating, or discovering campus freelancers and food vendors.
        </p>
        <p>
          CampusMarket eliminates the friction of noisy WhatsApp groups, expired social media statuses, and untrusted bulletin boards by providing a structured, campus-localized commerce platform built specifically for students.
        </p>

        <h2>Current Campuses</h2>
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
          <span>Explore CampusMarket</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
