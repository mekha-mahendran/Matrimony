import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Language } from '../localization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

export interface FamilyDetailsData {
  fatherOccupation: string;
  motherOccupation: string;
  brothers: string;
  sisters: string;
  familyType: string;
  familyValues: string;
  familyStatus: string;
}

interface FamilyDetailsScreenProps {
  language?: Language;
  initialData?: Partial<FamilyDetailsData>;
  onNext: (data: FamilyDetailsData) => void;
  onBackPress: () => void;
}

const COUNT_OPTIONS = ['0', '1', '2', '3+'];

const FAMILY_TYPE_OPTIONS = [
  { id: 'Joint', labelEn: 'Joint', labelTa: 'கூட்டு குடும்பம்' },
  { id: 'Nuclear', labelEn: 'Nuclear', labelTa: 'தனி குடும்பம்' },
];

const FAMILY_VALUES_OPTIONS = [
  { id: 'Traditional', labelEn: 'Traditional', labelTa: 'பாரம்பரியம்' },
  { id: 'Moderate', labelEn: 'Moderate', labelTa: 'நடுத்தரம்' },
  { id: 'Liberal', labelEn: 'Liberal', labelTa: 'முற்போக்கு' },
];

const FAMILY_STATUS_OPTIONS = [
  { id: 'Middle class', labelEn: 'Middle class', labelTa: 'நடுத்தர வர்க்கம்' },
  { id: 'Upper middle class', labelEn: 'Upper middle class', labelTa: 'உயர் நடுத்தர வர்க்கம்' },
  { id: 'Affluent', labelEn: 'Affluent', labelTa: 'செல்வந்தர்' },
];

export const FamilyDetailsScreen: React.FC<FamilyDetailsScreenProps> = ({
  language = 'en',
  initialData,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states matching screenshot defaults
  const [fatherOccupation, setFatherOccupation] = useState(initialData?.fatherOccupation || '');
  const [motherOccupation, setMotherOccupation] = useState(initialData?.motherOccupation || '');
  const [brothers, setBrothers] = useState(initialData?.brothers || '0');
  const [sisters, setSisters] = useState(initialData?.sisters || '0');
  const [familyType, setFamilyType] = useState(initialData?.familyType || 'Nuclear');
  const [familyValues, setFamilyValues] = useState(initialData?.familyValues || 'Traditional');
  const [familyStatus, setFamilyStatus] = useState(initialData?.familyStatus || 'Middle class');

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleNextPress = () => {
    onNext({
      fatherOccupation: fatherOccupation.trim() || 'Retired',
      motherOccupation: motherOccupation.trim() || 'Homemaker',
      brothers,
      sisters,
      familyType,
      familyValues,
      familyStatus,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (5/8) */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
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

        {/* Center Progress Bar: 5/8 (62.5%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>5/8</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 90, 110) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Title & Subtitle */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>
              {isTa ? 'குடும்ப விவரங்கள்' : 'Family details'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'உங்கள் பெற்றோர், உடன்பிறப்புகள் மற்றும் பின்னணி பற்றிய தகவல்கள்.'
                : 'A little about your parents, siblings and background.'}
            </Text>
          </View>

          {/* 1. Father's occupation */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'தந்தையின் தொழில்' : "Father's occupation"}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'எ.கா. ஓய்வுபெற்ற ஆசிரியர்' : 'e.g. Retired teacher'}
                placeholderTextColor="#9CA3AF"
                value={fatherOccupation}
                onChangeText={setFatherOccupation}
              />
            </View>
          </View>

          {/* 2. Mother's occupation */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'தாயின் தொழில்' : "Mother's occupation"}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'எ.கா. இல்லத்தரசி' : 'e.g. Homemaker'}
                placeholderTextColor="#9CA3AF"
                value={motherOccupation}
                onChangeText={setMotherOccupation}
              />
            </View>
          </View>

          {/* 3. Brothers */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'சகோதரர்கள்' : 'Brothers'}
            </Text>
            <View style={styles.countsRow}>
              {COUNT_OPTIONS.map(c => {
                const isSelected = brothers === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.countCircle,
                      isSelected ? styles.countCircleSelected : styles.countCircleUnselected,
                    ]}
                    onPress={() => setBrothers(c)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.countText,
                        isSelected ? styles.countTextSelected : styles.countTextUnselected,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Sisters */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'சகோதரிகள்' : 'Sisters'}
            </Text>
            <View style={styles.countsRow}>
              {COUNT_OPTIONS.map(c => {
                const isSelected = sisters === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.countCircle,
                      isSelected ? styles.countCircleSelected : styles.countCircleUnselected,
                    ]}
                    onPress={() => setSisters(c)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.countText,
                        isSelected ? styles.countTextSelected : styles.countTextUnselected,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 5. Family type */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'குடும்ப வகை' : 'Family type'}
            </Text>
            <View style={styles.pillsWrap}>
              {FAMILY_TYPE_OPTIONS.map(opt => {
                const isSelected = familyType === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setFamilyType(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {isTa ? opt.labelTa : opt.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 6. Family values */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'குடும்ப பாரம்பரியம்' : 'Family values'}
            </Text>
            <View style={styles.pillsWrap}>
              {FAMILY_VALUES_OPTIONS.map(opt => {
                const isSelected = familyValues === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setFamilyValues(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {isTa ? opt.labelTa : opt.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 7. Family status */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'குடும்ப நிலை' : 'Family status'}
            </Text>
            <View style={styles.pillsWrap}>
              {FAMILY_STATUS_OPTIONS.map(opt => {
                const isSelected = familyStatus === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setFamilyStatus(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {isTa ? opt.labelTa : opt.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Sticky Next Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 24) },
        ]}
      >
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextPress}
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
  keyboardView: {
    flex: 1,
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEF2F6',
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressFill: {
    width: '62.5%', // 5 of 8 steps
    height: '100%',
    backgroundColor: BRAND_PURPLE,
    borderRadius: 3,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_PURPLE,
    minWidth: 28,
    textAlign: 'right',
  },

  /* Scroll Content */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  /* Header Area */
  headerArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 12,
  },

  /* Section */
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },

  /* Input Boxes */
  inputBox: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 15,
    color: '#111827',
    height: '100%',
    padding: 0,
  },

  /* Brothers & Sisters Count Circles/Pills */
  countsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  countCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countCircleUnselected: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  countCircleSelected: {
    backgroundColor: BRAND_PURPLE,
    borderWidth: 1,
    borderColor: BRAND_PURPLE,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  countText: {
    fontSize: 15,
  },
  countTextUnselected: {
    color: '#374151',
    fontWeight: '500',
  },
  countTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Pills (Family Type, Values, Status) */
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 10,
    marginBottom: 10,
  },
  pillUnselected: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  pillSelected: {
    backgroundColor: BRAND_PURPLE,
    borderWidth: 1,
    borderColor: BRAND_PURPLE,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pillTextUnselected: {
    color: '#374151',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  nextButton: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 28,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

