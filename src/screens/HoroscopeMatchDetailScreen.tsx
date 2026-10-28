import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { Language, Translations } from '../localization';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { PoruthamResult } from '../types';

interface HoroscopeDetailProps {
  porutham: PoruthamResult;
  language: Language;
  onBack: () => void;
}

export const HoroscopeMatchDetailScreen: React.FC<HoroscopeDetailProps> = ({
  porutham,
  language,
  onBack,
}) => {
  const t = Translations[language];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title="10-Porutham Match Report"
        subtitle="ஜாதகப் பத்து பொருத்த அறிக்கை"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.pairRow}>
            <View style={styles.candidateCol}>
              <Text style={styles.candidateRole}>Bride (மணமகள்)</Text>
              <Text style={styles.candidateStar}>{porutham.brideNakshatram}</Text>
              <Text style={styles.candidateRasi}>{porutham.brideRasi}</Text>
            </View>

            <View style={styles.knotWrap}>
              <CustomIcon name="heart-filled" size={24} color={Colors.burgundy} />
              <Text style={styles.knotText}>பொருத்தம்</Text>
            </View>

            <View style={[styles.candidateCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.candidateRole}>Groom (மணமகன்)</Text>
              <Text style={styles.candidateStar}>{porutham.groomNakshatram}</Text>
              <Text style={styles.candidateRasi}>{porutham.groomRasi}</Text>
            </View>
          </View>

          {/* Big Score Box */}
          <View style={styles.scoreBox}>
            <View>
              <Text style={styles.bigScoreNum}>
                {porutham.totalScore} / {porutham.maxScore}
              </Text>
              <Text style={styles.scoreSub}>
                {language === 'ta' ? porutham.verdictTamil : `${porutham.verdict} Porutham`}
              </Text>
            </View>

            <View
              style={[
                styles.verdictBadge,
                porutham.verdict === 'Uthama'
                  ? styles.verdictUthama
                  : porutham.verdict === 'Madhyama'
                  ? styles.verdictMadhyama
                  : styles.verdictAdhama,
              ]}
            >
              <Text style={styles.verdictBadgeText}>
                {porutham.verdict === 'Uthama' ? 'உத்தமம்' : 'மத்திமம்'}
              </Text>
            </View>
          </View>

          <Text style={styles.summaryText}>{porutham.summary}</Text>
        </View>

        {/* 10 Porutham Checks List */}
        <Text style={styles.sectionHeader}>Individual Porutham Breakdown</Text>

        {porutham.poruthams.map((item, idx) => {
          return (
            <View
              key={idx}
              style={[
                styles.itemCard,
                item.name === 'Rajju Porutham' && styles.rajjuCardHighlight,
              ]}
            >
              <View style={styles.itemTopRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemIndex}>{idx + 1}.</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemTamilName}>({item.tamilName})</Text>
                  </View>
                  <Text style={styles.importanceTag}>{item.importance} Indicator</Text>
                </View>

                <View
                  style={[
                    styles.matchBadge,
                    item.isCompatible ? styles.matchBadgeYes : styles.matchBadgeNo,
                  ]}
                >
                  <CustomIcon
                    name={item.isCompatible ? 'check' : 'close'}
                    size={13}
                    color={item.isCompatible ? Colors.success : Colors.danger}
                  />
                  <Text
                    style={[
                      styles.matchBadgeText,
                      item.isCompatible ? styles.matchBadgeTextYes : styles.matchBadgeTextNo,
                    ]}
                  >
                    {item.isCompatible ? 'பொருத்தம் உண்டு' : 'பொருத்தம் இல்லை'}
                  </Text>
                </View>
              </View>

              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          );
        })}

        {/* Traditional Astrological Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Astrological Guidance Note</Text>
          <Text style={styles.disclaimerText}>{porutham.disclaimer}</Text>
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
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.md,
    ...Shadows.editorial,
  },
  pairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sandLight,
  },
  candidateCol: {
    flex: 1,
  },
  candidateRole: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  candidateStar: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    marginTop: 2,
  },
  candidateRasi: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  knotWrap: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  knotText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.burgundy,
    marginTop: 2,
  },
  scoreBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sandLight,
  },
  bigScoreNum: {
    fontFamily: Typography.fontSerif,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  scoreSub: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  verdictBadge: {
    paddingHorizontal: 14,
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
  verdictBadgeText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  summaryText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  sectionHeader: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.burgundy,
    marginVertical: Spacing.sm,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  rajjuCardHighlight: {
    borderColor: Colors.burgundy,
    borderWidth: 1.5,
    backgroundColor: Colors.sandLight,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemIndex: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    marginRight: 4,
  },
  itemName: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  itemTamilName: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  importanceTag: {
    fontSize: Typography.tiny,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  matchBadgeYes: {
    backgroundColor: Colors.successLight,
  },
  matchBadgeNo: {
    backgroundColor: Colors.dangerLight,
  },
  matchBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  matchBadgeTextYes: {
    color: Colors.success,
  },
  matchBadgeTextNo: {
    color: Colors.danger,
  },
  itemDescription: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  disclaimerBox: {
    backgroundColor: Colors.sandLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginTop: Spacing.md,
  },
  disclaimerTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
