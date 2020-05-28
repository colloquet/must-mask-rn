import React from 'react';
import { useTheme } from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {
  HeaderButtons,
  HeaderButton,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';

const FeatherHeaderButton = (props: HeaderButtonProps) => {
  const theme = useTheme();

  return (
    <HeaderButton
      {...props}
      buttonStyle={{ marginRight: 0 }}
      IconComponent={FeatherIcons}
      iconSize={24}
      color={theme.colors.primary}
    />
  );
};

export const FeatherHeaderButtons = (props: any) => {
  const theme = useTheme();

  return (
    <HeaderButtons
      HeaderButtonComponent={FeatherHeaderButton}
      OverflowIcon={
        <FeatherIcons
          name="more-horizontal"
          size={24}
          color={theme.colors.primary}
        />
      }
      {...props}
    />
  );
};

export { Item } from 'react-navigation-header-buttons';
