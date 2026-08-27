import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import {
  Button,
  Confetti,
  Gradient,
  GlassCard,
  Header,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { getComponent } from '../data/components';
import { LabComponentId } from '../types';
import { ArchitectureFlow } from '../components/ArchitectureFlow';
import { shareMyAI } from '../showcase/share';

const Stat: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => {
  const { colors, spacing, radius } = useTheme();
  return (
    <GlassCard elevation="sm" style={StyleSheet.flatten([styles.stat, { borderRadius: radius.md }])}>
      <Icon name={icon} size={18} color={colors.primary} />
      <Text variant="h3" style={{ marginTop: spacing.xs }}>
        {value}
      </Text>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
    </GlassCard>
  );
};

export const AILabShowcaseScreen: React.FC = () => {
  const { colors, spacing, radius, gradients } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AILabShowcase'>>();
  const {
    title,
    emoji,
    components,
    score,
    xpEarned,
    challengesDone,
    challengesTotal,
    concept,
  } = route.params;

  const comps = components as LabComponentId[];

  // Capture the branded card as a PNG and share the image (falls back to
  // text-only inside shareAchievement if capture fails).
  const shotRef = useRef<React.ComponentRef<typeof ViewShot>>(null);
  const share = async () => {
    let uri: string | undefined;
    try {
      uri = await shotRef.current?.capture?.();
    } catch {
      uri = undefined;
    }
    await shareMyAI(
      { title, components: comps, score, challengesDone, challengesTotal },
      uri,
    );
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header onBack={() => navigation.goBack()} />

      {/* Everything inside ViewShot becomes the shared image — solid bg so it
          renders correctly across share targets. */}
      <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
        <View
          style={[
            styles.capture,
            {
              backgroundColor: colors.background,
              borderRadius: radius.lg,
              padding: spacing.lg,
              gap: spacing.xl,
            },
          ]}
        >
      {/* Hero */}
      <Animated.View style={styles.hero}>
        <Animated.View
          style={[
            styles.heroBadge,
            { borderRadius: radius.xl, borderColor: colors.glassBorder },
          ]}
        >
          <Gradient
            colors={gradients.brand}
            opacities={[0.35, 0.12]}
            borderRadius={radius.xl}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <Text style={styles.heroEmoji}>{emoji}</Text>
        </Animated.View>
        <Text variant="h1" center>
          {title}
        </Text>
        <Text variant="body" color="textSecondary" center>
          Built by you
        </Text>
      </Animated.View>

      {/* Architecture visual */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="textSecondary" center>
          YOUR ARCHITECTURE
        </Text>
        <ArchitectureFlow components={comps} accent={colors.primary} />
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { gap: spacing.md }]}>
        <Stat icon="star" label="Score" value={`${score}`} />
        {xpEarned > 0 && <Stat icon="flash" label="XP earned" value={`${xpEarned}`} />}
        {challengesTotal > 0 && (
          <Stat
            icon="flag"
            label="Challenges"
            value={`${challengesDone}/${challengesTotal}`}
          />
        )}
      </View>

      {/* Concepts learned — derived from the real build. */}
      <GlassCard elevation="sm">
        <Text variant="label" color="textSecondary">
          CONCEPTS LEARNED
        </Text>
        <Text variant="body" style={{ marginTop: spacing.xs }}>
          {concept}
        </Text>
        <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
          {comps.map(id => {
            const c = getComponent(id);
            return (
              <View key={id} style={[styles.conceptRow, { gap: spacing.xs }]}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: colors.primaryMuted, borderRadius: radius.sm },
                  ]}
                >
                  <Text style={styles.dotEmoji}>{c.emoji}</Text>
                </View>
                <Text variant="caption" color="textSecondary" style={styles.flex}>
                  <Text variant="caption">{c.label}: </Text>
                  {c.blurb}
                </Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

          {/* Branding footer — makes the shared image self-explanatory. */}
          <Text variant="caption" color="textTertiary" center>
            🧪 Built with Anviksha AI Lab
          </Text>
        </View>
      </ViewShot>

      <Button
        label="Share My AI"
        onPress={share}
        fullWidth
        left={<Icon name="share-social" size={18} color={colors.onPrimary} />}
      />

      <Confetti />
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  capture: {},
  hero: { alignItems: 'center', gap: 4 },
  heroBadge: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 4,
  },
  heroEmoji: { fontSize: 48 },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center' },
  conceptRow: { flexDirection: 'row', alignItems: 'flex-start' },
  dot: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  dotEmoji: { fontSize: 13 },
});
