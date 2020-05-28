import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import CreateSharingScreen from 'src/screens/createSharing/CreateSharingScreen';
import CurrencyPickerScreen from 'src/screens/createSharing/CurrencyPickerScreen';
import { CreateSharingStackParamList } from 'src/types';

const Stack = createNativeStackNavigator<CreateSharingStackParamList>();

function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="CreateSharing" component={CreateSharingScreen} />
      <Stack.Screen name="CurrencyPicker" component={CurrencyPickerScreen} />
    </Stack.Navigator>
  );
}

export default MapStack;
