import React from 'react';
import { View, Text } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Appearance } from 'react-native-appearance';
import FeatherIcons from 'react-native-vector-icons/Feather';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // componentDidCatch(error, errorInfo) {
  //   // You can also log the error to an error reporting service
  //   logErrorToMyService(error, errorInfo);
  // }

  render() {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background,
          }}
        >
          <FeatherIcons
            name="alert-circle"
            size={24}
            color={theme.colors.text}
          />
          <Text
            style={{
              color: theme.colors.text,
              marginTop: 8,
              textAlign: 'center',
              lineHeight: 14 * 1.5,
            }}
          >
            遇到未知問題{'\n'}請聯繫我們取得協助
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
