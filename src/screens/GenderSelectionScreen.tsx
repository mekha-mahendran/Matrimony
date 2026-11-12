import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { Language } from '../localization';
import { LanguageToggle } from '../components/LanguageToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

interface GenderSelectionScreenProps {
  language?: Language;
  onToggleLanguage?: () => void;
  initialGender?: 'male' | 'female';
  onNext: (gender: 'male' | 'female') => void;
  onBackPress: () => void;
}

export const GenderSelectionScreen: React.FC<GenderSelectionScreenProps> = ({
  language = 'en',
  onToggleLanguage,
  initialGender = 'male',
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>(initialGender);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Bar with Back Button & Progress (1/5) */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 10, 20) }]}>
        {/* Circular Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth={2}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        {/* Center Progress Bar: Capsule with 1/5th filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator & Language Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.stepIndicator}>1/5</Text>
          {onToggleLanguage ? (
            <LanguageToggle language={language} onToggle={onToggleLanguage} size="small" />
          ) : null}
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Title & Subtitle */}
        <View style={styles.headerArea}>
          <Text style={styles.title}>
            {isTa ? 'உங்களைப் பற்றி கூறுங்கள்!' : 'Tell us about yourself!'}
          </Text>
          <Text style={styles.subtitle}>
            {isTa
              ? 'உங்களுக்கு சிறந்த அனுபவத்தை வழங்க உங்கள் பாலினத்தை நாங்கள் அறிய வேண்டும்'
              : 'To give you a better experience we need\nto know your gender'}
          </Text>
        </View>

        {/* Gender Selection Circles */}
        <View style={styles.genderOptionsContainer}>
          {/* 1. Male Option */}
          <TouchableOpacity
            style={[
              styles.genderCircle,
              selectedGender === 'male' ? styles.circleActive : styles.circleInactive,
            ]}
            onPress={() => setSelectedGender('male')}
            activeOpacity={0.85}
          >
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="9.5"
                cy="14.5"
                r="5.5"
                stroke={selectedGender === 'male' ? '#FFFFFF' : '#111827'}
                strokeWidth="2.4"
              />
              <Path
                d="M19 5L13.5 10.5M19 5H14.5M19 5V9.5"
                stroke={selectedGender === 'male' ? '#FFFFFF' : '#111827'}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={[
                styles.genderLabel,
                selectedGender === 'male' ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {isTa ? 'ஆண்' : 'Male'}
            </Text>
          </TouchableOpacity>

          {/* 2. Female Option */}
          <TouchableOpacity
            style={[
              styles.genderCircle,
              selectedGender === 'female' ? styles.circleActive : styles.circleInactive,
            ]}
            onPress={() => setSelectedGender('female')}
            activeOpacity={0.85}
          >
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="9.5"
                r="5.5"
                stroke={selectedGender === 'female' ? '#FFFFFF' : '#111827'}
                strokeWidth="2.4"
              />
              <Path
                d="M12 15v6M9 18h6"
                stroke={selectedGender === 'female' ? '#FFFFFF' : '#111827'}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={[
                styles.genderLabel,
                selectedGender === 'female' ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {isTa ? 'பெண்' : 'Female'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sticky Next Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 24) },
        ]}
      >
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => onNext(selectedGender)}
          activeOpacity={0.88}
        >
          <Text style={styles.nextButtonText}>
            {isTa ? 'அடுத்து' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Top Navigation & Progress */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressFill: {
    width: '20%', // 1/5
    height: '100%',
    borderRadius: 3,
    backgroundColor: BRAND_PURPLE,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },

  /* Content */
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  /* Gender Circles */
  genderOptionsContainer: {
    alignItems: 'center',
    gap: 32,
  },
  genderCircle: {
    width: 146,
    height: 146,
    borderRadius: 73,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
  },
  circleActive: {
    backgroundColor: BRAND_PURPLE,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  circleInactive: {
    backgroundColor: '#F4F6F9',
    shadowOpacity: 0,
    elevation: 0,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelInactive: {
    color: '#111827',
  },

  /* Bottom Bar & Next Button */
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  nextButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: BRAND_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

