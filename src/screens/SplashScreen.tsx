import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GarlandLogo } from '../components/GarlandLogo';
import { KolamPattern } from '../components/KolamBackground';
import { Colors, Typography } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KolamPattern color={Colors.sand} opacity={0.35} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <GarlandLogo size="large" showSubtitle={true} lightMode={false} />
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerTamil}>தமிழ் பாரம்பரிய திருமண பந்தம்</Text>
        <Text style={styles.footerEnglish}>
          Connecting Tamil Hearts Worldwide
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerTamil: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    letterSpacing: 0.8,
  },
  footerEnglish: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
