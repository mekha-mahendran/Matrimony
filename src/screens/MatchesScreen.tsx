import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { ProfileCard } from '../components/ProfileCard';
import { Language, Translations } from '../localization';
import {
  calculateTenPoruthams,
  TAMIL_NAKSHATRAMS,
  TAMIL_RASIS,
} from '../services/horoscopeService';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { CurrentUser, MatrimonyProfile, PoruthamResult } from '../types';

interface MatchesScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  onViewHoroscopePorutham: (porutham: PoruthamResult) => void;
  onDailyRecommendationsPress?: () => void;
  unreadCount: number;
  isAdmin: boolean;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onProfilePress,
  onViewHoroscopePorutham,
  onDailyRecommendationsPress,
  unreadCount,
  isAdmin,
}) => {
  const t = Translations[language];
  const [tab, setTab] = useState<'mutual' | 'calculator' | 'shortlist'>('mutual');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<MatrimonyProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<MatrimonyProfile[]>([]);
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [mutualProfiles, setMutualProfiles] = useState<MatrimonyProfile[]>([]);

  // Interactive 10-Porutham Matchmaker State
  const [brideRasi, setBrideRasi] = useState(TAMIL_RASIS[3]); // Kadagam
  const [brideStar, setBrideStar] = useState(TAMIL_NAKSHATRAMS[7]); // Poosam
  const [groomRasi, setGroomRasi] = useState(TAMIL_RASIS[8]); // Dhanusu
  const [groomStar, setGroomStar] = useState(TAMIL_NAKSHATRAMS[18]); // Moolam
  const [poruthamResult, setPoruthamResult] = useState<PoruthamResult | null>(null);

  const loadData = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);

    const mine = await StorageService.getProfileById(user.activeProfileId);
    setCurrentProfile(mine);

    const profiles = await StorageService.getAllProfiles();
    setAllProfiles(profiles);

    const sl = await StorageService.getShortlists();
    setShortlistIds(sl);

    const interests = await StorageService.getInterests();
    const acceptedMutualIds = interests
      .filter(
        i =>
          (i.senderProfileId === user.activeProfileId ||
            i.receiverProfileId === user.activeProfileId) &&
          i.status === 'accepted'
      )
      .map(i =>
        i.senderProfileId === user.activeProfileId ? i.receiverProfileId : i.senderProfileId
      );

    const mutuals = profiles.filter(p => acceptedMutualIds.includes(p.id));
    setMutualProfiles(mutuals);

    // Initial default match calculation
    const res = calculateTenPoruthams(brideRasi, brideStar, groomRasi, groomStar);
    setPoruthamResult(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCalculate = () => {
    const res = calculateTenPoruthams(brideRasi, brideStar, groomRasi, groomStar);
    setPoruthamResult(res);
  };

  const handleToggleShortlist = async (profileId: string) => {
    await StorageService.toggleShortlist(profileId);
    const updated = await StorageService.getShortlists();
    setShortlistIds(updated);
  };

  const shortlistedProfiles = allProfiles.filter(p => shortlistIds.includes(p.id));

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
        title={t.tabMatches}
        subtitle="Mutual connections & 10-Porutham astrology"
      />

      {/* Daily Recommendations Card Shortcut */}
      {onDailyRecommendationsPress && (
        <TouchableOpacity
          style={styles.dailyRecommendationsCard}
          onPress={onDailyRecommendationsPress}
          activeOpacity={0.88}
        >
          <View style={styles.dailyCardContent}>
            <View style={styles.dailyPillTag}>
              <CustomIcon name="sparkles" size={12} color="#D95A1E" />
              <Text style={styles.dailyPillTagText}>DAILY PICKS</Text>
            </View>
            <Text style={styles.dailyCardTitle}>Daily Match Recommendations (1/9)</Text>
            <Text style={styles.dailyCardSub}>Swipe & browse today's curated recommendations</Text>
          </View>
          <View style={styles.dailyCardBtn}>
            <Text style={styles.dailyCardBtnText}>View 9</Text>
            <CustomIcon name="chevron-right" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      )}

      {/* Main Switcher: Mutual | Matchmaker | Shortlisted */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'mutual' && styles.tabBtnActive]}
          onPress={() => setTab('mutual')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tab === 'mutual' && styles.tabTextActive]}>
            Mutual ({mutualProfiles.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'calculator' && styles.tabBtnActive]}
          onPress={() => setTab('calculator')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tab === 'calculator' && styles.tabTextActive]}>
            10-Porutham Engine
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'shortlist' && styles.tabBtnActive]}
          onPress={() => setTab('shortlist')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tab === 'shortlist' && styles.tabTextActive]}>
            Shortlist ({shortlistedProfiles.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: Mutual Matches (Stylist 2-Column Grid - Image 3 Screen 2) */}
      {tab === 'mutual' && (
        <ScrollView contentContainerStyle={styles.matchesScrollContent} showsVerticalScrollIndicator={false}>
          {mutualProfiles.length > 0 ? (
            <View>
              {/* Grouping: Today */}
              <View style={styles.groupHeaderRow}>
                <Text style={styles.groupHeadingText}>Today</Text>
                <View style={styles.groupDividerLine} />
              </View>

              <View style={styles.twoColumnGrid}>
                {mutualProfiles.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.stylistGridCard, idx % 2 === 1 && { transform: [{ rotate: '1.2deg' }] }]}
                    onPress={() => onProfilePress(item)}
                    activeOpacity={0.88}
                  >
                    <Image
                      source={{
                        uri:
                          item.photos?.[0] ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                      }}
                      style={styles.stylistCardPhoto}
                    />
                    <View style={styles.stylistCardScrim} />

                    {/* Bottom Info Overlay */}
                    <View style={styles.stylistCardInfo}>
                      <Text style={styles.stylistCardNameText} numberOfLines={1}>
                        {item.name.split(' ')[0]}, {item.age}
                      </Text>
                      <TouchableOpacity
                        style={styles.gridHeartButton}
                        onPress={() => handleToggleShortlist(item.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <CustomIcon
                          name="heart-filled"
                          size={15}
                          color={shortlistIds.includes(item.id) ? Colors.stylistCoral : '#FFFFFF'}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <CustomIcon name="heart-filled" size={32} color={Colors.stylistCoral} />
              </View>
              <Text style={styles.emptyTitle}>No Mutual Matches Yet</Text>
              <Text style={styles.emptySub}>
                When both you and another candidate like each other, they will appear here in your match grid!
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* TAB 3: Shortlisted Profiles */}
      {tab === 'shortlist' && (
        <FlatList
          data={shortlistedProfiles}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              currentProfile={currentProfile}
              language={language}
              isShortlisted={true}
              onPress={() => onProfilePress(item)}
              onToggleShortlist={() => handleToggleShortlist(item.id)}
              onSendInterest={() => {}}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <CustomIcon name="heart" size={36} color={Colors.dustyPink} />
              <Text style={styles.emptyTitle}>No Shortlisted Profiles</Text>
              <Text style={styles.emptySub}>
                Bookmark profiles you like by tapping the heart icon on any profile card.
              </Text>
            </View>
          }
        />
      )}

      {/* TAB 2: Standalone 10-Porutham Astrology Engine */}
      {tab === 'calculator' && (
        <ScrollView contentContainerStyle={styles.calcScroll} showsVerticalScrollIndicator={false}>
          {/* Header Card */}
          <View style={styles.calcIntroCard}>
            <View style={styles.calcIntroIcon}>
              <CustomIcon name="compass" size={20} color={Colors.burgundy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.calcIntroTitle}>
                {language === 'ta' ? 'தமிழ் 10 பொருத்த ஜோதிட கணிப்பு' : 'Authentic 10-Porutham Matcher'}
              </Text>
              <Text style={styles.calcIntroSub}>
                Based on ancient Tamil astrological rules for Dina, Gana, Mahendra, Yoni, Rasi,
                Rasyadhipathi, Vasya, Rajju, Vedha, and Stree Deergha poruthams.
              </Text>
            </View>
          </View>

          {/* Bride Horoscope Picker */}
          <View style={styles.selectorCard}>
            <Text style={styles.selectorHeader}>👰 Bride (பெண்) Horoscope</Text>

            <Text style={styles.subLabel}>Rasi (ராசி):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_RASIS.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.hChip, brideRasi === r && styles.hChipActive]}
                  onPress={() => setBrideRasi(r)}
                >
                  <Text style={[styles.hChipText, brideRasi === r && styles.hChipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.subLabel, { marginTop: Spacing.sm }]}>
              Nakshatram (நட்சத்திரம்):
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_NAKSHATRAMS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.hChip, brideStar === s && styles.hChipActive]}
                  onPress={() => setBrideStar(s)}
                >
                  <Text style={[styles.hChipText, brideStar === s && styles.hChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Groom Horoscope Picker */}
          <View style={styles.selectorCard}>
            <Text style={styles.selectorHeader}>🤵 Groom (ஆண்) Horoscope</Text>

            <Text style={styles.subLabel}>Rasi (ராசி):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_RASIS.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.hChip, groomRasi === r && styles.hChipActive]}
                  onPress={() => setGroomRasi(r)}
                >
                  <Text style={[styles.hChipText, groomRasi === r && styles.hChipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.subLabel, { marginTop: Spacing.sm }]}>
              Nakshatram (நட்சத்திரம்):
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {TAMIL_NAKSHATRAMS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.hChip, groomStar === s && styles.hChipActive]}
                  onPress={() => setGroomStar(s)}
                >
                  <Text style={[styles.hChipText, groomStar === s && styles.hChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate} activeOpacity={0.88}>
            <Text style={styles.calcBtnText}>Calculate 10-Poruthams ✨</Text>
          </TouchableOpacity>

          {/* Porutham Result Summary */}
          {poruthamResult && (
            <View style={styles.resultCard}>
              <View style={styles.resultTopRow}>
                <View>
                  <Text style={styles.resultScoreNum}>
                    {poruthamResult.totalScore}{' '}
                    <Text style={styles.resultScoreLabel}>/ 10 Poruthams Matched</Text>
                  </Text>
                </View>

                <View
                  style={[
                    styles.verdictPill,
                    poruthamResult.verdict === 'Uthama'
                      ? styles.verdictUthama
                      : poruthamResult.verdict === 'Madhyama'
                      ? styles.verdictMadhyama
                      : styles.verdictAdhama,
                  ]}
                >
                  <Text style={styles.verdictText}>
                    {poruthamResult.verdict} ({poruthamResult.verdictTamil})
                  </Text>
                </View>
              </View>

              <Text style={styles.resultSummary}>{poruthamResult.summary}</Text>

              {/* View Full Report Button */}
              <TouchableOpacity
                style={styles.fullBreakdownBtn}
                onPress={() => onViewHoroscopePorutham(poruthamResult)}
                activeOpacity={0.85}
              >
                <Text style={styles.fullBreakdownBtnText}>
                  View Full 10 Porutham Breakdown Report →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.sandLight,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: Colors.burgundy,
    ...Shadows.subtle,
  },
  tabText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tabTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 90,
  },
  matchesScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 90,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupHeadingText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.stylistTextMuted,
    marginRight: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  groupDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 20,
  },
  stylistGridCard: {
    width: (width - 46) / 2,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.stylistCardSoft,
    elevation: 4,
    shadowColor: Colors.stylistDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  stylistCardPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stylistCardScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(86, 28, 36, 0.28)',
  },
  stylistCardInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stylistCardNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  gridHeartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(86, 28, 36, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.stylistCoralLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: Colors.burgundy,
    marginTop: Spacing.sm,
  },
  emptySub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  calcScroll: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  calcIntroCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dustyPinkLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.editorial,
  },
  calcIntroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcIntroTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  calcIntroSub: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.md,
    ...Shadows.editorial,
  },
  selectorHeader: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: 6,
  },
  subLabel: {
    fontSize: Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  hScroll: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  hChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.sandLight,
    marginRight: 6,
  },
  hChipActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  hChipText: {
    fontSize: Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  hChipTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  calcBtn: {
    backgroundColor: Colors.burgundy,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.editorial,
  },
  calcBtnText: {
    color: Colors.creme,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.editorial,
  },
  resultTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sandLight,
  },
  resultScoreNum: {
    fontFamily: Typography.fontSerif,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  resultScoreLabel: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  verdictPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  verdictUthama: {
    backgroundColor: Colors.dustyPinkLight,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
  },
  verdictMadhyama: {
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  verdictAdhama: {
    backgroundColor: Colors.creme,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  verdictText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  resultSummary: {
    fontSize: Typography.bodyRegular,
    color: Colors.textSecondary,
    marginVertical: Spacing.md,
    lineHeight: 20,
  },
  fullBreakdownBtn: {
    backgroundColor: Colors.creme,
    borderWidth: 1.2,
    borderColor: Colors.burgundy,
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  fullBreakdownBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  // Daily Recommendations Card
  dailyRecommendationsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFE8E0',
    ...Shadows.editorial,
  },
  dailyCardContent: {
    flex: 1,
    paddingRight: 10,
  },
  dailyPillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: '#F3D2C4',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
    gap: 4,
  },
  dailyPillTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D95A1E',
    letterSpacing: 0.4,
  },
  dailyCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#561C24',
  },
  dailyCardSub: {
    fontSize: 12,
    color: '#755F55',
    marginTop: 2,
  },
  dailyCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D95A1E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    gap: 4,
    ...Shadows.subtle,
  },
  dailyCardBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
