import React, { useReducer } from 'react';

export enum MapType {
  APPLE = 'Apple',
  GOOGLE = 'Google',
}

interface SettingsState {
  mapType: MapType;
}

interface SettingsAction {
  type: string;
  payload?: any;
}

type SettingsDispatch = (action: SettingsAction) => void;

const initialState = {
  mapType: MapType.GOOGLE,
};

const SettingsStateContext = React.createContext<SettingsState>(initialState);
const SettingsDispatchContext = React.createContext<SettingsDispatch>(() => {});

function reducer(state: SettingsState, action: SettingsAction) {
  const { type, payload } = action;

  console.log(payload);
  switch (type) {
    case 'UPDATE_MAP_TYPE': {
      return {
        ...state,
        mapType: payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  );
}

function useSettingsState() {
  const context = React.useContext(SettingsStateContext);
  if (context === undefined) {
    throw new Error('useSettingsState must be used within a SettingsProvider');
  }
  return context;
}

function useSettingsDispatch() {
  const context = React.useContext(SettingsDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useSettingsDispatch must be used within a SettingsProvider',
    );
  }
  return context;
}

function withSettingsProvider(WrappedComponent: any) {
  return function WithSettingsProvider(props: any) {
    return (
      <SettingsProvider>
        <WrappedComponent {...props} />
      </SettingsProvider>
    );
  };
}

export {
  SettingsProvider,
  useSettingsState,
  useSettingsDispatch,
  withSettingsProvider,
};
