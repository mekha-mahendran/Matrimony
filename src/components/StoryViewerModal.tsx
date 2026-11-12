/**
 * Manamaalai Matrimony (மணமாலை) — Modern Fullscreen Story Viewer Modal
 *
 * Implements the exact design from the reference screenshot:
 * - Fullscreen vertical hero photo
 * - Segmented progress bars across the top with active purple fill (#6D53F5)
 * - User Avatar, Name ("Leslie") + Golden Verified Star Badge ✓
 * - Top-right Close Button (✕)
 * - Tap Left (Previous) / Tap Right (Next) / Long Press (Pause)
 * - Floating White Reply Bar at bottom:
 *     - "Type a message here..." input
 *     - Vibrant purple send button with white paper airplane icon
 * - KeyboardAvoidingView support for smooth typing
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';
const STORY_DURATION = 4500; // 4.5 seconds per slide

export interface StorySlide {
  id: string;
  image: string;
}

export interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  slides: StorySlide[];
}

export interface StoryViewerModalProps {
  visible: boolean;
  initialUserIndex: number;
  users: StoryUser[];
  onClose: () => void;
  onSendReply?: (userName: string, text: string) => void;
  isTa?: boolean;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  visible,
  initialUserIndex = 0,
  users,
  onClose,
  onSendReply,
  isTa = false,
}) => {
  const insets = useSafeAreaInsets();

  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const currentDurationRef = useRef(STORY_DURATION);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentUser = users[currentUserIndex] || users[0];
  const slides = currentUser?.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Sync initial user index when opened
  useEffect(() => {
    if (visible) {
      setCurrentUserIndex(Math.max(0, Math.min(initialUserIndex, users.length - 1)));
      setCurrentSlideIndex(0);
      setReplyText('');
      setToastMessage(null);
      setIsPaused(false);
    }
  }, [visible, initialUserIndex]);

  // Handle story progress animation
  useEffect(() => {
    if (!visible || !currentSlide || isPaused) {
      if (animRef.current) animRef.current.stop();
      return;
    }

    progressAnim.setValue(0);
    animRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: currentDurationRef.current,
      useNativeDriver: false,
    });

    animRef.current.start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });

    return () => {
      if (animRef.current) animRef.current.stop();
    };
  }, [visible, currentUserIndex, currentSlideIndex, isPaused]);

  // Navigate to next slide or next user
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
    } else {
      onClose();
    }
  };

  // Navigate to previous slide or previous user
  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      const prevUser = users[currentUserIndex - 1];
      setCurrentUserIndex(prev => prev - 1);
      setCurrentSlideIndex(prevUser ? prevUser.slides.length - 1 : 0);
    }
  };

  // Pause on touch down
  const handlePressIn = () => {
    setIsPaused(true);
  };

  // Resume on touch up
  const handlePressOut = () => {
    setIsPaused(false);
  };

  // Send reply handler
  const handleSend = () => {
    if (!replyText.trim()) return;

    const sentText = replyText.trim();
    if (onSendReply) {
      onSendReply(currentUser.name, sentText);
    }

    Keyboard.dismiss();
    setReplyText('');
    setToastMessage(isTa ? `${currentUser.name} வரனுக்கு பதில் அனுப்பப்பட்டது! 💜` : `Reply sent to ${currentUser.name}! 💜`);

    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  if (!visible || !currentUser || !currentSlide) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Fullscreen Hero Background Image */}
        <Image
          source={{ uri: currentSlide.image }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Subtle Top & Bottom Gradient Shadows for readability */}
        <View style={styles.topVignette} pointerEvents="none" />
        <View style={styles.bottomVignette} pointerEvents="none" />

        {/* Tap Gestures for Story Navigation (Left 30% / Right 70%) */}
        <View style={styles.gesturesLayer} pointerEvents="box-none">
          <TouchableWithoutFeedback
            onPress={handlePrevious}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.leftTapZone} />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={handleNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.rightTapZone} />
          </TouchableWithoutFeedback>
        </View>

        {/* ── Top Header Section (Progress Bars + User Info) ────── */}
        <View style={[styles.topHeader, { paddingTop: Math.max(insets.top + 8, 24) }]} pointerEvents="box-none">
          {/* Segmented Progress Bars */}
          <View style={styles.progressBarsRow}>
            {slides.map((_, idx) => {
              const isPast = idx < currentSlideIndex;
              const isCurrent = idx === currentSlideIndex;

              return (
                <View key={idx} style={styles.progressBarTrack}>
                  {isPast ? (
                    <View style={styles.progressBarFilled} />
                  ) : isCurrent ? (
                    <Animated.View
                      style={[
                        styles.progressBarFilled,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>

          {/* User Avatar, Name & Verified Badge */}
          <View style={styles.userRow} pointerEvents="box-none">
            <View style={styles.userInfoLeft}>
              <Image source={{ uri: currentUser.avatar }} style={styles.avatarImg} />
              <Text style={styles.userName}>{currentUser.name}</Text>

              {/* Golden Verified Star Badge */}
              <View style={styles.verifiedBadge}>
                <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M5 13l4 4L19 7"
                    stroke="#18181D"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.4}>
                <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Bottom Reply Input Bar (Keyboard Aware) ──────────── */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[
            styles.bottomKeyboardWrap,
            { paddingBottom: Math.max(insets.bottom + 12, 18) },
          ]}
          pointerEvents="box-none"
        >
          {/* Confirmation Toast */}
          {toastMessage && (
            <View style={styles.toastCard}>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}

          {/* Floating White Input Pill */}
          <View style={styles.replyBar}>
            <TextInput
              style={styles.replyInput}
              placeholder={isTa ? 'செய்தியை இங்கே தட்டச்சு செய்க...' : 'Type a message here...'}
              placeholderTextColor="#9CA3AF"
              value={replyText}
              onChangeText={setReplyText}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />

            {/* Purple Send Button with White Paper Airplane */}
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.85}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FFFFFF">
                <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </Svg>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  /* Gesture Zones */
  gesturesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  leftTapZone: {
    width: '32%',
    height: '100%',
  },
  rightTapZone: {
    width: '68%',
    height: '100%',
  },

  /* Top Header */
  topHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    zIndex: 20,
  },
  progressBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  progressBarTrack: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    overflow: 'hidden',
  },
  progressBarFilled: {
    height: '100%',
    backgroundColor: BRAND_PURPLE,
    borderRadius: 2,
  },

  /* User Info Row */
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verifiedBadge: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom Reply Bar */
  bottomKeyboardWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 30,
  },
  toastCard: {
    backgroundColor: 'rgba(27, 26, 34, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  replyBar: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  replyInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
