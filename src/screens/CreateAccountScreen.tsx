import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import Svg, { Circle, Path } from 'react-native-svg';
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import { LanguageToggle } from '../components/LanguageToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Vibrant royal purple matching the design system
const BRAND_PURPLE = '#6D53F5';
const BRAND_PURPLE_DARK = '#533CE0';

interface CreateAccountScreenProps {
  language?: Language;
  onToggleLanguage?: () => void;
  onSignUpSuccess: (userData: { name: string; email: string; password: string }) => void;
  onLoginPress: () => void;
  onBackPress?: () => void;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  language = 'en',
  onToggleLanguage,
  onSignUpSuccess,
  onLoginPress,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states matching screenshot defaults
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('example@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate form fields
  const handleSignUp = async () => {
    setValidationError(null);

    if (!name.trim()) {
      setValidationError(isTa ? 'உங்கள் பெயரை உள்ளிடவும்' : 'Please enter your name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError(isTa ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setValidationError(isTa ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்' : 'Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      setValidationError(isTa ? 'விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கவும்' : 'Please agree with Terms & Condition');
      return;
    }

    try {
      setLoading(true);
      // Persist user info
      await StorageService.updateCurrentUser({
        email: email.trim(),
      });

      onSignUpSuccess({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch (e: any) {
      setValidationError(e?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 20, 44),
              paddingBottom: Math.max(insets.bottom + 24, 36),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Bar with Back and Language Switcher */}
          <View style={styles.topBarRow}>
            {onBackPress ? (
              <TouchableOpacity onPress={onBackPress} style={styles.backCircleBtn}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth={2}>
                  <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
            {onToggleLanguage ? (
              <LanguageToggle language={language} onToggle={onToggleLanguage} size="small" />
            ) : null}
          </View>

          {/* Header Title & Subtitle */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              {isTa ? 'கணக்கை உருவாக்கவும்' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'கணக்கை உருவாக்க உங்கள் தகவல்களை கீழே உள்ளிடவும்.'
                : 'Fill your information below to create your account.'}
            </Text>
          </View>

          {/* Validation Error Banner */}
          {validationError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* 1. Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isTa ? 'பெயர்' : 'Name'}</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={val => {
                    setName(val);
                    if (validationError) setValidationError(null);
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* 2. Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isTa ? 'மின்னஞ்சல்' : 'Email'}</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={val => {
                    setEmail(val);
                    if (validationError) setValidationError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* 3. Password Input with Show/Hide Toggle */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isTa ? 'கடவுச்சொல்' : 'Password'}</Text>
              <View style={[styles.inputBox, styles.passwordBox]}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={val => {
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
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  {showPassword ? (
                    /* Eye Open Icon */
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke="#1F2937"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#1F2937"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  ) : (
                    /* Eye Slash Icon (Matches Reference Screenshot) */
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                        stroke="#1F2937"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* 4. Agree with Terms & Condition Checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                {isTa ? 'ஒப்புக்கொள்கிறேன் ' : 'Agree with '}
                <Text
                  style={styles.termsLink}
                  onPress={() => {
                    Alert.alert(
                      isTa ? 'விதிமுறைகள்' : 'Terms & Condition',
                      isTa
                        ? 'மணமாலை மேட்ரிமோனியின் பாதுகாப்பான சேவை விதிமுறைகள்.'
                        : 'By registering, you agree to our Terms & Condition and Privacy Policy.'
                    );
                  }}
                >
                  {isTa ? 'விதிமுறைகள் & நிபந்தனைகள்' : 'Terms & Condition'}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* 5. Sign Up Primary Purple Button */}
            <TouchableOpacity
              style={[styles.signUpBtn, loading && styles.btnDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.signUpBtnText}>
                  {isTa ? 'பதிவு செய்யவும்' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            {/* 6. Already have an account? Sign In Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                {isTa ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already have an account? '}
              </Text>
              <TouchableOpacity
                onPress={onLoginPress}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.signInLink}>
                  {isTa ? 'உள்நுழையவும்' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  /* Header */
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  /* Error Banner */
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },

  /* Form */
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
  },
  textInput: {
    fontSize: 15,
    color: '#111827',
    height: '100%',
    padding: 0,
  },
  passwordInput: {
    flex: 1,
  },
  eyeBtn: {
    padding: 4,
  },

  /* Terms Checkbox */
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: BRAND_PURPLE,
    borderColor: BRAND_PURPLE,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 15,
  },
  termsText: {
    fontSize: 13.5,
    color: '#374151',
    fontWeight: '500',
  },
  termsLink: {
    color: BRAND_PURPLE,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  /* Primary Button */
  signUpBtn: {
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
  btnDisabled: {
    opacity: 0.65,
  },
  signUpBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* Footer */
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_PURPLE,
    textDecorationLine: 'underline',
  },
});
