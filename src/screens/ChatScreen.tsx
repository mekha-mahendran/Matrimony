/**
 * Manamaalai Matrimony — Modern Chat Conversation Screen
 *
 * Implements the exact design from the reference screenshot:
 * - Royal Purple Hero Header (#6D53F5):
 *     - Circular white back button with purple arrow
 *     - Contact avatar, name (e.g. "Jerom Flores"), and "Online" status indicator
 *     - Circular white 3-dots menu button
 * - White Rounded Sheet Body (borderTopLeftRadius: 28, borderTopRightRadius: 28):
 *     - Date header separator "T O D A Y"
 *     - Incoming message bubble (white card) with sender avatar, name & timestamp
 *     - Outgoing message bubble (purple #6D53F5) with timestamp & user name
 *     - Shared photo message card with preview
 *     - Interactive Voice Note / Audio waveform bubble with play button and duration (• 0:13)
 * - Floating Bottom Input Bar:
 *     - Attachment button (+)
 *     - "Type a message here..." input
 *     - Purple send / microphone button
 * - Keyboard-aware layout
 */

import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';
import { MatrimonyProfile } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  type: 'text' | 'image' | 'voice';
  text?: string;
  imageUrl?: string;
  voiceDuration?: string;
  time: string;
}

interface ChatScreenProps {
  partnerProfile: MatrimonyProfile;
  language: Language;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  partnerProfile,
  language,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const partnerName = partnerProfile?.name || 'Jerom Flores';
  const partnerAvatar = partnerProfile?.photos?.[0] ||
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80';
  const myAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
  const myName = 'John Doe';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'them',
      type: 'text',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      time: '08:04 pm',
    },
    {
      id: 'msg-2',
      sender: 'me',
      type: 'text',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      time: '08:04 pm',
    },
    {
      id: 'msg-3',
      sender: 'them',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      time: '08:04 pm',
    },
    {
      id: 'msg-4',
      sender: 'me',
      type: 'voice',
      voiceDuration: '0:13',
      time: '08:04 pm',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) {
      // Toggle simulated voice note if empty
      const voiceMsg: ChatMessage = {
        id: `voice-${Date.now()}`,
        sender: 'me',
        type: 'voice',
        voiceDuration: '0:08',
        time: getCurrentTime(),
      };
      setMessages(prev => [...prev, voiceMsg]);
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      type: 'text',
      text: inputText.trim(),
      time: getCurrentTime(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const handleSendPhoto = () => {
    const photoMsg: ChatMessage = {
      id: `img-${Date.now()}`,
      sender: 'me',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      time: getCurrentTime(),
    };
    setMessages(prev => [...prev, photoMsg]);
  };

  const getCurrentTime = () => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleMoreOptions = () => {
    Alert.alert(
      partnerName,
      isTa ? 'செயல்கள்:' : 'Chat Options:',
      [
        { text: isTa ? 'சுயவிவரம் பார்க்க' : 'View Profile', onPress: () => {} },
        { text: isTa ? 'அறிக்கையிடு' : 'Report', style: 'destructive' },
        { text: isTa ? 'ரத்துசெய்' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* ─── 1. Royal Purple Hero Header ─────────────────────────────────── */}
      <View style={[styles.purpleHeader, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.topHeaderRow}>
          {/* Circular White Back Button */}
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.5}>
              <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          {/* Partner Avatar, Name & Online Status */}
          <View style={styles.partnerInfo}>
            <Image source={{ uri: partnerAvatar }} style={styles.headerAvatar} resizeMode="cover" />
            <View style={styles.partnerTextWrap}>
              <Text style={styles.partnerName} numberOfLines={1}>
                {partnerName}
              </Text>
              <Text style={styles.partnerStatus}>
                {isTa ? 'ஆன்லைனில்' : 'Online'}
              </Text>
            </View>
          </View>

          {/* Circular White 3-Dots Action Button */}
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={handleMoreOptions}
            activeOpacity={0.8}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill={BRAND_PURPLE}>
              <Circle cx="12" cy="5" r="2.2" />
              <Circle cx="12" cy="12" r="2.2" />
              <Circle cx="12" cy="19" r="2.2" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── 2. White Rounded Sheet Body ─────────────────────────────────── */}
      <View style={styles.whiteBody}>
        {/* Date Divider */}
        <View style={styles.dateDivider}>
          <Text style={styles.dateDividerText}>
            {isTa ? 'இ ன் று' : 'T O D A Y'}
          </Text>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => {
            const isMe = item.sender === 'me';

            // Text message
            if (item.type === 'text') {
              return (
                <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
                  {/* Bubble */}
                  <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                    <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                      {item.text}
                    </Text>
                  </View>

                  {/* Subtitle Row (Avatar, Name, Timestamp) */}
                  <View style={[styles.metaRow, isMe ? styles.metaRowMe : styles.metaRowThem]}>
                    {!isMe ? (
                      <>
                        <Image source={{ uri: partnerAvatar }} style={styles.metaAvatar} />
                        <Text style={styles.metaName}>{partnerName}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.metaTime}>{item.time}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.metaTime}>{item.time}</Text>
                        <View style={{ flex: 1 }} />
                        <Image source={{ uri: myAvatar }} style={styles.metaAvatar} />
                        <Text style={styles.metaName}>{myName}</Text>
                      </>
                    )}
                  </View>
                </View>
              );
            }

            // Image message
            if (item.type === 'image') {
              return (
                <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
                  <View style={styles.imageCard}>
                    <Image source={{ uri: item.imageUrl }} style={styles.messageImage} resizeMode="cover" />
                  </View>

                  {/* Subtitle Row */}
                  <View style={[styles.metaRow, isMe ? styles.metaRowMe : styles.metaRowThem]}>
                    {!isMe ? (
                      <>
                        <Image source={{ uri: partnerAvatar }} style={styles.metaAvatar} />
                        <Text style={styles.metaName}>{partnerName}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.metaTime}>{item.time}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.metaTime}>{item.time}</Text>
                        <View style={{ flex: 1 }} />
                        <Image source={{ uri: myAvatar }} style={styles.metaAvatar} />
                        <Text style={styles.metaName}>{myName}</Text>
                      </>
                    )}
                  </View>
                </View>
              );
            }

            // Voice Note message
            if (item.type === 'voice') {
              return (
                <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
                  <View style={styles.voiceBubble}>
                    {/* Play / Pause button */}
                    <TouchableOpacity
                      style={styles.voicePlayBtn}
                      activeOpacity={0.8}
                      onPress={() => setIsPlayingVoice(!isPlayingVoice)}
                    >
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill={BRAND_PURPLE}>
                        {isPlayingVoice ? (
                          <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        ) : (
                          <Path d="M8 5v14l11-7z" />
                        )}
                      </Svg>
                    </TouchableOpacity>

                    {/* Waveform Graphic */}
                    <View style={styles.waveformContainer}>
                      {[10, 16, 22, 14, 28, 20, 15, 26, 22, 12, 18, 24, 16, 28, 22, 14, 20, 26, 12, 8, 14, 20, 16].map((h, i) => (
                        <View
                          key={i}
                          style={[
                            styles.waveBar,
                            { height: h, opacity: isPlayingVoice ? 1 : 0.85 },
                          ]}
                        />
                      ))}
                    </View>

                    {/* Duration */}
                    <Text style={styles.voiceDurationText}>• {item.voiceDuration || '0:13'}</Text>
                  </View>

                  {/* Subtitle Row */}
                  <View style={[styles.metaRow, isMe ? styles.metaRowMe : styles.metaRowThem]}>
                    <Text style={styles.metaTime}>{item.time}</Text>
                    <View style={{ flex: 1 }} />
                    <Image source={{ uri: myAvatar }} style={styles.metaAvatar} />
                    <Text style={styles.metaName}>{myName}</Text>
                  </View>
                </View>
              );
            }

            return null;
          }}
        />

        {/* ─── 3. Floating Bottom Input Bar ──────────────────────────────── */}
        <View style={[styles.inputBarWrap, { paddingBottom: Math.max(insets.bottom + 8, 14) }]}>
          <View style={styles.inputBar}>
            {/* Attachment Button (+) */}
            <TouchableOpacity
              style={styles.attachBtn}
              onPress={handleSendPhoto}
              activeOpacity={0.75}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2.4}>
                <Path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>

            {/* Text Input */}
            <TextInput
              style={styles.textInput}
              placeholder={isTa ? 'செய்தியை உள்ளிடவும்...' : 'Type a message here...'}
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />

            {/* Purple Action Button: Send Paper Airplane or Microphone */}
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              activeOpacity={0.85}
            >
              {inputText.trim().length > 0 ? (
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
                  <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </Svg>
              ) : (
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
                  <Path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <Path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </Svg>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCircleBtn: {
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
  partnerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  partnerTextWrap: {
    marginLeft: 10,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  partnerStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },

  /* White Body Sheet */
  whiteBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  dateDivider: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  dateDividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 2,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  /* Message Rows */
  messageRow: {
    marginBottom: 16,
    width: '100%',
  },
  messageRowThem: {
    alignItems: 'flex-start',
  },
  messageRowMe: {
    alignItems: 'flex-end',
  },

  /* Bubbles */
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    maxWidth: SCREEN_WIDTH * 0.78,
  },
  bubbleThem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderTopLeftRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleMe: {
    backgroundColor: BRAND_PURPLE,
    borderTopRightRadius: 6,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextThem: {
    color: '#18181D',
    fontWeight: '400',
  },
  bubbleTextMe: {
    color: '#FFFFFF',
    fontWeight: '400',
  },

  /* Image Card */
  imageCard: {
    width: 220,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  messageImage: {
    width: '100%',
    height: '100%',
  },

  /* Voice Note Bubble */
  voiceBubble: {
    width: SCREEN_WIDTH * 0.76,
    backgroundColor: BRAND_PURPLE,
    borderRadius: 18,
    borderTopRightRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voicePlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    paddingHorizontal: 4,
  },
  waveBar: {
    width: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  voiceDurationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Meta Subtitle Row (Avatar, Name, Timestamp) */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
    width: '100%',
  },
  metaRowThem: {
    maxWidth: SCREEN_WIDTH * 0.85,
  },
  metaRowMe: {
    maxWidth: SCREEN_WIDTH * 0.85,
    justifyContent: 'flex-end',
  },
  metaAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  metaName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  metaTime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginLeft: 6,
  },

  /* Floating Bottom Input Bar */
  inputBarWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#18181D',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
