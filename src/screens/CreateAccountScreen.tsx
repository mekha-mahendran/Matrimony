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

  const handleSocialAuth = (provider: 'Apple' | 'Facebook') => {
    Alert.alert(
      `${provider} Sign Up`,
      isTa
        ? `${provider} மூலம் கணக்கு உருவாக்கப்படுகிறது...`
        : `Connecting with ${provider} to create your account...`,
      [
        {
          text: isTa ? 'சரி' : 'Continue',
          onPress: () => {
            onSignUpSuccess({
              name: name.trim() || 'John Doe',
              email: email.trim() || `user.${provider.toLowerCase()}@manamaalai.mock`,
              password: 'social_login_auth',
            });
          },
        },
      ]
    );
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
          {/* Header Title & Subtitle */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              {isTa ? 'கணக்கை உருவாக்கவும்' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'உங்கள் தகவலை கீழே உள்ளிடவும் அல்லது சமூக கணக்குடன் பதிவு செய்யவும்.'
                : 'Fill your information below or register\nwith your social account.'}
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

            {/* 6. Divider: Or sign up with */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>
                {isTa ? 'அல்லது பதிவு செய்யவும்' : 'Or sign up with'}
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 7. Social Circular Buttons (Apple, Google, Facebook) */}
            <View style={styles.socialRow}>
              {/* Apple */}
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialAuth('Apple')}
                activeOpacity={0.8}
              >
                <Svg width={22} height={24} viewBox="0 0 170 170" fill="none">
                  <Path
                    d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.43-6.42-9.79-11.43-20.73-15.04-32.84-3.61-12.1-5.42-23.75-5.42-34.93 0-14.79 3.65-27.13 10.96-37.03 7.3-9.9 16.48-14.99 27.54-15.28 5.48 0 11.45 1.55 17.89 4.66 6.44 3.1 10.42 4.71 11.96 4.81 1.94-.21 6.13-1.89 12.56-5.03 6.43-3.14 12.08-4.56 16.94-4.27 12.56.78 22.84 5.39 30.82 13.82-10.99 6.64-16.36 15.69-16.12 27.15.24 9.17 3.73 16.93 10.48 23.27 6.75 6.34 14.83 10.05 24.23 11.13-2.12 6.54-4.66 13.06-7.62 19.57zM119.22 33.58c0-7.36 2.66-14.28 7.97-20.76 5.31-6.48 11.83-10.75 19.57-12.82.88 7.22-1.42 14.21-6.9 20.97-5.48 6.76-12.36 11.12-20.64 12.61z"
                    fill="#000000"
                  />
                </Svg>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialAuth('Facebook')}
                activeOpacity={0.8}
              >
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* 8. Already have an account? Sign In Footer */}
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

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },

  /* Social Icons */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
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
