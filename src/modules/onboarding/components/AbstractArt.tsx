import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { OnboardingSlide } from '../data';

interface Props {
  variant: OnboardingSlide['art'];
  size: number;
}

const STROKE = 'rgba(255,255,255,0.85)';
const FAINT = 'rgba(255,255,255,0.35)';

/** Lightweight abstract vector art — no stock illustrations. */
export const AbstractArt: React.FC<Props> = ({ variant, size }) => {
  if (variant === 'orbit') {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="8" fill={STROKE} />
        <Circle cx="50" cy="50" r="24" stroke={FAINT} strokeWidth={1.5} fill="none" />
        <Circle cx="50" cy="50" r="38" stroke={FAINT} strokeWidth={1.5} fill="none" />
        <Circle cx="74" cy="50" r="4" fill={STROKE} />
        <Circle cx="24" cy="62" r="3" fill={STROKE} />
        <Circle cx="50" cy="12" r="3.5" fill={STROKE} />
      </Svg>
    );
  }

  if (variant === 'waves') {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M5 40 Q 27.5 20 50 40 T 95 40" stroke={STROKE} strokeWidth={2} fill="none" />
        <Path d="M5 55 Q 27.5 35 50 55 T 95 55" stroke={FAINT} strokeWidth={2} fill="none" />
        <Path d="M5 70 Q 27.5 50 50 70 T 95 70" stroke={FAINT} strokeWidth={2} fill="none" />
      </Svg>
    );
  }

  // grid
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {[25, 50, 75].map(p => (
        <React.Fragment key={`h${p}`}>
          <Line x1="15" y1={p} x2="85" y2={p} stroke={FAINT} strokeWidth={1} />
          <Line x1={p} y1="15" x2={p} y2="85" stroke={FAINT} strokeWidth={1} />
        </React.Fragment>
      ))}
      <Circle cx="25" cy="50" r="4" fill={STROKE} />
      <Circle cx="50" cy="25" r="4" fill={STROKE} />
      <Circle cx="75" cy="75" r="4" fill={STROKE} />
      <Line x1="25" y1="50" x2="50" y2="25" stroke={STROKE} strokeWidth={1.5} />
      <Line x1="50" y1="25" x2="75" y2="75" stroke={STROKE} strokeWidth={1.5} />
    </Svg>
  );
};
