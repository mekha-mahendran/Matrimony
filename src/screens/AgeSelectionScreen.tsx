import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import { LanguageToggle } from '../components/LanguageToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

const ITEM_HEIGHT = 60;
const VISIBLE_COUNT = 7;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT; // 420px

// Ages from 18 to 72
const MIN_AGE = 18;
const MAX_AGE = 72;
const AGES = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

interface AgeSelectionScreenProps {
  language?: Language;
  onToggleLanguage?: () => void;
  initialAge?: number;
  onNext: (age: number) => void;
  onBackPress: () => void;
}

export const AgeSelectionScreen: React.FC<AgeSelectionScreenProps> = ({
  language = 'en',
  onToggleLanguage,
  initialAge = 36,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [selectedAge, setSelectedAge] = useState<number>(initialAge);
  const scrollViewRef = useRef<any>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  // Pre-scroll to initial age on mount with redundancy for Android layout pass
  useEffect(() => {
    const targetY = (initialAge - MIN_AGE) * ITEM_HEIGHT;
    const timer1 = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: targetY, animated: false });
    }, 60);

    const timer2 = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: targetY, animated: false });
    }, 250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [initialAge]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    isScrolling.current = false;
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, AGES.length - 1));
    const newAge = AGES[clampedIndex];
    if (newAge && newAge !== selectedAge) {
      setSelectedAge(newAge);
    }
  };

  const selectAge = (age: number) => {
    setSelectedAge(age);
    const targetY = (age - MIN_AGE) * ITEM_HEIGHT;
    scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Bar with Back Button & Progress (2/4) */}
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

        {/* Center Progress Bar: Capsule with 2/4 (50%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator & Language Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.stepIndicator}>2/4</Text>
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
            {isTa ? 'உங்கள் வயது என்ன?' : 'How Old Are You?'}
          </Text>
          <Text style={styles.subtitle}>
            {isTa
              ? 'பொருத்தமான வரனை கண்டறிய இது உதவுகிறது'
              : 'This helps us to find your match'}
          </Text>
        </View>

        {/* Vertical Age Wheel Picker */}
        <View style={styles.wheelWrapper}>
          {/* Top selection line (Purple horizontal bar) */}
          <View style={styles.selectionLineTop} pointerEvents="none" />

          {/* Bottom selection line (Purple horizontal bar) */}
          <View style={styles.selectionLineBottom} pointerEvents="none" />

          {/* Smooth Native ScrollView with all numbers fully rendered and visible */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="start"
            decelerationRate="fast"
            bounces={false}
            onScrollBeginDrag={() => {
              isScrolling.current = true;
            }}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={16}
          >
            {/* Top spacer (3 blank slots so age 18 can be centered) */}
            <View style={styles.spacer} />

            {/* List of ages 18..72 */}
            {AGES.map(age => {
              const diff = Math.abs(age - selectedAge);
              const isSelected = diff === 0;

              let textStyle: any = styles.numberFar;
              if (isSelected) {
                textStyle = styles.numberSelected;
              } else if (diff === 1) {
                textStyle = styles.numberNear1;
              } else if (diff === 2) {
                textStyle = styles.numberNear2;
              }

              return (
                <TouchableOpacity
                  key={`age-${age}`}
                  style={styles.itemRow}
                  onPress={() => selectAge(age)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.numberBase, textStyle]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Bottom spacer (3 blank slots so age 72 can be centered) */}
            <View style={styles.spacer} />
          </ScrollView>
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
          onPress={() => onNext(selectedAge)}
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
    width: '50%', // 2/4 = 50%
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  /* Wheel Container */
  wheelWrapper: {
    height: WHEEL_HEIGHT,
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  scrollView: {
    width: '100%',
    height: WHEEL_HEIGHT,
  },
  scrollContent: {
    alignItems: 'center',
  },
  spacer: {
    height: ITEM_HEIGHT * 3, // 180px
    width: '100%',
  },
  itemRow: {
    height: ITEM_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Number Typography */
  numberBase: {
    fontSize: 26,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  numberSelected: {
    fontSize: 48,
    fontWeight: '800',
    color: BRAND_PURPLE,
    lineHeight: 54,
  },
  numberNear1: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1F2937', // 35, 37
    lineHeight: 40,
  },
  numberNear2: {
    fontSize: 30,
    fontWeight: '600',
    color: '#6B7280', // 34, 38
    lineHeight: 36,
  },
  numberFar: {
    fontSize: 26,
    fontWeight: '500',
    color: '#D1D5DB', // 33, 39
    lineHeight: 32,
  },

  /* Selection Lines */
  selectionLineTop: {
    position: 'absolute',
    top: ITEM_HEIGHT * 3, // Exactly top of center slot
    width: 140,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: BRAND_PURPLE,
    zIndex: 10,
  },
  selectionLineBottom: {
    position: 'absolute',
    top: ITEM_HEIGHT * 4, // Exactly bottom of center slot
    width: 140,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: BRAND_PURPLE,
    zIndex: 10,
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
