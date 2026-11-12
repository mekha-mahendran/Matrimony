/**
 * Manamaalai Matrimony (மணமாலை) — Modern Floating Capsule Navigation Bar
 *
 * Matches the reference design (media_1794399256147_d8d6509a.png):
 * - Floating dark capsule dock (#111217) with smooth rounded corners
 * - Chat circle button (with unread notification badge)
 * - Search / Varans button
 * - Active "Home" pill (with home icon & label)
 * - Bright cyan-blue circle "+" action button (#0095F6)
 * - Profile silhouette button
 */

import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type TabName = 'home' | 'search' | 'interests' | 'matches' | 'profile';

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
  const bottomInset = insets.bottom > 0 ? insets.bottom + 8 : (Platform.OS === 'ios' ? 24 : 16);
  const barWidth = Math.min(SCREEN_WIDTH - 32, 400);

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
      <View style={[styles.dockContainer, { width: barWidth }]}>
        {/* 1. Chat / Matches Button */}
        <TouchableOpacity
          style={[styles.circleBtn, activeTab === 'matches' && styles.circleBtnActive]}
          activeOpacity={0.8}
          onPress={() => onTabChange('matches')}
          accessibilityLabel="Chats"
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          {unreadCount > 0 && (
            <View style={styles.unreadBadgeDot}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 2. Search / Varans Button */}
        <TouchableOpacity
          style={[styles.circleBtn, activeTab === 'search' && styles.circleBtnActive]}
          activeOpacity={0.8}
          onPress={() => onTabChange('search')}
          accessibilityLabel="Search Varans"
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={11} cy={11} r={7.5} stroke="#FFFFFF" strokeWidth={2.2} />
            <Path d="M21 21L16.5 16.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>

        {/* 3. Active Home Pill Button */}
        <TouchableOpacity
          style={[
            styles.homePill,
            activeTab === 'home' ? styles.homePillActive : styles.homePillInactive,
          ]}
          activeOpacity={0.85}
          onPress={() => onTabChange('home')}
          accessibilityLabel="Home"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FFFFFF">
            <Path d="M3 10.5L12 3.2L21 10.5V20.2C21 21.2 20.2 22 19.2 22H15V14.5H9V22H4.8C3.8 22 3 21.2 3 20.2V10.5Z" />
          </Svg>
          <Text style={styles.homePillText}>Home</Text>
        </TouchableOpacity>

        {/* 4. Bright Blue Plus Action Button (Interests / Quick Express) */}
        <TouchableOpacity
          style={[styles.plusActionBtn, activeTab === 'interests' && styles.plusActionBtnHighlight]}
          activeOpacity={0.85}
          onPress={() => onTabChange('interests')}
          accessibilityLabel="Add / Interests"
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 5V19M5 12H19"
              stroke="#FFFFFF"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        {/* 5. Profile Button */}
        <TouchableOpacity
          style={[styles.circleBtn, activeTab === 'profile' && styles.circleBtnActive]}
          activeOpacity={0.8}
          onPress={() => onTabChange('profile')}
          accessibilityLabel="Profile"
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={8} r={4} stroke="#FFFFFF" strokeWidth={2} />
            <Path
              d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
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
  dockContainer: {
    height: 64,
    backgroundColor: '#121217',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#24252E',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  circleBtnActive: {
    backgroundColor: '#262732',
  },
  homePill: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  homePillActive: {
    backgroundColor: '#262732',
    borderWidth: 1,
    borderColor: '#3A3C4B',
  },
  homePillInactive: {
    backgroundColor: 'transparent',
  },
  homePillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  plusActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0095F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0095F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  plusActionBtnHighlight: {
    backgroundColor: '#0081D6',
    transform: [{ scale: 1.05 }],
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#121217',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});

export default CurvedWaveTabBar;
