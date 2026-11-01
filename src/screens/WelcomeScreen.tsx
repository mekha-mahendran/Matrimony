import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Language } from '../localization';
import { ProfileCreatedFor } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Vibrant royal purple matching the splash screen & design system
const BRAND_PURPLE = '#6D53F5';
const BRAND_PURPLE_DARK = '#533CE0';
const SOFT_PEACH = '#FCD8D4';
const CANARY_YELLOW = '#FFE853';

/**
 * Custom Heart-Shaped Switch Language Toggle
 * Directly inspired by reference design with sliding circular knob across heart lobes.
 */
interface HeartLanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

const HeartLanguageToggle: React.FC<HeartLanguageToggleProps> = ({
  language,
  onToggle,
}) => {
  const isTa = language === 'ta';
  const animValue = useRef(new Animated.Value(isTa ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isTa ? 1 : 0,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isTa]);

  // Horizontal travel distance across the two heart lobes
  const thumbTranslateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 21],
  });

  return (
    <TouchableOpacity
      style={styles.heartToggleContainer}
      onPress={onToggle}
      activeOpacity={0.82}
      accessibilityRole="switch"
      accessibilityState={{ checked: isTa }}
      accessibilityLabel="Toggle English or Tamil language"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={[styles.langLabel, !isTa && styles.langLabelActive]}>
        EN
      </Text>

      <View style={styles.heartSwitchFrame}>
        {/* Heart shaped track directly matching reference toggle button */}
        <Svg width={52} height={34} viewBox="0 0 54 36" fill="none">
          <Path
            d="M 27 6.5 C 30.5 1.5, 36.5 0.5, 41.5 0.8 C 47.5 1, 53 5.5, 53 12.5 C 53 20.5, 43 28.5, 27 35.5 C 11 28.5, 1 20.5, 1 12.5 C 1 5.5, 6.5 1, 12.5 0.8 C 17.5 0.5, 23.5 1.5, 27 6.5 Z"
            fill={isTa ? '#6D53F5' : '#FFFFFF'}
            stroke={isTa ? '#6D53F5' : '#C8C4D6'}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </Svg>

        {/* Sliding circular white thumb with drop shadow */}
        <Animated.View
          style={[
            styles.heartThumb,
            {
              transform: [{ translateX: thumbTranslateX }],
            },
          ]}
        />
      </View>

      <Text style={[styles.langLabel, isTa && styles.langLabelActive]}>
        தமிழ்
      </Text>
    </TouchableOpacity>
  );
};

interface WelcomeScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onRegisterPress: (createdFor?: ProfileCreatedFor) => void;
  onLoginPress: () => void;
  onGuestBrowse?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onToggleLanguage,
  onRegisterPress,
  onLoginPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ── 1. Top Header: Logo + App Name (No 'Dating' word) + Language Switcher ── */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        {/* Brand identity: Ribbon loop logo + Manamaalai */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandTitleWrap}>
            <Text style={styles.brandTitleText}>
              {isTa ? 'மணமாலை' : 'Manamaalai'}
            </Text>
            <Text style={styles.brandSubtitleText}>
              {isTa ? 'மேட்ரிமோனி' : 'Matrimony'}
            </Text>
          </View>
        </View>

        {/* Heart-Shaped Switch Language Toggle (Matches User Reference Image) */}
        <HeartLanguageToggle language={language} onToggle={onToggleLanguage} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── 2. Center Visual Graphic (Traditional Wedding Instruments, Groom/Bride, Tags, Doodles) ── */}
        <View style={styles.heroGraphicWrapper}>
          {/* Top-left Spark Doodle */}
          <View style={styles.sparkDoodle}>
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2V6M5 7L8 9M2 14H6M19 7L16 9M22 14H18"
                stroke={BRAND_PURPLE}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Right Outlined Heart Doodle */}
          <View style={styles.heartDoodle}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="#18181B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Bottom-right Squiggle Doodle */}
          <View style={styles.squiggleDoodle}>
            <Svg width={54} height={30} viewBox="0 0 54 30" fill="none">
              <Path
                d="M3 15C9 3, 17 27, 25 15C33 3, 41 27, 51 15"
                stroke={BRAND_PURPLE}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Central Auspicious Wedding Instruments (Thavil & Mridangam) Pod */}
          <View style={styles.instrumentsPod}>
            <View style={styles.instrumentsAura} />
            <Image
              source={require('../assets/images/wedding_instruments.png')}
              style={styles.instrumentsImage}
              resizeMode="contain"
            />
          </View>

          {/* Groom Card (Top-Left) */}
          <View style={styles.groomCard}>
            <Image
              source={require('../assets/images/groom_avatar.jpg')}
              style={styles.personPhoto}
              resizeMode="cover"
            />
            {/* Groom Yellow Badge: #Music / #இசை */}
            <View style={styles.groomTagBadge}>
              <Text style={styles.tagBadgeText}>
                {isTa ? '#இசை' : '#Music'}
              </Text>
            </View>
          </View>

          {/* Bride Card (Bottom-Right) */}
          <View style={styles.brideCard}>
            <Image
              source={require('../assets/images/bride_avatar.jpg')}
              style={styles.personPhoto}
              resizeMode="cover"
            />
            {/* Bride Yellow Badge: #Dance / #நடனம் */}
            <View style={styles.brideTagBadge}>
              <Text style={styles.tagBadgeText}>
                {isTa ? '#நடனம்' : '#Dance'}
              </Text>
            </View>
          </View>

          {/* Center Floating Pill: "Find Love with Words 💕" */}
          <View style={styles.floatingCenterPill}>
            <Text style={styles.floatingPillText}>
              {isTa ? 'அன்பை கண்டறியுங்கள்' : 'Find Love with Words'}
            </Text>
            <Text style={styles.floatingHeartEmoji}> 💕</Text>
          </View>
        </View>

        {/* ── 3. Headline & Description ── */}
        <View style={styles.copySection}>
          <Text style={styles.headline}>
            <Text style={styles.headlinePurple}>
              {isTa ? 'அன்பை கண்டறியுங்கள்: ' : 'Discover Love: '}
            </Text>
            <Text style={styles.headlineDark}>
              {isTa ? 'உங்கள் புது வாழ்க்கை இங்கே தொடங்குகிறது.' : 'Where Your Story Begins.'}
            </Text>
          </Text>

          <Text style={styles.subDescription}>
            {isTa
              ? 'நம்பகமான சரிபார்க்கப்பட்ட வரன்களோடு உங்கள் திருமண வாழ்விற்கான இனிய தொடக்கத்தை இன்றே அமைத்துக் கொள்ளுங்கள்.'
              : 'Connect with authentic Tamil families and verified brides & grooms. Your sacred journey toward a lifetime of companionship starts here.'}
          </Text>
        </View>

        {/* ── 4. Primary CTA & Sign In Footer ── */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryCtaBtn}
            onPress={() => onRegisterPress('self')}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryCtaText}>
              {isTa ? 'தொடங்குவோம்' : "Let's Get Started"}
            </Text>
          </TouchableOpacity>

          <View style={styles.signInRow}>
            <Text style={styles.alreadyText}>
              {isTa ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already have an account? '}
            </Text>
            <TouchableOpacity
              onPress={onLoginPress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.signInLink}>
                {isTa ? 'உள்நுழையவும்' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header Bar ──
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F7F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EDE8FF',
  },
  logoImage: {
    width: 26,
    height: 26,
  },
  brandTitleWrap: {
    justifyContent: 'center',
  },
  brandTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_PURPLE,
    letterSpacing: -0.2,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  },
  brandSubtitleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 1.2,
    marginTop: -2,
    textTransform: 'uppercase',
  },

  // ── Heart-Shaped Switch Language Toggle (Matches User Reference Image) ──
  heartToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F6FC',
    borderRadius: 24,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E8E5F4',
  },
  langLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8B9E',
    paddingHorizontal: 5,
  },
  langLabelActive: {
    color: BRAND_PURPLE,
    fontWeight: '800',
  },
  heartSwitchFrame: {
    width: 52,
    height: 34,
    position: 'relative',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  heartThumb: {
    position: 'absolute',
    top: 5,
    left: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4.5,
    elevation: 5,
  },

  // ── Scroll Content ──
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
  },

  // ── Center Visual Graphic ──
  heroGraphicWrapper: {
    width: 320,
    height: 320,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },

  // Central Wedding Instruments Pod
  instrumentsPod: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  instrumentsAura: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#FFF9F0',
    borderWidth: 1.5,
    borderColor: '#FCEFD8',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4,
  },
  instrumentsImage: {
    width: 220,
    height: 128,
    zIndex: 2,
  },

  // Person Avatar Cards
  groomCard: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: SOFT_PEACH,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 4,
  },
  brideCard: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: SOFT_PEACH,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 4,
  },
  personPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
  },

  // Yellow Tag Badges (#Music, #Dance)
  groomTagBadge: {
    position: 'absolute',
    bottom: -4,
    right: -14,
    backgroundColor: CANARY_YELLOW,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  brideTagBadge: {
    position: 'absolute',
    bottom: -4,
    left: -14,
    backgroundColor: CANARY_YELLOW,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F1A00',
  },

  // Floating Pill ("Find Love with Words 💕")
  // Lifted a little bit up to bottom: 36, left: 14 for optimal vertical and horizontal spacing
  floatingCenterPill: {
    position: 'absolute',
    bottom: 36,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3EFEA',
    zIndex: 5,
  },
  floatingPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  floatingHeartEmoji: {
    fontSize: 13,
  },

  // Whimsical SVG Doodles
  sparkDoodle: {
    position: 'absolute',
    top: 4,
    left: -2,
    zIndex: 1,
  },
  heartDoodle: {
    position: 'absolute',
    top: 75,
    right: -4,
    zIndex: 1,
  },
  squiggleDoodle: {
    position: 'absolute',
    bottom: -6,
    right: -10,
    zIndex: 1,
  },

  // ── Headline & Description ──
  copySection: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 6,
    marginBottom: 14,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.3,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  },
  headlinePurple: {
    color: BRAND_PURPLE,
  },
  headlineDark: {
    color: '#18181B',
  },
  subDescription: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    paddingHorizontal: 12,
  },

  // ── Bottom Section ──
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 6,
  },
  primaryCtaBtn: {
    width: '100%',
    height: 54,
    backgroundColor: BRAND_PURPLE,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  alreadyText: {
    fontSize: 14,
    color: '#71717A',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_PURPLE,
    textDecorationLine: 'underline',
  },
});
