import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGeolocation } from "./useGeolocation";
import { GeolocationErrorCode } from "../services/location";

vi.mock("../services/location", async () => {
  const actual = await vi.importActual("../services/location");
  return {
    ...actual,
    getCurrentPosition: vi.fn(),
  };
});

import { getCurrentPosition } from "../services/location";
const mockGetCurrentPosition = vi.mocked(getCurrentPosition);

describe("useGeolocation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with null location, not loading, no error", () => {
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.location).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refetch).toBe("function");
  });

  it("sets loading to true while fetching", async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetCurrentPosition.mockReturnValue(
      promise as ReturnType<typeof getCurrentPosition>
    );

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({
        location: { lat: 0, lng: 0 },
        accuracy: 10,
        timestamp: 0,
      });
    });

    expect(result.current.loading).toBe(false);
  });

  it("sets location on success", async () => {
    mockGetCurrentPosition.mockResolvedValue({
      location: { lat: 40.7128, lng: -74.006 },
      accuracy: 15,
      timestamp: 1700000000000,
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.location).toEqual({
        lat: 40.7128,
        lng: -74.006,
      });
    });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("sets error on failure", async () => {
    mockGetCurrentPosition.mockRejectedValue({
      code: GeolocationErrorCode.PERMISSION_DENIED,
      message: "Location permission denied",
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toEqual({
        code: GeolocationErrorCode.PERMISSION_DENIED,
        message: "Location permission denied",
      });
    });

    expect(result.current.location).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("clears previous error on refetch", async () => {
    mockGetCurrentPosition.mockRejectedValueOnce({
      code: GeolocationErrorCode.TIMEOUT,
      message: "Timed out",
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    mockGetCurrentPosition.mockResolvedValueOnce({
      location: { lat: 51.5074, lng: -0.1278 },
      accuracy: 20,
      timestamp: 1700000000000,
    });

    act(() => {
      result.current.refetch();
    });

    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.location).toEqual({
        lat: 51.5074,
        lng: -0.1278,
      });
    });
  });
});
