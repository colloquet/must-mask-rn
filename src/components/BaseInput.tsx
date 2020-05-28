import React from 'react';
import { Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface Props extends TextInputProps {
  disabled?: boolean;
  errorMessage?: string | null;
}

const BaseInput = React.forwardRef<TextInput, Props>(
  ({ style, disabled, errorMessage, ...props }: Props, ref) => {
    const theme = useTheme();
    return (
      <>
        <TextInput
          {...props}
          ref={ref}
          style={[
            styles.input,
            style,
            disabled && styles.disabled,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
            },
            Boolean(errorMessage) && styles.hasError,
          ]}
          placeholderTextColor="#999"
          editable={!disabled}
        />
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </>
    );
  },
);

BaseInput.defaultProps = {
  style: {},
  disabled: false,
  errorMessage: null,
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    color: '#000',
  },
  disabled: {
    opacity: 0.5,
  },
  hasError: {
    borderColor: '#dc3545',
  },
  errorMessage: {
    color: '#dc3545',
    marginTop: 8,
  },
});

export default BaseInput;
