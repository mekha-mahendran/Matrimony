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

export interface PartnerPreferencesData {
  ageMin: string;
  ageMax: string;
  height: string;
  maritalStatus: string;
  religionCommunity: string;
  minimumEducation: string;
  preferredLocation: string;
  diet: string;
  otherExpectations: string;
}

interface PartnerPreferencesScreenProps {
  language?: Language;
  initialData?: Partial<PartnerPreferencesData>;
  onNext: (data: PartnerPreferencesData) => void;
  onBackPress: () => void;
}

const AGE_LIST = Array.from({ length: 53 }, (_, i) => String(18 + i));

const HEIGHT_PREF_LIST = [
  'Any',
  "4' 8\" and above (142 cm)",
  "5' 0\" and above (152 cm)",
  "5' 2\" and above (157 cm)",
  "5' 4\" and above (162 cm)",
  "5' 6\" and above (167 cm)",
  "5' 8\" and above (173 cm)",
  "5' 10\" and above (178 cm)",
  "6' 0\" and above (183 cm)",
];

const MARITAL_STATUS_OPTIONS = [
  { id: 'Never married', labelEn: 'Never married', labelTa: 'திருமணமாகாதவர்' },
  { id: 'Divorced', labelEn: 'Divorced', labelTa: 'விவாகரத்து பெற்றவர்' },
  { id: 'Widowed', labelEn: 'Widowed', labelTa: 'விதவை / விதவை ஆண்' },
  { id: 'Any', labelEn: 'Any', labelTa: 'எதுவாயினும்' },
];

const EDUCATION_PREF_LIST = [
  'Any',
  'Bachelors Degree and above',
  'Masters Degree and above',
  'B.E. / B.Tech / Engineering',
  'MBA / PGDM',
  'Doctorate / Ph.D',
  'Medical (MBBS / MD / MS / BDS)',
  'CA / CS / Finance',
];

const DIET_PREF_OPTIONS = [
  { id: 'Vegetarian', labelEn: 'Vegetarian', labelTa: 'சைவம்' },
  { id: 'Non-vegetarian', labelEn: 'Non-vegetarian', labelTa: 'அசைவம்' },
  { id: 'Any', labelEn: 'Any', labelTa: 'எதுவாயினும்' },
];

export const PartnerPreferencesScreen: React.FC<PartnerPreferencesScreenProps> = ({
  language = 'en',
  initialData,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states matching screenshot
  const [ageMin, setAgeMin] = useState(initialData?.ageMin || '18');
  const [ageMax, setAgeMax] = useState(initialData?.ageMax || '35');
  const [height, setHeight] = useState(initialData?.height || 'Any');
  const [maritalStatus, setMaritalStatus] = useState(initialData?.maritalStatus || 'Never married');
  const [religionCommunity, setReligionCommunity] = useState(initialData?.religionCommunity || '');
  const [minimumEducation, setMinimumEducation] = useState(initialData?.minimumEducation || 'Any');
  const [preferredLocation, setPreferredLocation] = useState(initialData?.preferredLocation || '');
  const [diet, setDiet] = useState(initialData?.diet || 'Any');
  const [otherExpectations, setOtherExpectations] = useState(initialData?.otherExpectations || '');

  // Modals
  const [showAgeMinModal, setShowAgeMinModal] = useState(false);
  const [showAgeMaxModal, setShowAgeMaxModal] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleNextPress = () => {
    onNext({
      ageMin,
      ageMax,
      height,
      maritalStatus,
      religionCommunity: religionCommunity.trim(),
      minimumEducation,
      preferredLocation: preferredLocation.trim(),
      diet,
      otherExpectations: otherExpectations.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (7/8) */}
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

        {/* Center Progress Bar: 7/8 (87.5%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>7/8</Text>
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
              {isTa ? 'துணைவர் விருப்பங்கள்' : 'Partner preferences'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'நீங்கள் எதிர்பார்க்கும் வாழ்க்கை துணை பற்றிய விவரங்கள்.'
                : "Tell us about the life partner you're looking for."}
            </Text>
          </View>

          {/* 1. Age range (Side-by-side) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'வயது வரம்பு' : 'Age range'}
            </Text>
            <View style={styles.twoColRow}>
              {/* Min Age */}
              <TouchableOpacity
                style={styles.selectBoxCol}
                onPress={() => setShowAgeMinModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectValueText}>{ageMin}</Text>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                  <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>

              {/* Max Age */}
              <TouchableOpacity
                style={[styles.selectBoxCol, { marginLeft: 12 }]}
                onPress={() => setShowAgeMaxModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectValueText}>{ageMax}</Text>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                  <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. Height */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'உயரம்' : 'Height'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowHeightModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.selectValueText}>{height}</Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 3. Marital status */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'திருமண நிலை' : 'Marital status'}
            </Text>
            <View style={styles.pillsWrap}>
              {MARITAL_STATUS_OPTIONS.map(opt => {
                const isSelected = maritalStatus === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setMaritalStatus(opt.id)}
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

          {/* 4. Religion / community */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'மதம் / சமூகம்' : 'Religion / community'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'எ.கா. அதே சமூகம்' : 'e.g. same community'}
                placeholderTextColor="#9CA3AF"
                value={religionCommunity}
                onChangeText={setReligionCommunity}
              />
            </View>
          </View>

          {/* 5. Minimum education */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'குறைந்தபட்ச கல்வி' : 'Minimum education'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowEducationModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.selectValueText}>{minimumEducation}</Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 6. Preferred location */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'விரும்பிய இடம்' : 'Preferred location'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'நகரம், மாநிலம் அல்லது நாடு' : 'City, state or country'}
                placeholderTextColor="#9CA3AF"
                value={preferredLocation}
                onChangeText={setPreferredLocation}
              />
            </View>
          </View>

          {/* 7. Diet */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'உணவு முறை' : 'Diet'}
            </Text>
            <View style={styles.pillsWrap}>
              {DIET_PREF_OPTIONS.map(opt => {
                const isSelected = diet === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setDiet(opt.id)}
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

          {/* 8. Other expectations */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'இதர எதிர்பார்ப்புகள்' : 'Other expectations'}
            </Text>
            <View style={styles.textAreaBox}>
              <TextInput
                style={styles.textAreaInput}
                placeholder={
                  isTa
                    ? 'உங்கள் வருங்கால துணை அறிந்து கொள்ள விரும்பும் பிற தகவல்கள்.'
                    : "Anything else you'd like your partner to know."
                }
                placeholderTextColor="#9CA3AF"
                value={otherExpectations}
                onChangeText={setOtherExpectations}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
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

      {/* ----------------- MIN AGE MODAL ----------------- */}
      <Modal
        visible={showAgeMinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAgeMinModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowAgeMinModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '60%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'குறைந்தபட்ச வயது' : 'Minimum Age'}
              </Text>
              <TouchableOpacity onPress={() => setShowAgeMinModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={AGE_LIST}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = ageMin === item;
                return (
                  <TouchableOpacity
                    style={[styles.listItemRow, isSelected && styles.listItemRowSelected]}
                    onPress={() => {
                      setAgeMin(item);
                      setShowAgeMinModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
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

      {/* ----------------- MAX AGE MODAL ----------------- */}
      <Modal
        visible={showAgeMaxModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAgeMaxModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowAgeMaxModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '60%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'அதிகபட்ச வயது' : 'Maximum Age'}
              </Text>
              <TouchableOpacity onPress={() => setShowAgeMaxModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={AGE_LIST}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = ageMax === item;
                return (
                  <TouchableOpacity
                    style={[styles.listItemRow, isSelected && styles.listItemRowSelected]}
                    onPress={() => {
                      setAgeMax(item);
                      setShowAgeMaxModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
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

      {/* ----------------- HEIGHT MODAL ----------------- */}
      <Modal
        visible={showHeightModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHeightModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowHeightModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '60%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'உயர விருப்பம்' : 'Preferred Height'}
              </Text>
              <TouchableOpacity onPress={() => setShowHeightModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={HEIGHT_PREF_LIST}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = height === item;
                return (
                  <TouchableOpacity
                    style={[styles.listItemRow, isSelected && styles.listItemRowSelected]}
                    onPress={() => {
                      setHeight(item);
                      setShowHeightModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
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

      {/* ----------------- EDUCATION MODAL ----------------- */}
      <Modal
        visible={showEducationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEducationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowEducationModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '60%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'குறைந்தபட்ச கல்வி விருப்பம்' : 'Preferred Minimum Education'}
              </Text>
              <TouchableOpacity onPress={() => setShowEducationModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={EDUCATION_PREF_LIST}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = minimumEducation === item;
                return (
                  <TouchableOpacity
                    style={[styles.listItemRow, isSelected && styles.listItemRowSelected]}
                    onPress={() => {
                      setMinimumEducation(item);
                      setShowEducationModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
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
    width: '87.5%', // 7 of 8 steps
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

  /* Age Range 2 Col Row */
  twoColRow: {
    flexDirection: 'row',
  },
  selectBoxCol: {
    flex: 1,
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

  /* Pills (Marital Status, Diet) */
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

  /* Textarea (Other Expectations) */
  textAreaBox: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    minHeight: 110,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textAreaInput: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    padding: 0,
    minHeight: 86,
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

