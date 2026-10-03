import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard } from '../../../components/GlassCard';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';

export interface WelcomeGuideBannerProps {
  onStartLesson: () => void;
  onExploreSandbox: () => void;
}

export const WelcomeGuideBanner: React.FC<WelcomeGuideBannerProps> = ({
  onStartLesson,
  onExploreSandbox,
}) => {
  const { colors, radius, spacing } = useTheme();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)}>
      <GlassCard
        elevation="glow"
        style={[
          styles.container,
          {
            borderColor: colors.primary + '55',
            borderRadius: radius.xl,
            backgroundColor: colors.surfaceAlt,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={[styles.badge, { backgroundColor: colors.primaryMuted }]}>
            <Text style={{ fontSize: 16 }}>🎓</Text>
            <Text variant="caption" style={{ color: colors.primary, fontWeight: '800', fontSize: 11 }}>
              BEGINNER'S GUIDE
            </Text>
          </View>

          <Pressable
            onPress={() => setDismissed(true)}
            hitSlop={8}
            style={[styles.closeBtn, { backgroundColor: colors.surface }]}
            accessibilityLabel="Dismiss guide"
          >
            <Icon name="close" size={14} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Welcome Headline */}
        <Text variant="h3" style={{ fontSize: 16, fontWeight: '800', marginTop: 4 }}>
          Welcome to Anviksha AI!
        </Text>
        <Text variant="caption" color="textSecondary" style={{ fontSize: 12, lineHeight: 17 }}>
          Master Artificial Intelligence step-by-step from zero to hero. No prior coding or math needed—just follow your visual guide:
        </Text>

        {/* 3 Step Roadmap */}
        <View style={styles.stepGrid}>
          <Pressable
            onPress={onStartLesson}
            style={[styles.stepCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}
          >
            <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
              <Text variant="caption" style={{ color: '#FFF', fontWeight: '900', fontSize: 10 }}>
                1
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong" style={{ fontSize: 12, fontWeight: '700' }}>
                Follow Visual Trail
              </Text>
              <Text variant="caption" color="textSecondary" style={{ fontSize: 10 }}>
                Bite-sized chapters with zero jargon
              </Text>
            </View>
            <Icon name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>

          <Pressable
            onPress={onExploreSandbox}
            style={[styles.stepCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}
          >
            <View style={[styles.stepNum, { backgroundColor: colors.accent }]}>
              <Text variant="caption" style={{ color: '#000', fontWeight: '900', fontSize: 10 }}>
                2
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong" style={{ fontSize: 12, fontWeight: '700' }}>
                Play in AI Sandbox
              </Text>
              <Text variant="caption" color="textSecondary" style={{ fontSize: 10 }}>
                Simulate neural networks & prompt LLMs
              </Text>
            </View>
            <Icon name="chevron-forward" size={14} color={colors.accent} />
          </Pressable>
        </View>

        {/* Footer Dismiss CTA */}
        <Pressable
          onPress={() => setDismissed(true)}
          style={[styles.gotItBtn, { backgroundColor: colors.primaryMuted, borderRadius: radius.pill }]}
        >
          <Text variant="caption" style={{ color: colors.primary, fontWeight: '800', fontSize: 11 }}>
            Got it, let's learn! ✨
          </Text>
        </Pressable>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 14, gap: 8, borderWidth: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  closeBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepGrid: { gap: 6, marginTop: 4 },
  stepCard: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 },
  stepNum: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  gotItBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, marginTop: 4 },
});
