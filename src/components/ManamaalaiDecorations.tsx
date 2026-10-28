import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  G,
  Line,
} from 'react-native-svg';

// Color constants matching the design reference
export const MatrimonyColors = {
  creme: '#EEE4DA',
  sand: '#D8C4AC',
  dustyPink: '#C8A49F',
  burgundy: '#4D0E13',
  burgundyDark: '#38090D',
  burgundyLight: '#6B1B22',
  cremeCard: '#F7F2EC',
  inputBg: '#F3EAE0',
  textBurgundy: '#4D0E13',
  textMuted: '#7D685E',
  textSecondary: '#6E5A50',
  borderSand: '#D8C4AC',
  borderGold: '#D8C4AC',
  lotusPink: '#C8A49F',
};

/**
 * Top-left traditional Tamil Kolam flourish
 * Intricate decorative loops and dot grid ornament
 */
export const KolamCorner: React.FC<{ style?: ViewStyle; size?: number }> = ({
  style,
  size = 75,
}) => {
  return (
    <View style={[styles.kolamWrap, style]} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* Subtle decorative outer corner lines */}
        <Path
          d="M 12 8 L 110 8"
          stroke={MatrimonyColors.sand}
          strokeWidth="0.8"
          strokeDasharray="4 3"
          opacity="0.6"
        />
        <Path
          d="M 8 12 L 8 110"
          stroke={MatrimonyColors.sand}
          strokeWidth="0.8"
          strokeDasharray="4 3"
          opacity="0.6"
        />

        {/* Small corner flower motif at apex */}
        <Circle cx="8" cy="8" r="3" fill={MatrimonyColors.dustyPink} opacity="0.8" />
        <Circle cx="8" cy="8" r="6" stroke={MatrimonyColors.sand} strokeWidth="0.8" opacity="0.6" />

        {/* Classical Sikku / Brahma Mudi Kolam loops */}
        <G transform="translate(18, 18)" opacity="0.85">
          {/* Central loops */}
          <Path
            d="M 28 6 C 36 6, 44 14, 44 22 C 44 30, 36 38, 28 38 C 20 38, 12 30, 12 22 C 12 14, 20 6, 28 6 Z"
            stroke={MatrimonyColors.sand}
            strokeWidth="1.2"
            fill="none"
          />
          <Path
            d="M 12 22 C 12 14, 20 6, 28 6 C 36 6, 44 14, 44 22 C 44 30, 36 38, 28 38 C 20 38, 12 30, 12 22 Z"
            stroke={MatrimonyColors.dustyPink}
            strokeWidth="1.2"
            fill="none"
            transform="rotate(45 28 22)"
          />

          {/* Kolam dots (Pulli) */}
          <Circle cx="28" cy="22" r="2.2" fill={MatrimonyColors.burgundy} opacity="0.75" />
          <Circle cx="16" cy="10" r="1.6" fill={MatrimonyColors.sand} />
          <Circle cx="40" cy="10" r="1.6" fill={MatrimonyColors.sand} />
          <Circle cx="16" cy="34" r="1.6" fill={MatrimonyColors.sand} />
          <Circle cx="40" cy="34" r="1.6" fill={MatrimonyColors.sand} />

          {/* Surrounding auspicious petal flourishes */}
          <Path
            d="M 28 2 C 24 -4, 32 -4, 28 2 Z"
            stroke={MatrimonyColors.dustyPink}
            strokeWidth="1"
            fill={MatrimonyColors.creme}
          />
          <Path
            d="M 48 22 C 54 18, 54 26, 48 22 Z"
            stroke={MatrimonyColors.dustyPink}
            strokeWidth="1"
            fill={MatrimonyColors.creme}
          />
          <Path
            d="M 28 42 C 24 48, 32 48, 28 42 Z"
            stroke={MatrimonyColors.dustyPink}
            strokeWidth="1"
            fill={MatrimonyColors.creme}
          />
          <Path
            d="M 8 22 C 2 18, 2 26, 8 22 Z"
            stroke={MatrimonyColors.dustyPink}
            strokeWidth="1"
            fill={MatrimonyColors.creme}
          />
        </G>
      </Svg>
    </View>
  );
};

/**
 * Left-side vertical golden hairline with traditional star blossom accent
 */
export const LeftVerticalAccent: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.verticalAccentWrap, style]} pointerEvents="none">
      <Svg width={20} height={240} viewBox="0 0 20 240" fill="none">
        {/* Top thin line */}
        <Line x1="10" y1="0" x2="10" y2="105" stroke={MatrimonyColors.sand} strokeWidth="1" opacity="0.6" />
        
        {/* Center decorative flower star */}
        <G transform="translate(10, 120)">
          <Circle cx="0" cy="0" r="4.5" stroke={MatrimonyColors.sand} strokeWidth="0.8" opacity="0.8" />
          <Circle cx="0" cy="0" r="1.8" fill={MatrimonyColors.burgundy} opacity="0.7" />
          {/* Star petals */}
          <Path d="M 0 -6 L 0 6" stroke={MatrimonyColors.dustyPink} strokeWidth="1" opacity="0.8" />
          <Path d="M -6 0 L 6 0" stroke={MatrimonyColors.dustyPink} strokeWidth="1" opacity="0.8" />
          <Path d="M -4.2 -4.2 L 4.2 4.2" stroke={MatrimonyColors.dustyPink} strokeWidth="0.8" opacity="0.6" />
          <Path d="M -4.2 4.2 L 4.2 -4.2" stroke={MatrimonyColors.dustyPink} strokeWidth="0.8" opacity="0.6" />
        </G>

        {/* Bottom thin line */}
        <Line x1="10" y1="135" x2="10" y2="240" stroke={MatrimonyColors.sand} strokeWidth="1" opacity="0.6" />
      </Svg>
    </View>
  );
};

/**
 * Stylized Lotus Flower Divider with horizontal accent lines
 */
export const LotusDivider: React.FC<{
  width?: number;
  color?: string;
  lineColor?: string;
  style?: ViewStyle;
}> = ({
  width = 170,
  color = MatrimonyColors.dustyPink,
  lineColor = MatrimonyColors.sand,
  style,
}) => {
  return (
    <View style={[styles.lotusWrap, style]}>
      <Svg width={width} height={20} viewBox="0 0 180 20" fill="none">
        {/* Left hairline */}
        <Line x1="4" y1="10" x2="72" y2="10" stroke={lineColor} strokeWidth="1" opacity="0.85" />

        {/* Lotus Petals Center */}
        <G transform="translate(90, 10)">
          {/* Central Petal */}
          <Path
            d="M 0 -7 C -2.5 -3, -2.5 3, 0 6 C 2.5 3, 2.5 -3, 0 -7 Z"
            fill={color}
          />
          {/* Inner Left Petal */}
          <Path
            d="M -3.5 -4.5 C -7 -1, -5 4, -0.5 5.5 C -2.5 3, -3.5 0, -3.5 -4.5 Z"
            fill={color}
            opacity="0.9"
          />
          {/* Inner Right Petal */}
          <Path
            d="M 3.5 -4.5 C 7 -1, 5 4, 0.5 5.5 C 2.5 3, 3.5 0, 3.5 -4.5 Z"
            fill={color}
            opacity="0.9"
          />
          {/* Outer Left Calyx */}
          <Path
            d="M -7 -1 C -10 2, -7 6, -1.5 6 C -4.5 5, -6.5 3, -7 -1 Z"
            fill={lineColor}
            opacity="0.8"
          />
          {/* Outer Right Calyx */}
          <Path
            d="M 7 -1 C 10 2, 7 6, 1.5 6 C 4.5 5, 6.5 3, 7 -1 Z"
            fill={lineColor}
            opacity="0.8"
          />
        </G>

        {/* Right hairline */}
        <Line x1="108" y1="10" x2="176" y2="10" stroke={lineColor} strokeWidth="1" opacity="0.85" />
      </Svg>
    </View>
  );
};

/**
 * Premium Embossed Gold/Sand Medallion with MM Monogram
 * Recreates the exact crest emblem shown in the reference image
 */
export const ManamaalaiMedallion: React.FC<{
  size?: number;
  style?: ViewStyle;
}> = ({ size = 84, style }) => {
  return (
    <View style={[{ width: size, height: size }, styles.medallionWrap, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          {/* Radial metallic glow gradient */}
          <LinearGradient id="medallionGrad" x1="0" y1="0" x2="100" y2="100">
            <Stop offset="0%" stopColor="#F9F5F0" />
            <Stop offset="45%" stopColor="#EDE2D6" />
            <Stop offset="100%" stopColor="#E2D4C3" />
          </LinearGradient>

          <LinearGradient id="ringGrad" x1="0" y1="0" x2="100" y2="100">
            <Stop offset="0%" stopColor="#DFCBB6" />
            <Stop offset="50%" stopColor="#CBB29C" />
            <Stop offset="100%" stopColor="#BBA089" />
          </LinearGradient>

          <LinearGradient id="monogramGrad" x1="0" y1="0" x2="100" y2="100">
            <Stop offset="0%" stopColor="#7E3A42" />
            <Stop offset="50%" stopColor="#4D0E13" />
            <Stop offset="100%" stopColor="#35080C" />
          </LinearGradient>
        </Defs>

        {/* Outer drop shadow rim */}
        <Circle cx="50" cy="51" r="46" fill="#CBB6A1" opacity="0.3" />

        {/* Outer metallic ring */}
        <Circle cx="50" cy="50" r="46" stroke="url(#ringGrad)" strokeWidth="1.8" />
        
        {/* Subtle inner concentric detail ring */}
        <Circle
          cx="50"
          cy="50"
          r="43.5"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* Disc surface */}
        <Circle cx="50" cy="50" r="42" fill="url(#medallionGrad)" />

        {/* Stylized intertwined MM Monogram */}
        <G transform="translate(23, 27)">
          {/* Left 'M' Letterform with calligraphic thickness */}
          <Path
            d="M 4 38 L 4 10 L 17 28 L 27 14 L 27 38"
            stroke="url(#monogramGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right intertwined 'M' Letterform offset behind */}
          <Path
            d="M 27 38 L 27 10 L 37 28 L 50 10 L 50 38"
            stroke="url(#monogramGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Delicate inner decorative serif loops / accents */}
          <Circle cx="4" cy="9" r="1.8" fill={MatrimonyColors.burgundy} />
          <Circle cx="50" cy="9" r="1.8" fill={MatrimonyColors.burgundy} />
          <Circle cx="27" cy="13" r="1.6" fill={MatrimonyColors.dustyPink} />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  kolamWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  verticalAccentWrap: {
    position: 'absolute',
    left: 6,
    top: 190,
    zIndex: 1,
  },
  lotusWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  medallionWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});
