import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import BaseInput from 'src/components/BaseInput';
import { useAuthState, authActions, useAuthDispatch } from 'src/AuthProvider';
import BaseButton from 'src/components/BaseButton';
import LoginHint from 'src/components/LoginHint';
import useReauthenticate from 'src/hooks/useReauthenticate';

function ManageContactScreen() {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const reauthenticate = useReauthenticate();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(authState.currentUser?.email ?? '');
  const [mobile, setMobile] = useState(authState.currentUser?.mobile ?? '');
  const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

  navigation.setOptions({
    title: t('manageContactScreen.title'),
  });

  const handleSubmit = async () => {
    try {
      const errors: Record<string, string> = {};
      if (!email.trim()) {
        errors.email = t('manageContactScreen.emailCannotBeBlank');
      }
      if (!mobile.trim()) {
        errors.mobile = t('manageContactScreen.mobileCannotBeBlank');
      }
      if (Object.keys(errors).length) {
        setErrorMessage(errors);
        return;
      }

      if (
        email === authState.currentUser?.email &&
        mobile === authState.currentUser?.mobile
      ) {
        navigation.goBack();
        return;
      }

      setIsLoading(true);
      await reauthenticate(authActions.updateCurrentUser)(authDispatch, {
        email,
        mobile,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert(err.toString());
      setIsLoading(false);
    }
  };

  if (!authState.currentUser) return <LoginHint />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      contentContainerStyle={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? undefined : 'padding'}
    >
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 16 }}>
          <View
            style={[
              styles.infoContainer,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text
              style={[
                styles.info,
                {
                  fontWeight: 'bold',
                  color: theme.colors.text,
                },
              ]}
            >
              {t('manageContactScreen.p2')}
            </Text>
          </View>

          <View style={styles.formControl}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('manageContactScreen.email')}
              <Text style={styles.subLabel}>
                （{t('manageContactScreen.emailSubtitle')}）
              </Text>
            </Text>
            <BaseInput
              value={email}
              onChangeText={setEmail}
              disabled={isLoading}
              errorMessage={errorMessage.email}
            />
          </View>

          <View style={styles.formControl}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('manageContactScreen.mobile')}
              <Text style={styles.subLabel}>
                （{t('manageContactScreen.mobileSubtitle')}）
              </Text>
            </Text>
            <BaseInput
              value={mobile}
              keyboardType="number-pad"
              onChangeText={setMobile}
              disabled={isLoading}
              errorMessage={errorMessage.mobile}
            />
          </View>

          <BaseButton
            isLoading={isLoading}
            buttonText={t('manageContactScreen.submit')}
            loadingButtonText={t('manageContactScreen.submitting')}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  info: { fontSize: 16, lineHeight: 16 * 1.2 },
  infoContainer: { backgroundColor: '#f5f7f9', padding: 16, marginBottom: 16 },
  formControl: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 16 * 1.2,
  },
  subLabel: {
    fontSize: 14,
  },
});

export default ManageContactScreen;
