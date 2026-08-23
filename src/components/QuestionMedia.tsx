import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { QuestionMedia as Media } from '../content/types';

/**
 * Reusable visual for a question. Fixed height → the layout never jumps while
 * an image loads or falls back. Three sources, one component:
 *  - icon  → an Ionicons glyph on a tinted panel (offline, instant, default);
 *  - uri   → remote image (RN caches it) with spinner + graceful fallback;
 *  - local → bundled asset.
 * Always exposes `alt` as the accessibility label.
 */
const HEIGHT = 148;

export const QuestionMedia: React.FC<{ media: Media }> = ({ media }) => {
  const { colors, radius } = useTheme();
  const hasImage = !!media.uri || !!media.local;
  const [loading, setLoading] = useState(hasImage);
  const [failed, setFailed] = useState(false);

  const showImage = hasImage && !failed;
  const fallbackIcon = media.icon ?? 'image-outline';

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={media.alt}
      style={[
        styles.frame,
        { height: HEIGHT, borderRadius: radius.lg, backgroundColor: colors.primaryMuted, borderColor: colors.border },
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
          <Icon name={fallbackIcon} size={56} color={colors.primary} />
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
  },
});
