import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';

import SearchModal, { GeocodingObject } from './SearchModal';

function SearchBar({
  onSelect,
  placeholder,
}: {
  onSelect: (result: GeocodingObject) => void;
  placeholder: string;
}) {
  const theme = useTheme();
  const [searchName, setSearchName] = useState<string | null>(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const placeholderColor = searchName ? theme.colors.text : '#999';
  return (
    <>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.card,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.searchBarInner}
          onPress={() => setSearchModalVisible(true)}
          activeOpacity={0.5}
        >
          <FeatherIcons name="search" size={24} color={theme.colors.text} />
          <Text
            style={[styles.searchBarPlaceholder, { color: placeholderColor }]}
            numberOfLines={1}
          >
            {searchName || placeholder}
          </Text>
        </TouchableOpacity>
      </View>
      <SearchModal
        visible={searchModalVisible}
        placeholder={placeholder}
        onClose={() => {
          setSearchModalVisible(false);
          setSearchName(null);
        }}
        onSelect={result => {
          setSearchModalVisible(false);
          setTimeout(() => {
            onSelect(result);
            setSearchName(result.name);
          }, 500);
        }}
      />
    </>
  );
}

SearchBar.defaultProps = {
  placeholder: '搜尋地址',
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
  },
  searchBarPlaceholder: {
    marginLeft: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default SearchBar;
