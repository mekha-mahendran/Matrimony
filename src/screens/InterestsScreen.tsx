/**
 * Manamaalai Matrimony — Matches / Interests Screen (3rd Tab)
 *
 * Implements the exact design from the reference screenshot:
 * - Header: Back button (←), centered title "Matches", Filter button (☰)
 * - Horizontal Filter Chips: All, Online (active purple), Newest, Nearest, etc.
 * - 2-Column Grid of Beautiful Match Cards:
 *     - Full-bleed vertical photo
 *     - Top-left "90% Match" purple badge
 *     - Top-right bright green online indicator dot
 *     - Frosted distance capsule: "12.6 km away"
 *     - Title: "Name, Age" + golden verified badge ✓
 *     - Subtitle: "NEWYORK, USA"
 * - Tapping any card opens the Profile Details screen
 * - Top-right filter button opens HomeFilterModal
 */

import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { HomeFilterModal, FilterState } from '../components/HomeFilterModal';
import { Language } from '../localization';
import { StorageService } from '../services/storage';
import { MatrimonyProfile } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';
const GRID_GAP = 14;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.48;

interface MatchItem {
  id: string;
  name: string;
  age: number;
  gender: 'bride' | 'groom';
  currentCity: string;
  currentCountry: string;
  distance: string;
  distanceKm: number;
  matchScore: number;
  isOnline: boolean;
  photos: string[];
  about?: string;
  lifestyle?: any;
  educationCareer?: any;
}

const MATCHES_DATA: MatchItem[] = [
  {
    id: 'm_1',
    name: 'Marvin',
    age: 22,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '12.6 km away',
    distanceKm: 12.6,
    matchScore: 90,
    isOnline: true,
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    about: 'Passionate about creative art, photography, culture and discovering meaningful connections.',
    lifestyle: { heightCm: 175, languagesKnown: ['English'] },
  },
  {
    id: 'm_2',
    name: 'Marvin',
    age: 22,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '12.6 km away',
    distanceKm: 12.6,
    matchScore: 90,
    isOnline: true,
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    about: 'Loves flowers, morning sunshine, travel and meaningful life conversations.',
    lifestyle: { heightCm: 168, languagesKnown: ['English'] },
  },
  {
    id: 'm_3',
    name: 'Marvin',
    age: 22,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '12.6 km away',
    distanceKm: 12.6,
    matchScore: 90,
    isOnline: true,
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    about: 'Architect by profession, dreamer at heart. Enjoys gardening and reading.',
    lifestyle: { heightCm: 170, languagesKnown: ['English'] },
  },
  {
    id: 'm_4',
    name: 'Marvin',
    age: 22,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '12.6 km away',
    distanceKm: 12.6,
    matchScore: 90,
    isOnline: true,
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ],
    about: 'Software engineer living in Manhattan. Enjoys museums and acoustic music.',
    lifestyle: { heightCm: 172, languagesKnown: ['English'] },
  },
  {
    id: 'm_5',
    name: 'Marvin',
    age: 22,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '12.6 km away',
    distanceKm: 12.6,
    matchScore: 90,
    isOnline: true,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    ],
    about: 'Creative director, loves literature, design and thoughtful conversations.',
    lifestyle: { heightCm: 165, languagesKnown: ['English'] },
  },
  {
    id: 'm_6',
    name: 'Marvin',
    age: 22,
    gender: 'bride',
    currentCity: 'NEWYORK',
    currentCountry: 'USA',
    distance: '12.6 km away',
    distanceKm: 12.6,
    matchScore: 90,
    isOnline: true,
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    about: 'Classical dancer and medical student. Values tradition and family bonds.',
    lifestyle: { heightCm: 163, languagesKnown: ['English', 'Tamil'] },
  },
];

interface InterestsScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onNotificationPress?: () => void;
  onAdminPress?: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  onChatPress?: (profile: MatrimonyProfile) => void;
  onBack?: () => void;
  unreadCount?: number;
  isAdmin?: boolean;
}

export const InterestsScreen: React.FC<InterestsScreenProps> = ({
  language,
  onProfilePress,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [activeFilter, setActiveFilter] = useState<'All' | 'Online' | 'Newest' | 'Nearest' | 'Mutual'>('Online');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [matches, setMatches] = useState<MatchItem[]>(MATCHES_DATA);

  const filterTabs = [
    { key: 'All', label: isTa ? 'அனைத்தும்' : 'All' },
    { key: 'Online', label: isTa ? 'ஆன்லைன்' : 'Online' },
    { key: 'Newest', label: isTa ? 'புதியவை' : 'Newest' },
    { key: 'Nearest', label: isTa ? 'அருகிலுள்ளவை' : 'Nearest' },
    { key: 'Mutual', label: isTa ? 'பொருத்தம்' : 'Mutual' },
  ];

  const filteredMatches = matches.filter(m => {
    if (activeFilter === 'Online') return m.isOnline;
    if (activeFilter === 'Nearest') return m.distanceKm <= 15;
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Header (Back, Title, Filter Button) ──────────────────────── */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top + 6, 14) }]}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.circleHeaderBtn}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.5}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>
          {isTa ? 'பொருத்தங்கள்' : 'Matches'}
        </Text>

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.circleHeaderBtn}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.4}>
            <Path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ─── 2. Filter Tabs Horizontal Row ───────────────────────────────── */}
      <View style={styles.filterTabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        >
          {filterTabs.map(tab => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(tab.key as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── 3. 2-Column Matches Grid ────────────────────────────────────── */}
      <FlatList
        data={filteredMatches}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.gridContainer,
          { paddingBottom: Math.max(insets.bottom + 105, 125) },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.92}
            onPress={() => onProfilePress(item as any as MatrimonyProfile)}
          >
            {/* Background Image */}
            <Image source={{ uri: item.photos[0] }} style={styles.cardImage} resizeMode="cover" />

            {/* Top-Left Match Badge */}
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>{item.matchScore}% Match</Text>
            </View>

            {/* Top-Right Online Status Dot */}
            {item.isOnline && (
              <View style={styles.onlineDotWrapper}>
                <View style={styles.onlineDot} />
              </View>
            )}

            {/* Bottom Gradient Overlay & Info */}
            <View style={styles.cardBottomOverlay}>
              {/* Distance Capsule */}
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{item.distance}</Text>
              </View>

              {/* Name & Age Row */}
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{item.name},{item.age}</Text>
                {/* Yellow Verified Badge */}
                <View style={styles.verifiedBadge}>
                  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
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

              {/* Location Subtitle */}
              <Text style={styles.locationText}>
                {`${item.currentCity}, ${item.currentCountry}`.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* ─── 4. Filter Modal ─────────────────────────────────────────────── */}
      <HomeFilterModal
        visible={filterModalVisible}
        currentLocation="New York, USA"
        onClose={() => setFilterModalVisible(false)}
        onApply={(filters: FilterState) => {
          let updated = [...MATCHES_DATA];
          if (filters.interestedIn === 'Women') {
            updated = updated.filter(p => p.gender === 'bride');
          } else if (filters.interestedIn === 'Men') {
            updated = updated.filter(p => p.gender === 'groom');
          }
          updated = updated.filter(
            p => p.distanceKm >= filters.minDistance && p.distanceKm <= filters.maxDistance
          );
          setMatches(updated);
        }}
        isTa={isTa}
      />
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
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  circleHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181D',
  },

  /* Filter Tabs */
  filterTabsWrap: {
    paddingVertical: 8,
  },
  filterTabsContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: BRAND_PURPLE,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* 2-Column Grid */
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1E1E24',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  /* Match Badge */
  matchBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: BRAND_PURPLE,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  matchBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Online Dot */
  onlineDotWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* Bottom Overlay */
  cardBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(24, 24, 29, 0.45)',
  },
  distanceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.6,
    marginTop: 2,
  },
});
