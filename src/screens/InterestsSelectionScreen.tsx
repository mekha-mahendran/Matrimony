import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';
import { LanguageToggle } from '../components/LanguageToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

interface InterestItem {
  id: string;
  labelEn: string;
  labelTa: string;
  icon: (color: string) => React.ReactNode;
}

const INTERESTS_DATA: InterestItem[] = [
  // Row 1
  {
    id: 'gaming',
    labelEn: 'Gaming',
    labelTa: 'விளையாட்டு',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </Svg>
    ),
  },
  {
    id: 'music',
    labelEn: 'Music',
    labelTa: 'இசை',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </Svg>
    ),
  },
  {
    id: 'book',
    labelEn: 'Book',
    labelTa: 'புத்தகம்',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </Svg>
    ),
  },

  // Row 2
  {
    id: 'language',
    labelEn: 'Language',
    labelTa: 'மொழி',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
      </Svg>
    ),
  },
  {
    id: 'photography',
    labelEn: 'Photography',
    labelTa: 'புகைப்படம்',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Circle cx="12" cy="12" r="3.2" />
        <Path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
      </Svg>
    ),
  },

  // Row 3
  {
    id: 'fashion',
    labelEn: 'Fashion',
    labelTa: 'ஆடை வடிவமைப்பு',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M21.99 8c0-.72-.37-1.35-.94-1.7L16 3.53V3c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v.53L2.95 6.3c-.57.35-.95.98-.95 1.7 0 .37.11.7.29.99L4 12v9c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-9l1.7-3.01c.18-.29.29-.62.29-.99zM12 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S10.5 6.83 10.5 6s.67-1.5 1.5-1.5z" />
      </Svg>
    ),
  },
  {
    id: 'nature',
    labelEn: 'Nature',
    labelTa: 'இயற்கை',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
      </Svg>
    ),
  },
  {
    id: 'gym',
    labelEn: 'GYM',
    labelTa: 'உடற்பயிற்சி',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M12 5c-1.1 0-2 .9-2 2v1h4V7c0-1.1-.9-2-2-2zm6 5.5v7c0 1.93-1.57 3.5-3.5 3.5h-5C7.57 21 6 19.43 6 17.5v-7C4.9 10.5 4 11.4 4 12.5v3c0 1.1.9 2 2 2V8c0-1.66 1.34-3 3-3V4c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1c1.66 0 3 1.34 3 3v9.5c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2z" />
      </Svg>
    ),
  },

  // Row 4
  {
    id: 'animal',
    labelEn: 'Animal',
    labelTa: 'விலங்குகள்',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Circle cx="4.5" cy="9.5" r="2.5" />
        <Circle cx="9" cy="5.5" r="2.5" />
        <Circle cx="15" cy="5.5" r="2.5" />
        <Circle cx="19.5" cy="9.5" r="2.5" />
        <Path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-.95-1.74-1.2-1.64-.6-3.6.02-4.48 1.45-.61.99-1.24 1.86-1.98 2.66-1.08 1.17-1.7 2.45-1.54 3.75.24 1.94 1.96 3.39 3.92 3.39 1.5 0 2.87-.84 3.57-2.12.35.65 1.03 1.12 1.81 1.12 1.48 0 2.68-1.2 2.68-2.68 0-.48-.13-.93-.36-1.32.22-.38.4-.76.6-1.13z" />
      </Svg>
    ),
  },
  {
    id: 'arts',
    labelEn: 'Arts',
    labelTa: 'கலை',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.59 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-4.5 9c-.83 0-1.5-.67-1.5-1.5S6.67 9 7.5 9s1.5.67 1.5 1.5S8.33 12 7.5 12zm3-4c-.83 0-1.5-.67-1.5-1.5S9.67 5 10.5 5s1.5.67 1.5 1.5S11.33 8 10.5 8zm3 0c-.83 0-1.5-.67-1.5-1.5S12.67 5 13.5 5s1.5.67 1.5 1.5S14.33 8 13.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S15.67 9 16.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </Svg>
    ),
  },
  {
    id: 'football',
    labelEn: 'Football',
    labelTa: 'கால்பந்து',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Circle cx="12" cy="12" r="9" strokeWidth="2" stroke={c} fill="none" />
        <Path d="M12 7l3 2.5v3L12 15l-3-2.5v-3z" />
        <Path d="M12 7V3M15 9.5l3.5-1M15 12.5l3.5 1M12 15v4M9 12.5L5.5 13.5M9 9.5L5.5 8.5" stroke={c} strokeWidth="1.6" />
      </Svg>
    ),
  },

  // Row 5
  {
    id: 'finance',
    labelEn: 'Finance',
    labelTa: 'நிதி',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </Svg>
    ),
  },
  {
    id: 'technology',
    labelEn: 'Technology',
    labelTa: 'தொழில்நுட்பம்',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
      </Svg>
    ),
  },

  // Row 6
  {
    id: 'business',
    labelEn: 'Business',
    labelTa: 'வணிகம்',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
      </Svg>
    ),
  },
  {
    id: 'travel',
    labelEn: 'Travel',
    labelTa: 'பயணம்',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </Svg>
    ),
  },
  {
    id: 'cars',
    labelEn: 'Cars',
    labelTa: 'வாகனங்கள்',
    icon: (c: string) => (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={c}>
        <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z" />
        <Circle cx="7.5" cy="14.5" r="1.5" />
        <Circle cx="16.5" cy="14.5" r="1.5" />
      </Svg>
    ),
  },
];

interface InterestsSelectionScreenProps {
  language?: Language;
  onToggleLanguage?: () => void;
  initialInterests?: string[];
  onNext: (selected: string[]) => void;
  onBackPress: () => void;
}

export const InterestsSelectionScreen: React.FC<InterestsSelectionScreenProps> = ({
  language = 'en',
  onToggleLanguage,
  initialInterests = ['gaming', 'photography', 'arts', 'football', 'business'],
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // State initialized with the 5 pre-selected items matching user screenshot
  const [selectedIds, setSelectedIds] = useState<string[]>(initialInterests);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const toggleInterest = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 5) {
        Alert.alert(
          isTa ? 'அதிகபட்ச வரம்பு' : 'Maximum Limit',
          isTa
            ? 'அதிகபட்சம் 5 ஆர்வங்களை மட்டுமே தேர்வு செய்ய முடியும்.'
            : 'You can select up to 5 interests only.'
        );
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Bar with Back Button & Progress (3/4) */}
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

        {/* Center Progress Bar: Capsule with 3/4 (75%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator & Language Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.stepIndicator}>3/4</Text>
          {onToggleLanguage ? (
            <LanguageToggle language={language} onToggle={onToggleLanguage} size="small" />
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header Title & Subtitle */}
        <View style={styles.headerArea}>
          <Text style={styles.title}>
            {isTa ? '5 ஆர்வங்களைத் தேர்ந்தெடுக்கவும்' : 'Select up to 5 interests'}
          </Text>
          <Text style={styles.subtitle}>
            {isTa
              ? 'உங்கள் ஆர்வங்களைத் தேர்ந்தெடுத்து சிறந்த இணைப்புகளைக் கண்டறியுங்கள்'
              : 'Discover Meaningful Connections by Selecting\nYour Interests'}
          </Text>
        </View>

        {/* Staggered Interest Pills Container */}
        <View style={styles.pillsContainer}>
          {INTERESTS_DATA.map(item => {
            const isSelected = selectedIds.includes(item.id);
            const iconColor = isSelected ? '#FFFFFF' : '#374151';

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.pill,
                  isSelected ? styles.pillSelected : styles.pillUnselected,
                ]}
                onPress={() => toggleInterest(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.pillIconWrap}>{item.icon(iconColor)}</View>
                <Text
                  style={[
                    styles.pillText,
                    isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                  ]}
                >
                  {isTa ? item.labelTa : item.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Sticky Next Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 24) },
        ]}
      >
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => onNext(selectedIds)}
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
    width: '75%', // 3/4 = 75%
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 36,
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
    paddingHorizontal: 16,
  },

  /* Interest Pills Container */
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  pillSelected: {
    backgroundColor: BRAND_PURPLE,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  pillUnselected: {
    backgroundColor: '#F4F6F9',
  },
  pillIconWrap: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  pillTextUnselected: {
    color: '#374151',
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

