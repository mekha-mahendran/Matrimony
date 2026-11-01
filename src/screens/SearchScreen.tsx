/**
 * Manamaalai Matrimony (மணமாலை) — Modern Golden Search & Discover Screen
 *
 * Implements the unified golden-amber dashboard styling:
 * - Warm Golden Amber Hero Header (#F7BF2A)
 * - Search Bar & Filter trigger embedded directly inside the amber header
 * - Floating White Metric Card with 3 Circular Ring Progress Gauges:
 *     1. Matching Candidates Found
 *     2. Active Filter Count
 *     3. 100% Verified Profiles
 * - Quick Category Filter Chips & Sort Options
 * - 2-Column Luxury Grid with Heart Shortlist & Connect Actions
 */

import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { CustomIcon } from '../components/CustomIcon';
import { FilterModal } from '../components/FilterModal';
import { Language, Translations } from '../localization';
import { SearchService } from '../services/searchService';
import { StorageService } from '../services/storage';
import { MatrimonyProfile, SearchFilterState } from '../types';

/* ─── Luxury Design Tokens ─────────────────────────────────────────────────── */
const PALETTE = {
  amberHeader: '#F7BF2A',
  amberHeaderDark: '#E5A914',
  obsidianCard: '#1A1C1E',
  pageBg: '#F8F5EE',
  cardWhite: '#FFFFFF',
  cardBorder: '#EFE8DC',
  textInk: '#1C1614',
  textMuted: '#7A6E67',
  textSecondary: '#52453F',
  maroon: '#49141C',
  olive: '#6A7A14',
  oliveSoft: '#EEF0D6',
  rose: '#D17575',
  redDot: '#E53E3E',
};

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const GRID_CARD_WIDTH = (Math.min(WINDOW_WIDTH, 430) - 48) / 2;

interface SearchScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  initialQuery?: string;
  unreadCount: number;
  isAdmin: boolean;
}

const DEFAULT_FILTERS: SearchFilterState = {
  ageMin: 21,
  ageMax: 38,
  heightMinCm: 150,
  heightMaxCm: 195,
  verifiedOnly: false,
  withPhotoOnly: false,
  horoscopePoruthamOnly: false,
  searchQuery: '',
  sortBy: 'relevance',
};

/* ─── Circular Ring Gauge Helper ───────────────────────────────────────────── */
const RingGauge: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label: string;
  unit: string;
}> = ({
  value,
  max = 100,
  size = 52,
  strokeWidth = 3.5,
  color = PALETTE.amberHeaderDark,
  trackColor = '#EFE8DC',
  label,
  unit,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - circumference * progress;

  return (
    <View style={styles.gaugeContainer}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
        <Text style={styles.gaugeValueText}>{label}</Text>
      </View>
      <Text style={styles.gaugeUnitText}>{unit}</Text>
    </View>
  );
};

export const SearchScreen: React.FC<SearchScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onProfilePress,
  initialQuery = '',
  unreadCount,
  isAdmin,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';
  const t = Translations[language];

  const [allProfiles, setAllProfiles] = useState<MatrimonyProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<MatrimonyProfile | null>(null);
  const [shortlists, setShortlists] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilterState>({
    ...DEFAULT_FILTERS,
    searchQuery: initialQuery,
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const loadData = async () => {
    const user = await StorageService.getCurrentUser();
    const curr = await StorageService.getProfileById(user.activeProfileId);
    setCurrentProfile(curr);

    const profiles = await StorageService.getAllProfiles();
    setAllProfiles(profiles);

    const sl = await StorageService.getShortlists();
    setShortlists(sl);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleShortlist = async (profileId: string) => {
    await StorageService.toggleShortlist(profileId);
    const updated = await StorageService.getShortlists();
    setShortlists(updated);
  };

  const handleSendInterest = async (targetProfileId: string) => {
    if (!currentProfile) return;
    await StorageService.sendInterest(currentProfile.id, targetProfileId);
    await loadData();
  };

  const filteredProfiles = SearchService.filterProfiles(allProfiles, filters, currentProfile);

  const activeFilterCount =
    (filters.gender ? 1 : 0) +
    (filters.caste && filters.caste.length > 0 ? 1 : 0) +
    (filters.district && filters.district.length > 0 ? 1 : 0) +
    (filters.education && filters.education.length > 0 ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.withPhotoOnly ? 1 : 0) +
    (filters.horoscopePoruthamOnly ? 1 : 0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── 1. WARM GOLDEN AMBER HEADER ZONE ──────────────────────────────── */}
      <View style={[styles.amberHeaderZone, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.topBarRow}>
          <View style={styles.brandRow}>
            <View style={styles.brandLogoCircle}>
              <Image
                source={require('../assets/images/logo.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitleText}>மணமாலை</Text>
              <Text style={styles.brandSubTitleText}>DISCOVER & SEARCH</Text>
            </View>
          </View>

          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.langSwitchPill} onPress={onToggleLanguage} activeOpacity={0.8}>
              <Text style={styles.langPillText}>{isTa ? 'English' : 'தமிழ்'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bellBtn} onPress={onNotificationPress} activeOpacity={0.8}>
              <CustomIcon name="bell" size={19} color="#1C1614" />
              {unreadCount > 0 && <View style={styles.bellBadgeDot} />}
            </TouchableOpacity>

            <View style={styles.avatarWrap}>
              <Image
                source={{
                  uri:
                    currentProfile?.photos?.[0] ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.avatarImage}
              />
            </View>
          </View>
        </View>

        {/* Embedded Search Input Bar + Filter Trigger inside Header */}
        <View style={styles.searchBarRow}>
          <View style={styles.inputContainer}>
            <CustomIcon name="search" size={18} color="#1C1614" />
            <TextInput
              style={styles.searchInput}
              placeholder={isTa ? 'பெயர், ஊர், சாதி, தொழில்...' : 'Name, city, caste, job...'}
              value={filters.searchQuery}
              onChangeText={txt => setFilters({ ...filters, searchQuery: txt })}
              placeholderTextColor="rgba(28, 22, 20, 0.55)"
            />
            {filters.searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setFilters({ ...filters, searchQuery: '' })}>
                <CustomIcon name="close" size={16} color="#1C1614" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.85}
          >
            <CustomIcon
              name="filter"
              size={18}
              color={activeFilterCount > 0 ? '#FFFFFF' : '#1C1614'}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Floating White Metric Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricCardSubhead}>
              {isTa ? 'தேடல் முடிவுகள் மற்றும் வடிகட்டிகள்' : 'Search Query & Filter Metrics'}
            </Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>{activeFilterCount} Filters</Text>
            </View>
          </View>

          <View style={styles.gaugesRow}>
            <RingGauge value={filteredProfiles.length} max={100} label={`${filteredProfiles.length}`} unit={isTa ? 'வரன்கள்' : 'RESULTS'} color="#E5A914" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={activeFilterCount} max={7} label={`${activeFilterCount}`} unit={isTa ? 'வடிகட்டிகள்' : 'FILTERS'} color="#6A7A14" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={100} max={100} label="100%" unit={isTa ? 'சரிபார்த்தவை' : 'VERIFIED'} color="#D17575" />
          </View>
        </View>
      </View>

      {/* ── 2. BODY CONTENT ──────────────────────────────────────────────── */}
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
        {/* Quick Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsContent}>
          <TouchableOpacity
            style={[styles.quickChip, !filters.gender && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, gender: undefined })}
          >
            <Text style={[styles.quickChipText, !filters.gender && styles.quickChipTextActive]}>
              {isTa ? 'அனைத்தும்' : 'All'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.gender === 'bride' && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, gender: filters.gender === 'bride' ? undefined : 'bride' })}
          >
            <Text style={[styles.quickChipText, filters.gender === 'bride' && styles.quickChipTextActive]}>
              {isTa ? 'மணமகள்' : 'Brides'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.gender === 'groom' && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, gender: filters.gender === 'groom' ? undefined : 'groom' })}
          >
            <Text style={[styles.quickChipText, filters.gender === 'groom' && styles.quickChipTextActive]}>
              {isTa ? 'மணமகன்' : 'Grooms'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.verifiedOnly && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
          >
            <Text style={[styles.quickChipText, filters.verifiedOnly && styles.quickChipTextActive]}>
              ✓ {isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.withPhotoOnly && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, withPhotoOnly: !filters.withPhotoOnly })}
          >
            <Text style={[styles.quickChipText, filters.withPhotoOnly && styles.quickChipTextActive]}>
              📷 {isTa ? 'புகைப்படத்துடன்' : 'With Photo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.horoscopePoruthamOnly && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, horoscopePoruthamOnly: !filters.horoscopePoruthamOnly })}
          >
            <Text style={[styles.quickChipText, filters.horoscopePoruthamOnly && styles.quickChipTextActive]}>
              ★ {isTa ? '10 பொருத்தம்' : '10-Porutham'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Section Heading */}
        <View style={styles.resultsHeaderRow}>
          <Text style={styles.resultsTitleText}>
            {filteredProfiles.length} {isTa ? 'பொருத்தமான வரன்கள்' : 'PROFILES FOUND'}
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity onPress={() => setFilters({ ...DEFAULT_FILTERS })}>
              <Text style={styles.clearFilterText}>{isTa ? 'அழி' : 'Clear Filters'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 2-Column Matches Grid */}
        <View style={styles.twoColumnGrid}>
          {filteredProfiles.map(item => {
            const isShortlisted = shortlists.includes(item.id);

            return (
              <View key={item.id} style={styles.gridCard}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => onProfilePress(item)}
                  style={styles.gridPhotoWrap}
                >
                  <Image
                    source={{
                      uri:
                        item.photos?.[0] ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.gridPhoto}
                  />

                  <TouchableOpacity
                    style={styles.gridHeartBtn}
                    onPress={() => handleToggleShortlist(item.id)}
                    activeOpacity={0.8}
                  >
                    <CustomIcon
                      name={isShortlisted ? 'heart-filled' : 'heart'}
                      size={16}
                      color={isShortlisted ? PALETTE.maroon : '#1C1614'}
                    />
                  </TouchableOpacity>

                  <View style={styles.gridBadge}>
                    <Text style={styles.gridBadgeText}>★ 9/10 Porutham</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.gridDetails}>
                  <Text style={styles.gridName} numberOfLines={1}>
                    {item.name.split(',')[0]}, {item.age}
                  </Text>
                  <Text style={styles.gridJob} numberOfLines={1}>
                    {item.educationCareer?.occupation || 'Professional'}
                  </Text>
                  <Text style={styles.gridCity} numberOfLines={1}>
                    {item.currentCity || 'Chennai'} • {item.caste || 'Tamil'}
                  </Text>

                  <TouchableOpacity
                    style={styles.gridActionBtn}
                    onPress={() => handleSendInterest(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.gridActionBtnText}>{isTa ? 'விருப்பம் அனுப்பு' : 'Connect'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApply={(newF: SearchFilterState) => {
          setFilters(newF);
          setFilterModalVisible(false);
        }}
        onReset={() => setFilters({ ...DEFAULT_FILTERS })}
        totalMatchesCount={filteredProfiles.length}
        language={language}
      />
    </View>
  );
};

/* ─── Stylesheet ───────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PALETTE.pageBg,
  },
  amberHeaderZone: {
    backgroundColor: PALETTE.amberHeader,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#8C6700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1614',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextWrap: {
    flexDirection: 'column',
  },
  brandTitleText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1C1614',
    letterSpacing: 0.3,
  },
  brandSubTitleText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(28, 22, 20, 0.72)',
    letterSpacing: 1.2,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langSwitchPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  langPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1C1614',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  bellBadgeDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.redDot,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#8C6700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C1614',
    fontWeight: '600',
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#8C6700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  filterBtnActive: {
    backgroundColor: '#1C1614',
  },
  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: PALETTE.maroon,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#3A271D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCardSubhead: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.textMuted,
  },
  activeTag: {
    backgroundColor: PALETTE.oliveSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: PALETTE.olive,
  },
  gaugesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  gaugeContainer: {
    alignItems: 'center',
  },
  gaugeValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1614',
  },
  gaugeUnitText: {
    fontSize: 9,
    fontWeight: '700',
    color: PALETTE.textMuted,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  gaugeDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F0ECE3',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  quickChipsContent: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
  },
  quickChipActive: {
    backgroundColor: PALETTE.amberHeader,
    borderColor: PALETTE.amberHeader,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.textSecondary,
  },
  quickChipTextActive: {
    color: '#1C1614',
    fontWeight: '800',
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultsTitleText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: PALETTE.textInk,
    letterSpacing: 0.6,
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.amberHeaderDark,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: GRID_CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    shadowColor: '#3A271D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  gridPhotoWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EAE4DA',
  },
  gridHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(28, 22, 20, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gridBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: PALETTE.amberHeader,
  },
  gridDetails: {
    padding: 10,
  },
  gridName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: PALETTE.textInk,
    marginBottom: 2,
  },
  gridJob: {
    fontSize: 11,
    color: PALETTE.textMuted,
  },
  gridCity: {
    fontSize: 10.5,
    color: PALETTE.textMuted,
    marginBottom: 8,
  },
  gridActionBtn: {
    width: '100%',
    height: 32,
    borderRadius: 10,
    backgroundColor: PALETTE.amberHeader,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1C1614',
  },
});
