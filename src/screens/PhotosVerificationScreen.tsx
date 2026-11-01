import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Language } from '../localization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

export interface PhotosVerificationData {
  photos: string[];
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  isIdVerified: boolean;
}

interface PhotosVerificationScreenProps {
  language?: Language;
  initialPhotos?: string[];
  userGender?: 'male' | 'female';
  onFinish: (data: PhotosVerificationData) => void;
  onBackPress: () => void;
}

const SAMPLE_AVATARS_MALE = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
];

const SAMPLE_AVATARS_FEMALE = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
];

export const PhotosVerificationScreen: React.FC<PhotosVerificationScreenProps> = ({
  language = 'en',
  initialPhotos = [],
  userGender = 'male',
  onFinish,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // 6 Photo slots array
  const [photos, setPhotos] = useState<(string | null)[]>([
    initialPhotos[0] || (userGender === 'female' ? SAMPLE_AVATARS_FEMALE[0] : SAMPLE_AVATARS_MALE[0]),
    initialPhotos[1] || null,
    initialPhotos[2] || null,
    initialPhotos[3] || null,
    initialPhotos[4] || null,
    initialPhotos[5] || null,
  ]);

  // Verification states
  const [mobileVerified, setMobileVerified] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);

  // Active slot index for modal picker
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const sampleAvatars = userGender === 'female' ? SAMPLE_AVATARS_FEMALE : SAMPLE_AVATARS_MALE;

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const handleSelectAvatar = (url: string) => {
    if (activeSlot !== null) {
      const updated = [...photos];
      updated[activeSlot] = url;
      setPhotos(updated);
      setActiveSlot(null);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = null;
    setPhotos(updated);
  };

  const handleVerify = (type: 'mobile' | 'email' | 'id') => {
    if (type === 'mobile') {
      setMobileVerified(true);
      Alert.alert(
        isTa ? 'மொபைல் எண் சரிபார்க்கப்பட்டது' : 'Mobile Verified',
        isTa ? 'உங்கள் மொபைல் எண் வெற்றிகரமாக சரிபார்க்கப்பட்டது.' : 'Your mobile number is verified successfully.'
      );
    } else if (type === 'email') {
      setEmailVerified(true);
      Alert.alert(
        isTa ? 'மின்னஞ்சல் சரிபார்க்கப்பட்டது' : 'Email Verified',
        isTa ? 'உங்கள் மின்னஞ்சல் முகவரி வெற்றிகரமாக சரிபார்க்கப்பட்டது.' : 'Your email address is verified successfully.'
      );
    } else {
      setIdVerified(true);
      Alert.alert(
        isTa ? 'அரசு அடையாள அட்டை பெறப்பட்டது' : 'ID Uploaded',
        isTa ? 'உங்கள் அடையாள ஆவணம் சரிபார்ப்புக்கு சமர்ப்பிக்கப்பட்டது.' : 'Your government ID has been submitted for verification.'
      );
    }
  };

  const handleFinishPress = () => {
    const validPhotos = photos.filter((p): p is string => Boolean(p));
    onFinish({
      photos: validPhotos.length > 0 ? validPhotos : [sampleAvatars[0]],
      isMobileVerified: mobileVerified,
      isEmailVerified: emailVerified,
      isIdVerified: idVerified,
    });
  };

  const renderSlot = (index: number, style: any, isMain = false) => {
    const photoUrl = photos[index];

    if (photoUrl) {
      return (
        <View key={index} style={[styles.photoCardFilled, style]}>
          <Image source={{ uri: photoUrl }} style={styles.photoImg} resizeMode="cover" />
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemovePhoto(index)}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={[styles.photoCardEmpty, style]}
        onPress={() => setActiveSlot(index)}
        activeOpacity={0.7}
      >
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button and Progress (8/8) */}
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

        {/* Center Progress Bar: 8/8 (100%) filled */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Step Counter Indicator */}
        <Text style={styles.stepIndicator}>8/8</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 90, 110) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title & Subtitle */}
        <View style={styles.headerArea}>
          <Text style={styles.title}>
            {isTa ? 'புகைப்படங்கள் & சரிபார்ப்பு' : 'Photos & verification'}
          </Text>
          <Text style={styles.subtitle}>
            {isTa
              ? 'புகைப்படங்கள் உள்ள சுயவிவரங்கள் அதிக ஆர்வத்தைப் பெறுகின்றன.'
              : 'Profiles with photos get far more interest.'}
          </Text>
        </View>

        {/* Photo Grid (Asymmetric matching screenshot) */}
        <View style={styles.gridContainer}>
          {/* Top Row: Left Main slot + Right Column (2 slots) */}
          <View style={styles.topRow}>
            {/* Slot 1: Main Photo */}
            {renderSlot(0, styles.mainSlot, true)}

            {/* Right Column: Slot 2 & Slot 3 */}
            <View style={styles.rightCol}>
              {renderSlot(1, styles.smallSlotTop)}
              {renderSlot(2, styles.smallSlotBottom)}
            </View>
          </View>

          {/* Bottom Row: 3 slots side-by-side (Slot 4, 5, 6) */}
          <View style={styles.bottomRow}>
            {renderSlot(3, styles.triSlot)}
            {renderSlot(4, styles.triSlot)}
            {renderSlot(5, styles.triSlot)}
          </View>
        </View>

        {/* Caption */}
        <Text style={styles.captionText}>
          {isTa
            ? 'முதல் புகைப்படம் உங்கள் முக்கிய சுயவிவரப் படமாகும்.'
            : 'The first photo is your main profile picture.'}
        </Text>

        {/* Verification Items Stack */}
        <View style={styles.verificationSection}>
          {/* 1. Mobile number */}
          <View style={styles.verifyCard}>
            <View style={styles.verifyInfo}>
              <Text style={styles.verifyTitle}>
                {isTa ? 'மொபைல் எண்' : 'Mobile number'}
              </Text>
              <Text style={styles.verifySubtitle}>
                {isTa ? 'ஒரு முறை கடவுச்சொல் மூலம் சரிபார்க்கவும்' : 'Verify with a one-time code'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.verifyBtn, mobileVerified && styles.verifiedBtn]}
              onPress={() => handleVerify('mobile')}
              activeOpacity={0.8}
            >
              <Text style={[styles.verifyBtnText, mobileVerified && styles.verifiedBtnText]}>
                {mobileVerified ? (isTa ? 'சரிபார்க்கப்பட்டது ✓' : 'Verified ✓') : (isTa ? 'சரிபார்' : 'Verify')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Email address */}
          <View style={styles.verifyCard}>
            <View style={styles.verifyInfo}>
              <Text style={styles.verifyTitle}>
                {isTa ? 'மின்னஞ்சல் முகவரி' : 'Email address'}
              </Text>
              <Text style={styles.verifySubtitle}>
                {isTa ? 'உங்கள் மின்னஞ்சலை உறுதிப்படுத்தவும்' : 'Confirm your email'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.verifyBtn, emailVerified && styles.verifiedBtn]}
              onPress={() => handleVerify('email')}
              activeOpacity={0.8}
            >
              <Text style={[styles.verifyBtnText, emailVerified && styles.verifiedBtnText]}>
                {emailVerified ? (isTa ? 'சரிபார்க்கப்பட்டது ✓' : 'Verified ✓') : (isTa ? 'சரிபார்' : 'Verify')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3. Government ID */}
          <View style={styles.verifyCard}>
            <View style={styles.verifyInfo}>
              <Text style={styles.verifyTitle}>
                {isTa ? 'அரசு அடையாள அட்டை' : 'Government ID'}
              </Text>
              <Text style={styles.verifySubtitle}>
                {isTa ? 'ஆதார், பாஸ்போர்ட் அல்லது ஓட்டுநர் உரிமம்' : 'Aadhaar, passport or driving licence'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.verifyBtn, idVerified && styles.verifiedBtn]}
              onPress={() => handleVerify('id')}
              activeOpacity={0.8}
            >
              <Text style={[styles.verifyBtnText, idVerified && styles.verifiedBtnText]}>
                {idVerified ? (isTa ? 'சமர்ப்பிக்கப்பட்டது ✓' : 'Uploaded ✓') : (isTa ? 'சரிபார்' : 'Verify')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Finish Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 24) },
        ]}
      >
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishPress}
          activeOpacity={0.88}
        >
          <Text style={styles.finishButtonText}>
            {isTa ? 'நிறைவு செய்' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo Picker Modal */}
      <Modal
        visible={activeSlot !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveSlot(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setActiveSlot(null)}
        >
          <View
            style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom + 20, 30) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'புகைப்படத்தைத் தேர்ந்தெடுக்கவும்' : 'Choose Profile Photo'}
              </Text>
              <TouchableOpacity onPress={() => setActiveSlot(null)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {isTa ? 'மாதிரி படத்தைத் தேர்வுசெய்யவும்:' : 'Select a sample photo for your profile:'}
            </Text>

            <View style={styles.avatarGrid}>
              {sampleAvatars.map((url, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.avatarItem}
                  onPress={() => handleSelectAvatar(url)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: url }} style={styles.avatarImg} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    width: '100%', // 8 of 8 steps
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
    marginBottom: 20,
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
  },

  /* Photo Grid */
  gridContainer: {
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    height: 220,
    gap: 12,
    marginBottom: 12,
  },
  mainSlot: {
    flex: 1.8,
    height: '100%',
  },
  rightCol: {
    flex: 1,
    height: '100%',
    gap: 12,
  },
  smallSlotTop: {
    flex: 1,
  },
  smallSlotBottom: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    height: 110,
    gap: 12,
  },
  triSlot: {
    flex: 1,
    height: '100%',
  },

  /* Photo Card Styles */
  photoCardEmpty: {
    backgroundColor: '#F8F9FB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCardFilled: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  plusIcon: {
    fontSize: 26,
    color: BRAND_PURPLE,
    fontWeight: '400',
  },

  /* Caption */
  captionText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  /* Verification Cards */
  verificationSection: {
    gap: 12,
  },
  verifyCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifyInfo: {
    flex: 1,
    paddingRight: 12,
  },
  verifyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  verifySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  verifyBtn: {
    backgroundColor: BRAND_PURPLE,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  verifiedBtn: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  verifiedBtnText: {
    color: '#15803D',
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
  finishButton: {
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
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 8,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  avatarItem: {
    width: 96,
    height: 96,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#EEF2F6',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
});

