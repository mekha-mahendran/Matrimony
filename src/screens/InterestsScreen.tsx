/**
 * Manamaalai Matrimony (மணமாலை) — Modern Golden Interests Screen
 *
 * Implements the unified golden-amber dashboard styling:
 * - Warm Golden Amber Hero Header (#F7BF2A)
 * - Sticky TopBar with Brand Badge, Avatar, Language Switcher & Notifications
 * - Segmented Header Tabs: Received (14), Sent (8), Accepted (5), Declined
 * - Floating White Metric Card with 3 Circular Ring Progress Gauges:
 *     1. Received Pending (14)
 *     2. Accepted Mutual (5)
 *     3. Sent Interests (8)
 * - High-Contrast Interest Cards with clean accept/decline/chat actions
 */

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { CustomIcon } from '../components/CustomIcon';
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import { CurrentUser, InterestRecord, MatrimonyProfile } from '../types';

/* ─── Luxury Design Tokens ─────────────────────────────────────────────────── */
const PALETTE = {
  amberHeader: '#F7BF2A',
  amberHeaderDark: '#E5A914',
  obsidianCard: '#1A1C1E',
  obsidianMuted: '#9BA1AB',
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

interface InterestsScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  onChatPress: (profile: MatrimonyProfile) => void;
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

export const InterestsScreen: React.FC<InterestsScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onProfilePress,
  onChatPress,
  unreadCount,
  isAdmin,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';
  const t = Translations[language];

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<MatrimonyProfile | null>(null);
  const [interests, setInterests] = useState<InterestRecord[]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, MatrimonyProfile>>({});
  const [tab, setTab] = useState<'received' | 'sent' | 'accepted' | 'declined'>('received');

  const loadData = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);

    const curr = await StorageService.getProfileById(user.activeProfileId);
    setCurrentProfile(curr);

    const intList = await StorageService.getInterests();
    setInterests(intList);

    const profiles = await StorageService.getAllProfiles();
    const map: Record<string, MatrimonyProfile> = {};
    profiles.forEach(p => {
      map[p.id] = p;
    });
    setProfilesMap(map);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (interestId: string) => {
    await StorageService.updateInterestStatus(interestId, 'accepted');
    await loadData();
  };

  const handleDecline = async (interestId: string) => {
    await StorageService.updateInterestStatus(interestId, 'declined');
    await loadData();
  };

  if (!currentUser) return null;

  // Filter lists based on tab
  const receivedList = interests.filter(
    i => i.receiverProfileId === currentUser.activeProfileId && i.status === 'pending'
  );
  const sentList = interests.filter(i => i.senderProfileId === currentUser.activeProfileId);
  const acceptedList = interests.filter(
    i =>
      (i.senderProfileId === currentUser.activeProfileId ||
        i.receiverProfileId === currentUser.activeProfileId) &&
      i.status === 'accepted'
  );
  const declinedList = interests.filter(
    i =>
      (i.senderProfileId === currentUser.activeProfileId ||
        i.receiverProfileId === currentUser.activeProfileId) &&
      i.status === 'declined'
  );

  let currentItems = receivedList;
  if (tab === 'sent') currentItems = sentList;
  if (tab === 'accepted') currentItems = acceptedList;
  if (tab === 'declined') currentItems = declinedList;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── 1. WARM GOLDEN AMBER HEADER ZONE ──────────────────────────────── */}
      <View style={[styles.amberHeaderZone, { paddingTop: Math.max(insets.top, 12) }]}>
        {/* Top Bar Row */}
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
              <Text style={styles.brandSubTitleText}>INTERESTS DESK</Text>
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
          {[
            { id: 'received', label: isTa ? 'வந்தவை' : 'Received', count: receivedList.length },
            { id: 'sent', label: isTa ? 'அனுப்பியவை' : 'Sent', count: sentList.length },
            { id: 'accepted', label: isTa ? 'ஏற்றவை' : 'Accepted', count: acceptedList.length },
            { id: 'declined', label: isTa ? 'மறுத்தவை' : 'Declined', count: declinedList.length },
          ].map(item => {
            const isActive = tab === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.headerTabBtn, isActive && styles.headerTabBtnActive]}
                onPress={() => setTab(item.id as any)}
                activeOpacity={0.85}
              >
                <Text style={[styles.headerTabText, isActive && styles.headerTabTextActive]}>
                  {item.label}
                </Text>
                <View style={[styles.countBadge, isActive && { backgroundColor: '#F5ECE3' }]}>
                  <Text style={[styles.countBadgeText, isActive && { color: PALETTE.maroon }]}>
                    {item.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Floating White Metric Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricCardSubhead}>
              {isTa ? 'விருப்பங்கள் மற்றும் உரையாடல் நிலவரம்' : 'Matchmaking Requests Overview'}
            </Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Active</Text>
            </View>
          </View>

          <View style={styles.gaugesRow}>
            <RingGauge value={receivedList.length} max={20} label={`${receivedList.length}`} unit={isTa ? 'வந்தவை' : 'RECEIVED'} color="#E5A914" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={acceptedList.length} max={15} label={`${acceptedList.length}`} unit={isTa ? 'ஏற்றவை' : 'ACCEPTED'} color="#6A7A14" />
            <View style={styles.gaugeDivider} />
            <RingGauge value={sentList.length} max={25} label={`${sentList.length}`} unit={isTa ? 'அனுப்பியவை' : 'SENT'} color="#D17575" />
          </View>
        </View>
      </View>

      {/* ── 2. INTERESTS LIST ────────────────────────────────────────────── */}
      <FlatList
        data={currentItems}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const otherProfileId =
            item.senderProfileId === currentUser.activeProfileId
              ? item.receiverProfileId
              : item.senderProfileId;
          const otherProfile = profilesMap[otherProfileId];

          if (!otherProfile) return null;

          const isReceivedPending =
            tab === 'received' && item.receiverProfileId === currentUser.activeProfileId;
          const isTopFeatured = index === 0 && isReceivedPending;

          // Featured Top Pending Item in Deep Obsidian Card (#1A1C1E)
          if (isTopFeatured) {
            return (
              <View style={styles.obsidianCard}>
                <View style={styles.obsidianBadgeRow}>
                  <View style={styles.obsidianBadge}>
                    <Text style={styles.obsidianBadgeText}>NEW INTEREST</Text>
                  </View>
                  <Text style={styles.obsidianTimeText}>Today</Text>
                </View>

                <TouchableOpacity
                  style={styles.cardHeaderRow}
                  onPress={() => onProfilePress(otherProfile)}
                  activeOpacity={0.88}
                >
                  <Image source={{ uri: otherProfile.photos[0] }} style={styles.obsidianAvatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.obsidianName}>{otherProfile.name.split(',')[0]}, {otherProfile.age}</Text>
                    <Text style={styles.obsidianJob} numberOfLines={1}>{otherProfile.educationCareer.occupation}</Text>
                    <Text style={styles.obsidianCity}>{otherProfile.caste} • {otherProfile.currentCity}</Text>
                  </View>
                </TouchableOpacity>

                {item.message ? (
                  <View style={styles.obsidianMessageBox}>
                    <Text style={styles.obsidianMessageText} numberOfLines={2}>"{item.message}"</Text>
                  </View>
                ) : null}

                <View style={styles.obsidianActionRow}>
                  <TouchableOpacity style={styles.obsidianDeclineBtn} onPress={() => handleDecline(item.id)} activeOpacity={0.8}>
                    <Text style={styles.obsidianDeclineText}>{isTa ? 'மறுக்க' : 'Decline'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.obsidianAcceptBtn} onPress={() => handleAccept(item.id)} activeOpacity={0.88}>
                    <Text style={styles.obsidianAcceptText}>✓ {isTa ? 'ஏற்றுக்கொள்' : 'Accept Interest'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          // Standard White Luxury Cards
          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardMainRow}
                onPress={() => onProfilePress(otherProfile)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: otherProfile.photos[0] }} style={styles.avatar} />

                <View style={styles.infoCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText} numberOfLines={1}>
                      {otherProfile.name.split(',')[0]}, {otherProfile.age}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        item.status === 'accepted'
                          ? { backgroundColor: PALETTE.oliveSoft }
                          : item.status === 'pending'
                          ? { backgroundColor: '#FDF1DC' }
                          : { backgroundColor: '#FCEAEA' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          item.status === 'accepted' && { color: PALETTE.olive },
                          item.status === 'pending' && { color: '#9E6E00' },
                          item.status === 'declined' && { color: PALETTE.rose },
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.subText}>
                    {otherProfile.caste} • {otherProfile.currentCity}
                  </Text>
                  <Text style={styles.occupationText} numberOfLines={1}>
                    {otherProfile.educationCareer.occupation}
                  </Text>

                  {item.message && (
                    <Text style={styles.messageBox} numberOfLines={2}>
                      "{item.message}"
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Action Buttons */}
              {isReceivedPending ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(item.id)} activeOpacity={0.8}>
                    <Text style={styles.declineBtnText}>{isTa ? 'மறுக்க' : 'Decline'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)} activeOpacity={0.85}>
                    <Text style={styles.acceptBtnText}>{isTa ? 'ஏற்றுக்கொள்' : 'Accept'}</Text>
                  </TouchableOpacity>
                </View>
              ) : item.status === 'accepted' ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.chatBtn} onPress={() => onChatPress(otherProfile)} activeOpacity={0.85}>
                    <CustomIcon name="message" size={16} color="#FFFFFF" />
                    <Text style={styles.chatBtnText}>{isTa ? 'உரையாடலைத் தொடங்கு' : 'Start Conversation'}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <CustomIcon name="heart" size={28} color={PALETTE.amberHeaderDark} />
            </View>
            <Text style={styles.emptyTitle}>
              {isTa ? 'விருப்பங்கள் எதுவும் இல்லை' : `No ${tab} interests yet`}
            </Text>
            <Text style={styles.emptySub}>
              {isTa
                ? 'உங்கள் தேடல் அளவுகோல்களை சரிபார்த்து புதிய வரன்களை கண்டறியவும்.'
                : 'Explore daily recommendations and connect with matching profiles.'}
            </Text>
          </View>
        }
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
  headerTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 18,
    gap: 5,
  },
  headerTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#8C6700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(28, 22, 20, 0.75)',
  },
  headerTabTextActive: {
    color: '#1C1614',
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
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  /* Obsidian Featured Card */
  obsidianCard: {
    backgroundColor: PALETTE.obsidianCard,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 7,
  },
  obsidianBadgeRow: {
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
  obsidianTimeText: {
    fontSize: 11,
    color: PALETTE.obsidianMuted,
  },
  cardHeaderRow: {
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
    color: PALETTE.obsidianMuted,
    marginBottom: 2,
  },
  obsidianCity: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  obsidianMessageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  obsidianMessageText: {
    fontSize: 12,
    color: '#EFE8DC',
    fontStyle: 'italic',
  },
  obsidianActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  obsidianDeclineBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  obsidianDeclineText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  obsidianAcceptBtn: {
    flex: 2,
    height: 40,
    borderRadius: 12,
    backgroundColor: PALETTE.amberHeader,
    alignItems: 'center',
    justifyContent: 'center',
  },
  obsidianAcceptText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1614',
  },

  /* White Standard Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    shadowColor: '#3A271D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EAE4DA',
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.textInk,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  subText: {
    fontSize: 11.5,
    color: PALETTE.textMuted,
    marginBottom: 1,
  },
  occupationText: {
    fontSize: 11,
    color: PALETTE.textSecondary,
    marginBottom: 4,
  },
  messageBox: {
    fontSize: 11.5,
    color: PALETTE.maroon,
    fontStyle: 'italic',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  declineBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5EFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.textSecondary,
  },
  acceptBtn: {
    flex: 1.5,
    height: 36,
    borderRadius: 10,
    backgroundColor: PALETTE.amberHeader,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C1614',
  },
  chatBtn: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: PALETTE.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chatBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
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
