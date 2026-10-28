import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language, Translations } from '../localization';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../theme';
import { CustomIcon } from './CustomIcon';
import { GarlandLogo } from './GarlandLogo';

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
        {/* Left: Back Button OR Minimal Brand Seal */}
        {showBack ? (
          <TouchableOpacity
            style={styles.iconCircleButton}
            onPress={onBackPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CustomIcon name="chevron-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandCrest}>
            <GarlandLogo size="small" showSubtitle={false} lightMode={true} />
          </View>
        )}

        {/* Center: Title or Minimal Tamil Blessing */}
        {title ? (
          <View style={styles.titleWrap}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.centerBlessing}>
            <View style={styles.blessingTag}>
              <Text style={styles.blessingText}>வாழ்க வளமுடன்</Text>
            </View>
            <Text style={styles.curatedSubtitle}>
              {language === 'ta' ? 'மணமாலை மேட்ரிமோனி' : 'Royal Tamil Matrimony'}
            </Text>
          </View>
        )}

        {/* Right Action Icons: Language Toggle + Admin + Notifications */}
        <View style={styles.actionsCluster}>
          {/* Minimal Editorial Language Switcher */}
          <TouchableOpacity
            style={styles.langPillSwitch}
            onPress={onToggleLanguage}
            activeOpacity={0.8}
          >
            <View style={[styles.langSegment, language === 'ta' && styles.langSegmentActive]}>
              <Text style={[styles.langSegText, language === 'ta' && styles.langSegTextActive]}>
                தமிழ்
              </Text>
            </View>
            <View style={[styles.langSegment, language === 'en' && styles.langSegmentActive]}>
              <Text style={[styles.langSegText, language === 'en' && styles.langSegTextActive]}>
                EN
              </Text>
            </View>
          </TouchableOpacity>

          {/* Admin shortcut if admin */}
          {onAdminPress && (
            <TouchableOpacity
              style={[styles.iconCircleButton, isAdmin && styles.iconCircleBtnActive]}
              onPress={onAdminPress}
              activeOpacity={0.7}
            >
              <CustomIcon
                name="admin"
                size={16}
                color={isAdmin ? Colors.goldAccent : 'rgba(255, 255, 255, 0.7)'}
              />
            </TouchableOpacity>
          )}

          {/* Notification Bell with Auspicious Ruby Badge */}
          {onNotificationPress && (
            <TouchableOpacity
              style={styles.iconCircleButton}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <CustomIcon name="bell" size={18} color="#FFFFFF" />
              {unreadNotificationsCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Radiant Gold Hairline Divider */}
      <View style={styles.goldDivider} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.burgundyDark, // Deep Obsidian Sapphire
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.25)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: 10,
    minHeight: 54,
  },
  brandCrest: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  iconCircleBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: Colors.goldAccent,
  },
  titleWrap: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  titleText: {
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Typography.fontSerif,
  },
  subtitleText: {
    fontSize: Typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 1,
  },
  centerBlessing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blessingTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  blessingText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.goldAccent,
    letterSpacing: 0.4,
  },
  curatedSubtitle: {
    fontSize: 9.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.72)',
    letterSpacing: 0.5,
    marginTop: 2.5,
  },
  actionsCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  langPillSwitch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.full,
    padding: 2.5,
    borderWidth: 0.8,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  langSegment: {
    paddingHorizontal: 7.5,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
  },
  langSegmentActive: {
    backgroundColor: Colors.goldAccent,
  },
  langSegText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  langSegTextActive: {
    color: Colors.burgundyDark,
    fontWeight: '800',
  },
  notifBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Colors.terracotta,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.burgundyDark,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  goldDivider: {
    height: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
  },
});
