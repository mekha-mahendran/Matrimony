/**
 * Manamaalai Matrimony (மணமாலை) — Modern Golden Matches & Jathagam Screen
 *
 * Implements the unified golden-amber dashboard styling:
 * - Warm Golden Amber Hero Header (#F7BF2A)
 * - Sticky TopBar with Brand Badge, Avatar, Language Switcher & Notifications
 * - Segmented Header Tabs: Mutual (count), 10-Porutham Engine, Shortlist (count)
 * - Floating White Metric Card with 3 Circular Ring Progress Gauges:
 *     1. Astrological Compatibility (10/10)
 *     2. Mutual Matches
 *     3. Shortlisted Profiles
 * - High-Contrast Match Cards & Interactive 10-Porutham Calculator
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
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { CustomIcon } from '../components/CustomIcon';
import { ProfileCard } from '../components/ProfileCard';
import { Language, Translations } from '../localization';
import {
  calculateTenPoruthams,
  TAMIL_NAKSHATRAMS,
  TAMIL_RASIS,
} from '../services/horoscopeService';
import { StorageService } from '../services/storage';
import { CurrentUser, MatrimonyProfile, PoruthamResult } from '../types';

/* ─── Modern White & Brand Purple Palette ───────────────────────────────── */
const PALETTE = {
  amberHeader: '#6D53F5',
  amberHeaderDark: '#563DD6',
  obsidianCard: '#1E1E24',
  pageBg: '#FAFAFD',
  cardWhite: '#FFFFFF',
  cardBorder: '#EEEEF2',
  textInk: '#18181D',
  textMuted: '#8E8D9A',
  textSecondary: '#52453F',
  maroon: '#6D53F5',
  olive: '#10B981',
  oliveSoft: '#ECFDF5',
  rose: '#EF4444',
  redDot: '#EF4444',
};

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const GRID_CARD_WIDTH = (Math.min(WINDOW_WIDTH, 430) - 48) / 2;

interface MatchesScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  onViewHoroscopePorutham: (porutham: PoruthamResult) => void;
  onDailyRecommendationsPress?: () => void;
  unreadCount: number;
  isAdmin: boolean;
}

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

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onProfilePress,
  onViewHoroscopePorutham,
  onDailyRecommendationsPress,
  unreadCount,
  isAdmin,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';
  const t = Translations[language];

  const [tab, setTab] = useState<'mutual' | 'calculator' | 'shortlist'>('mutual');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<MatrimonyProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<MatrimonyProfile[]>([]);
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [mutualProfiles, setMutualProfiles] = useState<MatrimonyProfile[]>([]);

  // Interactive 10-Porutham Matchmaker State
  const [brideRasi, setBrideRasi] = useState(TAMIL_RASIS[3]); // Kadagam
  const [brideStar, setBrideStar] = useState(TAMIL_NAKSHATRAMS[7]); // Poosam
  const [groomRasi, setGroomRasi] = useState(TAMIL_RASIS[8]); // Dhanusu
  const [groomStar, setGroomStar] = useState(TAMIL_NAKSHATRAMS[18]); // Moolam
  const [poruthamResult, setPoruthamResult] = useState<PoruthamResult | null>(null);

  const loadData = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);

    const mine = await StorageService.getProfileById(user.activeProfileId);
    setCurrentProfile(mine);

    const profiles = await StorageService.getAllProfiles();
    setAllProfiles(profiles);

    const sl = await StorageService.getShortlists();
    setShortlistIds(sl);

    const interests = await StorageService.getInterests();
    const acceptedMutualIds = interests
      .filter(
        i =>
          (i.senderProfileId === user.activeProfileId ||
            i.receiverProfileId === user.activeProfileId) &&
          i.status === 'accepted'
      )
      .map(i =>
        i.senderProfileId === user.activeProfileId ? i.receiverProfileId : i.senderProfileId
      );

    const mutuals = profiles.filter(p => acceptedMutualIds.includes(p.id));
    setMutualProfiles(mutuals.length > 0 ? mutuals : profiles.slice(0, 3));

    const res = calculateTenPoruthams(brideRasi, brideStar, groomRasi, groomStar);
    setPoruthamResult(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCalculate = () => {
    const res = calculateTenPoruthams(brideRasi, brideStar, groomRasi, groomStar);
    setPoruthamResult(res);
  };

  const handleToggleShortlist = async (profileId: string) => {
    await StorageService.toggleShortlist(profileId);
    const updated = await StorageService.getShortlists();
    setShortlistIds(updated);
  };

  const shortlistedProfiles = allProfiles.filter(p => shortlistIds.includes(p.id));
  const topMutualCandidate = mutualProfiles[0];

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
              <Text style={styles.brandSubTitleText}>MATCHES & JATHAGAM</Text>
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

        {/* Segmented Header Tabs */}
        <View style={styles.headerTabsRow}>
          <TouchableOpacity
            style={[styles.headerTabBtn, tab === 'mutual' && styles.headerTabBtnActive]}
            onPress={() => setTab('mutual')}
            activeOpacity={0.85}
          >
            <Text style={[styles.headerTabText, tab === 'mutual' && styles.headerTabTextActive]}>
              {isTa ? 'இருவழிப் பொருத்தம்' : 'Mutual'}
            </Text>
            <View style={[styles.countBadge, tab === 'mutual' && { backgroundColor: '#F5ECE3' }]}>
              <Text style={[styles.countBadgeText, tab === 'mutual' && { color: PALETTE.maroon }]}>
                {mutualProfiles.length}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerTabBtn, tab === 'calculator' && styles.headerTabBtnActive]}
            onPress={() => setTab('calculator')}
            activeOpacity={0.85}
          >
            <Text style={[styles.headerTabText, tab === 'calculator' && styles.headerTabTextActive]}>
              {isTa ? '10-பொருத்தம்' : '10-Porutham'}
            </Text>
            <View style={[styles.countBadge, tab === 'calculator' && { backgroundColor: '#F5ECE3' }]}>
              <Text style={[styles.countBadgeText, tab === 'calculator' && { color: PALETTE.maroon }]}>
                ★
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerTabBtn, tab === 'shortlist' && styles.headerTabBtnActive]}
            onPress={() => setTab('shortlist')}
            activeOpacity={0.85}
          >
            <Text style={[styles.headerTabText, tab === 'shortlist' && styles.headerTabTextActive]}>
              {isTa ? 'பட்டியலிட்டவை' : 'Shortlist'}
            </Text>
            <View style={[styles.countBadge, tab === 'shortlist' && { backgroundColor: '#F5ECE3' }]}>
              <Text style={[styles.countBadgeText, tab === 'shortlist' && { color: PALETTE.maroon }]}>
                {shortlistedProfiles.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Floating White Metric Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricCardSubhead}>
              {isTa ? 'இருவழிப் பொருத்தம் & ஜாதக மதிப்பீடு' : 'Mutual Connections & Horoscope Score'}
            </Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Verified</Text>
            </View>
          </View>

          <View style={styles.gaugesRow}>
            <RingGauge value={10} max={10} label="10/10" unit={isTa ? 'ஜோதிடம்' : 'PORUTHAM'} color="#E5A914" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={mutualProfiles.length} max={10} label={`${mutualProfiles.length}`} unit={isTa ? 'இருவழி' : 'MUTUAL VARAN'} color="#6A7A14" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={shortlistedProfiles.length} max={15} label={`${shortlistedProfiles.length}`} unit={isTa ? 'பட்டியல்' : 'SHORTLIST'} color="#D17575" />
          </View>
        </View>
      </View>

      {/* ── 2. TAB CONTENT ──────────────────────────────────────────────── */}
      {tab === 'mutual' && (
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
          {/* Top Featured Mutual Candidate in Deep Obsidian Card (#1A1C1E) */}
          {topMutualCandidate && (
            <View style={styles.obsidianCard}>
              <View style={styles.obsidianTopBadgeRow}>
                <View style={styles.obsidianBadge}>
                  <Text style={styles.obsidianBadgeText}>MUTUAL CONNECTION 🌟</Text>
                </View>
                <Text style={styles.obsidianPoruthamScore}>10/10 Porutham</Text>
              </View>

              <TouchableOpacity
                style={styles.obsidianHeaderRow}
                onPress={() => onProfilePress(topMutualCandidate)}
                activeOpacity={0.88}
              >
                <Image source={{ uri: topMutualCandidate.photos[0] }} style={styles.obsidianAvatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.obsidianName}>{topMutualCandidate.name.split(',')[0]}, {topMutualCandidate.age}</Text>
                  <Text style={styles.obsidianJob} numberOfLines={1}>{topMutualCandidate.educationCareer?.occupation || 'Software Professional'}</Text>
                  <Text style={styles.obsidianCity}>{topMutualCandidate.caste} • {topMutualCandidate.currentCity}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.obsidianProgressWrap}>
                <View style={[styles.obsidianProgressBar, { width: '100%', backgroundColor: PALETTE.amberHeader }]} />
              </View>
              <Text style={styles.obsidianFooterText}>Both of you expressed interest in each other!</Text>

              <View style={styles.obsidianActionRow}>
                <TouchableOpacity
                  style={styles.obsidianActionBtn}
                  onPress={() => onProfilePress(topMutualCandidate)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.obsidianActionBtnText}>View Full Horoscope</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Mutual Varans 2-Column Grid */}
          <Text style={styles.subheading}>{isTa ? 'அனைத்து இருவழிப் பொருத்தங்கள்' : 'ALL MUTUAL MATCHES'}</Text>

          <View style={styles.twoColumnGrid}>
            {mutualProfiles.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridCard}
                onPress={() => onProfilePress(item)}
                activeOpacity={0.88}
              >
                <Image
                  source={{
                    uri:
                      item.photos?.[0] ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                  }}
                  style={styles.gridPhoto}
                />

                <TouchableOpacity
                  style={styles.gridHeartBtn}
                  onPress={() => handleToggleShortlist(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <CustomIcon
                    name={shortlistIds.includes(item.id) ? 'heart-filled' : 'heart'}
                    size={16}
                    color={shortlistIds.includes(item.id) ? PALETTE.maroon : '#1C1614'}
                  />
                </TouchableOpacity>

                <View style={styles.gridBadge}>
                  <Text style={styles.gridBadgeText}>★ 10/10 Porutham</Text>
                </View>

                <View style={styles.gridDetails}>
                  <Text style={styles.gridName} numberOfLines={1}>
                    {item.name.split(',')[0]}, {item.age}
                  </Text>
                  <Text style={styles.gridJob} numberOfLines={1}>
                    {item.educationCareer?.occupation || 'Professional'}
                  </Text>
                  <Text style={styles.gridCity} numberOfLines={1}>
                    {item.currentCity || 'Chennai'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── TAB 2: STANDALONE 10-PORUTHAM ENGINE ───────────────────────── */}
      {tab === 'calculator' && (
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
          {/* Header Card */}
          <View style={styles.calcIntroCard}>
            <View style={styles.calcIntroIcon}>
              <CustomIcon name="compass" size={20} color={PALETTE.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.calcIntroTitle}>
                {isTa ? 'தமிழ் 10 பொருத்த ஜோதிட கணிப்பு' : 'Authentic 10-Porutham Matcher'}
              </Text>
              <Text style={styles.calcIntroSub}>
                Based on ancient Tamil astrological rules for Dina, Gana, Mahendra, Yoni, Rasi, Rajju, Vedha and Stree Deergham.
              </Text>
            </View>
          </View>

          {/* Bride Picker */}
          <View style={styles.selectorCard}>
            <Text style={styles.selectorHeader}>👰 Bride (பெண்) Horoscope</Text>
            <Text style={styles.subLabel}>Rasi (ராசி):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_RASIS.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.hChip, brideRasi === r && styles.hChipActive]}
                  onPress={() => setBrideRasi(r)}
                >
                  <Text style={[styles.hChipText, brideRasi === r && styles.hChipTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.subLabel, { marginTop: 8 }]}>Nakshatram (நட்சத்திரம்):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_NAKSHATRAMS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.hChip, brideStar === s && styles.hChipActive]}
                  onPress={() => setBrideStar(s)}
                >
                  <Text style={[styles.hChipText, brideStar === s && styles.hChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Groom Picker */}
          <View style={styles.selectorCard}>
            <Text style={styles.selectorHeader}>🤵 Groom (ஆண்) Horoscope</Text>
            <Text style={styles.subLabel}>Rasi (ராசி):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_RASIS.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.hChip, groomRasi === r && styles.hChipActive]}
                  onPress={() => setGroomRasi(r)}
                >
                  <Text style={[styles.hChipText, groomRasi === r && styles.hChipTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.subLabel, { marginTop: 8 }]}>Nakshatram (நட்சத்திரம்):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_NAKSHATRAMS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.hChip, groomStar === s && styles.hChipActive]}
                  onPress={() => setGroomStar(s)}
                >
                  <Text style={[styles.hChipText, groomStar === s && styles.hChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate} activeOpacity={0.88}>
            <Text style={styles.calcBtnText}>Calculate 10-Poruthams ✨</Text>
          </TouchableOpacity>

          {/* Porutham Result Summary */}
          {poruthamResult && (
            <View style={styles.resultCard}>
              <View style={styles.resultTopRow}>
                <View>
                  <Text style={styles.resultScoreNum}>
                    {poruthamResult.totalScore} <Text style={styles.resultScoreLabel}>/ 10 Matched</Text>
                  </Text>
                </View>
                <View style={[styles.verdictPill, { backgroundColor: PALETTE.oliveSoft }]}>
                  <Text style={[styles.verdictText, { color: PALETTE.olive }]}>
                    {poruthamResult.verdict === 'Uthama' ? 'உத்தமம் (Excellent)' : 'மத்திமம் (Good Match)'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── TAB 3: SHORTLISTED PROFILES ─────────────────────────────────── */}
      {tab === 'shortlist' && (
        <FlatList
          data={shortlistedProfiles}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              currentProfile={currentProfile}
              language={language}
              isShortlisted={true}
              onPress={() => onProfilePress(item)}
              onToggleShortlist={() => handleToggleShortlist(item.id)}
              onSendInterest={() => {}}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <CustomIcon name="heart" size={28} color={PALETTE.amberHeaderDark} />
              </View>
              <Text style={styles.emptyTitle}>No Shortlisted Profiles</Text>
              <Text style={styles.emptySub}>
                Bookmark varans you like by tapping the heart icon on any card.
              </Text>
            </View>
          }
        />
      )}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
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
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#374151',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  headerTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 20,
  },
  headerTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    gap: 5,
  },
  headerTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  headerTabTextActive: {
    color: '#6D53F5',
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: 'rgba(28, 22, 20, 0.10)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1C1614',
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
    paddingTop: 18,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  /* Obsidian Featured Card */
  obsidianCard: {
    backgroundColor: PALETTE.obsidianCard,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 7,
  },
  obsidianTopBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  obsidianBadge: {
    backgroundColor: 'rgba(247, 191, 42, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(247, 191, 42, 0.35)',
  },
  obsidianBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: PALETTE.amberHeader,
  },
  obsidianPoruthamScore: {
    fontSize: 11.5,
    fontWeight: '800',
    color: PALETTE.amberHeader,
  },
  obsidianHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  obsidianAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E3238',
  },
  obsidianName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  obsidianJob: {
    fontSize: 12,
    color: '#9BA1AB',
    marginBottom: 2,
  },
  obsidianCity: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  obsidianProgressWrap: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 10,
    overflow: 'hidden',
  },
  obsidianProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  obsidianFooterText: {
    fontSize: 11,
    color: PALETTE.amberHeader,
    marginBottom: 12,
  },
  obsidianActionRow: {
    flexDirection: 'row',
  },
  obsidianActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: PALETTE.amberHeader,
    alignItems: 'center',
    justifyContent: 'center',
  },
  obsidianActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1614',
  },

  /* Two Column Grid */
  subheading: {
    fontSize: 12.5,
    fontWeight: '800',
    color: PALETTE.textInk,
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 4,
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
  gridPhoto: {
    width: '100%',
    height: 140,
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
  },

  /* Calculator Styles */
  calcIntroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
  },
  calcIntroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5ECE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcIntroTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: PALETTE.textInk,
    marginBottom: 2,
  },
  calcIntroSub: {
    fontSize: 11,
    color: PALETTE.textMuted,
    lineHeight: 15,
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
  },
  selectorHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: PALETTE.textInk,
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.textMuted,
    marginBottom: 4,
  },
  hScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  hChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F7F4EE',
    marginRight: 6,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
  },
  hChipActive: {
    backgroundColor: PALETTE.amberHeader,
    borderColor: PALETTE.amberHeader,
  },
  hChipText: {
    fontSize: 11,
    color: PALETTE.textInk,
  },
  hChipTextActive: {
    fontWeight: '800',
  },
  calcBtn: {
    height: 46,
    borderRadius: 16,
    backgroundColor: PALETTE.amberHeader,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  calcBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1614',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    marginBottom: 16,
  },
  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultScoreNum: {
    fontSize: 22,
    fontWeight: '900',
    color: PALETTE.textInk,
  },
  resultScoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.textMuted,
  },
  verdictPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  verdictText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FCE6BE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: PALETTE.textInk,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: PALETTE.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
