import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Paragraph from 'src/components/Paragraph';
import UnorderedListItem from 'src/components/UnorderedListItem';

function AboutUsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  navigation.setOptions({
    title: t('aboutUsScreen.title'),
    contentStyle: {
      backgroundColor: theme.dark ? theme.colors.background : '#fff',
    },
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Paragraph>{t('aboutUsScreen.p1')}</Paragraph>
        <Paragraph>{t('aboutUsScreen.p2')}</Paragraph>
        <Paragraph>{t('aboutUsScreen.p3')}</Paragraph>
        <Paragraph>{t('aboutUsScreen.p4')}</Paragraph>
        <UnorderedListItem>{t('aboutUsScreen.li1')}</UnorderedListItem>
        <UnorderedListItem>{t('aboutUsScreen.li2')}</UnorderedListItem>
        <UnorderedListItem>{t('aboutUsScreen.li3')}</UnorderedListItem>
        <UnorderedListItem>{t('aboutUsScreen.li4')}</UnorderedListItem>
      </View>
    </ScrollView>
  );
}

export default AboutUsScreen;
