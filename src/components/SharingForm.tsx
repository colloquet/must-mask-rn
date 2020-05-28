import React, {
  useState,
  useRef,
  useImperativeHandle,
  RefForwardingComponent,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, {
  Camera,
  PROVIDER_GOOGLE,
  Region,
  LatLng,
} from 'react-native-maps';
import {
  useTheme,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';

import customMapStyle from 'src/assets/darkMapStyle.json';
import { Sharing, CreateSharingStackParamList, SharingStatus } from 'src/types';
import BaseInput from './BaseInput';
import BaseButton from './BaseButton';
import * as API from 'src/api';
import useReauthenticate from 'src/hooks/useReauthenticate';
import SearchBar from './SearchBar';
import MapActionButton from './MapActionButton';
import { showToast, getCurrentLocation } from 'src/utils';
import { useSettingsState, MapType } from 'src/SettingsProvider';

const deviceWidth = Dimensions.get('window').width;
const innerMapHeight = (deviceWidth - 32) * 1;

interface SharingFormProps {
  onSuccess: (sharing: Sharing) => void;
}

export interface SharingFormHandles {
  setMapPosition: (camera: Camera) => void;
}

type CreateSharingScreenRouteProp = RouteProp<
  CreateSharingStackParamList,
  'CreateSharing'
>;

const PAN_DURATION = 500;
const INITIAL_REGION = {
  latitude: 22.36271566813332,
  longitude: 114.1591140845411,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

const SharingForm: RefForwardingComponent<
  SharingFormHandles,
  SharingFormProps
> = ({ onSuccess }: SharingFormProps, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfPack, setNumberOfPack] = useState('');
  const [numberOfMaskInEachPack, setNumberOfMaskInEachPack] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState('HKD');
  const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});
  const map = useRef<MapView | null>(null);
  const theme = useTheme();
  const reauthenticate = useReauthenticate();
  const navigation = useNavigation();
  const route: CreateSharingScreenRouteProp = useRoute();
  const { t } = useTranslation();
  const settingsState = useSettingsState();

  useEffect(() => {
    reauthenticate(API.getMySharings)(1).then(({ data }) => {
      const activeSharing = data.find(
        sharing => sharing.status === SharingStatus.ACTIVE,
      );
      if (activeSharing) {
        Alert.alert(t('createSharingScreen.onlyOneShareAtATime'), undefined, [
          {
            text: t('createSharingScreen.viewSharing'),
            onPress: () =>
              navigation.navigate('SharingDetail', { id: activeSharing.id }),
          },
          { text: t('common.ok'), onPress: () => navigation.goBack() },
        ]);
      }
    });
  }, [reauthenticate, navigation, t]);

  useEffect(() => {
    AsyncStorage.getItem('currency').then(value => {
      setCurrency(value || 'HKD');
    });
  }, []);

  useEffect(() => {
    if (!currency) return;
    AsyncStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    if (route.params?.selectedCode) {
      setCurrency(route.params.selectedCode);
    }
  }, [route.params]);

  const resetForm = () => {
    setNumberOfPack('');
    setNumberOfMaskInEachPack('');
    setIsFree(true);
    setPrice('');
    setNote('');
    setErrorMessage({});
    setIsLoading(false);
  };

  useImperativeHandle(ref, () => ({
    setMapPosition: camera => {
      if (map.current) {
        map.current.setCamera(camera);
      }
    },
  }));

  useEffect(() => {
    if (isFree) {
      setPrice('');
    }
  }, [isFree]);

  const handleCreateSharing = useCallback(async () => {
    if (!map.current) return;

    try {
      setIsLoading(true);
      setErrorMessage({});

      const errors: Record<string, string> = {};
      if (!numberOfPack.trim() || Number(numberOfPack) < 1) {
        errors.numberOfPack = t('createSharingScreen.cannotBeLessThan1Pack');
      }
      if (
        !numberOfMaskInEachPack.trim() ||
        Number(numberOfMaskInEachPack) < 1
      ) {
        errors.numberOfMaskInEachPack = t(
          'createSharingScreen.cannotBeLessThan1Mask',
        );
      }
      if (!isFree && !price.trim()) {
        errors.price = t('createSharingScreen.priceCannotBeBlank');
      }
      if (Object.keys(errors).length) {
        setErrorMessage(errors);
        return;
      }

      const camera = await map.current.getCamera();
      const { data } = await reauthenticate(API.createSharing)({
        lat: camera.center.latitude,
        lng: camera.center.longitude,
        pack_number: Number(numberOfPack),
        per_pack_number: Number(numberOfMaskInEachPack),
        if_free: isFree ? 1 : 0,
        price: isFree ? '' : `${currency} ${price}`,
        remarks: note,
      });
      onSuccess(data);
      showToast(t('createSharingScreen.postSuccess'));
      resetForm();
    } catch (err) {
      let message = err.message || t('common.unknownError');
      if (err.message && typeof err.message === 'object') {
        message = Object.keys(err.message)
          .map(key => err.message[key])
          .reduce((rest, current) => [...rest, ...current], [])
          .join('\n');
      }
      Alert.alert(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    reauthenticate,
    onSuccess,
    isFree,
    numberOfPack,
    numberOfMaskInEachPack,
    price,
    note,
    currency,
    t,
  ]);

  const panToRegion = useCallback((region: Region) => {
    map.current?.animateToRegion(region, PAN_DURATION);
  }, []);

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

  return (
    <View
      style={[styles.content, { backgroundColor: theme.colors.background }]}
    >
      <View style={{ position: 'relative', marginBottom: 16 }}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            onSelect={result => panToRegion(result.region)}
            placeholder={t('createSharingScreen.searchAddress')}
          />
        </View>
        <MapView
          ref={map}
          key={theme.dark ? 'dark' : 'light'}
          provider={
            settingsState.mapType === MapType.GOOGLE
              ? PROVIDER_GOOGLE
              : undefined
          }
          style={{ height: innerMapHeight, borderRadius: 14 }}
          customMapStyle={theme.dark ? customMapStyle : undefined}
          showsCompass={false}
          showsScale={false}
          showsMyLocationButton={false}
          showsIndoorLevelPicker={false}
          showsIndoors={false}
          showsBuildings={false}
          initialRegion={INITIAL_REGION}
          onMapReady={goToCurrentLocation}
          showsUserLocation
        />
        <View style={styles.pinContainer} pointerEvents="none">
          <Image source={require('src/assets/pin.png')} style={styles.pin} />
        </View>
        <MapActionButton
          icon="navigation-2"
          onPress={goToCurrentLocation}
          style={{ bottom: 8, right: 8 }}
        />
      </View>

      <View style={styles.formControl}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t('createSharingScreen.howManyPack')}
        </Text>
        <BaseInput
          keyboardType="number-pad"
          value={numberOfPack}
          onChangeText={setNumberOfPack}
          disabled={isLoading}
          errorMessage={errorMessage.numberOfPack}
        />
      </View>

      <View style={styles.formControl}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t('createSharingScreen.howManyMaskPerPack')}
        </Text>
        <BaseInput
          keyboardType="number-pad"
          value={numberOfMaskInEachPack}
          onChangeText={setNumberOfMaskInEachPack}
          disabled={isLoading}
          errorMessage={errorMessage.numberOfMaskInEachPack}
        />
      </View>

      <View style={styles.formControl}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t('createSharingScreen.isItFree')}
        </Text>
        <View style={styles.radioItem}>
          <TouchableOpacity
            style={styles.radioItemInner}
            onPress={() => setIsFree(true)}
          >
            <View
              style={[styles.radio, { backgroundColor: theme.colors.card }]}
            >
              {isFree && (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: theme.colors.text },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
              {t('createSharingScreen.freeSharing')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.radioItem}>
          <TouchableOpacity
            style={styles.radioItemInner}
            onPress={() => setIsFree(false)}
          >
            <View
              style={[styles.radio, { backgroundColor: theme.colors.card }]}
            >
              {isFree || (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: theme.colors.text },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
              {t('createSharingScreen.costPriceSharing')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formControl}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t('createSharingScreen.pricePerPack')}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View
            pointerEvents={isLoading || isFree ? 'none' : 'auto'}
            style={{
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              opacity: isLoading || isFree ? 0.5 : 1,
              height: 40,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: 12,
              }}
              onPress={() =>
                navigation.navigate('CurrencyPicker', {
                  selectedCode: currency,
                })
              }
            >
              <Text style={{ color: theme.colors.text }}>{currency}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <BaseInput
              style={{
                flex: 1,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              placeholder={t('createSharingScreen.pricePlaceholder')}
              keyboardType="number-pad"
              value={price}
              onChangeText={text => setPrice(numeral(text).format('0,0'))}
              disabled={isLoading || isFree}
              errorMessage={errorMessage.price}
            />
          </View>
        </View>
      </View>

      <View style={styles.formControl}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t('createSharingScreen.remarks')}
        </Text>
        <BaseInput
          placeholder={t('createSharingScreen.remarksPlaceholder')}
          value={note}
          onChangeText={setNote}
          disabled={isLoading}
        />
      </View>

      <BaseButton
        isLoading={isLoading}
        buttonText={t('createSharingScreen.post')}
        loadingButtonText={t('createSharingScreen.posting')}
        onPress={handleCreateSharing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  stepsContainer: { backgroundColor: '#f5f7f9', padding: 16 },
  stepTitle: {
    fontWeight: 'bold',
  },
  step: { fontSize: 14, marginBottom: 4, lineHeight: 20 },
  pinContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  pin: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: 30,
    width: 30,
    zIndex: 1,
    marginLeft: -15,
    marginTop: -30,
  },
  formControl: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
  },
  input: {
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ced4da',
    paddingHorizontal: 12,
    color: '#000',
  },
  radioItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    position: 'relative',
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 8,
    marginVertical: 4,
  },
  radioInner: {
    position: 'absolute',
    borderRadius: 4,
    backgroundColor: '#000',
    height: 8,
    width: 8,
    top: '50%',
    left: '50%',
    marginLeft: -4,
    marginTop: -4,
  },
  radioLabel: {
    fontSize: 16,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 0,
    padding: 8,
    width: '100%',
    zIndex: 1,
  },
});

export default React.forwardRef(SharingForm);
