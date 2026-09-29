/**
 * Formats a number as Nigerian Naira (₦)
 * Example: 280000 -> ₦280,000
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) return '₦0';
  return `₦${Number(price).toLocaleString('en-NG')}`;
};

export default formatPrice;
