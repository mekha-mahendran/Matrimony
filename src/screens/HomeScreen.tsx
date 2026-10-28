import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { FilterModal } from '../components/FilterModal';
import { Header } from '../components/Header';
import { MatchModal } from '../components/MatchModal';
import { Language, Translations } from '../localization';
import { calculateTenPoruthams } from '../services/horoscopeService';
import { StorageService } from '../services/storage';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../theme';
import { CurrentUser, MatrimonyProfile, SearchFilterState } from '../types';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 0.25 * width;

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
  unreadCount: number;
  isAdmin: boolean;
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
  unreadCount,
  isAdmin,
}) => {
  const t = Translations[language];
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<MatrimonyProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<MatrimonyProfile[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [sentInterestIds, setSentInterestIds] = useState<string[]>([]);
  const [receivedInterestCount, setReceivedInterestCount] = useState(0);
  const [visitors, setVisitors] = useState<MatrimonyProfile[]>([]);
  const [dailyRecs, setDailyRecs] = useState<MatrimonyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // View Mode: 'dashboard' (Comprehensive TamilMatrimony) | 'deck' (Interactive Swiping)
  const [viewMode, setViewMode] = useState<'dashboard' | 'deck'>('dashboard');

  // Deck Swipe State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<MatrimonyProfile | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [filterState, setFilterState] = useState<SearchFilterState>({
    ageMin: 21,
    ageMax: 36,
    heightMinCm: 145,
    heightMaxCm: 200,
    caste: [],
    district: [],
    education: [],
    verifiedOnly: false,
    withPhotoOnly: false,
    horoscopePoruthamOnly: false,
    searchQuery: '',
    sortBy: 'relevance',
  });

  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await StorageService.getCurrentUser();
      setCurrentUser(user);

      const profile = await StorageService.getProfileById(user.activeProfileId);
      setCurrentProfile(profile);

      const profiles = await StorageService.getAllProfiles();
      setAllProfiles(profiles);

      const sl = await StorageService.getShortlists();
      setShortlistedIds(sl);

      const interests = await StorageService.getInterests();
      const sent = interests
        .filter(i => i.senderProfileId === user.activeProfileId)
        .map(i => i.receiverProfileId);
      setSentInterestIds(sent);

      const received = interests.filter(
        i => i.receiverProfileId === user.activeProfileId && i.status === 'pending'
      );
      setReceivedInterestCount(received.length);

      // Load Profile Visitors
      const viewRecords = await StorageService.getViewsForProfile(user.activeProfileId);
      const visitorProfiles: MatrimonyProfile[] = [];
      viewRecords.slice(0, 5).forEach(v => {
        const found = profiles.find(p => p.id === v.viewerProfileId);
        if (found && !visitorProfiles.some(vp => vp.id === found.id)) {
          visitorProfiles.push(found);
        }
      });
      setVisitors(visitorProfiles);

      // Load Daily Recs
      const targetGen = profile?.gender === 'bride' ? 'groom' : 'bride';
      const recs = await StorageService.getDailyRecommendations(9, targetGen);
      setDailyRecs(recs);
    } catch (e) {
      console.warn('HomeScreen loadData error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const targetGender = currentProfile?.gender === 'bride' ? 'groom' : 'bride';
  const candidateProfiles = allProfiles.filter(p => {
    if (p.id === currentProfile?.id) return false;
    if (currentProfile && p.gender !== targetGender) return false;
    return true;
  });

  // Recently joined
  const recentlyJoined = [...candidateProfiles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Deck filtered
  const deckProfiles = candidateProfiles.filter(p => {
    if (filterState.verifiedOnly && !p.isVerified) return false;
    if (filterState.district && filterState.district.length > 0 && !filterState.district.includes(p.currentCity)) {
      return false;
    }
    return true;
  });

  const activeCandidate = deckProfiles[currentIndex] || null;
  const nextCandidate = deckProfiles[currentIndex + 1] || null;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 260,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    const candidate = deckProfiles[currentIndex];
    position.setValue({ x: 0, y: 0 });

    if (direction === 'right' && candidate && currentProfile) {
      await StorageService.sendInterest(currentProfile.id, candidate.id);
      setSentInterestIds(prev => [...prev, candidate.id]);
      setMatchedProfile(candidate);
      setShowMatchModal(true);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const cardRotate = position.x.interpolate({
    inputRange: [-width * 1.5, 0, width * 1.5],
    outputRange: ['-18deg', '0deg', '18deg'],
  });

  const animatedCardStyle = {
    transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: cardRotate }],
  };

  const likeOverlayOpacity = position.x.interpolate({
    inputRange: [0, width * 0.35],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOverlayOpacity = position.x.interpolate({
    inputRange: [-width * 0.35, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleToggleShortlist = async (profileId: string) => {
    const isNow = await StorageService.toggleShortlist(profileId);
    setShortlistedIds(prev =>
      isNow ? [profileId, ...prev] : prev.filter(id => id !== profileId)
    );
  };

  const handleSendInterest = async (profileId: string) => {
    if (!currentProfile) return;
    await StorageService.sendInterest(currentProfile.id, profileId);
    setSentInterestIds(prev => [...prev, profileId]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Brand Header */}
      <Header
        language={language}
        onToggleLanguage={onToggleLanguage}
        unreadNotificationsCount={unreadCount}
        onNotificationPress={onNotificationPress}
        onAdminPress={onAdminPress}
        isAdmin={isAdmin}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Personalized Member Greeting & Verification Bar */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingRow}>
            <TouchableOpacity
              onPress={() => onProfilePress(currentProfile || candidateProfiles[0])}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri:
                    currentProfile?.photos?.[0] ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
                }}
                style={styles.greetingAvatar}
              />
            </TouchableOpacity>

            <View style={styles.greetingInfo}>
              <View style={styles.vanakkamRow}>
                <Text style={styles.greetingText}>
                  {language === 'ta' ? 'வணக்கம், ' : 'Vanakkam, '}
                  <Text style={styles.greetingName}>
                    {currentProfile?.name?.split(' ')[0] || 'Member'}
                  </Text>
                </Text>
                {currentProfile?.isVerified && (
                  <View style={styles.miniVerifiedPill}>
                    <CustomIcon name="shield" size={11} color={Colors.verifiedBlue} />
                    <Text style={styles.miniVerifiedText}>Verified</Text>
                  </View>
                )}
              </View>

              <Text style={styles.profileIdText}>
                ID: {currentProfile?.matrimonyId || 'MM-TN-1024'} •{' '}
                <Text style={styles.tierHighlightText}>
                  {currentUser?.membershipTier?.toUpperCase() || 'GOLD'} MEMBER
                </Text>
              </Text>
            </View>

            {/* View Mode Toggle Button */}
            <TouchableOpacity
              style={styles.modeSwitchBtn}
              onPress={() => setViewMode(prev => (prev === 'dashboard' ? 'deck' : 'dashboard'))}
              activeOpacity={0.8}
            >
              <CustomIcon
                name={viewMode === 'dashboard' ? 'sparkles' : 'grid'}
                size={16}
                color={Colors.burgundy}
              />
              <Text style={styles.modeSwitchText}>
                {viewMode === 'dashboard' ? 'Swipe' : 'Dashboard'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Profile Completeness Status Progress */}
          <View style={styles.completenessBox}>
            <View style={styles.completenessHeader}>
              <Text style={styles.completenessTitle}>
                {language === 'ta' ? 'சுயவிவரம் 85% முடிந்தது' : 'Profile 85% Complete'}
              </Text>
              <Text style={styles.completenessBoost}>
                {language === 'ta' ? '+3x வரன்கள் பார்க்க' : '+3x More Interest'}
              </Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '85%' }]} />
            </View>

            <View style={styles.verificationPromptRow}>
              <CustomIcon name="shield" size={13} color={Colors.burgundy} />
              <Text style={styles.verificationPromptText}>
                {language === 'ta'
                  ? 'ஆதார் சரிபார்க்கப்பட்டு நம்பகமான வரன் முத்திரை பெற்றுள்ளது'
                  : 'Aadhaar Verified Trust Badge Active on your profile'}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Quick Matrimonial Action Stats Bar */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={onInterestsTabPress}
            activeOpacity={0.8}
          >
            <Text style={styles.statNumber}>{receivedInterestCount || 4}</Text>
            <Text style={styles.statLabel}>
              {language === 'ta' ? 'ஆர்வங்கள்' : 'Interests'}
            </Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statBox}
            onPress={onDailyRecommendationsPress || (() => onSearchPress())}
            activeOpacity={0.8}
          >
            <Text style={styles.statNumber}>9</Text>
            <Text style={styles.statLabel}>
              {language === 'ta' ? 'தினசரி வரன்' : 'Daily Picks'}
            </Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => onSearchPress()}
            activeOpacity={0.8}
          >
            <Text style={styles.statNumber}>{visitors.length || 6}</Text>
            <Text style={styles.statLabel}>
              {language === 'ta' ? 'பார்வையாளர்கள்' : 'Visitors'}
            </Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statBox}
            onPress={onInterestsTabPress}
            activeOpacity={0.8}
          >
            <Text style={styles.statNumber}>{shortlistedIds.length || 3}</Text>
            <Text style={styles.statLabel}>
              {language === 'ta' ? 'விருப்பங்கள்' : 'Shortlisted'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Daily Match Recommendations Featured Card (1/9) */}
        {onDailyRecommendationsPress && (
          <TouchableOpacity
            style={styles.dailyCardBanner}
            onPress={onDailyRecommendationsPress}
            activeOpacity={0.9}
          >
            <View style={styles.dailyCardHeaderRow}>
              <View style={styles.dailyTag}>
                <CustomIcon name="sparkles" size={13} color={Colors.creme} />
                <Text style={styles.dailyTagText}>
                  {language === 'ta' ? 'இன்றைய பரிந்துரைகள் (1/9)' : 'DAILY PICKS (1/9)'}
                </Text>
              </View>

              <View style={styles.dailyCounterPill}>
                <Text style={styles.dailyCounterText}>9 Matches Today</Text>
              </View>
            </View>

            <Text style={styles.dailyHeadline}>
              {language === 'ta'
                ? 'உங்கள் ஜாதகம் & சமூகத்திற்கேற்ப 9 வரன்கள்'
                : "Today's Curated Match Recommendations"}
            </Text>

            <Text style={styles.dailySubtitle}>
              {language === 'ta'
                ? 'நட்சத்திரப் பொருத்தம், கல்வி, ஊர் மற்றும் விருப்பங்கள் அடிப்படையில் தேர்ந்தெடுக்கப்பட்டது.'
                : 'Selected based on your Jathagam star compatibility, caste, education & partner preferences.'}
            </Text>

            {/* Thumbnail Gallery Preview of Today's 9 */}
            <View style={styles.thumbnailsRow}>
              {dailyRecs.slice(0, 4).map((rec, i) => (
                <View key={rec.id} style={styles.thumbWrapper}>
                  <Image source={{ uri: rec.photos[0] }} style={styles.thumbImage} />
                  {rec.isVerified && (
                    <View style={styles.thumbVerifiedBadge}>
                      <CustomIcon name="check" size={8} color="#FFF" />
                    </View>
                  )}
                </View>
              ))}

              <View style={styles.thumbCountPill}>
                <Text style={styles.thumbCountText}>+5 More</Text>
              </View>

              <View style={styles.dailyOpenBtn}>
                <Text style={styles.dailyOpenBtnText}>
                  {language === 'ta' ? 'பார்க்க' : 'View 9'}
                </Text>
                <CustomIcon name="chevron-right" size={14} color={Colors.creme} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* 4. IF View Mode === 'deck': Interactive Swipe Cards */}
        {viewMode === 'deck' && (
          <View style={styles.deckSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                {language === 'ta' ? 'நேரடி பொருத்தங்கள்' : 'Instant Match Discovery'}
              </Text>
              <TouchableOpacity onPress={() => setIsFilterOpen(true)} style={styles.filterChipBtn}>
                <CustomIcon name="filter" size={14} color={Colors.burgundy} />
                <Text style={styles.filterChipText}>Filters</Text>
              </TouchableOpacity>
            </View>

            {activeCandidate ? (
              <View style={styles.deckWrapper}>
                {nextCandidate && (
                  <View style={styles.backCardContainer} pointerEvents="none">
                    <Image source={{ uri: nextCandidate.photos[0] }} style={styles.deckCardImage} />
                    <View style={styles.cardScrim} />
                  </View>
                )}

                <Animated.View
                  style={[styles.activeCardContainer, animatedCardStyle]}
                  {...panResponder.panHandlers}
                >
                  <Image source={{ uri: activeCandidate.photos[0] }} style={styles.deckCardImage} />
                  <View style={styles.cardScrim} />

                  {/* Overlays */}
                  <Animated.View
                    style={[styles.likeOverlayContainer, { opacity: likeOverlayOpacity }]}
                    pointerEvents="none"
                  >
                    <CustomIcon name="heart-filled" size={46} color="#FFFFFF" />
                    <Text style={styles.overlayText}>INTEREST</Text>
                  </Animated.View>

                  <Animated.View
                    style={[styles.passOverlayContainer, { opacity: passOverlayOpacity }]}
                    pointerEvents="none"
                  >
                    <CustomIcon name="close" size={42} color="#FFFFFF" />
                    <Text style={styles.overlayText}>PASS</Text>
                  </Animated.View>

                  {/* Card Bottom Details */}
                  <View style={styles.deckBottomOverlay}>
                    <TouchableOpacity
                      onPress={() => onProfilePress(activeCandidate)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.deckCandidateNameRow}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.deckCandidateName}>
                          {activeCandidate.name}, {activeCandidate.age}
                        </Text>
                        {activeCandidate.isVerified && (
                          <CustomIcon name="shield" size={14} color={Colors.verifiedBlue} />
                        )}
                      </View>
                      <Text style={styles.deckCandidateSub}>
                        {activeCandidate.educationCareer.occupation} • {activeCandidate.caste} •{' '}
                        {activeCandidate.currentCity}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>

                {/* Swipe Action Buttons */}
                <View style={styles.swipeButtonsRow}>
                  <TouchableOpacity
                    style={styles.swipePassBtn}
                    onPress={() => forceSwipe('left')}
                    activeOpacity={0.8}
                  >
                    <CustomIcon name="close" size={22} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.swipeLikeBtn}
                    onPress={() => forceSwipe('right')}
                    activeOpacity={0.8}
                  >
                    <CustomIcon name="heart-filled" size={26} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyDeckBox}>
                <Text style={styles.emptyDeckText}>All caught up for now!</Text>
                <TouchableOpacity onPress={() => setCurrentIndex(0)} style={styles.resetDeckBtn}>
                  <Text style={styles.resetDeckBtnText}>Reload Profiles</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* 5. Recommended Matches Carousel (Grid / Horizontal) */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                {language === 'ta' ? 'உங்களுக்கான பொருத்தங்கள்' : 'Recommended Matches'}
              </Text>
              <Text style={styles.sectionSub}>
                {language === 'ta'
                  ? 'உங்கள் துணை எதிர்பார்ப்புகளுடன் பொருந்துபவை'
                  : 'Profiles matching your partner expectations'}
              </Text>
            </View>

            <TouchableOpacity onPress={() => onSearchPress()} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>
                {language === 'ta' ? 'அனைத்தும் →' : 'View All →'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalProfilesScroll}
          >
            {candidateProfiles.slice(0, 5).map(profile => {
              const isShort = shortlistedIds.includes(profile.id);
              const isSent = sentInterestIds.includes(profile.id);

              let poruthamScore = '8/10';
              if (currentProfile) {
                const b = currentProfile.gender === 'bride' ? currentProfile : profile;
                const g = currentProfile.gender === 'groom' ? currentProfile : profile;
                const pRes = calculateTenPoruthams(
                  b.horoscope.rasi,
                  b.horoscope.nakshatram,
                  g.horoscope.rasi,
                  g.horoscope.nakshatram
                );
                poruthamScore = `${pRes.totalScore}/10 Porutham`;
              }

              return (
                <TouchableOpacity
                  key={profile.id}
                  style={styles.matchCompactCard}
                  onPress={() => onProfilePress(profile)}
                  activeOpacity={0.9}
                >
                  <View style={styles.compactImageWrap}>
                    <Image source={{ uri: profile.photos[0] }} style={styles.compactImage} />
                    <TouchableOpacity
                      style={[styles.compactHeartBtn, isShort && styles.compactHeartBtnActive]}
                      onPress={() => handleToggleShortlist(profile.id)}
                    >
                      <CustomIcon
                        name={isShort ? 'heart-filled' : 'heart'}
                        size={14}
                        color={isShort ? Colors.burgundy : '#FFF'}
                      />
                    </TouchableOpacity>

                    <View style={styles.poruthamBadgeSmall}>
                      <CustomIcon name="sparkles" size={10} color={Colors.burgundy} />
                      <Text style={styles.poruthamBadgeSmallText}>{poruthamScore}</Text>
                    </View>
                  </View>

                  <View style={styles.compactCardBody}>
                    <Text style={styles.compactName} numberOfLines={1}>
                      {profile.name}, {profile.age}
                    </Text>
                    <Text style={styles.compactCaste} numberOfLines={1}>
                      {profile.caste} • {profile.currentCity}
                    </Text>
                    <Text style={styles.compactEdu} numberOfLines={1}>
                      {profile.educationCareer.occupation}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.compactInterestBtn,
                        isSent && styles.compactInterestBtnSent,
                      ]}
                      onPress={() => handleSendInterest(profile.id)}
                      disabled={isSent}
                      activeOpacity={0.8}
                    >
                      <CustomIcon
                        name={isSent ? 'check' : 'heart'}
                        size={12}
                        color={isSent ? Colors.success : Colors.creme}
                      />
                      <Text
                        style={[
                          styles.compactInterestText,
                          isSent && styles.compactInterestTextSent,
                        ]}
                      >
                        {isSent ? 'Sent' : 'Interest'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 6. Membership Banner */}
        <View style={styles.membershipBanner}>
          <View style={styles.membershipLeft}>
            <View style={styles.crownCircle}>
              <CustomIcon name="crown" size={18} color={Colors.creme} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.membershipTitle}>
                {language === 'ta' ? 'மணமாலை கோல்ட் சந்தா' : 'Upgrade to Gold Membership'}
              </Text>
              <Text style={styles.membershipSub}>
                {language === 'ta'
                  ? 'வரன்களின் தொலைபேசி எண், நேரடி வாட்ஸ்அப் மற்றும் ஜாதகப் பொருத்தம் பெறுக.'
                  : 'Unlock verified contact numbers, WhatsApp chat & 10-Porutham report.'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.membershipUpgradeBtn}
            onPress={onMembershipPress}
            activeOpacity={0.85}
          >
            <Text style={styles.membershipUpgradeBtnText}>
              {language === 'ta' ? 'திட்டம் காண்க' : 'View Plans'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 7. Recently Joined Profiles Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                {language === 'ta' ? 'புதிதாக இணைந்த வரன்கள்' : 'Recently Joined Profiles'}
              </Text>
              <Text style={styles.sectionSub}>
                {language === 'ta'
                  ? 'கடந்த 48 மணி நேரத்தில் பதிவு செய்த மணமக்கள்'
                  : 'New verified members registered in the past 48 hours'}
              </Text>
            </View>

            <TouchableOpacity onPress={() => onSearchPress('newest')} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>
                {language === 'ta' ? 'அனைத்தும் →' : 'View All →'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalProfilesScroll}
          >
            {recentlyJoined.map(profile => (
              <TouchableOpacity
                key={profile.id}
                style={styles.recentMiniCard}
                onPress={() => onProfilePress(profile)}
                activeOpacity={0.88}
              >
                <View style={styles.recentImageWrap}>
                  <Image source={{ uri: profile.photos[0] }} style={styles.recentImage} />
                  <View style={styles.newBadgePill}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>

                <View style={styles.recentBody}>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {profile.name}, {profile.age}
                  </Text>
                  <Text style={styles.recentMeta} numberOfLines={1}>
                    {profile.caste}
                  </Text>
                  <Text style={styles.recentLocation} numberOfLines={1}>
                    {profile.currentCity}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 8. Who Viewed My Profile (Profile Visitors) */}
        {visitors.length > 0 && (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  {language === 'ta' ? 'சுயவிவர பார்வையாளர்கள்' : 'Who Viewed My Profile'}
                </Text>
                <Text style={styles.sectionSub}>
                  {language === 'ta'
                    ? 'உங்கள் சுயவிவரத்தை சமீபத்தில் பார்த்த வரன்கள்'
                    : 'Profiles who showed interest and visited your profile'}
                </Text>
              </View>
            </View>

            <View style={styles.visitorsCardList}>
              {visitors.map(visitor => {
                const isSent = sentInterestIds.includes(visitor.id);
                return (
                  <View key={visitor.id} style={styles.visitorRow}>
                    <TouchableOpacity
                      onPress={() => onProfilePress(visitor)}
                      style={styles.visitorLeft}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: visitor.photos[0] }} style={styles.visitorAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.visitorName} numberOfLines={1}>
                          {visitor.name}, {visitor.age}
                        </Text>
                        <Text style={styles.visitorDetails} numberOfLines={1}>
                          {visitor.educationCareer.occupation} • {visitor.caste}
                        </Text>
                        <Text style={styles.visitorTime}>Viewed 2 hours ago</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.visitorActionBtn, isSent && styles.visitorActionBtnSent]}
                      onPress={() => handleSendInterest(visitor.id)}
                      disabled={isSent}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.visitorActionBtnText,
                          isSent && styles.visitorActionBtnTextSent,
                        ]}
                      >
                        {isSent ? 'Sent' : 'Send Interest'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Bottom Padding for floating nav bar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Match Celebration Modal */}
      <MatchModal
        visible={showMatchModal}
        matchProfile={matchedProfile}
        currentUserPhoto={
          currentProfile?.photos?.[0] ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
        }
        onClose={() => setShowMatchModal(false)}
        onStartChat={profile => {
          setShowMatchModal(false);
          if (onChatPress) {
            onChatPress(profile);
          } else {
            onInterestsTabPress();
          }
        }}
      />

      {/* Filter Sheet Modal */}
      <FilterModal
        visible={isFilterOpen}
        filters={filterState}
        language={language}
        onClose={() => setIsFilterOpen(false)}
        onApply={f => {
          setFilterState(f);
          setIsFilterOpen(false);
          setCurrentIndex(0);
        }}
        onReset={() => {
          setFilterState({
            ageMin: 21,
            ageMax: 36,
            heightMinCm: 145,
            heightMaxCm: 200,
            caste: [],
            district: [],
            education: [],
            verifiedOnly: false,
            withPhotoOnly: false,
            horoscopePoruthamOnly: false,
            searchQuery: '',
            sortBy: 'relevance',
          });
          setIsFilterOpen(false);
          setCurrentIndex(0);
        }}
        totalMatchesCount={deckProfiles.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // 1. Greeting Card
  greetingCard: {
    backgroundColor: Colors.cardBg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.subtle,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  greetingAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.burgundy,
  },
  greetingInfo: {
    flex: 1,
  },
  vanakkamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingText: {
    fontSize: Typography.bodyLarge,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: Typography.titleMedium,
    color: Colors.burgundy,
    fontWeight: '800',
    fontFamily: Typography.fontSerif,
  },
  miniVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.verifiedBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 2,
  },
  miniVerifiedText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.verifiedBlue,
  },
  profileIdText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tierHighlightText: {
    fontWeight: '800',
    color: Colors.burgundy,
  },
  modeSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
    borderWidth: 0.8,
    borderColor: Colors.sand,
  },
  modeSwitchText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  completenessBox: {
    marginTop: Spacing.md,
    backgroundColor: Colors.sandLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completenessTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  completenessBoost: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Colors.sand,
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.burgundy,
    borderRadius: 3,
  },
  verificationPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 5,
  },
  verificationPromptText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.textSecondary,
    flex: 1,
  },
  // 2. Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Shadows.subtle,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.burgundy,
    fontFamily: Typography.fontSerif,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.sand,
  },
  // 3. Daily Card Banner
  dailyCardBanner: {
    backgroundColor: Colors.burgundy,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.editorial,
  },
  dailyCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  dailyTagText: {
    color: Colors.creme,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dailyCounterPill: {
    backgroundColor: Colors.sand,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
  },
  dailyCounterText: {
    color: Colors.burgundy,
    fontSize: 9.5,
    fontWeight: '800',
  },
  dailyHeadline: {
    fontSize: 16.5,
    fontWeight: '700',
    color: Colors.creme,
    fontFamily: Typography.fontSerif,
    marginTop: 10,
  },
  dailySubtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.sandLight,
    marginTop: 4,
    lineHeight: 18,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  thumbWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.creme,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbVerifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.verifiedBlue,
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbCountPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  thumbCountText: {
    color: Colors.creme,
    fontSize: 10,
    fontWeight: '700',
  },
  dailyOpenBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  dailyOpenBtnText: {
    color: Colors.creme,
    fontSize: 12,
    fontWeight: '700',
  },
  // Section Headers
  sectionWrap: {
    marginTop: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.burgundy,
    fontFamily: Typography.fontSerif,
  },
  sectionSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  horizontalProfilesScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  // Compact Cards
  matchCompactCard: {
    width: 170,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  compactImageWrap: {
    width: '100%',
    height: 155,
    backgroundColor: Colors.sandLight,
    position: 'relative',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactHeartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactHeartBtnActive: {
    backgroundColor: Colors.sandLight,
  },
  poruthamBadgeSmall: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(238, 228, 218, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  poruthamBadgeSmallText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  compactCardBody: {
    padding: 10,
  },
  compactName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.burgundy,
    fontFamily: Typography.fontSerif,
  },
  compactCaste: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  compactEdu: {
    fontSize: 10.5,
    color: Colors.textMuted,
    marginTop: 1,
  },
  compactInterestBtn: {
    backgroundColor: Colors.burgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    marginTop: 8,
    gap: 4,
  },
  compactInterestBtnSent: {
    backgroundColor: Colors.successLight,
    borderWidth: 0.8,
    borderColor: Colors.success,
  },
  compactInterestText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.creme,
  },
  compactInterestTextSent: {
    color: Colors.success,
  },
  // Membership Banner
  membershipBanner: {
    backgroundColor: Colors.sandLight,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  membershipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  crownCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  membershipTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  membershipSub: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  membershipUpgradeBtn: {
    backgroundColor: Colors.burgundy,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  membershipUpgradeBtnText: {
    color: Colors.creme,
    fontSize: 11,
    fontWeight: '800',
  },
  // Recently Joined
  recentMiniCard: {
    width: 105,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  recentImageWrap: {
    width: '100%',
    height: 105,
    position: 'relative',
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  newBadgePill: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: Colors.burgundy,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  newBadgeText: {
    color: Colors.creme,
    fontSize: 8,
    fontWeight: '800',
  },
  recentBody: {
    padding: 6,
  },
  recentName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  recentMeta: {
    fontSize: 9.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  recentLocation: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 1,
  },
  // Visitors
  visitorsCardList: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    paddingHorizontal: Spacing.md,
    ...Shadows.subtle,
  },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.sandLight,
  },
  visitorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  visitorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  visitorName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  visitorDetails: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  visitorTime: {
    fontSize: 9.5,
    color: Colors.textMuted,
    marginTop: 2,
  },
  visitorActionBtn: {
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.burgundy,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  visitorActionBtnSent: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  visitorActionBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  visitorActionBtnTextSent: {
    color: Colors.success,
  },
  // Deck View
  deckSection: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  filterChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
    borderWidth: 0.8,
    borderColor: Colors.sand,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  deckWrapper: {
    height: 380,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  backCardContainer: {
    position: 'absolute',
    width: '92%',
    height: 320,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    top: 14,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  activeCardContainer: {
    position: 'absolute',
    width: '100%',
    height: 320,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.editorial,
  },
  deckCardImage: {
    width: '100%',
    height: '100%',
  },
  cardScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: 'rgba(54, 10, 14, 0.72)',
  },
  deckBottomOverlay: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
  },
  deckCandidateNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.onlineGreen,
  },
  deckCandidateName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.creme,
    fontFamily: Typography.fontSerif,
  },
  deckCandidateSub: {
    fontSize: 12,
    color: Colors.sandLight,
    marginTop: 3,
  },
  likeOverlayContainer: {
    position: 'absolute',
    top: 40,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(27, 135, 63, 0.75)',
    borderRadius: 12,
  },
  passOverlayContainer: {
    position: 'absolute',
    top: 40,
    left: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(54, 10, 14, 0.75)',
    borderRadius: 12,
  },
  overlayText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  swipeButtonsRow: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  swipePassBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.editorial,
  },
  swipeLikeBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.editorial,
  },
  emptyDeckBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  emptyDeckText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  resetDeckBtn: {
    marginTop: 12,
    backgroundColor: Colors.burgundy,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  resetDeckBtnText: {
    color: Colors.creme,
    fontSize: 12,
    fontWeight: '700',
  },
});
