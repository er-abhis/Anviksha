import React from 'react';
import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { AnimatedDropdown, GlassCard, Gradient, Header, Screen, SectionTitle, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  usePreferencesStore,
  useSettingsStore,
  useThemeStore,
} from '../../../store';
import { ThemePreference } from '../../../store';
import { SettingRow } from '../components/SettingRow';
import { APP, SUPPORTED_LANGUAGES } from '../../../constants/app';
import { rateApp, shareApp } from '../../../utils/appLinks';
import { useTranslation } from '../../../i18n/useTranslation';

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

const THEME_OPTIONS: { key: ThemePreference; label: string; icon: string; colors: [string, string] }[] = [
  { key: 'dark', label: 'Dark Neon', icon: 'moon', colors: ['#7C5CFF', '#06D6C4'] },
  { key: 'midnight', label: 'Midnight', icon: 'sparkles', colors: ['#0284C7', '#6366F1'] },
  { key: 'cyberpunk', label: 'Cyberpunk', icon: 'flash', colors: ['#FACC15', '#FF2E93'] },
  { key: 'emerald', label: 'Emerald', icon: 'leaf', colors: ['#059669', '#34D399'] },
  { key: 'sunset', label: 'Sunset', icon: 'flame', colors: ['#EC4899', '#F59E0B'] },
  { key: 'light', label: 'Solar Light', icon: 'sunny', colors: ['#6438F5', '#06D6C4'] },
  { key: 'system', label: 'System', icon: 'hardware-chip', colors: ['#494F63', '#969CB3'] },
];

export const SettingsScreen: React.FC = () => {
  const { colors, radius, spacing, gradients } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const preference = useThemeStore(s => s.preference);
  const setPreference = useThemeStore(s => s.setPreference);

  const settingsStore = useSettingsStore();
  // Defensive state fallbacks in case of legacy persisted values
  const settings = {
    language: settingsStore?.language || 'en',
    sound: settingsStore?.sound ?? true,
    haptics: settingsStore?.haptics ?? true,
    notifications: settingsStore?.notifications ?? true,
    notificationTime: settingsStore?.notificationTime || '20:00',
    setLanguage: (lang: any) => { try { settingsStore?.setLanguage?.(lang); } catch {} },
    setSound: (v: boolean) => { try { settingsStore?.setSound?.(v); } catch {} },
    setHaptics: (v: boolean) => { try { settingsStore?.setHaptics?.(v); } catch {} },
    setNotifications: (v: boolean) => { try { settingsStore?.setNotifications?.(v); } catch {} },
    setNotificationTime: (tm: string) => { try { settingsStore?.setNotificationTime?.(tm); } catch {} },
  };

  const reducedMotion = usePreferencesStore(s => s?.reducedMotion ?? false);
  const setReducedMotionStore = usePreferencesStore(s => s?.setReducedMotion);
  const setReducedMotion = (v: boolean) => { try { setReducedMotionStore?.(v); } catch {} };

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title={t('settings')} onBack={() => navigation.goBack()} />

      {/* Hero Banner */}
      <View>
        <GlassCard elevation="glow" padded={false} style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
          <Gradient colors={gradients.brand} style={StyleSheet.absoluteFill} />
          <View style={{ padding: spacing.lg, gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="options-outline" size={18} color="#FFFFFF" />
              <Text variant="label" color="textInverse" style={{ opacity: 0.9, letterSpacing: 1 }}>
                APP PREFERENCES
              </Text>
            </View>
            <Text variant="h2" color="textInverse">
              Customization & Themes
            </Text>
            <Text variant="caption" color="textInverse" style={{ opacity: 0.92, lineHeight: 16 }}>
              Tailor color themes, languages, audio effects, and accessibility settings.
            </Text>
          </View>
        </GlassCard>
      </View>

      {/* Appearance & Themes */}
      <View>
        <SectionTitle title={`${t('appearance')} 🎨`} />
        <GlassCard elevation="glow">
          <AnimatedDropdown
            label="App Color Theme"
            options={THEME_OPTIONS.map(opt => ({
              key: opt.key,
              label: opt.label,
              icon: opt.icon,
              colors: opt.colors,
            }))}
            selectedKey={preference}
            onSelect={key => { try { setPreference(key as any); } catch {} }}
          />
        </GlassCard>
      </View>

      {/* Language */}
      <View>
        <SectionTitle title={`${t('language')} 🌐`} />
        <GlassCard>
          <AnimatedDropdown
            label="App Interface Language"
            options={SUPPORTED_LANGUAGES.map(lang => ({
              key: lang.code,
              label: lang.label,
              flag: lang.flag,
            }))}
            selectedKey={settings.language || 'en'}
            onSelect={code => settings.setLanguage(code as any)}
          />
        </GlassCard>
      </View>

      {/* Preferences */}
      <View>
        <SectionTitle title="Preferences" />
        <GlassCard padded={false} style={{ paddingHorizontal: spacing.lg }}>
          <SettingRow
            icon="volume-high-outline"
            label={t('sound')}
            description="Play sounds during simulations"
            value={settings.sound}
            onValueChange={settings.setSound}
          />
          <SettingRow
            icon="phone-portrait-outline"
            label={t('haptics')}
            description="Vibration feedback"
            value={settings.haptics}
            onValueChange={settings.setHaptics}
          />
          <SettingRow
            icon="notifications-outline"
            label={t('notifications')}
            description="Reminders and streak nudges"
            value={settings.notifications}
            onValueChange={settings.setNotifications}
          />
          {settings.notifications && (
            <View style={{ paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.glassBorder, gap: 6 }}>
              <Text variant="caption" color="textSecondary">Daily Reminder Schedule Time</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { label: '🌅 9:00 AM', time: '09:00' },
                  { label: '☀️ 2:00 PM', time: '14:00' },
                  { label: '🌙 8:00 PM', time: '20:00' },
                ].map(item => {
                  const active = (settings.notificationTime || '20:00') === item.time;
                  return (
                    <Pressable
                      key={item.time}
                      onPress={() => settings.setNotificationTime(item.time)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: radius.pill,
                        backgroundColor: active ? colors.primary : colors.surfaceAlt,
                        borderColor: active ? colors.accent : colors.glassBorder,
                        borderWidth: 1,
                      }}
                    >
                      <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '400', fontSize: 11 }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
          <SettingRow
            icon="accessibility-outline"
            label="Reduce motion"
            description="Minimize animations"
            value={reducedMotion}
            onValueChange={setReducedMotion}
          />
        </GlassCard>
      </View>

      {/* About */}
      <View>
        <SectionTitle title={t('about')} />
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
      </View>

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
