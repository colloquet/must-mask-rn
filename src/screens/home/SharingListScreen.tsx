import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {
  useNavigation,
  useTheme,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useSafeArea } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { MapStackParamList } from 'src/types';
import { dateFormatter } from 'src/utils';

type SharingListScreenRouteProp = RouteProp<MapStackParamList, 'SharingList'>;

function SharingListScreen() {
  const navigation = useNavigation();
  const route: SharingListScreenRouteProp = useRoute();
  const theme = useTheme();
  const insets = useSafeArea();
  const { t } = useTranslation();

  const { sharingList } = route.params;

  navigation.setOptions({
    title: t('sharingListScreen.title'),
    contentStyle: {
      backgroundColor: theme.dark ? theme.colors.background : '#fff',
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        data={sharingList}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={<View style={{ height: insets.bottom }} />}
        renderItem={({ item: sharing }) => {
          return (
            <>
              <TouchableHighlight
                onPress={() =>
                  navigation.navigate('SharingDetail', { id: sharing.id })
                }
                style={styles.container}
                underlayColor={theme.dark ? '#2c2c2d' : '#e5e5ea'}
              >
                <>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.date,
                        { color: theme.dark ? '#98989e' : '#8a8a8d' },
                      ]}
                    >
                      {dateFormatter(sharing.created_time)}
                    </Text>
                    <Text
                      style={[styles.remark, { color: theme.colors.text }]}
                      numberOfLines={1}
                    >
                      {sharing.remarks || '-'}
                    </Text>
                    <View style={styles.meta}>
                      <Text
                        style={{
                          color: theme.dark ? '#98989e' : '#8a8a8d',
                          marginRight: 16,
                          marginBottom: 8,
                        }}
                      >
                        {t('sharingDetailScreen.numberOfPack')}：
                        <Text
                          style={[styles.figure, { color: theme.colors.text }]}
                        >
                          {sharing.pack_number || '-'}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          color: theme.dark ? '#98989e' : '#8a8a8d',
                          marginRight: 16,
                          marginBottom: 8,
                        }}
                      >
                        {t('sharingDetailScreen.numberOfMaskPerPack')}：
                        <Text
                          style={[styles.figure, { color: theme.colors.text }]}
                        >
                          {sharing.per_pack_number || '-'}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          color: theme.dark ? '#98989e' : '#8a8a8d',
                          marginRight: 16,
                          marginBottom: 8,
                        }}
                      >
                        {t('sharingDetailScreen.price')}：
                        <Text
                          style={[styles.figure, { color: theme.colors.text }]}
                        >
                          {sharing.if_free
                            ? t('sharingDetailScreen.free')
                            : sharing.price}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <FeatherIcons
                    name="chevron-right"
                    size={24}
                    color={theme.dark ? '#656569' : '#c4c4c6'}
                  />
                </>
              </TouchableHighlight>
              <View
                style={[
                  styles.separator,
                  { borderBottomColor: theme.dark ? '#39393c' : '#ccccce' },
                ]}
              />
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  remark: {
    fontSize: 18,
  },
  meta: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: -8,
  },
  figure: {
    color: '#000',
  },
});

export default SharingListScreen;
