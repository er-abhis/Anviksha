import React from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TypographyVariant } from '../theme/typography';
import { ColorPalette } from '../theme/colors';
import { scaleFont } from '../utils/responsive';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  /** Semantic color role from the theme; defaults to primary text color. */
  color?: keyof ColorPalette;
  center?: boolean;
}

/** Themed, responsive text. Single place fonts/scale are applied. */
export const Text: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'text',
  center,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const base = theme.typography[variant];

  // When a caller overrides fontSize (e.g. an emoji at 40px) without also
  // giving a lineHeight, the variant's small lineHeight would clip the glyph
  // top/bottom. Drop the base lineHeight so RN derives it from the new size.
  const flat = StyleSheet.flatten(style) || {};
  const sizeOverridden = flat.fontSize != null && flat.lineHeight == null;

  return (
    <RNText
      // Honour OS font scaling for accessibility, but cap it so very large
      // system fonts can't break dense sim/quiz layouts.
      maxFontSizeMultiplier={1.4}
      {...rest}
      style={[
        base,
        base.fontSize ? { fontSize: scaleFont(base.fontSize) } : null,
        { color: theme.colors[color] },
        center && styles.center,
        style,
        sizeOverridden && { lineHeight: undefined },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
