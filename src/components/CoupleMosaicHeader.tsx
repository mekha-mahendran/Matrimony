import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Curated authentic Tamil wedding couple portraits and matrimonial moments
const COUPLE_PHOTOS = [
  // 1. South Indian wedding bride & groom in mandapam
  require('../assets/images/wedding_couple.jpg'),
  // 2. Smiling Tamil bride & groom with fresh jasmine garlands
  require('../assets/images/tamil_couple_1.jpg'),
  // 3. Radiant Tamil bride with traditional temple jewellery
  require('../assets/images/tamil_bride_3.jpg'),
  // 4. Joyful South Indian couple in yellow silk saree & veshti
  require('../assets/images/tamil_couple_2.jpg'),
  // 5. Traditional auspicious kuthuvilakku brass lamp
  require('../assets/images/brass_lamp.jpg'),
  // 6. Joyful Tamil wedding couple
  require('../assets/images/tamil_couple_1.jpg'),
  // 7. Fragrant jasmine wedding garland
  require('../assets/images/jasmine_garland.jpg'),
  // 8. Traditional bridal portrait
  require('../assets/images/tamil_bride_3.jpg'),
  // 9. Happy married Tamil couple
  require('../assets/images/tamil_couple_2.jpg'),
  // 10. Sacred South Indian wedding ceremony
  require('../assets/images/wedding_couple.jpg'),
];

interface CoupleMosaicHeaderProps {
  height?: number;
}

export const CoupleMosaicHeader: React.FC<CoupleMosaicHeaderProps> = ({
  height = 300,
}) => {
  return (
    <View style={[styles.container, { height }]}>
      {/* 3-Column Mosaic Grid of Tamil Couples */}
      <View style={styles.mosaicGrid}>
        {/* Column 1 */}
        <View style={styles.mosaicColumn}>
          <Image source={COUPLE_PHOTOS[0]} style={[styles.photo, { height: height * 0.45 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[1]} style={[styles.photo, { height: height * 0.32 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[2]} style={[styles.photo, { height: height * 0.35 }]} resizeMode="cover" />
        </View>

        {/* Column 2 (Center) */}
        <View style={styles.mosaicColumn}>
          <Image source={COUPLE_PHOTOS[3]} style={[styles.photo, { height: height * 0.34 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[4]} style={[styles.photo, { height: height * 0.42 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[5]} style={[styles.photo, { height: height * 0.36 }]} resizeMode="cover" />
        </View>

        {/* Column 3 */}
        <View style={styles.mosaicColumn}>
          <Image source={COUPLE_PHOTOS[6]} style={[styles.photo, { height: height * 0.38 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[7]} style={[styles.photo, { height: height * 0.38 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[8]} style={[styles.photo, { height: height * 0.36 }]} resizeMode="cover" />
        </View>

        {/* Column 4 */}
        <View style={styles.mosaicColumn}>
          <Image source={COUPLE_PHOTOS[9]} style={[styles.photo, { height: height * 0.42 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[0]} style={[styles.photo, { height: height * 0.35 }]} resizeMode="cover" />
          <Image source={COUPLE_PHOTOS[1]} style={[styles.photo, { height: height * 0.35 }]} resizeMode="cover" />
        </View>
      </View>

      {/* Royal Warm Golden & Burgundy Vignette Overlay */}
      <View style={styles.overlay} />

      {/* Scalloped Curved Arc Bottom Cut */}
      <View style={styles.curveContainer} pointerEvents="none">
        <Svg width="100%" height={56} viewBox="0 0 360 56" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="goldArcLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#D8C4AC" />
              <Stop offset="30%" stopColor="#B08A4F" />
              <Stop offset="50%" stopColor="#C8A49F" />
              <Stop offset="70%" stopColor="#B08A4F" />
              <Stop offset="100%" stopColor="#D8C4AC" />
            </LinearGradient>
          </Defs>

          {/* Golden decorative accent arc */}
          <Path
            d="M0,16 Q180,60 360,16 L360,56 L0,56 Z"
            fill="none"
            stroke="url(#goldArcLine)"
            strokeWidth="3"
          />

          {/* Clean Ivory base fill */}
          <Path
            d="M0,20 Q180,62 360,20 L360,56 L0,56 Z"
            fill="#FFFDF9"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#3A0A0E',
  },
  mosaicGrid: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  mosaicColumn: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 1,
  },
  photo: {
    width: '100%',
    marginBottom: 2,
    backgroundColor: '#4D0E13',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(77, 14, 19, 0.22)',
  },
  curveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
  },
});
