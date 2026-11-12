/**
 * Manamaalai Matrimony — Modern E-Receipt Screen
 *
 * Implements the exact design from the reference screenshot:
 * - Header: Circular white back button (←) and title "E-Receipt"
 * - Large Realistic Barcode graphic
 * - Plan Details: Yearly
 * - Purchase Date: August 24, 2023 | 10:00 AM
 * - Expiry Date: August 24, 2024 | 10:00 AM
 * - Amount: $69.99
 * - Tax & Fees: $12.00
 * - Dashed horizontal divider
 * - Total: $81.99
 * - Name: John Doe (or current user name)
 * - Phone Number: +1 (208) 555-0112
 * - Payment Mode: Paypal
 * - Transaction ID: #RE2564HG23
 * - Bottom Bar: Full-width royal purple button "Download E-Receipt"
 */

import React from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { Language } from '../localization';

const BRAND_PURPLE = '#6D53F5';
const { width } = Dimensions.get('window');

// Deterministic barcode bar widths (bar width, gap width)
const BARCODE_DATA = [
  3, 2, 5, 2, 2, 4, 6, 2, 2, 5, 4, 2, 7, 2, 3, 4, 2, 6, 2, 3, 5, 2, 6, 3, 2, 4,
  7, 2, 3, 5, 2, 6, 3, 2, 4, 7, 2, 3, 5, 2, 6, 2, 4, 5, 2, 3, 6, 2, 4, 5, 2, 3,
  7, 2, 2, 5, 4, 2, 6, 3, 2, 4, 7, 2, 4, 3, 5, 2, 6, 2, 3, 5, 2, 4, 6, 2, 3, 4,
];

interface EReceiptScreenProps {
  language?: Language;
  onBack: () => void;
  planName?: string;
  purchaseDate?: string;
  expiryDate?: string;
  amount?: string;
  tax?: string;
  total?: string;
  userName?: string;
  phone?: string;
  paymentMode?: string;
  transactionId?: string;
}

export const EReceiptScreen: React.FC<EReceiptScreenProps> = ({
  language,
  onBack,
  planName = 'Yearly',
  purchaseDate = 'August 24, 2023 | 10:00 AM',
  expiryDate = 'August 24, 2024 | 10:00 AM',
  amount = '$69.99.00',
  tax = '$12.00',
  total = '$81.99.00',
  userName = 'John Doe',
  phone = '+1 (208) 555-0112',
  paymentMode = 'Paypal',
  transactionId = '#RE2564HG23',
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const handleDownload = async () => {
    try {
      await Share.share({
        message:
          `MANAMAALAI E-RECEIPT\n` +
          `-------------------------------\n` +
          `Plan: ${planName}\n` +
          `Purchase Date: ${purchaseDate}\n` +
          `Expiry Date: ${expiryDate}\n` +
          `Amount: ${amount}\n` +
          `Tax & Fees: ${tax}\n` +
          `Total: ${total}\n` +
          `-------------------------------\n` +
          `Name: ${userName}\n` +
          `Phone: ${phone}\n` +
          `Payment Mode: ${paymentMode}\n` +
          `Transaction ID: ${transactionId}\n` +
          `Status: SUCCESSFUL`,
      });
    } catch {}
  };

  // Render barcode bars
  let currentX = 10;
  const barcodeBars = BARCODE_DATA.map((barWidth, index) => {
    const x = currentX;
    currentX += barWidth + 3;
    return (
      <Rect
        key={index}
        x={x}
        y={0}
        width={barWidth}
        height={72}
        fill="#18181D"
      />
    );
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Header (Circular Back Button & Title "E-Receipt") ─────────── */}
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
          {isTa ? 'மின்-ரசீது' : 'E-Receipt'}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 100, 120) },
        ]}
      >
        {/* ─── 2. Barcode Graphic ─────────────────────────────────────────── */}
        <View style={styles.barcodeContainer}>
          <Svg width={Math.min(width - 48, 320)} height={72} viewBox="0 0 320 72">
            {barcodeBars}
          </Svg>
        </View>

        {/* ─── 3. Receipt Details ─────────────────────────────────────────── */}
        {/* Section 1: Plan Details */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'திட்ட விவரங்கள்' : 'Plan Details'}
          </Text>
          <Text style={styles.valueBold}>{planName}</Text>
        </View>

        <View style={styles.spacing} />

        {/* Section 2: Dates */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'வாங்கிய தேதி' : 'Purchase Date'}
          </Text>
          <Text style={styles.value}>{purchaseDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'காலாவதி தேதி' : 'Expiry Date'}
          </Text>
          <Text style={styles.value}>{expiryDate}</Text>
        </View>

        <View style={styles.spacing} />

        {/* Section 3: Amount & Taxes */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'தொகை' : 'Amount'}
          </Text>
          <Text style={styles.valueBold}>{amount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'வரி & கட்டணங்கள்' : 'Tax & Fees'}
          </Text>
          <Text style={styles.valueBold}>{tax}</Text>
        </View>

        {/* Dashed Horizontal Divider */}
        <View style={styles.dashedLine} />

        {/* Section 4: Total */}
        <View style={[styles.detailRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>
            {isTa ? 'மொத்தம்' : 'Total'}
          </Text>
          <Text style={styles.totalValue}>{total}</Text>
        </View>

        <View style={styles.spacing} />

        {/* Section 5: Customer & Transaction Info */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'பெயர்' : 'Name'}
          </Text>
          <Text style={styles.valueBold}>{userName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'தொலைபேசி எண்' : 'Phone Number'}
          </Text>
          <Text style={styles.valueBold}>{phone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'கட்டண முறை' : 'Payment Mode'}
          </Text>
          <Text style={styles.valueBold}>{paymentMode}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>
            {isTa ? 'பரிவர்த்தனை எண்' : 'Transaction ID'}
          </Text>
          <Text style={styles.valueBold}>{transactionId}</Text>
        </View>
      </ScrollView>

      {/* ─── 4. Bottom Fixed Download Button ─────────────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 12, 20) }]}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={handleDownload}
          activeOpacity={0.88}
        >
          <Text style={styles.downloadBtnText}>
            {isTa ? 'மின்-ரசீதைப் பதிவிறக்குக' : 'Download E-Receipt'}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1F24',
    textAlign: 'center',
  },

  /* Scroll Content */
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },

  /* Barcode */
  barcodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 32,
  },

  /* Detail Rows */
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181D',
  },
  valueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181D',
  },

  spacing: {
    height: 14,
  },

  /* Dashed Divider */
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginVertical: 14,
  },

  /* Total */
  totalRow: {
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181D',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
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
  downloadBtn: {
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
  downloadBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

