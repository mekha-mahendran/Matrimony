/**
 * Manamaalai Matrimony (மணமாலை) — Modern Profile Detail Screen
 *
 * Implements the exact design from the reference screenshots:
 * - Full-bleed Hero Photo with:
 *     - Top-left circular Back button (←)
 *     - Top-right frosted Distance capsule ("12.6 km away")
 *     - Center-bottom Compatibility Pill ("90% Match" with circular ring gauge)
 * - White Bottom Sheet Card:
 *     - Drag handle pill
 *     - Name, Age & Golden Verified Badge (e.g. "Marvin McKinney, 22 ✓")
 *     - Location in uppercase (e.g. "NEWYORK, USA")
 *     - Floating Purple Chat Button on right
 *     - Description section with expandable "Read more"
 *     - Interest section with pill chips (Gaming, Music, Book, Language, Photography)
 *     - [Name]'s Info section (Age, Height, Speaks)
 *     - Gallery section with side-by-side photo cards
 * - Floating Dark Action Capsule at bottom:
 *     - White circle with purple ✕ (Pass / Back)
 *     - Royal purple circle with white ♥ (Like / Send Interest)
 *     - Golden yellow circle with dark ★ (Super Like / Shortlist)
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import { CurrentUser, MatrimonyProfile, PoruthamResult } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

interface ProfileDetailProps {
  profile: MatrimonyProfile;
  language: Language;
  onBack: () => void;
  onViewHoroscopePorutham?: (porutham: PoruthamResult) => void;
  onUpgradeMembership?: () => void;
  onChatPress: () => void;
}

export const ProfileDetailScreen: React.FC<ProfileDetailProps> = ({
  profile,
  language,
  onBack,
  onChatPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [isShortlisted, setIsShortlisted] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [activePhoto, setActivePhoto] = useState(
    profile.photos && profile.photos.length > 0
      ? profile.photos[0]
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );

  useEffect(() => {
    async function checkStatus() {
      if (profile.id) {
        const sl = await StorageService.getShortlists();
        setIsShortlisted(sl.includes(profile.id));

        const interests = await StorageService.getInterests();
        const existing = interests.find(
          i => i.receiverProfileId === profile.id || i.senderProfileId === profile.id
        );
        if (existing) {
          setInterestSent(true);
        }
      }
    }
    checkStatus();
  }, [profile.id]);

  const firstName = profile.name ? profile.name.split(' ')[0] : 'Member';
  const age = profile.age || 22;
  const location = `${profile.currentCity || 'NEWYORK'}, ${profile.currentCountry || 'USA'}`.toUpperCase();
  const heightStr = profile.lifestyle?.heightCm
    ? `${profile.lifestyle.heightCm} cm`
    : profile.lifestyle?.heightFeet
    ? profile.lifestyle.heightFeet
    : '175 cm';
  const languagesSpoken = profile.lifestyle?.languagesKnown && profile.lifestyle.languagesKnown.length > 0
    ? profile.lifestyle.languagesKnown.join(', ')
    : 'English';

  const distance = (profile as any).distance || '12.6 km away';

  const defaultDescription = profile.about ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Passionate about creative art, culture, and discovering meaningful connections with traditional values.';

  // Sample interests chips matching reference image
  const interestsList = [
    { id: '1', label: 'Gaming', icon: 'gaming' },
    { id: '2', label: 'Music', icon: 'music' },
    { id: '3', label: 'Book', icon: 'book' },
    { id: '4', label: 'Language', icon: 'language' },
    { id: '5', label: 'Photography', icon: 'photo' },
  ];

  // Gallery photos
  const galleryPhotos = profile.photos && profile.photos.length > 1
    ? profile.photos.slice(1, 3)
    : [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      ];

  const handleSendInterest = async () => {
    if (interestSent) {
      Alert.alert(isTa ? 'விருப்பம் ஏற்கனவே அனுப்பப்பட்டது' : 'Interest Already Sent', isTa ? 'நீங்கள் ஏற்கனவே விருப்பம் தெரிவித்துள்ளீர்கள்' : 'You have already expressed interest in this profile.');
      return;
    }
    await StorageService.sendInterest('my_profile', profile.id || 'usr_matched').catch(() => {});
    setInterestSent(true);
    Alert.alert(
      isTa ? 'விருப்பம் அனுப்பப்பட்டது! 💖' : 'Interest Expressed! 💖',
      isTa ? `${profile.name} வரனுக்கு உங்கள் விருப்பம் தெரிவிக்கப்பட்டது.` : `You have successfully expressed interest in ${profile.name}.`
    );
  };

  const handleToggleShortlist = async () => {
    if (profile.id) {
      const res = await StorageService.toggleShortlist(profile.id);
      setIsShortlisted(res);
      Alert.alert(
        res ? (isTa ? 'சிறப்பு விருப்பம் ⭐' : 'Shortlisted ⭐') : (isTa ? 'நீக்கப்பட்டது' : 'Removed'),
        res
          ? (isTa ? 'பட்டியலில் சேர்க்கப்பட்டது!' : `${profile.name} has been added to your shortlist!`)
          : (isTa ? 'பட்டியலிலிருந்து நீக்கப்பட்டது.' : 'Removed from your shortlist.')
      );
    }
  };

  const renderInterestIcon = (type: string) => {
    switch (type) {
      case 'gaming':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2}>
            <Rect x="2" y="6" width="20" height="12" rx="4" />
            <Path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" strokeLinecap="round" />
          </Svg>
        );
      case 'music':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2}>
            <Path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          </Svg>
        );
      case 'book':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2}>
            <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
          </Svg>
        );
      case 'language':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2}>
            <Circle cx="12" cy="12" r="10" />
            <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </Svg>
        );
      case 'photo':
      default:
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2}>
            <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <Circle cx="12" cy="13" r="4" />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Top-Left Back Button (Visible when scrolled) */}
      <TouchableOpacity
        style={[styles.floatingBackButton, { top: Math.max(insets.top + 8, 20) }]}
        onPress={onBack}
        activeOpacity={0.8}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.5}>
          <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 110, 130) },
        ]}
        bounces={false}
      >
        {/* ─── 1. Hero Photo Header ────────────────────────────────────────── */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: activePhoto }} style={styles.heroImage} resizeMode="cover" />

          {/* Distance Badge on top right of Hero */}
          <View style={[styles.distanceBadgeWrap, { top: Math.max(insets.top + 8, 20) }]}>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
          </View>

          {/* Compatibility Match Badge (90% Match) */}
          <View style={styles.matchPillBadge}>
            <View style={styles.gaugeCircle}>
              <Svg width={30} height={30} viewBox="0 0 36 36">
                <Circle cx="18" cy="18" r="14" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" />
                <Circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke={BRAND_PURPLE}
                  strokeWidth="3.5"
                  strokeDasharray="88 88"
                  strokeDashoffset="12"
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 18 18)"
                />
              </Svg>
              <Text style={styles.gaugePercentText}>90%</Text>
            </View>
            <Text style={styles.matchText}>{isTa ? 'பொருத்தம்' : 'Match'}</Text>
          </View>
        </View>

        {/* ── 2. White Details Bottom Sheet Card ────────────────────── */}
        <View style={styles.detailsSheet}>
          {/* Sheet Handle */}
          <View style={styles.handlePill} />

          {/* Profile Name, Location & Chat Button */}
          <View style={styles.profileHeaderRow}>
            <View style={styles.nameLocationWrap}>
              <View style={styles.nameRow}>
                <Text style={styles.profileNameTitle}>
                  {profile.name}, {age}
                </Text>
                {/* Yellow Verified Star Badge */}
                <View style={styles.verifiedStarBadge}>
                  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
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
              <Text style={styles.locationSubtitle}>{location}</Text>
            </View>

            {/* Circular Purple Chat Button */}
            <TouchableOpacity
              style={styles.chatButton}
              onPress={onChatPress}
              activeOpacity={0.85}
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
                <Path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* ── 3. Description Section ──────────────────────────────── */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeading}>{isTa ? 'விளக்கம்' : 'Description'}</Text>
            <Text style={styles.descriptionBody} numberOfLines={isBioExpanded ? undefined : 3}>
              {defaultDescription}
            </Text>
            <TouchableOpacity
              onPress={() => setIsBioExpanded(!isBioExpanded)}
              activeOpacity={0.7}
              style={styles.readMoreBtn}
            >
              <Text style={styles.readMoreText}>
                {isBioExpanded ? (isTa ? 'குறைவாகப் பார்' : 'Show less') : (isTa ? 'மேலும் வாசிக்க' : 'Read more')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── 4. Interests Section ─────────────────────────────────── */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeading}>{isTa ? 'விருப்பங்கள்' : 'Interest'}</Text>
            <View style={styles.interestsRow}>
              {interestsList.map(item => (
                <View key={item.id} style={styles.interestChip}>
                  {renderInterestIcon(item.icon)}
                  <Text style={styles.interestChipText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── 5. Member's Info Section ────────────────────────────── */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeading}>
              {isTa ? `${firstName} பற்றிய தகவல்` : `${firstName}’s Info.`}
            </Text>
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{isTa ? 'வயது' : 'Age'}</Text>
                <Text style={styles.infoVal}>{age} Years</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{isTa ? 'உயரம்' : 'Height'}</Text>
                <Text style={styles.infoVal}>{heightStr}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{isTa ? 'மொழிகள்' : 'Speaks'}</Text>
                <Text style={styles.infoVal}>{languagesSpoken}</Text>
              </View>
            </View>
          </View>

          {/* ── 6. Gallery Section ──────────────────────────────────── */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeading}>{isTa ? 'புகைப்படங்கள்' : 'Gallery'}</Text>
            <View style={styles.galleryRow}>
              {galleryPhotos.map((imgUrl, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.galleryCard}
                  activeOpacity={0.9}
                  onPress={() => setActivePhoto(imgUrl)}
                >
                  <Image source={{ uri: imgUrl }} style={styles.galleryImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── 7. Floating Bottom Action Capsule ───────────────────────── */}
      <View
        style={[
          styles.floatingBottomCapsule,
          { bottom: insets.bottom > 0 ? insets.bottom + 12 : 20 },
        ]}
      >
        {/* Pass Button (White with Purple Cross) */}
        <TouchableOpacity
          style={styles.capsuleBtnWhite}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.8}>
            <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        {/* Like Button (Royal Purple with White Heart) */}
        <TouchableOpacity
          style={styles.capsuleBtnPurple}
          onPress={handleSendInterest}
          activeOpacity={0.85}
        >
          <Svg width={26} height={26} viewBox="0 0 24 24" fill="#FFFFFF">
            <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </Svg>
        </TouchableOpacity>

        {/* Super Like Button (Yellow with Dark Star) */}
        <TouchableOpacity
          style={styles.capsuleBtnYellow}
          onPress={handleToggleShortlist}
          activeOpacity={0.8}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="#18181D">
            <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* Hero Section */
  heroContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.48,
    position: 'relative',
    backgroundColor: '#1E1E24',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topControlsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  floatingBackButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  distanceBadgeWrap: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  distanceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Match Pill Badge */
  matchPillBadge: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 34, 0.82)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gaugeCircle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugePercentText: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  matchText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Bottom Details Sheet */
  detailsSheet: {
    marginTop: -26,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  handlePill: {
    width: 42,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nameLocationWrap: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileNameTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#18181D',
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
  locationSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.1,
    marginTop: 4,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  /* Sections */
  sectionWrap: {
    marginBottom: 22,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#18181D',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  descriptionBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    fontWeight: '400',
  },
  readMoreBtn: {
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_PURPLE,
    // clean style
  },

  /* Interests Chips */
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 7,
  },
  interestChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },

  /* Info Table */
  infoTable: {
    backgroundColor: '#FAFAFD',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181D',
  },

  /* Gallery */
  galleryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  galleryCard: {
    flex: 1,
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },

  /* Floating Bottom Action Capsule */
  floatingBottomCapsule: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#1E1E24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 230,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 99,
  },
  capsuleBtnWhite: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleBtnPurple: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleBtnYellow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
