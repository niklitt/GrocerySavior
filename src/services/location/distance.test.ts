import { describe, it, expect } from "vitest";
import { calculateDistance } from "./distance";
import type { Location } from "../../types";

describe("calculateDistance", () => {
  it("returns 0 for the same point", () => {
    const point: Location = { lat: 40.7128, lng: -74.006 };
    expect(calculateDistance(point, point)).toBe(0);
  });

  it("calculates NYC to LA distance (~2451 miles)", () => {
    const nyc: Location = { lat: 40.7128, lng: -74.006 };
    const la: Location = { lat: 34.0522, lng: -118.2437 };
    const distance = calculateDistance(nyc, la);
    expect(distance).toBeGreaterThan(2400);
    expect(distance).toBeLessThan(2500);
  });

  it("calculates antipodal points (~12437 miles)", () => {
    const north: Location = { lat: 0, lng: 0 };
    const south: Location = { lat: 0, lng: 180 };
    const distance = calculateDistance(north, south);
    expect(distance).toBeGreaterThan(12400);
    expect(distance).toBeLessThan(12500);
  });

  it("calculates small distances accurately", () => {
    const a: Location = { lat: 51.5074, lng: -0.1278 };
    const b: Location = { lat: 51.5076, lng: -0.128 };
    const distance = calculateDistance(a, b);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(0.03);
  });

  it("is symmetric (distance A->B equals B->A)", () => {
    const tokyo: Location = { lat: 35.6762, lng: 139.6503 };
    const sydney: Location = { lat: -33.8688, lng: 151.2093 };
    expect(calculateDistance(tokyo, sydney)).toBeCloseTo(
      calculateDistance(sydney, tokyo),
      10
    );
  });
});
