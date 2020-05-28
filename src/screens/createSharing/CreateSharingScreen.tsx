import React from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { FeatherHeaderButtons, Item } from 'src/components/HeaderButtons';
import { useTranslation } from 'react-i18next';

import SharingForm from 'src/components/SharingForm';
import LoginHint from 'src/components/LoginHint';
import { useAuthState } from 'src/AuthProvider';

function CreateSharingScreen() {
  const navigation = useNavigation();
  const insets = useSafeArea();
  const { t } = useTranslation();
  const authState = useAuthState();

  navigation.setOptions({
    title: t('createSharingScreen.title'),
    headerRight: () => (
      <FeatherHeaderButtons>
        <Item title="Close" iconName="x" onPress={() => navigation.goBack()} />
      </FeatherHeaderButtons>
    ),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      contentContainerStyle={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? undefined : 'position'}
    >
      {authState.isLoggedIn ? (
        <ScrollView
          style={{ flex: 1 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <SharingForm
            onSuccess={sharing => {
              navigation.navigate('SharingDetail', { id: sharing.id });
            }}
          />
          <View style={{ height: insets.bottom }} />
        </ScrollView>
      ) : (
        <LoginHint />
      )}
    </KeyboardAvoidingView>
  );
}

export default CreateSharingScreen;
