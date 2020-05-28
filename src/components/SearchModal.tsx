import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Platform,
  ActivityIndicator,
} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useSafeArea } from 'react-native-safe-area-context';

import useDebounce from 'src/hooks/useDebounce';
import { geocode } from 'src/api';
import { Region } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';

export interface GeocodingObject {
  id: string;
  region: Region;
  name: string;
  formattedAddress: string;
}

function SearchModal({
  visible,
  onClose,
  onSelect,
  placeholder,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: GeocodingObject) => void;
  placeholder: string;
}) {
  const insets = useSafeArea();
  const input = useRef<TextInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingObject[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 500);
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        input.current?.focus();
      }, 100);
    }
  }, [visible]);

  useEffect(() => {
    setStatus(null);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    let showLoadingTimeout: number;

    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        showLoadingTimeout = setTimeout(() => {
          setIsLoading(true);
        }, 500);

        const { results, status } = await geocode(debouncedQuery);
        if (ignore) return;
        setSearchResults(results);
        setStatus(status);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
        if (showLoadingTimeout) {
          clearTimeout(showLoadingTimeout);
        }
      }
    };

    fetchResults();
    return () => {
      ignore = true;
      if (showLoadingTimeout) {
        clearTimeout(showLoadingTimeout);
      }
    };
  }, [debouncedQuery]);

  return (
    <Modal animationType="fade" visible={visible} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 0 : insets.top,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={styles.searchBarContainer}>
          <View
            style={[styles.searchBar, { borderColor: theme.colors.border }]}
          >
            <View style={styles.searchBarInner}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onClose}
              >
                <FeatherIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TextInput
                ref={input}
                value={query}
                onChangeText={setQuery}
                placeholder={placeholder}
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

        {(() => {
          if (isLoading) {
            return (
              <View style={{ padding: 16 }}>
                <ActivityIndicator />
              </View>
            );
          }

          if (!query.trim()) return null;

          if (status === 'ZERO_RESULTS') {
            return (
              <View style={{ padding: 16 }}>
                <Text style={{ color: theme.colors.text, textAlign: 'center' }}>
                  沒有找到「
                  <Text style={{ color: theme.colors.text }}>
                    {debouncedQuery}
                  </Text>
                  」的相關結果
                </Text>
              </View>
            );
          }

          return (
            <ScrollView
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
            >
              {Boolean(searchResults.length) && (
                <View
                  style={[
                    styles.searchResults,
                    { borderColor: theme.colors.border },
                  ]}
                >
                  {searchResults.map((result, index) => (
                    <React.Fragment key={result.id}>
                      <TouchableHighlight
                        onPress={() => onSelect(result)}
                        style={[
                          styles.searchResultItem,
                          index === 0 && {
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          },
                          index + 1 === searchResults.length && {
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                          },
                        ]}
                        underlayColor={theme.dark ? '#2c2c2d' : '#e5e5ea'}
                      >
                        <>
                          <FeatherIcons
                            style={{ paddingRight: 16 }}
                            name="map-pin"
                            size={24}
                            color="#999"
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 16,
                                marginBottom: 4,
                                color: theme.colors.text,
                              }}
                            >
                              {result.name}
                            </Text>
                            <Text
                              style={{ flex: 1, color: theme.colors.text }}
                              numberOfLines={1}
                            >
                              {result.formattedAddress}
                            </Text>
                          </View>
                        </>
                      </TouchableHighlight>
                      {index + 1 < searchResults.length && (
                        <View
                          style={[
                            styles.separator,
                            { borderBottomColor: theme.colors.border },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </ScrollView>
          );
        })()}
      </View>
    </Modal>
  );
}

SearchModal.defaultProps = {
  placeholder: '搜尋地址',
};

const styles = StyleSheet.create({
  searchBarContainer: {
    padding: 16,
  },
  searchBar: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  backButton: {
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 16,
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
  searchResults: {
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 56,
  },
});

export default SearchModal;
