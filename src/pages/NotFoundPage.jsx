import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Page or Listing Not Found</h1>
      <p className="notfound-desc">
        Looks like this page or listing doesn't exist, may have expired, or was removed by the seller.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        <Home size={18} />
        <span>Back to Marketplace</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
