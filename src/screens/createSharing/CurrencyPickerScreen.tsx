import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  useNavigation,
  useTheme,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import currencyCodes from 'currency-codes/data';
import { useSafeArea } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { CreateSharingStackParamList } from 'src/types';

type CurrencyPickerScreenRouteProp = RouteProp<
  CreateSharingStackParamList,
  'CreateSharing'
>;

const FREQUENTLY_USED_CODES = [
  'HKD',
  'MOP',
  'TWD',
  'CNY',
  'AUD',
  'CHF',
  'DKK',
  'EUR',
  'GBP',
  'IRR',
  'JPY',
  'KRW',
  'MYR',
  'NOK',
  'SEK',
  'USD',
];

function CurrencyPickerScreen() {
  const navigation = useNavigation();
  const route: CurrencyPickerScreenRouteProp = useRoute();
  const input = useRef<TextInput | null>(null);
  const theme = useTheme();
  const insets = useSafeArea();
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const { selectedCode } = route.params;

  navigation.setOptions({
    title: t('currencyPickerScreen.title'),
    contentStyle: {
      backgroundColor: theme.dark ? theme.colors.background : '#fff',
    },
  });

  const allCurrencies = useMemo(() => {
    const frequentlyUsedCurrencies = FREQUENTLY_USED_CODES.map((code) =>
      currencyCodes.find((item) => item.code === code),
    ).filter(Boolean);
    const remainingCurrencies = currencyCodes.filter(
      (currency) => FREQUENTLY_USED_CODES.indexOf(currency.code) === -1,
    );
    return [...frequentlyUsedCurrencies, ...remainingCurrencies];
  }, []);

  const filteredData = useMemo(() => {
    if (!query.trim()) return allCurrencies;
    return allCurrencies.filter(
      (item) =>
        item.code.toLowerCase().includes(query.toLowerCase()) ||
        item.currency.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, allCurrencies]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBarContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.dark
                ? theme.colors.card
                : theme.colors.background,
            },
          ]}
        >
          <View style={styles.searchBarInner}>
            <View
              style={{
                justifyContent: 'center',
                height: 36,
                paddingHorizontal: 8,
              }}
            >
              <FeatherIcons name="search" size={20} color="#999" />
            </View>
            <TextInput
              ref={input}
              value={query}
              onChangeText={setQuery}
              placeholder={t('currencyPickerScreen.search')}
              style={[styles.searchInput, { color: theme.colors.text }]}
            />
            {Boolean(query.trim()) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setQuery('');
                  input.current?.focus();
                }}
              >
                <FeatherIcons name="x" size={24} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        data={filteredData}
        keyExtractor={(item) => item.code}
        ListFooterComponent={<View style={{ height: insets.bottom }} />}
        renderItem={({ item }) => {
          const isActive = item.code === selectedCode;
          return (
            <>
              <TouchableHighlight
                onPress={() =>
                  navigation.navigate('CreateSharing', {
                    selectedCode: item.code,
                  })
                }
                style={styles.item}
                underlayColor={theme.dark ? '#2c2c2d' : '#e5e5ea'}
              >
                <>
                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: isActive
                          ? theme.colors.primary
                          : theme.colors.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.code} - {item.currency}
                  </Text>
                  {isActive && (
                    <FeatherIcons
                      name="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  searchBarContainer: {
    padding: 16,
  },
  searchBar: {
    borderRadius: 8,
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 0,
  },
  clearButton: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});

export default CurrencyPickerScreen;
