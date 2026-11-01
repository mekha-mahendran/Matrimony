import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import Svg, { Circle, Path } from 'react-native-svg';
import { Language } from '../localization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

interface NewPasswordScreenProps {
  language?: Language;
  onPasswordResetSuccess: () => void;
  onBackPress: () => void;
}

export const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({
  language = 'en',
  onPasswordResetSuccess,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states matching screenshot
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleCreateNewPassword = () => {
    setValidationError(null);

    if (!password || password.length < 6) {
      setValidationError(
        isTa
          ? 'புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationError(
        isTa
          ? 'கடவுச்சொற்கள் பொருந்தவில்லை'
          : 'Passwords do not match'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);

      // Auto redirect to Sign In page after 1.8 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        onPasswordResetSuccess();
      }, 1800);
    }, 400);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Row with Circular Back Button */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 10, 20) }]}>
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
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Area */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>
              {isTa ? 'புதிய கடவுச்சொல்' : 'New Password'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'உங்கள் புதிய கடவுச்சொல் முந்தைய கடவுச்சொற்களிலிருந்து\nமாறுபட்டிருக்க வேண்டும்.'
                : 'Your new password must be different\nfrom previously used passwords.'}
            </Text>
          </View>

          {/* Validation Error Banner */}
          {validationError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* 1. Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {isTa ? 'கடவுச்சொல்' : 'Password'}
              </Text>
              <View style={[styles.inputBox, styles.passwordBox]}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="••••••••••••••••"
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

            {/* 2. Confirm Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {isTa ? 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm Password'}
              </Text>
              <View style={[styles.inputBox, styles.passwordBox]}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="••••••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={val => {
                    setConfirmPassword(val);
                    if (validationError) setValidationError(null);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  {showConfirmPassword ? (
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

            {/* 3. Primary Purple Button: Create New Password */}
            <TouchableOpacity
              style={[styles.createBtn, loading && styles.btnDisabled]}
              onPress={handleCreateNewPassword}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.createBtnText}>
                  {isTa ? 'புதிய கடவுச்சொல்லை உருவாக்கு' : 'Create New Password'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Pop up message called "New password created" */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          onPasswordResetSuccess();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Green Check Icon Badge */}
            <View style={styles.successBadge}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3}>
                <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>

            {/* Popup Title: "New password created" */}
            <Text style={styles.modalTitle}>
              {isTa ? 'புதிய கடவுச்சொல் உருவாக்கப்பட்டது' : 'New password created'}
            </Text>

            <Text style={styles.modalSubtitle}>
              {isTa
                ? 'உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது.\nஉள்நுழைவுப் பக்கத்திற்கு செல்கிறீர்கள்...'
                : 'Your password has been changed successfully.\nRedirecting to sign in page...'}
            </Text>

            <TouchableOpacity
              style={styles.modalRedirectBtn}
              onPress={() => {
                setShowSuccessModal(false);
                onPasswordResetSuccess();
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.modalRedirectBtnText}>
                {isTa ? 'உள்நுழையவும்' : 'Go to Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
  },

  /* Header */
  headerArea: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  /* Error Banner */
  errorBox: {
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

  /* Primary Button */
  createBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: BRAND_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* Pop up message styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  successBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10B981', // Emerald green success
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 26,
  },
  modalRedirectBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: BRAND_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  modalRedirectBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

