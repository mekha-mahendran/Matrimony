/**
 * Manamaalai Matrimony (மணமாலை) — Relationship Manager Portal Screen
 *
 * Feature: Relationship manager portal
 *
 * Dedicated assisted matchmaking experience connecting the client with
 * their personal Senior Relationship Manager, viewing handpicked varans,
 * tracking family meetings, and receiving VIP matchmaking support.
 */

import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
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
import { Header } from '../components/Header';
import {
  MOCK_RELATIONSHIP_MANAGERS,
  MOCK_RM_HANDPICKED_MATCHES,
} from '../data/mockOperationsData';
import { Language } from '../localization';
import { MatrimonyProfile, RelationshipManager, RMHandpickedMatch } from '../types';

const C = {
  vanilla: '#FFFBE2',
  vanillaLight: '#FFFDF7',
  cardBg: '#FFFFFF',
  plumBurgundy: '#49141C',
  plumBurgundyDark: '#350D14',
  limeOlive: '#93A220',
  limeOliveDark: '#6A7513',
  limeOlivePale: '#EEF0D6',
  dustyRose: '#D17575',
  dustyRosePale: '#FCEFEF',
  sandBorder: '#E6DFCD',
  textPrimary: '#2A1F1C',
  textSecondary: '#6F625C',
  textMuted: '#968882',
  gold: '#D4A72C',
  white: '#FFFFFF',
};

const SERIF_FONT = Platform.select({ ios: 'Georgia', android: 'serif' }) || 'serif';

interface RelationshipManagerPortalProps {
  language: Language;
  onToggleLanguage?: () => void;
  onBack: () => void;
  onViewProfile?: (profileId: string) => void;
}

export const RelationshipManagerPortalScreen: React.FC<RelationshipManagerPortalProps> = ({
  language,
  onToggleLanguage,
  onBack,
  onViewProfile,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const rm: RelationshipManager = MOCK_RELATIONSHIP_MANAGERS[0];
  const [matches, setMatches] = useState<RMHandpickedMatch[]>(MOCK_RM_HANDPICKED_MATCHES);

  const handleOpenWhatsApp = () => {
    const msg = encodeURIComponent(
      `Vanakkam Smt. Meenakshi madam, I am contacting you regarding my Manamaalai Assisted Matchmaking profile. Could we discuss the recent curated matches?`
    );
    Linking.openURL(`whatsapp://send?phone=${rm.whatsapp}&text=${msg}`).catch(() => {
      Alert.alert('Contact RM', `Call your Relationship Manager directly at ${rm.phone}`);
    });
  };

  const handleRequestMeeting = (match: RMHandpickedMatch) => {
    Alert.alert(
      'Schedule Family Meeting',
      `Would you like Smt. Meenakshi to coordinate a formal family discussion or temple meeting with ${match.candidateName}'s parents?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Meeting',
          onPress: () => {
            Alert.alert(
              'Request Queued 🌺',
              `Your Relationship Manager has been notified. She will initiate contact with ${match.candidateName}'s family within 24 business hours.`
            );
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
        onToggleLanguage={onToggleLanguage || (() => {})}
        showBack={true}
        onBackPress={onBack}
        title={isTa ? 'உறவு மேலாளர் போர்டல்' : 'Relationship Manager Portal'}
        subtitle={isTa ? 'அர்ப்பணிப்பு உதவியுடன் வரன் தேடல்' : 'Personal Assisted Matchmaker'}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Dedicated RM Hero Profile Card */}
        <View style={styles.rmCard}>
          <View style={styles.rmHeaderRow}>
            <View style={styles.rmAvatarBox}>
              <Image source={{ uri: rm.photo }} style={styles.rmAvatar} />
              <View style={styles.rmVerifiedBadge}>
                <CustomIcon name="crown" size={10} color={C.white} />
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.rmNameRow}>
                <Text style={styles.rmName}>{rm.name}</Text>
                <View style={styles.ratingBadge}>
                  <CustomIcon name="star" size={11} color={C.gold} />
                  <Text style={styles.ratingText}>{rm.rating}</Text>
                </View>
              </View>

              <Text style={styles.rmRole}>{rm.role}</Text>
              <Text style={styles.rmBranch}>{rm.branch}</Text>
              <Text style={styles.rmSpecialization}>🎯 {rm.specialization}</Text>
            </View>
          </View>

          {/* RM KPI Stats Bar */}
          <View style={styles.rmStatsRow}>
            <View style={styles.rmStatCol}>
              <Text style={styles.rmStatNum}>{rm.experienceYears} Yrs</Text>
              <Text style={styles.rmStatLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.rmStatCol}>
              <Text style={styles.rmStatNum}>{rm.successfulMarriagesCount}+</Text>
              <Text style={styles.rmStatLabel}>Kalyanams Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.rmStatCol}>
              <Text style={styles.rmStatNum}>{rm.activeClientsCount}</Text>
              <Text style={styles.rmStatLabel}>Active Clients</Text>
            </View>
          </View>

          {/* Quick Contact Actions */}
          <View style={styles.rmContactButtonsRow}>
            <TouchableOpacity
              style={styles.rmCallBtn}
              onPress={() => Linking.openURL(`tel:${rm.phone}`)}
              activeOpacity={0.7}
            >
              <CustomIcon name="phone" size={15} color={C.plumBurgundy} />
              <Text style={styles.rmCallBtnText}>Call RM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rmWpBtn}
              onPress={handleOpenWhatsApp}
              activeOpacity={0.8}
            >
              <CustomIcon name="whatsapp" size={16} color={C.white} />
              <Text style={styles.rmWpBtnText}>WhatsApp Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assisted Matchmaking Status Highlights */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {isTa ? 'உங்களுக்காக தேர்வு செய்யப்பட்ட வரன்கள்' : 'RM Handpicked Varans'}
          </Text>
          <Text style={styles.matchCountPill}>{matches.length} Curated</Text>
        </View>

        {/* Handpicked Match Cards */}
        {matches.map((item) => (
          <View key={item.id} style={styles.matchCard}>
            <View style={styles.matchTopRow}>
              <Image source={{ uri: item.candidatePhoto }} style={styles.matchPhoto} />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.matchNameRow}>
                  <Text style={styles.matchName}>{item.candidateName}</Text>
                  <View style={styles.poruthamTag}>
                    <Text style={styles.poruthamTagText}>{item.matchScore}% Match</Text>
                  </View>
                </View>

                <Text style={styles.matchMeta}>
                  {item.candidateAge} yrs • {item.candidateCity}
                </Text>
                <Text style={styles.matchJob} numberOfLines={1}>
                  {item.candidateProfession}
                </Text>

                {/* Status pill */}
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusPill,
                      item.status === 'temple_meeting_fixed' && { backgroundColor: '#FFF6D9' },
                      item.status === 'intro_call_scheduled' && { backgroundColor: C.limeOlivePale },
                      item.status === 'horoscope_exchanged' && { backgroundColor: '#EEF2FF' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        item.status === 'temple_meeting_fixed' && { color: '#9E6E00' },
                        item.status === 'intro_call_scheduled' && { color: C.limeOliveDark },
                        item.status === 'horoscope_exchanged' && { color: '#3730A3' },
                      ]}
                    >
                      {item.status === 'temple_meeting_fixed'
                        ? '🛕 Temple Meeting Fixed'
                        : item.status === 'intro_call_scheduled'
                        ? '📞 Family Call Scheduled'
                        : '📜 Horoscope Exchanged'}
                    </Text>
                  </View>

                  {item.scheduledDate && (
                    <Text style={styles.scheduledDateText}>{item.scheduledDate}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* RM Notes Box */}
            <View style={styles.rmRemarkBox}>
              <Text style={styles.rmRemarkHeading}>
                💬 Personal Note from Smt. Meenakshi:
              </Text>
              <Text style={styles.rmRemarkText}>{item.rmNotes}</Text>
            </View>

            {/* Match Action Buttons */}
            <View style={styles.matchCardActions}>
              <TouchableOpacity
                style={styles.viewVarBtn}
                onPress={() => onViewProfile && onViewProfile(item.profileId)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewVarBtnText}>View Full Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.requestMeetBtn}
                onPress={() => handleRequestMeeting(item)}
                activeOpacity={0.85}
              >
                <CustomIcon name="crown" size={14} color={C.white} />
                <Text style={styles.requestMeetBtnText}>Arrange Meeting</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Request Special Search Banner */}
        <View style={styles.customSearchBanner}>
          <CustomIcon name="sparkles" size={20} color={C.gold} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.customSearchTitle}>Need Specific Community or Star Search?</Text>
            <Text style={styles.customSearchSub}>
              Ask Smt. Meenakshi to cross-reference offline marriage bureau rosters and sub-caste registries.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.inquireBtn}
            onPress={handleOpenWhatsApp}
            activeOpacity={0.8}
          >
            <Text style={styles.inquireBtnText}>Ask RM</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.vanilla,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  rmCard: {
    backgroundColor: C.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 16,
    shadowColor: C.plumBurgundy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  rmHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rmAvatarBox: {
    position: 'relative',
    width: 68,
    height: 68,
  },
  rmAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: C.limeOlive,
  },
  rmVerifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.plumBurgundy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.white,
  },
  rmNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rmName: {
    fontFamily: SERIF_FONT,
    fontSize: 16,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E6E00',
  },
  rmRole: {
    fontSize: 11.5,
    fontWeight: '600',
    color: C.limeOliveDark,
    marginTop: 2,
  },
  rmBranch: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 1,
  },
  rmSpecialization: {
    fontSize: 11,
    color: C.textPrimary,
    marginTop: 4,
    fontWeight: '500',
  },
  rmStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FAF7ED',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    marginBottom: 12,
  },
  rmStatCol: {
    alignItems: 'center',
  },
  rmStatNum: {
    fontSize: 14,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  rmStatLabel: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: C.sandBorder,
  },
  rmContactButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rmCallBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: C.plumBurgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rmCallBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  rmWpBtn: {
    flex: 1.5,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rmWpBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.white,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 16,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  matchCountPill: {
    fontSize: 11.5,
    fontWeight: '700',
    color: C.limeOliveDark,
    backgroundColor: C.limeOlivePale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  matchCard: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 14,
    shadowColor: C.plumBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  matchTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  matchPhoto: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F5EFE6',
  },
  matchNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: C.plumBurgundy,
    flex: 1,
  },
  poruthamTag: {
    backgroundColor: C.limeOlivePale,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  poruthamTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.limeOliveDark,
  },
  matchMeta: {
    fontSize: 11.5,
    color: C.textSecondary,
    marginTop: 2,
  },
  matchJob: {
    fontSize: 11.5,
    color: C.textPrimary,
    fontWeight: '500',
    marginTop: 1,
  },
  statusRow: {
    marginTop: 5,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  scheduledDateText: {
    fontSize: 10.5,
    color: C.plumBurgundy,
    fontWeight: '600',
    marginTop: 2,
  },
  rmRemarkBox: {
    backgroundColor: '#FFFDF5',
    borderLeftWidth: 3,
    borderLeftColor: C.limeOlive,
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  rmRemarkHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: C.limeOliveDark,
    marginBottom: 2,
  },
  rmRemarkText: {
    fontSize: 12,
    color: C.textPrimary,
    lineHeight: 17,
  },
  matchCardActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0EBE0',
    gap: 8,
  },
  viewVarBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: C.plumBurgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewVarBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  requestMeetBtn: {
    flex: 1.5,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.plumBurgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  requestMeetBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.white,
  },
  customSearchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5E8',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6DCC8',
    marginTop: 6,
  },
  customSearchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  customSearchSub: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  inquireBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: C.plumBurgundy,
  },
  inquireBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: C.white,
  },
});

