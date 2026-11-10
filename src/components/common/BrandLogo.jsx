import React from 'react';

/**
 * Official CampusMart Brand Logo Component
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
        viewBox="0 0 260 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', height: `${h}px`, width: 'auto' }}
        aria-label="CampusMart"
      >
        {/* Warm Gold mortarboard/accent canopy over 'Mart' */}
        <path
          d="M188 12 C188 12 198 7 222 7 C242 7 250 12 250 12 C251.5 12.7 252 14.5 251.2 16 C250.5 17.2 249.2 18 247.8 18 L190.2 18 C188.8 18 187.5 17.2 186.8 16 C186 14.5 186.5 12.7 188 12 Z"
          fill={goldColor}
        />
        {/* Gold curved modern accent cap block */}
        <path
          d="M190 6 H240 C247.7 6 254 12.3 254 20 V21 H190 V6 Z"
          fill={goldColor}
        />

        {/* Text 'CampusMart' */}
        <text
          x="0"
          y="42"
          fill={navyColor}
          fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="34"
          letterSpacing="-0.03em"
        >
          Campus<tspan fill={goldColor}>Mart</tspan>
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
