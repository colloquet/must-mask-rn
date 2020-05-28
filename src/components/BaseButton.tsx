import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  onPress: () => void | Promise<void>;
  buttonText: string;
  loadingButtonText?: string;
}

function BaseButton({
  style,
  isLoading,
  onPress,
  buttonText,
  loadingButtonText,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style, isLoading && styles.disabled]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading && <ActivityIndicator color="#fff" />}
      <Text style={styles.buttonText}>
        {isLoading ? buttonText || loadingButtonText : buttonText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.65,
  },
});

export default BaseButton;
