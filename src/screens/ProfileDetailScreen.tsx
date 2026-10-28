import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { Language, Translations } from '../localization';
import { calculateTenPoruthams } from '../services/horoscopeService';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { CurrentUser, MatrimonyProfile, PoruthamResult } from '../types';

interface ProfileDetailProps {
  profile: MatrimonyProfile;
  language: Language;
  onBack: () => void;
  onViewHoroscopePorutham: (porutham: PoruthamResult) => void;
  onUpgradeMembership: () => void;
  onChatPress: () => void;
}

export const ProfileDetailScreen: React.FC<ProfileDetailProps> = ({
  profile,
  language,
  onBack,
  onViewHoroscopePorutham,
  onUpgradeMembership,
  onChatPress,
}) => {
  const t = Translations[language];
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [myProfile, setMyProfile] = useState<MatrimonyProfile | null>(null);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [interestStatus, setInterestStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [contactRevealed, setContactRevealed] = useState(false);

  useEffect(() => {
    const init = async () => {
      const user = await StorageService.getCurrentUser();
      setCurrentUser(user);
      const mine = await StorageService.getProfileById(user.activeProfileId);
      setMyProfile(mine);

      // Record profile view
      if (mine) {
        await StorageService.recordProfileView(mine.id, profile.id);
      }

      // Check shortlist
      const sl = await StorageService.getShortlists();
      setIsShortlisted(sl.includes(profile.id));

      // Check interests
      const interests = await StorageService.getInterests();
      const existing = interests.find(
        i =>
          (i.senderProfileId === user.activeProfileId && i.receiverProfileId === profile.id) ||
          (i.senderProfileId === profile.id && i.receiverProfileId === user.activeProfileId)
      );
      if (existing) {
        setInterestStatus(existing.status as any);
      }
    };
    init();
  }, [profile.id]);

  // Calculate Porutham
  let porutham: PoruthamResult | null = null;
  if (myProfile && myProfile.gender !== profile.gender) {
    const bride = myProfile.gender === 'bride' ? myProfile : profile;
    const groom = myProfile.gender === 'groom' ? myProfile : profile;
    porutham = calculateTenPoruthams(
      bride.horoscope.rasi,
      bride.horoscope.nakshatram,
      groom.horoscope.rasi,
      groom.horoscope.nakshatram
    );
  }

  const handleToggleShortlist = async () => {
    const res = await StorageService.toggleShortlist(profile.id);
    setIsShortlisted(res);
  };

  const handleSendInterest = async () => {
    if (!myProfile) return;
    await StorageService.sendInterest(myProfile.id, profile.id);
    setInterestStatus('pending');
    Alert.alert('Interest Sent! 💌', `Your express interest has been delivered to ${profile.name}.`);
  };

  const handleRevealContact = async () => {
    if (!currentUser) return;
    if (currentUser.membershipTier === 'free') {
      Alert.alert(
        'Membership Upgrade Required',
        'Viewing verified phone numbers requires a Silver, Gold, or Platinum plan.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Plans', onPress: onUpgradeMembership },
        ]
      );
      return;
    }

    if (currentUser.contactsViewedRemaining <= 0) {
      Alert.alert('Contact Quota Exceeded', 'Please top-up or upgrade your membership plan.');
      return;
    }

    // Deduct quota
    await StorageService.updateCurrentUser({
      contactsViewedRemaining: currentUser.contactsViewedRemaining - 1,
    });
    setCurrentUser({
      ...currentUser,
      contactsViewedRemaining: currentUser.contactsViewedRemaining - 1,
    });
    setContactRevealed(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${profile.name}'s matrimony profile (${profile.matrimonyId}) on Manamaalai Matrimony!`,
      });
    } catch {}
  };

  const handleReport = () => {
    Alert.alert(
      'Report Profile',
      'Select a reason for reporting:',
      [
        { text: 'Inappropriate Photos', onPress: () => Alert.alert('Report Submitted', 'Our moderation team will review this within 2 hours.') },
        { text: 'Incorrect Details', onPress: () => Alert.alert('Report Submitted', 'Thank you for helping keep Manamaalai safe.') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title={profile.matrimonyId}
        subtitle={profile.name}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photo Gallery with Paging */}
        <View style={styles.galleryWrap}>
          <Image
            source={{ uri: profile.photos[activePhotoIndex] || profile.photos[0] }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />

          <View style={styles.galleryThumbnailsRow}>
            {profile.photos.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setActivePhotoIndex(idx)}
                style={[
                  styles.thumbBorder,
                  activePhotoIndex === idx && styles.thumbBorderActive,
                ]}
              >
                <Image source={{ uri: p }} style={styles.thumbImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stylist Triple Action Floating Bar (Image 3 Screen 1) */}
        <View style={styles.floatingTripleBar}>
          {/* 1. Pass / Back Button */}
          <TouchableOpacity
            style={styles.circleBtnSmall}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <CustomIcon name="close" size={20} color={Colors.stylistDark} />
          </TouchableOpacity>

          {/* 2. Primary Elevated Heart Button */}
          <TouchableOpacity
            style={[
              styles.circleBtnLarge,
              interestStatus === 'accepted' && { backgroundColor: Colors.success },
            ]}
            onPress={handleSendInterest}
            activeOpacity={0.8}
          >
            <CustomIcon name="heart-filled" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* 3. Shortlist / Superlike Star Button */}
          <TouchableOpacity
            style={styles.circleBtnSmall}
            onPress={handleToggleShortlist}
            activeOpacity={0.8}
          >
            <CustomIcon
              name="star"
              size={20}
              color={isShortlisted ? Colors.stylistCoral : Colors.paletteSandstone}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Identity Card */}
        <View style={styles.card}>
          <View style={styles.nameHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileSubtitle}>
                {profile.age} Yrs • {profile.lifestyle.heightFeet} ({profile.lifestyle.heightCm} cm)
              </Text>
            </View>

            <TouchableOpacity style={styles.shareIconButton} onPress={handleShare} activeOpacity={0.7}>
              <CustomIcon name="share" size={18} color={Colors.stylistCoral} />
            </TouchableOpacity>
          </View>

          <View style={styles.tagWrap}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.caste}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.educationCareer.qualification}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.currentCity}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.maritalStatus.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>

        {/* Stylist Pastel Interest Chips (Image 3 Screen 1) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Interests & Lifestyle</Text>
          <View style={styles.pastelInterestsWrap}>
            {[
              { label: 'Music', bg: Colors.chipPink, color: Colors.chipPinkText },
              { label: 'Photography', bg: Colors.chipBlue, color: Colors.chipBlueText },
              { label: 'Art & Design', bg: Colors.chipYellow, color: Colors.chipYellowText },
              { label: 'Literature', bg: Colors.chipPurple, color: Colors.chipPurpleText },
              { label: 'Classical Dance', bg: Colors.chipPink, color: Colors.chipPinkText },
              { label: 'Travel', bg: Colors.chipBlue, color: Colors.chipBlueText },
            ].map((interest, idx) => (
              <View
                key={idx}
                style={[styles.interestChipPill, { backgroundColor: interest.bg }]}
              >
                <Text style={[styles.interestChipText, { color: interest.color }]}>
                  {interest.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 10-Porutham Horoscope Compatibility Card */}
        {porutham && (
          <TouchableOpacity
            style={styles.poruthamCard}
            onPress={() => onViewHoroscopePorutham(porutham!)}
            activeOpacity={0.9}
          >
            <View style={styles.poruthamCardHeader}>
              <View style={styles.poruthamIconCircle}>
                <CustomIcon name="sparkles" size={20} color={Colors.maroonDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.poruthamScoreTitle}>
                  {porutham.totalScore}/10 Poruthams Match
                </Text>
                <Text style={styles.poruthamScoreVerdict}>
                  {language === 'ta' ? porutham.verdictTamil : porutham.summary}
                </Text>
              </View>
              <CustomIcon name="chevron-right" size={20} color={Colors.maroon} />
            </View>
            <Text style={styles.poruthamTapHint}>
              Tap to view full 10-Porutham breakdown (Rajju, Dinam, Ganam, Rasi...) →
            </Text>
          </TouchableOpacity>
        )}

        {/* About Candidate & Family Bio */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About {profile.name.split(' ')[0]}</Text>
          <Text style={styles.aboutText}>{profile.about}</Text>
        </View>

        {/* Education & Career */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Education & Career</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Highest Degree:</Text>
            <Text style={styles.detailVal}>{profile.educationCareer.qualification}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>College / Univ:</Text>
            <Text style={styles.detailVal}>{profile.educationCareer.institution}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Occupation:</Text>
            <Text style={styles.detailVal}>{profile.educationCareer.occupation}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Company / Org:</Text>
            <Text style={styles.detailVal}>{profile.educationCareer.employer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Annual Income:</Text>
            <Text style={styles.detailVal}>{profile.educationCareer.annualIncome}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Work Location:</Text>
            <Text style={styles.detailVal}>{profile.educationCareer.workLocation}</Text>
          </View>
        </View>

        {/* Family Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Family Background</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Father's Profession:</Text>
            <Text style={styles.detailVal}>{profile.family.fatherOccupation}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mother's Profession:</Text>
            <Text style={styles.detailVal}>{profile.family.motherOccupation}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Siblings:</Text>
            <Text style={styles.detailVal}>{profile.family.siblings}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Family Type:</Text>
            <Text style={styles.detailVal}>{profile.family.familyType.toUpperCase()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Family Values:</Text>
            <Text style={styles.detailVal}>{profile.family.familyValues.toUpperCase()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Native District:</Text>
            <Text style={styles.detailVal}>{profile.nativeDistrict}</Text>
          </View>
        </View>

        {/* Horoscope / Jathagam */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Horoscope & Jathagam</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rasi (Moon Sign):</Text>
            <Text style={styles.detailVal}>{profile.horoscope.rasi}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nakshatram (Star):</Text>
            <Text style={styles.detailVal}>{profile.horoscope.nakshatram}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lagnam:</Text>
            <Text style={styles.detailVal}>{profile.horoscope.lagnam || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gothram:</Text>
            <Text style={styles.detailVal}>{profile.horoscope.gothram || 'Shiva Gothram'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Chevvai (Mars) Dosham:</Text>
            <Text style={styles.detailVal}>{profile.horoscope.chevvaiDosham ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sarpa / Rahu Dosham:</Text>
            <Text style={styles.detailVal}>{profile.horoscope.sarpaDosham ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        {/* Contact Details Access Card */}
        <View style={[styles.card, styles.contactCard]}>
          <Text style={styles.sectionTitle}>Contact & Communication</Text>

          {contactRevealed ? (
            <View style={styles.revealedContactBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone Number:</Text>
                <Text style={[styles.detailVal, styles.revealedPhone]}>{profile.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email Address:</Text>
                <Text style={styles.detailVal}>{profile.email}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.lockedContactBox}>
              <CustomIcon name="lock" size={24} color={Colors.goldDark} />
              <Text style={styles.lockedContactTitle}>Phone Number Hidden For Privacy</Text>
              <Text style={styles.lockedContactSub}>
                {currentUser?.membershipTier === 'free'
                  ? 'Upgrade to Silver or Gold membership to view verified phone numbers.'
                  : `You have ${currentUser?.contactsViewedRemaining || 0} contact views remaining in your plan.`}
              </Text>

              <TouchableOpacity
                style={styles.unlockContactBtn}
                onPress={handleRevealContact}
                activeOpacity={0.85}
              >
                <Text style={styles.unlockContactBtnText}>
                  {currentUser?.membershipTier === 'free'
                    ? 'Upgrade to View Contact'
                    : 'View Verified Phone Number'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Safety & Moderation Actions */}
        <View style={styles.safetyRow}>
          <TouchableOpacity style={styles.safetyBtn} onPress={handleShare}>
            <CustomIcon name="share" size={15} color={Colors.textSecondary} />
            <Text style={styles.safetyBtnText}>Share Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.safetyBtn} onPress={handleReport}>
            <Text style={[styles.safetyBtnText, { color: Colors.danger }]}>Report Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bottomIconBtn, isShortlisted && styles.bottomIconBtnActive]}
          onPress={handleToggleShortlist}
          activeOpacity={0.8}
        >
          <CustomIcon
            name={isShortlisted ? 'heart-filled' : 'heart'}
            size={20}
            color={isShortlisted ? Colors.danger : Colors.maroon}
          />
          <Text style={styles.bottomBtnLabel}>
            {isShortlisted ? 'Saved' : t.shortlist}
          </Text>
        </TouchableOpacity>

        {interestStatus === 'accepted' ? (
          <TouchableOpacity
            style={[styles.bottomPrimaryBtn, { backgroundColor: Colors.success }]}
            onPress={onChatPress}
            activeOpacity={0.85}
          >
            <CustomIcon name="message" size={18} color="#FFF" />
            <Text style={styles.bottomPrimaryBtnText}>Message Candidate</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.bottomPrimaryBtn,
              interestStatus === 'pending' && { backgroundColor: Colors.royalRed },
            ]}
            onPress={handleSendInterest}
            disabled={interestStatus === 'pending'}
            activeOpacity={0.85}
          >
            <CustomIcon name="heart-filled" size={18} color="#FFF" />
            <Text style={styles.bottomPrimaryBtnText}>
              {interestStatus === 'pending' ? t.interestSent : t.sendInterest}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  galleryWrap: {
    backgroundColor: '#000',
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: 330,
  },
  galleryThumbnailsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    left: 12,
    gap: 8,
  },
  floatingTripleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: -26,
    marginBottom: 6,
    zIndex: 10,
  },
  circleBtnSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: Colors.stylistDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  circleBtnLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.stylistCoral,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.stylistCoral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  shareIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.stylistCoralLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastelInterestsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  interestChipPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  interestChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  thumbBorder: {
    width: 44,
    height: 44,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  thumbBorderActive: {
    borderColor: Colors.burgundy,
    borderWidth: 2.5,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.editorial,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileName: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleXLarge,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  profileSubtitle: {
    fontSize: Typography.bodyRegular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  tagText: {
    fontSize: Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  poruthamCard: {
    backgroundColor: Colors.dustyPinkLight,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
    ...Shadows.editorial,
  },
  poruthamCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  poruthamIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poruthamScoreTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  poruthamScoreVerdict: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  poruthamTapHint: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.dustyPink,
  },
  sectionTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: Spacing.sm,
  },
  aboutText: {
    fontSize: Typography.bodyRegular,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sandLight,
  },
  detailLabel: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    flex: 1.2,
  },
  detailVal: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1.8,
    textAlign: 'right',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
  },
  lockedContactBox: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  lockedContactTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    marginTop: 8,
  },
  lockedContactSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: Spacing.md,
    lineHeight: 18,
  },
  unlockContactBtn: {
    backgroundColor: Colors.burgundy,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  unlockContactBtnText: {
    color: Colors.creme,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
  },
  revealedContactBox: {
    paddingVertical: 4,
  },
  revealedPhone: {
    color: Colors.success,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
  },
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  safetyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  safetyBtnText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.creme,
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
    gap: Spacing.md,
    alignItems: 'center',
    ...Shadows.editorial,
  },
  bottomIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  bottomIconBtnActive: {
    opacity: 0.9,
  },
  bottomBtnLabel: {
    fontSize: Typography.tiny,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  bottomPrimaryBtn: {
    flex: 1,
    backgroundColor: Colors.burgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    gap: 8,
    ...Shadows.editorial,
  },
  bottomPrimaryBtnText: {
    color: Colors.creme,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
  },
});
