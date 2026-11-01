import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Exact vibrant purple matching reference splash screen
const SPLASH_BG = '#6D53F5';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // 1. Entrance animation (fade-in, subtle scale and slide up)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Display duration (2.2s), then smooth exit fade and transition to next screen
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[
          styles.contentCenter,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.brandRow}>
          <Image
            source={require('../assets/images/logo_white.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text
            style={styles.brandTitleCalligraphy}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.72}
          >
            Manamaalai Matrimony
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    maxWidth: SCREEN_WIDTH - 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  brandTitleCalligraphy: {
    fontSize: 34,
    color: '#FFFFFF',
    fontFamily: Typography.fontCalligraphy,
    letterSpacing: 0.3,
    paddingVertical: 6,
    paddingHorizontal: 4,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
      ios: {
        fontFamily: 'GreatVibes-Regular',
      },
    }),
  },
});
