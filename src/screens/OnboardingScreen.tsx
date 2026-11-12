import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';
import { LanguageToggle } from '../components/LanguageToggle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Vibrant royal purple matching the splash & welcome screens
const BRAND_PURPLE = '#6D53F5';
const BRAND_PURPLE_DARK = '#533CE0';
const ACTIVE_DOT_COLOR = '#6D53F5';
const INACTIVE_DOT_COLOR = '#E4E0F4';
const STAR_YELLOW = '#FFCE00';

export interface OnboardingScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

interface SlideData {
  id: string;
  type: 'card' | 'map' | 'chat';
  titlePart1En?: string;
  titlePart2En?: string;
  titlePart1Ta?: string;
  titlePart2Ta?: string;
  titlePurpleEn?: string;
  titleRestEn?: string;
  titleLine2En?: string;
  titlePurpleTa?: string;
  titleRestTa?: string;
  titleLine2Ta?: string;
  descEn: string;
  descTa: string;
  locationEn?: string;
  locationTa?: string;
  profileName?: string;
  profileLocationEn?: string;
  profileLocationTa?: string;
  distance?: string;
  imageSource?: any;
}

const SLIDES: SlideData[] = [
  {
    id: '1',
    type: 'card',
    titlePart1En: 'Connect with Your',
    titlePart2En: 'Ideal Matches',
    titlePart1Ta: 'உங்கள் கனவுத் துணையுடன்',
    titlePart2Ta: 'இணையுங்கள்',
    descEn:
      'Discover authentic life partners tailored to your values, traditions, and preferences. Connect with verified brides & grooms.',
    descTa:
      'உங்கள் மதிப்பீடுகள், கலாச்சாரம் மற்றும் விருப்பங்களுக்கு ஏற்ப பொருத்தமான தமிழ் வரன்களை எளிதாகக் கண்டறியுங்கள்.',
    locationEn: 'Chennai, Tamil Nadu',
    locationTa: 'சென்னை, தமிழ்நாடு',
    profileName: 'Priya Sundaram',
    profileLocationEn: 'CHENNAI, TAMIL NADU',
    profileLocationTa: 'சென்னை, தமிழ்நாடு',
    distance: '12.6 km away',
    imageSource: require('../assets/images/bride_avatar.jpg'),
  },
  {
    id: '2',
    type: 'map',
    titlePurpleEn: 'Meeting New People',
    titleRestEn: ' in',
    titleLine2En: 'Your Area',
    titlePurpleTa: 'உங்கள் பகுதியில்',
    titleRestTa: ' உள்ள',
    titleLine2Ta: 'வரன்களைக் காணுங்கள்',
    descEn:
      'Discover verified matches living near your location. Explore authentic brides & grooms around you effortlessly.',
    descTa:
      'உங்கள் பகுதியில் உள்ள சரிபார்க்கப்பட்ட தமிழ் வரன்களை வரைபடம் மூலம் நேரடியாகக் கண்டறிந்து இணையுங்கள்.',
  },
  {
    id: '3',
    type: 'chat',
    titlePurpleEn: 'Engage and Connect:',
    titleRestEn: '',
    titleLine2En: 'Chat and Call',
    titlePurpleTa: 'உரையாடி இணையுங்கள்:',
    titleRestTa: '',
    titleLine2Ta: 'சாட் மற்றும் அழைப்புகள்',
    descEn:
      'Direct, respectful conversations with government-ID verified Tamil brides, grooms, and trusted family circles.',
    descTa:
      'சரிபார்க்கப்பட்ட வரன்களுடன் நேரடியாக மெசேஜ் மற்றும் ஆடியோ/வீடியோ அழைப்புகள் மூலம் பாதுகாப்பாகப் பேசுங்கள்.',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  language,
  onToggleLanguage,
  onComplete,
  onSkip,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.25,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -15,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.25,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 15,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  // Significantly enlarged responsive phone mockup dimensions (main visual centerpiece)
  const phoneHeight = Math.min(SCREEN_HEIGHT * 0.50, 425);
  const phoneWidth = Math.min(SCREEN_WIDTH * 0.82, Math.round(phoneHeight * 0.74));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ── Top Bar: Language Toggle on left, Skip button on right ── */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        {onToggleLanguage ? (
          <LanguageToggle language={language} onToggle={onToggleLanguage} size="small" />
        ) : (
          <View style={styles.topSpacer} />
        )}
        <TouchableOpacity
          onPress={onSkip}
          hitSlop={{ top: 14, bottom: 14, left: 18, right: 18 }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Skip intro"
        >
          <Text style={styles.skipButtonText}>
            {isTa ? 'தவிர்' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Continuous Main Flow: Phone Section + Seamless Curved Bottom Sheet ── */}
      <View style={styles.mainFlowContainer}>
        {/* 1. In-App Android Phone Mockup */}
        <View style={styles.phoneSection}>
          <Animated.View
            style={[
              styles.phoneFrame,
              {
                width: phoneWidth,
                height: phoneHeight,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Dynamic Island / Notch */}
            <View style={styles.dynamicIsland} />

            {/* Android In-Phone Screen Content */}
            {slide.type === 'chat' ? (
              /* ─── CHAT & CALL VIEW (Page 3: Engage and Connect: Chat and Call) ─── */
              <View style={styles.phoneChatScreen}>
                {/* Purple Top Header Area */}
                <View style={styles.phoneChatHeaderArea}>
                  {/* Status Bar (White icons on purple) */}
                  <View style={styles.phoneChatStatusBar}>
                    <Text style={styles.phoneChatTimeText}>9:41</Text>
                    <View style={styles.phoneStatusIcons}>
                      <Svg width={12} height={10} viewBox="0 0 12 10" fill="#FFFFFF">
                        <Rect x={0} y={6} width={2} height={4} rx={0.5} />
                        <Rect x={3} y={4} width={2} height={6} rx={0.5} />
                        <Rect x={6} y={2} width={2} height={8} rx={0.5} />
                        <Rect x={9} y={0} width={2} height={10} rx={0.5} />
                      </Svg>
                      <Svg width={12} height={10} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.4}>
                        <Path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                      </Svg>
                      <Svg width={16} height={9} viewBox="0 0 24 13" fill="none" stroke="#FFFFFF" strokeWidth={2}>
                        <Rect x={1} y={1} width={18} height={11} rx={3} />
                        <Rect x={3} y={3} width={12} height={7} rx={1.5} fill="#FFFFFF" />
                        <Path d="M21 4.5v4" strokeLinecap="round" />
                      </Svg>
                    </View>
                  </View>

                  {/* Chat Navigation Header Bar */}
                  <View style={styles.phoneChatNavBar}>
                    {/* White Back Button */}
                    <View style={styles.phoneChatHeaderCircleBtn}>
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.8}>
                        <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </View>

                    {/* Chat User Info (Center) */}
                    <View style={styles.phoneChatHeaderUser}>
                      <Image
                        source={require('../assets/images/story_avatar_1.jpg')}
                        style={styles.phoneChatHeaderAvatar}
                      />
                      <View style={styles.phoneChatHeaderMeta}>
                        <Text style={styles.phoneChatHeaderName}>Jerom Flores</Text>
                        <Text style={styles.phoneChatHeaderStatus}>Online</Text>
                      </View>
                    </View>

                    {/* White 3-Dots Menu Button */}
                    <View style={styles.phoneChatHeaderCircleBtn}>
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill={BRAND_PURPLE}>
                        <Circle cx={12} cy={5} r={2} />
                        <Circle cx={12} cy={12} r={2} />
                        <Circle cx={12} cy={19} r={2} />
                      </Svg>
                    </View>
                  </View>
                </View>

                {/* White Chat Content Body */}
                <View style={styles.phoneChatBody}>
                  {/* TODAY Badge */}
                  <View style={styles.phoneChatTodayRow}>
                    <Text style={styles.phoneChatTodayText}>TODAY</Text>
                  </View>

                  {/* 1. Incoming Message Bubble */}
                  <View style={styles.phoneChatIncomingWrap}>
                    <View style={styles.phoneChatIncomingBubble}>
                      <Text style={styles.phoneChatIncomingText}>
                        Lorem ipsum is simply dummy text of the printing and typesetting industry.
                      </Text>
                    </View>
                    <View style={styles.phoneChatSenderRow}>
                      <Image
                        source={require('../assets/images/story_avatar_1.jpg')}
                        style={styles.phoneChatMiniAvatar}
                      />
                      <Text style={styles.phoneChatSenderName}>Jerom Brekke</Text>
                      <Text style={styles.phoneChatTimestamp}>08:04 pm</Text>
                    </View>
                  </View>

                  {/* 2. Outgoing Message Bubble */}
                  <View style={styles.phoneChatOutgoingWrap}>
                    <View style={styles.phoneChatOutgoingBubble}>
                      <Text style={styles.phoneChatOutgoingText}>
                        Lorem ipsum is simply dummy text of the printing and typesetting industry.
                      </Text>
                    </View>
                    <View style={styles.phoneChatOutgoingSenderRow}>
                      <Text style={styles.phoneChatTimestamp}>08:04 pm</Text>
                      <Text style={styles.phoneChatSenderName}>John Doe</Text>
                      <Image
                        source={require('../assets/images/story_avatar_2.jpg')}
                        style={styles.phoneChatMiniAvatar}
                      />
                    </View>
                  </View>

                  {/* 3. Incoming Image Card */}
                  <View style={styles.phoneChatIncomingWrap}>
                    <View style={styles.phoneChatImageCard}>
                      <Image
                        source={require('../assets/images/bride_avatar.jpg')}
                        style={styles.phoneChatCardImg}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.phoneChatSenderRow}>
                      <Image
                        source={require('../assets/images/story_avatar_1.jpg')}
                        style={styles.phoneChatMiniAvatar}
                      />
                      <Text style={styles.phoneChatSenderName}>Jerom Brekke</Text>
                      <Text style={styles.phoneChatTimestamp}>08:04 pm</Text>
                    </View>
                  </View>

                  {/* 4. Outgoing Voice Note Bar (Peeking at bottom) */}
                  <View style={styles.phoneChatVoiceBarWrap}>
                    <View style={styles.phoneChatVoiceBar}>
                      <Svg width={11} height={11} viewBox="0 0 24 24" fill="#FFFFFF">
                        <Path d="M8 5v14l11-7z" />
                      </Svg>
                      <View style={styles.phoneChatWaveformRow}>
                        {[4, 10, 6, 14, 8, 16, 12, 18, 9, 14, 6, 12, 16, 8, 14, 10, 6, 12].map((barH, i) => (
                          <View key={i} style={[styles.phoneChatWaveBar, { height: barH }]} />
                        ))}
                      </View>
                      <Text style={styles.phoneChatVoiceDuration}>0:42</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : slide.type === 'map' ? (
              /* ─── MAP VIEW (Page 2: Meeting New People in Your Area) ─── */
              <View style={styles.phoneMapScreen}>
                {/* Status Bar */}
                <View style={styles.phoneStatusBar}>
                  <Text style={styles.phoneTimeText}>9:41</Text>
                  <View style={styles.phoneStatusIcons}>
                    <Svg width={12} height={10} viewBox="0 0 12 10" fill="#18181B">
                      <Rect x={0} y={6} width={2} height={4} rx={0.5} />
                      <Rect x={3} y={4} width={2} height={6} rx={0.5} />
                      <Rect x={6} y={2} width={2} height={8} rx={0.5} />
                      <Rect x={9} y={0} width={2} height={10} rx={0.5} />
                    </Svg>
                    <Svg width={12} height={10} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={2.4}>
                      <Path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                    </Svg>
                    <Svg width={16} height={9} viewBox="0 0 24 13" fill="none" stroke="#18181B" strokeWidth={2}>
                      <Rect x={1} y={1} width={18} height={11} rx={3} />
                      <Rect x={3} y={3} width={12} height={7} rx={1.5} fill="#18181B" />
                      <Path d="M21 4.5v4" strokeLinecap="round" />
                    </Svg>
                  </View>
                </View>

                {/* Map Street Background */}
                <Image
                  source={require('../assets/images/onboarding_map_bg.png')}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />

                {/* Top Search Bar & Purple Filter Button */}
                <View style={styles.phoneMapSearchRow}>
                  <View style={styles.phoneSearchInputBox}>
                    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#7C7796" strokeWidth={2.4}>
                      <Circle cx={11} cy={11} r={8} />
                      <Path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </Svg>
                    <Text style={styles.phoneSearchPlaceholder}>
                      {isTa ? 'தேடு' : 'Search'}
                    </Text>
                  </View>
                  <View style={styles.phoneMapFilterBtn}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5}>
                      <Path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                    </Svg>
                  </View>
                </View>

                {/* Pin 1: Top-Left (1.2 Km) */}
                <View style={[styles.mapPinWrap, { top: '23%', left: '14%' }]}>
                  <View style={styles.mapPinAvatarRing}>
                    <Image
                      source={require('../assets/images/story_avatar_1.jpg')}
                      style={styles.mapPinAvatarImg}
                    />
                  </View>
                  <View style={styles.mapPinTag}>
                    <Text style={styles.mapPinTagText}>1.2 Km</Text>
                  </View>
                </View>

                {/* Pin 2: Top-Right (1.4 Km) */}
                <View style={[styles.mapPinWrap, { top: '20%', right: '18%' }]}>
                  <View style={styles.mapPinAvatarRing}>
                    <Image
                      source={require('../assets/images/story_avatar_2.jpg')}
                      style={styles.mapPinAvatarImg}
                    />
                  </View>
                  <View style={styles.mapPinTag}>
                    <Text style={styles.mapPinTagText}>1.4 Km</Text>
                  </View>
                </View>

                {/* Pin 3: Center-Left (1.8 Km) */}
                <View style={[styles.mapPinWrap, { top: '46%', left: '38%' }]}>
                  <View style={styles.mapPinAvatarRing}>
                    <Image
                      source={require('../assets/images/story_avatar_3.jpg')}
                      style={styles.mapPinAvatarImg}
                    />
                  </View>
                  <View style={styles.mapPinTag}>
                    <Text style={styles.mapPinTagText}>1.8 Km</Text>
                  </View>
                </View>

                {/* Pin 4: Center-Right (1.8 Km) */}
                <View style={[styles.mapPinWrap, { top: '46%', right: '14%' }]}>
                  <View style={styles.mapPinAvatarRing}>
                    <Image
                      source={require('../assets/images/story_avatar_4.jpg')}
                      style={styles.mapPinAvatarImg}
                    />
                  </View>
                  <View style={styles.mapPinTag}>
                    <Text style={styles.mapPinTagText}>1.8 Km</Text>
                  </View>
                </View>

                {/* Pin 5: Bottom-Left (1.9 Km) */}
                <View style={[styles.mapPinWrap, { top: '64%', left: '20%' }]}>
                  <View style={styles.mapPinAvatarRing}>
                    <Image
                      source={require('../assets/images/bride_avatar.jpg')}
                      style={styles.mapPinAvatarImg}
                    />
                  </View>
                  <View style={styles.mapPinTag}>
                    <Text style={styles.mapPinTagText}>1.9 Km</Text>
                  </View>
                </View>

                {/* User Radar / Pulse Location Marker */}
                <View style={[styles.mapUserRadarWrap, { top: '61%', right: '28%' }]}>
                  <View style={styles.mapRadarPulseOuter}>
                    <View style={styles.mapRadarCenterDot}>
                      <Svg width={9} height={9} viewBox="0 0 24 24" fill="#FFFFFF">
                        <Path d="M12 2L22 12L12 22L2 12Z" />
                      </Svg>
                    </View>
                  </View>
                </View>

                {/* Floating GPS Target / Crosshair Button */}
                <View style={styles.mapGpsTargetBtn}>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={7} stroke={BRAND_PURPLE} strokeWidth={2} />
                    <Circle cx={12} cy={12} r={2.5} fill={BRAND_PURPLE} />
                    <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={BRAND_PURPLE} strokeWidth={2} />
                  </Svg>
                </View>

                {/* Bottom Profile Peek Card */}
                <View style={styles.mapBottomPeekCard}>
                  <Image
                    source={require('../assets/images/story_avatar_1.jpg')}
                    style={styles.mapPeekAvatar}
                  />
                  <View style={styles.mapPeekInfo}>
                    <Text style={styles.mapPeekName}>Kavya, 23 ⭐️</Text>
                    <Text style={styles.mapPeekSub}>Chennai • 1.2 Km away</Text>
                  </View>
                </View>
              </View>
            ) : (
              /* ─── PROFILE CARD VIEW (Page 1: Connect with Your Ideal Matches) ─── */
              <View style={styles.phoneScreen}>
                {/* Status Bar */}
                <View style={styles.phoneStatusBar}>
                  <Text style={styles.phoneTimeText}>9:41</Text>
                  <View style={styles.phoneStatusIcons}>
                    <Svg width={12} height={10} viewBox="0 0 12 10" fill="#18181B">
                      <Rect x={0} y={6} width={2} height={4} rx={0.5} />
                      <Rect x={3} y={4} width={2} height={6} rx={0.5} />
                      <Rect x={6} y={2} width={2} height={8} rx={0.5} />
                      <Rect x={9} y={0} width={2} height={10} rx={0.5} />
                    </Svg>
                    <Svg width={12} height={10} viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth={2.4}>
                      <Path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                    </Svg>
                    <Svg width={16} height={9} viewBox="0 0 24 13" fill="none" stroke="#18181B" strokeWidth={2}>
                      <Rect x={1} y={1} width={18} height={11} rx={3} />
                      <Rect x={3} y={3} width={12} height={7} rx={1.5} fill="#18181B" />
                      <Path d="M21 4.5v4" strokeLinecap="round" />
                    </Svg>
                  </View>
                </View>

                {/* Location Header */}
                <View style={styles.phoneLocationHeader}>
                  <View style={styles.phoneLocationLeft}>
                    <Text style={styles.phoneLocationLabel}>
                      {isTa ? 'இருப்பிடம்' : 'Location'}
                    </Text>
                    <View style={styles.phoneLocationValueRow}>
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                          fill={BRAND_PURPLE}
                        />
                        <Circle cx={12} cy={9} r={2.5} fill="#FFFFFF" />
                      </Svg>
                      <Text style={styles.phoneLocationText} numberOfLines={1}>
                        {isTa ? (slide.locationTa || 'சென்னை, தமிழ்நாடு') : (slide.locationEn || 'Chennai, Tamil Nadu')}
                      </Text>
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2.5}>
                        <Path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </View>
                  </View>

                  {/* Filter Button */}
                  <View style={styles.phoneFilterButton}>
                    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.2}>
                      <Path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                    </Svg>
                  </View>
                </View>

                {/* Story Avatars Row */}
                <View style={styles.phoneStoryRow}>
                  {/* Add Story */}
                  <View style={styles.phoneStoryItem}>
                    <View style={styles.phoneAddStoryCircle}>
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={3}>
                        <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </Svg>
                    </View>
                    <Text style={styles.phoneStoryName}>
                      {isTa ? 'சேர்' : 'Add'}
                    </Text>
                  </View>

                  {/* Stories with Active Purple Border */}
                  <View style={styles.phoneStoryItem}>
                    <View style={styles.phoneStoryRing}>
                      <Image
                        source={require('../assets/images/story_avatar_1.jpg')}
                        style={styles.phoneStoryAvatar}
                      />
                    </View>
                    <Text style={styles.phoneStoryName}>Priya</Text>
                  </View>

                  <View style={styles.phoneStoryItem}>
                    <View style={styles.phoneStoryRing}>
                      <Image
                        source={require('../assets/images/story_avatar_2.jpg')}
                        style={styles.phoneStoryAvatar}
                      />
                    </View>
                    <Text style={styles.phoneStoryName}>Karthik</Text>
                  </View>

                  <View style={styles.phoneStoryItem}>
                    <View style={styles.phoneStoryRing}>
                      <Image
                        source={require('../assets/images/story_avatar_3.jpg')}
                        style={styles.phoneStoryAvatar}
                      />
                    </View>
                    <Text style={styles.phoneStoryName}>Deepa</Text>
                  </View>

                  <View style={styles.phoneStoryItem}>
                    <View style={styles.phoneStoryRing}>
                      <Image
                        source={require('../assets/images/story_avatar_4.jpg')}
                        style={styles.phoneStoryAvatar}
                      />
                    </View>
                    <Text style={styles.phoneStoryName}>Ananya</Text>
                  </View>
                </View>

                {/* Profile Card */}
                <View style={styles.phoneProfileCard}>
                  <Image
                    source={slide.imageSource || require('../assets/images/bride_avatar.jpg')}
                    style={styles.phoneProfileImage}
                    resizeMode="cover"
                  />

                  {/* Distance Pill */}
                  <View style={styles.phoneDistancePill}>
                    <Text style={styles.phoneDistanceText}>{slide.distance || '12.6 km away'}</Text>
                  </View>

                  {/* Three Dots Menu */}
                  <View style={styles.phoneMoreDots}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="#FFFFFF">
                      <Circle cx={12} cy={5} r={2} />
                      <Circle cx={12} cy={12} r={2} />
                      <Circle cx={12} cy={19} r={2} />
                    </Svg>
                  </View>

                  {/* Bottom Overlay Scrim */}
                  <View style={styles.phoneCardScrim}>
                    <View style={styles.phoneCardNameRow}>
                      <Text style={styles.phoneCardName} numberOfLines={1}>
                        {slide.profileName || 'Priya Sundaram'}
                      </Text>
                      <View style={styles.phoneVerifiedBadge}>
                        <Svg width={8} height={8} viewBox="0 0 12 12" fill="none">
                          <Path
                            d="M2.5 6.2L4.8 8.5L9.5 3.5"
                            stroke="#1F1A00"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    </View>
                    <Text style={styles.phoneCardLocation} numberOfLines={1}>
                      {isTa
                        ? (slide.profileLocationTa || 'சென்னை, தமிழ்நாடு')
                        : (slide.profileLocationEn || 'CHENNAI, TAMIL NADU')}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons (Reject, Heart Like, Star Superlike) */}
                <View style={styles.phoneActionButtonsRow}>
                  {/* Reject button */}
                  <View style={styles.phoneRejectBtn}>
                    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#6D53F5" strokeWidth={2.8}>
                      <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>

                  {/* Heart Like button (Center, elevated) */}
                  <View style={styles.phoneHeartBtn}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
                      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </Svg>
                  </View>

                  {/* Star Superlike button */}
                  <View style={styles.phoneStarBtn}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="#1F1A00">
                      <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </Svg>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </View>

        {/* 2. Seamless White Bottom Sheet with Curved Top (Direct continuous flow with ZERO gap) */}
        <View style={styles.bottomSection}>
          {/* Concave White Arc sweeping across full width, dipping in the center */}
          <View style={styles.curveHeader} pointerEvents="none">
            <Svg width={SCREEN_WIDTH} height={36} viewBox="0 0 360 36" preserveAspectRatio="none">
              <Path
                d="M 0 0 C 90 28, 270 28, 360 0 L 360 38 L 0 38 Z"
                fill="#FFFFFF"
              />
            </Svg>
          </View>

          {/* Continuous Solid White Lower Content Area */}
          <View
            style={[
              styles.bottomBody,
              { paddingBottom: Math.max(insets.bottom + 14, 22) },
            ]}
          >
            {/* Title & Description */}
            <Animated.View
              style={[
                styles.textWrap,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {slide.type === 'chat' ? (
                <>
                  <Text style={styles.headlinePurple}>
                    {isTa ? slide.titlePurpleTa : slide.titlePurpleEn}
                  </Text>
                  <Text style={styles.headlineDark}>
                    {isTa ? slide.titleLine2Ta : slide.titleLine2En}
                  </Text>
                </>
              ) : slide.type === 'map' ? (
                <>
                  <Text style={styles.headlineRow}>
                    <Text style={styles.headlinePurple}>
                      {isTa ? slide.titlePurpleTa : slide.titlePurpleEn}
                    </Text>
                    <Text style={styles.headlineDark}>
                      {isTa ? slide.titleRestTa : slide.titleRestEn}
                    </Text>
                  </Text>
                  <Text style={styles.headlineDark}>
                    {isTa ? slide.titleLine2Ta : slide.titleLine2En}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.headlineDark}>
                    {isTa ? slide.titlePart1Ta : slide.titlePart1En}
                  </Text>
                  <Text style={styles.headlinePurple}>
                    {isTa ? slide.titlePart2Ta : slide.titlePart2En}
                  </Text>
                </>
              )}
              <Text style={styles.descriptionText}>
                {isTa ? slide.descTa : slide.descEn}
              </Text>
            </Animated.View>

            {/* Bottom Navigation Row: Back FAB + Indicator Dots + Next FAB */}
            <View style={styles.navRow}>
              {/* Circular Back Arrow (Appears when not on slide 0) */}
              {currentSlideIndex > 0 ? (
                <TouchableOpacity
                  style={styles.backFab}
                  onPress={handlePrev}
                  activeOpacity={0.82}
                  accessibilityRole="button"
                  accessibilityLabel="Previous slide"
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BRAND_PURPLE} strokeWidth={2.6}>
                    <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </TouchableOpacity>
              ) : (
                <View style={styles.backFabPlaceholder} />
              )}

              {/* Pagination Dots */}
              <View style={styles.dotsContainer}>
                {SLIDES.map((_, idx) => {
                  const isActive = idx === currentSlideIndex;
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        isActive ? styles.dotActive : styles.dotInactive,
                      ]}
                    />
                  );
                })}
              </View>

              {/* Circular Purple FAB with Arrow */}
              <TouchableOpacity
                style={styles.nextFab}
                onPress={handleNext}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel="Next slide"
              >
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.8}>
                  <Path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FC',
  },

  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 2,
    zIndex: 10,
  },
  topSpacer: {
    width: 40,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8068F8',
    letterSpacing: 0.2,
  },

  // ── Main Continuous Flow Container ──
  mainFlowContainer: {
    flex: 1,
  },

  // ── 1. Phone Mockup Section ──
  phoneSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 1,
  },
  phoneFrame: {
    backgroundColor: '#1E1E24',
    borderRadius: 42,
    borderWidth: 7.5,
    borderColor: '#18181D',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  dynamicIsland: {
    position: 'absolute',
    top: 7,
    alignSelf: 'center',
    width: 72,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#000000',
    zIndex: 20,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },

  // ── Chat Screen (Inside Mockup for Slide 3) ──
  phoneChatScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  phoneChatHeaderArea: {
    backgroundColor: BRAND_PURPLE,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  phoneChatStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  phoneChatTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  phoneChatNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  phoneChatHeaderCircleBtn: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  phoneChatHeaderUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  phoneChatHeaderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  phoneChatHeaderMeta: {
    justifyContent: 'center',
  },
  phoneChatHeaderName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  phoneChatHeaderStatus: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  phoneChatBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -5,
    paddingHorizontal: 10,
    paddingTop: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  phoneChatTodayRow: {
    alignItems: 'center',
    marginVertical: 2,
  },
  phoneChatTodayText: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  phoneChatIncomingWrap: {
    marginVertical: 2.5,
    alignItems: 'flex-start',
  },
  phoneChatIncomingBubble: {
    backgroundColor: '#F8F8FA',
    borderRadius: 11,
    borderTopLeftRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 5,
    maxWidth: '82%',
    borderWidth: 0.5,
    borderColor: '#E7E6ED',
  },
  phoneChatIncomingText: {
    fontSize: 8,
    color: '#1F2937',
    lineHeight: 11,
  },
  phoneChatSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
    paddingLeft: 2,
  },
  phoneChatMiniAvatar: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  phoneChatSenderName: {
    fontSize: 7,
    fontWeight: '600',
    color: '#6B7280',
  },
  phoneChatTimestamp: {
    fontSize: 7,
    color: '#9CA3AF',
  },
  phoneChatOutgoingWrap: {
    marginVertical: 2.5,
    alignItems: 'flex-end',
  },
  phoneChatOutgoingBubble: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 11,
    borderTopRightRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 5,
    maxWidth: '82%',
  },
  phoneChatOutgoingText: {
    fontSize: 8,
    color: '#FFFFFF',
    lineHeight: 11,
  },
  phoneChatOutgoingSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
    paddingRight: 2,
  },
  phoneChatImageCard: {
    width: 135,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  phoneChatCardImg: {
    width: '100%',
    height: '100%',
  },
  phoneChatVoiceBarWrap: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    right: 8,
    zIndex: 5,
  },
  phoneChatVoiceBar: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 15,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 5,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 3,
    elevation: 3,
  },
  phoneChatWaveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    height: 18,
  },
  phoneChatWaveBar: {
    width: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  phoneChatVoiceDuration: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ── Map Screen (Inside Mockup for Slide 2) ──
  phoneMapScreen: {
    flex: 1,
    backgroundColor: '#F3F4F7',
    position: 'relative',
    overflow: 'hidden',
  },
  phoneMapSearchRow: {
    position: 'absolute',
    top: 26,
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  phoneSearchInputBox: {
    flex: 1,
    height: 33,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  phoneSearchPlaceholder: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginLeft: 6,
  },
  phoneMapFilterBtn: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },

  // Map Pins
  mapPinWrap: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  mapPinAvatarRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: BRAND_PURPLE,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  mapPinAvatarImg: {
    width: '100%',
    height: '100%',
  },
  mapPinTag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapPinTagText: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#18181B',
  },

  // Map User Location Radar
  mapUserRadarWrap: {
    position: 'absolute',
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapRadarPulseOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(109, 83, 245, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapRadarCenterDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 2,
  },

  // Map Floating GPS Button
  mapGpsTargetBtn: {
    position: 'absolute',
    bottom: 34,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 6,
  },

  // Map Bottom Peek Card
  mapBottomPeekCard: {
    position: 'absolute',
    bottom: -10,
    left: 14,
    right: 14,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 5,
  },
  mapPeekAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  mapPeekInfo: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  mapPeekName: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#18181B',
  },
  mapPeekSub: {
    fontSize: 7.5,
    color: '#6B7280',
  },

  // Status Bar (Default White theme)
  phoneStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 1,
    paddingBottom: 4,
    zIndex: 10,
  },
  phoneTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#18181B',
  },
  phoneStatusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Location Header
  phoneLocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  phoneLocationLeft: {
    justifyContent: 'center',
  },
  phoneLocationLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 1,
  },
  phoneLocationValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  phoneLocationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#18181B',
    maxWidth: 160,
  },
  phoneFilterButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },

  // Story Avatars
  phoneStoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  phoneStoryItem: {
    alignItems: 'center',
  },
  phoneAddStoryCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF0FF',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneStoryRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: BRAND_PURPLE,
    padding: 1.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneStoryAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  phoneStoryName: {
    fontSize: 9,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 2,
  },

  // Profile Card
  phoneProfileCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
    marginVertical: 3,
  },
  phoneProfileImage: {
    width: '100%',
    height: '100%',
  },
  phoneDistancePill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  phoneDistanceText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#18181B',
  },
  phoneMoreDots: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneCardScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  phoneCardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneCardName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  phoneVerifiedBadge: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: STAR_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneCardLocation: {
    fontSize: 8.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.5,
    marginTop: 1,
  },

  // In-Phone Action Buttons
  phoneActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingTop: 3,
    paddingBottom: 3,
    zIndex: 1,
  },
  phoneRejectBtn: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE8FA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  phoneHeartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
  },
  phoneStarBtn: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: STAR_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  // ── 2. Seamless White Bottom Sheet with Curved Top ──
  bottomSection: {
    flex: 1,
    marginTop: -26, // Seamlessly overlaps the bottom bezel of the phone
    zIndex: 10,
  },
  curveHeader: {
    width: '100%',
    height: 36,
  },
  bottomBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -2, // Overlaps curve SVG by 2px to guarantee 0 subpixel hairline seam
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  textWrap: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  headlineRow: {
    textAlign: 'center',
  },
  headlineDark: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181B',
    textAlign: 'center',
    letterSpacing: -0.3,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  },
  headlinePurple: {
    fontSize: 24,
    fontWeight: '800',
    color: BRAND_PURPLE,
    textAlign: 'center',
    letterSpacing: -0.3,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  },
  descriptionText: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    paddingHorizontal: 8,
  },

  // Navigation Row: Back FAB + Dots + Next FAB
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  backFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D4FC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  backFabPlaceholder: {
    width: 52,
    height: 52,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: ACTIVE_DOT_COLOR,
  },
  dotInactive: {
    width: 8,
    backgroundColor: INACTIVE_DOT_COLOR,
  },
  nextFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 4,
  },
});
