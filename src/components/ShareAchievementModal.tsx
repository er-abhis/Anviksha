import React, { useRef } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { Gradient } from './Gradient';
import { Logo } from './Logo';
import { Text } from './Text';
import { Badge, BADGES } from '../content';
import { useAchievementsStore, useProgressStore } from '../store';
import { triggerHaptic } from '../utils/haptics';

export interface ShareAchievementModalProps {
  visible: boolean;
  onClose: () => void;
  badge?: Badge | null;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  visible,
  onClose,
  badge,
}) => {
  const { colors, radius, spacing, gradients } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);

  const { xp, level, streakDays } = useProgressStore();
  const unlocked = useAchievementsStore(s => s.unlocked);
  const unlockedCount = BADGES.filter(a => unlocked[a.slug]).length;

  const titleText = badge ? `Unlocked ${badge.title}! 🏆` : 'My AI Achievements 🏆';
  const shareMessage = badge
    ? `🏆 I just unlocked the "${badge.title}" achievement (${badge.description}) on Anviksha AI Lab! Learn AI by playing:`
    : `⚡ I've unlocked ${unlockedCount} of ${BADGES.length} AI achievements at Level ${level} on Anviksha AI Lab! Learn AI by playing:`;

  const handleShare = async () => {
    triggerHaptic('impactHeavy');
    try {
      if (viewShotRef.current && (viewShotRef.current as any).capture) {
        const uri = await (viewShotRef.current as any).capture();
        await Share.open({
          title: titleText,
          message: shareMessage,
          url: uri,
          type: 'image/png',
        });
      }
    } catch (_e) {
      // User cancelled share or failed
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <GlassCard elevation="glow" style={styles.cardContainer} padding={16}>
            <View style={styles.headerRow}>
              <Text variant="bodyStrong">{titleText}</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Icon name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Capturable Card View */}
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }}>
              <View style={[styles.shareCard, { borderRadius: radius.lg, overflow: 'hidden' }]}>
                <Gradient colors={gradients.brand} style={StyleSheet.absoluteFill} />
                <View style={styles.shareCardInner}>
                  {/* Branding Header */}
                  <View style={styles.logoRow}>
                    <Logo size={28} />
                    <View style={styles.flex}>
                      <Text variant="label" color="textInverse" style={{ letterSpacing: 1 }}>ANVIKSHA AI LAB</Text>
                      <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontSize: 10 }}>Achievement Certificate</Text>
                    </View>
                    <View style={[styles.levelBadge, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
                      <Icon name="trophy" size={13} color="#FFFFFF" />
                      <Text variant="label" color="textInverse" style={{ fontSize: 11 }}>{`${unlockedCount}/${BADGES.length}`}</Text>
                    </View>
                  </View>

                  {/* Badge Highlight or Overview */}
                  {badge ? (
                    <View style={styles.badgeHighlight}>
                      <View style={styles.badgeIconContainer}>
                        <Icon name={badge.icon} size={36} color="#FFFFFF" />
                      </View>
                      <Text variant="h2" color="textInverse" center style={{ fontSize: 20 }}>{badge.title}</Text>
                      <Text variant="caption" color="textInverse" center style={{ opacity: 0.9, marginTop: 2, fontSize: 11 }}>
                        {badge.description}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.badgeHighlight}>
                      <View style={styles.badgeIconContainer}>
                        <Icon name="ribbon" size={36} color="#FFFFFF" />
                      </View>
                      <Text variant="h2" color="textInverse" center style={{ fontSize: 20 }}>{`${unlockedCount} Badges Unlocked`}</Text>
                      <Text variant="caption" color="textInverse" center style={{ opacity: 0.9, marginTop: 2, fontSize: 11 }}>
                        Level {level} Explorer · {xp} Total XP · {streakDays}-Day Streak
                      </Text>
                    </View>
                  )}

                  {/* Footer */}
                  <View style={styles.footerRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="sparkles" size={12} color="#FFFFFF" />
                      <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontSize: 10, fontWeight: '700' }}>
                        VERIFIED ACHIEVEMENT
                      </Text>
                    </View>
                    <Text variant="caption" color="textInverse" style={{ opacity: 0.85, fontSize: 10 }}>
                      Anviksha · 100% Offline AI
                    </Text>
                  </View>
                </View>
              </View>
            </ViewShot>

            <View style={styles.actionsRow}>
              <Button label="Share Image 🚀" onPress={handleShare} style={{ flex: 1 }} />
              <Button label="Close" variant="secondary" onPress={onClose} />
            </View>
          </GlassCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: { width: '100%', maxWidth: 380 },
  cardContainer: { gap: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shareCard: {},
  shareCardInner: { padding: 18, gap: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeHighlight: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
