import React, { useEffect, useState } from 'react';
import {
  FlatList,
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
import { NotificationItem } from '../types';

interface NotificationsScreenProps {
  language: Language;
  onBack: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  language,
  onBack,
  onSelectNotification,
}) => {
  const t = Translations[language];
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [tab, setTab] = useState<'all' | 'interests' | 'views' | 'system'>('all');

  const loadNotifs = async () => {
    const list = await StorageService.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    await StorageService.markAllNotificationsRead();
    await loadNotifs();
  };

  const filtered = notifications.filter(n => {
    if (tab === 'interests') {
      return n.type.includes('interest');
    }
    if (tab === 'views') {
      return n.type.includes('view');
    }
    if (tab === 'system') {
      return n.type.includes('system') || n.type.includes('membership');
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title="Notifications"
        subtitle="அறிவிப்புகள்"
      />

      {/* Sub Header Action Bar */}
      <View style={styles.topBar}>
        {/* Tabs */}
        <View style={styles.tabScroll}>
          {[
            { id: 'all', label: 'All' },
            { id: 'interests', label: 'Interests' },
            { id: 'views', label: 'Profile Views' },
            { id: 'system', label: 'System' },
          ].map(item => {
            const active = tab === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.tabChip, active && styles.tabChipActive]}
                onPress={() => setTab(item.id as any)}
              >
                <Text style={[styles.tabChipText, active && styles.tabChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={styles.markReadText}>Mark read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={[styles.notifCard, !item.read && styles.notifCardUnread]}
              onPress={() => onSelectNotification && onSelectNotification(item)}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <CustomIcon
                  name={
                    item.type.includes('interest')
                      ? 'heart-filled'
                      : item.type.includes('view')
                      ? 'eye'
                      : 'shield'
                  }
                  size={17}
                  color={Colors.burgundy}
                />
              </View>

              <View style={styles.contentCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                  <Text style={styles.timeText}>{item.createdAt}</Text>
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <CustomIcon name="bell" size={36} color={Colors.dustyPink} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>
              You're all caught up! New match alerts and interest updates will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.creme,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand,
  },
  tabScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  tabChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  tabChipActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  tabChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabChipTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  markReadText: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  notifCardUnread: {
    backgroundColor: Colors.sandLight,
    borderColor: Colors.goldAccent,
    borderWidth: 1.2,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.terracotta,
    marginRight: 6,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyRegular,
    fontWeight: '700',
    color: Colors.burgundy,
    flex: 1,
  },
  timeText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  notifMessage: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: Colors.burgundy,
    marginTop: Spacing.sm,
  },
  emptySub: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
