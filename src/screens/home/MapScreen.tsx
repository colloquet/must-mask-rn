import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  useNavigation,
  useTheme,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import MapView, {
  Marker,
  LatLng,
  Region,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { useSafeArea } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import customMapStyle from 'src/assets/darkMapStyle.json';
import { Sharing, MapStackParamList } from 'src/types';
import SearchBar from 'src/components/SearchBar';
import ClusteredMapView from 'src/components/cluster/ClusteredMapView';
import MapActionButton from 'src/components/MapActionButton';
import { getCurrentLocation, getLatLng, showToast, uniqBy } from 'src/utils';
import { useSettingsState, MapType } from 'src/SettingsProvider';
import * as API from 'src/api';

type SharingListScreenRouteProp = RouteProp<MapStackParamList, 'Map'>;

const PAN_DURATION = 500;
const INITIAL_REGION = {
  latitude: 22.36271566813332,
  longitude: 114.1591140845411,
  latitudeDelta: 1,
  longitudeDelta: 1,
};
const EDGE_PADDING = {
  top: 100,
  right: 50,
  bottom: 100,
  left: 50,
};

function MapScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeArea();
  const route: SharingListScreenRouteProp = useRoute();
  const { t } = useTranslation();
  const settingsState = useSettingsState();

  // --- MAP --- //
  const map = useRef<MapView | null>(null);

  const linkMapRef = useCallback((ref) => (map.current = ref), []);

  const panToLocation = useCallback((location: LatLng) => {
    map.current?.animateToRegion(
      {
        ...location,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      PAN_DURATION,
    );
  }, []);

  const panToRegion = useCallback((region: Region) => {
    map.current?.animateToRegion(region, PAN_DURATION);
  }, []);

  const goToCurrentLocation = useCallback(async () => {
    const currentLocation = await getCurrentLocation();
    if (currentLocation) {
      panToLocation(currentLocation);
    } else {
      showToast(t('mapScreen.getLocationFailMessage'), {
        duration: 500,
      });
    }
  }, [panToLocation, t]);

  useEffect(() => {
    if (route.params?.location) {
      setTimeout(() => {
        panToLocation(route.params.location);
      }, 500);
    }
  }, [route.params, panToLocation]);

  // --- Sharing --- //
  const [sharingList, setSharingList] = useState<Sharing[]>([]);

  const handleGetNearbySharings = useCallback(async (region) => {
    try {
      const { data } = await API.getNearbySharings(region);
      if (!data.length) return;

      const dataWithCacheTimestamp = data.map((sharing) => ({
        ...sharing,
        __cacheTimestamp: Date.now(),
      }));
      setSharingList((prev) => {
        const prevWithinCacheTimeRange = prev.filter(
          (sharing) => Date.now() - sharing.__cacheTimestamp < 1000 * 60 * 5,
        );

        return uniqBy(
          [...dataWithCacheTimestamp, ...prevWithinCacheTimeRange],
          'id',
        );
      });
    } catch (e) {}
  }, []);

  const handleShowListView = useCallback(
    (sharings: Sharing[]) => {
      navigation.navigate('SharingList', { sharingList: sharings });
    },
    [navigation],
  );

  console.log(sharingList);

  // --- Render --- //
  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <View style={[styles.searchBarContainer, { top: insets.top }]}>
        <SearchBar
          placeholder={t('mapScreen.searchPlaceholder')}
          onSelect={(result) => {
            panToRegion(result.region);
          }}
        />
      </View>
      <ClusteredMapView
        key={theme.dark ? 'dark' : 'light'}
        mapRef={linkMapRef}
        provider={
          settingsState.mapType === MapType.GOOGLE ? PROVIDER_GOOGLE : undefined
        }
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsBuildings={false}
        edgePadding={EDGE_PADDING}
        customMapStyle={theme.dark ? customMapStyle : undefined}
        onRegionChangeComplete={handleGetNearbySharings}
        paddingAdjustmentBehavior="never"
        onMapReady={goToCurrentLocation}
        onShowListView={handleShowListView}
      >
        {sharingList.map((sharing) => (
          <Marker
            key={sharing.id}
            coordinate={getLatLng(sharing)}
            // @ts-ignore
            sharing={sharing}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() =>
              navigation.navigate('SharingDetail', { id: sharing.id })
            }
          >
            <Image
              source={require('src/assets/logo.png')}
              style={{ height: 48, width: 48 }}
            />
          </Marker>
        ))}
      </ClusteredMapView>

      <MapActionButton
        icon="navigation-2"
        onPress={goToCurrentLocation}
        style={{ bottom: 32 + 16, right: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  callout: {
    width: 150,
  },
  calloutRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calloutLabel: {
    fontSize: 14,
    color: '#555',
  },
  calloutValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  searchBarContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    padding: 16,
    zIndex: 1,
  },
});

export default MapScreen;
