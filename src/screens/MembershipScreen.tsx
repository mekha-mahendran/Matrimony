import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { MEMBERSHIP_PLANS } from '../data/mockProfiles';
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { CurrentUser, MembershipPlan } from '../types';

interface MembershipScreenProps {
  language: Language;
  onBack: () => void;
}

export const MembershipScreen: React.FC<MembershipScreenProps> = ({ language, onBack }) => {
  const t = Translations[language];
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan>(MEMBERSHIP_PLANS[2]); // Default Gold
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const loadUser = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);
    const plan = MEMBERSHIP_PLANS.find(p => p.id === user.membershipTier) || MEMBERSHIP_PLANS[2];
    setSelectedPlan(plan);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSimulatePayment = async (plan: MembershipPlan) => {
    if (plan.id === 'free') {
      Alert.alert('Current Plan', 'Free membership is already active.');
      return;
    }

    setProcessing(true);
    setTimeout(async () => {
      try {
        const updated = await StorageService.upgradeMembership(plan.id);
        setCurrentUser(updated);
        setPaymentSuccess(true);
        Alert.alert(
          'Payment Successful! 🌟',
          `Congratulations! Your account has been upgraded to ${plan.name}. You now have ${updated.contactsViewedRemaining} verified contact views available.`,
          [{ text: 'Great', onPress: () => setPaymentSuccess(false) }]
        );
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title={t.membershipPlans}
        subtitle="Secure marriage packages & contact unlocks"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Active Plan Card */}
        {currentUser && (
          <View style={styles.activePlanCard}>
            <View style={styles.activePlanHeader}>
              <View>
                <Text style={styles.activePlanLabel}>Your Active Subscription</Text>
                <Text style={styles.activePlanName}>
                  {currentUser.membershipTier.toUpperCase()} Kalyanam
                </Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ACTIVE</Text>
              </View>
            </View>

            <View style={styles.quotaRow}>
              <View style={styles.quotaItem}>
                <Text style={styles.quotaVal}>{currentUser.contactsViewedRemaining}</Text>
                <Text style={styles.quotaLabel}>Contact Numbers Left</Text>
              </View>
              <View style={styles.quotaDivider} />
              <View style={styles.quotaItem}>
                <Text style={styles.quotaVal}>{currentUser.interestsRemaining}</Text>
                <Text style={styles.quotaLabel}>Interests Quota Left</Text>
              </View>
            </View>
          </View>
        )}

        {/* Plan Cards List */}
        <Text style={styles.sectionHeader}>Choose Your Matrimony Package</Text>

        {MEMBERSHIP_PLANS.map(p => {
          const isSelected = selectedPlan.id === p.id;
          const isCurrent = currentUser?.membershipTier === p.id;

          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.planCard,
                isSelected && styles.planCardSelected,
                p.id === 'gold' && styles.goldHighlightCard,
              ]}
              onPress={() => setSelectedPlan(p)}
              activeOpacity={0.9}
            >
              {p.id === 'gold' && (
                <View style={styles.popularRibbon}>
                  <Text style={styles.popularRibbonText}>RECOMMENDED PACKAGE</Text>
                </View>
              )}

              <View style={styles.planCardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{p.name}</Text>
                  <Text style={styles.planTamilName}>{p.tamilName}</Text>
                  <Text style={styles.durationText}>{p.durationMonths} Months Validity</Text>
                </View>

                <View style={styles.priceCol}>
                  <Text style={styles.priceText}>
                    {p.priceInr === 0 ? 'FREE' : `₹${p.priceInr}`}
                  </Text>
                  {p.originalPriceInr > 0 && (
                    <Text style={styles.originalPrice}>₹{p.originalPriceInr}</Text>
                  )}
                </View>
              </View>

              {/* Plan Benefits List */}
              <View style={styles.featuresList}>
                {p.features.map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <CustomIcon name="check" size={13} color={Colors.burgundy} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.selectBtn,
                  isCurrent && styles.selectBtnCurrent,
                  p.id === 'gold' && !isCurrent && styles.selectBtnGold,
                ]}
                onPress={() => handleSimulatePayment(p)}
                disabled={isCurrent || processing}
                activeOpacity={0.88}
              >
                {processing && selectedPlan.id === p.id ? (
                  <ActivityIndicator color={Colors.creme} />
                ) : (
                  <Text
                    style={[
                      styles.selectBtnText,
                      isCurrent && styles.selectBtnTextCurrent,
                    ]}
                  >
                    {isCurrent
                      ? 'Current Active Plan'
                      : p.priceInr === 0
                      ? 'Select Free'
                      : `Upgrade to ${p.name} →`}
                  </Text>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* Safe & Secure Payment Note */}
        <View style={styles.safeBox}>
          <CustomIcon name="shield" size={18} color={Colors.burgundy} />
          <Text style={styles.safeBoxText}>
            100% Verified profiles. Payments encrypted via 256-bit bank grade security with instant
            quota activation.
          </Text>
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
  activePlanCard: {
    backgroundColor: Colors.burgundy,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.editorial,
  },
  activePlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 216, 196, 0.25)',
  },
  activePlanLabel: {
    fontSize: Typography.caption,
    color: Colors.sandLight,
    fontWeight: '600',
  },
  activePlanName: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleLarge,
    fontWeight: '700',
    color: Colors.creme,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: Colors.dustyPink,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  activeBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.burgundy,
    letterSpacing: 0.5,
  },
  quotaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  quotaItem: {
    flex: 1,
    alignItems: 'center',
  },
  quotaDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(232, 216, 196, 0.25)',
  },
  quotaVal: {
    fontFamily: Typography.fontSerif,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.creme,
  },
  quotaLabel: {
    fontSize: Typography.caption,
    color: Colors.sandLight,
    marginTop: 2,
  },
  sectionHeader: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: Spacing.md,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.editorial,
  },
  planCardSelected: {
    borderColor: Colors.burgundy,
    borderWidth: 1.5,
  },
  goldHighlightCard: {
    borderColor: Colors.burgundy,
    borderWidth: 1.5,
  },
  popularRibbon: {
    backgroundColor: Colors.dustyPink,
    paddingVertical: 3,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: BorderRadius.md,
  },
  popularRibbonText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.burgundy,
    letterSpacing: 0.5,
  },
  planCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sandLight,
  },
  planName: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  planTamilName: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  durationText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleLarge,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  originalPrice: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  featuresList: {
    paddingVertical: Spacing.md,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  selectBtn: {
    backgroundColor: Colors.burgundy,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  selectBtnGold: {
    backgroundColor: Colors.burgundy,
  },
  selectBtnCurrent: {
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  selectBtnText: {
    color: Colors.creme,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
  },
  selectBtnTextCurrent: {
    color: Colors.burgundy,
  },
  safeBox: {
    flexDirection: 'row',
    backgroundColor: Colors.sandLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  safeBoxText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
