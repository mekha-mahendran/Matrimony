import React, { useEffect, useRef, useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import { Language } from '../localization';
import { LanguageToggle } from '../components/LanguageToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

interface VerifyCodeScreenProps {
  language?: Language;
  onToggleLanguage?: () => void;
  email?: string;
  onVerifySuccess: () => void;
  onBackPress: () => void;
}

export const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({
  language = 'en',
  onToggleLanguage,
  email = 'example@email.com',
  onVerifySuccess,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // 4 OTP digits state initialized matching user reference screenshot ('2', '8', '', '')
  const [otp, setOtp] = useState<string[]>(['2', '8', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References for inputs
  const inputRefs: any[] = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  // Resend countdown timer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (val: string, index: number) => {
    const clean = val.replace(/[^0-9]/g, '');
    const nextOtp = [...otp];

    if (clean.length > 0) {
      // If user pasted or typed multiple digits
      if (clean.length > 1) {
        for (let i = 0; i < 4; i++) {
          nextOtp[i] = clean[i] || '';
        }
        setOtp(nextOtp);
        inputRefs[Math.min(clean.length, 3)].current?.focus();
        return;
      }

      nextOtp[index] = clean[0];
      setOtp(nextOtp);
      setErrorMessage(null);

      // Auto-advance to next input
      if (index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    } else {
      // Deleting
      nextOtp[index] = '';
      setOtp(nextOtp);
      setErrorMessage(null);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = otp.join('');
    if (fullCode.length < 4) {
      setErrorMessage(
        isTa
          ? '4 இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்'
          : 'Please enter the full 4-digit code'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerifySuccess();
    }, 600);
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setErrorMessage(null);
    inputRefs[0].current?.focus();
    Alert.alert(
      isTa ? 'OTP அனுப்பப்பட்டது' : 'Code Resent',
      isTa
        ? `சரிபார்ப்புக் குறியீடு ${email} முகவரிக்கு மீண்டும் அனுப்பப்பட்டது.`
        : `A fresh verification code has been sent to ${email}.`
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Row with Circular Back Button & Language Toggle */}
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
        {onToggleLanguage ? (
          <LanguageToggle language={language} onToggle={onToggleLanguage} size="small" />
        ) : null}
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
          {/* Title & Email Subtitle */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>
              {isTa ? 'குறியீட்டை சரிபார்க்கவும்' : 'Verify Code'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட குறியீட்டை உள்ளிடவும்\n'
                : 'Please enter the code we just sent to email\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 4 OTP Digit Boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, idx) => {
              const isFilled = !!digit;
              return (
                <View key={idx} style={[styles.digitBox, isFilled && styles.digitBoxFilled]}>
                  <TextInput
                    ref={inputRefs[idx]}
                    style={styles.digitInput}
                    value={digit}
                    placeholder="-"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={val => handleDigitChange(val, idx)}
                    onKeyPress={e => handleKeyPress(e, idx)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textAlign="center"
                  />
                </View>
              );
            })}
          </View>

          {/* Resend Section */}
          <View style={styles.resendArea}>
            <Text style={styles.resendPrompt}>
              {isTa ? 'OTP வரவில்லையா? ' : "Didn't receive OTP? "}
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              activeOpacity={0.7}
              disabled={!canResend}
            >
              <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
                {isTa ? 'குறியீட்டை மீண்டும் அனுப்பு' : 'Resend code'}
                {!canResend ? ` (${timer}s)` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Primary Purple Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.btnDisabled]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>
                {isTa ? 'சரிபார்க்கவும்' : 'Verify'}
              </Text>
            )}
          </TouchableOpacity>
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
  topBar: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
  },
  emailHighlight: {
    color: BRAND_PURPLE,
    fontWeight: '600',
  },

  /* Error */
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignSelf: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },

  /* 4 OTP Boxes */
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
  },
  digitBox: {
    width: 62,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitBoxFilled: {
    backgroundColor: '#F4F6F9',
  },
  digitInput: {
    width: '100%',
    height: '100%',
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    padding: 0,
  },

  /* Resend Link */
  resendArea: {
    alignItems: 'center',
    marginBottom: 36,
  },
  resendPrompt: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    color: '#9CA3AF',
  },

  /* Verify Button */
  verifyButton: {
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
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
