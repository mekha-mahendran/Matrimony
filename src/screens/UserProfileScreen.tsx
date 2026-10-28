import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { Language, Translations } from '../localization';
import { AuthService } from '../services/authService';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { CurrentUser, MatrimonyProfile } from '../types';

interface UserProfileScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onEditProfile: () => void;
  onMembershipPress: () => void;
  onViewMyProfile: (profile: MatrimonyProfile) => void;
  onLogout: () => void;
  unreadCount: number;
  isAdmin: boolean;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onEditProfile,
  onMembershipPress,
  onViewMyProfile,
  onLogout,
  unreadCount,
  isAdmin,
}) => {
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

  const handleSwitchAccount = async (profileId: string) => {
    const p = await StorageService.getProfileById(profileId);
    if (p) {
      await StorageService.updateCurrentUser({
        activeProfileId: p.id,
        phone: p.phone.replace(/[^0-9]/g, ''),
        email: p.email,
      });
      await loadData();
      Alert.alert('Account Switched', `Active candidate profile switched to ${p.name}.`);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Matrimony Account',
      'Are you sure you want to permanently delete your Manamaalai matrimony profile? All personal data, horoscope details, and interests will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: async () => {
            if (myProfile) {
              await StorageService.suspendProfile(myProfile.id);
            }
            onLogout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={onToggleLanguage}
        unreadNotificationsCount={unreadCount}
        onNotificationPress={onNotificationPress}
        onAdminPress={onAdminPress}
        isAdmin={isAdmin}
        title={t.tabProfile}
        subtitle="Account settings & candidate privacy"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        {myProfile && (
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarRow}>
              <Image source={{ uri: myProfile.photos[0] }} style={styles.avatar} />

              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {myProfile.name}
                  </Text>
                  {myProfile.isVerified && (
                    <CustomIcon name="shield" size={16} color={Colors.verifiedBlue} />
                  )}
                </View>

                <Text style={styles.matrimonyIdText}>ID: {myProfile.matrimonyId}</Text>
                <Text style={styles.detailText}>
                  {myProfile.age} Yrs • {myProfile.educationCareer.occupation}
                </Text>
                <Text style={styles.locationText}>{myProfile.currentCity}, Tamil Nadu</Text>
              </View>
            </View>

            {/* Completeness Bar */}
            <View style={styles.completenessWrap}>
              <View style={styles.completenessHeader}>
                <Text style={styles.completenessLabel}>Profile Completeness</Text>
                <Text style={styles.completenessVal}>{myProfile.profileCompleteness}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, { width: `${myProfile.profileCompleteness}%` }]}
                />
              </View>
            </View>

            {/* Quick Action Buttons */}
            <View style={styles.headerBtnRow}>
              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => onViewMyProfile(myProfile)}
                activeOpacity={0.8}
              >
                <Text style={styles.previewBtnText}>Preview Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={onEditProfile}
                activeOpacity={0.85}
              >
                <Text style={styles.editBtnText}>Edit Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Membership Subscription Card */}
        <TouchableOpacity
          style={styles.membershipCard}
          onPress={onMembershipPress}
          activeOpacity={0.9}
        >
          <View style={styles.membershipIconWrap}>
            <CustomIcon name="crown" size={24} color={Colors.premiumGold} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.membershipRow}>
              <Text style={styles.membershipTitle}>
                {currentUser?.membershipTier.toUpperCase()} Kalyanam
              </Text>
              <View style={styles.upgradeChip}>
                <Text style={styles.upgradeChipText}>UPGRADE</Text>
              </View>
            </View>
            <Text style={styles.membershipSub}>
              {currentUser?.contactsViewedRemaining} phone unlocks & {currentUser?.interestsRemaining} interests remaining
            </Text>
          </View>
        </TouchableOpacity>

        {/* Candidate Privacy Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy & Protection</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: Spacing.md }}>
              <Text style={styles.settingLabel}>{t.hidePhone}</Text>
              <Text style={styles.settingSub}>
                Prevent public display of your phone number until mutual interest is accepted
              </Text>
            </View>
            <Switch
              value={hidePhone}
              onValueChange={handleToggleHidePhone}
              trackColor={{ false: Colors.sand, true: Colors.burgundy }}
              thumbColor={Colors.creme}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: Spacing.md }}>
              <Text style={styles.settingLabel}>{t.hideHoroscope}</Text>
              <Text style={styles.settingSub}>
                Share detailed Jathagam birth coordinates only upon explicit request
              </Text>
            </View>
            <Switch
              value={hideHoroscope}
              onValueChange={handleToggleHideHoroscope}
              trackColor={{ false: Colors.sand, true: Colors.burgundy }}
              thumbColor={Colors.creme}
            />
          </View>
        </View>

        {/* Administration & Role Mode */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Admin & Moderation</Text>
          <TouchableOpacity
            style={styles.adminActionRow}
            onPress={onAdminPress}
            activeOpacity={0.8}
          >
            <View style={styles.adminIconBox}>
              <CustomIcon name="admin" size={18} color={Colors.maroon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adminTitle}>Admin Command Center</Text>
              <Text style={styles.adminSub}>
                Moderate Tamil member verifications, view stats & reports
              </Text>
            </View>
            <CustomIcon name="chevron-right" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Quick Demo Profile Switcher */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Switch Active Candidate Profile</Text>
          <View style={styles.switcherRow}>
            <TouchableOpacity
              style={[
                styles.switcherPill,
                currentUser?.activeProfileId === 'mm-g-01' && styles.switcherPillActive,
              ]}
              onPress={() => handleSwitchAccount('mm-g-01')}
            >
              <Text
                style={[
                  styles.switcherText,
                  currentUser?.activeProfileId === 'mm-g-01' && styles.switcherTextActive,
                ]}
              >
                Groom: Karthik
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switcherPill,
                currentUser?.activeProfileId === 'mm-b-01' && styles.switcherPillActive,
              ]}
              onPress={() => handleSwitchAccount('mm-b-01')}
            >
              <Text
                style={[
                  styles.switcherText,
                  currentUser?.activeProfileId === 'mm-b-01' && styles.switcherTextActive,
                ]}
              >
                Bride: Soundarya MD
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Language / மொழி</Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langChip, language === 'ta' && styles.langChipActive]}
              onPress={onToggleLanguage}
            >
              <Text style={[styles.langChipText, language === 'ta' && styles.langChipTextActive]}>
                தமிழ் (Tamil)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langChip, language === 'en' && styles.langChipActive]}
              onPress={onToggleLanguage}
            >
              <Text style={[styles.langChipText, language === 'en' && styles.langChipTextActive]}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout & Account Deletion */}
        <View style={styles.accountActions}>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>{t.logout}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount} activeOpacity={0.8}>
            <Text style={styles.deleteText}>Delete Account Permanently</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.md,
    ...Shadows.editorial,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.sandLight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: Colors.burgundy,
    flex: 1,
  },
  matrimonyIdText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
    marginTop: 2,
  },
  detailText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  locationText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  completenessWrap: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.sandLight,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  completenessLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  completenessVal: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  barTrack: {
    height: 6,
    backgroundColor: Colors.sandLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.burgundy,
  },
  headerBtnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  previewBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1.2,
    borderColor: Colors.burgundy,
    alignItems: 'center',
    backgroundColor: Colors.creme,
  },
  previewBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.burgundy,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.creme,
  },
  membershipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dustyPinkLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.editorial,
  },
  membershipIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  membershipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  upgradeChip: {
    backgroundColor: Colors.burgundy,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.sm,
  },
  upgradeChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.creme,
  },
  membershipSub: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sandLight,
  },
  settingLabel: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  adminActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  adminIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.sandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  adminSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  switcherRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  switcherPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.sandLight,
    alignItems: 'center',
  },
  switcherPillActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  switcherText: {
    fontSize: Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  switcherTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  langRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.sandLight,
    alignItems: 'center',
  },
  langChipActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  langChipText: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  langChipTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  accountActions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  logoutBtn: {
    backgroundColor: Colors.creme,
    borderWidth: 1.2,
    borderColor: Colors.burgundy,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  deleteBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: Typography.caption,
    color: Colors.danger,
    textDecorationLine: 'underline',
  },
});
