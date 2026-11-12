/**
 * Manamaalai Matrimony (மணமாலை) — Universal Language Toggle Component
 *
 * Provides a clean, normal, and elegant segmented toggle (EN | தமிழ்)
 * with a smooth sliding active capsule pill and accessible hit areas.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Language } from '../localization';

const BRAND_PURPLE = '#6D53F5';

export interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium';
  variant?: 'light' | 'glass';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onToggle,
  style,
  size = 'small',
  variant = 'light',
}) => {
  const isTa = language === 'ta';
  const animValue = useRef(new Animated.Value(isTa ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isTa ? 1 : 0,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isTa]);

  const isSmall = size === 'small';
  const trackWidth = isSmall ? 82 : 94;
  const trackHeight = isSmall ? 30 : 36;
  const pillWidth = isSmall ? 38 : 44;
  const pillHeight = isSmall ? 24 : 28;
  const pillOffsetEnd = trackWidth - pillWidth - (isSmall ? 3 : 3);

  const pillTranslateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [isSmall ? 3 : 3, pillOffsetEnd],
  });

  return (
    <TouchableOpacity
      style={[
        styles.track,
        {
          width: trackWidth,
          height: trackHeight,
          borderRadius: trackHeight / 2,
          backgroundColor: variant === 'glass' ? 'rgba(255, 255, 255, 0.85)' : '#F3F4F8',
          borderColor: variant === 'glass' ? 'rgba(0, 0, 0, 0.08)' : '#E5E3F0',
        },
        style,
      ]}
      onPress={onToggle}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={isTa ? 'ஆங்கிலத்திற்கு மாற்றவும்' : 'Switch to Tamil'}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* Sliding Active Pill */}
      <Animated.View
        style={[
          styles.activePill,
          {
            width: pillWidth,
            height: pillHeight,
            borderRadius: pillHeight / 2,
            transform: [{ translateX: pillTranslateX }],
          },
        ]}
      />

      {/* English Segment */}
      <View style={[styles.segment, { width: (trackWidth - 6) / 2, height: pillHeight }]}>
        <Text
          style={[
            styles.segmentText,
            isSmall ? styles.textSmall : styles.textMedium,
            !isTa ? styles.textActive : styles.textInactive,
          ]}
        >
          EN
        </Text>
      </View>

      {/* Tamil Segment */}
      <View style={[styles.segment, { width: (trackWidth - 6) / 2, height: pillHeight }]}>
        <Text
          style={[
            styles.segmentText,
            isSmall ? styles.textSmall : styles.textMedium,
            isTa ? styles.textActive : styles.textInactive,
          ]}
        >
          தமிழ்
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  activePill: {
    position: 'absolute',
    top: 3,
    left: 0,
    backgroundColor: BRAND_PURPLE,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
    elevation: 3,
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  segmentText: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 12,
  },
  textActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  textInactive: {
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default LanguageToggle;

