import React from 'react';
import { useTheme } from '@react-navigation/native';

import { Text, StyleSheet } from 'react-native';

function Paragraph({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <Text style={[styles.paragraph, { color: theme.colors.text }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    marginBottom: 16,
  },
});

export default Paragraph;
