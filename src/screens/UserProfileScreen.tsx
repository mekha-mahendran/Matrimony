/**
 * Manamaalai Matrimony — Modern Profile & Account Screen (5th Tab)
 *
 * Implements the exact design from the reference screenshot:
 * - Header: White background with circular back button (←) and title "Profile"
 * - User Avatar:
 *     - Circular portrait (neon sunglasses portrait matching screenshot)
 *     - Purple edit badge (pencil icon) on bottom right of avatar
 *     - Bold name below: "Esther Howard"
 * - "Get Premium Plan" Card:
 *     - Royal purple rounded card (#6D53F5)
 *     - Yellow circular crown badge
 *     - "Get Premium Plan" title + "Lorem ipsum dolor sit amet" subtitle
 *     - White right arrow chevron (>)
 * - Navigation / Settings Menu List (clean white rows with purple icons & purple chevrons):
 *     1. Your profile
 *     2. Payment Methods
 *     3. Settings
 *     4. Help Center
 *     5. Invites Friends
 *     6. Privacy Policy
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';
import { StorageService } from '../services/storage';
import { CurrentUser, MatrimonyProfile } from '../types';

const BRAND_PURPLE = '#6D53F5';

interface UserProfileScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onNotificationPress?: () => void;
  onAdminPress?: () => void;
  onEditProfile: () => void;
  onMembershipPress: () => void;
  onPaymentMethodsPress?: () => void;
  onViewMyProfile: (profile: MatrimonyProfile) => void;
  onFamilyCirclePress?: () => void;
  onRelationshipManagerPress?: () => void;
  onOperationsPress?: () => void;
  onLogout: () => void;
  onBack?: () => void;
  unreadCount?: number;
  isAdmin?: boolean;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  language,
  onEditProfile,
  onMembershipPress,
  onPaymentMethodsPress,
  onViewMyProfile,
  onAdminPress,
  onLogout,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userProfile, setUserProfile] = useState<MatrimonyProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      const u = await StorageService.getCurrentUser();
      setCurrentUser(u);
      if (u?.activeProfileId) {
        const p = await StorageService.getProfileById(u.activeProfileId);
        if (p) setUserProfile(p);
      }
    }
    loadData();
  }, []);

  const displayName = userProfile?.name || 'Esther Howard';
  const displayAvatar = userProfile?.photos?.[0] ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Join me on Manamaalai Matrimony to find your perfect match! Download now.',
      });
    } catch {}
  };

  const handleHelpCenter = () => {
    Alert.alert(
      isTa ? 'உதவி மையம்' : 'Help Center',
      isTa
        ? 'எங்கள் 24/7 வாடிக்கையாளர் ஆதரவு: support@manamaalai.com அல்லது 1800-MANA-MAALAI'
        : 'Our 24/7 Customer Support is available at support@manamaalai.com or 1800-MANA-MAALAI'
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      isTa ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy',
      isTa
        ? 'உங்கள் தனிப்பட்ட தரவு 100% பாதுகாப்பாக மற்றும் குறியாக்கம் செய்யப்பட்டுள்ளது.'
        : 'Your personal data is 100% encrypted, verified and protected under Manamaalai Privacy Standards.'
    );
  };

  const menuItems = [
    {
      id: 'profile',
      label: isTa ? 'உங்கள் சுயவிவரம்' : 'Your profile',
      icon: 'profile',
      onPress: () => {
        if (userProfile) onViewMyProfile(userProfile);
        else onEditProfile();
      },
    },
    {
      id: 'payment',
      label: isTa ? 'கட்டண முறைகள்' : 'Payment Methods',
      icon: 'payment',
      onPress: onPaymentMethodsPress || onMembershipPress,
    },
    {
      id: 'admin',
      label: isTa ? 'நிர்வாக கட்டுப்பாட்டு மையம்' : 'Admin Control Panel',
      icon: 'admin',
      onPress: onAdminPress,
    },
    {
      id: 'settings',
      label: isTa ? 'அமைப்புகள்' : 'Settings',
      icon: 'settings',
      onPress: onEditProfile,
    },
    {
      id: 'help',
      label: isTa ? 'உதவி மையம்' : 'Help Center',
      icon: 'help',
      onPress: handleHelpCenter,
    },
    {
      id: 'invites',
      label: isTa ? 'நண்பர்களை அழைக்கவும்' : 'Invites Friends',
      icon: 'invites',
      onPress: handleShareApp,
    },
    {
      id: 'privacy',
      label: isTa ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy',
      icon: 'privacy',
      onPress: handlePrivacyPolicy,
    },
  ];

  const renderMenuIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Circle cx="12" cy="8" r="4" />
            <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );
      case 'payment':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Rect x="2" y="5" width="20" height="14" rx="3" />
            <Line x1="2" y1="10" x2="22" y2="10" />
            <Line x1="6" y1="15" x2="10" y2="15" strokeLinecap="round" />
          </Svg>
        );
      case 'admin':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            <Path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );
      case 'settings':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </Svg>
        );
      case 'help':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Circle cx="12" cy="12" r="10" />
            <Line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
            <Circle cx="12" cy="16" r="1" fill={BRAND_PURPLE} />
          </Svg>
        );
      case 'invites':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <Circle cx="8.5" cy="7" r="4" />
            <Line x1="20" y1="8" x2="20" y2="14" strokeLinecap="round" />
            <Line x1="23" y1="11" x2="17" y2="11" strokeLinecap="round" />
          </Svg>
        );
      case 'privacy':
      default:
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2}>
            <Rect x="3" y="11" width="18" height="11" rx="3" />
            <Path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ─── 1. Header (Back Button, Title "Profile") ────────────────────── */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#18181D" strokeWidth={2.5}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isTa ? 'சுயவிவரம்' : 'Profile'}
        </Text>

        {/* Empty placeholder for symmetrical balance */}
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 95, 120) },
        ]}
      >
        {/* ─── 2. Avatar & Name Section ───────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: displayAvatar }} style={styles.avatarImage} resizeMode="cover" />
            {/* Edit Pencil Icon Badge */}
            <TouchableOpacity
              style={styles.editBadge}
              onPress={onEditProfile}
              activeOpacity={0.85}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5}>
                <Path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* User Name */}
          <Text style={styles.userNameText}>{displayName}</Text>
        </View>

        {/* ─── 3. Get Premium Plan Card ────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.premiumCard}
          onPress={onMembershipPress}
          activeOpacity={0.9}
        >
          {/* Yellow Crown Badge */}
          <View style={styles.crownBadge}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="#18181D">
              <Path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </Svg>
          </View>

          {/* Title & Subtitle */}
          <View style={styles.premiumTextWrap}>
            <Text style={styles.premiumTitle}>
              {isTa ? 'பிரீமியம் திட்டம் பெறுக' : 'Get Premium Plan'}
            </Text>
            <Text style={styles.premiumSubtitle}>
              {isTa ? 'வரம்பற்ற தொடர்புகள் & பொருத்தங்கள்' : 'Lorem ipsum dolor sit amet'}
            </Text>
          </View>

          {/* Right Chevron Arrow */}
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.8}>
            <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        {/* ─── 4. Navigation Menu List ─────────────────────────────────────── */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItemRow,
                idx === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              {/* Left Purple Icon */}
              <View style={styles.menuIconWrap}>
                {renderMenuIcon(item.icon)}
              </View>

              {/* Menu Label */}
              <Text style={styles.menuItemLabel}>{item.label}</Text>

              {/* Right Purple Chevron */}
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.4}>
                <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Option */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={onLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>
            {isTa ? 'வெளியேறு' : 'Log Out'}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181D',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  /* Avatar Section */
  avatarSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  avatarWrap: {
    position: 'relative',
    width: 106,
    height: 106,
  },
  avatarImage: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: '#1E1E24',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND_PURPLE,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#18181D',
    marginTop: 14,
    letterSpacing: -0.2,
  },

  /* Premium Card */
  premiumCard: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  crownBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  premiumTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },

  /* Menu List */
  menuContainer: {
    marginTop: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  menuIconWrap: {
    width: 32,
    alignItems: 'flex-start',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#18181D',
    marginLeft: 8,
  },

  /* Logout Button */
  logoutBtn: {
    marginTop: 28,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
});
