/**
 * Manamaalai Matrimony (மணமாலை) — Modern Social-Matrimonial Feed
 *
 * Implements the exact UI reference design (media_1794399256147_d8d6509a.png):
 * 1. Sky-Blue Top Gradient Header:
 *    - Circular Hamburger Menu button (☰)
 *    - Bold "Home" Title with subtle Tamil/English switch
 *    - White capsule notification badge (🔔 3)
 *    - White circular search button (🔍)
 * 2. Horizontal Stories Bar:
 *    - "Your Story" vertical card with user avatar & bright blue "+" icon overlay
 *    - Candidate Story cards with full photo & mini avatar badge in top-left corner
 * 3. Varan Showcase Card (Centerpiece):
 *    - Header: Avatar, Name + blue verified badge (✔), 3 mins ago • Location • 🌐, and Relationship pill (Brother, Daughter, Self)
 *    - 3-Photo Fanned Showcase: Angled left/right photos with prominent center card & tap-to-cycle
 *    - Clean bio description text paragraph
 *    - Matrimonial chips (Caste, Rasi/Nakshatram, Career, District)
 *    - Action Bar: [♥ 2.3k  💬 2.1k] capsule, [💬 Comments here / 💌 Send Interest] capsule, and circular [⋮] menu
 *    - Interactive gesture swiping (PanResponder) for Like / Pass
 * 4. Rich Matrimonial Features below (Dasa Porutham, Community Hubs, District Directory)
 */

import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Language } from '../localization';
import { INITIAL_PROFILES } from '../data/mockProfiles';
import { StorageService } from '../services/storage';
import { MatrimonyProfile } from '../types';
import { HomeFilterModal, FilterState } from '../components/HomeFilterModal';
import { HomeMatrimonyFeatures } from '../components/HomeMatrimonyFeatures';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

export interface HomeScreenProps {
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
  unreadCount?: number;
  isAdmin?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onProfilePress,
  onSearchPress,
  onMembershipPress,
  onInterestsTabPress,
  onChatPress,
  onDailyRecommendationsPress,
  onViewHoroscopePorutham,
  onFamilyCirclePress,
  onRelationshipManagerPress,
  unreadCount = 0,
  isAdmin = false,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // State
  const [profilesList, setProfilesList] = useState<MatrimonyProfile[]>(INITIAL_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<Record<string, boolean>>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Chennai, Tamil Nadu');

  // Swipe animation values
  const position = useRef(new Animated.ValueXY()).current;
  const panStartTimeRef = useRef(0);

  // Active profiles safe access
  const activeProfile = profilesList[currentIndex % profilesList.length] || profilesList[0];
  const nextProfile = profilesList[(currentIndex + 1) % profilesList.length] || profilesList[1];

  // Helper to ensure 3 distinct photos for the 3-photo fanned card
  const photos = useMemo(() => {
    if (!activeProfile) return [];
    const base = activeProfile.photos || [];
    const fallbacks = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    ];
    return [
      base[0] || fallbacks[0],
      base[1] || fallbacks[1],
      base[2] || fallbacks[2],
    ];
  }, [activeProfile]);

  // Keep references in sync for PanResponder release handler
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const profilesListRef = useRef(profilesList);
  profilesListRef.current = profilesList;

  // Horizontal pan responder for cards
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 12,
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 12,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        panStartTimeRef.current = Date.now();
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy * 0.2 });
      },
      onPanResponderRelease: (_, gesture) => {
        const elapsed = Date.now() - panStartTimeRef.current;
        const dist = Math.hypot(gesture.dx, gesture.dy);

        // Immediate tap opens details
        if (dist < 18 || (elapsed < 320 && dist < 28)) {
          resetPosition();
          const target = profilesListRef.current[currentIndexRef.current % profilesListRef.current.length];
          if (target) onProfilePress(target);
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

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const target = profilesList[currentIndex % profilesList.length];
    if (direction === 'right' && target) {
      handleExpressInterest(target);
    }
    position.setValue({ x: 0, y: 0 });
    setActivePhotoIndex(0);
    setCurrentIndex(prev => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  const handleExpressInterest = (profile: MatrimonyProfile) => {
    setLikedProfiles(prev => ({ ...prev, [profile.id]: true }));
    StorageService.sendInterest('my-profile', profile.id).catch(() => {});
    Alert.alert(
      isTa ? 'விருப்பம் தெரிவிக்கப்பட்டது! 💌' : 'Interest Sent! 💌',
      isTa
        ? `${profile.name} அவர்களுக்கு உங்கள் திருமண விருப்பம் தெரிவிக்கப்பட்டது.`
        : `Your matrimonial interest was conveyed to ${profile.name}'s family.`
    );
  };

  const handleCardPress = (profile: MatrimonyProfile) => {
    onProfilePress(profile);
  };

  const handleOpenChat = (profile: MatrimonyProfile) => {
    if (onChatPress) {
      onChatPress(profile);
    } else {
      Alert.alert(
        isTa ? 'அரட்டை' : 'Chat',
        isTa ? `${profile.name} உடன் அரட்டை தொடங்கப்படுகிறது.` : `Connecting with ${profile.name}...`
      );
    }
  };

  const handleMoreOptions = (profile: MatrimonyProfile) => {
    Alert.alert(
      profile.name,
      isTa ? 'விருப்பங்களைத் தேர்ந்தெடுக்கவும்' : 'Select an option',
      [
        {
          text: isTa ? 'ஜாதகப் பொருத்தம் பார்க்க' : 'View Horoscope Match',
          onPress: () => {
            if (onViewHoroscopePorutham && profile.horoscope) {
              onViewHoroscopePorutham(profile.horoscope);
            } else {
              Alert.alert(
                'ஜாதகம் / Horoscope',
                `ராசி: ${profile.horoscope?.rasi || 'Mesham'} | நட்சத்திரம்: ${profile.horoscope?.nakshatram || 'Ashwini'}`
              );
            }
          },
        },
        {
          text: isTa ? 'பட்டியலில் சேர்க்க' : 'Add to Shortlist',
          onPress: () => {
            StorageService.toggleShortlist(profile.id).catch(() => {});
            Alert.alert(isTa ? 'சேர்க்கப்பட்டது' : 'Shortlisted', `${profile.name} shortlisted.`);
          },
        },
        { text: isTa ? 'மூடு' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Card transform interpolations
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [20, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Center photo selection & cycling
  const centerPhoto = photos[activePhotoIndex % photos.length] || photos[0];
  const leftPhoto = photos[(activePhotoIndex + 1) % photos.length] || photos[1];
  const rightPhoto = photos[(activePhotoIndex + 2) % photos.length] || photos[2];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Sky-Blue Gradient Background */}
      <View style={[styles.skyGradientBackground, { height: 260 + insets.top }]}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#BFE3FD" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#D8ECFD" stopOpacity="0.85" />
              <Stop offset="1" stopColor="#F6FAFE" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#skyGrad)" />
        </Svg>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 14) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Bar (Matches Screenshot) */}
        <View style={styles.headerBar}>
          {/* Left: Hamburger Button + "Home" Title */}
          <View style={styles.headerLeftGroup}>
            <TouchableOpacity
              style={styles.hamburgerBtn}
              activeOpacity={0.8}
              onPress={onAdminPress}
              accessibilityLabel="Menu"
            >
              <Svg width={20} height={15} viewBox="0 0 20 15" fill="none">
                <Path d="M1.5 2H18.5M1.5 7.5H13.5M1.5 13H18.5" stroke="#18181B" strokeWidth={2.4} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>

            <Text style={styles.headerTitleText}>Home</Text>

            {/* Language switch capsule */}
            <TouchableOpacity
              style={styles.langPill}
              activeOpacity={0.8}
              onPress={onToggleLanguage}
            >
              <Text style={styles.langPillText}>{isTa ? 'தமிழ்' : 'EN'}</Text>
            </TouchableOpacity>
          </View>

          {/* Right: Notification Capsule + Circular Search Button */}
          <View style={styles.headerRightGroup}>
            {/* Notification Capsule with Bell + Count */}
            <TouchableOpacity
              style={styles.notifCapsule}
              activeOpacity={0.8}
              onPress={onNotificationPress}
              accessibilityLabel="Notifications"
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={2}>
                <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" />
                <Path d="M13.73 21A2 2 0 0 1 10.27 21" />
              </Svg>
              <Text style={styles.notifCountText}>
                {unreadCount > 0 ? unreadCount : 3}
              </Text>
            </TouchableOpacity>

            {/* Circular Search Button */}
            <TouchableOpacity
              style={styles.searchCircleBtn}
              activeOpacity={0.8}
              onPress={() => onSearchPress()}
              accessibilityLabel="Search"
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={2.2}>
                <Circle cx={11} cy={11} r={7.5} />
                <Path d="M21 21L16.5 16.5" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Horizontal Stories Bar (Matches Screenshot) */}
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScrollContent}
          >
            {/* "Your Story" Card */}
            <TouchableOpacity
              style={styles.yourStoryCard}
              activeOpacity={0.85}
              onPress={() => onProfilePress(profilesList[0])}
            >
              <View style={styles.yourStoryAvatarHolder}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                  }}
                  style={styles.yourStoryAvatar}
                />
                <View style={styles.plusIconBadge}>
                  <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                    <Path d="M6 1V11M1 6H11" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
                  </Svg>
                </View>
              </View>
              <Text style={styles.yourStoryLabel} numberOfLines={1}>
                {isTa ? 'உங்கள் கதை' : 'Your Story'}
              </Text>
            </TouchableOpacity>

            {/* Candidate Stories Cards */}
            {profilesList.slice(0, 8).map((item, idx) => (
              <TouchableOpacity
                key={item.id || idx}
                style={styles.storyCard}
                activeOpacity={0.85}
                onPress={() => onProfilePress(item)}
              >
                <Image source={{ uri: item.photos[0] }} style={styles.storyCardBg} resizeMode="cover" />
                <View style={styles.storyMiniBadge}>
                  <Image source={{ uri: item.photos[0] }} style={styles.storyMiniAvatar} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Centerpiece Feed Post / Varan Showcase Card */}
        {activeProfile && (
          <View style={styles.feedCardWrapper}>
            {/* Gesture-enabled Post Card */}
            <Animated.View
              style={[
                styles.feedPostCard,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              {/* Card Header (Avatar, Name, Verified, Subtitle, Relationship) */}
              <View style={styles.postHeader}>
                <TouchableOpacity
                  style={styles.postAuthorGroup}
                  activeOpacity={0.85}
                  onPress={() => handleCardPress(activeProfile)}
                >
                  <Image source={{ uri: activeProfile.photos[0] }} style={styles.postAvatar} />
                  <View style={styles.authorMetaColumn}>
                    <View style={styles.authorNameRow}>
                      <Text style={styles.authorNameText} numberOfLines={1}>
                        {activeProfile.name}
                      </Text>
                      {/* Blue Verified Badge */}
                      <View style={styles.verifiedCheckBadge}>
                        <Svg width={14} height={14} viewBox="0 0 24 24" fill="#0095F6">
                          <Circle cx={12} cy={12} r={10} />
                          <Path d="M8 12.5L10.5 15L16 9.5" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                      </View>
                    </View>
                    <Text style={styles.authorSubText} numberOfLines={1}>
                      3 mins ago • {activeProfile.currentCity || 'Chennai'} • 🌐
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Relationship Pill (e.g., Brother, Daughter, Self) */}
                <View style={styles.relationPill}>
                  <Text style={styles.relationPillText}>
                    {activeProfile.createdFor === 'daughter'
                      ? 'Daughter'
                      : activeProfile.createdFor === 'brother'
                      ? 'Brother'
                      : activeProfile.createdFor === 'son'
                      ? 'Son'
                      : activeProfile.createdFor === 'sister'
                      ? 'Sister'
                      : 'Self'}
                  </Text>
                </View>
              </View>

              {/* 3-Photo Layered Showcase (Signature Centerpiece) */}
              <View style={styles.photoShowcaseContainer}>
                {/* Left Angled Photo */}
                <TouchableOpacity
                  style={[styles.angledCardLeft]}
                  activeOpacity={0.9}
                  onPress={() => setActivePhotoIndex(prev => (prev + 1) % photos.length)}
                >
                  <Image source={{ uri: leftPhoto }} style={styles.angledPhoto} resizeMode="cover" />
                </TouchableOpacity>

                {/* Right Angled Photo */}
                <TouchableOpacity
                  style={[styles.angledCardRight]}
                  activeOpacity={0.9}
                  onPress={() => setActivePhotoIndex(prev => (prev + 2) % photos.length)}
                >
                  <Image source={{ uri: rightPhoto }} style={styles.angledPhoto} resizeMode="cover" />
                </TouchableOpacity>

                {/* Center Foreground Photo */}
                <TouchableOpacity
                  style={styles.centerPhotoCard}
                  activeOpacity={0.95}
                  onPress={() => handleCardPress(activeProfile)}
                >
                  <Image source={{ uri: centerPhoto }} style={styles.centerPhoto} resizeMode="cover" />
                </TouchableOpacity>

                {/* Dynamic Swiping Stamps */}
                <Animated.View style={[styles.stampPill, styles.likeStamp, { opacity: likeOpacity }]}>
                  <Text style={styles.likeStampText}>INTEREST 💌</Text>
                </Animated.View>
                <Animated.View style={[styles.stampPill, styles.passStamp, { opacity: passOpacity }]}>
                  <Text style={styles.passStampText}>PASS ✕</Text>
                </Animated.View>
              </View>

              {/* Bio Description Paragraph */}
              <Text style={styles.postDescriptionText} numberOfLines={3}>
                {activeProfile.about ||
                  "Seeking a caring, cultured alliance from an affectionate Tamil family. Values traditional harmony alongside modern career pursuits."}
              </Text>

              {/* Matrimonial Info Tags */}
              <View style={styles.matrimonyTagsRow}>
                <View style={styles.biodataTag}>
                  <Text style={styles.biodataTagText}>🏷️ {activeProfile.caste || 'Tamil Community'}</Text>
                </View>
                <View style={styles.biodataTag}>
                  <Text style={styles.biodataTagText}>
                    🪐 {activeProfile.horoscope?.rasi?.split(' ')[0] || 'Simmam'} • {activeProfile.horoscope?.nakshatram?.split(' ')[0] || 'Magam'}
                  </Text>
                </View>
                <View style={styles.biodataTag}>
                  <Text style={styles.biodataTagText}>
                    💼 {activeProfile.educationCareer?.occupation?.slice(0, 18) || 'Professional'}
                  </Text>
                </View>
                <View style={styles.biodataTag}>
                  <Text style={styles.biodataTagText}>📍 {activeProfile.nativeDistrict || 'Chennai'}</Text>
                </View>
              </View>

              {/* Action Bar (Matches Screenshot) */}
              <View style={styles.postActionBar}>
                {/* Left Capsule: [♥ 2.3k  💬 2.1k] */}
                <View style={styles.actionLeftCapsule}>
                  <TouchableOpacity
                    style={styles.counterActionItem}
                    activeOpacity={0.7}
                    onPress={() => handleExpressInterest(activeProfile)}
                  >
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill={likedProfiles[activeProfile.id] ? '#EF4444' : 'none'}>
                      <Path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke={likedProfiles[activeProfile.id] ? '#EF4444' : '#18181B'}
                        strokeWidth={1.8}
                      />
                    </Svg>
                    <Text style={styles.counterText}>2.3k</Text>
                  </TouchableOpacity>

                  <View style={styles.capsuleDivider} />

                  <TouchableOpacity
                    style={styles.counterActionItem}
                    activeOpacity={0.7}
                    onPress={() => handleOpenChat(activeProfile)}
                  >
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                        stroke="#18181B"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    <Text style={styles.counterText}>2.1k</Text>
                  </TouchableOpacity>
                </View>

                {/* Center Capsule: [💬 Comments here / 💌 Send Interest] */}
                <TouchableOpacity
                  style={styles.commentsCapsule}
                  activeOpacity={0.8}
                  onPress={() => handleExpressInterest(activeProfile)}
                >
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      stroke="#4B5563"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text style={styles.commentsCapsuleText}>
                    {isTa ? 'விருப்பம் தெரிவிக்க' : 'Comments here'}
                  </Text>
                </TouchableOpacity>

                {/* Right Button: [⋮] Options */}
                <TouchableOpacity
                  style={styles.moreCircleBtn}
                  activeOpacity={0.8}
                  onPress={() => handleMoreOptions(activeProfile)}
                >
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={5} r={1.8} fill="#18181B" />
                    <Circle cx={12} cy={12} r={1.8} fill="#18181B" />
                    <Circle cx={12} cy={19} r={1.8} fill="#18181B" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        )}

        {/* 4. Second Feed Post (for continuous scrolling feed) */}
        {nextProfile && (
          <View style={styles.feedCardWrapper}>
            <TouchableOpacity
              style={styles.feedPostCard}
              activeOpacity={0.92}
              onPress={() => handleCardPress(nextProfile)}
            >
              {/* Header */}
              <View style={styles.postHeader}>
                <View style={styles.postAuthorGroup}>
                  <Image source={{ uri: nextProfile.photos[0] }} style={styles.postAvatar} />
                  <View style={styles.authorMetaColumn}>
                    <View style={styles.authorNameRow}>
                      <Text style={styles.authorNameText} numberOfLines={1}>
                        {nextProfile.name}
                      </Text>
                      <View style={styles.verifiedCheckBadge}>
                        <Svg width={14} height={14} viewBox="0 0 24 24" fill="#0095F6">
                          <Circle cx={12} cy={12} r={10} />
                          <Path d="M8 12.5L10.5 15L16 9.5" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                      </View>
                    </View>
                    <Text style={styles.authorSubText} numberOfLines={1}>
                      12 mins ago • {nextProfile.currentCity || 'Coimbatore'} • 🌐
                    </Text>
                  </View>
                </View>
                <View style={styles.relationPill}>
                  <Text style={styles.relationPillText}>
                    {nextProfile.createdFor === 'daughter' ? 'Daughter' : 'Parents'}
                  </Text>
                </View>
              </View>

              {/* 3-Photo Showcase for next profile */}
              <View style={styles.photoShowcaseContainer}>
                <View style={[styles.angledCardLeft]}>
                  <Image
                    source={{ uri: nextProfile.photos[1] || nextProfile.photos[0] }}
                    style={styles.angledPhoto}
                    resizeMode="cover"
                  />
                </View>
                <View style={[styles.angledCardRight]}>
                  <Image
                    source={{ uri: nextProfile.photos[2] || nextProfile.photos[0] }}
                    style={styles.angledPhoto}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.centerPhotoCard}>
                  <Image source={{ uri: nextProfile.photos[0] }} style={styles.centerPhoto} resizeMode="cover" />
                </View>
              </View>

              {/* Description */}
              <Text style={styles.postDescriptionText} numberOfLines={3}>
                {nextProfile.about}
              </Text>

              {/* Action Bar */}
              <View style={styles.postActionBar}>
                <View style={styles.actionLeftCapsule}>
                  <View style={styles.counterActionItem}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke="#18181B"
                        strokeWidth={1.8}
                      />
                    </Svg>
                    <Text style={styles.counterText}>1.8k</Text>
                  </View>
                  <View style={styles.capsuleDivider} />
                  <View style={styles.counterActionItem}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                        stroke="#18181B"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    <Text style={styles.counterText}>940</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.commentsCapsule}
                  onPress={() => handleExpressInterest(nextProfile)}
                >
                  <Text style={styles.commentsCapsuleText}>
                    {isTa ? 'விருப்பம் தெரிவிக்க' : 'Comments here'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.moreCircleBtn}
                  onPress={() => handleMoreOptions(nextProfile)}
                >
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={5} r={1.8} fill="#18181B" />
                    <Circle cx={12} cy={12} r={1.8} fill="#18181B" />
                    <Circle cx={12} cy={19} r={1.8} fill="#18181B" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* 5. Traditional Matrimonial Discovery Features */}
        <HomeMatrimonyFeatures
          language={language}
          onSearchPress={query => onSearchPress(query)}
          onProfilePress={onProfilePress}
          onViewHoroscopePorutham={onViewHoroscopePorutham}
          onFamilyCirclePress={onFamilyCirclePress}
          onRelationshipManagerPress={onRelationshipManagerPress}
          onMembershipPress={onMembershipPress}
        />

        {/* Extra Bottom Spacing for Floating Tab Bar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Filter Modal */}
      <HomeFilterModal
        visible={showFilterModal}
        isTa={isTa}
        currentLocation={selectedLocation}
        onClose={() => setShowFilterModal(false)}
        onApply={(filters: FilterState) => {
          setShowFilterModal(false);
          if (filters.location) setSelectedLocation(filters.location);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFE',
  },
  skyGradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // 1. Header Bar Styles
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hamburgerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.3,
  },
  langPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notifCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  notifCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
  },
  searchCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // 2. Horizontal Stories Styles
  storiesContainer: {
    marginTop: 6,
    marginBottom: 8,
  },
  storiesScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  yourStoryCard: {
    width: 76,
    height: 98,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  yourStoryAvatarHolder: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yourStoryAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
  },
  plusIconBadge: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0095F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yourStoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  storyCard: {
    width: 76,
    height: 98,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  storyCardBg: {
    width: '100%',
    height: '100%',
  },
  storyMiniBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  storyMiniAvatar: {
    width: '100%',
    height: '100%',
  },

  // 3. Varan Showcase Card Styles
  feedCardWrapper: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  feedPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  postAuthorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  postAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E5E7EB',
  },
  authorMetaColumn: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
  },
  verifiedCheckBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorSubText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  relationPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  relationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },

  // 3-Photo Layered Showcase Container
  photoShowcaseContainer: {
    height: 245,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  angledCardLeft: {
    position: 'absolute',
    width: 142,
    height: 195,
    borderRadius: 18,
    overflow: 'hidden',
    transform: [{ rotate: '-9deg' }, { translateX: -48 }, { translateY: 6 }],
    backgroundColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  angledCardRight: {
    position: 'absolute',
    width: 142,
    height: 195,
    borderRadius: 18,
    overflow: 'hidden',
    transform: [{ rotate: '9deg' }, { translateX: 48 }, { translateY: 6 }],
    backgroundColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  angledPhoto: {
    width: '100%',
    height: '100%',
  },
  centerPhotoCard: {
    width: 178,
    height: 228,
    borderRadius: 22,
    overflow: 'hidden',
    zIndex: 5,
    backgroundColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  centerPhoto: {
    width: '100%',
    height: '100%',
  },

  // Description & Tags
  postDescriptionText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
    marginVertical: 8,
    fontWeight: '400',
  },
  matrimonyTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 6,
  },
  biodataTag: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  biodataTagText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },

  // Post Action Bar
  postActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  actionLeftCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 12,
  },
  counterActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  capsuleDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#D1D5DB',
  },
  commentsCapsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 6,
  },
  commentsCapsuleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  moreCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Decision Stamps
  stampPill: {
    position: 'absolute',
    top: 20,
    zIndex: 15,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
  },
  likeStamp: {
    left: 20,
    borderColor: '#10B981',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transform: [{ rotate: '-12deg' }],
  },
  likeStampText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#10B981',
  },
  passStamp: {
    right: 20,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transform: [{ rotate: '12deg' }],
  },
  passStampText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#EF4444',
  },
});

export default HomeScreen;
