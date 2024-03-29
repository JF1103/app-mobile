import {useEffect, useState, useRef} from 'react';

import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  const [routeLines, setRouteLines] = useState([]);

  const [initialPosition, setInitialPosition] = useState({
    longitude: 0,
    latitude: 0,
  });

  const [userLocation, setUserLocation] = useState({
    longitude: 0,
    latitude: 0,
  });

  const watchId = useRef();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getCurrentLocation().then(location => {
      if (!isMounted.current) return;

      setInitialPosition(location);
      setUserLocation(location);
      setRouteLines(routes => [...routes, location]);
      setHasLocation(true);
    });
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        ({coords, mocked}) => {
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
            mocked,
          });
        },
        err => reject({err}),
        {enableHighAccuracy: false},
      );
    });
  };

  const followUserLocation = () => {
    watchId.current = Geolocation.watchPosition(
      ({coords}) => {
        if (!isMounted.current) return;

        const location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        setUserLocation(location);
        setRouteLines(routes => [...routes, location]);
      },
      err => console.log(err),
      {enableHighAccuracy: false},
    );
  };

  const stopFollowUserLocation = () => {
    if (watchId.current) Geolocation.clearWatch(watchId.current);
  };

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
    userLocation,
    routeLines,
  };
};
