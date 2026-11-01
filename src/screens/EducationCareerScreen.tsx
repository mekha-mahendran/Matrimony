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

export interface EducationCareerData {
  highestQualification: string;
  college: string;
  employedIn: string;
  occupation: string;
  company: string;
  annualIncome: string;
}

interface EducationCareerScreenProps {
  language?: Language;
  initialData?: Partial<EducationCareerData>;
  onNext: (data: EducationCareerData) => void;
  onBackPress: () => void;
}

const QUALIFICATIONS = [
  'B.E. / B.Tech',
  'M.E. / M.Tech',
  'MBA / PGDM',
  'MCA / M.Sc (IT)',
  'B.Sc / M.Sc',
  'B.Com / M.Com',
  'MBBS / MD / MS',
  'BDS / MDS',
  'B.Arch / M.Arch',
  'B.A. / M.A.',
  'CA / CS / ICWA',
  'BL / LLB / LLM',
  'Diploma / Polytechnic',
  'Doctorate / Ph.D',
  'Higher Secondary (12th)',
  'Other Degree',
];

const EMPLOYED_IN_OPTIONS = [
  { id: 'Government', labelEn: 'Government', labelTa: 'அரசு பணி' },
  { id: 'Private', labelEn: 'Private', labelTa: 'தனியார் பணி' },
  { id: 'Business', labelEn: 'Business', labelTa: 'தொழில் / வணிகம்' },
  { id: 'Self-employed', labelEn: 'Self-employed', labelTa: 'சுயதொழில்' },
  { id: 'Not working', labelEn: 'Not working', labelTa: 'பணியில் இல்லை' },
];

const ANNUAL_INCOME_OPTIONS = [
  'Less than ₹3 Lakhs',
  '₹3 - ₹5 Lakhs',
  '₹5 - ₹7.5 Lakhs',
  '₹7.5 - ₹10 Lakhs',
  '₹10 - ₹15 Lakhs',
  '₹15 - ₹25 Lakhs',
  '₹25 - ₹50 Lakhs',
  '₹50 Lakhs - ₹1 Crore',
  '₹1 Crore and above',
];

export const EducationCareerScreen: React.FC<EducationCareerScreenProps> = ({
  language = 'en',
  initialData,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states matching screenshot
  const [highestQualification, setHighestQualification] = useState(initialData?.highestQualification || '');
  const [college, setCollege] = useState(initialData?.college || '');
  const [employedIn, setEmployedIn] = useState(initialData?.employedIn || 'Private');
  const [occupation, setOccupation] = useState(initialData?.occupation || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [annualIncome, setAnnualIncome] = useState(initialData?.annualIncome || '');

  // Modals
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleNextPress = () => {
    onNext({
      highestQualification: highestQualification || 'B.E. / B.Tech',
      college: college.trim(),
      employedIn: employedIn || 'Private',
      occupation: occupation.trim() || 'Software Engineer',
      company: company.trim(),
      annualIncome: annualIncome || '₹7.5 - ₹10 Lakhs',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (4/8) */}
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

        {/* Center Progress Bar: 4/8 (50%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>4/8</Text>
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
              {isTa ? 'கல்வி மற்றும் தொழில்' : 'Education & career'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'உங்கள் தகுதி, பணி மற்றும் வருமானம்.'
                : 'Your qualification, work and income.'}
            </Text>
          </View>

          {/* 1. Highest qualification */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'உயர்கல்வித் தகுதி' : 'Highest qualification'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowQualificationModal(true)}
              activeOpacity={0.7}
            >
              <Text style={highestQualification ? styles.selectValueText : styles.selectPlaceholderText}>
                {highestQualification || (isTa ? 'தேர்வு செய்க' : 'Select')}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 2. College / institution */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'கல்லூரி / நிறுவனம்' : 'College / institution'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'நிறுவனத்தின் பெயர்' : 'Name of institution'}
                placeholderTextColor="#9CA3AF"
                value={college}
                onChangeText={setCollege}
              />
            </View>
          </View>

          {/* 3. Employed in */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'பணித் துறை' : 'Employed in'}
            </Text>
            <View style={styles.pillsWrap}>
              {EMPLOYED_IN_OPTIONS.map(opt => {
                const isSelected = employedIn === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setEmployedIn(opt.id)}
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

          {/* 4. Occupation */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'தொழில் / பதவி' : 'Occupation'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'எ.கா. மென்பொருள் பொறியாளர்' : 'e.g. Software engineer'}
                placeholderTextColor="#9CA3AF"
                value={occupation}
                onChangeText={setOccupation}
              />
            </View>
          </View>

          {/* 5. Company */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'நிறுவனம்' : 'Company'}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder={isTa ? 'விருப்பத்திற்குரியது' : 'Optional'}
                placeholderTextColor="#9CA3AF"
                value={company}
                onChangeText={setCompany}
              />
            </View>
          </View>

          {/* 6. Annual income */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'ஆண்டு வருமானம்' : 'Annual income'}
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setShowIncomeModal(true)}
              activeOpacity={0.7}
            >
              <Text style={annualIncome ? styles.selectValueText : styles.selectPlaceholderText}>
                {annualIncome || (isTa ? 'தேர்வு செய்க' : 'Select')}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
                <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
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

      {/* ----------------- QUALIFICATION MODAL ----------------- */}
      <Modal
        visible={showQualificationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQualificationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowQualificationModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '70%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'கல்வித் தகுதியைத் தேர்ந்தெடுக்கவும்' : 'Select Qualification'}
              </Text>
              <TouchableOpacity onPress={() => setShowQualificationModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={QUALIFICATIONS}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = highestQualification === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.listItemRow,
                      isSelected && styles.listItemRowSelected,
                    ]}
                    onPress={() => {
                      setHighestQualification(item);
                      setShowQualificationModal(false);
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

      {/* ----------------- ANNUAL INCOME MODAL ----------------- */}
      <Modal
        visible={showIncomeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIncomeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowIncomeModal(false)}
        >
          <View
            style={[styles.modalSheet, { maxHeight: '65%', paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'ஆண்டு வருமானத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Annual Income'}
              </Text>
              <TouchableOpacity onPress={() => setShowIncomeModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ANNUAL_INCOME_OPTIONS}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = annualIncome === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.listItemRow,
                      isSelected && styles.listItemRowSelected,
                    ]}
                    onPress={() => {
                      setAnnualIncome(item);
                      setShowIncomeModal(false);
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
    width: '50%', // 4 of 8 steps
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

  /* Pills (Employed In) */
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

