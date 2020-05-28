import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Paragraph from 'src/components/Paragraph';
import UnorderedListItem from 'src/components/UnorderedListItem';

function PrivacyScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  navigation.setOptions({
    title: t('privacyScreen.title'),
    contentStyle: {
      backgroundColor: theme.dark ? theme.colors.background : '#fff',
    },
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Paragraph>{t('privacyScreen.p1')}</Paragraph>
        <Paragraph>{t('privacyScreen.p2')}</Paragraph>
        <Paragraph>{t('privacyScreen.p3')}</Paragraph>
        <Paragraph>{t('privacyScreen.p4')}</Paragraph>
        <Paragraph>{t('privacyScreen.p5')}</Paragraph>
        <Paragraph>{t('privacyScreen.p6')}</Paragraph>
        <Paragraph>{t('privacyScreen.p7')}</Paragraph>
        <View style={styles.listContainer}>
          <UnorderedListItem>{t('privacyScreen.li1')}</UnorderedListItem>
          <UnorderedListItem>{t('privacyScreen.li2')}</UnorderedListItem>
          <UnorderedListItem>{t('privacyScreen.li3')}</UnorderedListItem>
          <UnorderedListItem>{t('privacyScreen.li4')}</UnorderedListItem>
          <UnorderedListItem>{t('privacyScreen.li5')}</UnorderedListItem>
          <UnorderedListItem>{t('privacyScreen.li6')}</UnorderedListItem>
          <UnorderedListItem>{t('privacyScreen.li7')}</UnorderedListItem>
        </View>
        <Paragraph>{t('privacyScreen.p8')}</Paragraph>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginBottom: 8,
  },
});

export default PrivacyScreen;
