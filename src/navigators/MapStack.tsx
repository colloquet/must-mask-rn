import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import MapScreen from 'src/screens/home/MapScreen';
import SharingListScreen from 'src/screens/home/SharingListScreen';

const Stack = createNativeStackNavigator();

function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SharingList" component={SharingListScreen} />
    </Stack.Navigator>
  );
}

export default MapStack;
