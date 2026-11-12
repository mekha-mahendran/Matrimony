/**
 * Manamaalai Matrimony — Modern "Choose Your Plan" Screen
 *
 * Implements the exact design from the reference screenshot:
 * - Header: Circular white back button (←) and centered title "Choose Your Plan"
 * - Card 1 (Free):
 *     - Purple header: "Free" + "Your current plan"
 *     - Features list with purple circular checkmark icons:
 *         - Basic profile creation and browsing
 *         - Limited daily matches.
 *         - Standard messaging with matches.
 *         - Access to some basic features.
 * - Card 2 ($9.99 /month):
 *     - Purple header: "$9.99 /month" + "Go Pro & Get more Benefits"
 *     - Features list:
 *         - All features of the Free Plan.
 *         - Unlimited daily matches.
 *         - Enhanced profile visibility.
 *         - Ad-free experience.
 *     - Full-width royal purple button: "Select Plan"
 * - Card 3 ($69.99 /Year):
 *     - Purple header: "$69.99 /Year" + "Go Pro & Get more Benefits"
 *     - Features list:
 *         - All features of the Monthly Plan.
 *         - Unlimited daily matches & instant chat.
 *         - Top search priority & verified badge.
 *         - Dedicated matchmaking support.
 *     - Full-width royal purple button: "Select Plan"
 */

import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { Language } from '../localization';

const BRAND_PURPLE = '#6D53F5';

export interface PlanItem {
  id: string;
  name: string;
  price: string;
  period?: string;
  subtitle: string;
  isCurrent?: boolean;
  features: string[];
}

interface ChoosePlanScreenProps {
  language?: Language;
  onBack: () => void;
  onSelectPlan: (plan: PlanItem) => void;
}

export const ChoosePlanScreen: React.FC<ChoosePlanScreenProps> = ({
  language,
  onBack,
  onSelectPlan,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const plans: PlanItem[] = [
    {
      id: 'free',
      name: isTa ? 'இலவசம்' : 'Free',
      price: isTa ? 'இலவசம்' : 'Free',
      subtitle: isTa ? 'உங்கள் தற்போதைய திட்டம்' : 'Your current plan',
      isCurrent: true,
      features: isTa
        ? [
            'அடிப்படை சுயவிவர உருவாக்கம் மற்றும் உலாவுதல்',
            'வரையறுக்கப்பட்ட தினசரி பொருத்தங்கள்.',
            'பொருத்தங்களுடன் நிலையான செய்தி அனுப்புதல்.',
            'சில அடிப்படை அம்சங்களுக்கான அணுகல்.',
          ]
        : [
            'Basic profile creation and browsing',
            'Limited daily matches.',
            'Standard messaging with matches.',
            'Access to some basic features.',
          ],
    },
    {
      id: 'monthly',
      name: isTa ? 'மாதாந்திரம்' : 'Monthly',
      price: '$9.99',
      period: isTa ? '/மாதம்' : '/month',
      subtitle: isTa ? 'ப்ரோ பெற்று கூடுதல் நன்மைகளை அனுபவியுங்கள்' : 'Go Pro & Get more Benefits',
      features: isTa
        ? [
            'இலவச திட்டத்தின் அனைத்து அம்சங்களும்.',
            'வரம்பற்ற தினசரி பொருத்தங்கள்.',
            'மேம்படுத்தப்பட்ட சுயவிவர தெரிவுநிலை.',
            'விளம்பரமில்லா அனுபவம்.',
          ]
        : [
            'All features of the Free Plan.',
            'Unlimited daily matches.',
            'Enhanced profile visibility.',
            'Ad-free experience.',
          ],
    },
    {
      id: 'yearly',
      name: isTa ? 'வருடாந்திரம்' : 'Yearly',
      price: '$69.99',
      period: isTa ? '/ஆண்டு' : '/Year',
      subtitle: isTa ? 'ப்ரோ பெற்று கூடுதல் நன்மைகளை அனுபவியுங்கள்' : 'Go Pro & Get more Benefits',
      features: isTa
        ? [
            'மாதாந்திர திட்டத்தின் அனைத்து அம்சங்களும்.',
            'வரம்பற்ற தினசரி பொருத்தங்கள் & உடனடி அரட்டை.',
            'முன்னுரிமை தேடல் & சரிபார்க்கப்பட்ட பேட்ஜ்.',
            'பிரத்யேக வரன் பொருத்துதல் உதவி.',
          ]
        : [
            'All features of the Monthly Plan.',
            'Unlimited daily matches & instant chat.',
            'Top search priority & verified badge.',
            'Dedicated matchmaking support.',
          ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Header (Circular Back Button & Title "Choose Your Plan") ──── */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.4}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isTa ? 'உங்கள் திட்டத்தைத் தேர்வுசெய்க' : 'Choose Your Plan'}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 40, 60) },
        ]}
      >
        {plans.map(plan => (
          <View key={plan.id} style={styles.planCard}>
            {/* Top Purple Header Banner */}
            <View style={styles.cardHeaderBanner}>
              <View style={styles.priceRow}>
                <Text style={styles.planPriceText}>{plan.price}</Text>
                {plan.period ? (
                  <Text style={styles.planPeriodText}> {plan.period}</Text>
                ) : null}
              </View>
              <Text style={styles.planSubtitleText}>{plan.subtitle}</Text>
            </View>

            {/* Card Body with Features */}
            <View style={styles.cardBody}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  {/* Purple Circular Check Icon */}
                  <View style={styles.checkIconWrap}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke={BRAND_PURPLE} strokeWidth={2} />
                      <Path
                        d="M8 12l2.5 2.5L16 9.5"
                        stroke={BRAND_PURPLE}
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}

              {/* Action Button (Paid plans only) */}
              {!plan.isCurrent && (
                <TouchableOpacity
                  style={styles.selectPlanBtn}
                  onPress={() => onSelectPlan(plan)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.selectPlanBtnText}>
                    {isTa ? 'திட்டத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Plan'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1F24',
    textAlign: 'center',
  },

  /* Scroll Content */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  /* Plan Card */
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#785DF7',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderBanner: {
    backgroundColor: BRAND_PURPLE,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPriceText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planPeriodText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  planSubtitleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.88,
    marginTop: 4,
  },

  /* Card Body */
  cardBody: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkIconWrap: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#26262B',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },

  /* Select Plan Button */
  selectPlanBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  selectPlanBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

