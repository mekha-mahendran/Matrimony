import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  NativeModules,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TurboModuleRegistry,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Language } from '../localization';
import { LanguageToggle } from '../components/LanguageToggle';
import { uploadImageToS3 } from '../services/s3UploadService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';

// --- Vector SVG Icons ---

const CameraVectorIcon = ({ color = BRAND_PURPLE, size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const GalleryVectorIcon = ({ color = BRAND_PURPLE, size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" />
    <Path d="M21 15l-5-5L5 21" />
  </Svg>
);

const LinkVectorIcon = ({ color = BRAND_PURPLE, size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

const CloseVectorIcon = ({ color = '#6B7280', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const PlusVectorIcon = ({ color = BRAND_PURPLE, size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

const CheckVectorIcon = ({ color = '#15803D', size = 13 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

// High-resolution photo options for fast 1-tap testing
const QUICK_PHOTOS_MALE = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
];

const QUICK_PHOTOS_FEMALE = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
];

export interface PhotosVerificationData {
  photos: string[];
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  isIdVerified: boolean;
}

interface PhotosVerificationScreenProps {
  language?: Language;
  onToggleLanguage?: () => void;
  initialPhotos?: string[];
  userGender?: 'male' | 'female';
  onFinish: (data: PhotosVerificationData) => void;
  onBackPress: () => void;
}

export const PhotosVerificationScreen: React.FC<PhotosVerificationScreenProps> = ({
  language = 'en',
  onToggleLanguage,
  initialPhotos = [],
  userGender = 'male',
  onFinish,
  onBackPress,
}) => {
  // Constant hook order
  const insets = useSafeAreaInsets();

  const [photos, setPhotos] = useState<(string | null)[]>([
    initialPhotos[0] || null,
    initialPhotos[1] || null,
    initialPhotos[2] || null,
    initialPhotos[3] || null,
    initialPhotos[4] || null,
    initialPhotos[5] || null,
  ]);

  const [mobileVerified, setMobileVerified] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

  const isTa = language === 'ta';
  const quickPhotos = userGender === 'female' ? QUICK_PHOTOS_FEMALE : QUICK_PHOTOS_MALE;

  // Safe check for native ImagePicker module availability
  const isImagePickerAvailable = (): boolean => {
    try {
      if (typeof (globalThis as any).__turboModuleProxy === 'function') {
        const tm = (TurboModuleRegistry as any)?.get?.('ImagePicker');
        if (tm) return true;
      }
    } catch {}

    return Boolean(
      (NativeModules as any)?.ImagePicker ||
      (NativeModules as any)?.ImagePickerManager ||
      (NativeModules as any)?.RNImagePicker
    );
  };

  const handleRemovePhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = null;
    setPhotos(updated);
  };

  const processAndUploadPhoto = async (
    slotIndex: number,
    base64Data?: string,
    uri?: string,
    mimeType: string = 'image/jpeg'
  ) => {
    try {
      setUploadingSlot(slotIndex);

      let finalUrl = '';
      if (base64Data) {
        const uploadResult = await uploadImageToS3(base64Data, mimeType);
        finalUrl = uploadResult.url;
      } else if (uri) {
        finalUrl = uri;
      }

      if (finalUrl) {
        const updated = [...photos];
        updated[slotIndex] = finalUrl;
        setPhotos(updated);
      }
    } catch (err: any) {
      console.error('[PhotosVerificationScreen] Upload Error:', err);
      Alert.alert(
        isTa ? 'பதிவேற்ற பிழை' : 'Upload Notice',
        err?.message || (isTa ? 'பதிவேற்ற முடியவில்லை.' : 'Failed to upload photo.')
      );
    } finally {
      setUploadingSlot(null);
      setActiveSlot(null);
      setShowUrlModal(false);
    }
  };

  const handleLaunchGallery = async () => {
    const targetSlot = activeSlot;
    if (targetSlot === null) return;

    if (!isImagePickerAvailable()) {
      // Seamlessly open upload & photo chooser without showing an error dialog
      setShowUrlModal(true);
      return;
    }

    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1280,
        maxHeight: 1280,
      });

      if (response.didCancel) return;
      if (response.errorCode) {
        setShowUrlModal(true);
        return;
      }

      const asset = response.assets?.[0];
      if (asset?.base64) {
        processAndUploadPhoto(
          targetSlot,
          asset.base64,
          asset.uri,
          asset.type || 'image/jpeg'
        );
      } else if (asset?.uri) {
        processAndUploadPhoto(targetSlot, undefined, asset.uri);
      }
    } catch (err: any) {
      console.warn('Gallery launch error, opening URL sheet:', err);
      setShowUrlModal(true);
    }
  };

  const handleLaunchCamera = async () => {
    const targetSlot = activeSlot;
    if (targetSlot === null) return;

    if (!isImagePickerAvailable()) {
      // Seamlessly open upload & photo chooser without showing an error dialog
      setShowUrlModal(true);
      return;
    }

    try {
      const response = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1280,
        maxHeight: 1280,
        saveToPhotos: true,
      });

      if (response.didCancel) return;
      if (response.errorCode) {
        setShowUrlModal(true);
        return;
      }

      const asset = response.assets?.[0];
      if (asset?.base64) {
        processAndUploadPhoto(
          targetSlot,
          asset.base64,
          asset.uri,
          asset.type || 'image/jpeg'
        );
      } else if (asset?.uri) {
        processAndUploadPhoto(targetSlot, undefined, asset.uri);
      }
    } catch (err: any) {
      console.warn('Camera launch error, opening URL sheet:', err);
      setShowUrlModal(true);
    }
  };

  const handleSaveCustomUrl = () => {
    if (!customUrlInput.trim()) {
      Alert.alert(
        isTa ? 'URL தேவை' : 'URL Required',
        isTa ? 'சரியான பட URL இணைப்பை உள்ளிடவும்.' : 'Please enter a valid image URL.'
      );
      return;
    }

    if (activeSlot !== null) {
      processAndUploadPhoto(activeSlot, undefined, customUrlInput.trim());
      setCustomUrlInput('');
    }
  };

  const handleSelectQuickPhoto = (url: string) => {
    if (activeSlot !== null) {
      processAndUploadPhoto(activeSlot, undefined, url);
    }
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
    if (validPhotos.length === 0) {
      Alert.alert(
        isTa ? 'புகைப்படம் தேவை' : 'Photo Required',
        isTa
          ? 'உங்கள் சுயவிவரத்தை நிறைவு செய்ய குறைந்தது ஒரு புகைப்படத்தை பதிவேற்றவும்.'
          : 'Please upload at least one profile photo to complete your profile.'
      );
      return;
    }

    onFinish({
      photos: validPhotos,
      isMobileVerified: mobileVerified,
      isEmailVerified: emailVerified,
      isIdVerified: idVerified,
    });
  };

  const renderSlot = (index: number, style: any, isMain = false) => {
    const photoUrl = photos[index];
    const isUploading = uploadingSlot === index;

    if (isUploading) {
      return (
        <View key={index} style={[styles.photoCardFilled, style, styles.uploadingSlotCard]}>
          <ActivityIndicator size="small" color={BRAND_PURPLE} />
          <Text style={styles.uploadingSlotText}>
            {isTa ? 'பதிவேற்றுகிறது...' : 'Uploading...'}
          </Text>
        </View>
      );
    }

    if (photoUrl) {
      return (
        <View key={index} style={[styles.photoCardFilled, style]}>
          <Image source={{ uri: photoUrl }} style={styles.photoImg} resizeMode="cover" />

          {/* Main Photo Badge (Only on first slot) */}
          {isMain && (
            <View style={styles.mainBadge}>
              <Text style={styles.mainBadgeText}>
                {isTa ? 'முதன்மை' : 'Main'}
              </Text>
            </View>
          )}

          {/* Remove Button with Vector Icon */}
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemovePhoto(index)}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CloseVectorIcon color="#FFFFFF" size={12} />
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
        <View style={styles.plusIconWrap}>
          <PlusVectorIcon color={BRAND_PURPLE} size={18} />
        </View>
        <Text style={styles.slotUploadLabel}>
          {isMain ? (isTa ? 'முதன்மை படம்' : 'Main Photo') : (isTa ? 'பதிவேற்று' : 'Upload')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button, Progress & Language Toggle */}
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

        {/* Language Toggle or Step Indicator */}
        <View style={styles.topRightArea}>
          {onToggleLanguage ? (
            <LanguageToggle language={language} onToggle={onToggleLanguage} />
          ) : (
            <Text style={styles.stepIndicator}>8/8</Text>
          )}
        </View>
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
              ? 'புகைப்படங்கள் உள்ள சுயவிவரங்கள் அதிக வரன்களை ஈர்க்கின்றன.'
              : 'Profiles with photos get far more interest.'}
          </Text>
        </View>

        {/* Photo Grid */}
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
              {mobileVerified ? (
                <View style={styles.verifiedBtnContent}>
                  <Text style={styles.verifiedBtnText}>
                    {isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                  </Text>
                  <CheckVectorIcon color="#15803D" size={13} />
                </View>
              ) : (
                <Text style={styles.verifyBtnText}>
                  {isTa ? 'சரிபார்' : 'Verify'}
                </Text>
              )}
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
              {emailVerified ? (
                <View style={styles.verifiedBtnContent}>
                  <Text style={styles.verifiedBtnText}>
                    {isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                  </Text>
                  <CheckVectorIcon color="#15803D" size={13} />
                </View>
              ) : (
                <Text style={styles.verifyBtnText}>
                  {isTa ? 'சரிபார்' : 'Verify'}
                </Text>
              )}
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
              {idVerified ? (
                <View style={styles.verifiedBtnContent}>
                  <Text style={styles.verifiedBtnText}>
                    {isTa ? 'சமர்ப்பிக்கப்பட்டது' : 'Uploaded'}
                  </Text>
                  <CheckVectorIcon color="#15803D" size={13} />
                </View>
              ) : (
                <Text style={styles.verifyBtnText}>
                  {isTa ? 'சரிபார்' : 'Verify'}
                </Text>
              )}
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

      {/* Profile Photo Upload Action Sheet Modal */}
      <Modal
        visible={activeSlot !== null && !showUrlModal}
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
            {/* Sheet Handle */}
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isTa ? 'சுயவிவரப் புகைப்படத்தைப் பதிவேற்றவும்' : 'Upload Profile Photo'}
              </Text>
              <TouchableOpacity
                onPress={() => setActiveSlot(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <CloseVectorIcon color="#9CA3AF" size={18} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {isTa
                ? 'உங்கள் புகைப்படத்தைச் சேர்க்க ஒரு வழியைத் தேர்ந்தெடுக்கவும்:'
                : "Choose how you'd like to add your profile photo:"}
            </Text>

            {/* Option 1: Take Photo with Camera */}
            <TouchableOpacity
              style={styles.uploadOptionCard}
              onPress={handleLaunchCamera}
              activeOpacity={0.7}
            >
              <View style={styles.uploadOptionIconCircle}>
                <CameraVectorIcon color={BRAND_PURPLE} size={22} />
              </View>
              <View style={styles.uploadOptionTexts}>
                <Text style={styles.uploadOptionTitle}>
                  {isTa ? 'கேமரா மூலம் புகைப்படம் எடுக்கவும்' : 'Take Photo with Camera'}
                </Text>
                <Text style={styles.uploadOptionDesc}>
                  {isTa ? 'புதிய புகைப்படத்தை உடனடியாக எடுக்கவும்' : 'Capture a fresh photo using your device camera'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Choose from Gallery */}
            <TouchableOpacity
              style={styles.uploadOptionCard}
              onPress={handleLaunchGallery}
              activeOpacity={0.7}
            >
              <View style={styles.uploadOptionIconCircle}>
                <GalleryVectorIcon color={BRAND_PURPLE} size={22} />
              </View>
              <View style={styles.uploadOptionTexts}>
                <Text style={styles.uploadOptionTitle}>
                  {isTa ? 'கேலரியிலிருந்து தேர்வு செய்யவும்' : 'Choose from Gallery'}
                </Text>
                <Text style={styles.uploadOptionDesc}>
                  {isTa ? 'உங்கள் மொபைல் புகைப்பட ஆல்பத்திலிருந்து தேர்ந்தெடுக்கவும்' : 'Pick an existing picture from your photos library'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 3: Direct Web Image URL / Instant Photo */}
            <TouchableOpacity
              style={styles.uploadOptionCard}
              onPress={() => setShowUrlModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.uploadOptionIconCircle}>
                <LinkVectorIcon color={BRAND_PURPLE} size={22} />
              </View>
              <View style={styles.uploadOptionTexts}>
                <Text style={styles.uploadOptionTitle}>
                  {isTa ? 'படத்தின் இணைய இணைப்பு அல்லது உடனடி தேர்வு' : 'Direct Photo Link or Instant Selection'}
                </Text>
                <Text style={styles.uploadOptionDesc}>
                  {isTa ? 'நேரடி பட இணைப்பை ஒட்டவும் அல்லது தேர்ந்தெடுக்கவும்' : 'Enter image URL or select from high quality options'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Manual URL / Quick Photo Chooser Modal */}
      <Modal
        visible={showUrlModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUrlModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowUrlModal(false)}
        >
          <View
            style={[styles.urlModalBox, { paddingBottom: 20 }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.urlModalHeader}>
              <View style={styles.urlIconCircle}>
                <LinkVectorIcon color={BRAND_PURPLE} size={18} />
              </View>
              <Text style={styles.urlModalTitle}>
                {isTa ? 'புகைப்படத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Profile Photo'}
              </Text>
            </View>

            <Text style={styles.urlModalSubtitle}>
              {isTa ? 'படத்திற்கான முழுமையான HTTP / HTTPS இணைப்பை ஒட்டவும்:' : 'Paste any image link (HTTPS) or choose a photo below:'}
            </Text>

            <TextInput
              style={styles.urlTextInput}
              placeholder="https://example.com/photo.jpg"
              placeholderTextColor="#9CA3AF"
              value={customUrlInput}
              onChangeText={setCustomUrlInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            {/* Quick 1-Tap Photo Options */}
            <Text style={styles.quickPhotoHeader}>
              {isTa ? 'அல்லது விரைவு தேர்வை அழுத்தவும்:' : 'Or tap a photo to upload directly:'}
            </Text>
            <View style={styles.quickPhotoGrid}>
              {quickPhotos.map((url, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.quickPhotoThumb}
                  onPress={() => handleSelectQuickPhoto(url)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: url }} style={styles.quickPhotoImg} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.urlBtnRow}>
              <TouchableOpacity
                style={styles.urlCancelBtn}
                onPress={() => setShowUrlModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.urlCancelText}>
                  {isTa ? 'ரத்து செய்' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.urlSubmitBtn}
                onPress={handleSaveCustomUrl}
                activeOpacity={0.8}
              >
                <Text style={styles.urlSubmitText}>
                  {isTa ? 'சேமி' : 'Save Photo'}
                </Text>
              </TouchableOpacity>
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
    width: '100%',
    height: '100%',
    backgroundColor: BRAND_PURPLE,
    borderRadius: 3,
  },
  topRightArea: {
    alignItems: 'flex-end',
    justifyContent: 'center',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
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
    padding: 8,
  },
  plusIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  slotUploadLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  photoCardFilled: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  uploadingSlotCard: {
    backgroundColor: '#F5F3FF',
    borderWidth: 1.5,
    borderColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadingSlotText: {
    fontSize: 11,
    color: BRAND_PURPLE,
    fontWeight: '600',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mainBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
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

  /* Caption */
  captionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  /* Verification Cards */
  verificationSection: {
    gap: 10,
  },
  verifyCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifyInfo: {
    flex: 1,
    paddingRight: 12,
  },
  verifyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  verifySubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifyBtn: {
    backgroundColor: BRAND_PURPLE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedBtn: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  verifiedBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBtnText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
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
    paddingTop: 12,
  },
  finishButton: {
    backgroundColor: BRAND_PURPLE,
    borderRadius: 28,
    height: 52,
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

  /* Modal Sheet */
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
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },

  /* Upload Option Cards */
  uploadOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  uploadOptionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  uploadOptionTexts: {
    flex: 1,
  },
  uploadOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  uploadOptionDesc: {
    fontSize: 12,
    color: '#6B7280',
  },

  /* Direct URL Modal */
  urlModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 'auto',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  urlModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  urlIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urlModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  urlModalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  urlTextInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
  },
  quickPhotoHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  quickPhotoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickPhotoThumb: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  quickPhotoImg: {
    width: '100%',
    height: '100%',
  },
  urlBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  urlCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  urlCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  urlSubmitBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: BRAND_PURPLE,
  },
  urlSubmitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
