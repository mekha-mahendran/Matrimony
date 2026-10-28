import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Language, Translations } from '../localization';
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '../theme';
import { SearchFilterState } from '../types';
import { CustomIcon } from './CustomIcon';

interface FilterModalProps {
  visible: boolean;
  filters: SearchFilterState;
  language: Language;
  onClose: () => void;
  onApply: (filters: SearchFilterState) => void;
  onReset: () => void;
  totalMatchesCount: number;
}

const COMMON_CASTES = [
  'Mudaliar',
  'Pillai',
  'Chettiar',
  'Brahmin - Iyer',
  'Brahmin - Iyengar',
  'Gounder',
  'Nadar',
  'Vanniyar',
  'Thevar',
  'Viswakarma',
  'Naidu',
  'Intercaste',
];

const DISTRICTS = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tirunelveli',
  'Erode',
  'Vellore',
  'Thanjavur',
  'Kanchipuram',
  'Cuddalore',
];

const EDUCATIONS = ['B.Tech', 'M.Tech', 'MS', 'MBA', 'CA', 'MBBS/MD', 'B.Arch', 'PhD'];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  language,
  onClose,
  onApply,
  onReset,
  totalMatchesCount,
}) => {
  const t = Translations[language];
  const [localFilters, setLocalFilters] = useState<SearchFilterState>(filters);

  const toggleCaste = (c: string) => {
    const list = localFilters.caste ? [...localFilters.caste] : [];
    const idx = list.indexOf(c);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(c);
    }
    setLocalFilters({ ...localFilters, caste: list });
  };

  const toggleDistrict = (d: string) => {
    const list = localFilters.district ? [...localFilters.district] : [];
    const idx = list.indexOf(d);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(d);
    }
    setLocalFilters({ ...localFilters, district: list });
  };

  const toggleEducation = (e: string) => {
    const list = localFilters.education ? [...localFilters.education] : [];
    const idx = list.indexOf(e);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(e);
    }
    setLocalFilters({ ...localFilters, education: list });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t.filter}</Text>
              <Text style={styles.subtitle}>
                {totalMatchesCount} {t.resultsFound}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <CustomIcon name="close" size={20} color={Colors.burgundy} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Gender Toggle */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Looking For (வரன் வகை)</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    localFilters.gender === 'bride' && styles.optionChipActive,
                  ]}
                  onPress={() => setLocalFilters({ ...localFilters, gender: 'bride' })}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      localFilters.gender === 'bride' && styles.optionChipTextActive,
                    ]}
                  >
                    Bride (மணமகள்)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    localFilters.gender === 'groom' && styles.optionChipActive,
                  ]}
                  onPress={() => setLocalFilters({ ...localFilters, gender: 'groom' })}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      localFilters.gender === 'groom' && styles.optionChipTextActive,
                    ]}
                  >
                    Groom (மணமகன்)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Age Range quick options */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>
                {t.ageRange}: {localFilters.ageMin} - {localFilters.ageMax} Yrs
              </Text>
              <View style={styles.pillRow}>
                {[
                  { min: 21, max: 26, label: '21 - 26' },
                  { min: 25, max: 30, label: '25 - 30' },
                  { min: 28, max: 35, label: '28 - 35' },
                  { min: 32, max: 42, label: '32 - 42' },
                ].map((item, idx) => {
                  const isSelected =
                    localFilters.ageMin === item.min && localFilters.ageMax === item.max;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.rangePill, isSelected && styles.rangePillActive]}
                      onPress={() =>
                        setLocalFilters({ ...localFilters, ageMin: item.min, ageMax: item.max })
                      }
                    >
                      <Text
                        style={[styles.rangePillText, isSelected && styles.rangePillTextActive]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Verified & Photo Toggles */}
            <View style={styles.sectionCard}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleTitle}>{t.verifiedOnly}</Text>
                  <Text style={styles.toggleDesc}>Show members with Aadhaar verified profiles</Text>
                </View>
                <Switch
                  value={localFilters.verifiedOnly}
                  onValueChange={val => setLocalFilters({ ...localFilters, verifiedOnly: val })}
                  trackColor={{ false: Colors.sand, true: Colors.burgundy }}
                  thumbColor={Colors.creme}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleTitle}>{t.withPhotoOnly}</Text>
                  <Text style={styles.toggleDesc}>Profiles with verified portrait photos</Text>
                </View>
                <Switch
                  value={localFilters.withPhotoOnly}
                  onValueChange={val => setLocalFilters({ ...localFilters, withPhotoOnly: val })}
                  trackColor={{ false: Colors.sand, true: Colors.burgundy }}
                  thumbColor={Colors.creme}
                />
              </View>

              <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleTitle}>{t.horoscopeCompatible}</Text>
                  <Text style={styles.toggleDesc}>
                    Filter by 7+ Auspicious Poruthams with your horoscope
                  </Text>
                </View>
                <Switch
                  value={localFilters.horoscopePoruthamOnly}
                  onValueChange={val =>
                    setLocalFilters({ ...localFilters, horoscopePoruthamOnly: val })
                  }
                  trackColor={{ false: Colors.sand, true: Colors.burgundy }}
                  thumbColor={Colors.creme}
                />
              </View>
            </View>

            {/* Caste / Community Chips */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>{t.casteFilter}</Text>
              <View style={styles.wrapGrid}>
                {COMMON_CASTES.map((c, i) => {
                  const active = localFilters.caste?.includes(c);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleCaste(c)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* District / City Chips */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>{t.cityFilter}</Text>
              <View style={styles.wrapGrid}>
                {DISTRICTS.map((d, i) => {
                  const active = localFilters.district?.includes(d);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleDistrict(d)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Education Chips */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>{t.educationFilter}</Text>
              <View style={styles.wrapGrid}>
                {EDUCATIONS.map((e, i) => {
                  const active = localFilters.education?.includes(e);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleEducation(e)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {e}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                onReset();
                onClose();
              }}
            >
              <Text style={styles.resetBtnText}>{t.reset}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                onApply(localFilters);
                onClose();
              }}
            >
              <Text style={styles.applyBtnText}>
                {t.apply} ({totalMatchesCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.creme,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand,
    backgroundColor: Colors.creme,
  },
  title: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleLarge,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  subtitle: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.sandLight,
  },
  scrollBody: {
    padding: Spacing.md,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  sectionLabel: {
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: Spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
  },
  optionChipActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  optionChipText: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  optionChipTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  rangePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    backgroundColor: Colors.creme,
  },
  rangePillActive: {
    backgroundColor: Colors.dustyPinkLight,
    borderColor: Colors.dustyPink,
  },
  rangePillText: {
    fontSize: Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rangePillTextActive: {
    fontWeight: '700',
    color: Colors.burgundy,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sandLight,
  },
  toggleTextWrap: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleTitle: {
    fontSize: Typography.bodyRegular,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  toggleDesc: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  wrapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.creme,
  },
  chipActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  chipText: {
    fontSize: Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
    gap: Spacing.md,
    backgroundColor: Colors.creme,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.2,
    borderColor: Colors.burgundy,
    alignItems: 'center',
    backgroundColor: Colors.creme,
  },
  resetBtnText: {
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.burgundy,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.creme,
  },
});
