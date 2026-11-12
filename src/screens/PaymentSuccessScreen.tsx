/**
 * Manamaalai Matrimony — Complete Payment / Success Screen
 *
 * Implements the exact design from the reference screenshot:
 * - Header: Circular white back button (←)
 * - Center Success Content:
 *     - Royal Purple circle with bold white checkmark (✓)
 *     - Bold title: "Congratulations!"
 *     - Subtitle:
 *         "You have successfully described yearly plan.
 *          You can download your E-Receipt Now."
 * - Bottom Bar:
 *     - Full-width royal purple button: "View E-Receipt" -> opens EReceiptScreen
 *     - Secondary text button: "Go to Home" -> returns to Home
 */

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Language } from '../localization';
import { EReceiptScreen } from './EReceiptScreen';

const BRAND_PURPLE = '#6D53F5';

interface PaymentSuccessScreenProps {
  language?: Language;
  planName?: string;
  planPrice?: string;
  paymentMethod?: string;
  onGoHome: () => void;
  onBack?: () => void;
}

export const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  language,
  planName = 'Yearly',
  planPrice = '$69.99',
  paymentMethod = 'Paypal',
  onGoHome,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [showEReceipt, setShowEReceipt] = useState(false);

  // If user tapped "View E-Receipt", show the EReceiptScreen
  if (showEReceipt) {
    return (
      <EReceiptScreen
        language={language}
        onBack={() => setShowEReceipt(false)}
        planName="Yearly"
        purchaseDate="August 24, 2023 | 10:00 AM"
        expiryDate="August 24, 2024 | 10:00 AM"
        amount="$69.99.00"
        tax="$12.00"
        total="$81.99.00"
        userName="John Doe"
        phone="+1 (208) 555-0112"
        paymentMode={paymentMethod || 'Paypal'}
        transactionId="#RE2564HG23"
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Header (Circular Back Button) ─────────────────────────────── */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={onBack || onGoHome}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.4}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <View style={{ width: 44 }} />
      </View>

      {/* ─── 2. Center Success Content ────────────────────────────────────── */}
      <View style={styles.centerContent}>
        {/* Large Purple Checkmark Circle */}
        <View style={styles.checkCircle}>
          <Svg width={52} height={52} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17l-5-5"
              stroke="#FFFFFF"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {isTa ? 'வாழ்த்துக்கள்!' : 'Congratulations!'}
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {isTa
            ? 'வருடாந்திர திட்டம் வெற்றிகரமாக செயல்படுத்தப்பட்டது.\nஉங்கள் மின்-ரசீதை இப்போது பதிவிறக்கம் செய்யலாம்.'
            : 'You have successfully described yearly plan.\nYou can download your E-Receipt Now.'}
        </Text>
      </View>

      {/* ─── 3. Bottom Fixed Container ───────────────────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 12, 20) }]}>
        {/* Primary Action Button: View E-Receipt */}
        <TouchableOpacity
          style={styles.viewReceiptBtn}
          onPress={() => setShowEReceipt(true)}
          activeOpacity={0.88}
        >
          <Text style={styles.viewReceiptBtnText}>
            {isTa ? 'மின்-ரசீதைப் பார்க்கவும்' : 'View E-Receipt'}
          </Text>
        </TouchableOpacity>

        {/* Secondary Text Button: Go to Home */}
        <TouchableOpacity
          style={styles.goHomeBtn}
          onPress={onGoHome}
          activeOpacity={0.7}
        >
          <Text style={styles.goHomeBtnText}>
            {isTa ? 'முகப்புக்குச் செல்லவும்' : 'Go to Home'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  /* Center Content */
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: -60,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181D',
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  /* Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    paddingHorizontal: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  viewReceiptBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
  },
  viewReceiptBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  goHomeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  goHomeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_PURPLE,
  },
});
