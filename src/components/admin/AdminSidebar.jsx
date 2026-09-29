import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  MapPin,
  Tag,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Listings', path: '/admin/listings', icon: Package },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Campuses', path: '/admin/campuses', icon: MapPin },
  { name: 'Categories', path: '/admin/categories', icon: Tag },
  { name: 'Reports', path: '/admin/reports', icon: AlertTriangle },
];

export const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="admin-sidebar-brand">
        <div className="admin-brand-icon">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="admin-brand-title">Admin Portal</h2>
          <span className="admin-brand-sub">CampusMarket Moderation</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="admin-nav-icon" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Return to Marketplace Footer */}
      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-back-link">
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
