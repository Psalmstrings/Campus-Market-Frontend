import React, { useState } from 'react';

export const ImageGallery = ({ images = [], title = 'Listing Image' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallback = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80';
  const displayImages = images && images.length > 0 ? images : [fallback];
  const activeImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="image-gallery">
      {/* Main Image Display */}
      <div className="gallery-main">
        <img
          src={activeImage}
          alt={`${title} - view ${selectedIndex + 1}`}
          onError={(e) => {
            e.currentTarget.src = fallback;
          }}
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="gallery-thumbs">
          {displayImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`gallery-thumb ${selectedIndex === index ? 'active' : ''}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = fallback;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
