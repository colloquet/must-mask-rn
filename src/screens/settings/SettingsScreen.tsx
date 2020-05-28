import React from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { useAuthDispatch, useAuthState, authActions } from 'src/AuthProvider';
import LoginHint from 'src/components/LoginHint';
import Section from 'src/components/Section';

function SettingsScreen() {
  const authState = useAuthState();
  const navigation = useNavigation();
  const authDispatch = useAuthDispatch();
  const { t } = useTranslation();

  navigation.setOptions({ title: t('settingsScreen.title') });

  const confirmLogout = () => {
    Alert.alert(
      t('settingsScreen.logoutConfirmMessage'),
      undefined,
      [
        {
          text: t('common.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('settingsScreen.logout'),
          onPress: () => authActions.logout(authDispatch, true),
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  };

  if (!authState.isLoggedIn) {
    return <LoginHint />;
  }

  return (
    <View>
      <Section>
        <Section.Item
          label={t('mySharingScreen.title')}
          onPress={() => navigation.navigate('MySharings')}
        />
        <Section.Separator />
        <Section.Item
          label={t('myAppliesScreen.title')}
          onPress={() => navigation.navigate('MyApplies')}
        />
        <Section.Separator />
        <Section.Item
          label={t('manageContactScreen.title')}
          onPress={() => navigation.navigate('ManageContact')}
        />
        <Section.Separator />
        <Section.Item
          label={t('languagePickerScreen.title')}
          onPress={() => navigation.navigate('LanguagePicker')}
        />
      </Section>
      <Section>
        {/* <Section.Item
          label={t('aboutUsScreen.title')}
          onPress={() => navigation.navigate('AboutUs')}
        />
        <Section.Separator /> */}
        <Section.Item
          label={t('privacyScreen.title')}
          onPress={() => navigation.navigate('Privacy')}
        />
      </Section>
      <Section>
        <Section.Button
          label={t('settingsScreen.logout')}
          onPress={confirmLogout}
          textStyle={styles.danger}
        />
      </Section>
      <View style={styles.copyright}>
        <Text style={styles.copyrightText}>
          © Must Mask {moment().format('YYYY')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  danger: { color: '#dc3545' },
  copyright: { padding: 32 },
  copyrightText: { color: '#999', textAlign: 'center' },
});

export default SettingsScreen;
