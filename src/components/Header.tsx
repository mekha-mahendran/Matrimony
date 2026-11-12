/**
 * Manamaalai Matrimony — Header Component
 *
 * Wedding-Inspired Official Palette:
 *   Plum Burgundy: #49141C | Lime Olive: #93A220 | Dusty Rose: #D17575 | Vanilla: #FFFBE2
 *
 * Navigation Requirement:
 *   Light Vanilla background. Never dark burgundy. Blends seamlessly with the screen.
 */

import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language, Translations } from '../localization';
import { Spacing } from '../theme';
import { CustomIcon } from './CustomIcon';
import { GarlandLogo } from './GarlandLogo';
import { LanguageToggle } from './LanguageToggle';

/* ── Brand palette (local tokens) ─────────────────────────────────────────── */
const C = {
  vanilla:      '#FFFFFF',
  vanillaTint:  '#F7F6F1',
  plumBurgundy: '#49141C',
  limeOlive:    '#93A220',
  limeOliveDark:'#6A7513',
  limeOlivePale:'rgba(147, 162, 32, 0.16)',
  dustyRose:    '#D17575',
  sandBorder:   '#E6E2CF',
  textSecondary:'#523E42',
  iconBtnBg:    '#F7F6F1',
  iconBtnBorder:'#E6E2CF',
};

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  unreadNotificationsCount?: number;
  onNotificationPress?: () => void;
  onAdminPress?: () => void;
  isAdmin?: boolean;
  showBack?: boolean;
  onBackPress?: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  unreadNotificationsCount = 0,
  onNotificationPress,
  onAdminPress,
  isAdmin = false,
  showBack = false,
  onBackPress,
  title,
  subtitle,
}) => {
  const insets = useSafeAreaInsets();
  const t = Translations[language];

  return (
    <View style={[styles.outerContainer, { paddingTop: Math.max(insets.top, 8) }]}>
      <View style={styles.contentRow}>

        {/* ── Left: Back button OR Brand logo ───────────────────────────── */}
        {showBack ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onBackPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CustomIcon name="chevron-left" size={20} color={C.plumBurgundy} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandCrest}>
            {/* Logo on light Vanilla background */}
            <GarlandLogo size="small" showSubtitle={false} lightMode={false} />
          </View>
        )}

        {/* ── Center: Screen title OR blessing tagline ──────────────────── */}
        {title ? (
          <View style={styles.titleWrap}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.centerBlessing}>
            {/* Auspicious blessing tag */}
            <View style={styles.blessingTag}>
              <Text style={styles.blessingTagDot}>✦</Text>
              <Text style={styles.blessingText}>வாழ்க வளமுடன்</Text>
              <Text style={styles.blessingTagDot}>✦</Text>
            </View>
            <Text style={styles.blessingSubtitle}>
              {language === 'ta' ? 'மணமாலை மேட்ரிமோனி' : 'Royal Tamil Matrimony'}
            </Text>
          </View>
        )}

        {/* ── Right: Language pill + Admin + Notification ───────────────── */}
        <View style={styles.actionsRow}>

          {/* Normal & Elegant Language switcher */}
          <LanguageToggle
            language={language}
            onToggle={onToggleLanguage}
            size="small"
          />

          {/* Admin shortcut button */}
          {onAdminPress ? (
            <TouchableOpacity
              style={[styles.iconBtn, isAdmin && styles.iconBtnAdmin]}
              onPress={onAdminPress}
              activeOpacity={0.7}
            >
              <CustomIcon
                name="admin"
                size={16}
                color={isAdmin ? C.limeOlive : C.plumBurgundy}
              />
            </TouchableOpacity>
          ) : null}

          {/* Notification bell button */}
          {onNotificationPress ? (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <CustomIcon name="bell" size={18} color={C.plumBurgundy} />
              {unreadNotificationsCount > 0 && (
                <View style={styles.notifDot}>
                  <Text style={styles.notifDotText}>
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : null}

        </View>
      </View>

      {/* Decorative Lime Olive bottom hairline */}
      <View style={styles.hairlineBar} />
    </View>
  );
};

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif' }) || 'serif';

const styles = StyleSheet.create({
  /* ── Light Vanilla Navigation Header (Not Plum Burgundy) ─────────────── */
  outerContainer: {
    backgroundColor: C.vanilla,
    borderBottomWidth: 1,
    borderBottomColor: C.sandBorder,
    shadowColor: C.plumBurgundy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: 8,
    minHeight: 52,
  },

  /* ── Left — brand crest ──────────────────────────────────────────────── */
  brandCrest: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* ── Center — title / blessing ───────────────────────────────────────── */
  titleWrap: {
    flex: 1,
    marginHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16.5,
    fontWeight: '700',
    color: C.plumBurgundy,
    fontFamily: SERIF,
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: 10.5,
    color: C.textSecondary,
    marginTop: 1,
    letterSpacing: 0.2,
  },

  centerBlessing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blessingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.limeOlivePale,
    borderWidth: 1,
    borderColor: C.limeOlive,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  blessingTagDot: {
    fontSize: 8.5,
    color: C.limeOliveDark,
    fontWeight: '700',
  },
  blessingText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: C.limeOliveDark,
    fontFamily: SERIF,
    letterSpacing: 0.4,
  },
  blessingSubtitle: {
    fontSize: 9,
    fontWeight: '600',
    color: C.textSecondary,
    letterSpacing: 0.6,
    marginTop: 2.5,
    textTransform: 'uppercase',
  },

  /* ── Right — action cluster ──────────────────────────────────────────── */
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  /* Language pill */
  langPill: {
    flexDirection: 'row',
    backgroundColor: C.iconBtnBg,
    borderRadius: 99,
    padding: 2.5,
    borderWidth: 1,
    borderColor: C.sandBorder,
  },
  langSeg: {
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 99,
  },
  langSegActive: {
    backgroundColor: C.limeOlive,
  },
  langSegText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: C.textSecondary,
  },
  langSegTextActive: {
    color: C.vanilla,
    fontWeight: '800',
  },

  /* Icon circle buttons */
  iconBtn: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: C.iconBtnBg,
    borderWidth: 1,
    borderColor: C.iconBtnBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBtnAdmin: {
    backgroundColor: C.limeOlivePale,
    borderColor: C.limeOlive,
  },

  /* Notification badge in Dusty Rose */
  notifDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: C.dustyRose,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: C.vanilla,
  },
  notifDotText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },

  /* Subtle Lime Olive decorative accent hairline */
  hairlineBar: {
    height: 1.5,
    backgroundColor: C.limeOlive,
    opacity: 0.4,
  },
});
