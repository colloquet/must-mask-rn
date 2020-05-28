import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import UnorderedListItem from 'src/components/UnorderedListItem';

function SharingRulesScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  navigation.setOptions({ title: t('sharingRules.title') });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <UnorderedListItem>{t('sharingRules.li1')}</UnorderedListItem>
        <UnorderedListItem>{t('sharingRules.li2')}</UnorderedListItem>
        <UnorderedListItem>{t('sharingRules.li3')}</UnorderedListItem>
        <UnorderedListItem>{t('sharingRules.li4')}</UnorderedListItem>
        <UnorderedListItem>{t('sharingRules.li5')}</UnorderedListItem>
      </View>
    </ScrollView>
  );
}

export default SharingRulesScreen;
