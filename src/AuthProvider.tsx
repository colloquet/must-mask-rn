import React, { useReducer } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { AccessToken } from 'react-native-fbsdk';
import i18n from 'i18next';

import * as API from './api';
import { showToast } from './utils';
import AppleAuth, {
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

interface CurrentUser {
  uid: number;
  name: string;
  email: string;
  mobile: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isSigningOut: boolean;
  currentUser: CurrentUser | null;
}

interface AuthAction {
  type: string;
  payload?: any;
}

type AuthDispatch = (action: AuthAction) => void;

const initialState = {
  isLoggedIn: false,
  isSigningOut: false,
  currentUser: null,
};

const AuthStateContext = React.createContext<AuthState>(initialState);
const AuthDispatchContext = React.createContext<AuthDispatch>(() => {});

function reducer(state: AuthState, action: AuthAction) {
  const { type, payload } = action;

  switch (type) {
    case 'START_SIGN_OUT': {
      return {
        ...state,
        isSigningOut: true,
      };
    }
    case 'FINISH_SIGN_OUT': {
      return {
        ...state,
        isSigningOut: false,
        isLoggedIn: false,
        currentUser: null,
      };
    }
    case 'RECEIVE_CURRENT_USER': {
      return {
        ...state,
        isLoggedIn: true,
        currentUser: payload,
      };
    }
    case 'UPDATE_CURRENT_USER': {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...payload,
        },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const authActions = {
  async logout(dispatch: AuthDispatch, shouldShowToast?: boolean) {
    dispatch({ type: 'START_SIGN_OUT' });
    await AsyncStorage.removeItem('jwt');
    await AsyncStorage.removeItem('login_type');
    await AsyncStorage.removeItem('fb_credentials');
    dispatch({ type: 'FINISH_SIGN_OUT' });
    if (shouldShowToast) {
      showToast(i18n.t('common.logoutSuccess'));
    }
  },
  async getJWTWithFBToken(accessToken: AccessToken) {
    const { jwt } = await API.facebookLogin(accessToken.accessToken);
    await AsyncStorage.setItem('jwt', jwt);
    await AsyncStorage.setItem('login_type', 'fb');
    await AsyncStorage.setItem('fb_credentials', JSON.stringify(accessToken));
  },
  async getJWTWithAppleToken(identityToken: string, name: string) {
    const { jwt } = await API.appleLogin(identityToken, name);
    await AsyncStorage.setItem('jwt', jwt);
    await AsyncStorage.setItem('login_type', 'apple');
  },
  async reAuthenticate() {
    const loginType = await AsyncStorage.getItem('login_type');

    if (loginType === 'fb') {
      const fbCredentialsStr = await AsyncStorage.getItem('fb_credentials');
      if (!fbCredentialsStr) throw new Error('FB credentials no found');

      const fbCredentials: AccessToken = JSON.parse(fbCredentialsStr);
      const { accessToken, expirationTime } = fbCredentials;
      if (accessToken && expirationTime > Date.now()) {
        await this.getJWTWithFBToken(fbCredentials);
      }
      return;
    }

    throw new Error('reAuthenticate not supported');
  },
  async facebookLogin(dispatch: AuthDispatch, accessToken: AccessToken) {
    try {
      await this.getJWTWithFBToken(accessToken);
      await this.getCurrentUser(dispatch);
    } catch (err) {
      throw new Error(err.message || i18n.t('common.unknownError'));
    }
  },
  async appleLogin(
    dispatch: AuthDispatch,
    identityToken: string,
    name: string,
  ) {
    try {
      await this.getJWTWithAppleToken(identityToken, name);
      await this.getCurrentUser(dispatch);
    } catch (err) {
      throw new Error(err.message || i18n.t('common.unknownError'));
    }
  },
  async getCurrentUser(dispatch: AuthDispatch) {
    const currentUser = await API.getCurrentUser();
    dispatch({ type: 'RECEIVE_CURRENT_USER', payload: currentUser });

    showToast(i18n.t('common.loginSuccess', { username: currentUser.name }));
  },
  async updateCurrentUser(
    dispatch: AuthDispatch,
    { email, mobile }: { email: string; mobile: string },
  ) {
    await API.updateCurrentUser({ email, mobile });
    dispatch({ type: 'UPDATE_CURRENT_USER', payload: { email, mobile } });
    showToast(i18n.t('manageContactScreen.updateSuccess'));
  },
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}

function withAuthProvider(WrappedComponent: any) {
  return function WithAuthProvider(props: any) {
    return (
      <AuthProvider>
        <WrappedComponent {...props} />
      </AuthProvider>
    );
  };
}

export {
  AuthProvider,
  useAuthState,
  useAuthDispatch,
  withAuthProvider,
  authActions,
};
