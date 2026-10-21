import React from 'react';

/**
 * Official BimsMart Brand Logo Component
 * Combines Deep Navy typography (#142B4A) with the Warm Gold (#F0B429) accent cap.
 */
export const BrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  withSubtitle = true,
  subtitleText = 'Campus Marketplace',
  light = false, // for dark backgrounds (e.g. Deep Navy footer)
  className = '',
}) => {
  const heights = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const h = heights[size] || heights.md;
  const navyColor = light ? '#FFFFFF' : '#142B4A';
  const goldColor = '#F0B429';

  return (
    <div
      className={`brand-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.5rem' : '0.625rem',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      <svg
        height={h}
        viewBox="0 0 240 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', height: `${h}px`, width: 'auto' }}
        aria-label="BimsMart"
      >
        {/* Warm Gold mortarboard/accent canopy over 'art' */}
        <path
          d="M172 13 C172 13 182 8 206 8 C226 8 234 13 234 13 C235.5 13.7 236 15.5 235.2 17 C234.5 18.2 233.2 19 231.8 19 L174.2 19 C172.8 19 171.5 18.2 170.8 17 C170 15.5 170.5 13.7 172 13 Z"
          fill={goldColor}
        />
        {/* Gold curved modern accent cap block as in the official brand image */}
        <path
          d="M174 7 H224 C231.7 7 238 13.3 238 21 V22 H174 V7 Z"
          fill={goldColor}
        />

        {/* Text 'BimsMart' */}
        <text
          x="0"
          y="42"
          fill={navyColor}
          fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="-0.03em"
        >
          Bims<tspan fill={navyColor}>Mart</tspan>
        </text>
      </svg>

      {withSubtitle && size !== 'sm' && (
        <span
          className="brand-logo-sub"
          style={{
            display: 'none',
            fontSize: size === 'xl' ? '0.75rem' : '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: light ? 'rgba(255,255,255,0.75)' : '#64748B',
            borderLeft: `1.5px solid ${light ? 'rgba(255,255,255,0.2)' : '#E2E8F0'}`,
            paddingLeft: '0.625rem',
            lineHeight: 1.2,
          }}
        >
          {subtitleText}
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
