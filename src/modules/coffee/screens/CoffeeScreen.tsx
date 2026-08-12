import React, { useState } from 'react';
import {
  Alert,
  Clipboard,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  Card,
  Gradient,
  Header,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { APP } from '../../../constants/app';

const UPI_ID = 'royal.4766@ybl';

type Tab = 'paypal' | 'upi';

/** Amounts match the trailing value in each PayPal.me URL so nothing misleads. */
const PAYPAL_TIERS = [
  { emoji: '☕', label: 'Buy a coffee', amount: '$5', url: 'https://paypal.me/tinytalkerdev/5' },
  { emoji: '🍰', label: 'Support the work', amount: '$25', url: 'https://paypal.me/tinytalkerdev/25' },
  { emoji: '🚀', label: 'Power a feature', amount: '$50', url: 'https://paypal.me/tinytalkerdev/50' },
];

const REASONS = [
  {
    icon: 'rocket-outline',
    title: `Keep ${APP.name} growing`,
    desc: 'Fund new lessons, worlds and interactive simulations.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Support independent software',
    desc: 'An offline-first, ad-free AI learning app built by one developer.',
  },
  {
    icon: 'heart-outline',
    title: 'Fuel more free learning',
    desc: 'Your support keeps AI education approachable for everyone.',
  },
];

export const CoffeeScreen: React.FC = () => {
  const { colors, radius, spacing, elevation } = useTheme();
  const navigation = useNavigation();
  const [tab, setTab] = useState<Tab>('paypal');
  const [copied, setCopied] = useState(false);

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open link', url);
    }
  };

  const copyUpi = () => {
    try {
      Clipboard.setString(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      Alert.alert('UPI ID', UPI_ID);
    }
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title="Support Anviksha" onBack={() => navigation.goBack()} />

      {/* Hero */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <Gradient colors={[colors.primary, colors.accent]} style={{ ...styles.hero, borderRadius: radius.lg }}>
          <View style={styles.heroBadge}>
            <Icon name="cafe" size={30} color="#FFFFFF" />
          </View>
          <Text variant="h2" color="textInverse" center>Buy me a coffee</Text>
          <Text variant="body" color="textInverse" center style={styles.heroSub}>
            {`${APP.name} is built independently. A small tip keeps the lessons coming. ❤️`}
          </Text>
        </Gradient>
      </Animated.View>

      {/* Why support */}
      <Animated.View entering={FadeInDown.delay(120).duration(400)} style={{ gap: spacing.md }}>
        {REASONS.map(r => (
          <Card key={r.title} elevation="sm">
            <View style={[styles.reason, { gap: spacing.md }]}>
              <View style={[styles.reasonIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                <Icon name={r.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{r.title}</Text>
                <Text variant="caption" color="textSecondary">{r.desc}</Text>
              </View>
            </View>
          </Card>
        ))}
      </Animated.View>

      {/* Tabs */}
      <Animated.View entering={FadeInDown.delay(220).duration(400)} style={{ gap: spacing.md }}>
        <Text variant="h3">Choose how to support</Text>
        <View style={[styles.tabs, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
          {(['paypal', 'upi'] as Tab[]).map(t => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.tab,
                  { borderRadius: radius.sm },
                  active && { backgroundColor: colors.surface, ...elevation.sm },
                ]}
              >
                <Text variant="button" color={active ? 'primary' : 'textSecondary'}>
                  {t === 'paypal' ? 'PayPal · Intl' : 'UPI · India'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'paypal' ? (
          <View style={{ gap: spacing.sm }}>
            {PAYPAL_TIERS.map(tier => (
              <Card key={tier.url} elevation="sm" onPress={() => openUrl(tier.url)}>
                <View style={styles.tierRow}>
                  <Text variant="h3">{tier.emoji}</Text>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong">{tier.label}</Text>
                    <Text variant="caption" color="textSecondary">via PayPal</Text>
                  </View>
                  <View style={[styles.amount, { backgroundColor: colors.primaryMuted, borderRadius: radius.pill }]}>
                    <Text variant="label" color="primary">{tier.amount}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card elevation="sm">
            <View style={styles.upiWrap}>
              <View style={[styles.qrCard, { borderRadius: radius.md }]}>
                <Image source={require('../../../assets/upi.png')} style={styles.qr} resizeMode="contain" />
              </View>
              <Text variant="bodyStrong" center>Scan to pay with any UPI app</Text>
              <View style={styles.appRow}>
                {['GPay', 'PhonePe', 'Paytm'].map(a => (
                  <View key={a} style={[styles.appBadge, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
                    <Text variant="caption" color="textSecondary">{a}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.upiIdRow, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
                <View style={styles.flex}>
                  <Text variant="caption" color="textSecondary">UPI ID</Text>
                  <Text variant="bodyStrong">{UPI_ID}</Text>
                </View>
                <Button
                  label={copied ? 'Copied' : 'Copy'}
                  size="sm"
                  variant={copied ? 'secondary' : 'primary'}
                  onPress={copyUpi}
                  left={<Icon name={copied ? 'checkmark' : 'copy-outline'} size={15} color={copied ? colors.text : colors.onPrimary} />}
                />
              </View>
            </View>
          </Card>
        )}
      </Animated.View>

      <Text variant="caption" color="textTertiary" center>
        {`${APP.name} is an independently developed app, not a charity. Support is entirely voluntary.`}
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { alignItems: 'center', gap: 8, padding: 28, overflow: 'hidden' },
  heroBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroSub: { opacity: 0.92 },
  reason: { flexDirection: 'row', alignItems: 'center' },
  reasonIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  amount: { paddingHorizontal: 14, paddingVertical: 6 },
  upiWrap: { alignItems: 'center', gap: 14 },
  qrCard: { padding: 16, backgroundColor: '#FFFFFF' },
  qr: { width: 200, height: 200 },
  appRow: { flexDirection: 'row', gap: 8 },
  appBadge: { paddingHorizontal: 12, paddingVertical: 5 },
  upiIdRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, alignSelf: 'stretch' },
});
