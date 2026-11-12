/**
 * Manamaalai Matrimony — Map Discovery & Nearby Matches Screen (2nd Tab)
 *
 * Implements the exact design from the reference screenshot:
 * - Fullscreen interactive light-mode street map with NYC street names (Broadway, Reade St, Chambers St, etc.)
 * - Top Search bar with purple search icon & purple filter button
 * - Circular profile avatar pins with purple rings and distance badges (1.2 Km, 1.4 Km, 1.8 Km, etc.)
 * - Current user GPS marker with pulsing translucent purple halo ring and directional arrow
 * - White circular GPS recenter FAB button with purple crosshairs
 * - Floating horizontal preview card carousel at bottom:
 *     - Avatar, Name & Age (e.g. "Marvin, 22 ✓"), Location ("NEWYORK, USA")
 *     - Purple circular action button with white heart icon
 *     - Next card peeking from the right margin
 * - Connected with HomeFilterModal and profile detail navigation
 */

import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { HomeFilterModal, FilterState } from '../components/HomeFilterModal';
import { Language } from '../localization';
import { StorageService } from '../services/storage';
import { MatrimonyProfile } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';
const CARD_WIDTH = SCREEN_WIDTH - 64;
const CARD_SPACING = 14;

interface MapProfile {
  id: string;
  name: string;
  age: number;
  gender: 'bride' | 'groom';
  currentCity: string;
  currentCountry: string;
  distance: string;
  distanceKm: number;
  avatar: string;
  photos: string[];
  xPercent: number; // 0 to 100 on map
  yPercent: number; // 0 to 100 on map
  about?: string;
  lifestyle?: any;
  educationCareer?: any;
}

const NEARBY_PROFILES: MapProfile[] = [
  {
    id: 'disc_1',
    name: 'Marvin',
    age: 22,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '1.8 Km',
    distanceKm: 1.8,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    xPercent: 43,
    yPercent: 39,
    about: 'Passionate about creative art, photography, culture and discovering meaningful connections.',
    lifestyle: { heightCm: 175, languagesKnown: ['English'] },
  },
  {
    id: 'disc_2',
    name: 'Jenny',
    age: 23,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '1.2 Km',
    distanceKm: 1.2,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    xPercent: 18,
    yPercent: 16,
    about: 'Architect by trade, coffee lover, always up for spontaneous weekend trips.',
    lifestyle: { heightCm: 168, languagesKnown: ['English'] },
  },
  {
    id: 'disc_3',
    name: 'Leslie',
    age: 24,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '1.4 Km',
    distanceKm: 1.4,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    xPercent: 72,
    yPercent: 15,
    about: 'Software engineer living in Manhattan. Enjoys museums, hiking, and acoustic music.',
    lifestyle: { heightCm: 170, languagesKnown: ['English'] },
  },
  {
    id: 'disc_4',
    name: 'Bessie',
    age: 25,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '1.8 Km',
    distanceKm: 1.8,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ],
    xPercent: 82,
    yPercent: 39,
    about: 'Finance professional, foodie, passionate about arts and theatre.',
    lifestyle: { heightCm: 165, languagesKnown: ['English'] },
  },
  {
    id: 'disc_5',
    name: 'Arlene',
    age: 24,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '1.9 Km',
    distanceKm: 1.9,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    xPercent: 23,
    yPercent: 60,
    about: 'Creative director, loves literature, design and thoughtful conversations.',
    lifestyle: { heightCm: 172, languagesKnown: ['English'] },
  },
  {
    id: 'disc_6',
    name: 'Ananya',
    age: 23,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '2.1 Km',
    distanceKm: 2.1,
    avatar: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    photos: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    xPercent: 88,
    yPercent: 65,
    about: 'Classical dancer and medical student. Values tradition and family bonds.',
    lifestyle: { heightCm: 163, languagesKnown: ['English', 'Tamil'] },
  },
];

interface SearchScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onNotificationPress?: () => void;
  onAdminPress?: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  initialQuery?: string;
  unreadCount?: number;
  isAdmin?: boolean;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  language,
  onProfilePress,
  initialQuery = '',
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('New York, USA');
  const [activeProfiles, setActiveProfiles] = useState<MapProfile[]>(NEARBY_PROFILES);

  const flatListRef = useRef<FlatList>(null);
  const gpsPulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for user GPS location
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gpsPulseAnim, {
          toValue: 1.25,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(gpsPulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Filter profiles based on search query
  const displayedProfiles = activeProfiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.currentCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProfileFromMap = (index: number) => {
    setSelectedProfileIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.1,
    });
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    if (index >= 0 && index < displayedProfiles.length) {
      setSelectedProfileIndex(index);
    }
  };

  const handleSendInterest = (profile: MapProfile) => {
    StorageService.sendInterest('my_profile', profile.id).catch(() => {});
    Alert.alert(
      isTa ? 'விருப்பம் அனுப்பப்பட்டது! 💜' : 'Interest Expressed! 💜',
      isTa
        ? `${profile.name} சுயவிவரத்திற்கு உங்கள் விருப்பம் தெரிவிக்கப்பட்டது.`
        : `You have successfully expressed interest in ${profile.name}.`
    );
  };

  const handleRecenter = () => {
    Alert.alert(
      isTa ? 'தற்போதைய இருப்பிடம்' : 'GPS Location',
      isTa ? 'உங்கள் இருப்பிடம் சீரமைக்கப்பட்டது: நியூயார்க், அமெரிக்கா' : 'Centered on your current location: New York, USA'
    );
  };

  const selectedProfile = displayedProfiles[selectedProfileIndex] || displayedProfiles[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Vector Street Map Background ─────────────────────────────── */}
      <View style={styles.mapContainer} pointerEvents="box-none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          {/* Base Map Land Background */}
          <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="#F7F8FA" />

          {/* Major Avenues & Streets (matching NYC Lower Manhattan layout in screenshot) */}
          <G stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
            {/* Broadway (Slanted Major Avenue) */}
            <Line x1={SCREEN_WIDTH * 0.45} y1="0" x2={SCREEN_WIDTH * 0.95} y2={SCREEN_HEIGHT * 0.45} stroke="#FFFFFF" strokeWidth="26" />
            {/* Park Row (Slanted Diagonal) */}
            <Line x1={SCREEN_WIDTH * 0.1} y1={SCREEN_HEIGHT * 0.65} x2={SCREEN_WIDTH * 0.8} y2={SCREEN_HEIGHT * 0.48} stroke="#FFFFFF" strokeWidth="24" />
            {/* Reade St */}
            <Line x1="0" y1={SCREEN_HEIGHT * 0.22} x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.15} />
            {/* Chambers St */}
            <Line x1="0" y1={SCREEN_HEIGHT * 0.29} x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.22} strokeWidth="28" />
            {/* Warren St */}
            <Line x1="0" y1={SCREEN_HEIGHT * 0.36} x2={SCREEN_WIDTH * 0.6} y2={SCREEN_HEIGHT * 0.32} />
            {/* Park Pl */}
            <Line x1="0" y1={SCREEN_HEIGHT * 0.44} x2={SCREEN_WIDTH * 0.55} y2={SCREEN_HEIGHT * 0.40} />
            {/* Barclay St */}
            <Line x1="0" y1={SCREEN_HEIGHT * 0.52} x2={SCREEN_WIDTH * 0.5} y2={SCREEN_HEIGHT * 0.48} />
            {/* Church St (Vertical Grid) */}
            <Line x1={SCREEN_WIDTH * 0.18} y1="0" x2={SCREEN_WIDTH * 0.05} y2={SCREEN_HEIGHT} strokeWidth="24" />
            {/* Spruce St */}
            <Line x1={SCREEN_WIDTH * 0.55} y1={SCREEN_HEIGHT * 0.55} x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.65} strokeWidth="20" />
            {/* Ann St */}
            <Line x1={SCREEN_WIDTH * 0.15} y1={SCREEN_HEIGHT * 0.68} x2={SCREEN_WIDTH * 0.7} y2={SCREEN_HEIGHT * 0.76} strokeWidth="20" />
          </G>

          {/* Road Borders & Contours */}
          <G stroke="#E8EAEF" strokeWidth="1.5" fill="none">
            <Line x1={SCREEN_WIDTH * 0.45} y1="0" x2={SCREEN_WIDTH * 0.95} y2={SCREEN_HEIGHT * 0.45} />
            <Line x1="0" y1={SCREEN_HEIGHT * 0.22} x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.15} />
            <Line x1="0" y1={SCREEN_HEIGHT * 0.29} x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.22} />
            <Line x1="0" y1={SCREEN_HEIGHT * 0.36} x2={SCREEN_WIDTH * 0.6} y2={SCREEN_HEIGHT * 0.32} />
            <Line x1="0" y1={SCREEN_HEIGHT * 0.44} x2={SCREEN_WIDTH * 0.55} y2={SCREEN_HEIGHT * 0.40} />
            <Line x1="0" y1={SCREEN_HEIGHT * 0.52} x2={SCREEN_WIDTH * 0.5} y2={SCREEN_HEIGHT * 0.48} />
            <Line x1={SCREEN_WIDTH * 0.1} y1={SCREEN_HEIGHT * 0.65} x2={SCREEN_WIDTH * 0.8} y2={SCREEN_HEIGHT * 0.48} />
            <Line x1={SCREEN_WIDTH * 0.55} y1={SCREEN_HEIGHT * 0.55} x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.65} />
            <Line x1={SCREEN_WIDTH * 0.15} y1={SCREEN_HEIGHT * 0.68} x2={SCREEN_WIDTH * 0.7} y2={SCREEN_HEIGHT * 0.76} />
          </G>

          {/* Directional Arrows on Roads */}
          <G stroke="#D1D5DB" strokeWidth="1.5" fill="none">
            <Path d={`M ${SCREEN_WIDTH * 0.42} ${SCREEN_HEIGHT * 0.15} l 4 -4 l -4 -4`} />
            <Path d={`M ${SCREEN_WIDTH * 0.65} ${SCREEN_HEIGHT * 0.3} l -4 4 l 4 4`} />
            <Path d={`M ${SCREEN_WIDTH * 0.2} ${SCREEN_HEIGHT * 0.4} l 4 -4 l -4 -4`} />
            <Path d={`M ${SCREEN_WIDTH * 0.45} ${SCREEN_HEIGHT * 0.53} l 4 4 l -4 4`} />
          </G>

          {/* Street Name Typography (Matching reference screenshot placement) */}
          {/* Broadway */}
          <G transform={`translate(${SCREEN_WIDTH * 0.66}, ${SCREEN_HEIGHT * 0.17}) rotate(52)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Broadway
            </SvgText>
          </G>
          {/* Reade St */}
          <G transform={`translate(${SCREEN_WIDTH * 0.30}, ${SCREEN_HEIGHT * 0.20}) rotate(-6)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Reade St
            </SvgText>
          </G>
          {/* Chambers St */}
          <G transform={`translate(${SCREEN_WIDTH * 0.24}, ${SCREEN_HEIGHT * 0.28}) rotate(-6)`}>
            <SvgText fill="#9CA3AF" fontSize="14" fontWeight="700" letterSpacing="0.4">
              Chambers St
            </SvgText>
          </G>
          {/* Warren St */}
          <G transform={`translate(${SCREEN_WIDTH * 0.17}, ${SCREEN_HEIGHT * 0.35}) rotate(-6)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Warren St
            </SvgText>
          </G>
          {/* Park Pl */}
          <G transform={`translate(${SCREEN_WIDTH * 0.05}, ${SCREEN_HEIGHT * 0.43}) rotate(-6)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Park Pl
            </SvgText>
          </G>
          {/* Barclay St */}
          <G transform={`translate(${SCREEN_WIDTH * 0.04}, ${SCREEN_HEIGHT * 0.52}) rotate(-6)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Barclay St
            </SvgText>
          </G>
          {/* Church St */}
          <G transform={`translate(${SCREEN_WIDTH * 0.11}, ${SCREEN_HEIGHT * 0.36}) rotate(-80)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Church St
            </SvgText>
          </G>
          {/* Park Row */}
          <G transform={`translate(${SCREEN_WIDTH * 0.30}, ${SCREEN_HEIGHT * 0.61}) rotate(-16)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Park Row
            </SvgText>
          </G>
          {/* Spruce St */}
          <G transform={`translate(${SCREEN_WIDTH * 0.50}, ${SCREEN_HEIGHT * 0.63}) rotate(16)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Spruce St
            </SvgText>
          </G>
          {/* Ann St */}
          <G transform={`translate(${SCREEN_WIDTH * 0.16}, ${SCREEN_HEIGHT * 0.70}) rotate(16)`}>
            <SvgText fill="#9CA3AF" fontSize="13" fontWeight="600" letterSpacing="0.4">
              Ann St
            </SvgText>
          </G>
        </Svg>
      </View>

      {/* ─── 2. Top Search Bar & Filter Button ───────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.4}>
            <Circle cx="11" cy="11" r="8" />
            <Path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder={isTa ? 'தேடு...' : 'Search'}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        {/* Purple Filter Button */}
        <TouchableOpacity
          style={styles.filterBtn}
          activeOpacity={0.85}
          onPress={() => setFilterModalVisible(true)}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5}>
            <Path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ─── 3. Map Pins (Nearby Profile Avatars) ────────────────────────── */}
      {displayedProfiles.map((p, idx) => {
        const isSelected = selectedProfileIndex === idx;
        const leftPos = (p.xPercent / 100) * SCREEN_WIDTH - 26;
        const topPos = (p.yPercent / 100) * SCREEN_HEIGHT - 26;

        return (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.mapPinContainer,
              { left: leftPos, top: topPos },
              isSelected && styles.mapPinContainerActive,
            ]}
            onPress={() => handleSelectProfileFromMap(idx)}
            activeOpacity={0.88}
          >
            {/* Circular Profile Avatar */}
            <View style={[styles.avatarRing, isSelected && styles.avatarRingActive]}>
              <Image source={{ uri: p.avatar }} style={styles.pinAvatar} resizeMode="cover" />
            </View>
            {/* Distance Label under Avatar */}
            <Text style={[styles.pinDistanceText, isSelected && styles.pinDistanceTextActive]}>
              {p.distance}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* ─── 4. Current User Location Pin (Compass Marker) ───────────────── */}
      <View
        style={[
          styles.userLocationMarker,
          {
            left: (74 / 100) * SCREEN_WIDTH - 24,
            top: (53 / 100) * SCREEN_HEIGHT - 24,
          },
        ]}
      >
        {/* Pulsing Translucent Halo */}
        <Animated.View
          style={[
            styles.userHalo,
            {
              transform: [{ scale: gpsPulseAnim }],
            },
          ]}
        />
        {/* Solid Center Circle with Directional Arrow */}
        <View style={styles.userSolidCircle}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FFFFFF">
            <Path d="M12 2L19 21l-7-4-7 4 7-19z" transform="rotate(45 12 12)" />
          </Svg>
        </View>
      </View>

      {/* ─── 5. GPS Recenter FAB Button ─────────────────────────────────── */}
      <TouchableOpacity
        style={[
          styles.recenterBtn,
          { bottom: insets.bottom + 175 },
        ]}
        onPress={handleRecenter}
        activeOpacity={0.85}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.4}>
          <Circle cx="12" cy="12" r="7" />
          <Line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round" />
          <Line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round" />
          <Line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round" />
          <Line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round" />
          <Circle cx="12" cy="12" r="2.5" fill={BRAND_PURPLE} />
        </Svg>
      </TouchableOpacity>

      {/* ─── 6. Bottom Horizontal Preview Carousel Cards ────────────────── */}
      <View
        style={[
          styles.bottomCarouselWrap,
          { bottom: insets.bottom + 85 },
        ]}
      >
        <FlatList
          ref={flatListRef}
          data={displayedProfiles}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.profileCard}
              activeOpacity={0.92}
              onPress={() => onProfilePress(item as any as MatrimonyProfile)}
            >
              {/* Profile Avatar */}
              <Image source={{ uri: item.avatar }} style={styles.cardAvatar} resizeMode="cover" />

              {/* Profile Details (Name, Age, Location) */}
              <View style={styles.cardInfo}>
                <View style={styles.cardNameRow}>
                  <Text style={styles.cardNameText}>{item.name}, {item.age}</Text>
                  {/* Golden Verified Badge */}
                  <View style={styles.verifiedBadge}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
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
                <Text style={styles.cardLocationText}>
                  {item.currentCity}, {item.currentCountry}
                </Text>
              </View>

              {/* Like / Express Interest Circular Button */}
              <TouchableOpacity
                style={styles.cardLikeBtn}
                onPress={() => handleSendInterest(item)}
                activeOpacity={0.8}
              >
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
                  <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </Svg>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ─── 7. Modern Home Filter Modal ─────────────────────────────────── */}
      <HomeFilterModal
        visible={filterModalVisible}
        currentLocation={selectedLocation}
        onClose={() => setFilterModalVisible(false)}
        onApply={(filters: FilterState) => {
          let updated = [...NEARBY_PROFILES];
          if (filters.interestedIn === 'Women') {
            updated = updated.filter(p => p.gender === 'bride');
          } else if (filters.interestedIn === 'Men') {
            updated = updated.filter(p => p.gender === 'groom');
          }
          updated = updated.filter(
            p => p.distanceKm >= filters.minDistance && p.distanceKm <= filters.maxDistance
          );
          setActiveProfiles(updated);
          setSelectedProfileIndex(0);
        }}
        isTa={isTa}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /* Top Bar */
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    zIndex: 20,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#18181D',
    paddingVertical: 0,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  /* Map Pins */
  mapPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  mapPinContainerActive: {
    transform: [{ scale: 1.1 }],
    zIndex: 15,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: BRAND_PURPLE,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarRingActive: {
    borderWidth: 3.5,
    borderColor: BRAND_PURPLE,
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  pinAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  pinDistanceText: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
    color: '#18181D',
    letterSpacing: 0.2,
  },
  pinDistanceTextActive: {
    color: BRAND_PURPLE,
    fontWeight: '800',
  },

  /* Current User GPS Marker */
  userLocationMarker: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
  },
  userHalo: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(109, 83, 245, 0.22)',
  },
  userSolidCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },

  /* Recenter GPS FAB */
  recenterBtn: {
    position: 'absolute',
    right: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },

  /* Bottom Carousel */
  bottomCarouselWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 25,
  },
  carouselContainer: {
    paddingHorizontal: 16,
    gap: CARD_SPACING,
  },
  profileCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  cardAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E7EB',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181D',
  },
  verifiedBadge: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLocationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.9,
    marginTop: 2,
  },
  cardLikeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
