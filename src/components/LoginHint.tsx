import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Clipboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import AppleAuth, {
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

import { useAuthDispatch, authActions } from 'src/AuthProvider';
import LoadingOverlay from './LoadingOverlay';
import { showToast } from 'src/utils';

function LoginHint({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const authDispatch = useAuthDispatch();
  const { t } = useTranslation();

  const handleFBSignUp = useCallback(async () => {
    try {
      setIsLoading(true);
      LoginManager.logOut();
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        setIsLoading(false);
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      await authActions.facebookLogin(authDispatch, data);
      onSuccess();
    } catch (err) {
      Alert.alert(err.toString());
      setIsLoading(false);
    }
  }, [authDispatch, onSuccess]);

  const handleAppleSignUp = useCallback(async () => {
    try {
      setIsLoading(true);
      const appleAuthRequestResponse = await AppleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      const credentialState = await AppleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        console.log(appleAuthRequestResponse);
        const { identityToken, fullName } = appleAuthRequestResponse;
        if (identityToken) {
          await authActions.appleLogin(
            authDispatch,
            identityToken,
            fullName?.familyName ?? '',
          );
          onSuccess();
        }
      }
    } catch (err) {
      if (err.code !== AppleAuthError.CANCELED) {
        Alert.alert(err.toString());
      }
    } finally {
      setIsLoading(false);
    }
  }, [authDispatch, onSuccess]);

  const appleButtonBackgroundColor = theme.dark ? '#fff' : '#000';
  const appleButtonTextColor = theme.dark ? '#000' : '#fff';

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <View style={styles.container}>
        <Image source={require('src/assets/logo.png')} style={styles.logo} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('login.title')}
        </Text>

        {AppleAuth.isSupported && (
          <TouchableOpacity
            style={[
              styles.appleButton,
              {
                backgroundColor: appleButtonBackgroundColor,
              },
            ]}
            onPress={handleAppleSignUp}
          >
            <FontAwesomeIcon
              name="apple"
              size={24}
              color={appleButtonTextColor}
            />
            <Text style={[styles.buttonText, { color: appleButtonTextColor }]}>
              {t('login.signInWithApple')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.facebookButton}
          onPress={handleFBSignUp}
        >
          <FontAwesomeIcon name="facebook-square" size={24} color="#fff" />
          <Text style={styles.buttonText}>{t('login.signInWithFacebook')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

LoginHint.defaultProps = {
  onSuccess: () => {},
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  closeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 32,
  },
  title: { fontSize: 20, marginBottom: 32 },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    width: 280,
    marginBottom: 16,
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    width: 280,
    marginBottom: 100,
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    marginLeft: 16,
  },
});

export default LoginHint;
