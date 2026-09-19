import React from 'react';
import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Header, Screen, SectionTitle, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  usePreferencesStore,
  useSettingsStore,
  useThemeStore,
} from '../../../store';
import { ThemePreference } from '../../../store';
import { SettingRow } from '../components/SettingRow';
import { APP } from '../../../constants/app';
import { rateApp, shareApp } from '../../../utils/appLinks';

const ActionRow: React.FC<{
  icon: string;
  label: string;
  description?: string;
  onPress: () => void;
}> = ({ icon, label, description, onPress }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.actionRow,
        { paddingVertical: spacing.md, gap: spacing.md, opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor: colors.primaryMuted,
            borderRadius: radius.md,
            borderColor: colors.glassBorder,
          },
        ]}
      >
        <Icon name={icon} size={19} color={colors.accent} />
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong">{label}</Text>
        {description && (
          <Text variant="caption" color="textSecondary">
            {description}
          </Text>
        )}
      </View>
      <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
};

const THEME_OPTIONS: { key: ThemePreference; label: string; icon: string }[] = [
  { key: 'dark', label: 'Dark Neon', icon: 'moon' },
  { key: 'midnight', label: 'Midnight', icon: 'sparkles' },
  { key: 'cyberpunk', label: 'Cyberpunk', icon: 'flash' },
  { key: 'emerald', label: 'Emerald', icon: 'leaf' },
  { key: 'sunset', label: 'Sunset', icon: 'flame' },
  { key: 'light', label: 'Solar Light', icon: 'sunny' },
  { key: 'system', label: 'System', icon: 'hardware-chip' },
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
      <Animated.View>
        <SectionTitle title="Appearance & Themes 🎨" />
        <GlassCard>
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
            Choose Color Theme (7 Options)
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.themeRow, { gap: spacing.xs }]}
          >
            {THEME_OPTIONS.map(opt => {
              const active = preference === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setPreference(opt.key)}
                  style={[
                    styles.themeBtn,
                    {
                      borderRadius: radius.lg,
                      backgroundColor: active ? colors.primary : colors.surfaceAlt,
                      borderColor: active ? colors.accent : colors.glassBorder,
                      borderWidth: active ? 2 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <Icon
                    name={opt.icon}
                    size={18}
                    color={active ? colors.onPrimary : colors.text}
                  />
                  <Text
                    variant="label"
                    style={{
                      color: active ? colors.onPrimary : colors.text,
                      fontWeight: active ? '700' : '500',
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </GlassCard>
      </Animated.View>

      {/* Preferences */}
      <Animated.View>
        <SectionTitle title="Preferences" />
        <GlassCard padded={false} style={{ paddingHorizontal: spacing.lg }}>
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
        </GlassCard>
      </Animated.View>

      {/* About */}
      <Animated.View>
        <SectionTitle title="About" />
        <GlassCard padded={false} style={{ paddingHorizontal: spacing.lg }}>
          <ActionRow
            icon="share-social-outline"
            label={`Share ${APP.name}`}
            description="Tell a friend about the app"
            onPress={shareApp}
          />
          <ActionRow
            icon="star-outline"
            label={`Rate ${APP.name}`}
            description="Leave a rating on the Play Store"
            onPress={rateApp}
          />
        </GlassCard>
      </Animated.View>

      <Text variant="caption" color="textTertiary" center>
        {`${APP.name} v${APP.version}`}
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: {
    width: 40,
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeRow: { paddingVertical: 4 },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
