import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';

import LoginHint from 'src/components/LoginHint';

function LoginScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <FeatherIcons name="x" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      <LoginHint
        onSuccess={() => {
          setTimeout(() => {
            navigation.goBack();
          }, 0);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
  },
});

export default LoginScreen;
