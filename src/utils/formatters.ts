export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

export function formatDistance(miles: number): string {
  if (miles < 0.1) {
    const feet = Math.round(miles * 5280);
    return `${feet} ft`;
  }
  return `${miles.toFixed(1)} mi`;
}
