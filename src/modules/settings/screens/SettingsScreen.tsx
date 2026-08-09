import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Header, Screen, SectionTitle, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  usePreferencesStore,
  useSettingsStore,
  useThemeStore,
} from '../../../store';
import { ThemePreference } from '../../../store';
import { SettingRow } from '../components/SettingRow';
import { APP } from '../../../constants/app';

const THEME_OPTIONS: { key: ThemePreference; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'system', label: 'System' },
];

export const SettingsScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();

  const preference = useThemeStore(s => s.preference);
  const setPreference = useThemeStore(s => s.setPreference);

  const settings = useSettingsStore();
  const reducedMotion = usePreferencesStore(s => s.reducedMotion);
  const setReducedMotion = usePreferencesStore(s => s.setReducedMotion);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      {/* Appearance */}
      <View>
        <SectionTitle title="Appearance" />
        <Card padded>
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
            Theme
          </Text>
          <View
            style={[
              styles.segment,
              { backgroundColor: colors.surfaceAlt, borderRadius: radius.md },
            ]}
          >
            {THEME_OPTIONS.map(opt => {
              const active = preference === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setPreference(opt.key)}
                  style={[
                    styles.segmentItem,
                    {
                      borderRadius: radius.sm,
                      backgroundColor: active ? colors.surface : 'transparent',
                    },
                  ]}
                >
                  <Text
                    variant="label"
                    color={active ? 'text' : 'textSecondary'}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </View>

      {/* Preferences */}
      <View>
        <SectionTitle title="Preferences" />
        <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
          <SettingRow
            icon="volume-high-outline"
            label="Sound"
            description="Play sounds during simulations"
            value={settings.sound}
            onValueChange={settings.setSound}
          />
          <SettingRow
            icon="phone-portrait-outline"
            label="Haptics"
            description="Vibration feedback"
            value={settings.haptics}
            onValueChange={settings.setHaptics}
          />
          <SettingRow
            icon="notifications-outline"
            label="Notifications"
            description="Reminders and streak nudges"
            value={settings.notifications}
            onValueChange={settings.setNotifications}
          />
          <SettingRow
            icon="accessibility-outline"
            label="Reduce motion"
            description="Minimize animations"
            value={reducedMotion}
            onValueChange={setReducedMotion}
          />
        </Card>
      </View>

      <Text variant="caption" color="textTertiary" center>
        {`${APP.name} v${APP.version}`}
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', padding: 4, gap: 4 },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
