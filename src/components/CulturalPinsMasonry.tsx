import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Language, Translations } from '../localization';
import {
  BanglesIllustration,
  GarlandIllustration,
  JasmineIllustration,
  KalasamIllustration,
  KolamIllustration,
  KuthuvilakkuIllustration,
  TempleArchIllustration,
} from './TamilCulturalIcons';

interface CulturalPinsMasonryProps {
  language: Language;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CulturalPinsMasonry: React.FC<CulturalPinsMasonryProps> = ({ language }) => {
  const t = Translations[language];
  const isTa = language === 'ta';

  // Animation values
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const col1TranslateY = useRef(new Animated.Value(0)).current;
  const col2TranslateY = useRef(new Animated.Value(-350)).current;

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check reduce motion preference
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => setReduceMotion(enabled)
    );

    return () => {
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    // Fade in on load
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    if (reduceMotion) {
      col1TranslateY.setValue(0);
      col2TranslateY.setValue(0);
      return;
    }

    // Column 1 loops from 0 to -400 over 75s
    const loopCol1 = Animated.loop(
      Animated.sequence([
        Animated.timing(col1TranslateY, {
          toValue: -400,
          duration: 75000,
          useNativeDriver: true,
        }),
        Animated.timing(col1TranslateY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // Column 2 loops from -400 to 0 over 85s (opposite drift)
    const loopCol2 = Animated.loop(
      Animated.sequence([
        Animated.timing(col2TranslateY, {
          toValue: 0,
          duration: 85000,
          useNativeDriver: true,
        }),
        Animated.timing(col2TranslateY, {
          toValue: -400,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loopCol1.start();
    loopCol2.start();

    return () => {
      loopCol1.stop();
      loopCol2.stop();
    };
  }, [reduceMotion]);

  // Captions based on active language
  const captions = {
    kolam: isTa ? 'மங்கள கோலம்' : 'Auspicious Kolam',
    jasmine: isTa ? 'மணக்கும் மல்லி' : 'Fragrant Jasmine',
    templeArch: isTa ? 'கோபுர வாசல்' : 'Temple Arch',
    kuthuvilakku: isTa ? 'குத்துவிளக்கு' : 'Kuthuvilakku Lamp',
    kalasam: isTa ? 'மங்கல கலசம்' : 'Sacred Kalasam',
    garland: isTa ? 'மணமாலை' : 'Wedding Garland',
    bangles: isTa ? 'மங்கள வளையல்' : 'Bridal Bangles',
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeInAnim }]} pointerEvents="none">
      {/* 2 Drifting Masonry Columns */}
      <View style={styles.masonryWrapper}>
        {/* Column 1 (Left) */}
        <Animated.View
          style={[
            styles.column,
            { transform: [{ translateY: col1TranslateY }] },
          ]}
        >
          {/* Duplicate items for seamless continuous looping */}
          <View style={styles.pinCard}>
            <JasmineIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.jasmine}</Text>
          </View>

          <View style={styles.pinCard}>
            <KuthuvilakkuIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.kuthuvilakku}</Text>
          </View>

          <View style={styles.pinCard}>
            <KalasamIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.kalasam}</Text>
          </View>

          <View style={styles.pinCard}>
            <KolamIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.kolam}</Text>
          </View>

          {/* Repeated for loop height */}
          <View style={styles.pinCard}>
            <JasmineIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.jasmine}</Text>
          </View>

          <View style={styles.pinCard}>
            <KuthuvilakkuIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.kuthuvilakku}</Text>
          </View>

          <View style={styles.pinCard}>
            <KalasamIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.kalasam}</Text>
          </View>
        </Animated.View>

        {/* Column 2 (Right) */}
        <Animated.View
          style={[
            styles.column,
            { transform: [{ translateY: col2TranslateY }] },
          ]}
        >
          <View style={styles.pinCard}>
            <TempleArchIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.templeArch}</Text>
          </View>

          <View style={styles.pinCard}>
            <GarlandIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.garland}</Text>
          </View>

          <View style={styles.pinCard}>
            <BanglesIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.bangles}</Text>
          </View>

          <View style={styles.pinCard}>
            <KolamIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.kolam}</Text>
          </View>

          {/* Repeated for loop height */}
          <View style={styles.pinCard}>
            <TempleArchIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.templeArch}</Text>
          </View>

          <View style={styles.pinCard}>
            <GarlandIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.garland}</Text>
          </View>

          <View style={styles.pinCard}>
            <BanglesIllustration size={56} />
            <Text style={styles.pinCaption}>{captions.bangles}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Soft Cream Glow Over Center */}
      <View style={styles.glowOverlay} />
      <View style={styles.glowRadialCore} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EEE4DA', // Bright cream background
    overflow: 'hidden',
  },
  masonryWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
  },
  column: {
    width: '47%',
    flexDirection: 'column',
  },
  pinCard: {
    backgroundColor: '#FFFDF9', // Ivory
    borderColor: '#D8C4AC',     // Thin sand border
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pinCaption: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#4D0E13',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  // Soft cream glow over the center so card stays readable
  glowOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(238, 228, 218, 0.72)',
  },
  glowRadialCore: {
    position: 'absolute',
    top: '12%',
    left: '5%',
    right: '5%',
    bottom: '12%',
    backgroundColor: 'rgba(238, 228, 218, 0.88)',
    borderRadius: 40,
  },
});
