import React, { useEffect } from 'react';
import {
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
import { Language } from '../localization';
import { MatrimonyProfile } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

export interface PostRegistrationWelcomeScreenProps {
  userProfile?: MatrimonyProfile | null;
  language: Language;
  onToggleLanguage?: () => void;
  onExploreMatches: () => void;
}

export const PostRegistrationWelcomeScreen: React.FC<PostRegistrationWelcomeScreenProps> = ({
  userProfile,
  language,
  onToggleLanguage,
  onExploreMatches,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const memberName = userProfile?.name || (isTa ? 'அன்பரே' : 'John Doe');
  const memberId = userProfile?.matrimonyId || userProfile?.id || 'MM-TN-2025';
  const photoUrl = userProfile?.photos && userProfile.photos[0] ? userProfile.photos[0] : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Bar with Brand and Language Toggle */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>மணமாலை</Text>
          <Text style={styles.brandSubtitle}>MANAMAALAI</Text>
        </View>

        {onToggleLanguage && (
          <TouchableOpacity
            style={styles.langPill}
            onPress={onToggleLanguage}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.langText}>{isTa ? 'English' : 'தமிழ்'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 90, 110) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Visual & Avatar */}
        <View style={styles.visualContainer}>
          {/* Outer glowing celebration ring */}
          <View style={styles.outerGlowCircle}>
            <View style={styles.innerAvatarCircle}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={1.8}>
                    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <Circle cx="12" cy="7" r="4" />
                  </Svg>
                </View>
              )}
            </View>

            {/* Checkmark Success Badge */}
            <View style={styles.successBadge}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3}>
                <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </View>
        </View>

        {/* Success Status Pill */}
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusPillText}>
            {isTa
              ? 'நிர்வாகி ஒப்புதலுக்காக சமர்ப்பிக்கப்பட்டது ⏳'
              : 'Submitted for Admin Approval ⏳'}
          </Text>
        </View>

        {/* Primary Headline Requested by User */}
        <Text style={styles.mainTitle}>
          {isTa
            ? 'உங்கள் சுயவிவரம் சரிபார்ப்பில் உள்ளது.'
            : 'Profile Registered & Pending Approval'}
        </Text>

        {/* Secondary Subtitle */}
        <Text style={styles.mainSubtitle}>
          {isTa
            ? `வாழ்த்துகள், ${memberName}! உங்கள் சுயவிவரம் வெற்றிகரமாக பதிவு செய்யப்பட்டது. நிர்வாகி உங்கள் சுயவிவரத்தை சரிபார்த்து ஒப்புதல் அளித்தவுடன் நீங்கள் உள்நுழையலாம்.`
            : `Thank you, ${memberName}! Your profile has been submitted to our moderation team. Once the admin approves your profile, you can sign in with your email and password.`}
        </Text>

        {/* Member ID Badge */}
        <View style={styles.memberIdBadge}>
          <Text style={styles.memberIdLabel}>
            {isTa ? 'உங்கள் திருமண ஐடி:' : 'Your Matrimony ID:'}
          </Text>
          <Text style={styles.memberIdValue}>{memberId}</Text>
        </View>

        {/* Quick Summary Profile Card */}
        {userProfile && (
          <View style={styles.profileSummaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>{isTa ? 'பெயர்' : 'Name'}</Text>
                <Text style={styles.summaryValue}>{userProfile.name}</Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>{isTa ? 'வயது / பாலினம்' : 'Age / Gender'}</Text>
                <Text style={styles.summaryValue}>
                  {userProfile.age} yrs • {userProfile.gender === 'groom' ? (isTa ? 'ஆண்' : 'Groom') : (isTa ? 'பெண்' : 'Bride')}
                </Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>{isTa ? 'இடம்' : 'Location'}</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {userProfile.currentCity || userProfile.nativeDistrict || 'Chennai, Tamil Nadu'}
                </Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>{isTa ? 'கல்வி / தொழில்' : 'Profession'}</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {userProfile.educationCareer?.occupation || userProfile.educationCareer?.qualification || 'Software Engineer'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Key Features Highlights */}
        <View style={styles.featuresCard}>
          {/* Feature 1 */}
          <View style={styles.featureItem}>
            <View style={[styles.featureIconWrap, { backgroundColor: '#F4F2FF' }]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </Svg>
            </View>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>
                {isTa ? '100% சரிபார்க்கப்பட்ட வரன்கள்' : '100% Verified Profiles'}
              </Text>
              <Text style={styles.featureDesc}>
                {isTa
                  ? 'அங்கீகரிக்கப்பட்ட குடும்பங்களின் சுயவிவரங்கள்'
                  : 'Genuine profiles verified by mobile & identity'}
              </Text>
            </View>
          </View>

          <View style={styles.featureDivider} />

          {/* Feature 2 */}
          <View style={styles.featureItem}>
            <View style={[styles.featureIconWrap, { backgroundColor: '#FDF4FF' }]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C026D3" strokeWidth={2}>
                <Circle cx="12" cy="12" r="10" />
                <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <Path d="M2 12h20" />
              </Svg>
            </View>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>
                {isTa ? '10 பொருத்த ஜாதக கணிப்பு' : '10-Porutham Horoscope Matching'}
              </Text>
              <Text style={styles.featureDesc}>
                {isTa
                  ? 'பாரம்பரிய தமிழ் ஜோதிட பொருத்த மதிப்பீடு'
                  : 'Traditional Tamil astrology compatibility report'}
              </Text>
            </View>
          </View>

          <View style={styles.featureDivider} />

          {/* Feature 3 */}
          <View style={styles.featureItem}>
            <View style={[styles.featureIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2}>
                <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </Svg>
            </View>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>
                {isTa ? 'பாதுகாப்பான இணைப்புகள்' : 'Safe & Privacy Focused'}
              </Text>
              <Text style={styles.featureDesc}>
                {isTa
                  ? 'உங்கள் தகவல்கள் மற்றும் படங்கள் முழு பாதுகாப்பில்'
                  : 'Direct, secure communication on your terms'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 24) },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onExploreMatches}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryButtonText}>
            {isTa ? 'உள்நுழைவுப் பக்கத்திற்குச் செல்லவும் →' : 'Go to Sign In →'}
          </Text>
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

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  brandContainer: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: BRAND_PURPLE,
    letterSpacing: 1.5,
  },
  langPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#F8F9FB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_PURPLE,
  },

  /* Scroll Content */
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* Visual Container */
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  outerGlowCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#F4F2FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  innerAvatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FB',
  },
  successBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  /* Status Pill */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },

  /* Main Headline Requested */
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
    lineHeight: 32,
  },
  mainSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  /* Member ID Badge */
  memberIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 20,
    gap: 8,
  },
  memberIdLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  memberIdValue: {
    fontSize: 14,
    fontWeight: '800',
    color: BRAND_PURPLE,
    letterSpacing: 0.5,
  },

  /* Profile Summary Card */
  profileSummaryCard: {
    width: '100%',
    backgroundColor: '#F8F9FB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCol: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EEF2F6',
    marginVertical: 12,
  },

  /* Features Card */
  featuresCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  featureDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  primaryButton: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 28,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
