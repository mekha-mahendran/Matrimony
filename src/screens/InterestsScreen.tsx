import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
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
import { CurrentUser, InterestRecord, MatrimonyProfile } from '../types';

interface InterestsScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  onChatPress: (profile: MatrimonyProfile) => void;
  unreadCount: number;
  isAdmin: boolean;
}

export const InterestsScreen: React.FC<InterestsScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onProfilePress,
  onChatPress,
  unreadCount,
  isAdmin,
}) => {
  const t = Translations[language];
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [interests, setInterests] = useState<InterestRecord[]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, MatrimonyProfile>>({});
  const [tab, setTab] = useState<'received' | 'sent' | 'accepted' | 'declined'>('received');

  const loadData = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);

    const intList = await StorageService.getInterests();
    setInterests(intList);

    const profiles = await StorageService.getAllProfiles();
    const map: Record<string, MatrimonyProfile> = {};
    profiles.forEach(p => {
      map[p.id] = p;
    });
    setProfilesMap(map);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (interestId: string) => {
    await StorageService.updateInterestStatus(interestId, 'accepted');
    await loadData();
  };

  const handleDecline = async (interestId: string) => {
    await StorageService.updateInterestStatus(interestId, 'declined');
    await loadData();
  };

  if (!currentUser) return null;

  // Filter lists based on tab
  const receivedList = interests.filter(
    i => i.receiverProfileId === currentUser.activeProfileId && i.status === 'pending'
  );
  const sentList = interests.filter(i => i.senderProfileId === currentUser.activeProfileId);
  const acceptedList = interests.filter(
    i =>
      (i.senderProfileId === currentUser.activeProfileId ||
        i.receiverProfileId === currentUser.activeProfileId) &&
      i.status === 'accepted'
  );
  const declinedList = interests.filter(
    i =>
      (i.senderProfileId === currentUser.activeProfileId ||
        i.receiverProfileId === currentUser.activeProfileId) &&
      i.status === 'declined'
  );

  let currentItems = receivedList;
  if (tab === 'sent') currentItems = sentList;
  if (tab === 'accepted') currentItems = acceptedList;
  if (tab === 'declined') currentItems = declinedList;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={onToggleLanguage}
        unreadNotificationsCount={unreadCount}
        onNotificationPress={onNotificationPress}
        onAdminPress={onAdminPress}
        isAdmin={isAdmin}
        title={t.tabInterests}
        subtitle="Manage member interests & matchmaking requests"
      />

      {/* Tabs Row */}
      <View style={styles.tabContainer}>
        {[
          { id: 'received', label: `${t.receivedCount} (${receivedList.length})` },
          { id: 'sent', label: `${t.sentCount} (${sentList.length})` },
          { id: 'accepted', label: `${t.acceptedCount} (${acceptedList.length})` },
          { id: 'declined', label: `Declined (${declinedList.length})` },
        ].map(item => {
          const active = tab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setTab(item.id as any)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Interest Items List */}
      <FlatList
        data={currentItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const otherProfileId =
            item.senderProfileId === currentUser.activeProfileId
              ? item.receiverProfileId
              : item.senderProfileId;
          const otherProfile = profilesMap[otherProfileId];

          if (!otherProfile) return null;

          const isReceivedPending =
            tab === 'received' && item.receiverProfileId === currentUser.activeProfileId;

          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardMainRow}
                onPress={() => onProfilePress(otherProfile)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: otherProfile.photos[0] }} style={styles.avatar} />

                <View style={styles.infoCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText} numberOfLines={1}>
                      {otherProfile.name}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        item.status === 'accepted'
                          ? styles.statusAccepted
                          : item.status === 'pending'
                          ? styles.statusPending
                          : styles.statusDeclined,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          item.status === 'accepted' && styles.statusBadgeTextAccepted,
                          item.status === 'pending' && styles.statusBadgeTextPending,
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.subText}>
                    {otherProfile.age} Yrs • {otherProfile.caste} • {otherProfile.currentCity}
                  </Text>
                  <Text style={styles.occupationText} numberOfLines={1}>
                    {otherProfile.educationCareer.occupation}
                  </Text>

                  {item.message && (
                    <Text style={styles.messageBox} numberOfLines={2}>
                      "{item.message}"
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Action Buttons */}
              {isReceivedPending ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => handleDecline(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.declineBtnText}>{t.decline}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAccept(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.acceptBtnText}>{t.accept} Interest</Text>
                  </TouchableOpacity>
                </View>
              ) : item.status === 'accepted' ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => onChatPress(otherProfile)}
                    activeOpacity={0.85}
                  >
                    <CustomIcon name="message" size={15} color={Colors.creme} />
                    <Text style={styles.chatBtnText}>Start Conversation</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <CustomIcon name="heart" size={36} color={Colors.dustyPink} />
            <Text style={styles.emptyTitle}>No {tab} interests yet</Text>
            <Text style={styles.emptySub}>
              Browse matching profiles and express interest to get conversations started.
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.sandLight,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: Colors.burgundy,
    ...Shadows.subtle,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.sand,
    ...Shadows.editorial,
  },
  cardMainRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.sandLight,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.burgundy,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.sm,
  },
  statusPending: {
    backgroundColor: Colors.dustyPinkLight,
  },
  statusAccepted: {
    backgroundColor: Colors.successLight,
  },
  statusDeclined: {
    backgroundColor: Colors.sandLight,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  statusBadgeTextPending: {
    color: Colors.burgundy,
  },
  statusBadgeTextAccepted: {
    color: Colors.success,
  },
  subText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  occupationText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  messageBox: {
    fontSize: Typography.caption,
    fontStyle: 'italic',
    color: Colors.burgundy,
    marginTop: 5,
    backgroundColor: Colors.creme,
    padding: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.sandLight,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    borderWidth: 1.2,
    borderColor: Colors.burgundy,
    alignItems: 'center',
    backgroundColor: Colors.creme,
  },
  declineBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.burgundy,
  },
  acceptBtn: {
    flex: 1.5,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.burgundy,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.creme,
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.burgundy,
    gap: 6,
    ...Shadows.editorial,
  },
  chatBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.creme,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 50,
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
