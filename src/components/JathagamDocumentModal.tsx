/**
 * Manamaalai Matrimony (மணமாலை) — Jathagam Document Upload & Matching Workflow Modal
 *
 * Feature: Jathagam document upload and basic matching workflow
 *
 * Displays uploaded traditional Tamil Jathagam chart (ராசி & நவாம்சம்),
 * astrologer verification status, Dhasa balance, and quick 10-Porutham
 * compatibility matching workflow.
 */

import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { MOCK_JATHAGAM_DOCUMENT } from '../data/mockOperationsData';
import { JathagamDocument } from '../types';
import { CustomIcon } from './CustomIcon';

const C = {
  vanilla: '#FFFBE2',
  vanillaLight: '#FFFDF7',
  cardBg: '#FFFFFF',
  plumBurgundy: '#49141C',
  limeOlive: '#93A220',
  limeOliveDark: '#6A7513',
  limeOlivePale: '#EEF0D6',
  dustyRose: '#D17575',
  sandBorder: '#E6DFCD',
  textPrimary: '#2A1F1C',
  textSecondary: '#6F625C',
  textMuted: '#968882',
  gold: '#D4A72C',
  white: '#FFFFFF',
};

const SERIF_FONT = Platform.select({ ios: 'Georgia', android: 'serif' }) || 'serif';

interface JathagamDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  document?: JathagamDocument;
  onViewPoruthamReport?: () => void;
}

export const JathagamDocumentModal: React.FC<JathagamDocumentModalProps> = ({
  visible,
  onClose,
  document = MOCK_JATHAGAM_DOCUMENT,
  onViewPoruthamReport,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'verification' | 'upload'>('chart');
  const [uploadedDoc, setUploadedDoc] = useState<JathagamDocument>(document);

  const handleSimulateUpload = () => {
    Alert.alert(
      'Upload Jathagam Document',
      'Select source to upload scanned Jathagam (PDF or Image):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload PDF / Scan',
          onPress: () => {
            const newDoc: JathagamDocument = {
              ...MOCK_JATHAGAM_DOCUMENT,
              id: 'jath-' + Date.now(),
              fileName: 'Original_Jathagam_Scan_Verified.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              fileSize: '2.4 MB',
              verifiedByAstrologer: true,
            };
            setUploadedDoc(newDoc);
            setActiveTab('chart');
            Alert.alert('Upload Successful! 📜', 'Your Jathagam chart has been securely attached and queued for verification.');
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragPill} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleCol}>
              <View style={styles.badgeRow}>
                <View style={styles.astrologerBadge}>
                  <CustomIcon name="sparkles" size={12} color={C.limeOliveDark} />
                  <Text style={styles.astrologerBadgeText}>Astrologer Verified</Text>
                </View>
              </View>
              <Text style={styles.sheetTitle}>ஜாதகக் குறிப்பு & பொருத்தம்</Text>
              <Text style={styles.sheetSub}>Authentic Vedic Horoscope Chart & Match Verification</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <CustomIcon name="close" size={18} color={C.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'chart' && styles.tabItemActive]}
              onPress={() => setActiveTab('chart')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabItemText, activeTab === 'chart' && styles.tabItemTextActive]}>
                Rasi Chart (ராசி)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'verification' && styles.tabItemActive]}
              onPress={() => setActiveTab('verification')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabItemText, activeTab === 'verification' && styles.tabItemTextActive]}>
                Astrologer Note
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'upload' && styles.tabItemActive]}
              onPress={() => setActiveTab('upload')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabItemText, activeTab === 'upload' && styles.tabItemTextActive]}>
                Upload New
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {activeTab === 'chart' && (
              <View>
                {/* Document Metadata Bar */}
                <View style={styles.docInfoBar}>
                  <View style={styles.docIconBox}>
                    <CustomIcon name="education" size={20} color={C.plumBurgundy} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.docFileName} numberOfLines={1}>
                      {uploadedDoc.fileName}
                    </Text>
                    <Text style={styles.docFileMeta}>
                      Size: {uploadedDoc.fileSize} • Uploaded: {uploadedDoc.uploadDate}
                    </Text>
                  </View>
                  <View style={styles.verifiedCheckBadge}>
                    <CustomIcon name="check" size={12} color={C.white} />
                    <Text style={styles.verifiedCheckText}>Verified</Text>
                  </View>
                </View>

                {/* South Indian 12-House Traditional Chart Grid */}
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>ராசி கட்டம் (South Indian Rasi Chart)</Text>
                  <View style={styles.gridBox}>
                    {/* 4x4 Grid Representation */}
                    <View style={styles.gridRow}>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>மீனம்</Text><Text style={styles.grahaText}>சனி</Text></View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>மேஷம்</Text><Text style={styles.grahaText}>-</Text></View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>ரிஷபம்</Text><Text style={styles.grahaText}>ராகு</Text></View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>மிதுனம்</Text><Text style={styles.grahaText}>சூரி, செவ்</Text></View>
                    </View>
                    <View style={styles.gridRow}>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>கும்பம்</Text><Text style={styles.grahaText}>-</Text></View>
                      {/* Center Medallion 2x2 space */}
                      <View style={styles.gridCenter}>
                        <Text style={styles.centerOm}>ௐ</Text>
                        <Text style={styles.centerTitle}>சுப ஜாதகம்</Text>
                        <Text style={styles.centerSub}>லக்னம்: {uploadedDoc.lagnam}</Text>
                      </View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>கடகம்</Text><Text style={styles.grahaText}>புதன், சுக்</Text></View>
                    </View>
                    <View style={styles.gridRow}>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>மகரம்</Text><Text style={styles.grahaText}>கேது</Text></View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>சிம்மம்</Text><Text style={styles.grahaText}>சந்திரன்</Text></View>
                    </View>
                    <View style={styles.gridRow}>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>தனுசு</Text><Text style={styles.grahaText}>-</Text></View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>விருச்சிகம்</Text><Text style={styles.grahaText}>-</Text></View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>துலாம்</Text><Text style={styles.grahaText}>லக், குரு</Text></View>
                      <View style={styles.gridCell}><Text style={styles.cellHouse}>கன்னி</Text><Text style={styles.grahaText}>-</Text></View>
                    </View>
                  </View>
                </View>

                {/* Key Astrological Coordinates */}
                <View style={styles.keyDetailsCard}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Lagnam (லக்னம்):</Text>
                    <Text style={styles.detailValue}>{uploadedDoc.lagnam}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dhasa Balance (திசா இருப்பு):</Text>
                    <Text style={styles.detailValue}>{uploadedDoc.dhasaBalance}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Chevvai Dosham (செவ்வாய் தோஷம்):</Text>
                    <Text style={[styles.detailValue, { color: C.limeOliveDark, fontWeight: '700' }]}>
                      முற்றிலும் இல்லை (None)
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'verification' && (
              <View style={styles.astrologerNoteCard}>
                <View style={styles.astroHeader}>
                  <View style={styles.astroAvatar}>
                    <CustomIcon name="crown" size={22} color={C.gold} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.astroName}>{uploadedDoc.astrologerName}</Text>
                    <Text style={styles.astroTitle}>Senior Astrological Advisor • Manamaalai</Text>
                  </View>
                </View>

                <View style={styles.quoteBox}>
                  <Text style={styles.quoteText}>
                    "{uploadedDoc.astrologerNotes}"
                  </Text>
                </View>

                <View style={styles.sealRow}>
                  <View style={styles.sealCircle}>
                    <Text style={styles.sealText}>SEAL OF AUTHENTICITY</Text>
                  </View>
                  <Text style={styles.sealSub}>
                    Verified against Tamil Panchangam & birth coordinates.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'upload' && (
              <View style={styles.uploadCard}>
                <View style={styles.uploadDashedBox}>
                  <CustomIcon name="sparkles" size={32} color={C.limeOlive} />
                  <Text style={styles.uploadPromptTitle}>Attach Jathagam Document</Text>
                  <Text style={styles.uploadPromptSub}>
                    Upload scanned PDF, Horary chart image, or horoscope photocopy
                  </Text>
                  <TouchableOpacity style={styles.browseBtn} onPress={handleSimulateUpload} activeOpacity={0.8}>
                    <CustomIcon name="briefcase" size={16} color={C.white} />
                    <Text style={styles.browseBtnText}>Choose File from Device</Text>
                  </TouchableOpacity>
                  <Text style={styles.uploadFormatNote}>Supported: PDF, JPG, PNG up to 10 MB</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer CTA */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.workflowBtn}
              onPress={() => {
                onClose();
                if (onViewPoruthamReport) onViewPoruthamReport();
              }}
              activeOpacity={0.85}
            >
              <CustomIcon name="heart-filled" size={16} color={C.white} />
              <Text style={styles.workflowBtnText}>View 10-Porutham Match Report</Text>
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
    maxHeight: '90%',
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.sandBorder,
  },
  headerTitleCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  astrologerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.limeOlivePale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  astrologerBadgeText: {
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
    fontSize: 11.5,
    color: C.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F5F0E6',
    marginLeft: 10,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.sandBorder,
  },
  tabItemActive: {
    backgroundColor: C.plumBurgundy,
    borderColor: C.plumBurgundy,
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textPrimary,
  },
  tabItemTextActive: {
    color: C.white,
    fontWeight: '700',
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  docInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 14,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F7F0E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  docFileMeta: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  },
  verifiedCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.limeOliveDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedCheckText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.white,
    marginLeft: 3,
  },
  chartContainer: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 14,
  },
  chartTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 14,
    fontWeight: '700',
    color: C.plumBurgundy,
    textAlign: 'center',
    marginBottom: 10,
  },
  gridBox: {
    borderWidth: 1.5,
    borderColor: C.plumBurgundy,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  gridCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#E6DFCD',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFEFA',
  },
  cellHouse: {
    fontSize: 9.5,
    fontWeight: '700',
    color: C.textSecondary,
    marginBottom: 2,
  },
  grahaText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  gridCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF0',
    borderWidth: 0.5,
    borderColor: '#E6DFCD',
    padding: 6,
  },
  centerOm: {
    fontSize: 18,
    color: C.gold,
    fontWeight: 'bold',
  },
  centerTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  centerSub: {
    fontSize: 9.5,
    color: C.textSecondary,
    marginTop: 2,
  },
  keyDetailsCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0EBE0',
  },
  detailLabel: {
    fontSize: 12.5,
    color: C.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12.5,
    color: C.textPrimary,
    fontWeight: '600',
  },
  astrologerNoteCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.sandBorder,
  },
  astroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  astroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF8DD',
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  astroName: {
    fontSize: 14,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  astroTitle: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  },
  quoteBox: {
    backgroundColor: '#FFFDF5',
    borderLeftWidth: 3,
    borderLeftColor: C.gold,
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  quoteText: {
    fontSize: 12.5,
    color: C.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  sealRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sealCircle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: C.limeOlivePale,
    borderWidth: 1,
    borderColor: C.limeOlive,
    marginRight: 10,
  },
  sealText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.limeOliveDark,
  },
  sealSub: {
    fontSize: 11,
    color: C.textSecondary,
    flex: 1,
  },
  uploadCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.sandBorder,
  },
  uploadDashedBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: C.limeOlive,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    backgroundColor: C.limeOlivePale,
  },
  uploadPromptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.plumBurgundy,
    marginTop: 10,
  },
  uploadPromptSub: {
    fontSize: 12,
    color: C.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 16,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.plumBurgundy,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  browseBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.white,
  },
  uploadFormatNote: {
    fontSize: 10.5,
    color: C.textMuted,
    marginTop: 10,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.sandBorder,
  },
  workflowBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: C.plumBurgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.plumBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
  },
  workflowBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: C.white,
  },
});

