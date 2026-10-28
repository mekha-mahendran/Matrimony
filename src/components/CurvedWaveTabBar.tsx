import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { Colors } from '../theme';
import { CustomIcon } from './CustomIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type TabName = 'home' | 'interests' | 'search' | 'matches' | 'profile';

type TabIconName = 'home' | 'heart' | 'heart-filled' | 'search' | 'message' | 'user';

interface CurvedWaveTabBarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  unreadCount?: number;
}

const TABS: { id: TabName; icon: TabIconName; activeIcon: TabIconName; label: string }[] = [
  { id: 'home', icon: 'home', activeIcon: 'home', label: 'Home' },
  { id: 'interests', icon: 'heart', activeIcon: 'heart-filled', label: 'Interests' },
  { id: 'search', icon: 'search', activeIcon: 'search', label: 'Search' },
  { id: 'matches', icon: 'message', activeIcon: 'message', label: 'Matches' },
  { id: 'profile', icon: 'user', activeIcon: 'user', label: 'Profile' },
];

const BAR_MARGIN = 16;
const BAR_WIDTH = SCREEN_WIDTH - BAR_MARGIN * 2;
const TAB_WIDTH = BAR_WIDTH / TABS.length;
const BAR_HEIGHT = 64;
const BUBBLE_WIDTH = 58;
const BUBBLE_HEIGHT = 68;
const ACTIVE_ICON_COLOR = Colors.goldAccent; // Luminous Sun Gold for Royal Sapphire theme

export const CurvedWaveTabBar: React.FC<CurvedWaveTabBarProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  const activeIndex = Math.max(
    0,
    TABS.findIndex(t => t.id === activeTab)
  );

  const getTargetX = (idx: number) => {
    return idx * TAB_WIDTH + TAB_WIDTH / 2 - BUBBLE_WIDTH / 2;
  };

  const animX = useRef(new Animated.Value(getTargetX(activeIndex))).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const targetX = getTargetX(activeIndex);

    // 1. Fluid horizontal glide to the active tab position
    Animated.spring(animX, {
      toValue: targetX,
      damping: 15,
      mass: 0.85,
      stiffness: 140,
      useNativeDriver: true,
    }).start();

    // 2. Playful pop-up bounce on the active bubble
    bubbleScale.setValue(0.78);
    Animated.spring(bubbleScale, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  const activeTabObj = TABS[activeIndex];

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.rootContainer,
        {
          paddingBottom: bottomInset,
          height: BAR_HEIGHT + 26 + bottomInset,
        },
      ]}
    >
      <View style={styles.barWrapper}>
        {/* Base Floating Pill Bar */}
        <View style={styles.pillBar}>
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabItem}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.8}
              >
                {/* Inactive flat icons inside the bar; hidden when this tab is elevated in the bubble */}
                <View
                  style={[
                    styles.inactiveIconWrap,
                    { opacity: isActive ? 0 : 1 },
                  ]}
                >
                  <CustomIcon
                    name={tab.icon}
                    size={20}
                    color="rgba(255, 255, 255, 0.72)"
                  />
                  <Text style={styles.tabLabel} numberOfLines={1}>
                    {tab.label}
                  </Text>
                  {tab.id === 'matches' && unreadCount > 0 && (
                    <View style={styles.barUnreadBadge} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Animated Sliding Scoop + Elevated Droplet Bubble */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.animatedBubbleContainer,
            {
              transform: [
                { translateX: animX },
                { scale: bubbleScale },
              ],
            },
          ]}
        >
          {/* Outer Scoop & Teardrop Halo SVG (Matches user reference diagram) */}
          <Svg
            width={BUBBLE_WIDTH}
            height={BUBBLE_HEIGHT}
            viewBox="0 0 58 68"
            style={styles.bubbleSvg}
          >
            <Defs>
              <LinearGradient id="haloGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="100%" stopColor={Colors.paletteCream} />
              </LinearGradient>
            </Defs>

            {/* Droplet & Scoop Cutout */}
            <Path
              d={`
                M 29,3
                C 42,3 52,13 52,26
                C 52,36 56,46 58,52
                C 53,63 41,67 29,67
                C 17,67 5,63 0,52
                C 2,46 6,36 6,26
                C 6,13 16,3 29,3
                Z
              `}
              fill="url(#haloGrad)"
            />

            {/* Deep Obsidian elevated circle with Radiant Sun Gold ring */}
            <Circle
              cx="29"
              cy="25"
              r="20.5"
              fill={Colors.burgundyDark}
              stroke={Colors.goldAccent}
              strokeWidth="1.5"
            />
          </Svg>

          {/* Active Tab Icon Centered Inside the Elevated Dark Circle */}
          <View style={styles.activeIconHolder}>
            <CustomIcon
              name={activeTabObj.activeIcon}
              size={22}
              color={ACTIVE_ICON_COLOR}
            />
            {activeTabObj.id === 'matches' && unreadCount > 0 && (
              <View style={styles.bubbleUnreadBadge} />
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  barWrapper: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT + 24,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  pillBar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: Colors.burgundyDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 16,
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.28)',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.72)',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  barUnreadBadge: {
    position: 'absolute',
    top: 2,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.terracotta,
    borderWidth: 1.2,
    borderColor: Colors.burgundyDark,
  },
  animatedBubbleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 110,
    elevation: 18,
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.50,
    shadowRadius: 12,
  },
  bubbleSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  activeIconHolder: {
    width: 41,
    height: 41,
    borderRadius: 20.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4.5,
    position: 'relative',
  },
  bubbleUnreadBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6.5,
    height: 6.5,
    borderRadius: 3.25,
    backgroundColor: '#FFFFFF',
  },
});
