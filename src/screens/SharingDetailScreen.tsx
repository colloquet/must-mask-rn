import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Share,
  Image,
  Platform,
  Linking,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useTheme,
  RouteProp,
} from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';

import customMapStyle from 'src/assets/darkMapStyle.json';
import { MainStackParamList, SharingStatus, Sharing } from 'src/types';
import Section from 'src/components/Section';
import { FeatherHeaderButtons, Item } from 'src/components/HeaderButtons';
import { getLatLng, dateFormatter, showToast } from 'src/utils';
import * as API from 'src/api';
import { useAuthState } from 'src/AuthProvider';
import useReauthenticate from 'src/hooks/useReauthenticate';
import { useSettingsState, MapType } from 'src/SettingsProvider';

const { width } = Dimensions.get('screen');
const MAP_HEIGHT = width * 0.5625;

type SharingDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  'SharingDetail'
>;

function SharingDetailScreen() {
  const authState = useAuthState();
  const route: SharingDetailScreenRouteProp = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const reauthenticate = useReauthenticate();
  const { id: sharingId, from } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSharing, setIsFetchingSharing] = useState(false);
  const [sharing, setSharing] = useState<Sharing | null>(null);
  const { t } = useTranslation();
  const settingsState = useSettingsState();
  const { showActionSheetWithOptions } = useActionSheet();
  const [availableMapOptions, setAvailableMapOptions] = useState<string[]>([]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: t('sharingDetailScreen.sharingMaskDetail'),
        message: `https://mustmask.com/sharing/detail?id=${sharingId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  navigation.setOptions({
    title: t('sharingDetailScreen.sharingMaskDetail'),
    headerRight: () => (
      <FeatherHeaderButtons>
        <Item title="Share" iconName="share" onPress={handleShare} />
      </FeatherHeaderButtons>
    ),
  });

  useEffect(() => {
    const fetchSharing = async () => {
      try {
        setIsFetchingSharing(true);
        const { data } = await API.getSharingDetail(sharingId);
        setSharing(data);
      } catch (err) {
        Alert.alert(err.message || t('common.unknownError'));
      } finally {
        setIsFetchingSharing(false);
      }
    };

    fetchSharing();
  }, [sharingId, t]);

  useEffect(() => {
    const getOptions = async () => {
      const latlng = '1,1';
      let options = [t('common.cancel')];

      if (Platform.OS === 'ios') {
        options = ['Apple Maps', ...options];
      }

      const testUrl = Platform.select({
        ios: `comgooglemaps://?q=${latlng}&api=1&ll=${latlng}`,
        android: 'geo:0,0',
      });

      if (!testUrl) return [];

      const isGoogleMapInstalled = await Linking.canOpenURL(testUrl);
      if (isGoogleMapInstalled) {
        options = ['Google Maps', ...options];
      }

      setAvailableMapOptions(options);
    };

    getOptions();
  }, []);

  const openInMap = async () => {
    if (!sharing) return;

    const { latitude, longitude } = getLatLng(sharing);
    const latlng = `${latitude},${longitude}`;

    showActionSheetWithOptions(
      {
        options: availableMapOptions,
        cancelButtonIndex: availableMapOptions.length - 1,
      },
      buttonIndex => {
        let url = null;
        const name = availableMapOptions[buttonIndex];

        switch (name) {
          case 'Google Maps':
            url = Platform.select({
              ios: `comgooglemaps://?q=${latlng}&api=1&ll=${latlng}`,
              android: `geo:0,0?q=${latlng}`,
            });
            break;
          case 'Apple Maps':
            url = `http://maps.apple.com/?ll=${latlng}&q=Location`;
            break;
          default:
            break;
        }

        if (url) {
          Linking.openURL(url);
        }
      },
    );
  };

  const handleEndSharing = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await reauthenticate(API.endMySharing)(sharingId);
      if (from && from === 'MySharings') {
        navigation.navigate(from, { finishedId: sharingId });
      } else {
        navigation.goBack();
      }
      showToast(t('sharingDetailScreen.shareEndedSuccessMessage'));
    } catch (err) {
      Alert.alert(err.message || t('common.unknownError'));
      setIsLoading(false);
    }
  };

  const handleApplySharing = async () => {
    if (isLoading) return;
    if (!authState.isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    if (
      !authState.currentUser?.mobile ||
      !authState.currentUser.email ||
      !authState.currentUser?.mobile.trim() ||
      !authState.currentUser.email.trim()
    ) {
      Alert.alert(
        t('sharingDetailScreen.pleaseUpdateContactFirst'),
        undefined,
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.navigate('ManageContact'),
          },
        ],
      );
      return;
    }
    try {
      setIsLoading(true);
      const response = await reauthenticate(API.applySharing)(sharingId);
      if ('message' in response) {
        Alert.alert(response.message);
      } else {
        Alert.alert(t('sharingDetailScreen.shareApplySuccessMessage'));
      }
    } catch (err) {
      Alert.alert(err.message || t('common.unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  const confirmEnd = () => {
    Alert.alert(
      t('sharingDetailScreen.endShareConfirmMessage'),
      undefined,
      [
        {
          text: t('common.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('sharingDetailScreen.end'),
          onPress: () => handleEndSharing(),
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  };

  if (isFetchingSharing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!sharing) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ textAlign: 'center' }}>
          {t('sharingDetailScreen.shareNotFound')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <MapView
        key={theme.dark ? 'dark' : 'light'}
        style={{
          height: MAP_HEIGHT,
        }}
        initialRegion={{
          ...getLatLng(sharing),
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        provider={
          settingsState.mapType === MapType.GOOGLE ? PROVIDER_GOOGLE : undefined
        }
        customMapStyle={theme.dark ? customMapStyle : undefined}
        showsUserLocation
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsBuildings={false}
      >
        <Marker coordinate={getLatLng(sharing)} anchor={{ x: 0.5, y: 0.5 }}>
          <Image
            source={require('src/assets/logo.png')}
            style={{ height: 48, width: 48 }}
          />
        </Marker>
      </MapView>
      <Section style={{ marginTop: 0 }}>
        <Section.Item
          label={t('sharingDetailScreen.startTime')}
          value={dateFormatter(sharing.created_time)}
        />
        <Section.Separator />
        <Section.Item
          label={t('sharingDetailScreen.numberOfPack')}
          value={sharing.pack_number || '-'}
        />
        <Section.Separator />
        <Section.Item
          label={t('sharingDetailScreen.numberOfMaskPerPack')}
          value={sharing.per_pack_number || '-'}
        />
        <Section.Separator />
        <Section.Item
          label={t('sharingDetailScreen.price')}
          value={
            sharing.if_free
              ? (t('sharingDetailScreen.free') as string)
              : sharing.price
          }
        />
        <Section.Separator />
        <Section.Item
          label={t('sharingDetailScreen.remarks')}
          value={sharing.remarks || '-'}
          isParagraph
        />
      </Section>
      {(() => {
        const isMine = sharing.created_by === authState.currentUser?.uid;
        const isActive = sharing.status === SharingStatus.ACTIVE;

        if (isMine) {
          return (
            <>
              <Section>
                {isActive && (
                  <>
                    <Section.Button
                      label={t('sharingDetailScreen.showInMap')}
                      onPress={() =>
                        navigation.navigate('Map', {
                          location: getLatLng(sharing),
                        })
                      }
                      textStyle={{ color: theme.colors.primary }}
                    />
                    <Section.Separator type="full" />
                    <Section.Button
                      label={t('sharingDetailScreen.openInOtherMaps')}
                      onPress={openInMap}
                      textStyle={{ color: theme.colors.primary }}
                    />
                    <Section.Separator type="full" />
                  </>
                )}
                <Section.Button
                  label={t('sharingDetailScreen.viewApplicants')}
                  onPress={() =>
                    navigation.navigate('SharingContact', {
                      id: sharingId,
                    })
                  }
                  textStyle={{ color: theme.colors.primary }}
                />
              </Section>
              {isActive && (
                <Section>
                  <Section.Button
                    label={t('sharingDetailScreen.endThisShare')}
                    onPress={confirmEnd}
                    textStyle={{ color: '#dc3545' }}
                    isLoading={isLoading}
                  />
                </Section>
              )}
            </>
          );
        }

        return (
          <Section>
            {isActive ? (
              <>
                <Section.Button
                  label={t('sharingDetailScreen.showInMap')}
                  onPress={() =>
                    navigation.navigate('Map', {
                      location: getLatLng(sharing),
                    })
                  }
                  textStyle={{ color: theme.colors.primary }}
                />
                <Section.Separator type="full" />
                <Section.Button
                  label={t('sharingDetailScreen.openInOtherMaps')}
                  onPress={openInMap}
                  textStyle={{ color: theme.colors.primary }}
                />
                <Section.Separator type="full" />
                <Section.Button
                  label={t('sharingDetailScreen.iNeedThis')}
                  onPress={handleApplySharing}
                  textStyle={{ color: theme.colors.primary }}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <View
                style={{
                  height: 44,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.colors.text, fontSize: 16 }}>
                  {t('sharingDetailScreen.thisShareHasEnded')}
                </Text>
              </View>
            )}
          </Section>
        );
      })()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SharingDetailScreen;
