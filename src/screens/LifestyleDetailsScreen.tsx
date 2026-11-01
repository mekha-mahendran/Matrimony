import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Language } from '../localization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

export interface LifestyleDetailsData {
  diet: string;
  smoking: string;
  drinking: string;
  hobbies: string[];
  aboutMe: string;
}

interface LifestyleDetailsScreenProps {
  language?: Language;
  initialData?: Partial<LifestyleDetailsData>;
  onNext: (data: LifestyleDetailsData) => void;
  onBackPress: () => void;
}

const DIET_OPTIONS = [
  { id: 'Vegetarian', labelEn: 'Vegetarian', labelTa: 'சைவம்' },
  { id: 'Non-vegetarian', labelEn: 'Non-vegetarian', labelTa: 'அசைவம்' },
  { id: 'Eggetarian', labelEn: 'Eggetarian', labelTa: 'முட்டை மட்டும்' },
  { id: 'Vegan', labelEn: 'Vegan', labelTa: 'தூய சைவம் (Vegan)' },
];

const HABIT_OPTIONS = [
  { id: 'No', labelEn: 'No', labelTa: 'இல்லை' },
  { id: 'Occasionally', labelEn: 'Occasionally', labelTa: 'எப்போதாவது' },
  { id: 'Yes', labelEn: 'Yes', labelTa: 'ஆம்' },
];

const HOBBY_OPTIONS = [
  { id: 'Music', labelEn: 'Music', labelTa: 'இசை' },
  { id: 'Reading', labelEn: 'Reading', labelTa: 'வாசிப்பு' },
  { id: 'Travel', labelEn: 'Travel', labelTa: 'பயணம்' },
  { id: 'Cooking', labelEn: 'Cooking', labelTa: 'சமையல்' },
  { id: 'Movies', labelEn: 'Movies', labelTa: 'திரைப்படங்கள்' },
  { id: 'Fitness', labelEn: 'Fitness', labelTa: 'உடற்பயிற்சி' },
  { id: 'Photography', labelEn: 'Photography', labelTa: 'புகைப்படம்' },
  { id: 'Gaming', labelEn: 'Gaming', labelTa: 'விளையாட்டு' },
  { id: 'Art', labelEn: 'Art', labelTa: 'கலை' },
  { id: 'Gardening', labelEn: 'Gardening', labelTa: 'தோட்டக்கலை' },
];

export const LifestyleDetailsScreen: React.FC<LifestyleDetailsScreenProps> = ({
  language = 'en',
  initialData,
  onNext,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // Form states matching screenshot
  const [diet, setDiet] = useState(initialData?.diet || 'Vegetarian');
  const [smoking, setSmoking] = useState(initialData?.smoking || 'No');
  const [drinking, setDrinking] = useState(initialData?.drinking || 'No');
  const [hobbies, setHobbies] = useState<string[]>(initialData?.hobbies || ['Music', 'Travel']);
  const [aboutMe, setAboutMe] = useState(initialData?.aboutMe || '');

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const toggleHobby = (id: string) => {
    if (hobbies.includes(id)) {
      setHobbies(hobbies.filter(h => h !== id));
    } else {
      if (hobbies.length >= 5) {
        Alert.alert(
          isTa ? 'வரம்பு அடைந்தது' : 'Limit Reached',
          isTa ? 'அதிகபட்சம் 5 பொழுதுபோக்குகளை மட்டுமே தேர்வு செய்ய முடியும்.' : 'You can pick up to 5 hobbies.'
        );
        return;
      }
      setHobbies([...hobbies, id]);
    }
  };

  const handleNextPress = () => {
    onNext({
      diet,
      smoking,
      drinking,
      hobbies,
      aboutMe: aboutMe.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (6/8) */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth={2}>
            <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        {/* Center Progress Bar: 6/8 (75%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>6/8</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 90, 110) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Title & Subtitle */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>
              {isTa ? 'வாழ்க்கை முறை' : 'Lifestyle'}
            </Text>
            <Text style={styles.subtitle}>
              {isTa
                ? 'பழக்கவழக்கங்கள், பொழுதுபோக்குகள் மற்றும் உங்களைப் பற்றிய சிறு குறிப்பு.'
                : 'Habits, hobbies and a few words about you.'}
            </Text>
          </View>

          {/* 1. Diet */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'உணவு முறை' : 'Diet'}
            </Text>
            <View style={styles.pillsWrap}>
              {DIET_OPTIONS.map(opt => {
                const isSelected = diet === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setDiet(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {isTa ? opt.labelTa : opt.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 2. Smoking */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'புகைபிடித்தல்' : 'Smoking'}
            </Text>
            <View style={styles.pillsWrap}>
              {HABIT_OPTIONS.map(opt => {
                const isSelected = smoking === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setSmoking(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {isTa ? opt.labelTa : opt.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 3. Drinking */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'மது அருந்துதல்' : 'Drinking'}
            </Text>
            <View style={styles.pillsWrap}>
              {HABIT_OPTIONS.map(opt => {
                const isSelected = drinking === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => setDrinking(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {isTa ? opt.labelTa : opt.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Hobbies (pick up to 5) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'பொழுதுபோக்குகள் (5 வரை தேர்ந்தெடுக்கவும்)' : 'Hobbies (pick up to 5)'}
            </Text>
            <View style={styles.pillsWrap}>
              {HOBBY_OPTIONS.map(opt => {
                const isSelected = hobbies.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected ? styles.pillSelected : styles.pillUnselected,
                    ]}
                    onPress={() => toggleHobby(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {isTa ? opt.labelTa : opt.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 5. About me */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isTa ? 'என்னை பற்றி' : 'About me'}
            </Text>
            <View style={styles.textAreaBox}>
              <TextInput
                style={styles.textAreaInput}
                placeholder={
                  isTa
                    ? 'உங்களைப் பற்றிய சில வரிகள், உங்கள் மதிப்புகள் மற்றும் நீங்கள் விரும்புவனவற்றை எழுதுங்கள்.'
                    : 'Write a few lines about yourself, your values and what you enjoy.'
                }
                placeholderTextColor="#9CA3AF"
                value={aboutMe}
                onChangeText={setAboutMe}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Sticky Next Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 24) },
        ]}
      >
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextPress}
          activeOpacity={0.88}
        >
          <Text style={styles.nextButtonText}>
            {isTa ? 'அடுத்து' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEF2F6',
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressFill: {
    width: '75%', // 6 of 8 steps
    height: '100%',
    backgroundColor: BRAND_PURPLE,
    borderRadius: 3,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_PURPLE,
    minWidth: 28,
    textAlign: 'right',
  },

  /* Scroll Content */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  /* Header Area */
  headerArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 12,
  },

  /* Section */
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },

  /* Pills (Diet, Habits, Hobbies) */
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 10,
    marginBottom: 10,
  },
  pillUnselected: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  pillSelected: {
    backgroundColor: BRAND_PURPLE,
    borderWidth: 1,
    borderColor: BRAND_PURPLE,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pillTextUnselected: {
    color: '#374151',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* Textarea (About Me) */
  textAreaBox: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    minHeight: 110,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textAreaInput: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    padding: 0,
    minHeight: 86,
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  nextButton: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 28,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

