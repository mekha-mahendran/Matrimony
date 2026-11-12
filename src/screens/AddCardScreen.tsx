/**
 * Manamaalai Matrimony — Modern Add Card Screen
 *
 * Implements the exact design from the reference screenshot:
 * - Header: Circular back button (←) and title "Add Card"
 * - Live Credit Card Preview (Purple with light curved circles overlay):
 *     - Top-right: VISA logo in white
 *     - Center: Formatted Card Number (e.g. "4716 9627 1635 8047")
 *     - Bottom Left: "Card holder name" label + name ("Esther Howard")
 *     - Bottom Middle: "Expiry date" label + date ("02/30")
 *     - Bottom Right: Golden/white chip icon
 * - Form Fields:
 *     - "Card Holder Name"
 *     - "Card Number"
 *     - "Expiry Date" (Row left)
 *     - "CVV" (Row right)
 * - Checkbox:
 *     - Purple checkbox + "Save Card"
 * - Bottom Bar:
 *     - Full-width royal purple button: "Add Card"
 */

import React, { useState } from 'react';
import {
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';

const BRAND_PURPLE = '#6D53F5';

export interface CardDetails {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  isSaved: boolean;
}

interface AddCardScreenProps {
  language?: Language;
  onBack: () => void;
  onSaveCard: (card: CardDetails) => void;
  initialCard?: Partial<CardDetails>;
}

export const AddCardScreen: React.FC<AddCardScreenProps> = ({
  language,
  onBack,
  onSaveCard,
  initialCard,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [cardHolder, setCardHolder] = useState(initialCard?.cardHolder || 'Esther Howard');
  const [cardNumber, setCardNumber] = useState(initialCard?.cardNumber || '4716 9627 1635 8047');
  const [expiry, setExpiry] = useState(initialCard?.expiry || '02/30');
  const [cvv, setCvv] = useState(initialCard?.cvv || '000');
  const [saveCard, setSaveCard] = useState(true);

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setCvv(cleaned);
  };

  const handleSubmit = () => {
    onSaveCard({
      cardHolder: cardHolder.trim() || 'Esther Howard',
      cardNumber: cardNumber.trim() || '4716 9627 1635 8047',
      expiry: expiry.trim() || '02/30',
      cvv: cvv.trim() || '000',
      isSaved: saveCard,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Header (Circular Back Button & Title "Add Card") ───────────── */}
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
          {isTa ? 'அட்டையை சேர்க்கவும்' : 'Add Card'}
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
        {/* ─── 2. Purple Credit Card Graphic Preview ───────────────────────── */}
        <View style={styles.cardPreviewContainer}>
          <View style={styles.cardPreview}>
            {/* Background decorative circles */}
            <View style={styles.cardBgCircle1} />
            <View style={styles.cardBgCircle2} />

            {/* Top row: VISA Logo */}
            <View style={styles.cardTopRow}>
              <View />
              <Text style={styles.visaText}>VISA</Text>
            </View>

            {/* Middle: Card Number */}
            <Text style={styles.cardNumberText}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>

            {/* Bottom Row: Holder, Expiry, Chip */}
            <View style={styles.cardBottomRow}>
              <View style={styles.cardHolderCol}>
                <Text style={styles.cardSmallLabel}>
                  {isTa ? 'அட்டை வைத்திருப்பவர் பெயர்' : 'Card holder name'}
                </Text>
                <Text style={styles.cardHolderValue} numberOfLines={1}>
                  {cardHolder || 'Esther Howard'}
                </Text>
              </View>

              <View style={styles.cardExpiryCol}>
                <Text style={styles.cardSmallLabel}>
                  {isTa ? 'காலாவதி தேதி' : 'Expiry date'}
                </Text>
                <Text style={styles.cardExpiryValue}>
                  {expiry || 'MM/YY'}
                </Text>
              </View>

              {/* EMV Chip */}
              <View style={styles.chipContainer}>
                <View style={styles.chipInner}>
                  <View style={styles.chipLineH} />
                  <View style={styles.chipLineV} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ─── 3. Form Input Fields ────────────────────────────────────────── */}
        {/* Card Holder Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.fieldLabel}>
            {isTa ? 'அட்டை வைத்திருப்பவர் பெயர்' : 'Card Holder Name'}
          </Text>
          <TextInput
            style={styles.input}
            value={cardHolder}
            onChangeText={setCardHolder}
            placeholder="Esther Howard"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
        </View>

        {/* Card Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.fieldLabel}>
            {isTa ? 'அட்டை எண்' : 'Card Number'}
          </Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="4716 9627 1635 8047"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        {/* Expiry Date & CVV */}
        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.fieldLabel}>
              {isTa ? 'காலாவதி தேதி' : 'Expiry Date'}
            </Text>
            <TextInput
              style={styles.input}
              value={expiry}
              onChangeText={handleExpiryChange}
              placeholder="02/30"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={handleCvvChange}
              placeholder="000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        {/* ─── 4. Save Card Checkbox ───────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setSaveCard(!saveCard)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, saveCard && styles.checkboxActive]}>
            {saveCard && (
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3.2}>
                <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            {isTa ? 'கார்டைச் சேமிக்கவும்' : 'Save Card'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ─── 5. Bottom Fixed Add Card Button ─────────────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 12, 20) }]}>
        <TouchableOpacity
          style={styles.addCardBtn}
          onPress={handleSubmit}
          activeOpacity={0.88}
        >
          <Text style={styles.addCardBtnText}>
            {isTa ? 'அட்டையை சேர்க்கவும்' : 'Add Card'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 8,
  },

  /* Card Preview */
  cardPreviewContainer: {
    marginBottom: 24,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  cardPreview: {
    height: 204,
    borderRadius: 20,
    backgroundColor: '#7257F6',
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'space-between',
    position: 'relative',
  },
  cardBgCircle1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    right: -40,
    top: -40,
  },
  cardBgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    right: 50,
    top: -10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.5,
  },
  cardNumberText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardHolderCol: {
    flex: 1.4,
  },
  cardExpiryCol: {
    flex: 1,
    paddingLeft: 10,
  },
  cardSmallLabel: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardHolderValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cardExpiryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Chip */
  chipContainer: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInner: {
    width: 24,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  chipLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  /* Form Fields */
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181D',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#18181D',
    backgroundColor: '#FFFFFF',
  },
  rowInputs: {
    flexDirection: 'row',
  },

  /* Checkbox */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: BRAND_PURPLE,
    borderColor: BRAND_PURPLE,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181D',
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
  addCardBtn: {
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
  addCardBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

