import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Clipboard,
  Linking,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useTheme,
} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

import * as API from 'src/api';
import { MainStackParamList, SharingContact } from 'src/types';
import useReauthenticate from 'src/hooks/useReauthenticate';
import Section from 'src/components/Section';
import { dateFormatter, showToast } from 'src/utils';

type SharingContactScreenRouteProp = RouteProp<
  MainStackParamList,
  'SharingContact'
>;

function SharingContactScreen() {
  const navigation = useNavigation();
  const route: SharingContactScreenRouteProp = useRoute();
  const theme = useTheme();
  const reauthenticate = useReauthenticate();
  const { id: sharingId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [contactList, setContactList] = useState<SharingContact[]>([]);
  const { t } = useTranslation();

  navigation.setOptions({
    title: t('sharingContactScreen.applicantList'),
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const { data } = await reauthenticate(API.getSharingContact)(sharingId);
        if (!data.length) {
          navigation.goBack();
          showToast(t('sharingContactScreen.noApplicantsYet'));
          return;
        }
        setContactList(data);
        setIsLoading(false);
      } catch (err) {
        Alert.alert(err.message || t('common.unknownError'));
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [sharingId, reauthenticate, navigation, t]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {contactList.length ? (
        <Section>
          {contactList.map((contact, index) => (
            <React.Fragment
              key={`${contact.user_name}-${contact.mobile}-${contact.created_at}}`}
            >
              <View style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.dark ? '#98989e' : '#8a8a8d',
                    }}
                  >
                    {dateFormatter(contact.created_at)}
                  </Text>
                  <Text
                    style={[styles.name, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {contact.user_name || '-'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() =>
                    Linking.openURL(
                      `whatsapp://send?text=${contact.user_name}&phone=+852${contact.mobile}`,
                    )
                  }
                >
                  <FontAwesomeIcon name="whatsapp" size={26} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => Linking.openURL(`tel:${contact.mobile}`)}
                >
                  <FontAwesomeIcon name="phone" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => {
                    try {
                      Clipboard.setString(contact.mobile);
                      showToast(t('sharingContactScreen.copied'), {
                        position: -160,
                        shadow: false,
                        duration: 500,
                      });
                    } catch (err) {
                      Alert.alert(err.message || t('common.unknownError'));
                    }
                  }}
                >
                  <FontAwesomeIcon name="copy" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              {index + 1 < contactList.length && <Section.Separator />}
            </React.Fragment>
          ))}
        </Section>
      ) : (
        <View style={{ padding: 32 }}>
          <Text style={{ color: theme.colors.text, textAlign: 'center' }}>
            {t('sharingContactScreen.noApplicantsYet')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  name: {
    marginTop: 8,
    fontSize: 18,
  },
  actionButton: {
    flexShrink: 0,
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SharingContactScreen;
