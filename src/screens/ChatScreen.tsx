import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { Language } from '../localization';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { MatrimonyProfile } from '../types';

interface ChatScreenProps {
  partnerProfile: MatrimonyProfile;
  language: Language;
  onBack: () => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  partnerProfile,
  language,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'them',
      text: `Vanakkam! Glad our horoscopes matched and our families are aligned. Looking forward to knowing you better.`,
      time: '10:30 AM',
    },
    {
      id: 'm2',
      sender: 'me',
      text: `Vanakkam ${partnerProfile.name.split(' ')[0]}! We reviewed your profile and were very impressed with your background.`,
      time: '10:35 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: 'Just now',
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const QUICK_CHIPS = [
    'Vanakkam! 🙏',
    'Shall our families speak this Sunday?',
    'Our 10-Porutham report is very auspicious! ✨',
    'What are your favourite weekend hobbies?',
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title={partnerProfile.name}
        subtitle={`${partnerProfile.matrimonyId} • Mutual Match`}
      />

      {/* Safety Notice Banner */}
      <View style={styles.safetyNotice}>
        <CustomIcon name="shield" size={13} color={Colors.burgundy} />
        <Text style={styles.safetyNoticeText}>
          Direct chat enabled for verified mutual matches. Please keep conversations courteous and
          family-oriented.
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isMe = item.sender === 'me';
          return (
            <View
              style={[
                styles.messageBubble,
                isMe ? styles.messageBubbleMe : styles.messageBubbleThem,
              ]}
            >
              <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                {item.text}
              </Text>
              <Text style={[styles.timeText, isMe && styles.timeTextMe]}>
                {item.time}
              </Text>
            </View>
          );
        }}
      />

      {/* Quick Suggestion Chips */}
      <View style={styles.quickChipsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_CHIPS.map((chip, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.chip}
              onPress={() => setInputText(chip)}
            >
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a family-friendly message..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor={Colors.textMuted}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.88}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  safetyNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.sandLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand,
  },
  safetyNoticeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    flex: 1,
  },
  messagesList: {
    padding: Spacing.md,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '82%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  messageBubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.sandLight,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  messageBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.burgundy,
    borderBottomRightRadius: 2,
  },
  messageText: {
    fontSize: Typography.bodyRegular,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  messageTextMe: {
    color: Colors.creme,
  },
  timeText: {
    fontSize: 9,
    color: Colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timeTextMe: {
    color: Colors.dustyPinkLight,
  },
  quickChipsRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    backgroundColor: Colors.creme,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
  },
  chip: {
    backgroundColor: Colors.sandLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginRight: 6,
  },
  chipText: {
    fontSize: Typography.caption,
    color: Colors.burgundy,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    backgroundColor: Colors.creme,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: Typography.bodyRegular,
    color: Colors.textPrimary,
  },
  sendBtn: {
    backgroundColor: Colors.burgundy,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
  },
  sendBtnText: {
    color: Colors.creme,
    fontWeight: '700',
    fontSize: Typography.bodySmall,
  },
});
