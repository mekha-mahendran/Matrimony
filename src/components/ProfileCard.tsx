import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Language, Translations } from '../localization';
import { calculateTenPoruthams } from '../services/horoscopeService';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { MatrimonyProfile } from '../types';
import { CustomIcon } from './CustomIcon';

interface ProfileCardProps {
  profile: MatrimonyProfile;
  currentProfile?: MatrimonyProfile | null;
  language: Language;
  isShortlisted?: boolean;
  interestStatus?: 'pending' | 'accepted' | 'declined' | null;
  onPress: () => void;
  onToggleShortlist: () => void;
  onSendInterest: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  currentProfile,
  language,
  isShortlisted = false,
  interestStatus = null,
  onPress,
  onToggleShortlist,
  onSendInterest,
}) => {
  const t = Translations[language];

  // Calculate Porutham with current user if applicable
  let poruthamResult = null;
  if (currentProfile && currentProfile.gender !== profile.gender) {
    const bride = currentProfile.gender === 'bride' ? currentProfile : profile;
    const groom = currentProfile.gender === 'groom' ? currentProfile : profile;
    poruthamResult = calculateTenPoruthams(
      bride.horoscope.rasi,
      bride.horoscope.nakshatram,
      groom.horoscope.rasi,
      groom.horoscope.nakshatram
    );
  }

  const primaryPhoto =
    profile.photos && profile.photos.length > 0
      ? profile.photos[0]
      : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.94}
    >
      {/* Top Image + Badges Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: primaryPhoto }} style={styles.image} resizeMode="cover" />

        {/* Top Badges Row */}
        <View style={styles.topBadgesRow}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>{profile.matrimonyId}</Text>
          </View>

          <TouchableOpacity
            style={[styles.heartBtn, isShortlisted && styles.heartBtnActive]}
            onPress={onToggleShortlist}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CustomIcon
              name={isShortlisted ? 'heart-filled' : 'heart'}
              size={17}
              color={isShortlisted ? Colors.burgundy : '#FFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Banner on Image: Verification & Membership */}
        <View style={styles.imageBottomBar}>
          {profile.isVerified && (
            <View style={styles.verifiedChip}>
              <CustomIcon name="shield" size={12} color={Colors.burgundy} />
              <Text style={styles.verifiedText}>Aadhaar Verified</Text>
            </View>
          )}

          {profile.membershipTier !== 'free' && (
            <View style={styles.vipChip}>
              <CustomIcon name="crown" size={11} color={Colors.burgundy} />
              <Text style={styles.vipText}>
                {profile.membershipTier.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Card Content Details */}
      <View style={styles.contentWrap}>
        {/* Name and Age Header */}
        <View style={styles.headerRow}>
          <Text style={styles.nameText} numberOfLines={1}>
            {profile.name}, {profile.age}
          </Text>
        </View>

        <Text style={styles.quickStatText}>
          {profile.lifestyle.heightFeet} ({profile.lifestyle.heightCm} cm) • {profile.maritalStatus || 'Never Married'}
        </Text>

        {/* Caste / Community Line */}
        <View style={styles.metaRow}>
          <CustomIcon name="compass" size={13} color={Colors.burgundy} />
          <Text style={styles.metaText} numberOfLines={1}>
            {profile.caste} {profile.subCaste ? `• ${profile.subCaste}` : ''}
          </Text>
        </View>

        {/* Education & Occupation Line */}
        <View style={styles.metaRow}>
          <CustomIcon name="education" size={13} color={Colors.burgundy} />
          <Text style={styles.metaText} numberOfLines={1}>
            {profile.educationCareer.qualification}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <CustomIcon name="briefcase" size={13} color={Colors.burgundy} />
          <Text style={styles.metaText} numberOfLines={1}>
            {profile.educationCareer.occupation} • {profile.educationCareer.employer}
          </Text>
        </View>

        {/* City and Native Location */}
        <View style={styles.metaRow}>
          <CustomIcon name="location" size={13} color={Colors.burgundy} />
          <Text style={styles.metaText} numberOfLines={1}>
            {profile.currentCity} (Native: {profile.nativeDistrict})
          </Text>
        </View>

        {/* Horoscope / Porutham Badge Pill */}
        {poruthamResult ? (
          <View
            style={[
              styles.poruthamPill,
              poruthamResult.verdict === 'Uthama'
                ? styles.poruthamUthama
                : poruthamResult.verdict === 'Madhyama'
                ? styles.poruthamMadhyama
                : styles.poruthamAdhama,
            ]}
          >
            <CustomIcon name="sparkles" size={12} color={Colors.burgundy} />
            <Text style={styles.poruthamPillText}>
              {poruthamResult.totalScore}/10 Porutham •{' '}
              {language === 'ta'
                ? poruthamResult.verdictTamil
                : poruthamResult.verdict === 'Uthama'
                ? 'Uthama Match'
                : 'Good Compatibility'}
            </Text>
          </View>
        ) : (
          <View style={styles.rasiPill}>
            <Text style={styles.rasiPillText}>
              {profile.horoscope.rasi} • {profile.horoscope.nakshatram}
            </Text>
          </View>
        )}

        {/* Action Buttons: View Profile & Express Interest */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.viewBtnText}>{t.viewProfile}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.interestBtn,
              interestStatus === 'accepted'
                ? styles.interestBtnAccepted
                : interestStatus === 'pending'
                ? styles.interestBtnPending
                : styles.interestBtnDefault,
            ]}
            onPress={onSendInterest}
            disabled={interestStatus === 'accepted'}
            activeOpacity={0.85}
          >
            <CustomIcon
              name={
                interestStatus === 'accepted'
                  ? 'check'
                  : interestStatus === 'pending'
                  ? 'heart-filled'
                  : 'heart'
              }
              size={14}
              color={
                interestStatus === 'accepted'
                  ? Colors.success
                  : interestStatus === 'pending'
                  ? Colors.dustyPinkLight
                  : Colors.creme
              }
            />
            <Text
              style={[
                styles.interestBtnText,
                interestStatus === 'accepted' && styles.interestBtnTextAccepted,
              ]}
            >
              {interestStatus === 'accepted'
                ? 'Mutual Match'
                : interestStatus === 'pending'
                ? t.interestSent
                : t.sendInterest}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.editorial,
  },
  imageContainer: {
    width: '100%',
    height: 230,
    backgroundColor: Colors.sandLight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBadge: {
    backgroundColor: Colors.overlayDark,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  idText: {
    fontSize: Typography.tiny,
    fontWeight: '700',
    color: Colors.creme,
    letterSpacing: 0.5,
  },
  heartBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtnActive: {
    backgroundColor: Colors.sandLight,
  },
  imageBottomBar: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creme,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.subtle,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.burgundy,
    marginLeft: 3,
  },
  vipChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
  },
  vipText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.burgundy,
    marginLeft: 3,
  },
  contentWrap: {
    padding: Spacing.md,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: Typography.fontSerif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.burgundy,
    flex: 1,
  },
  quickStatText: {
    fontSize: Typography.bodySmall,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  poruthamPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginTop: 10,
    marginBottom: 8,
  },
  poruthamUthama: {
    backgroundColor: Colors.dustyPinkLight,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
  },
  poruthamMadhyama: {
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  poruthamAdhama: {
    backgroundColor: Colors.creme,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  poruthamPillText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
    marginLeft: 5,
  },
  rasiPill: {
    backgroundColor: Colors.creme,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginTop: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  rasiPillText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
  },
  viewBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1.2,
    borderColor: Colors.burgundy,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.creme,
  },
  viewBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  interestBtn: {
    flex: 1.3,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  interestBtnDefault: {
    backgroundColor: Colors.burgundy,
  },
  interestBtnPending: {
    backgroundColor: Colors.burgundySoft,
    opacity: 0.9,
  },
  interestBtnAccepted: {
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  interestBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.creme,
  },
  interestBtnTextAccepted: {
    color: Colors.success,
  },
});
