import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, Platform } from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useLinking,
} from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import codePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import analytics from '@react-native-firebase/analytics';
import AppleAuth from '@invertase/react-native-apple-authentication';

import { withAuthProvider, useAuthDispatch, authActions } from './AuthProvider';
import LoginScreen from './screens/LoginScreen';
import ErrorBoundary from './ErrorBoundary';
import MainStack from './navigators/MainStack';
import CreateSharingStack from './navigators/CreateSharingStack';
import resources from './i18n.json';
import { SettingsProvider } from './SettingsProvider';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const Stack = createNativeStackNavigator();
const getActiveRouteName = (state: any): string => {
  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
};

function App() {
  const authDispatch = useAuthDispatch();
  const routeNameRef = useRef<string>();

  // --- i18n --- //
  const [i18nReady, setI18NReady] = useState(false);
  useEffect(() => {
    const initI18N = async () => {
      let lng;

      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && savedLanguage in resources) {
        lng = savedLanguage;
      } else {
        const locales = RNLocalize.getLocales();
        const bestLocale = RNLocalize.findBestAvailableLanguage(
          locales.map(locale => locale.languageTag),
        );
        lng = bestLocale?.languageTag.startsWith('en') ? 'en-US' : 'zh-HK';
      }

      i18n.use(initReactI18next).init({
        resources,
        lng,
        fallbackLng: 'zh-HK',
        keySeparator: false,
        interpolation: {
          escapeValue: false,
        },
      });

      setI18NReady(true);
    };

    initI18N();
  }, []);

  // --- Theme --- //
  const scheme = useColorScheme();
  useEffect(() => {
    if (Platform.OS === 'android' && scheme === 'dark') {
      StatusBar.setBackgroundColor(DarkTheme.colors.card);
    }
  }, [scheme]);

  // --- Deep link --- //
  const navigationRef = useRef();
  const { getInitialState } = useLinking(navigationRef, {
    prefixes: ['https://mustmask.com', 'mustmask://'],
    config: {
      Main: {
        initialRouteName: 'MainTab',
        screens: {
          SharingDetail: {
            initialRouteName: 'Main',
            path: 'sharing/detail',
          },
        },
      },
    },
  });

  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<any>();

  useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise(resolve => setTimeout(resolve, 150)),
    ])
      .catch(e => {
        console.error(e);
      })
      .then(state => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  // --- Sign in with Apple --- //
  useEffect(() => {
    if (!AppleAuth.isSupported) return;

    const unsubscribe = AppleAuth.onCredentialRevoked(async () => {
      authActions.logout(authDispatch);
    });
    return unsubscribe();
  }, [authDispatch]);

  // --- DEV --- //
  const [isStateReady, setIsStateReady] = useState(__DEV__ ? false : true);
  const [initialSavedState, setInitialSavedState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedStateString) {
          const state = JSON.parse(savedStateString);
          setInitialSavedState(state);
        }
      } finally {
        setIsStateReady(true);
      }
    };

    if (!isStateReady) {
      restoreState();
    }
  }, [isStateReady]);

  if (!isReady || !i18nReady || !isStateReady) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <SettingsProvider>
        <AppearanceProvider>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              initialState={initialState || initialSavedState}
              theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
              onStateChange={state => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = getActiveRouteName(state);

                if (previousRouteName !== currentRouteName) {
                  analytics().setCurrentScreen(
                    currentRouteName,
                    currentRouteName,
                  );
                }

                routeNameRef.current = currentRouteName;

                if (__DEV__) {
                  AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
                }
              }}
            >
              <ErrorBoundary>
                <Stack.Navigator
                  screenOptions={{
                    headerBackTitleVisible: false,
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Main" component={MainStack} />
                  <Stack.Screen
                    name="CreateSharing"
                    component={CreateSharingStack}
                    options={{
                      stackPresentation: 'modal',
                    }}
                  />
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                      stackPresentation: 'modal',
                    }}
                  />
                </Stack.Navigator>
              </ErrorBoundary>
            </NavigationContainer>
          </SafeAreaProvider>
        </AppearanceProvider>
      </SettingsProvider>
    </ActionSheetProvider>
  );
}

let app = withAuthProvider(App);
if (!__DEV__) {
  app = codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_RESTART,
  })(app);
}

export default app;
