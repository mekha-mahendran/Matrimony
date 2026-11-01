import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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

export interface LocationDetailsData {
  nativePlace: string;
  nativeDistrict: string;
  country: string;
  state: string;
  currentCity: string;
  residencyStatus: string;
}

interface LocationDetailsScreenProps {
  language?: Language;
  initialData?: Partial<LocationDetailsData>;
  onNext: (data: LocationDetailsData) => void;
  onBackPress: () => void;
}

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Singapore',
  'Malaysia',
  'Germany',
  'France',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'New Zealand',
  'Other',
];

const RESIDENCY_STATUS_OPTIONS = [
  { id: 'Citizen', labelEn: 'Citizen', labelTa: 'குடிமகன்' },
  { id: 'Permanent resident', labelEn: 'Permanent resident', labelTa: 'நிரந்தர குடியிருப்பாளர்' },
  { id: 'Work visa', labelEn: 'Work visa', labelTa: 'பணி விசா' },
  { id: 'Student visa', labelEn: 'Student visa', labelTa: 'மாணவர் விசா' },
];

export const LocationDetailsScreen: React.FC<LocationDetailsScreenProps> = ({
  language = 'en',
  initialData,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states matching screenshot
  const [nativePlace, setNativePlace] = useState(initialData?.nativePlace || '');
  const [nativeDistrict, setNativeDistrict] = useState(initialData?.nativeDistrict || '');
  const [country, setCountry] = useState(initialData?.country || 'India');
  const [stateName, setStateName] = useState(initialData?.state || 'Tamil Nadu');
  const [currentCity, setCurrentCity] = useState(initialData?.currentCity || '');
  const [residencyStatus, setResidencyStatus] = useState(initialData?.residencyStatus || 'Citizen');

  // Modal
  const [showCountryModal, setShowCountryModal] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleNextPress = () => {
    onNext({
      nativePlace: nativePlace.trim(),
      nativeDistrict: nativeDistrict.trim(),
      country,
      state: stateName.trim(),
      currentCity: currentCity.trim(),
      residencyStatus,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (3/8) */}
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

        {/* Center Progress Bar: 3/8 (37.5%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>3/8</Text>
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
              {isTa ? 'இருப்பிட விவரங்கள்' : 'Location details'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'உங்கள் சொந்த ஊர் மற்றும் தற்போது வசிக்கும் இடம்.'
                : "Where you're from and where you live now."}
            </Text>
          </View>

          {/* 1. Native place */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'சொந்த ஊர்' : 'Native place'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'நகரம் அல்லது கிராமம்' : 'Town or village'}
                placeholderTextColor="#9CA3AF"
                value={nativePlace}
                onChangeText={setNativePlace}
              />
            </View>
          </View>

          {/* 2. Native district */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'சொந்த மாவட்டம்' : 'Native district'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'மாவட்டம்' : 'District'}
                placeholderTextColor="#9CA3AF"
                value={nativeDistrict}
                onChangeText={setNativeDistrict}
              />
            </View>
          </View>

          {/* 3. Country */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'நாடு' : 'Country'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowCountryModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.selectValueText}>
                {country}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 4. State */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'மாநிலம்' : 'State'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'எ.கா. தமிழ்நாடு' : 'e.g. Tamil Nadu'}
                placeholderTextColor="#9CA3AF"
                value={stateName}
                onChangeText={setStateName}
              />
            </View>
          </View>

          {/* 5. Current city */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'தற்போதைய நகரம்' : 'Current city'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'நீங்கள் வசிக்கும் நகரம்' : 'City you live in'}
                placeholderTextColor="#9CA3AF"
                value={currentCity}
                onChangeText={setCurrentCity}
              />
            </View>
          </View>

          {/* 6. Residency status */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'குடியிருப்பு நிலை' : 'Residency status'}
            </Text>
            <View style={styles.pillsWrap}>
              {RESIDENCY_STATUS_OPTIONS.map(opt => {
                const isSelected = residencyStatus === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setResidencyStatus(opt.id)}
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

      {/* ----------------- COUNTRY MODAL ----------------- */}
      <Modal
        visible={showCountryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowCountryModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '65%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'நாட்டைத் தேர்ந்தெடுக்கவும்' : 'Select Country'}
              </Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={COUNTRIES}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = country === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.listItemRow,
                      isSelected && styles.listItemRowSelected,
                    ]}
                    onPress={() => {
                      setCountry(item);
                      setShowCountryModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.listItemText,
                        isSelected && styles.listItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.6}>
                        <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    width: '37.5%', // 3 of 8 steps
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

  /* Select Box */
  selectBox: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValueText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
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

  /* Pills (Residency Status) */
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

  /* Modal Base */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 8,
  },

  /* List Item Row in Dropdown Modals */
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  listItemRowSelected: {
    backgroundColor: '#F4F2FF',
    borderRadius: 10,
  },
  listItemText: {
    fontSize: 15,
    color: '#374151',
  },
  listItemTextSelected: {
    color: BRAND_PURPLE,
    fontWeight: '700',
  },
});

