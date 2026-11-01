/**
 * Manamaalai Matrimony (மணமாலை) — Operations, Agent & Branch Management + Referral & Commission Tracking
 *
 * Features:
 * - Agent and branch management (5 Tamil Nadu branches & local bureaus)
 * - Referral and commission tracking (20% conversion payout, tracking ledger)
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
import {
  MOCK_AGENTS,
  MOCK_BRANCHES,
  MOCK_COMMISSION_RECORDS,
} from '../data/mockOperationsData';
import { Language } from '../localization';
import { CommissionRecord, MatrimonyAgent, MatrimonyBranch } from '../types';

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

interface OperationsManagementScreenProps {
  language: Language;
  onBack: () => void;
}

export const OperationsManagementScreen: React.FC<OperationsManagementScreenProps> = ({
  language,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [activeTab, setActiveTab] = useState<'branches' | 'agents' | 'commissions'>('branches');
  const [branches, setBranches] = useState<MatrimonyBranch[]>(MOCK_BRANCHES);
  const [agents, setAgents] = useState<MatrimonyAgent[]>(MOCK_AGENTS);
  const [commissions, setCommissions] = useState<CommissionRecord[]>(MOCK_COMMISSION_RECORDS);

  // New Agent Modal
  const [isAddAgentVisible, setIsAddAgentVisible] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentTerritory, setNewAgentTerritory] = useState('');

  // Total calculations
  const totalProfiles = branches.reduce((acc, b) => acc + b.registeredProfilesCount, 0);
  const totalMarriages = branches.reduce((acc, b) => acc + b.successfulMarriages, 0);
  const totalCommissionsEarned = commissions.reduce((acc, c) => acc + c.commissionAmount, 0);
  const pendingPayoutTotal = commissions
    .filter(c => c.status === 'pending' || c.status === 'processing')
    .reduce((acc, c) => acc + c.commissionAmount, 0);

  const handleShareReferralLink = async () => {
    try {
      await Share.share({
        message:
          '🌸 Register your matrimony profile on Manamaalai Matrimony with Agent Referral Code: *MMA-CHN-101* to receive 15% discount on Gold & Platinum Kalyanam plans!\n\nDownload app: https://manamaalai.mock/register?ref=MMA-CHN-101',
        title: 'Manamaalai Matrimony Agent Referral',
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const handleCreateAgent = () => {
    if (!newAgentName.trim() || !newAgentPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter agent name and phone number.');
      return;
    }

    const newAgent: MatrimonyAgent = {
      id: 'ag-' + Date.now(),
      agentCode: 'MMA-TN-' + Math.floor(100 + Math.random() * 900),
      name: newAgentName.trim(),
      phone: newAgentPhone.trim(),
      email: `${newAgentName.toLowerCase().replace(/\s+/g, '')}@manamaalai.mock`,
      branchId: 'br-chn-01',
      branchName: 'Chennai Central Flagship',
      territory: newAgentTerritory.trim() || 'Tamil Nadu Region',
      totalProfilesEnrolled: 0,
      activeConversions: 0,
      totalCommissionEarned: 0,
      pendingPayout: 0,
      status: 'active',
      rating: 5.0,
    };

    setAgents([newAgent, ...agents]);
    setNewAgentName('');
    setNewAgentPhone('');
    setNewAgentTerritory('');
    setIsAddAgentVisible(false);
    Alert.alert('Agent Enrolled 🌺', `Agent ${newAgent.name} assigned code ${newAgent.agentCode}.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title={isTa ? 'கிளை & முகவர் மேலாண்மை' : 'Operations & Agent Portal'}
        subtitle={isTa ? 'கிளைகள், முகவர்கள் & கமிஷன் விவரங்கள்' : 'Branches, Agents & Referral Ledger'}
      />

      {/* Top 3 Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'branches' && styles.tabButtonActive]}
          onPress={() => setActiveTab('branches')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'branches' && styles.tabTextActive]}>
            Branches (கிளைகள்)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'agents' && styles.tabButtonActive]}
          onPress={() => setActiveTab('agents')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'agents' && styles.tabTextActive]}>
            Agents ({agents.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'commissions' && styles.tabButtonActive]}
          onPress={() => setActiveTab('commissions')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'commissions' && styles.tabTextActive]}>
            Commissions
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Tab 1: Branches ──────────────────────────────────────────────── */}
        {activeTab === 'branches' && (
          <View>
            {/* KPI Summary Grid */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiNum}>5</Text>
                <Text style={styles.kpiLabel}>TN Branches</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiNum}>{totalProfiles.toLocaleString()}</Text>
                <Text style={styles.kpiLabel}>Enrolled Profiles</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiNum}>{totalMarriages.toLocaleString()}+</Text>
                <Text style={styles.kpiLabel}>Marriages Done</Text>
              </View>
            </View>

            {/* Branch Cards */}
            {branches.map(b => (
              <View key={b.id} style={styles.branchCard}>
                <View style={styles.branchHeaderRow}>
                  <View style={styles.branchIconBadge}>
                    <CustomIcon name="crown" size={16} color={C.plumBurgundy} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.branchName}>{b.name}</Text>
                    <Text style={styles.branchCity}>District: {b.district}</Text>
                  </View>
                  <View style={styles.branchActivePill}>
                    <Text style={styles.branchActiveText}>Active</Text>
                  </View>
                </View>

                <Text style={styles.branchAddress}>📍 {b.address}</Text>
                <Text style={styles.branchContact}>📞 {b.phone} • Mgr: {b.managerName}</Text>

                <View style={styles.branchStatsRow}>
                  <View style={styles.branchStat}>
                    <Text style={styles.branchStatVal}>{b.activeAgentsCount}</Text>
                    <Text style={styles.branchStatLabel}>Agents</Text>
                  </View>
                  <View style={styles.branchStat}>
                    <Text style={styles.branchStatVal}>{b.registeredProfilesCount}</Text>
                    <Text style={styles.branchStatLabel}>Profiles</Text>
                  </View>
                  <View style={styles.branchStat}>
                    <Text style={styles.branchStatVal}>{b.successfulMarriages}</Text>
                    <Text style={styles.branchStatLabel}>Marriages</Text>
                  </View>
                  <View style={styles.branchStat}>
                    <Text style={styles.branchStatVal}>₹{(b.monthlyRevenueInr / 100000).toFixed(1)}L</Text>
                    <Text style={styles.branchStatLabel}>Mo. Revenue</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Tab 2: Agents & Marriage Bureaus ─────────────────────────────── */}
        {activeTab === 'agents' && (
          <View>
            {/* Header + Add Agent Button */}
            <View style={styles.agentsHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Registered Marriage Bureaus</Text>
                <Text style={styles.sectionSubHeading}>Active field agents & franchise bureaus</Text>
              </View>
              <TouchableOpacity
                style={styles.addAgentBtn}
                onPress={() => setIsAddAgentVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.addAgentBtnText}>+ Add Agent</Text>
              </TouchableOpacity>
            </View>

            {agents.map(ag => (
              <View key={ag.id} style={styles.agentCard}>
                <View style={styles.agentTopRow}>
                  <View style={styles.agentIconWrap}>
                    <CustomIcon name="briefcase" size={18} color={C.plumBurgundy} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.agentNameRow}>
                      <Text style={styles.agentName}>{ag.name}</Text>
                      <View style={styles.agentRatingBadge}>
                        <CustomIcon name="star" size={10} color={C.gold} />
                        <Text style={styles.agentRatingText}>{ag.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.agentCodeText}>Code: {ag.agentCode}</Text>
                    <Text style={styles.agentTerritoryText}>🗺️ {ag.territory} • {ag.branchName}</Text>
                  </View>
                </View>

                {/* Metrics */}
                <View style={styles.agentStatsGrid}>
                  <View style={styles.agentStatItem}>
                    <Text style={styles.agentStatNum}>{ag.totalProfilesEnrolled}</Text>
                    <Text style={styles.agentStatLbl}>Enrolled</Text>
                  </View>
                  <View style={styles.agentStatItem}>
                    <Text style={styles.agentStatNum}>{ag.activeConversions}</Text>
                    <Text style={styles.agentStatLbl}>Paid Upgrades</Text>
                  </View>
                  <View style={styles.agentStatItem}>
                    <Text style={[styles.agentStatNum, { color: C.limeOliveDark }]}>
                      ₹{(ag.totalCommissionEarned / 1000).toFixed(0)}k
                    </Text>
                    <Text style={styles.agentStatLbl}>Total Earned</Text>
                  </View>
                  <View style={styles.agentStatItem}>
                    <Text style={[styles.agentStatNum, { color: C.plumBurgundy }]}>
                      ₹{(ag.pendingPayout / 1000).toFixed(0)}k
                    </Text>
                    <Text style={styles.agentStatLbl}>Pending</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Tab 3: Referral & Commission Tracking ────────────────────────── */}
        {activeTab === 'commissions' && (
          <View>
            {/* Referral Code Banner */}
            <View style={styles.referralCodeBanner}>
              <View style={styles.referralTextCol}>
                <Text style={styles.referralBannerTitle}>Your Partner Referral Code</Text>
                <Text style={styles.referralCodePill}>MMA-CHN-101</Text>
                <Text style={styles.referralRateNote}>Earn 20% commission on every membership conversion</Text>
              </View>
              <TouchableOpacity
                style={styles.shareCodeBtn}
                onPress={handleShareReferralLink}
                activeOpacity={0.8}
              >
                <CustomIcon name="share" size={14} color={C.white} />
                <Text style={styles.shareCodeText}>Share Code</Text>
              </TouchableOpacity>
            </View>

            {/* Commission KPI cards */}
            <View style={styles.commissionKpiRow}>
              <View style={styles.commKpiCard}>
                <Text style={styles.commKpiTitle}>Total Earned</Text>
                <Text style={[styles.commKpiAmount, { color: C.limeOliveDark }]}>
                  ₹{totalCommissionsEarned.toLocaleString()}
                </Text>
                <Text style={styles.commKpiSub}>All-time paid commissions</Text>
              </View>

              <View style={styles.commKpiCard}>
                <Text style={styles.commKpiTitle}>Pending Payout</Text>
                <Text style={[styles.commKpiAmount, { color: C.plumBurgundy }]}>
                  ₹{pendingPayoutTotal.toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={styles.payoutReqBtn}
                  onPress={() => Alert.alert('Payout Requested 💰', 'Your payout request of ₹' + pendingPayoutTotal + ' has been scheduled for Friday NEFT batch.')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.payoutReqBtnText}>Request Payout</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Commission Ledger Table */}
            <Text style={styles.ledgerHeaderTitle}>Recent Commission Transactions</Text>
            {commissions.map(c => (
              <View key={c.id} style={styles.ledgerCard}>
                <View style={styles.ledgerTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientName}>{c.clientName}</Text>
                    <Text style={styles.planInfo}>
                      {c.planName} (₹{c.planAmount}) • {c.date}
                    </Text>
                  </View>

                  <View style={styles.ledgerAmountCol}>
                    <Text style={styles.commEarnedText}>+₹{c.commissionAmount}</Text>
                    <View
                      style={[
                        styles.commStatusBadge,
                        c.status === 'paid' && { backgroundColor: C.limeOlivePale },
                        c.status === 'processing' && { backgroundColor: '#FFF6D9' },
                        c.status === 'pending' && { backgroundColor: '#FCEFEF' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.commStatusText,
                          c.status === 'paid' && { color: C.limeOliveDark },
                          c.status === 'processing' && { color: '#9E6E00' },
                          c.status === 'pending' && { color: C.dustyRose },
                        ]}
                      >
                        {c.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {c.paymentReference && (
                  <Text style={styles.refCodeText}>Ref: {c.paymentReference}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Agent Modal */}
      <Modal visible={isAddAgentVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.agentSheet}>
            <Text style={styles.sheetTitle}>Enroll New Franchise Agent</Text>
            <Text style={styles.sheetSub}>
              Register a local marriage bureau or matchmaker with trackable commission code.
            </Text>

            <Text style={styles.inputLabel}>Agent / Bureau Name:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Sri Balaji Kalyana Sevai"
              placeholderTextColor={C.textMuted}
              value={newAgentName}
              onChangeText={setNewAgentName}
            />

            <Text style={styles.inputLabel}>Mobile Phone:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+91 98401 00000"
              keyboardType="phone-pad"
              placeholderTextColor={C.textMuted}
              value={newAgentPhone}
              onChangeText={setNewAgentPhone}
            />

            <Text style={styles.inputLabel}>Assigned Territory / Area:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Tambaram & Chromepet"
              placeholderTextColor={C.textMuted}
              value={newAgentTerritory}
              onChangeText={setNewAgentTerritory}
            />

            <View style={styles.sheetActionsRow}>
              <TouchableOpacity
                style={styles.sheetCancel}
                onPress={() => setIsAddAgentVisible(false)}
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetSubmit} onPress={handleCreateAgent}>
                <Text style={styles.sheetSubmitText}>Create Agent</Text>
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.sandBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: C.plumBurgundy,
    borderColor: C.plumBurgundy,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textPrimary,
  },
  tabTextActive: {
    color: C.white,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: C.sandBorder,
    alignItems: 'center',
  },
  kpiNum: {
    fontSize: 16,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  kpiLabel: {
    fontSize: 10,
    color: C.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  branchCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 12,
  },
  branchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  branchIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.limeOlivePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchName: {
    fontSize: 14,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  branchCity: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 1,
  },
  branchActivePill: {
    backgroundColor: C.limeOlivePale,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  branchActiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.limeOliveDark,
  },
  branchAddress: {
    fontSize: 11.5,
    color: C.textPrimary,
    marginTop: 8,
  },
  branchContact: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  },
  branchStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F0',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  branchStat: {
    alignItems: 'center',
  },
  branchStatVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.textPrimary,
  },
  branchStatLabel: {
    fontSize: 9.5,
    color: C.textSecondary,
    marginTop: 1,
  },
  agentsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: C.plumBurgundy,
    fontFamily: SERIF_FONT,
  },
  sectionSubHeading: {
    fontSize: 11.5,
    color: C.textSecondary,
    marginTop: 1,
  },
  addAgentBtn: {
    backgroundColor: C.plumBurgundy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addAgentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.white,
  },
  agentCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 10,
  },
  agentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5EFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentName: {
    fontSize: 14,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  agentRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  agentRatingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9E6E00',
  },
  agentCodeText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.limeOliveDark,
    marginTop: 1,
  },
  agentTerritoryText: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  },
  agentStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F2',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  agentStatItem: {
    alignItems: 'center',
  },
  agentStatNum: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  agentStatLbl: {
    fontSize: 9.5,
    color: C.textSecondary,
    marginTop: 1,
  },
  referralCodeBanner: {
    backgroundColor: '#FAF5E8',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: C.gold,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  referralTextCol: {
    flex: 1,
  },
  referralBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.plumBurgundy,
  },
  referralCodePill: {
    fontSize: 18,
    fontWeight: '800',
    color: C.plumBurgundy,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  referralRateNote: {
    fontSize: 10.5,
    color: C.textSecondary,
    marginTop: 2,
  },
  shareCodeBtn: {
    backgroundColor: C.plumBurgundy,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shareCodeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: C.white,
  },
  commissionKpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  commKpiCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.sandBorder,
  },
  commKpiTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textSecondary,
  },
  commKpiAmount: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 4,
  },
  commKpiSub: {
    fontSize: 10,
    color: C.textMuted,
  },
  payoutReqBtn: {
    backgroundColor: C.plumBurgundy,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  payoutReqBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: C.white,
  },
  ledgerHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.plumBurgundy,
    marginBottom: 8,
  },
  ledgerCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.sandBorder,
    marginBottom: 8,
  },
  ledgerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: C.textPrimary,
  },
  planInfo: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 1,
  },
  ledgerAmountCol: {
    alignItems: 'flex-end',
  },
  commEarnedText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.limeOliveDark,
  },
  commStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  commStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  refCodeText: {
    fontSize: 10,
    color: C.textMuted,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(35, 12, 18, 0.6)',
    justifyContent: 'flex-end',
  },
  agentSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
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
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: C.sandBorder,
    borderRadius: 10,
    backgroundColor: '#FFFEFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: C.textPrimary,
    marginBottom: 12,
  },
  sheetActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  sheetCancel: {
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
  sheetSubmit: {
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

