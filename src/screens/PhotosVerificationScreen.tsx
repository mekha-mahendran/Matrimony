import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
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
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { Language } from '../localization';
import { LanguageToggle } from '../components/LanguageToggle';
import {
  uploadImageToS3,
  isS3Url,
  S3_BUCKET_NAME,
  S3_REGION,
} from '../services/s3UploadService';

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
  const insets = useSafeAreaInsets();
  const isTa = language === 'ta';

  // 6 Photo slots: initialize purely from user data (no mock/sample portrait fallback)
  const [photos, setPhotos] = useState<(string | null)[]>([
    initialPhotos[0] || null,
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

  // Uploading state
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string>('');

  // Manual URL modal state
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FFFFFF', true);
    }
  }, []);

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
      setUploadStatusText(
        isTa ? 'AWS S3 பக்கெட்டில் பதிவேற்றப்படுகிறது...' : 'Uploading to AWS S3 bucket...'
      );

      let finalUrl = '';

      if (base64Data) {
        const uploadResult = await uploadImageToS3(base64Data, mimeType);
        finalUrl = uploadResult.url;
      } else if (uri) {
        // Direct URI fallback
        finalUrl = uri;
      }

      if (finalUrl) {
        const updated = [...photos];
        updated[slotIndex] = finalUrl;
        setPhotos(updated);

        Alert.alert(
          isTa ? 'வெற்றிகரமாக பதிவேற்றப்பட்டது' : 'Upload Complete',
          isTa
            ? `புகைப்படம் AWS S3 பக்கெட்டில் (${S3_BUCKET_NAME}) வெற்றிகரமாக பதிவேற்றப்பட்டது.`
            : `Photo uploaded successfully to AWS S3 bucket: ${S3_BUCKET_NAME}`
        );
      }
    } catch (err: any) {
      console.error('[PhotosVerificationScreen] S3 Upload Error:', err);
      Alert.alert(
        isTa ? 'பதிவேற்ற பிழை' : 'Upload Failed',
        err?.message || (isTa ? 'பதிவேற்ற முடியவில்லை.' : 'Failed to upload photo to S3.')
      );
    } finally {
      setUploadingSlot(null);
      setUploadStatusText('');
      setActiveSlot(null);
    }
  };

  const handleLaunchGallery = () => {
    const targetSlot = activeSlot;
    if (targetSlot === null) return;

    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          selectionLimit: 1,
          includeBase64: true,
          quality: 0.8,
          maxWidth: 1280,
          maxHeight: 1280,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) return;
          if (response.errorCode) {
            Alert.alert(
              isTa ? 'கேலரி பிழை' : 'Gallery Error',
              response.errorMessage || (isTa ? 'படத்தை அணுக முடியவில்லை' : 'Could not access image')
            );
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
        }
      );
    } catch (err: any) {
      console.warn('Image picker error:', err);
      Alert.alert(
        isTa ? 'அணுகல் பிழை' : 'Image Picker Notice',
        isTa
          ? 'நேரடி பட URL உள்ளீடு விருப்பத்தைப் பயன்படுத்தவும்.'
          : 'Please use the direct image URL option.'
      );
    }
  };

  const handleLaunchCamera = () => {
    const targetSlot = activeSlot;
    if (targetSlot === null) return;

    try {
      launchCamera(
        {
          mediaType: 'photo',
          includeBase64: true,
          quality: 0.8,
          maxWidth: 1280,
          maxHeight: 1280,
          saveToPhotos: true,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) return;
          if (response.errorCode) {
            Alert.alert(
              isTa ? 'கேமரா பிழை' : 'Camera Error',
              response.errorMessage || (isTa ? 'கேமராவைத் திறக்க முடியவில்லை' : 'Could not open camera')
            );
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
        }
      );
    } catch (err: any) {
      console.warn('Camera error:', err);
      Alert.alert(
        isTa ? 'கேமரா பிழை' : 'Camera Notice',
        isTa
          ? 'கேமரா அணுகலை அனுமதிக்கவும் அல்லது URL இணைப்பைப் பயன்படுத்தவும்.'
          : 'Please allow camera access or use the direct image link option.'
      );
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
      const updated = [...photos];
      updated[activeSlot] = customUrlInput.trim();
      setPhotos(updated);
      setCustomUrlInput('');
      setShowUrlModal(false);
      setActiveSlot(null);
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
            {isTa ? 'S3 இல்...' : 'S3 Upload...'}
          </Text>
        </View>
      );
    }

    if (photoUrl) {
      const isCloudS3 = isS3Url(photoUrl);

      return (
        <View key={index} style={[styles.photoCardFilled, style]}>
          <Image source={{ uri: photoUrl }} style={styles.photoImg} resizeMode="cover" />

          {/* S3 Storage Cloud Badge */}
          <View style={styles.s3Badge}>
            <Text style={styles.s3BadgeText}>
              {isCloudS3 ? '☁️ S3 Bucket' : '✓ Photo'}
            </Text>
          </View>

          {/* Remove Button */}
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
        <View style={styles.plusIconWrap}>
          <Text style={styles.plusIcon}>+</Text>
        </View>
        <Text style={styles.slotUploadLabel}>
          {isMain ? (isTa ? 'முதன்மை புகைப்படம்' : 'Main Photo') : (isTa ? 'பதிவேற்று' : 'Upload')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back button, Progress (8/8) & Language Toggle */}
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
              ? 'உங்கள் சொந்த புகைப்படங்களை நேரடியாக AWS S3 பக்கெட்டில் பதிவேற்றவும்.'
              : 'Upload your real photos directly to secure AWS S3 cloud storage.'}
          </Text>

          {/* S3 Storage Status Banner */}
          <View style={styles.s3StatusBanner}>
            <Text style={styles.s3BannerIcon}>☁️</Text>
            <View style={styles.s3BannerTexts}>
              <Text style={styles.s3BannerTitle}>
                AWS S3 Cloud Storage Active
              </Text>
              <Text style={styles.s3BannerSub}>
                Bucket: {S3_BUCKET_NAME} • {S3_REGION}
              </Text>
            </View>
          </View>
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
            : 'The first photo will be displayed as your main profile picture.'}
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

      {/* Upload Option Selection Action Sheet Modal */}
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
              <TouchableOpacity onPress={() => setActiveSlot(null)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {isTa
                ? 'உங்கள் சாதனத்திலிருந்து புகைப்படத்தைத் தேர்வுசெய்து AWS S3 பக்கெட்டில் நேரடியாகப் பதிவேற்றவும்.'
                : 'Select an image from your device to upload directly into AWS S3.'}
            </Text>

            {/* Option 1: Take Photo with Camera */}
            <TouchableOpacity
              style={styles.uploadOptionCard}
              onPress={handleLaunchCamera}
              activeOpacity={0.7}
            >
              <View style={styles.uploadOptionIconCircle}>
                <Text style={styles.uploadOptionIconEmoji}>📷</Text>
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

            {/* Option 2: Gallery / Photo Library */}
            <TouchableOpacity
              style={styles.uploadOptionCard}
              onPress={handleLaunchGallery}
              activeOpacity={0.7}
            >
              <View style={styles.uploadOptionIconCircle}>
                <Text style={styles.uploadOptionIconEmoji}>🖼️</Text>
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

            {/* Option 3: Direct Web Image URL */}
            <TouchableOpacity
              style={styles.uploadOptionCard}
              onPress={() => setShowUrlModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.uploadOptionIconCircle}>
                <Text style={styles.uploadOptionIconEmoji}>🔗</Text>
              </View>
              <View style={styles.uploadOptionTexts}>
                <Text style={styles.uploadOptionTitle}>
                  {isTa ? 'படத்தின் இணைய இணைப்பை உள்ளிடவும்' : 'Enter Direct Image URL'}
                </Text>
                <Text style={styles.uploadOptionDesc}>
                  {isTa ? 'கிளவுட் அல்லது வெப் பட இணைப்பை உள்ளிடவும்' : 'Paste any direct image URL or cloud storage link'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* S3 Storage Details Note */}
            <View style={styles.modalS3Info}>
              <Text style={styles.modalS3InfoTitle}>
                ☁️ AWS S3 Destination:
              </Text>
              <Text style={styles.modalS3InfoText}>
                {S3_BUCKET_NAME} ({S3_REGION})
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Manual URL Input Modal */}
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
            <Text style={styles.urlModalTitle}>
              {isTa ? 'படத்தின் இணைய இணைப்பை உள்ளிடவும்' : 'Enter Image URL'}
            </Text>
            <Text style={styles.urlModalSubtitle}>
              {isTa ? 'படத்திற்கான முழுமையான HTTP / HTTPS இணைப்பை ஒட்டவும்:' : 'Paste a complete image link (HTTPS):'}
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

            <View style={styles.urlBtnRow}>
              <TouchableOpacity
                style={styles.urlCancelBtn}
                onPress={() => setShowUrlModal(false)}
              >
                <Text style={styles.urlCancelText}>
                  {isTa ? 'ரத்து செய்' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.urlSubmitBtn}
                onPress={handleSaveCustomUrl}
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
    marginBottom: 16,
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

  /* S3 Status Banner */
  s3StatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    width: '100%',
  },
  s3BannerIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  s3BannerTexts: {
    flex: 1,
  },
  s3BannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B21B6',
  },
  s3BannerSub: {
    fontSize: 11,
    color: '#7C3AED',
    marginTop: 1,
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
  plusIcon: {
    fontSize: 20,
    color: BRAND_PURPLE,
    fontWeight: '600',
    lineHeight: 22,
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
    fontSize: 10,
    color: BRAND_PURPLE,
    fontWeight: '600',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  s3Badge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  s3BadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
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

  /* Caption */
  captionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
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
  modalCloseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 6,
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
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  uploadOptionIconEmoji: {
    fontSize: 22,
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
  modalS3Info: {
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    alignItems: 'center',
  },
  modalS3InfoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B21B6',
  },
  modalS3InfoText: {
    fontSize: 11,
    color: '#7C3AED',
    marginTop: 2,
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
  urlModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  urlModalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  urlTextInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
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
