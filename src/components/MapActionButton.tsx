import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';

function MapActionButton({
  icon,
  onPress,
  style,
}: {
  icon: string;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.actionButton,
        { backgroundColor: theme.colors.card },
        style,
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.actionButtonInner}>
        <FeatherIcons
          name={icon}
          size={24}
          color={theme.dark ? theme.colors.text : '#007bff'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    position: 'absolute',
    height: 56,
    width: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 1,
  },
  actionButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: 56,
  },
});

export default MapActionButton;
