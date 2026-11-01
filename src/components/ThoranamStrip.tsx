import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

interface ThoranamStripProps {
  height?: number;
}

export const ThoranamStrip: React.FC<ThoranamStripProps> = ({ height = 24 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height={height} viewBox="0 0 360 24" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="thoranamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#93A220" />
            <Stop offset="30%" stopColor="#D17575" />
            <Stop offset="50%" stopColor="#93A220" />
            <Stop offset="70%" stopColor="#D17575" />
            <Stop offset="100%" stopColor="#93A220" />
          </LinearGradient>
          <LinearGradient id="goldLeaf" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#93A220" />
            <Stop offset="100%" stopColor="#6A7513" />
          </LinearGradient>
          <LinearGradient id="pinkLeaf" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#D17575" />
            <Stop offset="100%" stopColor="#49141C" />
          </LinearGradient>
        </Defs>

        {/* Top Auspicious Thread */}
        <Path d="M0,2 L360,2" stroke="#93A220" strokeWidth="2.5" />
        <Path d="M0,4 L360,4" stroke="#E5DCA8" strokeWidth="1" strokeDasharray="3,3" />

        {/* Repeating Mango Leaves (Alternating Lime Olive & Dusty Rose) */}
        {/* Leaf 1 (Olive) */}
        <Path d="M15,4 C10,12 12,20 20,23 C28,20 30,12 25,4 Z" fill="url(#goldLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="20" cy="4" r="1.5" fill="#49141C" />

        {/* Leaf 2 (Rose) */}
        <Path d="M55,4 C50,12 52,20 60,23 C68,20 70,12 65,4 Z" fill="url(#pinkLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="60" cy="4" r="1.5" fill="#93A220" />

        {/* Leaf 3 (Olive) */}
        <Path d="M95,4 C90,12 92,20 100,23 C108,20 110,12 105,4 Z" fill="url(#goldLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="100" cy="4" r="1.5" fill="#49141C" />

        {/* Leaf 4 (Rose) */}
        <Path d="M135,4 C130,12 132,20 140,23 C148,20 150,12 145,4 Z" fill="url(#pinkLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="140" cy="4" r="1.5" fill="#93A220" />

        {/* Leaf 5 (Olive) */}
        <Path d="M175,4 C170,12 172,20 180,23 C188,20 190,12 185,4 Z" fill="url(#goldLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="180" cy="4" r="1.5" fill="#49141C" />

        {/* Leaf 6 (Rose) */}
        <Path d="M215,4 C210,12 212,20 220,23 C228,20 230,12 225,4 Z" fill="url(#pinkLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="220" cy="4" r="1.5" fill="#93A220" />

        {/* Leaf 7 (Olive) */}
        <Path d="M255,4 C250,12 252,20 260,23 C268,20 270,12 265,4 Z" fill="url(#goldLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="260" cy="4" r="1.5" fill="#49141C" />

        {/* Leaf 8 (Rose) */}
        <Path d="M295,4 C290,12 292,20 300,23 C308,20 310,12 305,4 Z" fill="url(#pinkLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="300" cy="4" r="1.5" fill="#93A220" />

        {/* Leaf 9 (Olive) */}
        <Path d="M335,4 C330,12 332,20 340,23 C348,20 350,12 345,4 Z" fill="url(#goldLeaf)" stroke="#49141C" strokeWidth="0.5" />
        <Circle cx="340" cy="4" r="1.5" fill="#49141C" />

        {/* Festoon Scallops Connecting the Leaves */}
        <Path
          d="M0,4 Q20,10 40,4 Q60,10 80,4 Q100,10 120,4 Q140,10 160,4 Q180,10 200,4 Q220,10 240,4 Q260,10 280,4 Q300,10 320,4 Q340,10 360,4"
          stroke="#E5DCA8"
          strokeWidth="1"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
