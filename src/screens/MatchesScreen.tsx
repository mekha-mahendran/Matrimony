/**
 * Manamaalai Matrimony — Modern Chat & Messages Screen (4th Tab)
 *
 * Implements the exact design from the reference screenshot:
 * - Royal Purple Hero Header (#6D53F5) with:
 *     - Circular white back button (←)
 *     - Center title "Chat" in white
 *     - Circular white search button (magnifying glass)
 *     - Horizontal Active / Online Story Avatars row with green status dots & white names
 * - White Rounded Sheet Body (borderTopLeftRadius: 30, borderTopRightRadius: 30):
 *     - Conversation cards with subtle borders
 *     - Left circular avatar with green online status dot
 *     - Contact name (e.g. "Carla Schoen", "Sheila Lemke", "Deanna Botsford", etc.)
 *     - Last message preview ("How Are You?", "Thanks", "Welcome!", "Good Morning!")
 *     - Right timestamp ("09:34 PM")
 * - Tapping a conversation opens the full chat screen
 * - Story viewer modal support for story avatars
 */

import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { StoryViewerModal, StoryUser } from '../components/StoryViewerModal';
import { Language } from '../localization';
import { MatrimonyProfile } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

interface ChatStoryUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isOnline: boolean;
  unreadCount?: number;
  profile: Partial<MatrimonyProfile>;
}

// Active story contacts matching top row in reference screenshot
const CHAT_STORIES: (ChatStoryUser & StoryUser)[] = [
  {
    id: 'cs-1',
    name: 'Jenny',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    slides: [
      { id: 'cs1-1', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80' },
      { id: 'cs1-2', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    id: 'cs-2',
    name: 'Leslie',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    slides: [
      { id: 'cs2-1', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    id: 'cs-3',
    name: 'Bessie',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    slides: [
      { id: 'cs3-1', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    id: 'cs-4',
    name: 'Jerom',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    slides: [
      { id: 'cs4-1', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  {
    id: 'cs-5',
    name: 'Jerom',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    slides: [
      { id: 'cs5-1', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
];

// Conversation list matching exact names and messages from reference screenshot
const CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_1',
    name: 'Carla Schoen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'How Are You?',
    time: '09:34 PM',
    isOnline: true,
    profile: {
      id: 'p_carla',
      name: 'Carla Schoen',
      age: 23,
      gender: 'bride',
      currentCity: 'New York',
      currentCountry: 'USA',
      photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'],
    },
  },
  {
    id: 'conv_2',
    name: 'Sheila Lemke',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'Thanks',
    time: '09:34 PM',
    isOnline: true,
    profile: {
      id: 'p_sheila',
      name: 'Sheila Lemke',
      age: 24,
      gender: 'bride',
      currentCity: 'New York',
      currentCountry: 'USA',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'],
    },
  },
  {
    id: 'conv_3',
    name: 'Deanna Botsford',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'Welcome!',
    time: '09:34 PM',
    isOnline: false,
    profile: {
      id: 'p_deanna',
      name: 'Deanna Botsford',
      age: 25,
      gender: 'bride',
      currentCity: 'New York',
      currentCountry: 'USA',
      photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'],
    },
  },
  {
    id: 'conv_4',
    name: 'Katie Bergnaum',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'Good Morning!',
    time: '09:34 PM',
    isOnline: true,
    profile: {
      id: 'p_katie',
      name: 'Katie Bergnaum',
      age: 23,
      gender: 'bride',
      currentCity: 'New York',
      currentCountry: 'USA',
      photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'],
    },
  },
  {
    id: 'conv_5',
    name: 'Armando Ferry',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'Good Morning!',
    time: '09:34 PM',
    isOnline: false,
    profile: {
      id: 'p_armando',
      name: 'Armando Ferry',
      age: 26,
      gender: 'bride',
      currentCity: 'New York',
      currentCountry: 'USA',
      photos: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'],
    },
  },
  {
    id: 'conv_6',
    name: 'Annette Fritsch',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'Thanks!',
    time: '09:34 PM',
    isOnline: true,
    profile: {
      id: 'p_annette',
      name: 'Annette Fritsch',
      age: 24,
      gender: 'bride',
      currentCity: 'New York',
      currentCountry: 'USA',
      photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'],
    },
  },
];

interface MatchesScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onNotificationPress?: () => void;
  onAdminPress?: () => void;
  onProfilePress?: (profile: MatrimonyProfile) => void;
  onChatPress?: (profile: MatrimonyProfile) => void;
  onBack?: () => void;
  onViewHoroscopePorutham?: (porutham: any) => void;
  onDailyRecommendationsPress?: () => void;
  unreadCount?: number;
  isAdmin?: boolean;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  language,
  onProfilePress,
  onChatPress,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const displayedConversations = CHAT_CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenConversation = (conv: ChatConversation) => {
    if (onChatPress && conv.profile) {
      onChatPress(conv.profile as MatrimonyProfile);
    } else if (onProfilePress && conv.profile) {
      onProfilePress(conv.profile as MatrimonyProfile);
    }
  };

  const handleStoryPress = (index: number) => {
    setSelectedStoryIndex(index);
    setStoryViewerVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ─── 1. Royal Purple Hero Header ─────────────────────────────────── */}
      <View style={[styles.purpleHeader, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        {/* Top Action Bar */}
        <View style={styles.topBarRow}>
          {/* Circular White Back Button */}
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.5}>
              <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.headerTitle}>
            {isTa ? 'அரட்டை' : 'Chat'}
          </Text>

          {/* Circular White Search Button */}
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => setIsSearchActive(!isSearchActive)}
            activeOpacity={0.8}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.5}>
              <Circle cx="11" cy="11" r="8" />
              <Path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Optional Search Bar when Search Button is Toggled */}
        {isSearchActive && (
          <View style={styles.headerSearchWrap}>
            <TextInput
              style={styles.headerSearchInput}
              placeholder={isTa ? 'செய்திகளைத் தேடு...' : 'Search conversations...'}
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        )}

        {/* Horizontal Story / Online Avatars Row */}
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {CHAT_STORIES.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={styles.storyItem}
                activeOpacity={0.85}
                onPress={() => handleStoryPress(idx)}
              >
                {/* Avatar with Online Dot */}
                <View style={styles.storyAvatarWrap}>
                  <Image source={{ uri: item.avatar }} style={styles.storyAvatar} resizeMode="cover" />
                  {item.isOnline && (
                    <View style={styles.storyOnlineDot} />
                  )}
                </View>
                <Text style={styles.storyNameText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* ─── 2. White Rounded Bottom Sheet Body ──────────────────────────── */}
      <View style={styles.whiteSheet}>
        <FlatList
          data={displayedConversations}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.conversationsList,
            { paddingBottom: Math.max(insets.bottom + 95, 115) },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversationCard}
              activeOpacity={0.78}
              onPress={() => handleOpenConversation(item)}
            >
              {/* Left Avatar with Online Dot */}
              <View style={styles.avatarWrap}>
                <Image source={{ uri: item.avatar }} style={styles.cardAvatar} resizeMode="cover" />
                {item.isOnline && (
                  <View style={styles.onlineDot} />
                )}
              </View>

              {/* Center Info: Name & Last Message */}
              <View style={styles.conversationInfo}>
                <Text style={styles.senderName}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>

              {/* Right Timestamp */}
              <Text style={styles.timestampText}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ─── 3. Story Viewer Modal ───────────────────────────────────────── */}
      <StoryViewerModal
        visible={storyViewerVisible}
        initialUserIndex={selectedStoryIndex}
        users={CHAT_STORIES}
        onClose={() => setStoryViewerVisible(false)}
        onSendReply={(userName, text) => {
          // Send message to conversation
        }}
        isTa={isTa}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_PURPLE,
  },

  /* Purple Hero Header */
  purpleHeader: {
    backgroundColor: BRAND_PURPLE,
    paddingBottom: 18,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSearchWrap: {
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  headerSearchInput: {
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 14,
  },

  /* Stories Horizontal Row */
  storiesContainer: {
    marginTop: 4,
  },
  storiesScroll: {
    paddingHorizontal: 18,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
  },
  storyAvatarWrap: {
    position: 'relative',
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E7EB',
  },
  storyOnlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  storyNameText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* White Rounded Body Sheet */
  whiteSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingTop: 16,
  },
  conversationsList: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarWrap: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  senderName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181D',
    marginBottom: 3,
  },
  lastMessage: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginLeft: 8,
  },
});
