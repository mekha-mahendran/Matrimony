import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../components/CustomIcon';
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { CurrentUser, MatrimonyProfile } from '../types';

const { width, height } = Dimensions.get('window');

interface DailyRecommendationsScreenProps {
  language: Language;
  onBack: () => void;
  onProfilePress?: (profile: MatrimonyProfile) => void;
  onUpgradeMembership?: () => void;
  onChatPress?: (profile: MatrimonyProfile) => void;
}

export const DailyRecommendationsScreen: React.FC<DailyRecommendationsScreenProps> = ({
  language,
  onBack,
  onProfilePress,
  onUpgradeMembership,
  onChatPress,
}) => {
  const insets = useSafeAreaInsets();
  const t = Translations[language];
  const scrollRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<MatrimonyProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<MatrimonyProfile | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [sentInterestIds, setSentInterestIds] = useState<string[]>([]);
  const [isContactAuthorized, setIsContactAuthorized] = useState(false);
  const [targetGender, setTargetGender] = useState<'bride' | 'groom' | undefined>(undefined);

  // Modals & Feedback
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'heart'>('info');

  // Animation values
  const cardAnim = useRef(new Animated.Value(0)).current; // 0 = centered, -1 = left out, 1 = right in
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  const currentCandidate = recommendations[currentIndex] || null;

  const showToast = (message: string, type: 'success' | 'info' | 'heart' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const loadRecommendations = async (genderOverride?: 'bride' | 'groom') => {
    setLoading(true);
    try {
      const user = await StorageService.getCurrentUser();
      setCurrentUser(user);

      const profile = await StorageService.getProfileById(user.activeProfileId);
      setCurrentProfile(profile);

      const sl = await StorageService.getShortlists();
      setShortlistedIds(sl);

      const interests = await StorageService.getInterests();
      const sent = interests
        .filter(i => i.senderProfileId === user.activeProfileId)
        .map(i => i.receiverProfileId);
      setSentInterestIds(sent);

      const effectiveGender = genderOverride || targetGender;
      const recs = await StorageService.getDailyRecommendations(9, effectiveGender);
      setRecommendations(recs);
      setCurrentIndex(0);
      setActivePhotoIndex(0);

      if (recs.length > 0) {
        checkContactAuth(recs[0]);
      }
    } catch (e) {
      console.warn('loadRecommendations error:', e);
    } finally {
      setLoading(false);
    }
  };

  const checkContactAuth = async (candidate: MatrimonyProfile) => {
    const authorized = await StorageService.isContactAuthorized(candidate);
    setIsContactAuthorized(authorized);
  };

  useEffect(() => {
    loadRecommendations();
  }, [targetGender]);

  useEffect(() => {
    if (currentCandidate) {
      checkContactAuth(currentCandidate);
      setActivePhotoIndex(0);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
    }
  }, [currentIndex, currentCandidate]);

  // Transition to next profile
  const animateToNext = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: -1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
      cardAnim.setValue(1);
      Animated.parallel([
        Animated.spring(cardAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // 1. Action: Shortlist
  const handleToggleShortlist = async () => {
    if (!currentCandidate) return;
    const isNowShortlisted = await StorageService.toggleShortlist(currentCandidate.id);
    setShortlistedIds(prev =>
      isNowShortlisted ? [currentCandidate.id, ...prev] : prev.filter(id => id !== currentCandidate.id)
    );
    showToast(
      isNowShortlisted
        ? `${currentCandidate.name} saved to Shortlist ⭐`
        : `Removed from Shortlist`,
      'success'
    );
  };

  // 2. Action: Don't Show
  const handleDontShow = async () => {
    if (!currentCandidate) return;
    const name = currentCandidate.name.split(' ')[0];
    await StorageService.addDontShowProfile(currentCandidate.id);
    showToast(`Profile excluded from future recommendations`, 'info');
    animateToNext(() => {
      setCurrentIndex(prev => prev + 1);
    });
  };

  // 3. Action: Skip
  const handleSkip = () => {
    if (!currentCandidate) return;
    showToast(`Skipped to next recommendation`, 'info');
    animateToNext(() => {
      setCurrentIndex(prev => prev + 1);
    });
  };

  // 4. Action: Send Interest
  const handleSendInterest = async () => {
    if (!currentCandidate) return;
    const senderId = currentProfile ? currentProfile.id : 'mm-g-01';

    // Play heart burst animation
    heartScale.setValue(0);
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.4,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await StorageService.sendInterest(senderId, currentCandidate.id);
      setSentInterestIds(prev => [...prev, currentCandidate.id]);
      showToast(`Interest Sent to ${currentCandidate.name}! 💕`, 'heart');

      setTimeout(() => {
        animateToNext(() => {
          setCurrentIndex(prev => prev + 1);
        });
      }, 700);
    } catch (e) {
      showToast('Could not send interest. Please try again.', 'info');
    }
  };

  // Photo Navigation
  const handleNextPhoto = () => {
    if (!currentCandidate?.photos?.length) return;
    if (activePhotoIndex < currentCandidate.photos.length - 1) {
      setActivePhotoIndex(prev => prev + 1);
    } else {
      setActivePhotoIndex(0);
    }
  };

  const handlePrevPhoto = () => {
    if (!currentCandidate?.photos?.length) return;
    if (activePhotoIndex > 0) {
      setActivePhotoIndex(prev => prev - 1);
    } else {
      setActivePhotoIndex(currentCandidate.photos.length - 1);
    }
  };

  // Call & WhatsApp Contact Access
  const handleCallPress = async () => {
    if (!currentCandidate) return;
    if (isContactAuthorized) {
      const cleanPhone = currentCandidate.phone.replace(/[^0-9+]/g, '');
      Linking.openURL(`tel:${cleanPhone}`);
    } else {
      setShowContactModal(true);
    }
  };

  const handleWhatsAppPress = async () => {
    if (!currentCandidate) return;
    if (isContactAuthorized) {
      let cleanPhone = currentCandidate.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
      const msg = encodeURIComponent(
        `Vanakkam, I came across your profile (${currentCandidate.matrimonyId}) on Manamaalai Matrimony and would like to connect with your family.`
      );
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${msg}`);
    } else {
      setShowContactModal(true);
    }
  };

  const handleUnlockContact = async () => {
    if (!currentCandidate) return;
    const res = await StorageService.unlockContactAccess(currentCandidate.id);
    if (res.success) {
      setIsContactAuthorized(true);
      setShowContactModal(false);
      showToast('Contact authorized! You can now call or message directly.', 'success');
      const u = await StorageService.getCurrentUser();
      setCurrentUser(u);
    } else {
      setShowContactModal(false);
      Alert.alert(
        'Upgrade Membership',
        res.message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View Plans',
            onPress: () => {
              if (onUpgradeMembership) onUpgradeMembership();
            },
          },
        ]
      );
    }
  };

  const handleScrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 320, animated: true });
    }
  };

  // Helper strings matching reference layout
  const formatCreatedFor = (createdFor?: string) => {
    switch (createdFor) {
      case 'self':
        return 'Profile created by self';
      case 'son':
        return 'Profile created for son';
      case 'daughter':
        return 'Profile created for daughter';
      case 'brother':
        return 'Profile created for brother';
      case 'sister':
        return 'Profile created for sister';
      default:
        return 'Profile created by self';
    }
  };

  const formatMaritalStatus = (status?: string) => {
    switch (status) {
      case 'never_married':
        return 'Never married';
      case 'divorced':
        return 'Divorced';
      case 'widowed':
        return 'Widowed';
      case 'separated':
        return 'Separated';
      default:
        return 'Never married';
    }
  };

  const formatCaste = (candidate: MatrimonyProfile) => {
    const caste = candidate.caste || 'Tamil Community';
    const sub = candidate.subCaste ? ` (${candidate.subCaste})` : '';
    const intercaste = candidate.allowIntercaste ? ' (Caste No Bar)' : '';
    return `${caste}${candidate.allowIntercaste && !sub.includes('No Bar') ? intercaste : sub}`;
  };

  const isShortlisted = currentCandidate ? shortlistedIds.includes(currentCandidate.id) : false;
  const isInterestSent = currentCandidate ? sentInterestIds.includes(currentCandidate.id) : false;

  const cardTranslateX = cardAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width * 0.9, 0, width * 0.9],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* 1. Header Bar matching reference */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <CustomIcon name="arrow-left" size={22} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitleText}>
            Daily Recommendation{' '}
            <Text style={styles.headerCounterText}>
              ({recommendations.length > 0 ? `${Math.min(currentIndex + 1, recommendations.length)}/${recommendations.length}` : '0/0'})
            </Text>
          </Text>
        </View>

        {/* Gender View Switcher */}
        <TouchableOpacity
          style={styles.genderToggleChip}
          onPress={() => {
            const nextGender = targetGender === 'groom' ? 'bride' : 'groom';
            setTargetGender(nextGender);
            showToast(`Browsing ${nextGender === 'groom' ? 'Groom' : 'Bride'} recommendations`, 'info');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.genderToggleText}>
            {targetGender === 'groom' ? '👨 Grooms' : '👰 Brides'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <View style={styles.toastBadge}>
            <CustomIcon
              name={toastType === 'heart' ? 'heart-filled' : toastType === 'success' ? 'check' : 'info'}
              size={16}
              color={toastType === 'heart' ? '#E63946' : Colors.manamaalaiBurgundy}
            />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      )}

      {/* Central Heart Burst Overlay on Send Interest */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.heartBurstOverlay,
          {
            transform: [{ scale: heartScale }],
            opacity: heartScale.interpolate({
              inputRange: [0, 1, 1.4],
              outputRange: [0, 1, 0.9],
            }),
          },
        ]}
      >
        <CustomIcon name="heart-filled" size={100} color="#D95A1E" />
      </Animated.View>

      {/* Main Content Area */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.manamaalaiBurgundy} />
          <Text style={styles.loadingText}>Fetching daily matches tailored to your horoscope & preferences...</Text>
        </View>
      ) : currentCandidate ? (
        <Animated.View
          style={[
            styles.animatedCardWrapper,
            {
              transform: [{ translateX: cardTranslateX }],
              opacity: cardOpacity,
            },
          ]}
        >
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* White Premium Profile Card */}
            <View style={styles.profileCard}>
              {/* Profile Photo Gallery */}
              <View style={styles.photoContainer}>
                <Image
                  source={{
                    uri:
                      currentCandidate.photos?.[activePhotoIndex] ||
                      currentCandidate.photos?.[0] ||
                      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
                  }}
                  style={styles.profilePhoto}
                  resizeMode="cover"
                />

                {/* Overlaid Shortlist Button (Top-Right Pill) */}
                <TouchableOpacity
                  style={[
                    styles.shortlistOverlayBtn,
                    isShortlisted && styles.shortlistOverlayBtnActive,
                  ]}
                  onPress={handleToggleShortlist}
                  activeOpacity={0.8}
                >
                  <CustomIcon
                    name={isShortlisted ? 'bookmark-filled' : 'bookmark'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.shortlistBtnText}>
                    {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                  </Text>
                </TouchableOpacity>

                {/* Photo Pagination Arrows */}
                {currentCandidate.photos && currentCandidate.photos.length > 1 && (
                  <>
                    {activePhotoIndex > 0 && (
                      <TouchableOpacity
                        style={[styles.photoNavArrow, styles.photoNavLeft]}
                        onPress={handlePrevPhoto}
                        activeOpacity={0.8}
                      >
                        <CustomIcon name="chevron-left" size={20} color="#1A1A1A" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.photoNavArrow, styles.photoNavRight]}
                      onPress={handleNextPhoto}
                      activeOpacity={0.8}
                    >
                      <CustomIcon name="chevron-right" size={20} color="#1A1A1A" />
                    </TouchableOpacity>

                    {/* Pagination Dots */}
                    <View style={styles.photoDotsRow}>
                      {currentCandidate.photos.map((_, pIdx) => (
                        <View
                          key={pIdx}
                          style={[
                            styles.photoDot,
                            pIdx === activePhotoIndex && styles.photoDotActive,
                          ]}
                        />
                      ))}
                    </View>
                  </>
                )}

                {/* Photo Count Tag */}
                <View style={styles.photoCountBadge}>
                  <Text style={styles.photoCountText}>
                    {activePhotoIndex + 1}/{currentCandidate.photos?.length || 1}
                  </Text>
                </View>
              </View>

              {/* Card Details Section */}
              <View style={styles.cardDetails}>
                {/* Verified Ribbon & Contact Icons Row */}
                <View style={styles.badgeAndActionsRow}>
                  {/* Verified Badge (Styled to match reference screenshot) */}
                  {currentCandidate.isVerified ? (
                    <TouchableOpacity
                      style={styles.verifiedRibbon}
                      onPress={() => setShowVerifiedModal(true)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.verifiedCheckCircle}>
                        <Text style={styles.verifiedCheckIcon}>✓</Text>
                      </View>
                      <Text style={styles.verifiedText}>Verified</Text>
                      <View style={styles.verifiedInfoCircle}>
                        <Text style={styles.verifiedInfoIcon}>i</Text>
                      </View>
                      <View style={styles.ribbonTail} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.standardMemberBadge}>
                      <Text style={styles.standardMemberText}>Profile Complete</Text>
                    </View>
                  )}

                  {/* Call & WhatsApp Icons (Authorized or Unlock Modal) */}
                  <View style={styles.contactIconsRow}>
                    {/* Call Button */}
                    <TouchableOpacity
                      style={styles.callCircleBtn}
                      onPress={handleCallPress}
                      activeOpacity={0.8}
                    >
                      <CustomIcon name="phone-call" size={20} color="#E66A1F" />
                    </TouchableOpacity>

                    {/* WhatsApp Button */}
                    <TouchableOpacity
                      style={styles.whatsappCircleBtn}
                      onPress={handleWhatsAppPress}
                      activeOpacity={0.8}
                    >
                      <CustomIcon name="whatsapp" size={20} color="#25D366" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Name */}
                <Text style={styles.candidateName}>{currentCandidate.name}</Text>

                {/* ID & Last seen status */}
                <Text style={styles.candidateIdRow}>
                  {currentCandidate.matrimonyId}
                  <Text style={styles.bulletSeparator}> • </Text>
                  {currentCandidate.lastActive || 'Last seen yesterday'}
                </Text>

                {/* Bullet-separated Overview Details */}
                <Text style={styles.bulletDetailsText}>
                  {formatMaritalStatus(currentCandidate.maritalStatus)}
                  <Text style={styles.bulletSeparator}> • </Text>
                  {formatCreatedFor(currentCandidate.createdFor)}
                  <Text style={styles.bulletSeparator}> • </Text>
                  {currentCandidate.age} yrs
                  <Text style={styles.bulletSeparator}> • </Text>
                  {currentCandidate.lifestyle?.heightFeet || "5' 8\""}
                  <Text style={styles.bulletSeparator}> • </Text>
                  {formatCaste(currentCandidate)}
                  <Text style={styles.bulletSeparator}> • </Text>
                  {currentCandidate.educationCareer?.qualification}
                  {currentCandidate.educationCareer?.occupation ? ` - ${currentCandidate.educationCareer.occupation}` : ''}
                  <Text style={styles.bulletSeparator}> • </Text>
                  {currentCandidate.educationCareer?.annualIncome || 'Income disclosed upon interest'}
                  <Text style={styles.bulletSeparator}> • </Text>
                  {currentCandidate.currentCity || currentCandidate.nativeDistrict}
                </Text>

                {/* Floating "Scroll v" Helper Badge on bottom right of top section */}
                <TouchableOpacity
                  style={styles.scrollHelperBadge}
                  onPress={handleScrollDown}
                  activeOpacity={0.8}
                >
                  <CustomIcon name="chevron-down" size={14} color="#333333" />
                  <Text style={styles.scrollHelperText}>Scroll</Text>
                </TouchableOpacity>

                {/* Divider Line */}
                <View style={styles.sectionDivider} />

                {/* Expanded Details: Horoscope Porutham Match Summary */}
                <View style={styles.expandedSection}>
                  <View style={styles.sectionTitleRow}>
                    <CustomIcon name="sparkles" size={16} color={Colors.manamaalaiBurgundy} />
                    <Text style={styles.sectionTitleText}>Horoscope & Astro Profile</Text>
                    <View style={styles.poruthamScorePill}>
                      <Text style={styles.poruthamScorePillText}>8/10 Poruthams</Text>
                    </View>
                  </View>

                  <View style={styles.infoGrid}>
                    <View style={styles.infoGridItem}>
                      <Text style={styles.gridLabel}>Rasi (இராசி)</Text>
                      <Text style={styles.gridValue}>{currentCandidate.horoscope?.rasi || 'Rishabam'}</Text>
                    </View>
                    <View style={styles.infoGridItem}>
                      <Text style={styles.gridLabel}>Nakshatram (நட்சத்திரம்)</Text>
                      <Text style={styles.gridValue}>{currentCandidate.horoscope?.nakshatram || 'Rohini'}</Text>
                    </View>
                    <View style={styles.infoGridItem}>
                      <Text style={styles.gridLabel}>Chevva Dosham</Text>
                      <Text style={styles.gridValue}>
                        {currentCandidate.horoscope?.chevvaiDosham ? 'Yes' : 'No Dosham (சுத்த ஜாதகம்)'}
                      </Text>
                    </View>
                    <View style={styles.infoGridItem}>
                      <Text style={styles.gridLabel}>Gothram</Text>
                      <Text style={styles.gridValue}>{currentCandidate.horoscope?.gothram || 'Shiva Gothram'}</Text>
                    </View>
                  </View>
                </View>

                {/* Expanded Details: Family Background */}
                <View style={styles.expandedSection}>
                  <View style={styles.sectionTitleRow}>
                    <CustomIcon name="user" size={16} color={Colors.manamaalaiBurgundy} />
                    <Text style={styles.sectionTitleText}>Family Background</Text>
                  </View>

                  <View style={styles.familyInfoList}>
                    <Text style={styles.familyText}>
                      <Text style={styles.boldLabel}>Father: </Text>
                      {currentCandidate.family?.fatherOccupation || 'Retired Officer'}
                    </Text>
                    <Text style={styles.familyText}>
                      <Text style={styles.boldLabel}>Mother: </Text>
                      {currentCandidate.family?.motherOccupation || 'Homemaker'}
                    </Text>
                    <Text style={styles.familyText}>
                      <Text style={styles.boldLabel}>Siblings: </Text>
                      {currentCandidate.family?.siblings || '1 Sibling'}
                      {currentCandidate.family?.siblingsMarried ? ` (${currentCandidate.family.siblingsMarried})` : ''}
                    </Text>
                    <Text style={styles.familyText}>
                      <Text style={styles.boldLabel}>Family Values: </Text>
                      {currentCandidate.family?.familyValues ? `${currentCandidate.family.familyValues} & ${currentCandidate.family.familyType} family` : 'Traditional Nuclear Family'}
                    </Text>
                  </View>
                </View>

                {/* About Me */}
                {currentCandidate.about && (
                  <View style={styles.expandedSection}>
                    <View style={styles.sectionTitleRow}>
                      <CustomIcon name="chat-bubble" size={16} color={Colors.manamaalaiBurgundy} />
                      <Text style={styles.sectionTitleText}>About {currentCandidate.name.split(' ')[0]}</Text>
                    </View>
                    <Text style={styles.aboutText}>{currentCandidate.about}</Text>
                  </View>
                )}

                {/* Full Profile CTA Button */}
                {onProfilePress && (
                  <TouchableOpacity
                    style={styles.viewFullProfileBtn}
                    onPress={() => onProfilePress(currentCandidate)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewFullProfileBtnText}>View Full Horoscope & Bio →</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Spacer for bottom action bar */}
            <View style={{ height: 180 }} />
          </ScrollView>

          {/* 3. Bottom Action Area (Exact styling from reference) */}
          <View style={[styles.bottomActionContainer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            {/* Row 1: Don't Show & Skip */}
            <View style={styles.secondaryActionsRow}>
              {/* Don't Show Button */}
              <TouchableOpacity
                style={styles.dontShowBtn}
                onPress={handleDontShow}
                activeOpacity={0.75}
              >
                <CustomIcon name="close" size={16} color="#757575" />
                <Text style={styles.dontShowBtnText}>Don't Show</Text>
              </TouchableOpacity>

              {/* Skip Button */}
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={handleSkip}
                activeOpacity={0.75}
              >
                <CustomIcon name="skip-forward" size={16} color="#D95A1E" />
                <Text style={styles.skipBtnText}>Skip</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: Send Interest Prominent Button */}
            <TouchableOpacity
              style={[
                styles.sendInterestBtn,
                isInterestSent && styles.sendInterestBtnSent,
              ]}
              onPress={handleSendInterest}
              activeOpacity={0.85}
              disabled={isInterestSent}
            >
              <CustomIcon
                name={isInterestSent ? 'check' : 'heart'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.sendInterestBtnText}>
                {isInterestSent ? 'Interest Sent' : 'Send Interest'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        /* Empty / All Caught Up State */
        <View style={styles.allCaughtUpContainer}>
          <View style={styles.allCaughtUpIconWrap}>
            <CustomIcon name="sparkles" size={44} color="#D95A1E" />
          </View>
          <Text style={styles.allCaughtUpTitle}>You're All Caught Up!</Text>
          <Text style={styles.allCaughtUpDesc}>
            You have reviewed all daily recommended matches for today. New astrological and preference-matched profiles refresh daily at 6:00 AM.
          </Text>

          <TouchableOpacity
            style={styles.reloadDailyBtn}
            onPress={async () => {
              await StorageService.resetDontShowProfiles();
              loadRecommendations();
              showToast('Refreshed daily recommendations', 'success');
            }}
            activeOpacity={0.8}
          >
            <CustomIcon name="sparkles" size={18} color="#FFFFFF" />
            <Text style={styles.reloadDailyBtnText}>Review Today's Matches Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backHomeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Verified Profile Info Modal */}
      <Modal
        visible={showVerifiedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVerifiedModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.verifiedModalIconWrap}>
              <Text style={styles.verifiedModalCheck}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Manamaalai Verified Profile</Text>
            <Text style={styles.modalBody}>
              This member has submitted government ID and Aadhar credentials which have been authenticated by our Trust & Safety verification team.
            </Text>
            <View style={styles.modalDetailsBox}>
              <Text style={styles.modalDetailItem}>• Government ID authenticated</Text>
              <Text style={styles.modalDetailItem}>• Phone number verified via OTP</Text>
              <Text style={styles.modalDetailItem}>• Education & Career credentials matched</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowVerifiedModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseBtnText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Contact Authorization Modal */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.phoneModalIconWrap}>
              <CustomIcon name="phone-call" size={26} color="#E66A1F" />
            </View>
            <Text style={styles.modalTitle}>Contact Access Authorization</Text>
            <Text style={styles.modalBody}>
              To protect member privacy, direct phone and WhatsApp communications require contact view authorization or mutual interest acceptance.
            </Text>

            <View style={styles.contactBalanceCard}>
              <Text style={styles.balanceLabel}>Your Contact View Balance:</Text>
              <Text style={styles.balanceValue}>
                {currentUser?.contactsViewedRemaining || 0} Contacts Remaining
              </Text>
            </View>

            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.authorizeBtn}
                onPress={handleUnlockContact}
                activeOpacity={0.85}
              >
                <Text style={styles.authorizeBtnText}>Authorize & View Contact (1 Credit)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowContactModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  // Top Header Bar
  headerBar: {
    height: 54,
    backgroundColor: Colors.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerCounterText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  genderToggleChip: {
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  genderToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  // Toast Banner
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 99,
    alignItems: 'center',
  },
  toastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.cardHover,
    gap: 8,
  },
  toastText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.burgundy,
  },
  heartBurstOverlay: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.5 - 50,
    zIndex: 98,
  },
  animatedCardWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  // Main Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFE8E0',
    ...Shadows.card,
  },
  // Photo Gallery
  photoContainer: {
    width: '100%',
    height: Math.min(height * 0.46, 390),
    position: 'relative',
    backgroundColor: '#2A2A2A',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  shortlistOverlayBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.72)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    gap: 6,
    zIndex: 10,
  },
  shortlistOverlayBtnActive: {
    backgroundColor: '#561C24',
  },
  shortlistBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  photoNavArrow: {
    position: 'absolute',
    top: '48%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.editorial,
    zIndex: 9,
  },
  photoNavLeft: {
    left: 10,
  },
  photoNavRight: {
    right: 10,
  },
  photoDotsRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  photoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  photoDotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  photoCountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  // Card Details
  cardDetails: {
    padding: 18,
  },
  badgeAndActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  // Verified Ribbon
  verifiedRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D72EA',
    paddingVertical: 4.5,
    paddingLeft: 7,
    paddingRight: 10,
    borderRadius: 6,
    gap: 5,
    position: 'relative',
  },
  verifiedCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheckIcon: {
    color: '#0D72EA',
    fontSize: 10.5,
    fontWeight: '900',
    marginTop: -1,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  verifiedInfoCircle: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  verifiedInfoIcon: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    marginTop: -1,
  },
  ribbonTail: {
    position: 'absolute',
    right: -7,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#0D72EA',
  },
  standardMemberBadge: {
    backgroundColor: '#F5ECE1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  standardMemberText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#755F55',
  },
  // Call & WhatsApp Contact Icons
  contactIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  callCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#E66A1F',
    backgroundColor: '#FFF7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#25D366',
    backgroundColor: '#F0FBF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Name & ID
  candidateName: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 4,
    letterSpacing: -0.2,
  },
  candidateIdRow: {
    fontSize: 13.5,
    color: '#757575',
    marginTop: 3,
    fontWeight: '500',
  },
  bulletSeparator: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  bulletDetailsText: {
    fontSize: 14.5,
    lineHeight: 22.5,
    color: '#2A2A2A',
    marginTop: 10,
    fontWeight: '400',
  },
  scrollHelperBadge: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8C4AC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 10,
    gap: 4,
    ...Shadows.subtle,
  },
  scrollHelperText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#EFE8E0',
    marginVertical: 18,
  },
  // Expanded Sections
  expandedSection: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.burgundy,
    flex: 1,
  },
  poruthamScorePill: {
    backgroundColor: Colors.dustyPinkLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  poruthamScorePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoGridItem: {
    width: '48%',
    backgroundColor: Colors.sandLight,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  gridLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  gridValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 3,
  },
  familyInfoList: {
    backgroundColor: Colors.sandLight,
    padding: 12,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  familyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  boldLabel: {
    fontWeight: '700',
    color: Colors.burgundy,
  },
  aboutText: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    lineHeight: 20,
    backgroundColor: Colors.sandLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  viewFullProfileBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.sandLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  viewFullProfileBtnText: {
    color: Colors.burgundy,
    fontSize: 13,
    fontWeight: '700',
  },
  // 3. Fixed Bottom Action Container
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    ...Shadows.cardHover,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  dontShowBtn: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.sandDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    gap: 6,
  },
  dontShowBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  skipBtn: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.sandDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    gap: 6,
  },
  skipBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  sendInterestBtn: {
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.terracotta, // Sacred Sindoor Vermilion for Send Interest
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.editorial,
  },
  sendInterestBtnSent: {
    backgroundColor: Colors.success,
  },
  sendInterestBtnText: {
    color: Colors.textLight,
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // All Caught Up Empty State
  allCaughtUpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  allCaughtUpIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  allCaughtUpTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: 8,
  },
  allCaughtUpDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  reloadDailyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.terracotta,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: BorderRadius.full,
    gap: 8,
    marginBottom: 12,
  },
  reloadDailyBtnText: {
    color: Colors.textLight,
    fontSize: 14.5,
    fontWeight: '700',
  },
  backHomeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backHomeBtnText: {
    color: Colors.burgundy,
    fontSize: 14,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 13.5,
    color: '#755F55',
    textAlign: 'center',
    marginTop: 14,
  },
  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    ...Shadows.cardHover,
  },
  verifiedModalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.verifiedBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  verifiedModalCheck: {
    color: Colors.textLight,
    fontSize: 24,
    fontWeight: '900',
  },
  phoneModalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.goldLight,
    borderWidth: 1.5,
    borderColor: Colors.phoneAmber,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  modalDetailsBox: {
    width: '100%',
    backgroundColor: Colors.sandLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    gap: 4,
  },
  modalDetailItem: {
    fontSize: 12.5,
    color: Colors.burgundy,
    fontWeight: '500',
  },
  modalCloseBtn: {
    width: '100%',
    backgroundColor: Colors.burgundy,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
  contactBalanceCard: {
    width: '100%',
    backgroundColor: Colors.sandLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    marginBottom: 18,
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  balanceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.terracotta,
    marginTop: 3,
  },
  modalActionButtons: {
    width: '100%',
    gap: 10,
  },
  authorizeBtn: {
    backgroundColor: Colors.terracotta,
    paddingVertical: 13,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  authorizeBtnText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
  cancelModalBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelModalBtnText: {
    color: Colors.textMuted,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
