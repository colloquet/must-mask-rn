import React, { useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeatherIcons from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import MapStack from './MapStack';
import SettingsStack from './SettingsStack';
import { useAuthDispatch, authActions } from 'src/AuthProvider';
import useReauthenticate from 'src/hooks/useReauthenticate';

const Tab = createBottomTabNavigator();

function MainTab() {
  const navigation = useNavigation();
  const authDispatch = useAuthDispatch();
  const reauthenticate = useReauthenticate();
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const tryFetchCurrentUser = async () => {
      try {
        const jwt = await AsyncStorage.getItem('jwt');
        if (jwt) {
          await reauthenticate(authActions.getCurrentUser)(authDispatch);
        }
      } catch (err) {
        await authActions.logout(authDispatch);
      }
    };

    tryFetchCurrentUser();
  }, [authDispatch, reauthenticate]);

  return (
    <Tab.Navigator
      // tabBar={props => <MyTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarLabel: ({ color }) => {
          let label = '';

          if (route.name === 'Home') {
            label = t('tabs.map');
          } else if (route.name === 'SharingStack') {
            label = t('tabs.share');
          } else if (route.name === 'Settings') {
            label = t('tabs.profile');
          }

          if (route.name === 'SharingStack') {
            return <Text style={{ color: theme.colors.text }}>{label}</Text>;
          }

          return <Text style={{ color }}>{label}</Text>;
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'hexagon';

          if (route.name === 'Home') {
            iconName = 'map';
          } else if (route.name === 'SharingStack') {
            iconName = 'plus';
          } else if (route.name === 'Settings') {
            iconName = 'user';
          }

          if (route.name === 'SharingStack') {
            return (
              <View
                style={[
                  styles.shareButton,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              >
                <Image
                  source={require('src/assets/give_mask.png')}
                  style={styles.shareButtonImage}
                />
              </View>
            );
          }

          return <FeatherIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        style: styles.tabBar,
      }}
    >
      <Tab.Screen name="Home" component={MapStack} />
      <Tab.Screen
        name="SharingStack"
        component={View}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('CreateSharing');
          },
        }}
      />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: -36,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButtonImage: { height: 36, width: 36 },
});

export default MainTab;
