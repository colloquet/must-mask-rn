import { useState, useEffect } from 'react';
import { getCurrentLocation } from 'src/utils';
import { GeoCoordinates } from 'src/types';

function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates | null>(
    null,
  );

  useEffect(() => {
    getCurrentLocation().then(location => setCurrentLocation(location));
  }, []);

  return currentLocation;
}

export default useCurrentLocation;
