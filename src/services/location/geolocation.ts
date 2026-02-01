import type { Location } from "../../types";
import { GEOLOCATION_TIMEOUT_MS } from "../../utils/constants";

export enum GeolocationErrorCode {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  POSITION_UNAVAILABLE = "POSITION_UNAVAILABLE",
  TIMEOUT = "TIMEOUT",
  NOT_SUPPORTED = "NOT_SUPPORTED",
}

export interface GeolocationResult {
  location: Location;
  accuracy: number;
  timestamp: number;
}

export interface GeolocationError {
  code: GeolocationErrorCode;
  message: string;
}

function mapGeolocationError(
  error: GeolocationPositionError
): GeolocationError {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        code: GeolocationErrorCode.PERMISSION_DENIED,
        message: "Location permission denied",
      };
    case error.POSITION_UNAVAILABLE:
      return {
        code: GeolocationErrorCode.POSITION_UNAVAILABLE,
        message: "Position unavailable",
      };
    case error.TIMEOUT:
      return {
        code: GeolocationErrorCode.TIMEOUT,
        message: "Geolocation request timed out",
      };
    default:
      return {
        code: GeolocationErrorCode.POSITION_UNAVAILABLE,
        message: error.message,
      };
  }
}

export function getCurrentPosition(
  timeoutMs: number = GEOLOCATION_TIMEOUT_MS
): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: GeolocationErrorCode.NOT_SUPPORTED,
        message: "Geolocation is not supported by this browser",
      } satisfies GeolocationError);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(mapGeolocationError(error));
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 0,
      }
    );
  });
}
