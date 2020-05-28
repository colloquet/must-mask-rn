import React from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';

function Section({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const borderColor = theme.dark ? '#39393c' : '#ccccce';

  return (
    <View
      style={[
        styles.section,
        style,
        {
          backgroundColor: theme.colors.card,
          borderTopColor: borderColor,
          borderBottomColor: borderColor,
        },
      ]}
    >
      {children}
    </View>
  );
}

function SectionItem({
  label,
  value,
  isParagraph,
  onPress,
}: {
  label: string;
  value?: React.ReactText;
  isParagraph?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <TouchableHighlight
      style={isParagraph ? styles.paragraph : styles.item}
      onPress={onPress}
      underlayColor={theme.dark ? '#2c2c2d' : '#e5e5ea'}
    >
      <>
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
              marginBottom: isParagraph ? 8 : 0,
            },
          ]}
        >
          {label}
        </Text>
        {value && (
          <Text
            style={[
              styles.value,
              {
                color: theme.dark ? '#98989e' : '#8a8a8d',
              },
            ]}
          >
            {value}
          </Text>
        )}
        {onPress && (
          <View style={styles.icon}>
            <FeatherIcons
              name="chevron-right"
              size={22}
              color={theme.dark ? '#656569' : '#c4c4c6'}
            />
          </View>
        )}
      </>
    </TouchableHighlight>
  );
}

function SectionButton({
  label,
  onPress,
  textStyle,
  isLoading,
}: {
  label: React.ReactNode;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
}) {
  const theme = useTheme();

  return (
    <TouchableHighlight
      style={styles.item}
      onPress={onPress}
      underlayColor={theme.dark ? '#2c2c2d' : '#e5e5ea'}
    >
      {isLoading ? (
        <View style={{ alignItems: 'center', flex: 1 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <Text
          style={[
            styles.label,
            {
              textAlign: 'center',
              color: theme.colors.text,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableHighlight>
  );
}

function SectionSeparator({ type = 'normal' }: { type?: 'normal' | 'full' }) {
  const theme = useTheme();
  const borderColor = theme.dark ? '#39393c' : '#ccccce';
  const marginLeft = type === 'normal' ? 16 : 0;

  return (
    <View
      style={[
        styles.separator,
        {
          borderBottomColor: borderColor,
          marginLeft,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  section: {
    borderTopColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
  },
  paragraph: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  value: {
    fontSize: 16,
    flexShrink: 0,
  },
  icon: {
    flexShrink: 0,
    paddingLeft: 8,
  },
});

Section.Item = SectionItem;
Section.Button = SectionButton;
Section.Separator = SectionSeparator;

export default Section;
