/**
 * Manamaalai Matrimony (மணமாலை) — Modern Swipe Discovery & Card Matching Screen
 *
 * Implements the exact design from the reference screenshots:
 * - Location Header with dropdown & top-right filter button
 * - Horizontal Stories / Avatar row (Add + Jenny, Leslie, Bessie, etc. with purple rings)
 * - Tinder-Style Swipeable Cards with PanResponder:
 *     - Smooth rotation and momentum drag
 *     - Dynamic stamp overlays: ✕ on swipe left, ♥ on swipe right
 *     - Distance badge: "12.6 km away"
 *     - Name with golden verified badge & location
 * - 3 Floating Action Buttons below card:
 *     - White circle with purple ✕ (Pass / Dislike)
 *     - Royal Purple circle with white Heart ♥ (Like / Express Interest)
 *     - Golden Yellow circle with Star ★ (Super Like / Shortlist)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Platform,
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
import { INITIAL_PROFILES } from '../data/mockProfiles';
import { StorageService } from '../services/storage';
import { CurrentUser, MatrimonyProfile } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const BRAND_PURPLE = '#6D53F5';

interface HomeScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  onSearchPress: (initialQuery?: string) => void;
  onMembershipPress: () => void;
  onInterestsTabPress: () => void;
  onChatPress?: (profile: MatrimonyProfile) => void;
  onDailyRecommendationsPress?: () => void;
  onViewHoroscopePorutham?: (porutham: any) => void;
  onFamilyCirclePress?: () => void;
  onRelationshipManagerPress?: () => void;
  unreadCount: number;
  isAdmin: boolean;
}

// Sample story avatars matching reference screenshot
const STORIES_DATA = [
  { id: '1', name: 'Jenny', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Leslie', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Bessie', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Jean', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Ananya', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80' },
  { id: '6', name: 'Priya', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
];

// Curated profiles matching the screenshot visual aesthetic
const DISCOVERY_PROFILES: (Partial<MatrimonyProfile> & { distance: string })[] = [
  {
    id: 'disc_1',
    name: 'Arlene McCoy',
    age: 25,
    gender: 'bride',
    currentCity: 'New York',
    currentCountry: 'USA',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ],
    distance: '12.6 km away',
    educationCareer: {
      qualification: 'MBA Marketing',
      institution: 'Stern School of Business',
      occupation: 'Brand Strategist',
      employer: 'Ogilvy',
      annualIncome: '$105,000 / yr',
      workLocation: 'New York, USA',
    },
  },
  {
    id: 'disc_2',
    name: 'Leslie Alexander',
    age: 24,
    gender: 'bride',
    currentCity: 'New York',
    currentCountry: 'USA',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    distance: '9.4 km away',
    educationCareer: {
      qualification: 'M.S. Computer Science',
      institution: 'Columbia University',
      occupation: 'Software Engineer',
      employer: 'Tech Innovations',
      annualIncome: '$120,000 / yr',
      workLocation: 'New York, USA',
    },
  },
  {
    id: 'disc_3',
    name: 'Marvin McKinney',
    age: 26,
    gender: 'bride',
    currentCity: 'New York',
    currentCountry: 'USA',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    distance: '12.6 km away',
    educationCareer: {
      qualification: 'B.Des / Fashion & Arts',
      institution: 'NYU Arts',
      occupation: 'Creative Director',
      employer: 'Design Studio',
      annualIncome: '$95,000 / yr',
      workLocation: 'New York, USA',
    },
  },
  {
    id: 'disc_4',
    name: 'Jenny Wilson',
    age: 23,
    gender: 'bride',
    currentCity: 'New York',
    currentCountry: 'USA',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    ],
    distance: '15.2 km away',
    educationCareer: {
      qualification: 'B.Sc Architecture',
      institution: 'Pratt Institute',
      occupation: 'Architect',
      employer: 'Studio One',
      annualIncome: '$90,000 / yr',
      workLocation: 'New York, USA',
    },
  },
  {
    id: 'disc_5',
    name: 'Bessie Cooper',
    age: 25,
    gender: 'bride',
    currentCity: 'New York',
    currentCountry: 'USA',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ],
    distance: '6.8 km away',
    educationCareer: {
      qualification: 'B.Com / Finance',
      institution: 'NYU Stern',
      occupation: 'Financial Analyst',
      employer: 'Goldman Sachs',
      annualIncome: '$110,000 / yr',
      workLocation: 'New York, USA',
    },
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onProfilePress,
  onNotificationPress,
  onAdminPress,
  unreadCount,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Location selector state
  const [selectedLocation, setSelectedLocation] = useState('New York, USA');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Cards deck state
  const [profilesList, setProfilesList] = useState<any[]>(DISCOVERY_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pan animation values for swipe card
  const position = useRef(new Animated.ValueXY()).current;

  // Initialize and merge mockProfiles from database
  useEffect(() => {
    async function loadData() {
      const stored = await StorageService.getAllProfiles();
      if (stored && stored.length > 0) {
        const mapped = stored.slice(0, 10).map((p: MatrimonyProfile, idx: number) => ({
          ...p,
          distance: `${(idx * 2.3 + 3.4).toFixed(1)} km away`,
        }));
        setProfilesList([...DISCOVERY_PROFILES, ...mapped]);
      }
    }
    loadData();
  }, []);

  // Card rotation interpolator (-16deg to 16deg)
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-16deg', '0deg', '16deg'],
    extrapolate: 'clamp',
  });

  // Stamp badge opacities & scale (dynamic tactile feel)
  const likeOpacity = position.x.interpolate({
    inputRange: [10, 75],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const likeScale = position.x.interpolate({
    inputRange: [0, 80],
    outputRange: [0.5, 1.1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-75, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const dislikeScale = position.x.interpolate({
    inputRange: [-80, 0],
    outputRange: [1.1, 0.5],
    extrapolate: 'clamp',
  });

  // Next card scale and position interpolator
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const profilesListRef = useRef(profilesList);
  useEffect(() => {
    profilesListRef.current = profilesList;
  }, [profilesList]);

  // Robust PanResponder with capture delegation
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onMoveShouldSetPanResponderCapture: (_, gesture) => Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        // If movement is very small, treat as a tap to open profile details
        if (Math.abs(gesture.dx) < 8 && Math.abs(gesture.dy) < 8) {
          const profile = profilesListRef.current[currentIndexRef.current];
          if (profile) {
            onProfilePress(profile as MatrimonyProfile);
          }
          return;
        }

        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
      onPanResponderTerminate: () => {
        resetPosition();
      },
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left' | 'up') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 150 : direction === 'left' ? -SCREEN_WIDTH - 150 : 0;
    const y = direction === 'up' ? -SCREEN_HEIGHT : 0;

    Animated.timing(position, {
      toValue: { x, y },
      duration: 220,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left' | 'up') => {
    const item = profilesListRef.current[currentIndexRef.current];

    if (direction === 'right') {
      // Like / Send interest
      StorageService.sendInterest('my_profile', item?.id || 'usr_matched').catch(() => {});
    }

    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(prev => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 60,
      useNativeDriver: false,
    }).start();
  };

  const currentProfile = profilesList[currentIndex];
  const nextProfile = profilesList[currentIndex + 1];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── Top Bar: Location + Filter Button ──────────────────────── */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 6, 14) }]}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>
            {isTa ? 'இருப்பிடம்' : 'Location'}
          </Text>
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => setShowLocationModal(true)}
            activeOpacity={0.7}
          >
            {/* Purple Map Pin */}
            <Svg width={18} height={18} viewBox="0 0 24 24" fill={BRAND_PURPLE}>
              <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </Svg>
            <Text style={styles.locationText}>{selectedLocation}</Text>
            {/* Chevron Down */}
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth={2}>
              <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Filter Button on Top Right */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.75}
        >
          {/* Sliders / Filter Icon */}
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ─── Main Fixed Viewport Screen Body (No ScrollView Interception) ─── */}
      <View
        style={[
          styles.screenBody,
          { paddingBottom: Math.max(insets.bottom + 85, 105) },
        ]}
      >
        {/* ─── Stories / Avatar Row ─────────────────────────────────── */}
        <View style={styles.storiesWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          >
            {/* Add Avatar Slot */}
            <TouchableOpacity
              style={styles.storyItem}
              activeOpacity={0.8}
              onPress={() => Alert.alert(isTa ? 'கதை சேர்க்க' : 'Add Story', isTa ? 'உங்கள் புகைப்படத்தைப் பகிரவும்' : 'Upload a photo to your daily moments')}
            >
              <View style={styles.addStoryCircle}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }}
                  style={styles.addStoryBgImage}
                />
                <View style={styles.addStoryOverlay} />
                <View style={styles.addPlusCenterBadge}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.8}>
                    <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </Svg>
                </View>
              </View>
              <Text style={styles.storyName}>{isTa ? 'சேர்க்க' : 'Add'}</Text>
            </TouchableOpacity>

            {/* User Avatars with Purple Ring */}
            {STORIES_DATA.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.storyItem}
                activeOpacity={0.8}
                onPress={() => {
                  const match = profilesList.find(p => p.name?.toLowerCase().includes(item.name.toLowerCase()));
                  if (match) onProfilePress(match as MatrimonyProfile);
                }}
              >
                <View style={styles.storyRing}>
                  <Image source={{ uri: item.image }} style={styles.storyImage} />
                </View>
                <Text style={styles.storyName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ─── Swipeable Card Deck Section ─────────────────────────── */}
        <View style={styles.deckContainer}>
          {currentProfile ? (
            <View style={styles.cardWrapper}>
              {/* Next Card in Background */}
              {nextProfile && (
                <Animated.View
                  style={[
                    styles.card,
                    styles.nextCard,
                    { transform: [{ scale: nextCardScale }] },
                  ]}
                >
                  <Image
                    source={{ uri: nextProfile.photos?.[0] || STORIES_DATA[0].image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  {/* Distance Pill */}
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>{nextProfile.distance || '10.5 km away'}</Text>
                  </View>

                  {/* Bottom Info Gradient Area */}
                  <View style={styles.cardInfoArea}>
                    <View style={styles.nameRow}>
                      <Text style={styles.profileName}>{nextProfile.name}</Text>
                      {/* Golden Verified Badge */}
                      <View style={styles.verifiedStarBadge}>
                        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M5 13l4 4L19 7"
                            stroke="#18181D"
                            strokeWidth="3.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    </View>
                    <Text style={styles.profileLocation}>
                      {`${nextProfile.currentCity || 'NEW YORK'}, ${nextProfile.currentCountry || 'USA'}`.toUpperCase()}
                    </Text>
                  </View>
                </Animated.View>
              )}

              {/* Top Interactive Swipable Card */}
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.card,
                  {
                    transform: [
                      { translateX: position.x },
                      { translateY: position.y },
                      { rotate },
                    ],
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Image
                    source={{ uri: currentProfile.photos?.[0] || STORIES_DATA[1].image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />

                  {/* Top-Left Distance Pill */}
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>{currentProfile.distance || '12.6 km away'}</Text>
                  </View>

                  {/* Top-Right 3-Dots Menu */}
                  <TouchableOpacity
                    style={styles.dotsButton}
                    onPress={() => onProfilePress(currentProfile as MatrimonyProfile)}
                    activeOpacity={0.8}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FFFFFF">
                      <Circle cx="12" cy="5" r="2" />
                      <Circle cx="12" cy="12" r="2" />
                      <Circle cx="12" cy="19" r="2" />
                    </Svg>
                  </TouchableOpacity>

                  {/* ── Dynamic Swipe Stamp Badges Matching Reference Screenshots ── */}
                  {/* LIKE Badge (Heart stamp in center during drag right: Purple circle with white heart) */}
                  <Animated.View
                    style={[
                      styles.stampBadge,
                      styles.likeStamp,
                      {
                        opacity: likeOpacity,
                        transform: [{ scale: likeScale }],
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <Svg width={34} height={34} viewBox="0 0 24 24" fill="#FFFFFF">
                      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </Svg>
                  </Animated.View>

                  {/* DISLIKE Badge (Cross stamp in center during drag left: White circle with purple cross) */}
                  <Animated.View
                    style={[
                      styles.stampBadge,
                      styles.dislikeStamp,
                      {
                        opacity: dislikeOpacity,
                        transform: [{ scale: dislikeScale }],
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={3.2}>
                      <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </Animated.View>

                  {/* Bottom Information Overlay */}
                  <View style={styles.cardInfoArea}>
                    <View style={styles.nameRow}>
                      <Text style={styles.profileName}>{currentProfile.name}</Text>
                      {/* Golden Verified Badge with checkmark */}
                      <View style={styles.verifiedStarBadge}>
                        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M5 13l4 4L19 7"
                            stroke="#18181D"
                            strokeWidth="3.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    </View>
                    <Text style={styles.profileLocation}>
                      {`${currentProfile.currentCity || 'NEWYORK'}, ${currentProfile.currentCountry || 'USA'}`.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={1.5}>
                <Circle cx="12" cy="12" r="10" />
                <Path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.emptyTitle}>
                {isTa ? 'புதிய வரன்கள் இல்லை' : 'All caught up!'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {isTa
                  ? 'நீங்கள் அனைத்து வரன்களையும் பார்வையிட்டுள்ளீர்கள். மீண்டும் பார்க்க தொடங்குங்கள்.'
                  : "You've reviewed all suggested profiles. Tap below to reload."}
              </Text>
              <TouchableOpacity
                style={styles.reloadButton}
                onPress={() => setCurrentIndex(0)}
                activeOpacity={0.8}
              >
                <Text style={styles.reloadButtonText}>
                  {isTa ? 'மீண்டும் தொடங்கு' : 'Reload Profiles'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ─── Floating Action Buttons: Cross, Heart, Star ────────── */}
        <View style={styles.actionsRow}>
          {/* Left: Cross / Pass Button */}
          <TouchableOpacity
            style={styles.crossBtn}
            onPress={() => forceSwipe('left')}
            activeOpacity={0.8}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.8}>
              <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          {/* Center: Heart / Like Button */}
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => forceSwipe('right')}
            activeOpacity={0.85}
          >
            <Svg width={30} height={30} viewBox="0 0 24 24" fill="#FFFFFF">
              <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </Svg>
          </TouchableOpacity>

          {/* Right: Star / Super Like Button */}
          <TouchableOpacity
            style={styles.starBtn}
            onPress={() => {
              Alert.alert(
                isTa ? 'சிறப்பு விருப்பம் ⭐' : 'Super Like ⭐',
                isTa ? 'இந்த வரனுக்கு சிறப்பு விருப்பம் அனுப்பப்பட்டது!' : 'Sent a Super Like to this profile!'
              );
              forceSwipe('right');
            }}
            activeOpacity={0.8}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="#111827">
              <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Location Selector Modal ──────────────────────────────── */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View
            style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Location'}
              </Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {['New York, USA', 'Chennai, India', 'Coimbatore, India', 'Bangalore, India', 'San Francisco, USA', 'London, UK'].map(loc => (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.locationItemRow,
                  selectedLocation === loc && styles.locationItemRowActive,
                ]}
                onPress={() => {
                  setSelectedLocation(loc);
                  setShowLocationModal(false);
                }}
              >
                <Text
                  style={[
                    styles.locationItemText,
                    selectedLocation === loc && styles.locationItemTextActive,
                  ]}
                >
                  {loc}
                </Text>
                {selectedLocation === loc && (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.6}>
                    <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ─── Filter Options Modal ─────────────────────────────────── */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View
            style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom + 20, 28) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'வடிகட்டிகள்' : 'Filter Matches'}
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>
              {isTa ? 'அதிகபட்ச தூரம்' : 'Maximum Distance'}
            </Text>
            <View style={styles.filterChipsRow}>
              {['5 km', '15 km', '30 km', '50+ km'].map((dist, i) => (
                <View key={dist} style={[styles.filterChip, i === 1 && styles.filterChipActive]}>
                  <Text style={[styles.filterChipText, i === 1 && styles.filterChipTextActive]}>{dist}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.filterSectionTitle, { marginTop: 18 }]}>
              {isTa ? 'வயது வரம்பு' : 'Age Range'}
            </Text>
            <View style={styles.filterChipsRow}>
              {['20 - 25', '24 - 28', '28 - 32', 'All'].map((age, i) => (
                <View key={age} style={[styles.filterChip, i === 1 && styles.filterChipActive]}>
                  <Text style={[styles.filterChipText, i === 1 && styles.filterChipTextActive]}>{age}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyFilterBtn}
              onPress={() => setShowFilterModal(false)}
              activeOpacity={0.88}
            >
              <Text style={styles.applyFilterBtnText}>
                {isTa ? 'பொருத்தங்களைக் காட்டு' : 'Apply Filters'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  storiesWrap: {
    flexGrow: 0,
    paddingTop: 4,
    paddingBottom: 4,
  },
  scrollContent: {
    paddingTop: 8,
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'column',
  },
  locationLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stories Row */
  storiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    width: 68,
  },
  addStoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  addStoryBgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  addStoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  addPlusCenterBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.2,
    borderColor: BRAND_PURPLE,
    padding: 2,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  storyName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 6,
    textAlign: 'center',
  },

  /* Card Deck */
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  cardWrapper: {
    width: SCREEN_WIDTH - 32,
    flex: 1,
    maxHeight: Math.min(SCREEN_HEIGHT * 0.54, 460),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  nextCard: {
    top: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  /* Distance Badge */
  distanceBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Dots Menu Button */
  dotsButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom Info Area */
  cardInfoArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  verifiedStarBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileLocation: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1,
    marginTop: 4,
  },

  /* Dynamic Stamp Badges */
  stampBadge: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  likeStamp: {
    backgroundColor: BRAND_PURPLE,
  },
  dislikeStamp: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  /* Action Buttons Row */
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingTop: 10,
    paddingBottom: 6,
  },
  crossBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  heartBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  starBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  /* Empty Deck State */
  emptyContainer: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.48,
    borderRadius: 26,
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  reloadButton: {
    backgroundColor: BRAND_PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 22,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Modal Base */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 8,
  },
  locationItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  locationItemRowActive: {
    backgroundColor: '#F4F2FF',
    borderRadius: 10,
  },
  locationItemText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  locationItemTextActive: {
    color: BRAND_PURPLE,
    fontWeight: '700',
  },

  /* Filter Modal Content */
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: BRAND_PURPLE,
  },
  filterChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  applyFilterBtn: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  applyFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
