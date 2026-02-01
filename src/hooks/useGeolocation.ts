import { useState, useCallback } from "react";
import type { Location } from "../types";
import { getCurrentPosition, GeolocationErrorCode } from "../services/location";
import type { GeolocationError } from "../services/location";

interface UseGeolocationReturn {
  location: Location | null;
  loading: boolean;
  error: GeolocationError | null;
  refetch: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    getCurrentPosition()
      .then((result) => {
        setLocation(result.location);
      })
      .catch((err: GeolocationError) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { location, loading, error, refetch };
}

export { GeolocationErrorCode };
export type { GeolocationError };
