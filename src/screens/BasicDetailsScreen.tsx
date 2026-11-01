import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Royal purple matching Create Account & Onboarding brand identity
const BRAND_PURPLE = '#6D53F5';

export interface BasicDetailsData {
  profileFor: string;
  gender: 'male' | 'female';
  fullName: string;
  dob: string;
  height: string;
  maritalStatus: string;
  mobileNumber: string;
}

interface BasicDetailsScreenProps {
  language?: Language;
  initialData?: Partial<BasicDetailsData>;
  onNext: (data: BasicDetailsData) => void;
  onBackPress: () => void;
}

const PROFILE_FOR_OPTIONS = [
  { id: 'Myself', labelEn: 'Myself', labelTa: 'எனக்கு' },
  { id: 'Son', labelEn: 'Son', labelTa: 'மகன்' },
  { id: 'Daughter', labelEn: 'Daughter', labelTa: 'மகள்' },
  { id: 'Brother', labelEn: 'Brother', labelTa: 'சகோதரன்' },
  { id: 'Sister', labelEn: 'Sister', labelTa: 'சகோதரி' },
  { id: 'Relative', labelEn: 'Relative', labelTa: 'உறவினர்' },
];

const MARITAL_STATUS_OPTIONS = [
  { id: 'Never married', labelEn: 'Never married', labelTa: 'திருமணமாகாதவர்' },
  { id: 'Divorced', labelEn: 'Divorced', labelTa: 'விவாகரத்து பெற்றவர்' },
  { id: 'Widowed', labelEn: 'Widowed', labelTa: 'விதவை / விதவை ஆண்' },
  { id: 'Awaiting divorce', labelEn: 'Awaiting divorce', labelTa: 'விவாகரத்து எதிர்பார்ப்பவர்' },
];

const HEIGHT_LIST = [
  '4 ft (122 cm)',
  '4 ft 1 in (124 cm)',
  '4 ft 2 in (127 cm)',
  '4 ft 3 in (129 cm)',
  '4 ft 4 in (132 cm)',
  '4 ft 5 in (134 cm)',
  '4 ft 6 in (137 cm)',
  '4 ft 7 in (139 cm)',
  '4 ft 8 in (142 cm)',
  '4 ft 9 in (144 cm)',
  '4 ft 10 in (147 cm)',
  '4 ft 11 in (149 cm)',
  '5 ft (152 cm)',
  '5 ft 1 in (154 cm)',
  '5 ft 2 in (157 cm)',
  '5 ft 3 in (160 cm)',
  '5 ft 4 in (162 cm)',
  '5 ft 5 in (165 cm)',
  '5 ft 6 in (167 cm)',
  '5 ft 7 in (170 cm)',
  '5 ft 8 in (173 cm)',
  '5 ft 9 in (175 cm)',
  '5 ft 10 in (178 cm)',
  '5 ft 11 in (180 cm)',
  '6 ft (183 cm)',
  '6 ft 1 in (185 cm)',
  '6 ft 2 in (188 cm)',
  '6 ft 3 in (190 cm)',
  '6 ft 4 in (193 cm)',
  '6 ft 5 in (196 cm)',
  '6 ft 6 in (198 cm)',
];

const MONTHS = [
  { val: '01', name: 'Jan (01)' },
  { val: '02', name: 'Feb (02)' },
  { val: '03', name: 'Mar (03)' },
  { val: '04', name: 'Apr (04)' },
  { val: '05', name: 'May (05)' },
  { val: '06', name: 'Jun (06)' },
  { val: '07', name: 'Jul (07)' },
  { val: '08', name: 'Aug (08)' },
  { val: '09', name: 'Sep (09)' },
  { val: '10', name: 'Oct (10)' },
  { val: '11', name: 'Nov (11)' },
  { val: '12', name: 'Dec (12)' },
];

export const BasicDetailsScreen: React.FC<BasicDetailsScreenProps> = ({
  language = 'en',
  initialData,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states
  const [profileFor, setProfileFor] = useState(initialData?.profileFor || 'Myself');
  const [gender, setGender] = useState<'male' | 'female'>(initialData?.gender || 'male');
  const [fullName, setFullName] = useState(initialData?.fullName || 'John Doe');
  const [dob, setDob] = useState(initialData?.dob || '');
  const [height, setHeight] = useState(initialData?.height || '');
  const [maritalStatus, setMaritalStatus] = useState(initialData?.maritalStatus || 'Never married');
  const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || '');

  // Modals
  const [showDobModal, setShowDobModal] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);

  // Date selection states inside modal
  const [tempDay, setTempDay] = useState('15');
  const [tempMonth, setTempMonth] = useState('08');
  const [tempYear, setTempYear] = useState('1996');

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleConfirmDob = () => {
    const formatted = `${tempDay.padStart(2, '0')}-${tempMonth.padStart(2, '0')}-${tempYear}`;
    setDob(formatted);
    setShowDobModal(false);
  };

  const handleNextPress = () => {
    if (!fullName.trim()) {
      Alert.alert(
        isTa ? 'பெயர் தேவை' : 'Name Required',
        isTa ? 'தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும்.' : 'Please enter your full name.'
      );
      return;
    }

    if (mobileNumber && mobileNumber.replace(/\D/g, '').length < 10) {
      Alert.alert(
        isTa ? 'தவறான மொபைல் எண்' : 'Invalid Mobile Number',
        isTa
          ? 'தயவுசெய்து சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    onNext({
      profileFor,
      gender,
      fullName: fullName.trim(),
      dob: dob.trim() || '15-08-1996',
      height: height || '5 ft 6 in (167 cm)',
      maritalStatus,
      mobileNumber: mobileNumber.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (1/8) */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        {/* Back Button */}
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

        {/* Center Progress Bar: 1/8 (12.5%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>1/8</Text>
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
              {isTa ? 'அடிப்படை விவரங்கள்' : 'Basic details'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'உங்கள் சுயவிவரத்தை உருவாக்க உங்களைப் பற்றி எங்களிடம் கூறுங்கள்'
                : 'Tell us about yourself so we can build your\nprofile'}
            </Text>
          </View>

          {/* 1. Profile created for */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'யாருக்காக சுயவிவரம் உருவாக்கப்படுகிறது' : 'Profile created for'}
            </Text>
            <View style={styles.pillsWrap}>
              {PROFILE_FOR_OPTIONS.map(opt => {
                const isSelected = profileFor === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setProfileFor(opt.id)}
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

          {/* 2. Gender */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'பாலினம்' : 'Gender'}
            </Text>
            <View style={styles.genderRow}>
              {/* Male Circle */}
              <TouchableOpacity
                style={[
                  styles.genderCircle,
                  gender === 'male' ? styles.genderCircleSelected : styles.genderCircleUnselected,
                ]}
                onPress={() => setGender('male')}
                activeOpacity={0.85}
              >
                <Svg
                  width={34}
                  height={34}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={gender === 'male' ? '#FFFFFF' : '#4B5563'}
                  strokeWidth={2.4}
                >
                  <Circle cx="10" cy="14" r="5" />
                  <Path d="M14 10l6-6M20 4h-5M20 4v5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text
                  style={[
                    styles.genderText,
                    gender === 'male' ? styles.genderTextSelected : styles.genderTextUnselected,
                  ]}
                >
                  {isTa ? 'ஆண்' : 'Male'}
                </Text>
              </TouchableOpacity>

              {/* Female Circle */}
              <TouchableOpacity
                style={[
                  styles.genderCircle,
                  gender === 'female' ? styles.genderCircleSelected : styles.genderCircleUnselected,
                ]}
                onPress={() => setGender('female')}
                activeOpacity={0.85}
              >
                <Svg
                  width={34}
                  height={34}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={gender === 'female' ? '#FFFFFF' : '#4B5563'}
                  strokeWidth={2.4}
                >
                  <Circle cx="12" cy="9" r="5" />
                  <Path d="M12 14v7M9 18h6" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text
                  style={[
                    styles.genderText,
                    gender === 'female' ? styles.genderTextSelected : styles.genderTextUnselected,
                  ]}
                >
                  {isTa ? 'பெண்' : 'Female'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Full name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'முழு பெயர்' : 'Full name'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'உங்கள் முழு பெயரை உள்ளிடவும்' : 'Enter your full name'}
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* 4. Date of birth & Height (Side by Side) */}
          <View style={styles.twoColRow}>
            {/* Column 1: Date of birth */}
            <View style={styles.col}>
              <Text style={styles.sectionLabel}>
                {isTa ? 'பிறந்த தேதி' : 'Date of birth'}
              </Text>
              <TouchableOpacity
                style={styles.inputBoxRow}
                onPress={() => setShowDobModal(true)}
                activeOpacity={0.7}
              >
                <Text style={dob ? styles.inputValueText : styles.inputPlaceholderText}>
                  {dob || 'dd-mm-yyyy'}
                </Text>
                {/* Calendar Icon */}
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                  <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <Path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Column 2: Height */}
            <View style={[styles.col, { marginLeft: 12 }]}>
              <Text style={styles.sectionLabel}>
                {isTa ? 'உயரம்' : 'Height'}
              </Text>
              <TouchableOpacity
                style={styles.inputBoxRow}
                onPress={() => setShowHeightModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  numberOfLines={1}
                  style={height ? styles.inputValueText : styles.inputPlaceholderText}
                >
                  {height || (isTa ? 'தேர்வு செய்க' : 'Select')}
                </Text>
                {/* Chevron Down Icon */}
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                  <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. Marital status */}
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

          {/* 6. Mobile number */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'மொபைல் எண்' : 'Mobile number'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? '10 இலக்க மொபைல் எண்' : '10-digit mobile number'}
                placeholderTextColor="#9CA3AF"
                value={mobileNumber}
                onChangeText={text => setMobileNumber(text.replace(/[^0-9]/g, ''))}
                keyboardType="phone-pad"
                maxLength={10}
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

      {/* -------------------- DATE PICKER MODAL -------------------- */}
      <Modal
        visible={showDobModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDobModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowDobModal(false)}
        >
          <View
            style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom + 20, 30) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்' : 'Select Date of Birth'}
              </Text>
              <TouchableOpacity onPress={() => setShowDobModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dobPickersRow}>
              {/* Day Input */}
              <View style={styles.dobCol}>
                <Text style={styles.dobColLabel}>{isTa ? 'நாள்' : 'Day'}</Text>
                <TextInput
                  style={styles.dobInput}
                  value={tempDay}
                  onChangeText={setTempDay}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Month Dropdown / Input */}
              <View style={styles.dobCol}>
                <Text style={styles.dobColLabel}>{isTa ? 'மாதம்' : 'Month'}</Text>
                <TextInput
                  style={styles.dobInput}
                  value={tempMonth}
                  onChangeText={setTempMonth}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="MM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Year Input */}
              <View style={[styles.dobCol, { flex: 1.3 }]}>
                <Text style={styles.dobColLabel}>{isTa ? 'ஆண்டு' : 'Year'}</Text>
                <TextInput
                  style={styles.dobInput}
                  value={tempYear}
                  onChangeText={setTempYear}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="YYYY"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Quick Month Selector Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthChipsContainer}
            >
              {MONTHS.map(m => (
                <TouchableOpacity
                  key={m.val}
                  style={[
                    styles.monthChip,
                    tempMonth === m.val && styles.monthChipActive,
                  ]}
                  onPress={() => setTempMonth(m.val)}
                >
                  <Text
                    style={[
                      styles.monthChipText,
                      tempMonth === m.val && styles.monthChipTextActive,
                    ]}
                  >
                    {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={handleConfirmDob}
              activeOpacity={0.85}
            >
              <Text style={styles.modalConfirmBtnText}>
                {isTa ? 'உறுதிப்படுத்து' : 'Set Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* -------------------- HEIGHT PICKER MODAL -------------------- */}
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
            style={[styles.modalSheet, { maxHeight: '70%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'உயரத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Height'}
              </Text>
              <TouchableOpacity onPress={() => setShowHeightModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={HEIGHT_LIST}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = height === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.heightItemRow,
                      isSelected && styles.heightItemRowSelected,
                    ]}
                    onPress={() => {
                      setHeight(item);
                      setShowHeightModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.heightItemText,
                        isSelected && styles.heightItemTextSelected,
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
    width: '12.5%', // 1 of 8 steps
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
    paddingHorizontal: 16,
  },

  /* Section */
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },

  /* Pills (Created For & Marital Status) */
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

  /* Gender Circular Cards */
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 4,
  },
  genderCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderCircleUnselected: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  genderCircleSelected: {
    backgroundColor: BRAND_PURPLE,
    borderWidth: 1,
    borderColor: BRAND_PURPLE,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  genderText: {
    marginTop: 6,
    fontSize: 14,
  },
  genderTextUnselected: {
    color: '#4B5563',
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
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

  /* Two Column Row (DOB + Height) */
  twoColRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  col: {
    flex: 1,
  },
  inputBoxRow: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    height: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputValueText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  inputPlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
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

  /* Modal Styles */
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
    marginBottom: 16,
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

  /* DOB Picker within Modal */
  dobPickersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dobCol: {
    flex: 1,
  },
  dobColLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  dobInput: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 10,
    height: 48,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  monthChipsContainer: {
    paddingVertical: 6,
    gap: 8,
    marginBottom: 20,
  },
  monthChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  monthChipActive: {
    backgroundColor: BRAND_PURPLE,
  },
  monthChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  monthChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalConfirmBtn: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Height Modal List Item */
  heightItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  heightItemRowSelected: {
    backgroundColor: '#F4F2FF',
    borderRadius: 10,
  },
  heightItemText: {
    fontSize: 15,
    color: '#374151',
  },
  heightItemTextSelected: {
    color: BRAND_PURPLE,
    fontWeight: '700',
  },
});
