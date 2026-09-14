import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, StatusBar } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme, useThemeMode } from '../theme/ThemeProvider';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import { useResponsive } from '../hooks/useResponsive';
import { AnimatedBlobs } from './AnimatedBlobs';

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  /** Constrain content width and center it on tablets. */
  constrained?: boolean;
  /** Ambient neon blob backdrop. Default on for the branded look. */
  backdrop?: boolean;
  /** Backdrop intensity 0..1. Lower it on dense/reading screens. */
  backdropIntensity?: number;
  /** Fade content in on mount. Default on. */
  animateIn?: boolean;
  contentContainerStyle?: ViewStyle;
}

/** Standard screen frame: safe area, themed background, status bar, tablet width. */
export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  constrained = true,
  backdrop = true,
  backdropIntensity = 0.7,
  animateIn = true,
  contentContainerStyle,
}) => {
  const { colors, spacing } = useTheme();
  const mode = useThemeMode();
  const { isTablet } = useResponsive();

  const inner: ViewStyle = {
    padding: padded ? spacing.lg : 0,
    width: '100%',
    maxWidth: constrained && isTablet ? CONTENT_MAX_WIDTH : undefined,
    alignSelf: 'center',
  };

  const Body = animateIn ? Animated.View : View;
  const bodyProps = animateIn ? { entering: FadeIn.duration(320) } : {};

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {backdrop && <AnimatedBlobs intensity={backdropIntensity} />}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={inner}
          showsVerticalScrollIndicator={false}
        >
          {/* Layout styles (gap, paddingBottom) live on Body so `gap` actually
              spaces the children — on the ScrollView container it would only see
              this single Body child and be swallowed. */}
          <Body {...bodyProps} style={[{ paddingBottom: spacing.giant }, contentContainerStyle]}>
            {children}
          </Body>
        </ScrollView>
      ) : (
        <Body {...bodyProps} style={[styles.flex, inner, contentContainerStyle]}>
          {children}
        </Body>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
