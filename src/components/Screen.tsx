import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeMode } from '../theme/ThemeProvider';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import { useResponsive } from '../hooks/useResponsive';

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  /** Constrain content width and center it on tablets. */
  constrained?: boolean;
  contentContainerStyle?: ViewStyle;
}

/** Standard screen frame: safe area, themed background, status bar, tablet width. */
export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  constrained = true,
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

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[inner, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
