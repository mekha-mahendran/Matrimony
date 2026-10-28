import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../theme';

interface KolamProps {
  color?: string;
  opacity?: number;
}

export const KolamPattern: React.FC<KolamProps> = ({
  color = Colors.dustyPinkDark,
  opacity = 0.16,
}) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" opacity={opacity}>
        {/* Subtle decorative Tamil kolam blossom - Top Right */}
        <Path
          d="M 320 40 Q 345 15 370 40 Q 395 65 370 90 Q 345 115 320 90 Q 295 65 320 40 Z"
          stroke={color}
          strokeWidth="1"
          fill="none"
        />
        <Circle cx="345" cy="65" r="2.5" fill={color} />
        <Circle cx="320" cy="40" r="1.5" fill={color} />
        <Circle cx="370" cy="40" r="1.5" fill={color} />
        <Circle cx="370" cy="90" r="1.5" fill={color} />
        <Circle cx="320" cy="90" r="1.5" fill={color} />

        {/* Delicate floral line-art - Bottom Left */}
        <Path
          d="M 40 420 C 40 435 25 448 10 448 C 25 448 40 460 40 475 C 40 460 55 448 70 448 C 55 448 40 435 40 420 Z"
          stroke={color}
          strokeWidth="1"
          fill="none"
        />
        <Circle cx="40" cy="448" r="2" fill={color} />

        {/* Center delicate connecting vine */}
        <Path
          d="M 10 180 Q 80 160 160 200 T 310 190"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="3 4"
          fill="none"
        />
      </Svg>
    </View>
  );
};
