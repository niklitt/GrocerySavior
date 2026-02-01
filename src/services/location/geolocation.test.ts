import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCurrentPosition, GeolocationErrorCode } from "./geolocation";

describe("getCurrentPosition", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves with location on success", async () => {
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
      },
      timestamp: 1700000000000,
    } as GeolocationPosition;

    const getCurrentPositionMock = vi.fn((success: PositionCallback) =>
      success(mockPosition)
    );

    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition: getCurrentPositionMock },
    });

    const result = await getCurrentPosition();

    expect(result).toEqual({
      location: { lat: 40.7128, lng: -74.006 },
      accuracy: 10,
      timestamp: 1700000000000,
    });
  });

  it("rejects with PERMISSION_DENIED on permission error", async () => {
    const mockError = {
      code: 1,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: "User denied",
    } as GeolocationPositionError;

    const getCurrentPositionMock = vi.fn(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error(mockError)
    );

    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition: getCurrentPositionMock },
    });

    await expect(getCurrentPosition()).rejects.toEqual({
      code: GeolocationErrorCode.PERMISSION_DENIED,
      message: "Location permission denied",
    });
  });

  it("rejects with TIMEOUT on timeout error", async () => {
    const mockError = {
      code: 3,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: "Timeout",
    } as GeolocationPositionError;

    const getCurrentPositionMock = vi.fn(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error(mockError)
    );

    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition: getCurrentPositionMock },
    });

    await expect(getCurrentPosition()).rejects.toEqual({
      code: GeolocationErrorCode.TIMEOUT,
      message: "Geolocation request timed out",
    });
  });

  it("rejects with POSITION_UNAVAILABLE on position error", async () => {
    const mockError = {
      code: 2,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: "Unavailable",
    } as GeolocationPositionError;

    const getCurrentPositionMock = vi.fn(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error(mockError)
    );

    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition: getCurrentPositionMock },
    });

    await expect(getCurrentPosition()).rejects.toEqual({
      code: GeolocationErrorCode.POSITION_UNAVAILABLE,
      message: "Position unavailable",
    });
  });

  it("rejects with NOT_SUPPORTED when geolocation is unavailable", async () => {
    vi.stubGlobal("navigator", { geolocation: undefined });

    await expect(getCurrentPosition()).rejects.toEqual({
      code: GeolocationErrorCode.NOT_SUPPORTED,
      message: "Geolocation is not supported by this browser",
    });
  });

  it("passes custom timeout to geolocation API", async () => {
    const mockPosition = {
      coords: { latitude: 0, longitude: 0, accuracy: 100 },
      timestamp: 0,
    } as GeolocationPosition;

    const getCurrentPositionMock = vi.fn((success: PositionCallback) =>
      success(mockPosition)
    );

    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition: getCurrentPositionMock },
    });

    await getCurrentPosition(5000);

    expect(getCurrentPositionMock).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({ timeout: 5000 })
    );
  });
});
