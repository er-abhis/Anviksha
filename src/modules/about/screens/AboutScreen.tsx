import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Gradient, GlassCard, Header, Logo, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { APP } from '../../../constants/app';

const DESCRIPTION =
  'Anviksha is designed to make Artificial Intelligence easy to understand for everyone. Instead of memorizing theory, learners explore AI concepts through visual explanations, simulations, quizzes, and interactive lessons. From Machine Learning to LLMs, Prompt Engineering, RAG, AI Agents, Computer Vision, and beyond, Anviksha helps you build intuition rather than just knowledge.';

const FEATURES = [
  { icon: 'cloud-offline-outline', label: 'Offline-first learning' },
  { icon: 'flask-outline', label: 'Interactive simulations' },
  { icon: 'sparkles-outline', label: 'Daily AI challenges' },
  { icon: 'trophy-outline', label: 'Achievement system' },
  { icon: 'trending-up-outline', label: 'Progress tracking' },
];

export const AboutScreen: React.FC = () => {
  const { colors, radius, spacing, gradients, elevation } = useTheme();
  const navigation = useNavigation();

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title="About App" onBack={() => navigation.goBack()} />

      <Animated.View entering={FadeInDown.duration(400)}>
        <Gradient colors={gradients.brand} style={{ ...styles.hero, borderRadius: radius.xl, ...elevation.glow }}>
          <View style={[styles.logoWrap, { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: radius.xl }]}>
            <Logo size={72} />
          </View>
          <Text variant="h1" color="textInverse">{APP.name}</Text>
          <Text variant="label" color="textInverse" style={styles.dim}>{`Version ${APP.version}`}</Text>
          <Text variant="body" color="textInverse" center style={{ marginTop: spacing.xs }}>
            Learn AI through interactive visual simulations.
          </Text>
        </Gradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(400)}>
        <GlassCard>
          <Text variant="body" color="textSecondary" style={styles.desc}>{DESCRIPTION}</Text>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ gap: spacing.md }}>
        <Text variant="h3">What’s inside</Text>
        <GlassCard padded={false} style={{ paddingHorizontal: spacing.lg }}>
          {FEATURES.map((f, i) => (
            <View
              key={f.label}
              style={[
                styles.feature,
                { gap: spacing.md, paddingVertical: spacing.md },
                i < FEATURES.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.glassBorder },
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md, borderColor: colors.glassBorder }]}>
                <Icon name={f.icon} size={19} color={colors.accent} />
              </View>
              <Text variant="body" style={styles.flex}>{f.label}</Text>
              <Icon name="checkmark-circle" size={19} color={colors.success} />
            </View>
          ))}
        </GlassCard>
      </Animated.View>

      <Text variant="label" color="textSecondary" center style={{ marginTop: spacing.sm }}>
        Built with ❤️ in India
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { alignItems: 'center', gap: 6, padding: 28, overflow: 'hidden' },
  logoWrap: { padding: 20, marginBottom: 6 },
  dim: { opacity: 0.9 },
  desc: { lineHeight: 24 },
  feature: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
});
