/**
 * Manamaalai Matrimony (மணமாலை) — Modern Golden Profile & Account Screen
 *
 * Implements the unified golden-amber dashboard styling:
 * - Warm Golden Amber Hero Header (#F7BF2A)
 * - Sticky TopBar with Brand Badge, Avatar, Language Switcher & Notifications
 * - Floating White Metric Card with 3 Circular Ring Progress Gauges:
 *     1. Profile Completeness %
 *     2. Contacts Remaining
 *     3. Interests Remaining
 * - Deep Obsidian Membership Card (#1A1C1E) with Gold Upgrade CTA
 * - Clean White Luxury Cards for Privacy, Assisted Suite & Settings
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { CustomIcon } from '../components/CustomIcon';
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import { CurrentUser, MatrimonyProfile } from '../types';

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

interface UserProfileScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onEditProfile: () => void;
  onMembershipPress: () => void;
  onViewMyProfile: (profile: MatrimonyProfile) => void;
  onLogout: () => void;
  onFamilyCirclePress?: () => void;
  onRelationshipManagerPress?: () => void;
  onOperationsPress?: () => void;
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

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onEditProfile,
  onMembershipPress,
  onViewMyProfile,
  onLogout,
  onFamilyCirclePress,
  onRelationshipManagerPress,
  onOperationsPress,
  unreadCount,
  isAdmin,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';
  const t = Translations[language];

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [myProfile, setMyProfile] = useState<MatrimonyProfile | null>(null);
  const [hidePhone, setHidePhone] = useState(true);
  const [hideHoroscope, setHideHoroscope] = useState(false);

  const loadData = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);

    const profile = await StorageService.getProfileById(user.activeProfileId);
    setMyProfile(profile);
    if (profile) {
      setHidePhone(profile.privacy.hidePhoneUntilInterestAccepted);
      setHideHoroscope(profile.privacy.hideHoroscopeUntilRequested);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleHidePhone = async (val: boolean) => {
    setHidePhone(val);
    if (myProfile) {
      const updated = {
        ...myProfile,
        privacy: { ...myProfile.privacy, hidePhoneUntilInterestAccepted: val },
      };
      await StorageService.saveProfile(updated);
      setMyProfile(updated);
    }
  };

  const handleToggleHideHoroscope = async (val: boolean) => {
    setHideHoroscope(val);
    if (myProfile) {
      const updated = {
        ...myProfile,
        privacy: { ...myProfile.privacy, hideHoroscopeUntilRequested: val },
      };
      await StorageService.saveProfile(updated);
      setMyProfile(updated);
    }
  };

  const completeness = myProfile?.profileCompleteness || 78;

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
              <Text style={styles.brandSubTitleText}>MY ACCOUNT</Text>
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
                    myProfile?.photos?.[0] ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.avatarImage}
              />
            </View>
          </View>
        </View>

        {/* User Greeting & Badges Inside Header */}
        <View style={styles.userSummaryHeaderRow}>
          <Image
            source={{
              uri:
                myProfile?.photos?.[0] ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.largeHeaderAvatar}
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.headerUserName} numberOfLines={1}>{myProfile?.name || 'Karthik'}</Text>
              <View style={styles.verifiedDot} />
            </View>
            <Text style={styles.headerUserId}>ID: {myProfile?.matrimonyId || 'MM-2026-8821'}</Text>
            <View style={styles.headerBadgesRow}>
              <View style={styles.goldBadge}>
                <Text style={styles.goldBadgeText}>👑 {currentUser?.membershipTier.toUpperCase()} MEMBER</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Floating White Metric Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricCardSubhead}>
              {isTa ? 'சுயவிவரம் & உறுப்பினர் நிலவரம்' : 'Account Health & Quotas'}
            </Text>
            <TouchableOpacity onPress={onEditProfile} activeOpacity={0.7}>
              <Text style={styles.editLinkText}>{isTa ? 'திருத்து' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gaugesRow}>
            <RingGauge value={completeness} max={100} label={`${completeness}%`} unit={isTa ? 'நிறைவு' : 'COMPLETION'} color="#E5A914" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={currentUser?.contactsViewedRemaining || 42} max={50} label={`${currentUser?.contactsViewedRemaining || 42}`} unit={isTa ? 'தொடர்புகள்' : 'CONTACTS'} color="#6A7A14" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={currentUser?.interestsRemaining || 98} max={100} label={`${currentUser?.interestsRemaining || 98}`} unit={isTa ? 'விருப்பங்கள்' : 'INTERESTS'} color="#D17575" />
          </View>
        </View>
      </View>

      {/* ── 2. BODY CONTENT ──────────────────────────────────────────────── */}
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
        {/* Quick Action Buttons */}
        <View style={styles.actionBtnRow}>
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => myProfile && onViewMyProfile(myProfile)}
            activeOpacity={0.85}
          >
            <Text style={styles.previewBtnText}>{isTa ? 'சுயவிவரப் பார்வை' : 'Preview Profile'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editProfileBtn} onPress={onEditProfile} activeOpacity={0.88}>
            <Text style={styles.editProfileBtnText}>{isTa ? 'விவரங்களை மாற்று' : 'Edit Details'}</Text>
          </TouchableOpacity>
        </View>

        {/* Deep Obsidian Membership Card (#1A1C1E) */}
        <TouchableOpacity
          style={styles.obsidianCard}
          onPress={onMembershipPress}
          activeOpacity={0.9}
        >
          <View style={styles.obsidianTopRow}>
            <View style={styles.obsidianCrownIcon}>
              <CustomIcon name="crown" size={20} color={PALETTE.amberHeader} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.membershipRow}>
                <Text style={styles.membershipTitle}>{currentUser?.membershipTier.toUpperCase()} KALYANAM</Text>
                <View style={styles.upgradeBadge}>
                  <Text style={styles.upgradeBadgeText}>UPGRADE</Text>
                </View>
              </View>
              <Text style={styles.membershipSubText}>
                {currentUser?.contactsViewedRemaining} phone unlocks & {currentUser?.interestsRemaining} interests remaining
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Assisted Matchmaking & Operations Suite */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>
            {isTa ? 'உதவி பெற்ற வரன் தேடல் & செயல்பாடுகள்' : 'Assisted Matchmaking & Operations'}
          </Text>

          {/* 1. Family Decision Circle */}
          <TouchableOpacity style={styles.rowItem} onPress={onFamilyCirclePress} activeOpacity={0.8}>
            <View style={[styles.rowIconWrap, { backgroundColor: '#EEF0D6' }]}>
              <CustomIcon name="crown" size={17} color="#6A7513" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{isTa ? 'குடும்ப முடிவுக் குழு' : 'Family Decision Circle'}</Text>
              <Text style={styles.rowSub}>
                {isTa ? 'குடும்பத்தினர் இணைந்து வரன் ஆய்வு & வாட்ஸ்அப் பகிர்வு' : 'Collaborative family voting & WhatsApp sharing'}
              </Text>
            </View>
            <CustomIcon name="chevron-right" size={16} color={PALETTE.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* 2. Relationship Manager */}
          <TouchableOpacity style={styles.rowItem} onPress={onRelationshipManagerPress} activeOpacity={0.8}>
            <View style={[styles.rowIconWrap, { backgroundColor: '#FCE6BE' }]}>
              <CustomIcon name="star" size={17} color="#9E6E00" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{isTa ? 'அர்ப்பணிப்பு உறவு மேலாளர்' : 'Relationship Manager Portal'}</Text>
              <Text style={styles.rowSub}>
                {isTa ? 'ஸ்ரீமதி மீனாட்சி • தனிப்பட்ட முறையில் தேர்ந்தெடுக்கப்பட்ட வரன்கள்' : 'Smt. Meenakshi • Curated varans & meeting tracker'}
              </Text>
            </View>
            <CustomIcon name="chevron-right" size={16} color={PALETTE.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* 3. Operations & Commissions */}
          <TouchableOpacity style={styles.rowItem} onPress={onOperationsPress} activeOpacity={0.8}>
            <View style={[styles.rowIconWrap, { backgroundColor: '#F5ECE3' }]}>
              <CustomIcon name="briefcase" size={17} color={PALETTE.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{isTa ? 'கிளை & முகவர் கமிஷன் போர்டல்' : 'Agent, Branch & Referral Operations'}</Text>
              <Text style={styles.rowSub}>
                {isTa ? '5 தமிழ்நாடு கிளைகள் • 20% முகவர் கமிஷன் & பரிந்துரை அறிக்கை' : '5 TN branches • 20% agent commission tracking'}
              </Text>
            </View>
            <CustomIcon name="chevron-right" size={16} color={PALETTE.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Privacy & Protection Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>{isTa ? 'தனியுரிமை & பாதுகாப்பு' : 'Privacy & Protection'}</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.settingLabel}>{t.hidePhone}</Text>
              <Text style={styles.settingSub}>Prevent public display of your phone until interest is accepted</Text>
            </View>
            <Switch
              value={hidePhone}
              onValueChange={handleToggleHidePhone}
              trackColor={{ false: '#E6E2CF', true: PALETTE.maroon }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.settingLabel}>{t.hideHoroscope}</Text>
              <Text style={styles.settingSub}>Share detailed Jathagam coordinates only upon explicit request</Text>
            </View>
            <Switch
              value={hideHoroscope}
              onValueChange={handleToggleHideHoroscope}
              trackColor={{ false: '#E6E2CF', true: PALETTE.maroon }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Admin Center & Logout */}
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.rowItem} onPress={onAdminPress} activeOpacity={0.8}>
            <View style={[styles.rowIconWrap, { backgroundColor: '#FCEAEA' }]}>
              <CustomIcon name="admin" size={17} color={PALETTE.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Admin Command Center</Text>
              <Text style={styles.rowSub}>Switch to moderator & operations console</Text>
            </View>
            <CustomIcon name="chevron-right" size={16} color={PALETTE.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.85}>
            <Text style={styles.logoutBtnText}>{isTa ? 'வெளியேறு' : 'Log Out'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  userSummaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeHeaderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  headerUserName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1614',
  },
  verifiedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6A7A14',
  },
  headerUserId: {
    fontSize: 11.5,
    fontWeight: '600',
    color: 'rgba(28, 22, 20, 0.72)',
    marginTop: 1,
  },
  headerBadgesRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  goldBadge: {
    backgroundColor: '#1C1614',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  goldBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: PALETTE.amberHeader,
    letterSpacing: 0.5,
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
  editLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.amberHeaderDark,
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
  actionBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  previewBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.textInk,
  },
  editProfileBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: PALETTE.amberHeader,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1614',
  },
  obsidianCard: {
    backgroundColor: PALETTE.obsidianCard,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  obsidianTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  obsidianCrownIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(247, 191, 42, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  membershipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  upgradeBadge: {
    backgroundColor: PALETTE.amberHeader,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  upgradeBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1C1614',
  },
  membershipSubText: {
    fontSize: 11,
    color: '#9BA1AB',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    shadowColor: '#3A271D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: PALETTE.textInk,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: PALETTE.textInk,
    marginBottom: 2,
  },
  rowSub: {
    fontSize: 11,
    color: PALETTE.textMuted,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F5EFE6',
    marginVertical: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: PALETTE.textInk,
    marginBottom: 2,
  },
  settingSub: {
    fontSize: 11,
    color: PALETTE.textMuted,
    lineHeight: 15,
  },
  logoutBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FCEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: PALETTE.rose,
  },
});
