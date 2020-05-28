import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import MainTab from './MainTab';
import SharingDetailScreen from 'src/screens/SharingDetailScreen';
import SharingContactScreen from 'src/screens/SharingContactScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SharingDetail" component={SharingDetailScreen} />
      <Stack.Screen name="SharingContact" component={SharingContactScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;
