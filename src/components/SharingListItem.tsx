import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Sharing } from 'src/types';
import { dateFormatter } from 'src/utils';

function SharingListItem({
  sharing,
  isLast,
  onPress,
}: {
  sharing: Sharing;
  isLast?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <TouchableHighlight
        onPress={onPress}
        style={styles.container}
        underlayColor={theme.dark ? '#2c2c2d' : '#e5e5ea'}
      >
        <>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.date,
                { color: theme.dark ? '#98989e' : '#8a8a8d' },
              ]}
            >
              {dateFormatter(sharing.created_time)}
            </Text>
            <Text
              style={[styles.remark, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {sharing.remarks || '-'}
            </Text>
            <View style={styles.meta}>
              {'total_apply' in sharing && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.dark ? '#98989e' : '#8a8a8d',
                    },
                  ]}
                >
                  {t('mySharingScreen.applicants')}{' '}
                  <Text style={[styles.figure, { color: theme.colors.text }]}>
                    {sharing.total_apply || '-'}
                  </Text>
                </Text>
              )}
              {'pack_number' in sharing && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.dark ? '#98989e' : '#8a8a8d',
                    },
                  ]}
                >
                  {t('mySharingScreen.totalAvailable')}{' '}
                  <Text style={[styles.figure, { color: theme.colors.text }]}>
                    {sharing.pack_number}
                  </Text>
                </Text>
              )}
            </View>
          </View>
          <FeatherIcons
            name="chevron-right"
            size={24}
            color={theme.dark ? '#656569' : '#c4c4c6'}
          />
        </>
      </TouchableHighlight>
      {isLast || (
        <View
          style={[
            styles.separator,
            { borderBottomColor: theme.dark ? '#39393c' : '#ccccce' },
          ]}
        />
      )}
    </>
  );
}

SharingListItem.defaultProps = {
  isLast: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  remark: {
    fontSize: 18,
  },
  meta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  label: {
    marginRight: 16,
  },
  figure: {
    color: '#000',
  },
});

export default SharingListItem;
