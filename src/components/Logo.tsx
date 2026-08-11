import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

/** The Anviksha app logo. Single source of the asset require so branding
 *  stays consistent everywhere (splash, header, loading, home). */
const LOGO = require('../assets/logo.png');

export interface LogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const Logo: React.FC<LogoProps> = ({ size = 48, style }) => (
  <Image
    source={LOGO}
    accessibilityLabel="Anviksha logo"
    resizeMode="contain"
    style={[{ width: size, height: size }, style]}
  />
);
