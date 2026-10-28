import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { GarlandLogo } from '../components/GarlandLogo';
import { KolamPattern } from '../components/KolamBackground';
import { Language, Translations } from '../localization';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../theme';
import { ProfileCreatedFor } from '../types';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onRegisterPress: (createdFor?: ProfileCreatedFor) => void;
  onLoginPress: () => void;
  onGuestBrowse: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onToggleLanguage,
  onRegisterPress,
  onLoginPress,
  onGuestBrowse,
}) => {
  const t = Translations[language];
  const [selectedFor, setSelectedFor] = useState<ProfileCreatedFor>('self');

  const creationOptions: { id: ProfileCreatedFor; labelTa: string; labelEn: string; icon: any }[] = [
    { id: 'self', labelTa: 'எனக்கு', labelEn: 'Myself', icon: 'user' },
    { id: 'son', labelTa: 'மகனுக்கு', labelEn: 'Son', icon: 'shield' },
    { id: 'daughter', labelTa: 'மகளுக்கு', labelEn: 'Daughter', icon: 'sparkles' },
    { id: 'brother', labelTa: 'சகோதரனுக்கு', labelEn: 'Brother', icon: 'briefcase' },
    { id: 'sister', labelTa: 'சகோதரிக்கு', labelEn: 'Sister', icon: 'heart' },
    { id: 'relative', labelTa: 'உறவினருக்கு', labelEn: 'Relative', icon: 'compass' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KolamPattern color={Colors.sand} opacity={0.3} />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandCrest}>
          <GarlandLogo size="small" showSubtitle={false} lightMode={false} />
        </View>

        <TouchableOpacity
          style={styles.langPill}
          onPress={onToggleLanguage}
          activeOpacity={0.8}
        >
          <Text style={styles.langPillText}>
            {language === 'en' ? 'தமிழ்' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Title & Blessing */}
        <View style={styles.heroSection}>
          <View style={styles.blessingTag}>
            <Text style={styles.blessingText}>வாழ்க வளமுடன் • Mangala Vaazhvu</Text>
          </View>

          <Text style={styles.headline}>
            {language === 'ta'
              ? 'மணமாலை தமிழ் மேட்ரிமோனி'
              : 'Find Your Sacred Tamil Life Partner'}
          </Text>

          <Text style={styles.subheadline}>
            {language === 'ta'
              ? 'தமிழ்நாடு மற்றும் உலகளாவிய தமிழர்களுக்கான 100% சரிபார்க்கப்பட்ட வரன்கள் மற்றும் ஜாதகப் பொருத்தம்.'
              : 'The trusted Tamil matrimony platform connecting verified families with authentic 10-Porutham astrology.'}
          </Text>
        </View>

        {/* Quick Profile Creation Choice Box (TamilMatrimony Style) */}
        <View style={styles.creationBox}>
          <Text style={styles.creationBoxTitle}>
            {language === 'ta'
              ? 'யாருக்காக வரன் தேடுகிறீர்கள்?'
              : 'I am creating a profile for:'}
          </Text>

          <View style={styles.optionsGrid}>
            {creationOptions.map(opt => {
              const active = selectedFor === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                  onPress={() => setSelectedFor(opt.id)}
                  activeOpacity={0.8}
                >
                  <CustomIcon
                    name={opt.icon}
                    size={16}
                    color={active ? Colors.creme : Colors.burgundy}
                  />
                  <Text style={[styles.optionCardText, active && styles.optionCardTextActive]}>
                    {language === 'ta' ? opt.labelTa : opt.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => onRegisterPress(selectedFor)}
            activeOpacity={0.88}
          >
            <Text style={styles.registerBtnText}>
              {language === 'ta' ? 'இலவசமாக பதிவு செய்க' : 'Register Free & Find Matches'}
            </Text>
            <CustomIcon name="chevron-right" size={16} color={Colors.creme} />
          </TouchableOpacity>
        </View>

        {/* Trust Badges Bar */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustItem}>
            <CustomIcon name="shield" size={18} color={Colors.burgundy} />
            <Text style={styles.trustText}>100% Aadhaar Verified</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <CustomIcon name="sparkles" size={18} color={Colors.burgundy} />
            <Text style={styles.trustText}>10 Porutham Jathagam</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <CustomIcon name="lock" size={18} color={Colors.burgundy} />
            <Text style={styles.trustText}>Total Privacy Control</Text>
          </View>
        </View>

        {/* Login CTA & Guest Browse */}
        <View style={styles.bottomActions}>
          <View style={styles.loginRow}>
            <Text style={styles.alreadyMemberText}>
              {language === 'ta' ? 'ஏற்கனவே உறுப்பினரா?' : 'Already have a profile?'}
            </Text>
            <TouchableOpacity onPress={onLoginPress} activeOpacity={0.7}>
              <Text style={styles.loginLinkText}>
                {language === 'ta' ? ' உள்நுழைக' : ' Login Here'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.guestBtn}
            onPress={onGuestBrowse}
            activeOpacity={0.8}
          >
            <Text style={styles.guestBtnText}>
              {language === 'ta'
                ? 'வரன்களைப் பார்வையிடுக (விருந்தினராக)'
                : 'Browse Profiles as Guest'}
            </Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  brandCrest: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  langPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 40,
  },
  heroSection: {
    marginTop: Spacing.md,
    alignItems: 'center',
    textAlign: 'center',
  },
  blessingTag: {
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: Colors.sand,
    marginBottom: 10,
  },
  blessingText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.burgundy,
    letterSpacing: 0.4,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.burgundy,
    fontFamily: Typography.fontSerif,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  // Creation Box
  creationBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    ...Shadows.editorial,
  },
  creationBoxTitle: {
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  optionCard: {
    width: (width - 32 - 32 - 16) / 3,
    backgroundColor: Colors.sandLight,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  optionCardActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  optionCardText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  optionCardTextActive: {
    color: Colors.creme,
    fontWeight: '800',
  },
  registerBtn: {
    backgroundColor: Colors.burgundy,
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.subtle,
  },
  registerBtnText: {
    color: Colors.creme,
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  // Trust Badges
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.sandLight,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.burgundy,
    textAlign: 'center',
  },
  trustDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.sandDark,
    opacity: 0.5,
  },
  // Bottom
  bottomActions: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    gap: 12,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alreadyMemberText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  loginLinkText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.burgundy,
    textDecorationLine: 'underline',
  },
  guestBtn: {
    paddingVertical: 8,
  },
  guestBtnText: {
    fontSize: 12.5,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});
