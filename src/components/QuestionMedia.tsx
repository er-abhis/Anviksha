import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { QuestionMedia as Media } from '../content/types';
import { Gradient } from './Gradient';
import { Text } from './Text';

/**
 * Reusable visual for a question. Fixed height → the layout never jumps while
 * an image loads or falls back. Three sources, one component:
 *  - icon  → an Ionicons glyph on a tinted panel with AI gradient & concept badge;
 *  - uri   → remote image (RN caches it) with spinner + graceful fallback;
 *  - local → bundled asset.
 * Always exposes `alt` as the accessibility label.
 */
const HEIGHT = 148;

export const QuestionMedia: React.FC<{ media: Media }> = ({ media }) => {
  const { colors, radius, gradients } = useTheme();
  const hasImage = !!media.uri || !!media.local;
  const [loading, setLoading] = useState(hasImage);
  const [failed, setFailed] = useState(false);

  const showImage = hasImage && !failed;
  const fallbackIcon = media.icon ?? 'hardware-chip-outline';

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={media.alt}
      style={[
        styles.frame,
        { height: HEIGHT, borderRadius: radius.lg, backgroundColor: colors.surfaceElevated, borderColor: colors.glassBorder },
      ]}
    >
      {showImage ? (
        <>
          <Image
            source={media.local ? media.local : { uri: media.uri! }}
            resizeMode="cover"
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
            style={StyleSheet.absoluteFill}
          />
          {loading && (
            <View style={styles.center} pointerEvents="none">
              <ActivityIndicator color={colors.primary} />
            </View>
          )}
        </>
      ) : (
        <View style={styles.center}>
          <Gradient colors={gradients.brand} opacities={[0.3, 0.1]} style={StyleSheet.absoluteFill} pointerEvents="none" />
          <View style={[styles.iconBadge, { backgroundColor: colors.surface, borderColor: colors.primary + '55', borderRadius: radius.xl }]}>
            <Icon name={fallbackIcon} size={42} color={colors.primary} />
          </View>
          <View style={[styles.altTag, { backgroundColor: colors.primaryMuted, borderColor: colors.primary + '33', borderRadius: radius.pill }]}>
            <Icon name="sparkles" size={12} color={colors.primary} />
            <Text variant="caption" style={{ color: colors.primary, fontWeight: '700', fontSize: 11 }}>
              {media.alt || 'AI Visual Concept'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { width: '100%', overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconBadge: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  altTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
  },
});

