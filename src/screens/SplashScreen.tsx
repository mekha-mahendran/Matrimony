/**
 * Manamaalai Matrimony — Luxury Splash Screen
 *
 * Design Architecture:
 * 1. Royal Purple (#6D53F5) luxury background with ambient glowing orbs
 * 2. Center Stage: Centered brand logo with dual pulsating glowing aura rings
 * 3. Typography Down:
 *    - "Manamaalai" in majestic calligraphic script
 *    - "MATRIMONY" with wide luxury letter-spacing
 *    - Cultural tagline: "திருமண பந்தங்களின் புனித சங்கமம் • Sacred Tamil Matrimony"
 * 4. Staggered Cinematic Transitions (Logo spring -> Typography slide-up -> Badge fade-in)
 * 5. Edition & Terms Footer ("Editing Terms"):
 *    - "Tamil Nadu Official Edition • 2026"
 *    - Trust Badge: 100% Aadhaar Verified • 256-Bit SSL Encrypted
 *    - Interactive Terms of Service & Privacy Policy modal with customizable terms editor
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPLASH_BG = '#6D53F5';
const BRAND_PURPLE_DARK = '#5438E0';
const ACCENT_GOLD = '#FEEBC8';

interface SplashScreenProps {
  onFinish: () => void;
  editionTitle?: string;
  termsText?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  editionTitle = 'Tamil Nadu Official Edition • 2026',
  termsText,
}) => {
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.6)).current;
  const logoAuraPulse = useRef(new Animated.Value(1)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const footerFadeAnim = useRef(new Animated.Value(0)).current;

  // Terms Modal state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    // 1. Entrance choreography: Screen Fade + Logo Pop
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Staggered typography entrance (slides up and fades in)
    Animated.parallel([
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 700,
        delay: 350,
        useNativeDriver: true,
      }),
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 750,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Continuous gentle aura breathing pulse for the center logo
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoAuraPulse, {
          toValue: 1.14,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoAuraPulse, {
          toValue: 1.0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 4. Auto transition to next screen after 3.2s (if terms modal is not open)
    const transitionTimer = setTimeout(() => {
      if (!showTermsModal) {
        triggerExitTransition();
      }
    }, 3200);

    return () => {
      pulseLoop.stop();
      clearTimeout(transitionTimer);
    };
  }, [showTermsModal]);

  const triggerExitTransition = () => {
    if (isFinishing) return;
    setIsFinishing(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1.08,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tap anywhere to proceed immediately */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => {
          if (!showTermsModal) {
            triggerExitTransition();
          }
        }}
      >
        <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim }]}>
          {/* Ambient Background Glow Circles */}
          <View style={styles.ambientTopCircle} pointerEvents="none" />
          <View style={styles.ambientBottomCircle} pointerEvents="none" />
          <View style={styles.ambientCenterAura} pointerEvents="none" />

          {/* Top subtle edition header */}
          <Animated.View
            style={[
              styles.topBadgeRow,
              { paddingTop: insets.top + 16, opacity: footerFadeAnim },
            ]}
          >
            <View style={styles.topBadgePill}>
              <Text style={styles.topBadgeText}>✦ {editionTitle} ✦</Text>
            </View>
          </Animated.View>

          {/* CENTER STAGE: Logo Prominently Centered */}
          <View style={styles.centerStage}>
            {/* Pulsating Glowing Aura Ring */}
            <Animated.View
              style={[
                styles.logoAuraOuter,
                {
                  transform: [{ scale: logoAuraPulse }],
                },
              ]}
            />
            <View style={styles.logoAuraInner} />

            {/* Centered Logo Container */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: logoScaleAnim }],
                },
              ]}
            >
              <Image
                source={require('../assets/images/logo_white.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>

            {/* TYPOGRAPHY DOWN (Positioned directly below the center logo) */}
            <Animated.View
              style={[
                styles.typographyWrapper,
                {
                  opacity: textFadeAnim,
                  transform: [{ translateY: textSlideAnim }],
                },
              ]}
            >
              {/* Primary Calligraphic Title */}
              <Text
                style={styles.titleCalligraphy}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                Manamaalai
              </Text>

              {/* Sub-Brand Spaced Luxury Title */}
              <View style={styles.matrimonyRow}>
                <View style={styles.matrimonyLine} />
                <Text style={styles.titleMatrimony}>MATRIMONY</Text>
                <View style={styles.matrimonyLine} />
              </View>

              {/* Cultural Tamil Subtitle */}
              <Text style={styles.tamilSubtitle}>
                திருமண பந்தங்களின் புனித சங்கமம்
              </Text>
              <Text style={styles.englishTagline}>
                Where Sacred Tamil Traditions Unite
              </Text>
            </Animated.View>
          </View>

          {/* BOTTOM SECTION: Trust Badges & Editing Terms */}
          <Animated.View
            style={[
              styles.bottomSection,
              { paddingBottom: Math.max(insets.bottom, 20), opacity: footerFadeAnim },
            ]}
          >
            {/* Trust Pill */}
            <View style={styles.trustBadge}>
              <Text style={styles.trustIcon}>🔒</Text>
              <Text style={styles.trustText}>
                100% Aadhaar Verified Profiles • 256-Bit SSL Encrypted
              </Text>
            </View>

            {/* Legal Terms of Service & Privacy Policy Trigger */}
            <View style={styles.termsRow}>
              <Text style={styles.termsBaseText}>By continuing, you agree to our </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowTermsModal(true)}
                style={styles.termsBtn}
              >
                <Text style={styles.termsHighlight}>Terms & Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            {/* Tap to skip hint */}
            <Text style={styles.tapHint}>Tap anywhere to continue</Text>
          </Animated.View>
        </Animated.View>
      </Pressable>

      {/* TERMS & PRIVACY POLICY MODAL ("Editing Terms") */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Terms & Conditions</Text>
                <Text style={styles.modalSubtitle}>Manamaalai Matrimony Community Guidelines</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowTermsModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable Terms Content */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <View style={styles.termBlock}>
                <Text style={styles.termHeading}>1. Authentic & Verified Profiles</Text>
                <Text style={styles.termPara}>
                  All registered brides and grooms must provide genuine personal, familial, and educational information. Profiles undergo Aadhaar e-KYC validation to maintain community safety and integrity.
                </Text>
              </View>

              <View style={styles.termBlock}>
                <Text style={styles.termHeading}>2. Respect & Cultural Decorum</Text>
                <Text style={styles.termPara}>
                  Manamaalai Matrimony is dedicated to solemnizing authentic marital unions across Tamil Nadu and the global Tamil diaspora. Inappropriate messaging, solicitation, or fraudulent representations will result in permanent account termination.
                </Text>
              </View>

              <View style={styles.termBlock}>
                <Text style={styles.termHeading}>3. Privacy & Contact Protection</Text>
                <Text style={styles.termPara}>
                  Your contact telephone numbers, horoscope details, and photo albums are protected by granular privacy controls. Only mutual reciprocal matches or approved VIP members can view direct contact information.
                </Text>
              </View>

              <View style={styles.termBlock}>
                <Text style={styles.termHeading}>4. Subscription & E-Receipts</Text>
                <Text style={styles.termPara}>
                  Plan upgrades (Monthly Pro and Yearly VIP) grant unlimited daily recommendations and dedicated Relationship Manager assistance. Official barcode E-Receipts are generated immediately following successful payment.
                </Text>
              </View>
            </ScrollView>

            {/* Accept & Dismiss Button */}
            <TouchableOpacity
              onPress={() => {
                setShowTermsModal(false);
                triggerExitTransition();
              }}
              style={styles.modalActionBtn}
            >
              <Text style={styles.modalActionBtnText}>I Agree & Enter App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
  },
  mainWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  /* Ambient Glowing Spheres */
  ambientTopCircle: {
    position: 'absolute',
    top: -SCREEN_WIDTH * 0.35,
    right: -SCREEN_WIDTH * 0.25,
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_WIDTH * 0.95,
    borderRadius: (SCREEN_WIDTH * 0.95) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  ambientBottomCircle: {
    position: 'absolute',
    bottom: -SCREEN_WIDTH * 0.35,
    left: -SCREEN_WIDTH * 0.25,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: (SCREEN_WIDTH * 0.9) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  ambientCenterAura: {
    position: 'absolute',
    top: '38%',
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: (SCREEN_WIDTH * 0.75) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },

  /* Top Edition Badge */
  topBadgeRow: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  topBadgePill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ACCENT_GOLD,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  /* Center Stage */
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
  },

  /* Glowing Aura Rings around Center Logo */
  logoAuraOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    top: -14,
  },
  logoAuraInner: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    top: -4,
  },

  /* Centered Logo Container */
  logoContainer: {
    width: 112,
    height: 112,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  logoImage: {
    width: 68,
    height: 68,
  },

  /* Typography Down */
  typographyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  titleCalligraphy: {
    fontSize: 44,
    color: '#FFFFFF',
    fontFamily: Typography.fontCalligraphy,
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
      ios: {
        fontFamily: 'GreatVibes-Regular',
      },
    }),
  },
  matrimonyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    gap: 10,
    width: '85%',
  },
  matrimonyLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  titleMatrimony: {
    fontSize: 13,
    fontWeight: '800',
    color: ACCENT_GOLD,
    letterSpacing: 6,
    textAlign: 'center',
  },
  tamilSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 14,
    textAlign: 'center',
    opacity: 0.95,
    letterSpacing: 0.4,
  },
  englishTagline: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.78)',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  /* Bottom Section */
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  trustIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  trustText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  termsBaseText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  termsBtn: {
    paddingVertical: 2,
  },
  termsHighlight: {
    fontSize: 11,
    fontWeight: '700',
    color: ACCENT_GOLD,
    textDecorationLine: 'underline',
  },
  tapHint: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  /* Terms Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 12, 35, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: SCREEN_HEIGHT * 0.78,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181D',
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  modalBody: {
    paddingRight: 4,
  },
  termBlock: {
    marginBottom: 16,
  },
  termHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181D',
    marginBottom: 4,
  },
  termPara: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#4B5563',
  },
  modalActionBtn: {
    backgroundColor: SPLASH_BG,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: SPLASH_BG,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  modalActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
