/**
 * Manamaalai Matrimony (மணமாலை) — Modern Floating Dark Capsule Navigation Bar
 *
 * Implements the exact design from the reference screenshot:
 * - Sleek dark charcoal capsule background (#1B1A22)
 * - 5 evenly spaced tabs:
 *     1. Home (house icon)
 *     2. Discovery / Radar / Search (concentric radar/compass icon)
 *     3. Interests (heart icon)
 *     4. Messages / Matches (chat bubble with dots)
 *     5. Profile (user outline silhouette)
 * - Active State: Crisp white circular pill (#FFFFFF) with vibrant brand purple icon (#6D53F5)
 * - Inactive State: Subtle monochromatic clean outline icons (#8F8E9C)
 * - Fluid animated spring movement across tabs
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BRAND_PURPLE = '#6D53F5';
const BAR_BG = '#1B1A22';
const INACTIVE_COLOR = '#8F8E9C';
const ACTIVE_BG = '#FFFFFF';

export type TabName = 'home' | 'search' | 'interests' | 'matches' | 'profile';

interface NavItem {
  id: TabName;
  label: string;
}

const ALL_TABS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
  { id: 'interests', label: 'Interests' },
  { id: 'matches', label: 'Matches' },
  { id: 'profile', label: 'Profile' },
];

export interface CurvedWaveTabBarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  unreadCount?: number;
}

export const CurvedWaveTabBar: React.FC<CurvedWaveTabBarProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}) => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom + 6 : (Platform.OS === 'ios' ? 20 : 16);

  // Bar dimensions
  const barHorizontalMargin = 18;
  const barWidth = Math.min(SCREEN_WIDTH - barHorizontalMargin * 2, 420);
  const tabWidth = barWidth / ALL_TABS.length;
  const activeCircleSize = 50;

  const activeIndex = ALL_TABS.findIndex(t => t.id === activeTab);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const getTargetX = (idx: number) => {
    return idx * tabWidth + (tabWidth - activeCircleSize) / 2;
  };

  const animX = useRef(new Animated.Value(getTargetX(safeActiveIndex))).current;
  const animScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const targetX = getTargetX(safeActiveIndex);
    Animated.spring(animX, {
      toValue: targetX,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
      useNativeDriver: true,
    }).start();

    animScale.setValue(0.85);
    Animated.spring(animScale, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [safeActiveIndex]);

  /* ─── Modern Minimalist SVG Icons Matching Screenshot ─────────────────── */
  const renderTabIcon = (tabId: TabName, isActive: boolean) => {
    const iconColor = isActive ? BRAND_PURPLE : INACTIVE_COLOR;

    switch (tabId) {
      case 'home':
        if (isActive) {
          // Solid rounded home with arched door cutout
          return (
            <Svg width={24} height={24} viewBox="0 0 24 24" fill={iconColor}>
              <Path d="M10.8 2.8a1.8 1.8 0 0 1 2.4 0l7.2 6.2c.4.3.6.8.6 1.3v9.2a2.5 2.5 0 0 1-2.5 2.5h-2.8a1.2 1.2 0 0 1-1.2-1.2v-4.3a1.5 1.5 0 0 0-1.5-1.5h-2a1.5 1.5 0 0 0-1.5 1.5v4.3a1.2 1.2 0 0 1-1.2 1.2H4.5A2.5 2.5 0 0 1 2 19.5v-9.2c0-.5.2-1 .6-1.3l7.2-6.2z" />
            </Svg>
          );
        }
        return (
          <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 10.5L12 3.2L21 10.5V20.2C21 21.2 20.2 22 19.2 22H15V14.5H9V22H4.8C3.8 22 3 21.2 3 20.2V10.5Z"
              stroke={iconColor}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'search':
        // Concentric radar / discovery compass icon matching screenshot
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle
              cx="12"
              cy="12"
              r="8.5"
              stroke={iconColor}
              strokeWidth="2.2"
            />
            <Circle
              cx="12"
              cy="12"
              r="3.5"
              stroke={iconColor}
              strokeWidth="2.2"
            />
          </Svg>
        );

      case 'interests':
        // Heart icon matching screenshot
        if (isActive) {
          return (
            <Svg width={24} height={24} viewBox="0 0 24 24" fill={iconColor}>
              <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </Svg>
          );
        }
        return (
          <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke={iconColor}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'matches':
        // Chat bubble with 3 internal dots matching screenshot
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 15a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2v4l4.5-4H20z"
              stroke={iconColor}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={isActive ? iconColor : 'none'}
            />
            <Circle cx="8.5" cy="9.5" r="1.2" fill={isActive ? '#FFFFFF' : iconColor} />
            <Circle cx="12" cy="9.5" r="1.2" fill={isActive ? '#FFFFFF' : iconColor} />
            <Circle cx="15.5" cy="9.5" r="1.2" fill={isActive ? '#FFFFFF' : iconColor} />
          </Svg>
        );

      case 'profile':
        // Circular head + shoulders avatar icon
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={iconColor} strokeWidth="2.1" />
            <Circle cx="12" cy="9" r="3.2" stroke={iconColor} strokeWidth="2" fill={isActive ? iconColor : 'none'} />
            <Path
              d="M6.5 18.2c1.2-2.5 3.1-3.7 5.5-3.7s4.3 1.2 5.5 3.7"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );
    }
  };

  return (
    <View
      style={[
        styles.outerContainer,
        {
          bottom: bottomInset,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.darkCapsuleBar, { width: barWidth }]}>
        {/* Animated Sliding White Circular Pill for Active Tab */}
        <Animated.View
          style={[
            styles.activeIndicatorCircle,
            {
              width: activeCircleSize,
              height: activeCircleSize,
              borderRadius: activeCircleSize / 2,
              transform: [{ translateX: animX }, { scale: animScale }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Tab Buttons Row */}
        <View style={styles.tabButtonsRow}>
          {ALL_TABS.map((tab, idx) => {
            const isActive = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, { width: tabWidth }]}
                activeOpacity={0.85}
                onPress={() => onTabChange(tab.id)}
                hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
              >
                <View style={styles.iconHolder}>
                  {renderTabIcon(tab.id, isActive)}

                  {/* Notification Dot for Matches */}
                  {tab.id === 'matches' && unreadCount > 0 && (
                    <View style={styles.unreadBadgeDot} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  darkCapsuleBar: {
    height: 68,
    backgroundColor: BAR_BG,
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  activeIndicatorCircle: {
    position: 'absolute',
    left: 8,
    backgroundColor: ACTIVE_BG,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  tabButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  tabButton: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconHolder: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
