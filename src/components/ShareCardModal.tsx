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
import { XPBadge } from './XPBadge';
import { useProgressStore, conceptsMastered, useBrainStore } from '../store';
import { triggerHaptic } from '../utils/haptics';

export const ShareCardModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { colors, spacing, radius, gradients } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);

  const { xp, coins, level, streakDays } = useProgressStore();
  const mastered = useBrainStore(conceptsMastered);

  const handleShare = async () => {
    triggerHaptic('impactHeavy');
    try {
      if (viewShotRef.current && (viewShotRef.current as any).capture) {
        const uri = await (viewShotRef.current as any).capture();
        await Share.open({
          title: 'My AI Mastery on Anviksha',
          message: `🔥 I'm at Level ${level} with ${xp} XP and a ${streakDays}-day streak on Anviksha AI Lab! Learn AI by playing:`,
          url: uri,
          type: 'image/png',
        });
      }
    } catch (_e) {
      // User cancelled share or share failed silently
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <GlassCard elevation="glow" style={styles.cardContainer} padding={16}>
            <View style={styles.headerRow}>
              <Text variant="bodyStrong">Share Achievement Card 🏆</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Icon name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Capturable Image View */}
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }}>
              <View style={[styles.shareCard, { borderRadius: radius.lg, overflow: 'hidden' }]}>
                <Gradient colors={gradients.brand} style={StyleSheet.absoluteFill} />
                <View style={styles.shareCardInner}>
                  <View style={styles.logoRow}>
                    <Logo size={32} />
                    <View style={styles.flex}>
                      <Text variant="label" color="textInverse" style={{ letterSpacing: 1 }}>ANVIKSHA AI LAB</Text>
                      <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontSize: 10 }}>AI Mastery Milestone</Text>
                    </View>
                    <View style={[styles.levelBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <Icon name="ribbon" size={14} color="#FFFFFF" />
                      <Text variant="label" color="textInverse">{`Level ${level}`}</Text>
                    </View>
                  </View>

                  <View style={styles.mainStatsRow}>
                    <View style={styles.statCol}>
                      <Text variant="h1" color="textInverse" style={{ fontSize: 28, fontWeight: '800' }}>{xp}</Text>
                      <Text variant="caption" color="textInverse" style={{ opacity: 0.85, fontSize: 10 }}>TOTAL XP</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCol}>
                      <Text variant="h1" color="textInverse" style={{ fontSize: 28, fontWeight: '800' }}>{streakDays}d</Text>
                      <Text variant="caption" color="textInverse" style={{ opacity: 0.85, fontSize: 10 }}>STREAK</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCol}>
                      <Text variant="h1" color="textInverse" style={{ fontSize: 28, fontWeight: '800' }}>{mastered}</Text>
                      <Text variant="caption" color="textInverse" style={{ opacity: 0.85, fontSize: 10 }}>CONCEPTS</Text>
                    </View>
                  </View>

                  <View style={styles.badgesFooter}>
                    <XPBadge value={coins} kind="coins" />
                    <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontSize: 10, flex: 1, textAlign: 'right' }}>
                      Learn AI by Playing · 100% Offline
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: { width: '100%', maxWidth: 380 },
  cardContainer: { gap: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shareCard: {},
  shareCardInner: { padding: 16, gap: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  mainStatsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8 },
  statCol: { alignItems: 'center' },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },
  badgesFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
