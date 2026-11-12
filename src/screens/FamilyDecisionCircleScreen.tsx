/**
 * Manamaalai Matrimony (மணமாலை) — Family-Assisted Matchmaking Workflow Screen
 *
 * Feature: Family-assisted matchmaking workflow
 *
 * Enables the joint family (Parents, Siblings, Elders) to participate
 * in reviewing shortlisted candidates, recording family opinions,
 * coordinating temple meetings, and sharing WhatsApp packages.
 */

import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { INITIAL_PROFILES } from '../data/mockProfiles';
import { MOCK_FAMILY_NOTES } from '../data/mockOperationsData';
import { Language } from '../localization';
import { FamilyDecisionNote, MatrimonyProfile } from '../types';

const C = {
  vanilla: '#FFFBE2',
  vanillaLight: '#FFFDF7',
  cardBg: '#FFFFFF',
  plumBurgundy: '#49141C',
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

interface FamilyDecisionCircleScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onBack: () => void;
  onViewProfile?: (profile: MatrimonyProfile) => void;
}

export const FamilyDecisionCircleScreen: React.FC<FamilyDecisionCircleScreenProps> = ({
  language,
  onToggleLanguage,
  onBack,
  onViewProfile,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [notes, setNotes] = useState<FamilyDecisionNote[]>(MOCK_FAMILY_NOTES);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('mm-b-01');
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);

  // New Note State
  const [noteRole, setNoteRole] = useState<'Father' | 'Mother' | 'Brother' | 'Sister' | 'Elder'>('Father');
  const [noteStatus, setNoteStatus] = useState<FamilyDecisionNote['status']>('approved');
  const [noteText, setNoteText] = useState('');

  const targetProfile = INITIAL_PROFILES.find(p => p.id === selectedProfileId) || INITIAL_PROFILES[1];
  const profileNotes = notes.filter(n => n.profileId === selectedProfileId);

  const handleAddNote = () => {
    if (!noteText.trim()) {
      Alert.alert('Note required', 'Please enter a family comment or decision remark.');
      return;
    }

    const newNote: FamilyDecisionNote = {
      id: 'fn-' + Date.now(),
      profileId: selectedProfileId,
      authorRole: noteRole,
      authorName: `${noteRole} (${noteRole === 'Father' ? 'Appa' : noteRole === 'Mother' ? 'Amma' : 'Family'})`,
      status: noteStatus,
      noteText: noteText.trim(),
      createdAt: 'Just now',
    };

    setNotes([newNote, ...notes]);
    setNoteText('');
    setIsNoteModalVisible(false);
    Alert.alert('Decision Recorded 🌺', 'Family remark and review status have been recorded.');
  };

  const handleShareFamilyPackage = async () => {
    try {
      const shareMsg =
        `🌺 *Manamaalai Matrimony — Family Decision Circle* 🌺\n\n` +
        `Candidate: ${targetProfile.name} (${targetProfile.matrimonyId})\n` +
        `Age / Height: ${targetProfile.age} yrs • ${targetProfile.lifestyle.heightFeet}\n` +
        `Education: ${targetProfile.educationCareer.qualification}\n` +
        `Profession: ${targetProfile.educationCareer.occupation} • ${targetProfile.currentCity}\n` +
        `Native: ${targetProfile.nativeDistrict} | Community: ${targetProfile.caste}\n` +
        `Horoscope: ${targetProfile.horoscope.rasi} Rasi, ${targetProfile.horoscope.nakshatram} Star\n\n` +
        `Family Decision: Appa & Amma have reviewed this profile. Please check and share your thoughts.`;

      await Share.share({
        message: shareMsg,
        title: `Manamaalai Profile: ${targetProfile.name}`,
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={onToggleLanguage || (() => {})}
        showBack={true}
        onBackPress={onBack}
        title={isTa ? 'குடும்ப முடிவுக் குழு' : 'Family Decision Circle'}
        subtitle={isTa ? 'குடும்பத்தினர் இணைந்து வரன் தேர்வு' : 'Assisted Family Matchmaking'}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Family Circle Members Header Bar */}
        <View style={styles.familyMembersCard}>
          <View style={styles.familyCardTop}>
            <View style={styles.familyIconBadge}>
              <CustomIcon name="garland" size={18} color={C.limeOliveDark} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.familyTitle}>
                {isTa ? 'உங்கள் குடும்ப ஆலோசகர்கள்' : 'Your Family Review Circle'}
              </Text>
              <Text style={styles.familySub}>
                {isTa ? '4 உறுப்பினர்கள் இணைக்கப்பட்டுள்ளனர்' : '4 Family Members Active'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addMemberBtn}
              onPress={() => Alert.alert('Invite Family Member', 'Send an SMS/WhatsApp invite link to your parents or relatives to join your Family Decision Circle.')}
              activeOpacity={0.7}
            >
              <Text style={styles.addMemberBtnText}>+ Invite</Text>
            </TouchableOpacity>
          </View>

          {/* Member Chips */}
          <View style={styles.memberChipsRow}>
            {[
              { role: 'Appa (Father)', name: 'Senthilnathan', active: true },
              { role: 'Amma (Mother)', name: 'Meenakshi', active: true },
              { role: 'Brother', name: 'Praveen', active: true },
              { role: 'Periyappa (Elder)', name: 'Ramanathan', active: false },
            ].map((m, idx) => (
              <View key={idx} style={styles.memberPill}>
                <View style={[styles.onlineDot, !m.active && { backgroundColor: C.textMuted }]} />
                <Text style={styles.memberPillText}>{m.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Selected Candidate Under Review */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {isTa ? 'ஆலோசனைக்குரிய வரன்' : 'Candidate Under Review'}
          </Text>
          <TouchableOpacity
            style={styles.shareWpBtn}
            onPress={handleShareFamilyPackage}
            activeOpacity={0.8}
          >
            <CustomIcon name="share" size={14} color={C.white} />
            <Text style={styles.shareWpText}>Share on WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.candidateReviewCard}>
          <View style={styles.candidateMainRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitial}>{targetProfile.name.charAt(0)}</Text>
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.candidateNameRow}>
                <Text style={styles.candidateName}>{targetProfile.name}</Text>
                <View style={styles.verifiedPill}>
                  <CustomIcon name="check" size={10} color={C.white} />
                </View>
              </View>

              <Text style={styles.candidateMeta}>
                {targetProfile.age} yrs • {targetProfile.lifestyle.heightFeet} • {targetProfile.caste}
              </Text>
              <Text style={styles.candidateJob} numberOfLines={1}>
                {targetProfile.educationCareer.occupation} • {targetProfile.currentCity}
              </Text>

              {/* Match verdict pill */}
              <View style={styles.poruthamPill}>
                <CustomIcon name="sparkles" size={12} color={C.limeOliveDark} />
                <Text style={styles.poruthamPillText}>8.5/10 Porutham • உத்தமப் பொருத்தம்</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions for this Candidate */}
          <View style={styles.candidateActionsRow}>
            <TouchableOpacity
              style={styles.actionBtnOutline}
              onPress={() => onViewProfile && onViewProfile(targetProfile)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionBtnOutlineText}>Full Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnFilled}
              onPress={() => setIsNoteModalVisible(true)}
              activeOpacity={0.85}
            >
              <CustomIcon name="sparkles" size={14} color={C.white} />
              <Text style={styles.actionBtnFilledText}>+ Record Family Vote / Note</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Family Discussion & Decision Feed */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {isTa ? 'குடும்பக் கருத்துக்கள் & முடிவுகள்' : 'Family Review Notes & Votes'}
          </Text>
          <Text style={styles.notesCountText}>{profileNotes.length} Notes</Text>
        </View>

        {profileNotes.map((note) => {
          const isApproved = note.status === 'approved' || note.status === 'temple_meeting_fixed';
          return (
            <View key={note.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <View style={styles.authorBadge}>
                  <CustomIcon name="user" size={14} color={C.plumBurgundy} />
                  <Text style={styles.authorText}>{note.authorName}</Text>
                </View>

                {/* Status tag */}
                <View
                  style={[
                    styles.statusTag,
                    note.status === 'approved' && { backgroundColor: C.limeOlivePale },
                    note.status === 'temple_meeting_fixed' && { backgroundColor: '#FFF6D9' },
                    note.status === 'under_review' && { backgroundColor: '#F0EEF8' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      note.status === 'approved' && { color: C.limeOliveDark },
                      note.status === 'temple_meeting_fixed' && { color: '#9E6E00' },
                      note.status === 'under_review' && { color: '#5B4EB3' },
                    ]}
                  >
                    {note.status === 'approved'
                      ? '✓ Approved (ஏற்கப்பட்டது)'
                      : note.status === 'temple_meeting_fixed'
                      ? '🛕 Temple Meet Fixed'
                      : '⏳ Under Review'}
                  </Text>
                </View>
              </View>

              <Text style={styles.noteContentText}>{note.noteText}</Text>
              <Text style={styles.noteTimeText}>{note.createdAt}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Add Family Note Modal */}
      <Modal visible={isNoteModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.noteSheet}>
            <Text style={styles.noteSheetTitle}>Record Family Decision Note</Text>
            <Text style={styles.noteSheetSub}>
              Share parents' thoughts, horoscope verification, or scheduled meeting details.
            </Text>

            {/* Author Role */}
            <Text style={styles.inputLabel}>Posting As (குடும்ப உறுப்பினர்):</Text>
            <View style={styles.rolePillsRow}>
              {(['Father', 'Mother', 'Brother', 'Sister', 'Elder'] as const).map(role => (
                <TouchableOpacity
                  key={role}
                  style={[styles.rolePill, noteRole === role && styles.rolePillActive]}
                  onPress={() => setNoteRole(role)}
                >
                  <Text style={[styles.rolePillText, noteRole === role && styles.rolePillTextActive]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Decision Status */}
            <Text style={styles.inputLabel}>Family Decision Verdict:</Text>
            <View style={styles.rolePillsRow}>
              {[
                { key: 'approved' as const, label: '✓ Approved' },
                { key: 'temple_meeting_fixed' as const, label: '🛕 Temple Meet' },
                { key: 'under_review' as const, label: '⏳ Inquiring' },
              ].map(st => (
                <TouchableOpacity
                  key={st.key}
                  style={[styles.rolePill, noteStatus === st.key && styles.rolePillActive]}
                  onPress={() => setNoteStatus(st.key)}
                >
                  <Text style={[styles.rolePillText, noteStatus === st.key && styles.rolePillTextActive]}>
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Note text */}
            <Text style={styles.inputLabel}>Comments & Family Feedback:</Text>
            <TextInput
              style={styles.noteTextInput}
              multiline={true}
              numberOfLines={3}
              placeholder="e.g. Spoke with girl's father. Astrologer checked and approved. Ready to proceed."
              placeholderTextColor={C.textMuted}
              value={noteText}
              onChangeText={setNoteText}
            />

            <View style={styles.sheetButtonsRow}>
              <TouchableOpacity
                style={styles.sheetCancelBtn}
                onPress={() => setIsNoteModalVisible(false)}
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetSubmitBtn} onPress={handleAddNote}>
                <Text style={styles.sheetSubmitText}>Save Note</Text>
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
    backgroundColor: C.vanilla,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  familyMembersCard: {
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
  familyCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  familyIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.limeOlivePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  familySub: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  },
  addMemberBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: C.limeOlivePale,
    borderWidth: 1,
    borderColor: C.limeOlive,
  },
  addMemberBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: C.limeOliveDark,
  },
  memberChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F2EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.limeOlive,
    marginRight: 5,
  },
  memberPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 16,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  shareWpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  shareWpText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.white,
  },
  candidateReviewCard: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 16,
    shadowColor: C.plumBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  candidateMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: C.plumBurgundy,
    padding: 2,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#FFFDF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: C.plumBurgundy,
    fontFamily: SERIF_FONT,
  },
  candidateNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  candidateName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  verifiedPill: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.limeOliveDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  candidateMeta: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  candidateJob: {
    fontSize: 11.5,
    color: C.textPrimary,
    fontWeight: '500',
    marginTop: 1,
  },
  poruthamPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.limeOlivePale,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    gap: 4,
  },
  poruthamPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.limeOliveDark,
  },
  candidateActionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0EBE0',
    gap: 8,
  },
  actionBtnOutline: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: C.plumBurgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutlineText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  actionBtnFilled: {
    flex: 2,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.plumBurgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnFilledText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.white,
  },
  notesCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textSecondary,
  },
  noteCard: {
    backgroundColor: C.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  noteContentText: {
    fontSize: 13,
    color: C.textPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  noteTimeText: {
    fontSize: 10.5,
    color: C.textMuted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(35, 12, 18, 0.6)',
    justifyContent: 'flex-end',
  },
  noteSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  noteSheetTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  noteSheetSub: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 6,
  },
  rolePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.sandBorder,
    backgroundColor: '#F7F6F1',
  },
  rolePillActive: {
    backgroundColor: C.plumBurgundy,
    borderColor: C.plumBurgundy,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textPrimary,
  },
  rolePillTextActive: {
    color: C.white,
    fontWeight: '700',
  },
  noteTextInput: {
    borderWidth: 1,
    borderColor: C.sandBorder,
    borderRadius: 10,
    backgroundColor: '#FFFEFA',
    padding: 10,
    fontSize: 13.5,
    color: C.textPrimary,
    height: 72,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  sheetButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sheetCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: C.sandBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textSecondary,
  },
  sheetSubmitBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.plumBurgundy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.white,
  },
});

