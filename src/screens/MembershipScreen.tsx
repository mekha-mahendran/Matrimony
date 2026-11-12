/**
 * Manamaalai Matrimony — Modern Payment Methods Screen
 *
 * Implements the exact design from the reference screenshot:
 * - Header: Clean white background with circular back button (←) and centered title "Payment Methods"
 * - Section 1: "Credit & Debit Card"
 *     - White card row with purple credit card icon, "Add Card" label, and purple right chevron (>)
 *     - Tapping "Add Card" opens the dedicated AddCardScreen
 * - Section 2: "More Payment Options"
 *     - White grouped container with 3 options:
 *         1. Paypal (Official Paypal icon + radio button)
 *         2. Apple Pay (Official Apple icon + radio button)
 *         3. Google Pay (Official Google multicolor icon + radio button)
 * - Bottom Bar:
 *     - Fixed white card container with rounded top borders
 *     - Full-width royal purple button: "Confirm Payment"
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';
import { StorageService } from '../services/storage';
import { AddCardScreen, CardDetails } from './AddCardScreen';
import { PaymentSuccessScreen } from './PaymentSuccessScreen';

const BRAND_PURPLE = '#6D53F5';

type PaymentMethodType = 'card' | 'paypal' | 'apple_pay' | 'google_pay';

interface SavedCard {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  last4: string;
}

interface MembershipScreenProps {
  language: Language;
  onBack: () => void;
}

export const MembershipScreen: React.FC<MembershipScreenProps> = ({
  language,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [viewMode, setViewMode] = useState<'methods' | 'add_card' | 'success'>('methods');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('paypal');
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveCardFromScreen = (card: CardDetails) => {
    const cleanNum = card.cardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4);
    setSavedCard({
      cardNumber: cleanNum,
      cardholderName: card.cardHolder,
      expiry: card.expiry,
      last4,
    });
    setSelectedMethod('card');
    setViewMode('methods');
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate secure processing
      await new Promise(resolve => setTimeout(() => resolve(null), 1000));

      // Upgrade membership in storage
      await StorageService.upgradeMembership('gold');

      // Navigate to Congratulations / Complete Payment Screen
      setViewMode('success');
    } catch {
      Alert.alert('Error', 'Unable to complete transaction. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If payment succeeded, render the Congratulations complete screen
  if (viewMode === 'success') {
    let methodLabel = 'PayPal';
    if (selectedMethod === 'card') {
      methodLabel = savedCard ? `Card ending in ${savedCard.last4}` : 'Credit Card';
    } else if (selectedMethod === 'apple_pay') {
      methodLabel = 'Apple Pay';
    } else if (selectedMethod === 'google_pay') {
      methodLabel = 'Google Pay';
    }

    return (
      <PaymentSuccessScreen
        language={language}
        planName="Yearly Plan"
        planPrice="$69.99"
        paymentMethod={methodLabel}
        onGoHome={onBack}
        onBack={onBack}
      />
    );
  }

  // If user navigated into "Add Card", render the dedicated AddCardScreen
  if (viewMode === 'add_card') {
    return (
      <AddCardScreen
        language={language}
        onBack={() => setViewMode('methods')}
        onSaveCard={handleSaveCardFromScreen}
        initialCard={
          savedCard
            ? {
                cardHolder: savedCard.cardholderName,
                cardNumber: savedCard.cardNumber,
                expiry: savedCard.expiry,
              }
            : undefined
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Header (Circular Back Button & Centered Title) ─────────────── */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.4}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isTa ? 'கட்டண முறைகள்' : 'Payment Methods'}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 120, 140) },
        ]}
      >
        {/* ─── 2. Credit & Debit Card Section ──────────────────────────────── */}
        <Text style={styles.sectionTitle}>
          {isTa ? 'கிரெடிட் & டெபிட் கார்டு' : 'Credit & Debit Card'}
        </Text>

        <TouchableOpacity
          style={[
            styles.cardBox,
            selectedMethod === 'card' && styles.cardBoxSelected,
          ]}
          onPress={() => {
            if (savedCard) {
              setSelectedMethod('card');
            } else {
              setViewMode('add_card');
            }
          }}
          activeOpacity={0.85}
        >
          <View style={styles.cardBoxLeft}>
            {/* Purple Credit Card Icon */}
            <View style={styles.creditCardIconWrap}>
              <Svg width={28} height={20} viewBox="0 0 28 20" fill="none">
                <Rect width="28" height="20" rx="4" fill={BRAND_PURPLE} />
                <Rect y="4" width="28" height="3.5" fill="#4D36C9" />
                <Rect x="4" y="11.5" width="6" height="4" rx="1" fill="#FFFFFF" opacity={0.9} />
                <Circle cx="17" cy="13.5" r="2.2" fill="#FFFFFF" opacity={0.5} />
                <Circle cx="20" cy="13.5" r="2.2" fill="#FFFFFF" opacity={0.85} />
              </Svg>
            </View>

            <Text style={styles.cardBoxLabel}>
              {savedCard
                ? `•••• •••• •••• ${savedCard.last4}`
                : isTa
                ? 'கார்டு சேர்க்கவும்'
                : 'Add Card'}
            </Text>
          </View>

          {savedCard ? (
            <TouchableOpacity
              onPress={() => setViewMode('add_card')}
              style={styles.editCardBtn}
            >
              <Text style={styles.editCardText}>{isTa ? 'மாற்று' : 'Edit'}</Text>
            </TouchableOpacity>
          ) : (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.5}>
              <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          )}
        </TouchableOpacity>

        {/* ─── 3. More Payment Options Section ─────────────────────────────── */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
          {isTa ? 'மேலும் கட்டண வழிகள்' : 'More Payment Options'}
        </Text>

        <View style={styles.optionsContainer}>
          {/* Option 1: Paypal */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSelectedMethod('paypal')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.brandIconWrap}>
                {/* Official PayPal Logo */}
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M7.076 20.5H3.1a.5.5 0 0 1-.493-.578L5.1 4.594a.666.666 0 0 1 .658-.56h5.17c3.4 0 5.342 1.65 4.953 4.494-.35 2.597-2.043 4.045-4.562 4.045H8.89l-1.085 7.369a.5.5 0 0 1-.73.558z"
                    fill="#003087"
                  />
                  <Path
                    d="M9.89 12.57h2.357c2.52 0 4.213-1.448 4.563-4.045.39-2.845-1.554-4.495-4.954-4.495H6.685a.667.667 0 0 0-.658.56L3.53 19.922a.5.5 0 0 0 .493.578h3.599l1.085-6.88a.5.5 0 0 1 .183-.65z"
                    fill="#0079C1"
                    opacity={0.88}
                  />
                </Svg>
              </View>
              <Text style={styles.optionLabel}>Paypal</Text>
            </View>

            {/* Radio Button */}
            <View
              style={[
                styles.radioOuter,
                selectedMethod === 'paypal' && styles.radioOuterSelected,
              ]}
            >
              {selectedMethod === 'paypal' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Option 2: Apple Pay */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSelectedMethod('apple_pay')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.brandIconWrap}>
                {/* Apple Pay Logo */}
                <Svg width={22} height={22} viewBox="0 0 170 170" fill="#000000">
                  <Path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.56-7.7-11.61-13.99-5.66-8.7-10.15-18.91-13.48-30.63-3.32-11.73-4.99-22.75-4.99-33.06 0-14.56 3.69-26.69 11.08-36.39 7.39-9.7 16.58-14.65 27.56-14.86 4.35 0 9.27 1.15 14.75 3.45 5.48 2.3 9.38 3.52 11.71 3.67 2.11-.15 6.13-1.44 12.06-3.87 5.92-2.43 10.81-3.5 14.67-3.21 13.9.72 24.63 6.07 32.18 16.06-12.44 7.53-18.49 17.84-18.15 30.93.36 10.3 4.26 18.89 11.71 25.77 7.45 6.88 16.27 10.88 26.47 12-2.17 6.51-4.78 12.87-7.83 19.08zM119.22 33.15c0-7.39 2.67-14.39 8.01-21 5.34-6.61 12.06-10.88 20.15-12.82.22 1.52.33 2.9.33 4.14 0 7.39-2.78 14.52-8.34 21.39-5.56 6.88-12.48 11.16-20.76 12.84-.22-1.3-.39-2.82-.39-4.55z" />
                </Svg>
              </View>
              <Text style={styles.optionLabel}>Apple Pay</Text>
            </View>

            {/* Radio Button */}
            <View
              style={[
                styles.radioOuter,
                selectedMethod === 'apple_pay' && styles.radioOuterSelected,
              ]}
            >
              {selectedMethod === 'apple_pay' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Option 3: Google Pay */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSelectedMethod('google_pay')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.brandIconWrap}>
                {/* Google Pay Logo */}
                <Svg width={22} height={22} viewBox="0 0 24 24">
                  <Path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <Path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <Path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <Path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </Svg>
              </View>
              <Text style={styles.optionLabel}>Google Pay</Text>
            </View>

            {/* Radio Button */}
            <View
              style={[
                styles.radioOuter,
                selectedMethod === 'google_pay' && styles.radioOuterSelected,
              ]}
            >
              {selectedMethod === 'google_pay' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── 4. Bottom Fixed Confirm Payment Container ───────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 12, 20) }]}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmPayment}
          disabled={isProcessing}
          activeOpacity={0.88}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.confirmBtnText}>
              {isTa ? 'கட்டணத்தை உறுதிசெய்க' : 'Confirm Payment'}
            </Text>
          )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1F24',
    textAlign: 'center',
  },

  /* Scroll Content */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181D',
    marginBottom: 14,
  },

  /* Add Card Box */
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardBoxSelected: {
    borderColor: BRAND_PURPLE,
    backgroundColor: '#FAF9FF',
  },
  cardBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditCardIconWrap: {
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBoxLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  editCardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  editCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND_PURPLE,
  },

  /* Options Container */
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconWrap: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#18181D',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  /* Radio Button */
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioOuterSelected: {
    borderColor: BRAND_PURPLE,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BRAND_PURPLE,
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
  confirmBtn: {
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
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
