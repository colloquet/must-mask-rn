import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Toast, { ToastOptions } from 'react-native-root-toast';
import moment from 'moment';

import { GeoCoordinates, Sharing } from './types';

export function getCurrentLocation(): Promise<GeoCoordinates | null> {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: Platform.select({
          ios: true,
          android: false,
        }),
      },
    );
  });
}

export function getLatLng(sharing: Sharing): GeoCoordinates {
  const [latitude, longitude] = [sharing.lat, sharing.lng].map(Number);
  return { latitude, longitude };
}

export function uniqBy(originalArray: any[], objKey: string) {
  const trimmedArray = [];
  const values = [];
  let value;

  for (let i = 0; i < originalArray.length; i += 1) {
    value = originalArray[i][objKey];

    if (values.indexOf(value) === -1) {
      trimmedArray.push(originalArray[i]);
      values.push(value);
    }
  }

  return trimmedArray;
}

export function dateFormatter(timestamp: string) {
  return moment(Number(timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss');
}

export function showToast(text: string, options: ToastOptions = {}) {
  Toast.show(text, {
    position: -160,
    shadow: false,
    backgroundColor: '#555',
    textColor: '#fff',
    ...options,
  });
}
