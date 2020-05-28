import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import SettingsScreen from 'src/screens/settings/SettingsScreen';
import ManageContactScreen from 'src/screens/settings/ManageContactScreen';
import MySharingsScreen from 'src/screens/settings/MySharingsScreen';
import MyAppliesScreen from 'src/screens/settings/MyAppliesScreen';
import SharingRulesScreen from 'src/screens/settings/SharingRulesScreen';
import LanguagePickerScreen from 'src/screens/settings/LanguagePickerScreen';
import AboutUsScreen from 'src/screens/settings/AboutUsScreen';
import PrivacyScreen from 'src/screens/settings/PrivacyScreen';

const Stack = createNativeStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MySharings" component={MySharingsScreen} />
      <Stack.Screen name="MyApplies" component={MyAppliesScreen} />
      <Stack.Screen name="SharingRules" component={SharingRulesScreen} />
      <Stack.Screen name="ManageContact" component={ManageContactScreen} />
      <Stack.Screen name="LanguagePicker" component={LanguagePickerScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}

export default SettingsStack;
