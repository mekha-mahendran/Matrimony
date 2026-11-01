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
import { TAMIL_NAKSHATRAMS, TAMIL_RASIS } from '../services/horoscopeService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

export interface ReligiousDetailsData {
  religion: string;
  community: string;
  subCommunity: string;
  nakshatra: string;
  raasi: string;
  dosham: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface ReligiousDetailsScreenProps {
  language?: Language;
  initialData?: Partial<ReligiousDetailsData>;
  onNext: (data: ReligiousDetailsData) => void;
  onBackPress: () => void;
}

const RELIGIONS = [
  'Hindu',
  'Christian',
  'Muslim',
  'Jain',
  'Sikh',
  'Buddhist',
  'Inter-Religion',
  'Other / Non-Religious',
];

const DOSHAM_OPTIONS = [
  { id: 'No dosham', labelEn: 'No dosham', labelTa: 'தோஷம் இல்லை' },
  { id: 'Chevvai dosham', labelEn: 'Chevvai dosham', labelTa: 'செவ்வாய் தோஷம்' },
  { id: 'Rahu-Ketu', labelEn: 'Rahu-Ketu', labelTa: 'ராகு-கேது தோஷம்' },
  { id: "Don't know", labelEn: "Don't know", labelTa: 'தெரியாது' },
];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const ReligiousDetailsScreen: React.FC<ReligiousDetailsScreenProps> = ({
  language = 'en',
  initialData,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states
  const [religion, setReligion] = useState(initialData?.religion || 'Hindu');
  const [community, setCommunity] = useState(initialData?.community || '');
  const [subCommunity, setSubCommunity] = useState(initialData?.subCommunity || '');
  const [nakshatra, setNakshatra] = useState(initialData?.nakshatra || '');
  const [raasi, setRaasi] = useState(initialData?.raasi || '');
  const [dosham, setDosham] = useState(initialData?.dosham || 'No dosham');
  const [timeOfBirth, setTimeOfBirth] = useState(initialData?.timeOfBirth || '');
  const [placeOfBirth, setPlaceOfBirth] = useState(initialData?.placeOfBirth || '');

  // Modals
  const [showReligionModal, setShowReligionModal] = useState(false);
  const [showNakshatraModal, setShowNakshatraModal] = useState(false);
  const [showRaasiModal, setShowRaasiModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  // Time temp state
  const [tempHour, setTempHour] = useState('09');
  const [tempMin, setTempMin] = useState('30');
  const [tempAmPm, setTempAmPm] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleConfirmTime = () => {
    setTimeOfBirth(`${tempHour}:${tempMin} ${tempAmPm}`);
    setShowTimeModal(false);
  };

  const handleNextPress = () => {
    onNext({
      religion: religion || 'Hindu',
      community: community.trim(),
      subCommunity: subCommunity.trim(),
      nakshatra: nakshatra || 'Ashwini (அஸ்வினி)',
      raasi: raasi || 'Mesham (மேஷம்)',
      dosham: dosham || 'No dosham',
      timeOfBirth: timeOfBirth || '09:30 AM',
      placeOfBirth: placeOfBirth.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (2/8) */}
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

        {/* Center Progress Bar: 2/8 (25%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>2/8</Text>
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
              {isTa ? 'மத விவரங்கள்' : 'Religious details'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'மதம், சமூகம் மற்றும் ஜாதகம் பாரம்பரியங்களை இணைக்க உதவுகின்றன.'
                : 'Religion, community and horoscope help us match\ntraditions.'}
            </Text>
          </View>

          {/* 1. Religion */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'மதம்' : 'Religion'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowReligionModal(true)}
              activeOpacity={0.7}
            >
              <Text style={religion ? styles.selectValueText : styles.selectPlaceholderText}>
                {religion || (isTa ? 'தேர்வு செய்க' : 'Select')}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 2. Community / caste */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'சமூகம் / சாதி' : 'Community / caste'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'எ.கா. உங்கள் சமூகம்' : 'e.g. your community'}
                placeholderTextColor="#9CA3AF"
                value={community}
                onChangeText={setCommunity}
              />
            </View>
          </View>

          {/* 3. Sub-community */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'உட்பிரிவு' : 'Sub-community'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'விருப்பத்திற்குரியது' : 'Optional'}
                placeholderTextColor="#9CA3AF"
                value={subCommunity}
                onChangeText={setSubCommunity}
              />
            </View>
          </View>

          {/* 4. Star (Nakshatra) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'நட்சத்திரம்' : 'Star (Nakshatra)'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowNakshatraModal(true)}
              activeOpacity={0.7}
            >
              <Text style={nakshatra ? styles.selectValueText : styles.selectPlaceholderText}>
                {nakshatra || (isTa ? 'தேர்வு செய்க' : 'Select')}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 5. Raasi (Moon sign) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'ராசி' : 'Raasi (Moon sign)'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowRaasiModal(true)}
              activeOpacity={0.7}
            >
              <Text style={raasi ? styles.selectValueText : styles.selectPlaceholderText}>
                {raasi || (isTa ? 'தேர்வு செய்க' : 'Select')}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 6. Dosham */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'தோஷம்' : 'Dosham'}
            </Text>
            <View style={styles.pillsWrap}>
              {DOSHAM_OPTIONS.map(opt => {
                const isSelected = dosham === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setDosham(opt.id)}
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

          {/* 7. Time of birth */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'பிறந்த நேரம்' : 'Time of birth'}
            </Text>
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setShowTimeModal(true)}
              activeOpacity={0.7}
            >
              <Text style={timeOfBirth ? styles.timeValueText : styles.timePlaceholderText}>
                {timeOfBirth || '--:-- --'}
              </Text>
              {/* Clock Icon */}
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Circle cx="12" cy="12" r="10" />
                <Path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 8. Place of birth */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'பிறந்த இடம்' : 'Place of birth'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'நகரம் / ஊர்' : 'City / town'}
                placeholderTextColor="#9CA3AF"
                value={placeOfBirth}
                onChangeText={setPlaceOfBirth}
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

      {/* ----------------- RELIGION MODAL ----------------- */}
      <Modal
        visible={showReligionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReligionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowReligionModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '60%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'மதத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Religion'}
              </Text>
              <TouchableOpacity onPress={() => setShowReligionModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={RELIGIONS}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = religion === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.listItemRow,
                      isSelected && styles.listItemRowSelected,
                    ]}
                    onPress={() => {
                      setReligion(item);
                      setShowReligionModal(false);
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

      {/* ----------------- NAKSHATRA MODAL ----------------- */}
      <Modal
        visible={showNakshatraModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNakshatraModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowNakshatraModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '75%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'நட்சத்திரத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Star (Nakshatra)'}
              </Text>
              <TouchableOpacity onPress={() => setShowNakshatraModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={TAMIL_NAKSHATRAMS}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = nakshatra === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.listItemRow,
                      isSelected && styles.listItemRowSelected,
                    ]}
                    onPress={() => {
                      setNakshatra(item);
                      setShowNakshatraModal(false);
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

      {/* ----------------- RAASI MODAL ----------------- */}
      <Modal
        visible={showRaasiModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRaasiModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowRaasiModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '65%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'ராசியைத் தேர்ந்தெடுக்கவும்' : 'Select Raasi (Moon sign)'}
              </Text>
              <TouchableOpacity onPress={() => setShowRaasiModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={TAMIL_RASIS}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = raasi === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.listItemRow,
                      isSelected && styles.listItemRowSelected,
                    ]}
                    onPress={() => {
                      setRaasi(item);
                      setShowRaasiModal(false);
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

      {/* ----------------- TIME OF BIRTH MODAL ----------------- */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowTimeModal(false)}
        >
          <View
            style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom + 20, 30) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'பிறந்த நேரத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Time of Birth'}
              </Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Time Pickers (HH : MM AM/PM) */}
            <View style={styles.timePickerContainer}>
              {/* Hour Dropdown / Scroll */}
              <View style={styles.timeCol}>
                <Text style={styles.timeColLabel}>{isTa ? 'மணி' : 'Hour'}</Text>
                <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                  {HOURS.map(h => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.timeSlot, tempHour === h && styles.timeSlotActive]}
                      onPress={() => setTempHour(h)}
                    >
                      <Text style={[styles.timeSlotText, tempHour === h && styles.timeSlotTextActive]}>
                        {h}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              {/* Minute Dropdown / Scroll */}
              <View style={styles.timeCol}>
                <Text style={styles.timeColLabel}>{isTa ? 'நிமிடம்' : 'Minute'}</Text>
                <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                  {MINUTES.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.timeSlot, tempMin === m && styles.timeSlotActive]}
                      onPress={() => setTempMin(m)}
                    >
                      <Text style={[styles.timeSlotText, tempMin === m && styles.timeSlotTextActive]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* AM / PM Toggle */}
              <View style={styles.amPmCol}>
                <TouchableOpacity
                  style={[styles.amPmBtn, tempAmPm === 'AM' && styles.amPmBtnActive]}
                  onPress={() => setTempAmPm('AM')}
                >
                  <Text style={[styles.amPmText, tempAmPm === 'AM' && styles.amPmTextActive]}>
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.amPmBtn, tempAmPm === 'PM' && styles.amPmBtnActive]}
                  onPress={() => setTempAmPm('PM')}
                >
                  <Text style={[styles.amPmText, tempAmPm === 'PM' && styles.amPmTextActive]}>
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={handleConfirmTime}
              activeOpacity={0.85}
            >
              <Text style={styles.modalConfirmBtnText}>
                {isTa ? 'உறுதிப்படுத்து' : 'Set Time'}
              </Text>
            </TouchableOpacity>
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
    width: '25%', // 2 of 8 steps
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
  selectPlaceholderText: {
    fontSize: 15,
    color: '#9CA3AF',
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

  /* Pills (Dosham) */
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

  /* Time of Birth Box */
  timeBox: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    height: 52,
    width: 140,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeValueText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  timePlaceholderText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '600',
    letterSpacing: 1,
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

  /* Time Picker in Modal */
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 16,
  },
  timeCol: {
    alignItems: 'center',
    width: 64,
  },
  timeColLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  timeScroll: {
    height: 120,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 10,
    width: '100%',
  },
  timeSlot: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: '#F4F2FF',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  timeSlotTextActive: {
    color: BRAND_PURPLE,
    fontWeight: '700',
  },
  timeSeparator: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
  },
  amPmCol: {
    gap: 10,
    marginTop: 20,
  },
  amPmBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  amPmBtnActive: {
    backgroundColor: BRAND_PURPLE,
  },
  amPmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  amPmTextActive: {
    color: '#FFFFFF',
  },
  modalConfirmBtn: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

