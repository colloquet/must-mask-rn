import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import SharingListItem from 'src/components/SharingListItem';
import LoginHint from 'src/components/LoginHint';
import { Sharing } from 'src/types';
import { useAuthState } from 'src/AuthProvider';
import * as API from 'src/api';
import useReauthenticate from 'src/hooks/useReauthenticate';

function MyAppliesScreen() {
  const authState = useAuthState();
  const navigation = useNavigation();
  const theme = useTheme();
  const reauthenticate = useReauthenticate();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sharingList, setSharingList] = useState<Sharing[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { t } = useTranslation();

  navigation.setOptions({
    title: t('myAppliesScreen.title'),
    contentStyle: {
      backgroundColor: theme.dark ? theme.colors.background : '#fff',
    },
  });

  const fetchMyApplies = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const { data = [], _meta } = await reauthenticate(API.getMyApplies)(
          page,
        );
        setSharingList(
          data.map((item: any) => ({
            ...item.sharing,
            id: item.sharing_id,
            created_time: item.created_at,
          })),
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
    await fetchMyApplies();
    setIsRefreshing(false);
  }, [fetchMyApplies]);

  useEffect(() => {
    if (authState.isLoggedIn) {
      fetchMyApplies();
    }
  }, [fetchMyApplies, authState.isLoggedIn]);

  if (!authState.isLoggedIn) {
    return <LoginHint />;
  }

  return (
    <FlatList
      data={sharingList}
      keyExtractor={item => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      renderItem={({ item }) => (
        <SharingListItem
          sharing={item}
          onPress={() =>
            navigation.navigate('SharingDetail', {
              id: item.id,
            })
          }
        />
      )}
      ListFooterComponent={() => {
        if (isLoading) {
          return (
            <View style={styles.loaderContainer}>
              <ActivityIndicator />
            </View>
          );
        }

        if (!sharingList.length) {
          return (
            <View style={{ padding: 16 }}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                {t('myAppliesScreen.noFinishedAppliesYet')}
              </Text>
            </View>
          );
        }

        if (sharingList.length < totalCount) {
          return (
            <TouchableOpacity
              style={styles.loadMoreContainer}
              onPress={() => fetchMyApplies(currentPage + 1)}
            >
              <Text style={{ color: theme.colors.primary }}>
                {t('mySharingScreen.loadMore')}
              </Text>
            </TouchableOpacity>
          );
        }

        return <View style={{ height: 32 }} />;
      }}
    />
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 32,
    paddingBottom: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    lineHeight: 16 * 1.2,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadMoreContainer: {
    padding: 32,
    paddingBottom: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyAppliesScreen;
