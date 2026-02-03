import type { Location } from "../../types";
import { EARTH_RADIUS_MILES } from "../../utils/constants";

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Calculates the great-circle distance between two points in miles using the Haversine formula. */
export function calculateDistance(from: Location, to: Location): number {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_MILES * c;
}
