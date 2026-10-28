import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
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
import { CoupleMosaicHeader } from '../components/CoupleMosaicHeader';
import { ThoranamStrip } from '../components/ThoranamStrip';
import { Language, Translations } from '../localization';
import { AuthService } from '../services/authService';
import { StorageService } from '../services/storage';
import { MatrimonyTheme, Typography } from '../theme';

interface LoginScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onLoginSuccess: () => void;
  onRegisterPress: () => void;
  onBackPress?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onToggleLanguage,
  onLoginSuccess,
  onRegisterPress,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  // Language state synced with parent & storage
  const [currentLang, setCurrentLang] = useState<Language>(language);
  useEffect(() => {
    setCurrentLang(language);
  }, [language]);

  const isTa = currentLang === 'ta';
  const t = Translations[currentLang];

  const handleToggleLang = async () => {
    const nextLang: Language = currentLang === 'en' ? 'ta' : 'en';
    setCurrentLang(nextLang);
    await StorageService.setLanguage(nextLang);
    if (onToggleLanguage) {
      onToggleLanguage();
    }
  };

  // Login Modal / Sheet state
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'mobile'>('email');

  // Form Fields
  const [email, setEmail] = useState('karthik.senthil.iim@gmail.com');
  const [password, setPassword] = useState('Welcome@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [mobileNumber, setMobileNumber] = useState('9840198712');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Set Android status bar
  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#3A0A0E', true);
    }
  }, []);

  // Validation
  const validateEmailForm = (): boolean => {
    setValidationError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError(t.enterValidEmail);
      return false;
    }
    if (!password || password.length < 6) {
      setValidationError(t.enterValidPassword);
      return false;
    }
    return true;
  };

  const validateMobile = (): boolean => {
    setValidationError(null);
    const clean = mobileNumber.replace(/[^0-9]/g, '');
    if (!clean || clean.length !== 10) {
      setValidationError(t.enterValidMobile);
      return false;
    }
    return true;
  };

  const validateOtpForm = (): boolean => {
    if (!validateMobile()) return false;
    if (!otp.trim() || otp.trim().length !== 6) {
      setValidationError(t.enterValidOtp);
      return false;
    }
    return true;
  };

  // Auth Handlers
  const handleEmailLogin = async () => {
    if (!validateEmailForm()) return;
    setLoading(true);
    setValidationError(null);
    try {
      await AuthService.loginWithEmail(email.trim(), password);
      setLoginModalVisible(false);
      onLoginSuccess();
    } catch (err: any) {
      setValidationError(err?.message || (isTa ? 'உள்நுழைவு தோல்வியடைந்தது' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!validateMobile()) return;
    setLoading(true);
    setValidationError(null);
    try {
      const res = await AuthService.sendOtp(mobileNumber);
      setOtpSent(true);
      setOtp(res.demoOtp);
      setStatusMessage(t.otpSentSuccess);
    } catch (err: any) {
      setValidationError(err?.message || (isTa ? 'OTP அனுப்ப முடியவில்லை' : 'Failed to send OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtpForm()) return;
    setLoading(true);
    setValidationError(null);
    try {
      await AuthService.verifyOtp(mobileNumber, otp.trim());
      setLoginModalVisible(false);
      onLoginSuccess();
    } catch (err: any) {
      setValidationError(err?.message || (isTa ? 'தவறான OTP குறியீடு' : 'Invalid OTP code'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await AuthService.loginWithEmail('karthik.senthil.iim@gmail.com', 'GoogleAuthPass');
      setLoginModalVisible(false);
      onLoginSuccess();
    } catch (err: any) {
      setValidationError(err?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      t.forgotPassword,
      isTa
        ? 'உங்கள் பதிவு செய்யப்பட்ட மொபைல் அல்லது மின்னஞ்சலுக்கு கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்படும்.'
        : 'A password reset link will be sent to your registered email or phone.',
      [{ text: isTa ? 'சரி' : 'OK' }]
    );
  };

  const headingFont = isTa ? Typography.fontNotoSerifTamil : Typography.fontCormorant;
  const bodyFont = isTa ? Typography.fontNotoSansTamil : Typography.fontPoppins;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* TOP SECTION: Couple Mosaic with Curved Bottom Arc */}
        <View style={styles.heroWrapper}>
          <CoupleMosaicHeader height={SCREEN_HEIGHT * 0.42} />

          {/* Centered Circular MM Logo Medallion Overlapping the Curve */}
          <View style={styles.logoAnchor}>
            <View style={styles.logoFrame}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* BOTTOM SECTION: Content & Actions Card */}
        <View style={styles.contentCard}>
          {/* Brand Name */}
          <Text style={[styles.brandTitle, { fontFamily: headingFont }]}>
            {isTa ? 'மணமாலை மேட்ரிமோனி' : 'Manamaalai Matrimony'}
          </Text>

          {/* Subtitle / Tagline */}
          <Text style={[styles.brandTagline, { fontFamily: bodyFont }]}>
            {isTa
              ? 'தமிழர்களுக்கான நம்பகமான முதன்மை திருமண மேடை!'
              : 'The biggest and most trusted matrimony service for Tamils!'}
          </Text>

          {/* Gold Diamond Accents */}
          <View style={styles.diamondRow}>
            <Text style={styles.diamondSymbol}>◆</Text>
            <Text style={[styles.diamondSymbol, styles.diamondCenter]}>◆</Text>
            <Text style={styles.diamondSymbol}>◆</Text>
          </View>

          {/* Language Toggle Button Pill (TamilMatrimony Style) */}
          <TouchableOpacity
            style={styles.languagePillBtn}
            onPress={handleToggleLang}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Switch Language"
          >
            <Text style={[styles.languagePillText, { fontFamily: bodyFont }]}>
              {t.languageSwitchBtn}
            </Text>
          </TouchableOpacity>

          {/* New User Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.promptLabel, { fontFamily: bodyFont }]}>
              {t.newUser}
            </Text>

            {/* Solid Primary Button: Create Profile */}
            <TouchableOpacity
              style={styles.createProfileBtn}
              onPress={onRegisterPress}
              activeOpacity={0.88}
            >
              <Text style={[styles.createProfileBtnText, { fontFamily: bodyFont }]}>
                {t.createProfile}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider: ——— or ——— */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, { fontFamily: bodyFont }]}>
              {t.orText}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Already Registered Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.promptLabel, { fontFamily: bodyFont }]}>
              {t.alreadyRegistered}
            </Text>

            {/* Outlined Button: Login */}
            <TouchableOpacity
              style={styles.loginOutlineBtn}
              onPress={() => {
                setLoginModalVisible(true);
                setValidationError(null);
                setStatusMessage(null);
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.loginOutlineBtnText, { fontFamily: bodyFont }]}>
                {t.loginButton}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Trust Footer Note */}
          <View style={styles.footerNoteRow}>
            <Text style={styles.securityBadge}>🛡️ 100% Verified Profiles</Text>
            <Text style={styles.footerBullet}>•</Text>
            <Text style={styles.securityBadge}>🔒 100% Privacy Protected</Text>
          </View>
        </View>
      </ScrollView>

      {/* LOGIN MODAL / BOTTOM SHEET */}
      <Modal
        visible={loginModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.backdropDismiss}
            activeOpacity={1}
            onPress={() => setLoginModalVisible(false)}
          />

          <View style={styles.modalSheetContainer}>
            {/* Thoranam Strip along the top of Login Sheet */}
            <ThoranamStrip height={20} />

            <View style={styles.modalSheetContent}>
              {/* Modal Drag Handle & Close Row */}
              <View style={styles.modalHeaderRow}>
                <View style={styles.dragPill} />
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setLoginModalVisible(false)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.modalCloseIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sheetTitle, { fontFamily: headingFont }]}>
                {isTa ? 'மணமாலை உள்நுழைவு' : 'Login to Manamaalai'}
              </Text>

              {/* Tabs: Email / Mobile OTP */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'email' && styles.tabButtonActive]}
                  onPress={() => {
                    setActiveTab('email');
                    setValidationError(null);
                    setStatusMessage(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { fontFamily: bodyFont },
                      activeTab === 'email' && styles.tabTextActive,
                    ]}
                  >
                    {t.emailTab}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'mobile' && styles.tabButtonActive]}
                  onPress={() => {
                    setActiveTab('mobile');
                    setValidationError(null);
                    setStatusMessage(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { fontFamily: bodyFont },
                      activeTab === 'mobile' && styles.tabTextActive,
                    ]}
                  >
                    {t.mobileTab}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Status Banner */}
              {statusMessage ? (
                <View style={styles.statusBox}>
                  <Text style={[styles.statusText, { fontFamily: bodyFont }]}>
                    {statusMessage}
                  </Text>
                </View>
              ) : null}

              {/* Validation Error Banner */}
              {validationError ? (
                <View style={styles.errorBox}>
                  <Text style={[styles.errorText, { fontFamily: bodyFont }]}>
                    {validationError}
                  </Text>
                </View>
              ) : null}

              {/* Tab 1: Email Form */}
              {activeTab === 'email' ? (
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { fontFamily: bodyFont }]}>
                      {t.emailLabel}
                    </Text>
                    <TextInput
                      style={[styles.textInput, { fontFamily: bodyFont }]}
                      placeholder="name@example.com"
                      placeholderTextColor="#7D685E"
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        if (validationError) setValidationError(null);
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { fontFamily: bodyFont }]}>
                      {t.passwordLabel}
                    </Text>
                    <View style={styles.passwordWrapper}>
                      <TextInput
                        style={[styles.textInput, styles.passwordInput, { fontFamily: bodyFont }]}
                        placeholder="••••••••"
                        placeholderTextColor="#7D685E"
                        value={password}
                        onChangeText={(val) => {
                          setPassword(val);
                          if (validationError) setValidationError(null);
                        }}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowPassword(!showPassword)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.eyeBtnText, { fontFamily: bodyFont }]}>
                          {showPassword ? t.hide : t.show}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Remember Me & Forgot Password Row */}
                  <View style={styles.metaRow}>
                    <TouchableOpacity
                      style={styles.rememberRow}
                      onPress={() => setRememberMe(!rememberMe)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                        {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
                      </View>
                      <Text style={[styles.rememberText, { fontFamily: bodyFont }]}>
                        {t.rememberMe}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                      <Text style={[styles.forgotText, { fontFamily: bodyFont }]}>
                        {t.forgotPassword}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Primary Burgundy Submit Button */}
                  <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.btnDisabled]}
                    onPress={handleEmailLogin}
                    disabled={loading}
                    activeOpacity={0.88}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFDF9" size="small" />
                    ) : (
                      <Text style={[styles.submitBtnText, { fontFamily: bodyFont }]}>
                        {t.loginButton}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                /* Tab 2: Mobile OTP Form */
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { fontFamily: bodyFont }]}>
                      {t.phoneLabel}
                    </Text>
                    <View style={styles.phoneRow}>
                      <View style={styles.countryBadge}>
                        <Text style={styles.flagText}>🇮🇳</Text>
                        <Text style={[styles.countryCodeText, { fontFamily: bodyFont }]}>+91</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput, styles.phoneInput, { fontFamily: bodyFont }]}
                        placeholder={t.phonePlaceholder}
                        placeholderTextColor="#7D685E"
                        value={mobileNumber}
                        onChangeText={(val) => {
                          setMobileNumber(val.replace(/[^0-9]/g, ''));
                          if (validationError) setValidationError(null);
                        }}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>

                  {!otpSent ? (
                    <TouchableOpacity
                      style={[styles.submitBtn, loading && styles.btnDisabled]}
                      onPress={handleSendOtp}
                      disabled={loading}
                      activeOpacity={0.88}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFDF9" size="small" />
                      ) : (
                        <Text style={[styles.submitBtnText, { fontFamily: bodyFont }]}>
                          {t.sendOtp}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <View style={styles.inputGroup}>
                        <View style={styles.otpHeader}>
                          <Text style={[styles.inputLabel, { fontFamily: bodyFont }]}>
                            {t.otpLabel}
                          </Text>
                          <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                            <Text style={[styles.resendLink, { fontFamily: bodyFont }]}>
                              {isTa ? 'மீண்டும் அனுப்பு' : 'Resend'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TextInput
                          style={[styles.textInput, styles.otpInputBox, { fontFamily: bodyFont }]}
                          placeholder="123456"
                          placeholderTextColor="#7D685E"
                          value={otp}
                          onChangeText={(val) => {
                            setOtp(val.replace(/[^0-9]/g, ''));
                            if (validationError) setValidationError(null);
                          }}
                          keyboardType="number-pad"
                          maxLength={6}
                        />
                        <Text style={[styles.otpHint, { fontFamily: bodyFont }]}>
                          {t.otpDemoHint}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[styles.submitBtn, loading && styles.btnDisabled]}
                        onPress={handleVerifyOtp}
                        disabled={loading}
                        activeOpacity={0.88}
                      >
                        {loading ? (
                          <ActivityIndicator color="#FFFDF9" size="small" />
                        ) : (
                          <Text style={[styles.submitBtnText, { fontFamily: bodyFont }]}>
                            {t.verifyOtp}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Continue with Google */}
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <View style={styles.googleBadge}>
                  <Text style={styles.googleLetter}>G</Text>
                </View>
                <Text style={[styles.googleBtnText, { fontFamily: bodyFont }]}>
                  {t.continueWithGoogle}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFDF9', // Ivory ground
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  // Top Hero & Logo Anchor
  heroWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  logoAnchor: {
    position: 'absolute',
    bottom: -44, // Half of 88px logo frame
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFrame: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#B08A4F', // Antique Gold
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  // Content Card
  contentCard: {
    paddingTop: 54, // Clear the 44px overlapping logo
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#4D0E13', // Burgundy
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
  brandTagline: {
    fontSize: 13.5,
    color: '#6E5A50',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  diamondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  diamondSymbol: {
    fontSize: 9,
    color: '#B08A4F',
    opacity: 0.7,
  },
  diamondCenter: {
    fontSize: 12,
    marginHorizontal: 8,
    opacity: 1,
  },
  // Language Switcher Pill (TamilMatrimony Style)
  languagePillBtn: {
    borderColor: '#D8C4AC',
    borderWidth: 1.2,
    backgroundColor: '#F7F2EC',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 18,
    marginBottom: 26,
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  languagePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4D0E13',
    letterSpacing: 0.3,
  },
  // Section Containers
  sectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1E1D',
    marginBottom: 10,
    textAlign: 'center',
  },
  // Create Profile Primary Button
  createProfileBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#4D0E13', // Burgundy
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
    borderColor: '#B08A4F',
    borderWidth: 0.5,
  },
  createProfileBtnText: {
    color: '#FFFDF9',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Divider: ——— or ———
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8C4AC',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: '#7D685E',
    fontWeight: '500',
  },
  // Login Outlined Button
  loginOutlineBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderColor: '#4D0E13', // Burgundy border
    borderWidth: 1.5,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  loginOutlineBtnText: {
    color: '#4D0E13',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Trust Footer
  footerNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 8,
  },
  securityBadge: {
    fontSize: 11.5,
    color: '#7D685E',
    fontWeight: '500',
  },
  footerBullet: {
    fontSize: 12,
    color: '#B08A4F',
  },
  // Modal / Bottom Sheet
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  modalSheetContainer: {
    width: '100%',
    backgroundColor: '#FFFDF9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalSheetContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dragPill: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8C4AC',
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalCloseBtn: {
    padding: 6,
    backgroundColor: '#F5ECE3',
    borderRadius: 14,
    marginLeft: -26,
  },
  modalCloseIcon: {
    fontSize: 12,
    color: '#4D0E13',
    fontWeight: 'bold',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4D0E13',
    textAlign: 'center',
    marginBottom: 16,
  },
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5ECE3',
    borderColor: 'rgba(216, 196, 172, 0.6)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 3,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFDF9',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: '#7D685E',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4D0E13',
    fontWeight: '700',
  },
  // Feedback Messages
  statusBox: {
    backgroundColor: '#FAF6F0',
    borderColor: '#B08A4F',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  statusText: {
    color: '#4D0E13',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#C8A49F',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#4D0E13',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Form Inputs
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4D0E13',
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    backgroundColor: '#F7F1EA',
    borderColor: '#D8C4AC',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#4D0E13',
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 64,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  eyeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B08A4F',
  },
  // Meta Row
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#B08A4F',
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#4D0E13',
    borderColor: '#4D0E13',
  },
  checkmark: {
    color: '#FFFDF9',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: -2,
  },
  rememberText: {
    fontSize: 12,
    color: '#6E5A50',
  },
  forgotText: {
    fontSize: 12,
    color: '#4D0E13',
    fontWeight: '600',
  },
  submitBtn: {
    height: 50,
    backgroundColor: '#4D0E13',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  submitBtnText: {
    color: '#FFFDF9',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  // Phone Row
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryBadge: {
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: '#F5ECE3',
    borderColor: '#D8C4AC',
    borderWidth: 1,
    borderRadius: 14,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 16,
    marginRight: 4,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4D0E13',
  },
  phoneInput: {
    flex: 1,
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  resendLink: {
    fontSize: 12,
    color: '#B08A4F',
    fontWeight: '600',
    marginBottom: 6,
  },
  otpInputBox: {
    textAlign: 'center',
    letterSpacing: 6,
    fontSize: 18,
    fontWeight: '700',
  },
  otpHint: {
    fontSize: 11,
    color: '#7D685E',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Google Button
  googleBtn: {
    height: 48,
    borderColor: '#D8C4AC',
    borderWidth: 1.2,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF9',
    marginTop: 12,
  },
  googleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4D0E13',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleLetter: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: 'bold',
  },
  googleBtnText: {
    color: '#4D0E13',
    fontSize: 13.5,
    fontWeight: '600',
  },
});
