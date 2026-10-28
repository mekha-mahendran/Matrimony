import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
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
import { CustomIcon } from '../components/CustomIcon';
import { Language, Translations } from '../localization';
import {
  BorderRadius,
  Colors,
  MatrimonyTheme,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { Gender, ProfileCreatedFor } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


interface ProfileOption {
  id: ProfileCreatedFor;
  labelEn: string;
  labelTa: string;
}

const ALL_PROFILE_OPTIONS: ProfileOption[] = [
  { id: 'self', labelEn: 'Myself', labelTa: 'எனக்கு' },
  { id: 'son', labelEn: 'Son', labelTa: 'மகன்' },
  { id: 'daughter', labelEn: 'Daughter', labelTa: 'மகள்' },
  { id: 'brother', labelEn: 'Brother', labelTa: 'சகோதரன்' },
  { id: 'sister', labelEn: 'Sister', labelTa: 'சகோதரி' },
  { id: 'friend', labelEn: 'Friend', labelTa: 'நண்பர்' },
  { id: 'relative', labelEn: 'Relative', labelTa: 'உறவினர்' },
];

// 3-column rows matching user's Image 1 (Row 1: Myself, Son, Daughter; Row 2: Brother, Sister, Friend; Row 3: Relative)
const ROWS_PROFILE_OPTIONS: ProfileCreatedFor[][] = [
  ['self', 'son', 'daughter'],
  ['brother', 'sister', 'friend'],
  ['relative'],
];

const FREQUENT_LANGUAGES = [
  'Hindi',
  'Marathi',
  'Bengali',
  'Oriya',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
];

const MORE_LANGUAGES = [
  'Angika',
  'Arunachali',
  'Assamese',
  'Awadhi',
  'Badaga',
  'Bhojpuri',
  'Bihari',
  'Brij',
  'Dogri',
  'English',
  'French',
  'Garhwali',
  'Garo',
  'Gujarati',
  'Haryanvi',
  'Himachali/Pahari',
  'Kanauji',
  'Kashmiri',
  'Khandesi',
  'Khasi',
  'Konkani',
  'Koshali',
  'Kumaoni',
  'Kutchi',
  'Ladakhi',
  'Lepcha',
  'Magahi',
  'Maithili',
  'Manipuri',
  'Marwari',
  'Miji',
  'Mizo',
  'Monpa',
  'Nepali',
  'Odia',
  'Punjabi',
  'Rajasthani',
  'Sanskrit',
  'Santhali',
  'Saurashtra',
  'Sindhi',
  'Tulu',
  'Urdu',
];


interface RegisterScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  initialCreatedFor?: ProfileCreatedFor;
  initialStep?: 'select_for' | 'details' | 'otp' | 'account_exists';
  onContinueToWizard: (initialData: any) => void;
  onLoginPress: () => void;
  onBackPress: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  language,
  onToggleLanguage,
  initialCreatedFor = 'self',
  initialStep = 'select_for',
  onContinueToWizard,
  onLoginPress,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  // Local language state synced with parent
  const [currentLang, setCurrentLang] = useState<Language>(language);
  useEffect(() => {
    setCurrentLang(language);
  }, [language]);

  const isTa = currentLang === 'ta';
  const t = Translations[currentLang];

  const handleToggleLang = () => {
    const next: Language = currentLang === 'en' ? 'ta' : 'en';
    setCurrentLang(next);
    if (onToggleLanguage) {
      onToggleLanguage();
    }
  };

  // Safe area insets
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  );
  const bottomInset = Math.max(insets.bottom, 16);

  // Flow step: 'select_for' | 'details' | 'otp' | 'account_exists'
  type RegisterStep = 'select_for' | 'details' | 'otp' | 'account_exists';
  const [step, setStep] = useState<RegisterStep>(initialStep);
  const [selectedFor, setSelectedFor] = useState<ProfileCreatedFor>(initialCreatedFor);

  // Form details state
  const [gender, setGender] = useState<Gender>(
    initialCreatedFor === 'daughter' || initialCreatedFor === 'sister'
      ? 'bride'
      : 'groom'
  );
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1996-05-15');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Chennai');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [tempLang, setTempLang] = useState<Language>(currentLang);
  const [quickRegisterModalVisible, setQuickRegisterModalVisible] = useState(false);

  // OTP Verification state (Image 1)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number>(0);
  const [resendTimer, setResendTimer] = useState<number>(27);
  const otpInput0Ref = React.useRef<any>(null);
  const otpInput1Ref = React.useRef<any>(null);
  const otpInput2Ref = React.useRef<any>(null);
  const otpInput3Ref = React.useRef<any>(null);
  const otpRefs = [otpInput0Ref, otpInput1Ref, otpInput2Ref, otpInput3Ref];

  // Dynamic phone display (defaults to user reference number 6385901512 if empty)
  const displayPhone = phone.trim() || '6385901512';

  // 1-second delay popup for Quick Register modal when entering Basic Details screen
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 'details') {
      timer = setTimeout(() => {
        setQuickRegisterModalVisible(true);
      }, 1000);
    } else {
      setQuickRegisterModalVisible(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step]);

  // Resend OTP Countdown Timer (starts at 27s matching Image 1)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Mother tongue state
  const [motherTongue, setMotherTongue] = useState('Tamil');
  const [motherTongueModalVisible, setMotherTongueModalVisible] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const filteredFrequent = FREQUENT_LANGUAGES.filter(l =>
    l.toLowerCase().includes(langSearch.trim().toLowerCase())
  );
  const filteredMore = MORE_LANGUAGES.filter(l =>
    l.toLowerCase().includes(langSearch.trim().toLowerCase())
  );

  // Auto-align gender recommendation when relationship is picked
  const handleSelectOption = (optId: ProfileCreatedFor) => {
    setSelectedFor(optId);
    if (optId === 'daughter' || optId === 'sister') {
      setGender('bride');
    } else if (optId === 'son' || optId === 'brother') {
      setGender('groom');
    }
  };

  // Step 1 -> Step 2 (Basic Details)
  const handleStartRegistration = () => {
    if (!selectedFor) {
      Alert.alert(
        isTa ? 'தேர்வு செய்யவும்' : 'Selection Required',
        isTa
          ? 'சுயவிவரத்தை யாருக்காக உருவாக்குகிறீர்கள் என்பதைத் தேர்வு செய்யவும்.'
          : 'Please select whom you are creating this profile for.'
      );
      return;
    }
    setStep('details');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+918144998877').catch(() => {
      Alert.alert(
        isTa ? 'உதவி எண்' : 'Support Helpline',
        isTa
          ? 'எங்கள் உதவி எண்: +91 8144998877\nகாலை 9:00 - இரவு 8:00 வரை'
          : 'Helpline: +91 8144998877\n9:00 AM – 8:00 PM IST'
      );
    });
  };

  const navigateToOtp = () => {
    setQuickRegisterModalVisible(false);
    setResendTimer(27);
    setOtpDigits(['', '', '', '']);
    setStep('otp');
  };

  // 1-Click Quick Register Popup Handlers
  const handleQuickRegisterContinue = () => {
    const finalName = fullName.trim() || 'Mekha M';
    const finalPhone = phone.trim() || '6385901512';
    const finalEmail = email.trim() || 'mekha.m@gmail.com';
    const finalPassword = password || 'Manamaalai@2026';
    setFullName(finalName);
    setPhone(finalPhone);
    setEmail(finalEmail);
    setPassword(finalPassword);
    navigateToOtp();
  };

  const handleUseAnotherNumber = () => {
    setQuickRegisterModalVisible(false);
  };

  // Basic Details Get OTP Submission -> OTP Screen
  const handleGetOtp = () => {
    if (!fullName.trim()) {
      setFullName('Mekha M');
    }
    if (!phone || phone.trim().length < 10) {
      setPhone('6385901512');
    }
    if (!password || password.length < 8) {
      setPassword('Manamaalai@2026');
    }
    navigateToOtp();
  };

  // OTP Input & Navigation Handlers (Image 1 & Image 2)
  const handleOtpChange = (val: string, index: number) => {
    const clean = val.replace(/[^0-9]/g, '');
    const next = [...otpDigits];

    if (clean.length > 1) {
      for (let i = 0; i < 4; i++) {
        next[i] = clean[i] || '';
      }
      setOtpDigits(next);
      otpRefs[Math.min(clean.length, 3)].current?.focus();
      return;
    }

    next[index] = clean;
    setOtpDigits(next);

    if (clean && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    Alert.alert(
      isTa ? 'OTP அனுப்பப்பட்டது' : 'OTP Resent',
      isTa
        ? `புதிய 4 இலக்க OTP குறியீடு +91 ${displayPhone} எண்ணிற்கு அனுப்பப்பட்டுள்ளது.`
        : `A new 4-digit verification code has been sent to +91 ${displayPhone}.`
    );
  };

  const handleMissedCallVerification = () => {
    Alert.alert(
      isTa ? 'தவறிய அழைப்பு சரிபார்ப்பு' : 'Missed Call Verification',
      isTa
        ? `+91 ${displayPhone} எண்ணிற்கு சரிபார்ப்பு அழைப்பு விடுக்கப்படுகிறது...`
        : `Calling +91 ${displayPhone} to verify...`,
      [
        {
          text: isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified',
          onPress: () => {
            setOtpDigits(['1', '2', '3', '4']);
            setStep('account_exists');
          },
        },
      ]
    );
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join('');
    if (code.length < 4) {
      setOtpDigits(['1', '2', '3', '4']);
    }
    // After OTP verified, transition to "Account already exists" screen as requested
    setStep('account_exists');
  };

  const handleContinueCreatingAccount = () => {
    onContinueToWizard({
      createdFor: selectedFor,
      gender: undefined,
      name: fullName.trim() || 'Mekha M',
      dob: '',
      phone: phone.trim() || '6385901512',
      email: email.trim() || `${(phone.trim() || '6385901512')}@manamaalai.mock`,
      currentCity: city,
      password: password || 'Manamaalai@2026',
    });
  };

  // Helper for dynamic personalization labels
  const getPersonalizedLabel = (field: string) => {
    switch (selectedFor) {
      case 'self':
        return field === 'title'
          ? isTa ? 'உங்கள் விவரங்கள்' : 'Your Personal Details'
          : field === 'name'
          ? isTa ? 'உங்கள் முழுப் பெயர்' : 'Your Full Name'
          : isTa ? 'உங்கள் பிறந்த தேதி' : 'Your Date of Birth';
      case 'son':
        return field === 'title'
          ? isTa ? 'மகனின் விவரங்கள்' : "Son's Details"
          : field === 'name'
          ? isTa ? 'மகனின் முழுப் பெயர்' : "Son's Full Name"
          : isTa ? 'மகனின் பிறந்த தேதி' : "Son's Date of Birth";
      case 'daughter':
        return field === 'title'
          ? isTa ? 'மகளின் விவரங்கள்' : "Daughter's Details"
          : field === 'name'
          ? isTa ? 'மகளின் முழுப் பெயர்' : "Daughter's Full Name"
          : isTa ? 'மகளின் பிறந்த தேதி' : "Daughter's Date of Birth";
      case 'brother':
        return field === 'title'
          ? isTa ? 'சகோதரனின் விவரங்கள்' : "Brother's Details"
          : field === 'name'
          ? isTa ? 'சகோதரனின் முழுப் பெயர்' : "Brother's Full Name"
          : isTa ? 'சகோதரனின் பிறந்த தேதி' : "Brother's Date of Birth";
      case 'sister':
        return field === 'title'
          ? isTa ? 'சகோதரியின் விவரங்கள்' : "Sister's Details"
          : field === 'name'
          ? isTa ? 'சகோதரியின் முழுப் பெயர்' : "Sister's Full Name"
          : isTa ? 'சகோதரியின் பிறந்த தேதி' : "Sister's Date of Birth";
      case 'relative':
        return field === 'title'
          ? isTa ? 'உறவினரின் விவரங்கள்' : "Relative's Details"
          : field === 'name'
          ? isTa ? 'உறவினரின் முழுப் பெயர்' : "Relative's Full Name"
          : isTa ? 'உறவினரின் பிறந்த தேதி' : "Relative's Date of Birth";
      case 'friend':
        return field === 'title'
          ? isTa ? 'நண்பரின் விவரங்கள்' : "Friend's Details"
          : field === 'name'
          ? isTa ? 'நண்பரின் முழுப் பெயர்' : "Friend's Full Name"
          : isTa ? 'நண்பரின் பிறந்த தேதி' : "Friend's Date of Birth";
      default:
        return field === 'title'
          ? isTa ? 'வரன் விவரங்கள்' : "Candidate's Details"
          : field === 'name'
          ? isTa ? 'முழுப் பெயர்' : 'Full Name'
          : isTa ? 'பிறந்த தேதி' : 'Date of Birth';
    }
  };

  // Dynamic Mother Tongue labels based on selected relation (myself, son, daughter, etc.)
  const getMotherTongueLabel = () => {
    switch (selectedFor) {
      case 'son':
        return isTa ? 'உங்கள் மகனின் தாய்மொழி' : "Your son's mother tongue";
      case 'daughter':
        return isTa ? 'உங்கள் மகளின் தாய்மொழி' : "Your daughter's mother tongue";
      case 'brother':
        return isTa ? 'உங்கள் சகோதரனின் தாய்மொழி' : "Your brother's mother tongue";
      case 'sister':
        return isTa ? 'உங்கள் சகோதரியின் தாய்மொழி' : "Your sister's mother tongue";
      case 'relative':
        return isTa ? 'உங்கள் உறவினரின் தாய்மொழி' : "Your relative's mother tongue";
      case 'friend':
        return isTa ? 'உங்கள் நண்பரின் தாய்மொழி' : "Your friend's mother tongue";
      case 'self':
      default:
        return isTa ? 'உங்கள் தாய்மொழி' : 'Your mother tongue';
    }
  };

  const getSelectMotherTongueModalTitle = () => {
    switch (selectedFor) {
      case 'son':
        return isTa
          ? 'உங்கள் மகனின் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
          : "Select your son's mother tongue";
      case 'daughter':
        return isTa
          ? 'உங்கள் மகளின் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
          : "Select your daughter's mother tongue";
      case 'brother':
        return isTa
          ? 'உங்கள் சகோதரனின் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
          : "Select your brother's mother tongue";
      case 'sister':
        return isTa
          ? 'உங்கள் சகோதரியின் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
          : "Select your sister's mother tongue";
      case 'relative':
        return isTa
          ? 'உங்கள் உறவினரின் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
          : "Select your relative's mother tongue";
      case 'friend':
        return isTa
          ? 'உங்கள் நண்பரின் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
          : "Select your friend's mother tongue";
      case 'self':
      default:
        return isTa
          ? 'உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
          : 'Select your mother tongue';
    }
  };

  const PILL_WIDTH = (SCREEN_WIDTH - 32 - 16) / 3;

  const renderPill = (id: ProfileCreatedFor) => {
    const opt = ALL_PROFILE_OPTIONS.find(o => o.id === id);
    if (!opt) return null;
    const isSelected = selectedFor === id;

    return (
      <TouchableOpacity
        key={id}
        style={[
          styles.pillCard,
          { width: PILL_WIDTH },
          isSelected ? styles.pillCardSelected : styles.pillCardUnselected,
        ]}
        onPress={() => handleSelectOption(id)}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.pillRadioCircle,
            isSelected ? styles.pillRadioSelected : styles.pillRadioUnselected,
          ]}
        >
          {isSelected ? (
            <Text style={styles.pillCheckmark}>✓</Text>
          ) : null}
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.78}
          style={[
            styles.pillText,
            isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
            { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
          ]}
        >
          {isTa ? opt.labelTa : opt.labelEn}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* ============================================================ */}
      {/* 1. CLEAN ROYAL HEADER                                        */}
      {/* ============================================================ */}
      <View
        style={[
          styles.header,
          { paddingTop: topInset + 6 },
          (step === 'otp' || step === 'account_exists') && {
            borderBottomWidth: step === 'otp' ? 1 : 0,
            borderBottomColor: '#F3F4F6',
            backgroundColor: '#FFFFFF',
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              (step === 'otp' || step === 'account_exists') && styles.backBtnClean,
            ]}
            onPress={() => {
              if (step === 'account_exists') {
                setStep('otp');
              } else if (step === 'otp') {
                setStep('details');
              } else if (step === 'details') {
                setQuickRegisterModalVisible(false);
                setStep('select_for');
              } else {
                onBackPress();
              }
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Go back"
          >
            <Text
              style={[
                styles.backArrow,
                (step === 'otp' || step === 'account_exists') && { color: '#111827', fontSize: 24 },
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text
              style={[
                styles.headerTitle,
                step === 'otp' && { color: '#111827', fontSize: 18, fontWeight: '700' },
                { fontFamily: isTa ? Typography.fontNotoSerifTamil : Typography.fontCormorant },
              ]}
            >
              {step === 'select_for'
                ? t.createProfileHeader
                : step === 'details'
                ? t.basicDetailsHeader
                : step === 'otp'
                ? t.enterOtpHeader
                : ''}
            </Text>
            {step === 'select_for' && (
              <Text style={[styles.headerSubtitle, { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins }]}>
                {t.createProfileSubtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Language Switcher Pill (Bilingual) - Available on all screens */}
        <TouchableOpacity
          style={styles.langPillBtn}
          onPress={handleToggleLang}
          activeOpacity={0.8}
          accessibilityLabel="Select display language"
        >
          <Text style={styles.langPillText}>
            🌐 A / அ
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================ */}
      {/* STEP 1: INITIAL CREATE PROFILE SELECTION SCREEN               */}
      {/* ============================================================ */}
      {step === 'select_for' ? (
        <View style={styles.mainContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Heading */}
            <View style={styles.headingSection}>
              <Text style={[styles.headingTitle, { fontFamily: isTa ? Typography.fontNotoSerifTamil : Typography.fontCormorant }]}>
                {t.iAmCreatingProfileFor}
              </Text>
            </View>

            {/* 3-Column Profile Options Grid */}
            <View style={styles.pillsGrid}>
              {ROWS_PROFILE_OPTIONS.map((row, rowIdx) => (
                <View key={`row-${rowIdx}`} style={styles.pillRow}>
                  {row.map(id => renderPill(id))}
                </View>
              ))}
            </View>

            {/* Mother tongue selection appears right after when profile is selected */}
            {!!selectedFor && (
              <View style={styles.motherTongueSection}>
                <Text style={[styles.motherTongueTitle, { fontFamily: isTa ? Typography.fontNotoSerifTamil : Typography.fontCormorant }]}>
                  {t.motherTongueHeading}
                </Text>

                <TouchableOpacity
                  style={styles.motherTongueBox}
                  onPress={() => {
                    setLangSearch('');
                    setMotherTongueModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  {/* Floating notch label badge */}
                  <View style={styles.floatingNotchBadge}>
                    <Text style={styles.floatingNotchText}>{getMotherTongueLabel()}</Text>
                  </View>

                  <Text style={styles.motherTongueValue}>{motherTongue}</Text>
                  <Text style={styles.chevronDownIcon}>⌵</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom spacer so scroll doesn't hide behind bottom card */}
            <View style={{ height: 160 }} />
          </ScrollView>

          {/* ============================================================ */}
          {/* 3. BOTTOM REGISTRATION CTA & HELPLINE                        */}
          {/* ============================================================ */}
          <View
            style={[
              styles.bottomCardContainer,
              { paddingBottom: bottomInset + 8 },
            ]}
          >
            {/* Primary Matrimony CTA Button */}
            <TouchableOpacity
              style={styles.startRegBtn}
              onPress={handleStartRegistration}
              activeOpacity={0.88}
            >
              <Text style={[styles.startRegBtnText, { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins }]}>
                {t.startRegistrationBtn}
              </Text>
            </TouchableOpacity>

            {/* Helpline Call Row */}
            <TouchableOpacity
              style={styles.helplineRow}
              onPress={handleCallSupport}
              activeOpacity={0.7}
            >
              <Text style={[styles.helplineLabel, { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins }]}>
                {t.needHelpCall}
              </Text>
              <Text style={styles.helplinePhone}>  📞 +91 8144998877</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : step === 'details' ? (
        /* ============================================================ */
        /* STEP 2: BASIC DETAILS FORM (Image 1 of previous request)    */
        /* ============================================================ */
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.basicDetailsScroll,
              { paddingBottom: bottomInset + 32 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.basicDetailsForm}>
              {/* Field 1: Enter your name */}
              <View style={styles.inputOutlineBox}>
                <TextInput
                  style={[
                    styles.outlineTextInput,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                  placeholder={t.enterYourName}
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              {/* Field 2: Email */}
              <View style={styles.inputOutlineBox}>
                <TextInput
                  style={[
                    styles.outlineTextInput,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                  placeholder={t.emailField}
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Field 3: Create password */}
              <View>
                <View style={styles.inputOutlineBox}>
                  <TextInput
                    style={[
                      styles.outlineTextInput,
                      { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                    ]}
                    placeholder={t.createPassword}
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                  />
                </View>
                <Text
                  style={[
                    styles.inputHelperText,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                >
                  {t.passwordLengthHint}
                </Text>
              </View>

              {/* Field 4: Mobile Number with Country Code Pill */}
              <View>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryPillBox}>
                    <Text style={styles.countryFlag}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                    <Text style={styles.countryChevron}>⌵</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.phoneTextInput,
                      { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                    ]}
                    placeholder={t.enterMobileNumber}
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
                <Text
                  style={[
                    styles.inputHelperText,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                >
                  {t.otpWillBeSent}
                </Text>
              </View>

              {/* Get OTP Button in Manamaalai App Theme Colour */}
              <TouchableOpacity
                style={styles.getOtpBtn}
                onPress={handleGetOtp}
                activeOpacity={0.88}
              >
                <Text
                  style={[
                    styles.getOtpBtnText,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                >
                  {t.getOtp}
                </Text>
              </TouchableOpacity>

              {/* Terms & Conditions Consent */}
              <Text
                style={[
                  styles.termsConsentText,
                  { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                ]}
              >
                {t.byRegisteringAgree}
              </Text>

              {/* Dashed Divider Line */}
              <View style={styles.detailsDashedLine} />

              {/* Helpline Call Row */}
              <TouchableOpacity
                style={styles.detailsHelplineRow}
                onPress={handleCallSupport}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.detailsHelplineLabel,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                >
                  {t.needHelpCall}
                </Text>
                <Text style={styles.detailsHelplinePhone}>  📞 +91 8144998877</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : step === 'otp' ? (
        /* ============================================================ */
        /* STEP 3: ENTER OTP SCREEN (User Reference Image 1)            */
        /* ============================================================ */
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.otpScrollBody,
              { paddingBottom: bottomInset + 24 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Phone Illustration with verification bubble */}
            <View style={styles.otpIllustrationWrapper}>
              <View style={styles.otpIllustrationCircle}>
                <View style={styles.otpPhoneBody}>
                  <View style={styles.otpPhoneSpeaker} />
                  <View style={styles.otpSmsBubble}>
                    <View style={styles.otpBubbleDotsRow}>
                      <View style={styles.otpBubbleDot} />
                      <View style={styles.otpBubbleDot} />
                      <View style={styles.otpBubbleDot} />
                      <View style={styles.otpBubbleDot} />
                    </View>
                    <View style={styles.otpBubbleTail} />
                  </View>
                  <View style={styles.otpPhoneBtnPill}>
                    <Text style={styles.otpPhoneBtnArrow}>→</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Instruction Title with Dynamic Phone Number */}
            <Text
              style={[
                styles.otpInstructionText,
                { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
              ]}
            >
              {isTa
                ? `+91 ${displayPhone} ${t.enterOtpInstruction}`
                : `${t.enterOtpInstruction} +91\n${displayPhone}`}
            </Text>

            {/* 4-Digit Code Slots */}
            <View style={styles.otpInputsRow}>
              {[0, 1, 2, 3].map(idx => (
                <View key={`otp-${idx}`} style={styles.otpSlotWrapper}>
                  <TextInput
                    ref={otpRefs[idx]}
                    style={[
                      styles.otpDigitInput,
                      otpDigits[idx] ? styles.otpDigitFilled : null,
                      focusedOtpIndex === idx ? styles.otpDigitFocused : null,
                    ]}
                    value={otpDigits[idx]}
                    onChangeText={val => handleOtpChange(val, idx)}
                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, idx)}
                    onFocus={() => setFocusedOtpIndex(idx)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                  />
                  <View
                    style={[
                      styles.otpUnderline,
                      otpDigits[idx] || focusedOtpIndex === idx
                        ? styles.otpUnderlineActive
                        : styles.otpUnderlineInactive,
                    ]}
                  />
                </View>
              ))}
            </View>

            {/* Resend & Missed Call Row */}
            <View style={styles.otpActionsRow}>
              {/* Left Column: Didn't receive OTP? Resend OTP xx sec */}
              <View style={styles.otpActionCol}>
                <Text
                  style={[
                    styles.otpActionLabel,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                >
                  {t.didntReceiveOtp}
                </Text>
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={resendTimer > 0}
                  activeOpacity={0.7}
                  style={styles.otpResendBtnRow}
                >
                  <Text
                    style={[
                      styles.otpResendText,
                      resendTimer > 0 ? styles.otpResendTextDisabled : styles.otpResendTextActive,
                      { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                    ]}
                  >
                    {t.resendOtp}
                  </Text>
                  {resendTimer > 0 && (
                    <Text style={styles.otpTimerText}>{resendTimer} sec</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Right Column: Verify with Missed call */}
              <View style={[styles.otpActionCol, { alignItems: 'flex-end' }]}>
                <Text
                  style={[
                    styles.otpActionLabel,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                >
                  {t.verifyWith}
                </Text>
                <TouchableOpacity
                  onPress={handleMissedCallVerification}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.otpMissedCallText,
                      { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                    ]}
                  >
                    {t.missedCall}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Spacer */}
            <View style={{ height: 40 }} />

            {/* Submit Button in Manamaalai Theme Colour */}
            <TouchableOpacity
              style={styles.otpSubmitBtn}
              onPress={handleVerifyOtp}
              activeOpacity={0.88}
            >
              <Text
                style={[
                  styles.otpSubmitBtnText,
                  { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                ]}
              >
                {t.submitOtp}
              </Text>
            </TouchableOpacity>

            {/* Dashed Divider Line */}
            <View style={styles.detailsDashedLine} />

            {/* Helpline Call Row */}
            <TouchableOpacity
              style={styles.detailsHelplineRow}
              onPress={handleCallSupport}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.detailsHelplineLabel,
                  { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                ]}
              >
                {t.needHelpCall}
              </Text>
              <Text style={styles.detailsHelplinePhone}>  📞 +91 8144998877</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        /* ============================================================ */
        /* STEP 4: ACCOUNT ALREADY EXISTS (User Reference Image 2)      */
        /* ============================================================ */
        <View style={styles.accountExistsContainer}>
          <ScrollView
            contentContainerStyle={styles.accountExistsScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text
              style={[
                styles.accountExistsTitle,
                { fontFamily: isTa ? Typography.fontNotoSerifTamil : Typography.fontCormorant },
              ]}
            >
              {t.accountAlreadyExists}
            </Text>

            {/* Subtitle with bold phone number matching Image 2 */}
            <Text
              style={[
                styles.accountExistsSubtitle,
                { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
              ]}
            >
              {isTa ? (
                <>
                  இதே மொபைல் எண்{' '}
                  <Text style={styles.accountExistsPhoneBold}>
                    +91 {displayPhone}
                  </Text>
                  {' '}உடன் ஏற்கனவே ஒரு சுயவிவரம் பதிவு செய்யப்பட்டுள்ளது.
                </>
              ) : (
                <>
                  You already have a profile registered with same mobile number{' '}
                  <Text style={styles.accountExistsPhoneBold}>
                    +91 {displayPhone}
                  </Text>
                  .
                </>
              )}
            </Text>

            {/* Existing Profile Card (Image 2) */}
            <View style={styles.existingProfileCard}>
              {/* Circular Avatar Placeholder */}
              <View style={styles.existingAvatarBox}>
                <Text style={styles.existingAvatarText}>
                  {fullName.trim() ? fullName.trim()[0].toUpperCase() : 'M'}
                </Text>
              </View>

              {/* Profile Details Column */}
              <View style={styles.existingDetailsCol}>
                <Text
                  style={[
                    styles.existingProfileName,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                >
                  {fullName.trim() || 'Mekha M'}
                </Text>
                <Text style={styles.existingProfileId}>M12903144</Text>
                <TouchableOpacity
                  onPress={onLoginPress}
                  activeOpacity={0.7}
                  style={styles.loginProfileLinkRow}
                >
                  <Text
                    style={[
                      styles.loginProfileLinkText,
                      { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                    ]}
                  >
                    {t.loginToThisProfile}
                  </Text>
                  <Text style={styles.loginProfileLinkChevron}> ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Fixed CTA: Continue creating new account in Manamaalai Theme Colour */}
          <View
            style={[
              styles.accountExistsBottomContainer,
              { paddingBottom: bottomInset + 8 },
            ]}
          >
            <TouchableOpacity
              style={styles.continueCreatingBtn}
              onPress={handleContinueCreatingAccount}
              activeOpacity={0.88}
            >
              <Text
                style={[
                  styles.continueCreatingBtnText,
                  { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                ]}
              >
                {t.continueCreatingAccount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Support / Help Modal */}
      <Modal
        visible={supportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSupportModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {isTa ? 'உதவி & ஆதரவு மையம்' : 'Manamaalai Relationship Support'}
            </Text>
            <Text style={styles.modalBody}>
              {isTa
                ? 'எங்கள் தமிழ் திருமண ஆலோசகர்கள் உங்களுக்கு உதவ தயாராக உள்ளனர்.\n\n📞 இலவச அழைப்பு: 1800-425-2244\n📱 வாட்ஸ்அப்: +91 98401 98712\n✉️ மின்னஞ்சல்: support@manamaalai.com\n\nபணி நேரம்: காலை 9:00 - இரவு 8:00 (அனைத்து நாட்களும்)'
                : 'Our relationship executives are here to assist your matrimonial search.\n\n📞 Toll Free: 1800-425-2244\n📱 WhatsApp: +91 98401 98712\n✉️ Email: support@manamaalai.com\n\nOperating Hours: 9:00 AM – 8:00 PM IST (All 7 Days)'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSupportModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>
                {isTa ? 'சரி' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Language Selection Bottom Sheet Modal (Picture 1) */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.langModalOverlay}
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.langModalSheet} onStartShouldSetResponder={() => true}>
            {/* Modal Header */}
            <View style={styles.langModalHeader}>
              <Text style={styles.langModalTitle}>
                {isTa ? 'காட்சி மொழியைத் தேர்ந்தெடுக்கவும்' : 'Choose display language'}
              </Text>
              <TouchableOpacity
                onPress={() => setLangModalVisible(false)}
                style={styles.langModalCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.langModalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Language Options Cards Row */}
            <View style={styles.langCardsRow}>
              {/* English Card */}
              <TouchableOpacity
                style={[
                  styles.langOptionCard,
                  tempLang === 'en' ? styles.langOptionCardSelected : styles.langOptionCardUnselected,
                ]}
                onPress={() => setTempLang('en')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.langWatermark,
                    tempLang === 'en' ? styles.langWatermarkSelected : styles.langWatermarkUnselected,
                  ]}
                >
                  A
                </Text>

                <View style={styles.langCardContent}>
                  <View
                    style={[
                      styles.langRadioCircle,
                      tempLang === 'en' ? styles.langRadioCircleSelected : styles.langRadioCircleUnselected,
                    ]}
                  >
                    {tempLang === 'en' && <View style={styles.langRadioDot} />}
                  </View>
                  <View style={styles.langCardTextCol}>
                    <Text
                      style={[
                        styles.langCardTitle,
                        tempLang === 'en' ? styles.langCardTitleSelected : styles.langCardTitleUnselected,
                      ]}
                    >
                      English
                    </Text>
                    <Text style={styles.langCardSubtitle}>English</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Tamil Card */}
              <TouchableOpacity
                style={[
                  styles.langOptionCard,
                  tempLang === 'ta' ? styles.langOptionCardSelected : styles.langOptionCardUnselected,
                ]}
                onPress={() => setTempLang('ta')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.langWatermark,
                    tempLang === 'ta' ? styles.langWatermarkSelected : styles.langWatermarkUnselected,
                  ]}
                >
                  அ
                </Text>

                <View style={styles.langCardContent}>
                  <View
                    style={[
                      styles.langRadioCircle,
                      tempLang === 'ta' ? styles.langRadioCircleSelected : styles.langRadioCircleUnselected,
                    ]}
                  >
                    {tempLang === 'ta' && <View style={styles.langRadioDot} />}
                  </View>
                  <View style={styles.langCardTextCol}>
                    <Text
                      style={[
                        styles.langCardTitle,
                        tempLang === 'ta' ? styles.langCardTitleSelected : styles.langCardTitleUnselected,
                      ]}
                    >
                      தமிழ்
                    </Text>
                    <Text style={styles.langCardSubtitle}>Tamil</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              style={styles.langNextBtn}
              onPress={() => {
                setCurrentLang(tempLang);
                if (onToggleLanguage && tempLang !== language) {
                  onToggleLanguage();
                }
                setLangModalVisible(false);
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.langNextBtnText}>
                {tempLang === 'ta' ? 'அடுத்து' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ============================================================ */}
      {/* MOTHER TONGUE SEARCH & SELECTION MODAL                       */}
      {/* ============================================================ */}
      <Modal
        visible={motherTongueModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setMotherTongueModalVisible(false)}
      >
        <View style={[styles.langModalContainer, { paddingTop: topInset + 6, paddingBottom: bottomInset + 8 }]}>
          {/* Header with Back Arrow and Search Input */}
          <View style={styles.langModalHeaderRow}>
            <TouchableOpacity
              style={styles.langModalBackBtn}
              onPress={() => setMotherTongueModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Back"
            >
              <Text style={styles.langModalBackArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.langSearchBox}>
              <Text style={styles.langSearchIcon}>🔍</Text>
              <TextInput
                style={styles.langSearchInput}
                placeholder={t.searchMotherTongue}
                placeholderTextColor="#9CA3AF"
                value={langSearch}
                onChangeText={setLangSearch}
                autoFocus={false}
                clearButtonMode="while-editing"
              />
              {langSearch.length > 0 && (
                <TouchableOpacity
                  onPress={() => setLangSearch('')}
                  style={styles.langSearchClearBtn}
                >
                  <Text style={styles.langSearchClearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Subheading */}
          <View style={styles.langModalSubheadRow}>
            <Text style={styles.langModalSubheadText}>{getSelectMotherTongueModalTitle()}</Text>
          </View>

          {/* Scrollable Language List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.langListScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Frequently Selected Options */}
            {filteredFrequent.length > 0 && (
              <View style={styles.langGroupSection}>
                <Text style={styles.langGroupHeader}>{t.frequentlySelectedOptions}</Text>
                {filteredFrequent.map(item => {
                  const isSelected = motherTongue.toLowerCase() === item.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.langListRow,
                        isSelected && styles.langListRowSelected,
                      ]}
                      onPress={() => {
                        setMotherTongue(item);
                        setMotherTongueModalVisible(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.langListText,
                          isSelected && styles.langListTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* More Options */}
            {filteredMore.length > 0 && (
              <View style={styles.langGroupSection}>
                <Text style={styles.langGroupHeader}>{t.moreOptions}</Text>
                {filteredMore.map(item => {
                  const isSelected = motherTongue.toLowerCase() === item.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.langListRow,
                        isSelected && styles.langListRowSelected,
                      ]}
                      onPress={() => {
                        setMotherTongue(item);
                        setMotherTongueModalVisible(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.langListText,
                          isSelected && styles.langListTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* 1-SEC POPUP: QUICK REGISTER WITH MANAMAALAI APP MODAL (Img 2) */}
      {/* ============================================================ */}
      <Modal
        visible={quickRegisterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQuickRegisterModalVisible(false)}
      >
        <View style={styles.quickRegOverlay}>
          <TouchableOpacity
            style={styles.quickRegBackdrop}
            activeOpacity={1}
            onPress={() => setQuickRegisterModalVisible(false)}
          />
          <View
            style={[
              styles.quickRegSheet,
              { paddingBottom: Math.max(bottomInset + 16, 28) },
            ]}
          >
            {/* Header Row: Logo, Title/User info, Language button */}
            <View style={styles.quickRegHeaderRow}>
              <View style={styles.quickRegLogoBox}>
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.quickRegLogoImg}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.quickRegTitleCol}>
                <Text
                  style={[
                    styles.quickRegAppTitle,
                    { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                  ]}
                  numberOfLines={2}
                >
                  {t.registerWithApp}
                </Text>
                <Text style={styles.quickRegUserName}>
                  {fullName.trim() || 'Jawahar Kumar'}
                </Text>
                <Text style={styles.quickRegUserPhone}>
                  {phone.trim() || '9442616297'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.quickRegLangPill}
                onPress={handleToggleLang}
                activeOpacity={0.8}
              >
                <Text style={styles.quickRegLangText}>
                  {isTa ? '🌐 தமிழ்' : '🌐 EN'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Primary Action Button: CONTINUE in Manamaalai App Theme Colour */}
            <TouchableOpacity
              style={styles.quickRegContinueBtn}
              onPress={handleQuickRegisterContinue}
              activeOpacity={0.88}
            >
              <Text
                style={[
                  styles.quickRegContinueText,
                  { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                ]}
              >
                {t.quickRegContinue}
              </Text>
            </TouchableOpacity>

            {/* Secondary Action Button: USE ANOTHER MOBILE NUMBER */}
            <TouchableOpacity
              style={styles.quickRegUseAnotherBtn}
              onPress={handleUseAnotherNumber}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.quickRegUseAnotherText,
                  { fontFamily: isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins },
                ]}
              >
                {t.useAnotherNumber}
              </Text>
            </TouchableOpacity>

            {/* Footnote / Consent Notice with Underlined Links */}
            <View style={styles.quickRegConsentContainer}>
              <Text style={styles.quickRegConsentNotice}>
                {isTa ? (
                  <>
                    தொடர்வதன் மூலம் உங்கள்{' '}
                    <Text style={styles.quickRegNoticeLink}>சுயவிவரத் தகவலை</Text>{' '}
                    மணமாலை மேட்ரிமோனி செயலியில் பகிர்வதை ஏற்கிறீர்கள், மேலும்{' '}
                    <Text style={styles.quickRegNoticeLink}>தனியுரிமைக் கொள்கை</Text> மற்றும்{' '}
                    <Text style={styles.quickRegNoticeLink}>சேவை விதிமுறைகளை</Text>{' '}
                    ஒப்புக்கொள்கிறீர்கள்.
                  </>
                ) : (
                  <>
                    By continuing you accept to share your profile information with{' '}
                    Manamaalai Matrimony®- Marriage App, and agree to the{' '}
                    <Text style={styles.quickRegNoticeLink}>privacy policy</Text> and{' '}
                    <Text style={styles.quickRegNoticeLink}>terms of service</Text> of{' '}
                    Manamaalai Matrimony®- Marriage App.
                  </>
                )}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* 1. Header */
  header: {
    backgroundColor: '#FFFDF9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#D8C4AC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnClean: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    marginRight: 4,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4D0E13',
  },
  headerTitleCol: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4D0E13',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#8C7262',
    marginTop: 1,
  },
  langPillBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#B08A4F',
    backgroundColor: '#FAF5EE',
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4D0E13',
    letterSpacing: 0.3,
  },

  /* Main Container */
  mainContainer: {
    flex: 1,
    backgroundColor: '#FCFAF7',
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  /* Heading */
  headingSection: {
    marginTop: 6,
    marginBottom: 16,
  },
  headingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4D0E13',
    lineHeight: 26,
  },
  headingSubtitle: {
    fontSize: 12.5,
    color: '#7A6458',
    marginTop: 4,
    lineHeight: 18,
  },

  /* 3-Column Profile Pills Grid (Image 1) */
  pillsGrid: {
    width: '100%',
    marginBottom: 16,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  pillCard: {
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 1.2,
  },
  pillCardSelected: {
    backgroundColor: '#4D0E13',
    borderColor: '#4D0E13',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 3,
  },
  pillCardUnselected: {
    backgroundColor: '#FFFDF9',
    borderColor: '#D8C4AC',
  },
  pillRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  pillRadioSelected: {
    backgroundColor: '#FFFDF9',
  },
  pillRadioUnselected: {
    borderWidth: 1.3,
    borderColor: '#B08A4F',
    backgroundColor: 'transparent',
  },
  pillCheckmark: {
    fontSize: 12,
    fontWeight: '900',
    color: '#4D0E13',
    lineHeight: 14,
  },
  pillText: {
    fontSize: 13,
  },
  pillTextSelected: {
    fontWeight: '700',
    color: '#FFFDF9',
  },
  pillTextUnselected: {
    fontWeight: '600',
    color: '#2A1810',
  },

  /* Mother Tongue Section (Manamaalai Theme) */
  motherTongueSection: {
    marginTop: 14,
    marginBottom: 20,
  },
  motherTongueTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4D0E13',
    marginBottom: 14,
  },
  motherTongueBox: {
    height: 52,
    borderWidth: 1.3,
    borderColor: '#D8C4AC',
    borderRadius: 10,
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  floatingNotchBadge: {
    position: 'absolute',
    top: -9,
    left: 14,
    backgroundColor: '#FCFAF7',
    paddingHorizontal: 6,
  },
  floatingNotchText: {
    fontSize: 11.5,
    color: '#7A6458',
    fontWeight: '600',
  },
  motherTongueValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4D0E13',
  },
  chevronDownIcon: {
    fontSize: 18,
    color: '#4D0E13',
    fontWeight: '700',
  },

  /* Bottom Clean Registration Card (Manamaalai Theme) */
  bottomCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#EADBCE',
    paddingTop: 14,
    paddingHorizontal: 16,
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  startRegBtn: {
    height: 50,
    backgroundColor: '#4D0E13',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  startRegBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.3,
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  helplineLabel: {
    fontSize: 12,
    color: '#7A6458',
    fontWeight: '500',
  },
  helplinePhone: {
    fontSize: 12,
    color: '#B08A4F',
    fontWeight: '700',
  },

  /* Mother Tongue Modal (Manamaalai Theme) */
  langModalContainer: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  langModalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    gap: 10,
  },
  langModalBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#D8C4AC',
  },
  langModalBackArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4D0E13',
  },
  langSearchBox: {
    flex: 1,
    height: 42,
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8DBCB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  langSearchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  langSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#4D0E13',
    paddingVertical: 0,
  },
  langSearchClearBtn: {
    padding: 4,
  },
  langSearchClearText: {
    fontSize: 14,
    color: '#8C7262',
  },
  langModalSubheadRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E5D8',
    backgroundColor: '#FFFDF9',
  },
  langModalSubheadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4D0E13',
  },
  langListScrollContent: {
    paddingBottom: 40,
  },
  langGroupSection: {
    marginBottom: 10,
  },
  langGroupHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C7262',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FAF5EE',
  },
  langListRow: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EBE1',
    backgroundColor: '#FFFDF9',
  },
  langListRowSelected: {
    backgroundColor: '#F5E6DF',
  },
  langListText: {
    fontSize: 14.5,
    color: '#2A1810',
    fontWeight: '500',
  },
  langListTextSelected: {
    color: '#4D0E13',
    fontWeight: '700',
  },

  /* Language Selection Modal (Picture 1) */
  langModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  langModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  langModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  langModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  langModalCloseBtn: {
    padding: 4,
  },
  langModalCloseText: {
    fontSize: 18,
    color: '#4B5563',
    fontWeight: '600',
  },
  langCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  langOptionCard: {
    flex: 1,
    height: 76,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  langOptionCardSelected: {
    borderColor: '#00A86B', // Selected green accent from Picture 1
    backgroundColor: '#E8F6EF',
  },
  langOptionCardUnselected: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  langWatermark: {
    position: 'absolute',
    bottom: -6,
    right: 8,
    fontSize: 48,
    fontWeight: '800',
  },
  langWatermarkSelected: {
    color: 'rgba(0, 168, 107, 0.25)',
  },
  langWatermarkUnselected: {
    color: 'rgba(156, 163, 175, 0.2)',
  },
  langCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  langRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  langRadioCircleSelected: {
    borderWidth: 2,
    borderColor: '#00A86B',
  },
  langRadioCircleUnselected: {
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
  },
  langRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A86B',
  },
  langCardTextCol: {
    justifyContent: 'center',
  },
  langCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  langCardTitleSelected: {
    color: '#065F46',
  },
  langCardTitleUnselected: {
    color: '#111827',
  },
  langCardSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  langNextBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B141C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6B141C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  langNextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Details Step Styles */
  relationBadgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9EDEA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MatrimonyTheme.dustyPink,
    marginBottom: 14,
  },
  relationBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: MatrimonyTheme.burgundy,
  },
  changeRelationBtn: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: MatrimonyTheme.burgundy,
  },
  changeRelationText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: MatrimonyTheme.creme,
  },
  detailsFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MatrimonyTheme.sand,
    padding: 16,
    shadowColor: MatrimonyTheme.burgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: MatrimonyTheme.burgundy,
    marginBottom: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderCard: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: MatrimonyTheme.sand,
    backgroundColor: '#F8F3ED',
    alignItems: 'center',
  },
  genderCardActive: {
    backgroundColor: MatrimonyTheme.burgundy,
    borderColor: MatrimonyTheme.burgundy,
  },
  genderText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: MatrimonyTheme.textSecondary,
  },
  genderTextActive: {
    color: MatrimonyTheme.creme,
    fontWeight: '700',
  },
  textInput: {
    height: 48,
    backgroundColor: '#F8F3ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MatrimonyTheme.sand,
    paddingHorizontal: 12,
    fontSize: 14,
    color: MatrimonyTheme.burgundy,
    fontWeight: '500',
  },
  phoneInputRow: {
    flexDirection: 'row',
    height: 52,
    borderWidth: 1.2,
    borderColor: '#C7C2BA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 16,
  },
  countryCodeBox: {
    height: 48,
    backgroundColor: '#F8F3ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MatrimonyTheme.sand,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4D0E13',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: MatrimonyTheme.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: MatrimonyTheme.burgundy,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  termsText: {
    fontSize: 11.5,
    color: MatrimonyTheme.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  submitWizardBtn: {
    height: 50,
    backgroundColor: MatrimonyTheme.burgundy,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: MatrimonyTheme.burgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  submitWizardText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: MatrimonyTheme.creme,
  },
  submitWizardArrow: {
    fontSize: 15,
    color: MatrimonyTheme.creme,
    marginLeft: 6,
  },
  loginRedirectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  loginRedirectText: {
    fontSize: 13,
    color: MatrimonyTheme.textSecondary,
  },
  loginRedirectLink: {
    fontSize: 13,
    fontWeight: '700',
    color: MatrimonyTheme.burgundy,
    textDecorationLine: 'underline',
  },

  /* Support Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(77, 14, 19, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: MatrimonyTheme.creme,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: MatrimonyTheme.sand,
    padding: 20,
  },
  modalTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: 17,
    fontWeight: '700',
    color: MatrimonyTheme.burgundy,
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 13,
    color: MatrimonyTheme.textSecondary,
    lineHeight: 19,
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: MatrimonyTheme.burgundy,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: MatrimonyTheme.creme,
    fontWeight: '700',
    fontSize: 13.5,
  },

  /* Basic Details Screen (Image 1) */
  basicDetailsScroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  basicDetailsForm: {
    width: '100%',
  },
  inputOutlineBox: {
    height: 52,
    borderWidth: 1.2,
    borderColor: '#C7C2BA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  outlineTextInput: {
    fontSize: 15,
    color: '#1F2937',
    padding: 0,
  },
  inputHelperText: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: -10,
    marginBottom: 16,
    marginLeft: 4,
  },
  countryPillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 12,
    borderRightWidth: 1.2,
    borderRightColor: '#C7C2BA',
    gap: 4,
  },
  countryFlag: {
    fontSize: 16,
  },
  countryChevron: {
    fontSize: 11,
    color: '#4D0E13',
    fontWeight: '700',
    marginLeft: 2,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  getOtpBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4D0E13', // Manamaalai Royal Burgundy Theme
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  getOtpBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.3,
  },
  termsConsentText: {
    fontSize: 12,
    color: '#8C7262',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  detailsDashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#D8C4AC',
    borderStyle: 'dashed',
    marginVertical: 24,
  },
  detailsHelplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsHelplineLabel: {
    fontSize: 13.5,
    color: '#4B5563',
  },
  detailsHelplinePhone: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#4D0E13',
  },

  /* 1-Sec Quick Register Popup Bottom Sheet (Image 2) */
  quickRegOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  quickRegBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  quickRegSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  quickRegHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  quickRegLogoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8DED2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  quickRegLogoImg: {
    width: 42,
    height: 42,
  },
  quickRegTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  quickRegAppTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 20,
  },
  quickRegUserName: {
    fontSize: 13.5,
    color: '#4B5563',
    marginTop: 4,
    fontWeight: '500',
  },
  quickRegUserPhone: {
    fontSize: 13.5,
    color: '#4B5563',
    marginTop: 2,
    fontWeight: '500',
  },
  quickRegLangPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8C4AC',
    backgroundColor: '#FAF5EE',
    alignSelf: 'flex-start',
  },
  quickRegLangText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4D0E13',
  },
  quickRegContinueBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4D0E13', // Manamaalai Royal Burgundy Theme
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickRegContinueText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.5,
  },
  quickRegUseAnotherBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  quickRegUseAnotherText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4D0E13',
    letterSpacing: 0.3,
  },
  quickRegConsentContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  quickRegConsentNotice: {
    fontSize: 11.5,
    color: '#6B7280',
    lineHeight: 16,
  },
  quickRegNoticeLink: {
    color: '#1D4ED8',
    textDecorationLine: 'underline',
  },

  /* OTP Screen (Image 1) */
  otpScrollBody: {
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  otpIllustrationWrapper: {
    alignItems: 'center',
    marginVertical: 18,
  },
  otpIllustrationCircle: {
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 1.5,
    borderColor: '#4EAFA3', // Cyan/teal ring matching Image 1
    backgroundColor: '#F3FAF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpPhoneBody: {
    width: 68,
    height: 98,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    paddingTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  otpPhoneSpeaker: {
    width: 20,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  otpSmsBubble: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  otpBubbleDotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  otpBubbleDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#4B5563',
  },
  otpBubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#9CA3AF',
    marginTop: 1,
    alignSelf: 'center',
  },
  otpPhoneBtnPill: {
    marginTop: 10,
    width: 38,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#4D0E13', // Manamaalai Theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpPhoneBtnArrow: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  otpInstructionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
    marginBottom: 8,
  },
  otpSlotWrapper: {
    width: 52,
    alignItems: 'center',
  },
  otpDigitInput: {
    width: 52,
    height: 44,
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    padding: 0,
  },
  otpDigitFilled: {
    color: '#4D0E13',
  },
  otpDigitFocused: {
    color: '#4D0E13',
  },
  otpUnderline: {
    width: 48,
    height: 2,
    borderRadius: 1,
    marginTop: 4,
  },
  otpUnderlineActive: {
    backgroundColor: '#4D0E13',
  },
  otpUnderlineInactive: {
    backgroundColor: '#D1D5DB',
  },
  otpActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 12,
  },
  otpActionCol: {
    flex: 1,
  },
  otpActionLabel: {
    fontSize: 12.5,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  otpResendBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpResendText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  otpResendTextActive: {
    color: '#4D0E13',
  },
  otpResendTextDisabled: {
    color: '#B08A4F',
  },
  otpTimerText: {
    fontSize: 13.5,
    color: '#1F2937',
    marginLeft: 6,
  },
  otpMissedCallText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#B08A4F',
  },
  otpSubmitBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4D0E13', // Manamaalai Theme Colour
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  otpSubmitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.3,
  },

  /* Account Already Exists Screen (Image 2) */
  accountExistsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  accountExistsScroll: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 20,
  },
  accountExistsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  accountExistsSubtitle: {
    fontSize: 14.5,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  accountExistsPhoneBold: {
    fontWeight: '700',
    color: '#111827',
  },
  existingProfileCard: {
    marginTop: 32,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8CA93',
    backgroundColor: '#FFFDF9',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#B08A4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  existingAvatarBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF6E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  existingAvatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#B08A4F',
  },
  existingDetailsCol: {
    flex: 1,
  },
  existingProfileName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  existingProfileId: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  loginProfileLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  loginProfileLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B08A4F',
  },
  loginProfileLinkChevron: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B08A4F',
    marginLeft: 3,
  },
  accountExistsBottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  continueCreatingBtn: {
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: '#4D0E13', // Manamaalai Theme Colour
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  continueCreatingBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 20,
  },
});
