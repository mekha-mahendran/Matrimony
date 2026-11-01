/**
 * Manamaalai Matrimony (மணமாலை) — AI-Assisted Profile Description Generator Modal
 *
 * Feature: AI-Assisted Profile Description Generation
 *
 * Provides intelligent, high-response matrimony bio drafts tailored to the user's
 * career, education, community values, and family background.
 *
 * Tone choices:
 * - Traditional & Family-Oriented (பாரம்பரியம்)
 * - Modern Professional (நவீன சிந்தனை)
 * - Cultural & Spiritual (பண்பாடு & ஆன்மிகம்)
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from './CustomIcon';

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

export type BioTone = 'traditional' | 'modern' | 'cultural';
export type BioLanguage = 'ta' | 'en' | 'bilingual';

interface AIBioGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyBio: (generatedBio: string) => void;
  candidateContext?: {
    name?: string;
    gender?: 'bride' | 'groom' | string;
    qualification?: string;
    occupation?: string;
    currentCity?: string;
    nativeDistrict?: string;
    familyValues?: string;
    hobbies?: string[];
  };
}

export const AIBioGeneratorModal: React.FC<AIBioGeneratorModalProps> = ({
  visible,
  onClose,
  onApplyBio,
  candidateContext,
}) => {
  const [selectedTone, setSelectedTone] = useState<BioTone>('traditional');
  const [selectedLang, setSelectedLang] = useState<BioLanguage>('bilingual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBioIndex, setSelectedBioIndex] = useState(0);

  const name = candidateContext?.name || 'Candidate';
  const role = candidateContext?.occupation || 'Software Engineer';
  const city = candidateContext?.currentCity || 'Chennai';
  const native = candidateContext?.nativeDistrict || 'Thanjavur';
  const edu = candidateContext?.qualification || 'B.Tech / MBA';

  // Realistic AI Draft Generation Presets
  const generateDrafts = (): { title: string; text: string; tags: string[] }[] => {
    if (selectedTone === 'traditional') {
      return [
        {
          title: 'Deep Roots & Traditional Values (குடும்பப் பண்பாடு)',
          text:
            `Vanakkam! I am ${name}, currently working as a ${role} based in ${city}, hailing from a traditional and closely-knit family rooted in ${native}. I hold a ${edu} degree and place immense value on mutual respect, cultural traditions, and family harmony. In my personal life, I enjoy Carnatic music, temple visits, and quiet weekends with family. Looking for an understanding, cultured life partner who values traditional family warmth and shared spiritual milestones.`,
          tags: ['Family First', 'Cultural Harmony', 'Traditional Values'],
        },
        {
          title: 'Tamil Family Values (தமிழ் பண்பாட்டு வழியில்)',
          text:
            `வணக்கம்! நான் ${city}-யில் ${role}-ஆக பணிபுரிந்து வருகிறேன். எங்களது பூர்வீகம் ${native}. பாரம்பரியமும், நற்பண்புகளும் நிறைந்த குடும்பப் பின்னணியைக் கொண்டவன். என் தொழில் வாழ்க்கையோடு குடும்ப மதிப்பீடுகளையும் சரிசமமாக முன்னிறுத்துபவன். வாழ்க்கைத் துணையாக வரும் நபர் நல்ல பண்புகளுடனும், குடும்ப ஒற்றுமையை போற்றுபவராகவும் இருக்க விழைகிறேன்.`,
          tags: ['தமிழ் பண்பாடு', 'குடும்ப ஒற்றுமை', 'மரியாதை'],
        },
        {
          title: 'Bilingual Warmth (தமிழ் & ஆங்கில சங்கமம்)',
          text:
            `Vanakkam. Born and brought up in ${native}, currently serving as ${role} in ${city} with a ${edu} educational foundation.\n\n` +
            `எங்கள் குடும்பம் பாரம்பரியத்தையும், ஆன்மிக நெறிகளையும் மதிக்கும் அமைதியான குடும்பமாகும். Looking for a partner who cherishes traditional Tamil rituals while pursuing personal and professional aspirations together.`,
          tags: ['Bilingual', 'Spiritual Harmony', 'Balanced'],
        },
      ];
    } else if (selectedTone === 'modern') {
      return [
        {
          title: 'Ambitious & Modern Professional (நவீன சிந்தனை)',
          text:
            `Hello there! I am ${name}, working as a ${role} in ${city} with a background in ${edu}. I am an optimistic, growth-oriented professional who loves exploring new technologies, weekend road trips, and fitness. I believe marriage is an equal partnership founded on transparent communication, mutual goals, and individual personal growth. Looking for an ambitious, intellectually curious life partner to share life's adventures with.`,
          tags: ['Equal Partnership', 'Growth Mindset', 'Career-Focused'],
        },
        {
          title: 'Balanced Modern Outlook (நவீனமும் இயல்பும்)',
          text:
            `Professional working as a ${role} in ${city}. Passionate about continuous learning, modern living, and weekend travels. While my outlook on life is progressive and liberal, I stay deeply grounded in my Tamil roots from ${native}. Seeking a companion who is friendly, broad-minded, and believes in cheering each other on.`,
          tags: ['Progressive', 'Travel Lover', 'Companionship'],
        },
        {
          title: 'Work-Life Harmony (அன்பான புரிதல்)',
          text:
            `Hi! I hold a ${edu} and work in ${city} as a ${role}. Outside work, I love filter coffee, reading books, and indie movies. Looking for someone grounded, humorous, and passionate about life, who values both modern independence and family bonds.`,
          tags: ['Independent', 'Fun-Loving', 'Work-Life Balance'],
        },
      ];
    } else {
      return [
        {
          title: 'Spiritual & Arts Orientation (கலை & ஆன்மிகம்)',
          text:
            `Vanakkam. I am ${name}, working in ${city} as a ${role}. Hailing from ${native}, I have a profound inclination towards classical arts, Carnatic music, and Vedic traditions. I believe a blissful marriage is built on satvik living, mutual reverence, and peace of mind. Seeking a companion who appreciates cultural arts and spiritual values.`,
          tags: ['Carnatic Arts', 'Temple Visits', 'Satvik Lifestyle'],
        },
        {
          title: 'Cultural Heritage (மரபு & கலாச்சாரம்)',
          text:
            `கலை, கலாச்சாரம் மற்றும் ஆன்மிகத்தில் ஈடுபாடு கொண்ட ${role}. பூர்வீகம் ${native}. வாழ்க்கையில் நேர்மறையான எண்ணங்களும், அமைதியான குடும்ப சூழலும் கொண்ட துணையை எதிர்பார்க்கிறேன்.`,
          tags: ['மரபு', 'ஆன்மிகம்', 'நேர்மறை சிந்தனை'],
        },
        {
          title: 'Quiet Simplicity (அமைதியான எளிய வாழ்க்கை)',
          text:
            `A simple, grounded individual with a ${edu} degree, working as ${role}. I value kindness, gratitude, and clean living above all else. Looking for a sweet, like-minded life partner to build a serene and auspicious household together.`,
          tags: ['Simplicity', 'Gratitude', 'Peaceful'],
        },
      ];
    }
  };

  const currentDrafts = generateDrafts();
  const activeBio = currentDrafts[selectedBioIndex];

  const handleSimulateGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedBioIndex(0);
    }, 600);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Sheet Header */}
          <View style={styles.dragPill} />

          <View style={styles.headerRow}>
            <View style={styles.headerTitleCol}>
              <View style={styles.sparkleBadge}>
                <CustomIcon name="sparkles" size={13} color={C.gold} />
                <Text style={styles.sparkleBadgeText}>AI Assisted Profile Bio</Text>
              </View>
              <Text style={styles.sheetTitle}>சுயவிவர விளக்கம் இயற்றி</Text>
              <Text style={styles.sheetSub}>
                Generate high-interest Tamil matrimony bios in seconds
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <CustomIcon name="close" size={18} color={C.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Tone Selector */}
            <Text style={styles.sectionLabel}>Select Desired Tone (எழுத்து நடை):</Text>
            <View style={styles.tonePillRow}>
              {[
                { key: 'traditional' as BioTone, label: 'பாரம்பரியம்', sub: 'Traditional' },
                { key: 'modern' as BioTone, label: 'நவீன சிந்தனை', sub: 'Modern' },
                { key: 'cultural' as BioTone, label: 'கலை & ஆன்மிகம்', sub: 'Spiritual' },
              ].map(t => {
                const isActive = selectedTone === t.key;
                return (
                  <TouchableOpacity
                    key={t.key}
                    style={[styles.tonePill, isActive && styles.tonePillActive]}
                    onPress={() => {
                      setSelectedTone(t.key);
                      handleSimulateGeneration();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tonePillText, isActive && styles.tonePillTextActive]}>
                      {t.label}
                    </Text>
                    <Text style={[styles.tonePillSub, isActive && styles.tonePillSubActive]}>
                      {t.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Generated Suggestions Carousel */}
            <View style={styles.suggestionsHeader}>
              <Text style={styles.sectionLabel}>AI Generated Drafts ({currentDrafts.length} Options):</Text>
              {isGenerating && <ActivityIndicator size="small" color={C.limeOlive} />}
            </View>

            {currentDrafts.map((draft, idx) => {
              const isSelected = selectedBioIndex === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.draftCard, isSelected && styles.draftCardSelected]}
                  onPress={() => setSelectedBioIndex(idx)}
                  activeOpacity={0.8}
                >
                  <View style={styles.draftCardHeader}>
                    <View style={styles.radioIndicator}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.draftTitle, isSelected && styles.draftTitleSelected]}>
                      {draft.title}
                    </Text>
                  </View>

                  <Text style={styles.draftBodyText}>{draft.text}</Text>

                  <View style={styles.tagRow}>
                    {draft.tags.map((tag, tIdx) => (
                      <View key={tIdx} style={styles.tagChip}>
                        <Text style={styles.tagChipText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.regenerateBtn}
              onPress={handleSimulateGeneration}
              activeOpacity={0.7}
            >
              <CustomIcon name="sparkles" size={16} color={C.limeOliveDark} />
              <Text style={styles.regenerateBtnText}>Regenerate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                if (activeBio) {
                  onApplyBio(activeBio.text);
                  onClose();
                }
              }}
              activeOpacity={0.85}
            >
              <CustomIcon name="check" size={16} color={C.white} />
              <Text style={styles.applyBtnText}>Apply to Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 12, 18, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: C.vanillaLight,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#49141C',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 16,
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.sandBorder,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.sandBorder,
  },
  headerTitleCol: {
    flex: 1,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.limeOlivePale,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  sparkleBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: C.limeOliveDark,
    marginLeft: 4,
  },
  sheetTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  sheetSub: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F5F0E6',
    marginLeft: 10,
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 8,
  },
  tonePillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tonePill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: C.sandBorder,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tonePillActive: {
    borderColor: C.limeOlive,
    backgroundColor: C.limeOlivePale,
  },
  tonePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textPrimary,
  },
  tonePillTextActive: {
    color: C.limeOliveDark,
  },
  tonePillSub: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 2,
  },
  tonePillSubActive: {
    color: C.limeOliveDark,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  draftCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: C.sandBorder,
    padding: 14,
    marginBottom: 12,
  },
  draftCardSelected: {
    borderColor: C.plumBurgundy,
    backgroundColor: '#FFFDF9',
    shadowColor: C.plumBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  draftCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.plumBurgundy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.plumBurgundy,
  },
  draftTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
    flex: 1,
  },
  draftTitleSelected: {
    color: C.plumBurgundy,
  },
  draftBodyText: {
    fontSize: 13,
    color: C.textPrimary,
    lineHeight: 19,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: '#F5F0E4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagChipText: {
    fontSize: 10.5,
    color: C.textSecondary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.sandBorder,
    gap: 10,
  },
  regenerateBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: C.limeOlive,
    backgroundColor: C.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  regenerateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.limeOliveDark,
  },
  applyBtn: {
    flex: 1.5,
    height: 46,
    borderRadius: 12,
    backgroundColor: C.plumBurgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: C.plumBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
  },
  applyBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: C.white,
  },
});

