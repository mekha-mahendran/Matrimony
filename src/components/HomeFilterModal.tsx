/**
 * Manamaalai Matrimony — Modern Home Filter Modal
 *
 * Implements the exact design from the reference screenshot:
 * - Rounded white modal sheet with pull handle
 * - Centered title "Filter"
 * - Location selector dropdown with down arrow
 * - "Interested In" pills: Women (active purple), Men, Both
 * - "Sort by" pills: Online (active purple), Popular, Highly Match
 * - "Distance" dual-thumb range slider with ticks: 0 km, 5 Km, 10 Km, 15 Km, 20 Km, 25 Km
 * - "Age" dual-thumb range slider with ticks: 18, 28, 38, 48, 58, 68, 78, 88
 * - Bottom action buttons: "Reset Filter" (light grey/purple) and "Apply" (solid purple)
 */

import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const BRAND_PURPLE = '#6D53F5';

const DISTANCE_TICKS = [0, 5, 10, 15, 20, 25];
const DISTANCE_LABELS = ['0 km', '5 Km', '10 Km', '15 Km', '20 Km', '25 Km'];

const AGE_TICKS = [18, 28, 38, 48, 58, 68, 78, 88];

export interface FilterState {
  location: string;
  interestedIn: 'Women' | 'Men' | 'Both';
  sortBy: 'Online' | 'Popular' | 'Highly Match';
  minDistance: number;
  maxDistance: number;
  minAge: number;
  maxAge: number;
}

interface HomeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentLocation?: string;
  onSelectLocationPress?: () => void;
  isTa?: boolean;
}

export const HomeFilterModal: React.FC<HomeFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentLocation = 'New York, USA',
  onSelectLocationPress,
  isTa = false,
}) => {
  const insets = useSafeAreaInsets();

  const [interestedIn, setInterestedIn] = useState<'Women' | 'Men' | 'Both'>('Women');
  const [sortBy, setSortBy] = useState<'Online' | 'Popular' | 'Highly Match'>('Online');
  const [distRange, setDistRange] = useState<[number, number]>([5, 20]);
  const [ageRange, setAgeRange] = useState<[number, number]>([28, 48]);

  const handleReset = () => {
    setInterestedIn('Women');
    setSortBy('Online');
    setDistRange([5, 20]);
    setAgeRange([28, 48]);
  };

  const handleApply = () => {
    onApply({
      location: currentLocation,
      interestedIn,
      sortBy,
      minDistance: distRange[0],
      maxDistance: distRange[1],
      minAge: ageRange[0],
      maxAge: ageRange[1],
    });
    onClose();
  };

  // Distance range calculation (0 - 25)
  const distMinPct = (distRange[0] / 25) * 100;
  const distMaxPct = (distRange[1] / 25) * 100;

  const handleDistanceTickPress = (val: number) => {
    const [min, max] = distRange;
    const distToMin = Math.abs(val - min);
    const distToMax = Math.abs(val - max);

    if (distToMin < distToMax) {
      if (val <= max) setDistRange([val, max]);
      else setDistRange([min, val]);
    } else {
      if (val >= min) setDistRange([min, val]);
      else setDistRange([val, max]);
    }
  };

  // Age range calculation (18 - 88, spread = 70)
  const ageMinPct = ((ageRange[0] - 18) / 70) * 100;
  const ageMaxPct = ((ageRange[1] - 18) / 70) * 100;

  const handleAgeTickPress = (val: number) => {
    const [min, max] = ageRange;
    const distToMin = Math.abs(val - min);
    const distToMax = Math.abs(val - max);

    if (distToMin < distToMax) {
      if (val <= max) setAgeRange([val, max]);
      else setAgeRange([min, val]);
    } else {
      if (val >= min) setAgeRange([min, val]);
      else setAgeRange([val, max]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom + 16, 26) },
            ]}
          >
            {/* Top Drag Handle */}
            <View style={styles.handlePill} />

            {/* Header Title */}
            <Text style={styles.headerTitle}>
              {isTa ? 'வடிகட்டி' : 'Filter'}
            </Text>

            {/* 1. Location Dropdown */}
            <View style={styles.sectionWrap}>
              <Text style={styles.fieldLabel}>
                {isTa ? 'இருப்பிடம்' : 'Location'}
              </Text>
              <TouchableOpacity
                style={styles.locationDropdown}
                activeOpacity={0.75}
                onPress={onSelectLocationPress}
              >
                <Text style={styles.locationValueText}>{currentLocation}</Text>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.2}>
                  <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* 2. Interested In */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionHeading}>
                {isTa ? 'ஆர்வமுள்ளவர்கள்' : 'Interested In'}
              </Text>
              <View style={styles.pillsRow}>
                {(['Women', 'Men', 'Both'] as const).map(option => {
                  const isActive = interestedIn === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.pillBtn, isActive && styles.pillBtnActive]}
                      onPress={() => setInterestedIn(option)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                        {isTa
                          ? option === 'Women' ? 'பெண்கள்' : option === 'Men' ? 'ஆண்கள்' : 'இருவரும்'
                          : option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Sort by */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionHeading}>
                {isTa ? 'வரிசைப்படுத்து' : 'Sort by'}
              </Text>
              <View style={styles.pillsRow}>
                {(['Online', 'Popular', 'Highly Match'] as const).map(option => {
                  const isActive = sortBy === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.pillBtn, isActive && styles.pillBtnActive]}
                      onPress={() => setSortBy(option)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                        {isTa
                          ? option === 'Online' ? 'ஆன்லைன்' : option === 'Popular' ? 'பிரபலம்' : 'அதிக பொருத்தம்'
                          : option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Distance Slider */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionHeading}>
                {isTa ? 'தூரம்' : 'Distance'}
              </Text>

              {/* Slider Track */}
              <View style={styles.sliderTrackContainer}>
                <View style={styles.sliderBackgroundBar} />
                {/* Active Purple Bar */}
                <View
                  style={[
                    styles.sliderActiveBar,
                    {
                      left: `${distMinPct}%`,
                      width: `${Math.max(distMaxPct - distMinPct, 2)}%`,
                    },
                  ]}
                />
                {/* Left Thumb */}
                <View style={[styles.sliderThumb, { left: `${distMinPct}%` }]} />
                {/* Right Thumb */}
                <View style={[styles.sliderThumb, { left: `${distMaxPct}%` }]} />
              </View>

              {/* Distance Ticks */}
              <View style={styles.ticksRow}>
                {DISTANCE_TICKS.map((val, idx) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => handleDistanceTickPress(val)}
                    hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  >
                    <Text style={styles.tickLabel}>{DISTANCE_LABELS[idx]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 5. Age Slider */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionHeading}>
                {isTa ? 'வயது' : 'Age'}
              </Text>

              {/* Slider Track */}
              <View style={styles.sliderTrackContainer}>
                <View style={styles.sliderBackgroundBar} />
                {/* Active Purple Bar */}
                <View
                  style={[
                    styles.sliderActiveBar,
                    {
                      left: `${ageMinPct}%`,
                      width: `${Math.max(ageMaxPct - ageMinPct, 2)}%`,
                    },
                  ]}
                />
                {/* Left Thumb */}
                <View style={[styles.sliderThumb, { left: `${ageMinPct}%` }]} />
                {/* Right Thumb */}
                <View style={[styles.sliderThumb, { left: `${ageMaxPct}%` }]} />
              </View>

              {/* Age Ticks */}
              <View style={styles.ticksRow}>
                {AGE_TICKS.map(val => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => handleAgeTickPress(val)}
                    hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  >
                    <Text style={styles.tickLabel}>{val}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 6. Bottom Buttons */}
            <View style={styles.bottomButtonsRow}>
              {/* Reset Filter Button */}
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.resetBtnText}>
                  {isTa ? 'வடிகட்டியை மீட்டமை' : 'Reset Filter'}
                </Text>
              </TouchableOpacity>

              {/* Apply Button */}
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApply}
                activeOpacity={0.88}
              >
                <Text style={styles.applyBtnText}>
                  {isTa ? 'பயன்படுத்து' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 16,
  },
  handlePill: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181D',
    textAlign: 'center',
    marginBottom: 16,
  },

  /* Sections */
  sectionWrap: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181D',
    marginBottom: 12,
  },

  /* Location Dropdown */
  locationDropdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  locationValueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181D',
  },

  /* Pills */
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pillBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnActive: {
    backgroundColor: BRAND_PURPLE,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Slider Track */
  sliderTrackContainer: {
    height: 24,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 8,
  },
  sliderBackgroundBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  sliderActiveBar: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: BRAND_PURPLE,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BRAND_PURPLE,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginLeft: -10,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
  },
  ticksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 0,
  },
  tickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  /* Bottom Buttons */
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  resetBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_PURPLE,
  },
  applyBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

