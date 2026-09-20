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

  const settings = useSettingsStore();
  const reducedMotion = usePreferencesStore(s => s.reducedMotion);
  const setReducedMotion = usePreferencesStore(s => s.setReducedMotion);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title={t('settings')} onBack={() => navigation.goBack()} />

      {/* Hero Banner */}
      <Animated.View>
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
      </Animated.View>

      {/* Appearance */}
      <Animated.View>
        <SectionTitle title={`${t('appearance')} 🎨`} />
        <GlassCard elevation="glow">
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
            Choose Color Theme (7 Vibrant Options)
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
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', width: 14, height: 14, borderRadius: 7, overflow: 'hidden' }}>
                    <View style={{ flex: 1, backgroundColor: opt.colors[0] }} />
                    <View style={{ flex: 1, backgroundColor: opt.colors[1] }} />
                  </View>
                  <Icon
                    name={opt.icon}
                    size={16}
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

      {/* Language */}
      <Animated.View>
        <SectionTitle title={`${t('language')} 🌐`} />
        <GlassCard>
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
            Choose App Language (6 Languages)
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.themeRow, { gap: spacing.xs }]}
          >
            {SUPPORTED_LANGUAGES.map(lang => {
              const active = (settings.language || 'en') === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => settings.setLanguage(lang.code as any)}
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
                  <Text style={{ fontSize: 16 }}>{lang.flag}</Text>
                  <Text
                    variant="label"
                    style={{
                      color: active ? colors.onPrimary : colors.text,
                      fontWeight: active ? '700' : '500',
                    }}
                  >
                    {lang.label}
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
      </Animated.View>

      {/* About */}
      <Animated.View>
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
