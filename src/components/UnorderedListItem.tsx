import React from 'react';
import { useTheme } from '@react-navigation/native';

import { View, Text, StyleSheet } from 'react-native';

function UnorderedListItem({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <View style={styles.listItem}>
      <View style={[styles.listDot, { backgroundColor: theme.colors.text }]} />
      <Text style={[styles.listText, { color: theme.colors.text }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    position: 'relative',
    paddingLeft: 28,
    marginBottom: 8,
  },
  listDot: {
    position: 'absolute',
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    top: 8.2,
    left: 10,
  },
  listText: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
});

export default UnorderedListItem;
