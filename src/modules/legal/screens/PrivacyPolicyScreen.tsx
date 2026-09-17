import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { APP } from '../../../constants/app';
import { openContactForm } from '../../../utils/appLinks';

/**
 * In-app privacy policy. Anviksha is offline-first: no accounts, no analytics,
 * no ads, no tracking, no data leaves the device. Kept in sync with the hosted
 * copy (privacy-policy.html) used for the Play Console listing URL.
 */
const UPDATED = 'Last updated: September 2026';

interface Section {
  icon: string;
  title: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    icon: 'cloud-offline-outline',
    title: 'No data collection',
    body: `${APP.name} does not collect, store, or transmit any personal information. There are no accounts, no sign-in, and no analytics or advertising SDKs. The app works fully offline.`,
  },
  {
    icon: 'phone-portrait-outline',
    title: 'Everything stays on your device',
    body: 'Your learning progress, achievements, and settings are saved only in local storage on your phone. This data is never uploaded to us or any third party. Uninstalling the app permanently deletes it.',
  },
  {
    icon: 'notifications-outline',
    title: 'Notifications',
    body: 'With your permission, the app schedules local reminders (a daily challenge and a lesson nudge) directly on your device. These are generated on-device — no push servers, no messages sent to us. You can turn them off anytime in Settings or your system settings.',
  },
  {
    icon: 'hand-left-outline',
    title: 'Device features',
    body: 'The app may use vibration for haptic feedback and play in-app sounds. Both are optional and controlled in Settings. Neither reads or shares any personal data.',
  },
  {
    icon: 'open-outline',
    title: 'Links that leave the app',
    body: 'Some actions open external websites in your browser — learning resources, a contact form, rating on the Play Store, sharing, and voluntary donations (PayPal / UPI). Once you leave the app, those third-party services are governed by their own privacy policies. We do not receive any information back from them.',
  },
  {
    icon: 'happy-outline',
    title: 'Children',
    body: `${APP.name} is a general-audience educational app suitable for all ages. Because it collects no personal data from anyone, it collects none from children.`,
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Security',
    body: 'Since no personal data is collected or transmitted, there is nothing to breach on our side. All app data lives only on your own device.',
  },
];

export const PrivacyPolicyScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      <Header title="Privacy Policy" onBack={() => navigation.goBack()} />

      <Text variant="caption" color="textTertiary">{UPDATED}</Text>
      <Text variant="body" color="textSecondary">
        {`Your privacy matters. In short: ${APP.name} keeps everything on your device and sends nothing about you anywhere.`}
      </Text>

      {SECTIONS.map((s, i) => (
        <GlassCard key={s.title}>
          <View style={[styles.row, { gap: spacing.md }]}>
            <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
              <Icon name={s.icon} size={20} color={colors.accent} />
            </View>
            <View style={styles.flex}>
              <Text variant="bodyStrong" style={{ marginBottom: 4 }}>{`${i + 1}. ${s.title}`}</Text>
              <Text variant="body" color="textSecondary" style={styles.body}>{s.body}</Text>
            </View>
          </View>
        </GlassCard>
      ))}

      <GlassCard onPress={openContactForm}>
        <View style={[styles.row, { gap: spacing.md }]}>
          <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
            <Icon name="mail-outline" size={20} color={colors.accent} />
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong">Questions?</Text>
            <Text variant="body" color="textSecondary">Reach out through the in-app contact form.</Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      </GlassCard>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  body: { lineHeight: 22 },
});
