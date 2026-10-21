import React from 'react';
import { ShieldCheck, Eye, AlertOctagon, Lock, MapPin, Flag } from 'lucide-react';

const SAFETY_TIPS = [
  {
    icon: MapPin,
    title: 'Meet in Broad Daylight & Public Campus Spots',
    desc: 'Always arrange product inspections at well-frequented campus locations such as the university library, Student Union Building (SUB), faculty quadrangles, or cafeteria during daytime.',
  },
  {
    icon: Eye,
    title: 'Inspect Thoroughly Before Any Payment',
    desc: 'Never pay for an item before holding and testing it. If buying a laptop or phone, test the charger, battery life, cameras, and test-type keys on the spot.',
  },
  {
    icon: Lock,
    title: 'Never Disclose Banking OTPs or PINs',
    desc: 'BimsMart staff will NEVER ask for your bank OTP, ATM PIN, online banking password, or card security codes under any circumstances.',
  },
  {
    icon: AlertOctagon,
    title: 'Avoid Unverified Advance Payments',
    desc: 'Be extremely cautious with sellers requesting "commitment fee" or "transport fare" before meeting you on campus. Legitimate student sellers will be happy to meet in person.',
  },
  {
    icon: Flag,
    title: 'Report Suspicious Activity Promptly',
    desc: 'If a listing seems too cheap to be true, contains stolen goods, or a user displays suspicious behavior, use the "Report Listing" button immediately for admin action.',
  },
];

export const SafetyPage = () => {
  return (
    <div className="content-page">
      <div className="content-page-hero">
        <div className="content-page-icon success-bg">
          <ShieldCheck size={32} />
        </div>
        <h1 className="content-page-title">Campus Safety Guidelines</h1>
        <p className="content-page-desc">
          Practical advice and best practices for safe, stress-free peer-to-peer student transactions.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {SAFETY_TIPS.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div key={idx} className="safety-tip-card">
              <div className="safety-tip-icon">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="safety-tip-title">{tip.title}</h3>
                <p className="safety-tip-desc">{tip.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="disclaimer-box">
        <strong>Disclaimer:</strong> BimsMart provides a peer-to-peer discovery marketplace connecting students across higher institutions. Users are independently responsible for verifying counterparties, inspecting goods, and completing transactions in safe environments.
      </div>
    </div>
  );
};

export default SafetyPage;
