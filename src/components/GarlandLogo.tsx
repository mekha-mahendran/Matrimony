import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Colors, Typography } from '../theme';

interface GarlandLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
  lightMode?: boolean;
}

export const GarlandLogo: React.FC<GarlandLogoProps> = ({
  size = 'medium',
  showSubtitle = true,
  lightMode = false,
}) => {
  const iconSize = size === 'small' ? 38 : size === 'large' ? 76 : 52;
  const titleSize = size === 'small' ? 17 : size === 'large' ? 26 : 21;
  const subSize = size === 'small' ? 9.5 : size === 'large' ? 12 : 10.5;

  const brandColor = lightMode ? Colors.creme : Colors.burgundy;
  const subColor = lightMode ? Colors.sandLight : Colors.textSecondary;
  const lineArtColor = lightMode ? Colors.dustyPink : Colors.burgundy;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { width: iconSize, height: iconSize }]}>
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100" fill="none">
          <Defs>
            <LinearGradient id="garlandGrad" x1="0" y1="0" x2="100" y2="100">
              <Stop offset="0%" stopColor={lineArtColor} />
              <Stop offset="100%" stopColor={Colors.dustyPinkDark} />
            </LinearGradient>
          </Defs>

          {/* Minimal refined circular aura */}
          <Circle
            cx="50"
            cy="50"
            r="44"
            stroke={lightMode ? Colors.dustyPink : Colors.sand}
            strokeWidth="1.2"
            strokeDasharray="2 3"
            opacity="0.85"
          />

          {/* Graceful wedding garland (மணமாலை) line art */}
          <Path
            d="M 26 28 C 28 58, 45 74, 50 74 C 55 74, 72 58, 74 28"
            stroke={lineArtColor}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Delicate jasmine & blossom beads */}
          <Circle cx="30" cy="36" r="3.5" fill={Colors.cremeLight} stroke={lineArtColor} strokeWidth="1" />
          <Circle cx="36" cy="48" r="3.5" fill={Colors.dustyPink} />
          <Circle cx="43" cy="60" r="3.5" fill={Colors.cremeLight} stroke={lineArtColor} strokeWidth="1" />

          <Circle cx="70" cy="36" r="3.5" fill={Colors.cremeLight} stroke={lineArtColor} strokeWidth="1" />
          <Circle cx="64" cy="48" r="3.5" fill={Colors.dustyPink} />
          <Circle cx="57" cy="60" r="3.5" fill={Colors.cremeLight} stroke={lineArtColor} strokeWidth="1" />

          {/* Central Mangalyam knot ornament */}
          <Circle cx="50" cy="74" r="5" fill={Colors.sandDark} stroke={lineArtColor} strokeWidth="1.5" />
          <Circle cx="50" cy="74" r="2" fill={lineArtColor} />

          {/* Auspicious pendant drop */}
          <Path d="M 50 79 L 50 90" stroke={lineArtColor} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="50" cy="91" r="1.8" fill={Colors.dustyPink} />

          {/* Top traditional diya petal */}
          <Path
            d="M 50 18 C 47 23, 47 27, 50 29 C 53 27, 53 23, 50 18 Z"
            fill={Colors.dustyPink}
          />
        </Svg>
      </View>

      <View style={styles.textWrap}>
        <View style={styles.brandRow}>
          <Text
            style={[
              styles.tamilBrand,
              { fontSize: titleSize, color: brandColor, fontFamily: Typography.fontSerif },
            ]}
          >
            மணமாலை
          </Text>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>EST. TAMIL</Text>
          </View>
        </View>

        <Text style={[styles.englishBrand, { fontSize: subSize, color: brandColor }]}>
          MANAMAALAI MATRIMONY
        </Text>

        {showSubtitle && (
          <View style={styles.blessingRow}>
            <View style={[styles.decoLine, { backgroundColor: Colors.dustyPink }]} />
            <Text style={[styles.blessingText, { fontSize: subSize, color: subColor }]}>
              வாழ்க வளமுடன்
            </Text>
            <View style={[styles.decoLine, { backgroundColor: Colors.dustyPink }]} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  textWrap: {
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tamilBrand: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  badgePill: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: Colors.dustyPinkLight,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.burgundy,
    letterSpacing: 0.6,
  },
  englishBrand: {
    fontWeight: '600',
    letterSpacing: 2.2,
    marginTop: 1,
    opacity: 0.9,
  },
  blessingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  decoLine: {
    width: 16,
    height: 1,
    marginHorizontal: 6,
    opacity: 0.7,
  },
  blessingText: {
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: 0.4,
  },
});
