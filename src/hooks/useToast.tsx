import { useCallback } from 'react';
import Toast, { ToastOptions } from 'react-native-root-toast';
import { useTheme } from '@react-navigation/native';

function useToast() {
  const theme = useTheme();

  const showToast = useCallback(
    (text: string, options: ToastOptions = {}) => {
      Toast.show(text, {
        position: -160,
        shadow: false,
        backgroundColor: theme.dark ? '#fff' : '#000',
        textColor: theme.dark ? '#000' : '#fff',
        ...options,
      });
    },
    [theme],
  );

  return showToast;
}

export default useToast;
