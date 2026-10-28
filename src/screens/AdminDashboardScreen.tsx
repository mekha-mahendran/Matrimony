import React, { useEffect, useState } from 'react';
import {
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
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { MatrimonyProfile } from '../types';

interface AdminScreenProps {
  language: Language;
  onBack: () => void;
  onViewProfile: (profile: MatrimonyProfile) => void;
}

export const AdminDashboardScreen: React.FC<AdminScreenProps> = ({
  language,
  onBack,
  onViewProfile,
}) => {
  const t = Translations[language];
  const [profiles, setProfiles] = useState<MatrimonyProfile[]>([]);
  const [tab, setTab] = useState<'pending' | 'all' | 'reports'>('pending');

  const loadData = async () => {
    const list = await StorageService.getAllProfiles();
    setProfiles(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMembers = profiles.length;
  const brideCount = profiles.filter(p => p.gender === 'bride').length;
  const groomCount = profiles.filter(p => p.gender === 'groom').length;
  const pendingCount = profiles.filter(p => !p.isVerified).length;
  const verifiedCount = profiles.filter(p => p.isVerified).length;

  const handleVerify = async (profileId: string) => {
    await StorageService.verifyProfile(profileId);
    Alert.alert('Member Verified', 'Aadhaar trust badge awarded to this profile.');
    await loadData();
  };

  const handleSuspend = async (profileId: string) => {
    Alert.alert(
      'Suspend Account',
      'Are you sure you want to suspend this member for violation of terms?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          style: 'destructive',
          onPress: async () => {
            await StorageService.suspendProfile(profileId);
            await loadData();
          },
        },
      ]
    );
  };

  const pendingProfiles = profiles.filter(p => !p.isVerified);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title={t.adminPortal}
        subtitle="Tamil Matrimony Moderation Center"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* KPI Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalMembers}</Text>
            <Text style={styles.statLabel}>{t.totalMembers}</Text>
            <Text style={styles.statSub}>
              {brideCount} Brides • {groomCount} Grooms
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: Colors.burgundy }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>{t.pendingVerifications}</Text>
            <Text style={styles.statSub}>Aadhaar & ID reviews</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: Colors.success }]}>{verifiedCount}</Text>
            <Text style={styles.statLabel}>Verified Members</Text>
            <Text style={styles.statSub}>Trust badge awarded</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: Colors.burgundy }]}>
              {profiles.filter(p => p.membershipTier !== 'free').length}
            </Text>
            <Text style={styles.statLabel}>{t.activeSubscriptions}</Text>
            <Text style={styles.statSub}>Gold & Platinum VIP</Text>
          </View>
        </View>

        {/* Tab Filter */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'pending' && styles.tabBtnActive]}
            onPress={() => setTab('pending')}
          >
            <Text style={[styles.tabBtnText, tab === 'pending' && styles.tabBtnTextActive]}>
              Pending Verification ({pendingProfiles.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'all' && styles.tabBtnActive]}
            onPress={() => setTab('all')}
          >
            <Text style={[styles.tabBtnText, tab === 'all' && styles.tabBtnTextActive]}>
              All Members ({profiles.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profiles Moderation List */}
        <View style={styles.listSection}>
          {(tab === 'pending' ? pendingProfiles : profiles).map(p => (
            <View key={p.id} style={styles.memberCard}>
              <View style={styles.memberTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.memberName}>{p.name}</Text>
                    <View
                      style={[
                        styles.badge,
                        p.isVerified ? styles.badgeVerified : styles.badgePending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          !p.isVerified && { color: Colors.burgundy },
                        ]}
                      >
                        {p.isVerified ? 'VERIFIED' : 'PENDING REVIEW'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.memberSub}>
                    {p.gender === 'bride' ? 'Bride (பெண்)' : 'Groom (ஆண்)'} • {p.age} Yrs • {p.caste} ({p.subCaste})
                  </Text>
                  <Text style={styles.memberLocation}>
                    📍 {p.currentCity} (Native: {p.nativeDistrict}) • {p.educationCareer.occupation}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsBar}>
                <TouchableOpacity
                  style={styles.actionView}
                  onPress={() => onViewProfile(p)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionViewText}>View Full Varan</Text>
                </TouchableOpacity>

                {!p.isVerified && (
                  <TouchableOpacity
                    style={styles.actionApprove}
                    onPress={() => handleVerify(p.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionApproveText}>Approve Aadhaar ✓</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.actionSuspend}
                  onPress={() => handleSuspend(p.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionSuspendText}>Suspend</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.subtle,
  },
  statNum: {
    fontFamily: Typography.fontSerif,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  statLabel: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  statSub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.sandLight,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: Colors.burgundy,
    ...Shadows.subtle,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  listSection: {
    gap: Spacing.sm,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.subtle,
  },
  memberTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.sm,
  },
  badgeVerified: {
    backgroundColor: Colors.successLight,
  },
  badgePending: {
    backgroundColor: Colors.dustyPinkLight,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.success,
  },
  memberSub: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  memberLocation: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  actionsBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: Colors.sandLight,
  },
  actionView: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.2,
    borderColor: Colors.burgundy,
    alignItems: 'center',
    backgroundColor: Colors.creme,
  },
  actionViewText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  actionApprove: {
    flex: 1.4,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.burgundy,
    alignItems: 'center',
  },
  actionApproveText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.creme,
  },
  actionSuspend: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.danger,
    alignItems: 'center',
  },
  actionSuspendText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.danger,
  },
});
