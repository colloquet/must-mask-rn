import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  useNavigation,
  useTheme,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import SharingListItem from 'src/components/SharingListItem';
import BaseButton from 'src/components/BaseButton';
import LoginHint from 'src/components/LoginHint';
import { FeatherHeaderButtons, Item } from 'src/components/HeaderButtons';
import { Sharing, SharingStatus, SettingsStackParamList } from 'src/types';
import { useAuthState } from 'src/AuthProvider';
import * as API from 'src/api';
import useReauthenticate from 'src/hooks/useReauthenticate';

type MySharingsScreenRouteProp = RouteProp<
  SettingsStackParamList,
  'MySharings'
>;

function MySharingsScreen() {
  const authState = useAuthState();
  const navigation = useNavigation();
  const route: MySharingsScreenRouteProp = useRoute();
  const theme = useTheme();
  const reauthenticate = useReauthenticate();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeList, setActiveList] = useState<Sharing[]>([]);
  const [finishedList, setFinishedList] = useState<Sharing[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { t } = useTranslation();

  navigation.setOptions({
    title: t('mySharingScreen.title'),
    contentStyle: {
      backgroundColor: theme.dark ? theme.colors.background : '#fff',
    },
    headerRight: () => (
      <FeatherHeaderButtons>
        <Item
          title="Info"
          iconName="info"
          onPress={() => navigation.navigate('SharingRules')}
        />
      </FeatherHeaderButtons>
    ),
  });

  const fetchMySharings = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const { data = [], _meta } = await reauthenticate(API.getMySharings)(
          page,
        );
        const _activeList = data.filter(
          sharing => sharing.status === SharingStatus.ACTIVE,
        );
        const _finishedList = data.filter(
          sharing => sharing.status === SharingStatus.ENDED,
        );
        setActiveList(prev =>
          page === 1 ? _activeList : [...prev, ..._activeList],
        );
        setFinishedList(prev =>
          page === 1 ? _finishedList : [...prev, ..._finishedList],
        );
        setTotalCount(_meta?.totalCount ?? 0);
        setCurrentPage(page);
      } catch (err) {
        Alert.alert(err.message || t('common.unknownError'));
      } finally {
        setIsLoading(false);
      }
    },
    [reauthenticate, t],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMySharings();
    setIsRefreshing(false);
  }, [fetchMySharings]);

  useEffect(() => {
    if (authState.isLoggedIn) {
      fetchMySharings();
    }
  }, [fetchMySharings, authState.isLoggedIn]);

  useEffect(() => {
    if (route.params?.finishedId) {
      handleRefresh();
    }
  }, [route.params, handleRefresh]);

  if (!authState.isLoggedIn) {
    return <LoginHint />;
  }

  const sections = [
    {
      key: 'active',
      title: t('mySharingScreen.active'),
      data: activeList,
    },
    {
      key: 'finished',
      title: t('mySharingScreen.finished'),
      data: finishedList,
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      stickySectionHeadersEnabled
      renderItem={({ item, index, section }) => (
        <SharingListItem
          sharing={item}
          onPress={() =>
            navigation.navigate('SharingDetail', {
              id: item.id,
              from: 'MySharings',
            })
          }
          isLast={
            section.key === 'active' ? index + 1 === section.data.length : false
          }
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View
          style={[
            styles.sectionHeader,
            { backgroundColor: theme.dark ? '#323233' : '#e5e5e5' },
          ]}
        >
          <Text
            style={[
              styles.sectionText,
              { color: theme.dark ? '#fff' : '#000' },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
      renderSectionFooter={({ section: { key, data } }) => {
        if (key === 'active' && !data.length) {
          return (
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  lineHeight: 16 * 1.2,
                  marginBottom: 8,
                  color: theme.colors.text,
                }}
              >
                {t('mySharingScreen.active.emptyPlaceholder')}
              </Text>
              <BaseButton
                buttonText={t('mySharingScreen.active.emptyPlaceholderAction')}
                onPress={() => navigation.navigate('CreateSharing')}
              />
            </View>
          );
        } else if (key === 'finished') {
          if (isLoading) {
            return (
              <View
                style={{
                  padding: 32,
                  paddingBottom: 64,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator />
              </View>
            );
          }

          if (!data.length) {
            return (
              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    lineHeight: 16 * 1.2,
                    marginBottom: 8,
                    color: theme.colors.text,
                  }}
                >
                  {t('mySharingScreen.noFinishedSharingYet')}
                </Text>
              </View>
            );
          }

          if (activeList.length + finishedList.length < totalCount) {
            return (
              <TouchableOpacity
                style={{
                  padding: 32,
                  paddingBottom: 64,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => fetchMySharings(currentPage + 1)}
              >
                <Text style={{ color: theme.colors.primary }}>
                  {t('mySharingScreen.loadMore')}
                </Text>
              </TouchableOpacity>
            );
          }

          return <View style={{ height: 32 }} />;
        }

        return null;
      }}
    />
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  sectionText: {
    color: 'rgb(109, 109, 114)',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MySharingsScreen;
