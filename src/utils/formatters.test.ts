import { describe, it, expect } from "vitest";
import { formatPrice, formatDistance } from "./formatters";

describe("formatPrice", () => {
  it("formats cents as dollar string", () => {
    expect(formatPrice(999)).toBe("$9.99");
  });

  it("formats zero cents", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("formats whole dollar amounts", () => {
    expect(formatPrice(500)).toBe("$5.00");
  });

  it("formats large amounts", () => {
    expect(formatPrice(12345)).toBe("$123.45");
  });
});

describe("formatDistance", () => {
  it("formats distances >= 0.1 mi with one decimal", () => {
    expect(formatDistance(2.456)).toBe("2.5 mi");
  });

  it("formats distances < 0.1 mi as feet", () => {
    expect(formatDistance(0.05)).toBe("264 ft");
  });

  it("formats zero distance", () => {
    expect(formatDistance(0)).toBe("0 ft");
  });

  it("formats exactly 1 mile", () => {
    expect(formatDistance(1)).toBe("1.0 mi");
  });

  it("rounds feet to nearest integer", () => {
    expect(formatDistance(0.01)).toBe("53 ft");
  });
});
