import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useSafeArea } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import Section from 'src/components/Section';

function LanguagePickerScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeArea();
  const { t, i18n } = useTranslation();

  navigation.setOptions({
    title: t('languagePickerScreen.title'),
    contentStyle: {
      backgroundColor: theme.dark ? theme.colors.background : '#fff',
    },
  });

  const availableLanguages = [
    {
      key: 'zh-HK',
      label: '繁體中文',
    },
    {
      key: 'en-US',
      label: 'English',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Section>
        {availableLanguages.map((language, index) => {
          const isActive = language.key === i18n.language;
          return (
            <>
              <TouchableHighlight
                onPress={async () => {
                  await AsyncStorage.setItem('language', language.key);
                  i18n.changeLanguage(language.key);
                  navigation.goBack();
                }}
                style={styles.item}
                underlayColor={theme.dark ? '#2c2c2d' : '#e5e5ea'}
              >
                <>
                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: isActive
                          ? theme.colors.primary
                          : theme.colors.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {language.label}
                  </Text>
                  {isActive && (
                    <FeatherIcons
                      name="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </>
              </TouchableHighlight>
              {index + 1 < availableLanguages.length && <Section.Separator />}
            </>
          );
        })}
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});

export default LanguagePickerScreen;
