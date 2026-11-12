import React, { useEffect, useState } from 'react';
import './src/theme/typographyScale';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CurvedWaveTabBar } from './src/components/CurvedWaveTabBar';
import { CustomIcon } from './src/components/CustomIcon';
import { Language, Translations } from './src/localization';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { AgeSelectionScreen } from './src/screens/AgeSelectionScreen';
import { BasicDetailsScreen } from './src/screens/BasicDetailsScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { CreateAccountScreen } from './src/screens/CreateAccountScreen';
import { DailyRecommendationsScreen } from './src/screens/DailyRecommendationsScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { EducationCareerScreen } from './src/screens/EducationCareerScreen';
import { FamilyDetailsScreen } from './src/screens/FamilyDetailsScreen';
import { GenderSelectionScreen } from './src/screens/GenderSelectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { HoroscopeMatchDetailScreen } from './src/screens/HoroscopeMatchDetailScreen';
import { InterestsSelectionScreen } from './src/screens/InterestsSelectionScreen';
import { InterestsScreen } from './src/screens/InterestsScreen';
import { LifestyleDetailsScreen } from './src/screens/LifestyleDetailsScreen';
import { LocationDetailsScreen } from './src/screens/LocationDetailsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MatchesScreen } from './src/screens/MatchesScreen';
import { ChoosePlanScreen } from './src/screens/ChoosePlanScreen';
import { MembershipScreen } from './src/screens/MembershipScreen';
import { NewPasswordScreen } from './src/screens/NewPasswordScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PartnerPreferencesScreen } from './src/screens/PartnerPreferencesScreen';
import { PhotosVerificationScreen } from './src/screens/PhotosVerificationScreen';
import { PostRegistrationWelcomeScreen } from './src/screens/PostRegistrationWelcomeScreen';
import { ProfileDetailScreen } from './src/screens/ProfileDetailScreen';
import { ProfileWizardScreen } from './src/screens/ProfileWizardScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ReligiousDetailsScreen } from './src/screens/ReligiousDetailsScreen';
import { RelationshipManagerPortalScreen } from './src/screens/RelationshipManagerPortalScreen';
import { FamilyDecisionCircleScreen } from './src/screens/FamilyDecisionCircleScreen';
import { OperationsManagementScreen } from './src/screens/OperationsManagementScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { VerifyCodeScreen } from './src/screens/VerifyCodeScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { AuthService } from './src/services/authService';
import { StorageService } from './src/services/storage';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from './src/theme';
import { CurrentUser, MatrimonyProfile, PoruthamResult } from './src/types';

type ScreenName =
  | 'splash'
  | 'welcome'
  | 'onboarding'
  | 'create_account'
  | 'basic_details'
  | 'religious_details'
  | 'location_details'
  | 'education_career'
  | 'family_details'
  | 'lifestyle_details'
  | 'partner_preferences'
  | 'photos_verification'
  | 'gender_selection'
  | 'age_selection'
  | 'interests_selection'
  | 'verify_code'
  | 'login'
  | 'forgot_password'
  | 'register'
  | 'wizard'
  | 'post_registration_welcome'
  | 'main'
  | 'profile_detail'
  | 'horoscope_report'
  | 'choose_plan'
  | 'membership'
  | 'notifications'
  | 'chat'
  | 'edit_profile'
  | 'admin'
  | 'daily_recommendations'
  | 'family_circle'
  | 'relationship_manager'
  | 'operations_management';

type TabName = 'home' | 'search' | 'interests' | 'matches' | 'profile';

function ManamaalaiApp() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [unreadNotifCount, setUnreadNotifCount] = useState(2);
  const [isAdmin, setIsAdmin] = useState(false);

  // Stack navigation payloads
  const [selectedProfile, setSelectedProfile] = useState<MatrimonyProfile | null>(null);
  const [selectedPorutham, setSelectedPorutham] = useState<PoruthamResult | null>(null);
  const [chatPartner, setChatPartner] = useState<MatrimonyProfile | null>(null);
  const [wizardInitialData, setWizardInitialData] = useState<any>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [registerInitialCreatedFor, setRegisterInitialCreatedFor] = useState<any>('self');
  const [registerInitialStep, setRegisterInitialStep] = useState<any>('select_for');
  const [registeredEmail, setRegisteredEmail] = useState('example@email.com');
  const [registeredName, setRegisteredName] = useState('John Doe');
  const [registeredPassword, setRegisteredPassword] = useState('password123');
  const [registeredGender, setRegisteredGender] = useState<'male' | 'female'>('male');
  const [registeredAge, setRegisteredAge] = useState<number>(36);
  const [registeredCreatedFor, setRegisteredCreatedFor] = useState('Myself');
  const [registeredDob, setRegisteredDob] = useState('15-08-1996');
  const [registeredHeight, setRegisteredHeight] = useState('5 ft 6 in (167 cm)');
  const [registeredMaritalStatus, setRegisteredMaritalStatus] = useState('Never married');
  const [registeredMobile, setRegisteredMobile] = useState('');
  const [registeredReligion, setRegisteredReligion] = useState('Hindu');
  const [registeredCommunity, setRegisteredCommunity] = useState('');
  const [registeredSubCommunity, setRegisteredSubCommunity] = useState('');
  const [registeredNakshatra, setRegisteredNakshatra] = useState('');
  const [registeredRaasi, setRegisteredRaasi] = useState('');
  const [registeredDosham, setRegisteredDosham] = useState('No dosham');
  const [registeredBirthTime, setRegisteredBirthTime] = useState('');
  const [registeredBirthPlace, setRegisteredBirthPlace] = useState('');
  const [registeredNativePlace, setRegisteredNativePlace] = useState('');
  const [registeredNativeDistrict, setRegisteredNativeDistrict] = useState('');
  const [registeredCountry, setRegisteredCountry] = useState('India');
  const [registeredState, setRegisteredState] = useState('Tamil Nadu');
  const [registeredCurrentCity, setRegisteredCurrentCity] = useState('');
  const [registeredResidencyStatus, setRegisteredResidencyStatus] = useState('Citizen');
  const [registeredHighestQualification, setRegisteredHighestQualification] = useState('');
  const [registeredCollege, setRegisteredCollege] = useState('');
  const [registeredEmployedIn, setRegisteredEmployedIn] = useState('Private');
  const [registeredOccupation, setRegisteredOccupation] = useState('');
  const [registeredCompany, setRegisteredCompany] = useState('');
  const [registeredAnnualIncome, setRegisteredAnnualIncome] = useState('');
  const [registeredFatherOccupation, setRegisteredFatherOccupation] = useState('');
  const [registeredMotherOccupation, setRegisteredMotherOccupation] = useState('');
  const [registeredBrothers, setRegisteredBrothers] = useState('0');
  const [registeredSisters, setRegisteredSisters] = useState('0');
  const [registeredFamilyType, setRegisteredFamilyType] = useState('Nuclear');
  const [registeredFamilyValues, setRegisteredFamilyValues] = useState('Traditional');
  const [registeredFamilyStatus, setRegisteredFamilyStatus] = useState('Middle class');
  const [registeredDiet, setRegisteredDiet] = useState('Vegetarian');
  const [registeredSmoking, setRegisteredSmoking] = useState('No');
  const [registeredDrinking, setRegisteredDrinking] = useState('No');
  const [registeredHobbies, setRegisteredHobbies] = useState<string[]>(['Music', 'Travel']);
  const [registeredAboutMe, setRegisteredAboutMe] = useState('');
  const [registeredPrefAgeMin, setRegisteredPrefAgeMin] = useState('18');
  const [registeredPrefAgeMax, setRegisteredPrefAgeMax] = useState('35');
  const [registeredPrefHeight, setRegisteredPrefHeight] = useState('Any');
  const [registeredPrefMaritalStatus, setRegisteredPrefMaritalStatus] = useState('Never married');
  const [registeredPrefReligionCommunity, setRegisteredPrefReligionCommunity] = useState('');
  const [registeredPrefMinEducation, setRegisteredPrefMinEducation] = useState('Any');
  const [registeredPrefLocation, setRegisteredPrefLocation] = useState('');
  const [registeredPrefDiet, setRegisteredPrefDiet] = useState('Any');
  const [registeredPrefOtherExpectations, setRegisteredPrefOtherExpectations] = useState('');
  const [registeredInterests, setRegisteredInterests] = useState<string[]>([
    'gaming',
    'photography',
    'arts',
    'football',
    'business',
  ]);

  const initApp = async () => {
    await StorageService.initialize();
    const lang = await StorageService.getLanguage();
    setLanguage(lang);
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');

    const notifs = await StorageService.getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    setUnreadNotifCount(unread);
  };

  useEffect(() => {
    initApp();
  }, []);

  const handleToggleLanguage = async () => {
    const nextLang: Language = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
    await StorageService.setLanguage(nextLang);
  };

  const handleToggleAdmin = async () => {
    await AuthService.toggleAdminMode();
    setIsAdmin(true);
    setCurrentScreen('admin');
  };

  const handleOpenProfile = (profile: MatrimonyProfile) => {
    setSelectedProfile(profile);
    setCurrentScreen('profile_detail');
  };

  const handleOpenHoroscopeReport = (porutham: PoruthamResult) => {
    setSelectedPorutham(porutham);
    setCurrentScreen('horoscope_report');
  };

  const handleOpenChat = (profile: MatrimonyProfile) => {
    setChatPartner(profile);
    setCurrentScreen('chat');
  };

  const handleSearchTrigger = (initialQ?: string) => {
    if (initialQ) setSearchInitialQuery(initialQ);
    setActiveTab('search');
    setCurrentScreen('main');
  };

  const t = Translations[language];

  // Screen Routing Renderer
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onFinish={() => {
              setCurrentScreen('welcome');
            }}
          />
        );

      case 'welcome':
        return (
          <WelcomeScreen
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onRegisterPress={createdFor => {
              if (createdFor) setRegisterInitialCreatedFor(createdFor);
              setCurrentScreen('onboarding');
            }}
            onLoginPress={() => setCurrentScreen('login')}
            onGuestBrowse={() => setCurrentScreen('main')}
          />
        );

      case 'onboarding':
        return (
          <OnboardingScreen
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onComplete={() => setCurrentScreen('create_account')}
            onSkip={() => setCurrentScreen('create_account')}
          />
        );

      case 'create_account':
        return (
          <CreateAccountScreen
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onSignUpSuccess={data => {
              setRegisteredName(data.name);
              setRegisteredEmail(data.email);
              setRegisteredPassword(data.password);
              setCurrentScreen('basic_details');
            }}
            onLoginPress={() => setCurrentScreen('login')}
            onBackPress={() => setCurrentScreen('onboarding')}
          />
        );

      case 'basic_details':
        return (
          <BasicDetailsScreen
            language={language}
            initialData={{
              fullName: registeredName,
              gender: registeredGender,
              profileFor: registeredCreatedFor,
              dob: registeredDob,
              height: registeredHeight,
              maritalStatus: registeredMaritalStatus,
              mobileNumber: registeredMobile,
            }}
            onNext={data => {
              setRegisteredCreatedFor(data.profileFor);
              setRegisteredGender(data.gender);
              setRegisteredName(data.fullName);
              setRegisteredDob(data.dob);
              setRegisteredHeight(data.height);
              setRegisteredMaritalStatus(data.maritalStatus);
              setRegisteredMobile(data.mobileNumber);

              let age = registeredAge;
              if (data.dob && data.dob.includes('-')) {
                const parts = data.dob.split('-');
                if (parts.length === 3) {
                  const birthYear = parseInt(parts[2], 10);
                  if (!isNaN(birthYear) && birthYear > 1940 && birthYear < 2010) {
                    age = new Date().getFullYear() - birthYear;
                  }
                }
              }
              setRegisteredAge(age);

              setWizardInitialData({
                name: data.fullName,
                email: registeredEmail,
                password: registeredPassword,
                gender: data.gender === 'male' ? 'groom' : 'bride',
                createdFor: data.profileFor,
                dateOfBirth: data.dob,
                age,
                height: data.height,
                maritalStatus: data.maritalStatus,
                phone: data.mobileNumber,
                step: 1,
              });
              setCurrentScreen('religious_details');
            }}
            onBackPress={() => setCurrentScreen('create_account')}
          />
        );

      case 'religious_details':
        return (
          <ReligiousDetailsScreen
            language={language}
            initialData={{
              religion: registeredReligion,
              community: registeredCommunity,
              subCommunity: registeredSubCommunity,
              nakshatra: registeredNakshatra,
              raasi: registeredRaasi,
              dosham: registeredDosham,
              timeOfBirth: registeredBirthTime,
              placeOfBirth: registeredBirthPlace,
            }}
            onNext={data => {
              setRegisteredReligion(data.religion);
              setRegisteredCommunity(data.community);
              setRegisteredSubCommunity(data.subCommunity);
              setRegisteredNakshatra(data.nakshatra);
              setRegisteredRaasi(data.raasi);
              setRegisteredDosham(data.dosham);
              setRegisteredBirthTime(data.timeOfBirth);
              setRegisteredBirthPlace(data.placeOfBirth);

              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                gender: registeredGender === 'male' ? 'groom' : 'bride',
                createdFor: registeredCreatedFor,
                dateOfBirth: registeredDob,
                age: registeredAge,
                height: registeredHeight,
                maritalStatus: registeredMaritalStatus,
                phone: registeredMobile,
                religion: data.religion,
                caste: data.community,
                subCaste: data.subCommunity,
                nakshatram: data.nakshatra,
                rasi: data.raasi,
                dosham: data.dosham,
                birthTime: data.timeOfBirth,
                birthPlace: data.placeOfBirth,
                step: 2,
              });
              setCurrentScreen('location_details');
            }}
            onBackPress={() => setCurrentScreen('basic_details')}
          />
        );

      case 'location_details':
        return (
          <LocationDetailsScreen
            language={language}
            initialData={{
              nativePlace: registeredNativePlace,
              nativeDistrict: registeredNativeDistrict,
              country: registeredCountry,
              state: registeredState,
              currentCity: registeredCurrentCity,
              residencyStatus: registeredResidencyStatus,
            }}
            onNext={data => {
              setRegisteredNativePlace(data.nativePlace);
              setRegisteredNativeDistrict(data.nativeDistrict);
              setRegisteredCountry(data.country);
              setRegisteredState(data.state);
              setRegisteredCurrentCity(data.currentCity);
              setRegisteredResidencyStatus(data.residencyStatus);

              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                gender: registeredGender === 'male' ? 'groom' : 'bride',
                createdFor: registeredCreatedFor,
                dateOfBirth: registeredDob,
                age: registeredAge,
                height: registeredHeight,
                maritalStatus: registeredMaritalStatus,
                phone: registeredMobile,
                religion: registeredReligion,
                caste: registeredCommunity,
                subCaste: registeredSubCommunity,
                nakshatram: registeredNakshatra,
                rasi: registeredRaasi,
                dosham: registeredDosham,
                birthTime: registeredBirthTime,
                birthPlace: registeredBirthPlace,
                location: `${data.currentCity || data.nativePlace || 'Chennai'}, ${data.state || 'Tamil Nadu'}`,
                nativePlace: data.nativePlace,
                nativeDistrict: data.nativeDistrict,
                country: data.country,
                state: data.state,
                currentCity: data.currentCity,
                residencyStatus: data.residencyStatus,
                step: 3,
              });
              setCurrentScreen('education_career');
            }}
            onBackPress={() => setCurrentScreen('religious_details')}
          />
        );

      case 'education_career':
        return (
          <EducationCareerScreen
            language={language}
            initialData={{
              highestQualification: registeredHighestQualification,
              college: registeredCollege,
              employedIn: registeredEmployedIn,
              occupation: registeredOccupation,
              company: registeredCompany,
              annualIncome: registeredAnnualIncome,
            }}
            onNext={data => {
              setRegisteredHighestQualification(data.highestQualification);
              setRegisteredCollege(data.college);
              setRegisteredEmployedIn(data.employedIn);
              setRegisteredOccupation(data.occupation);
              setRegisteredCompany(data.company);
              setRegisteredAnnualIncome(data.annualIncome);

              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                gender: registeredGender === 'male' ? 'groom' : 'bride',
                createdFor: registeredCreatedFor,
                dateOfBirth: registeredDob,
                age: registeredAge,
                height: registeredHeight,
                maritalStatus: registeredMaritalStatus,
                phone: registeredMobile,
                religion: registeredReligion,
                caste: registeredCommunity,
                subCaste: registeredSubCommunity,
                nakshatram: registeredNakshatra,
                rasi: registeredRaasi,
                dosham: registeredDosham,
                birthTime: registeredBirthTime,
                birthPlace: registeredBirthPlace,
                location: `${registeredCurrentCity || registeredNativePlace || 'Chennai'}, ${registeredState || 'Tamil Nadu'}`,
                nativePlace: registeredNativePlace,
                nativeDistrict: registeredNativeDistrict,
                country: registeredCountry,
                state: registeredState,
                currentCity: registeredCurrentCity,
                residencyStatus: registeredResidencyStatus,
                education: data.highestQualification,
                college: data.college,
                employedIn: data.employedIn,
                profession: data.occupation,
                company: data.company,
                income: data.annualIncome,
                step: 4,
              });
              setCurrentScreen('family_details');
            }}
            onBackPress={() => setCurrentScreen('location_details')}
          />
        );

      case 'family_details':
        return (
          <FamilyDetailsScreen
            language={language}
            initialData={{
              fatherOccupation: registeredFatherOccupation,
              motherOccupation: registeredMotherOccupation,
              brothers: registeredBrothers,
              sisters: registeredSisters,
              familyType: registeredFamilyType,
              familyValues: registeredFamilyValues,
              familyStatus: registeredFamilyStatus,
            }}
            onNext={data => {
              setRegisteredFatherOccupation(data.fatherOccupation);
              setRegisteredMotherOccupation(data.motherOccupation);
              setRegisteredBrothers(data.brothers);
              setRegisteredSisters(data.sisters);
              setRegisteredFamilyType(data.familyType);
              setRegisteredFamilyValues(data.familyValues);
              setRegisteredFamilyStatus(data.familyStatus);

              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                gender: registeredGender === 'male' ? 'groom' : 'bride',
                createdFor: registeredCreatedFor,
                dateOfBirth: registeredDob,
                age: registeredAge,
                height: registeredHeight,
                maritalStatus: registeredMaritalStatus,
                phone: registeredMobile,
                religion: registeredReligion,
                caste: registeredCommunity,
                subCaste: registeredSubCommunity,
                nakshatram: registeredNakshatra,
                rasi: registeredRaasi,
                dosham: registeredDosham,
                birthTime: registeredBirthTime,
                birthPlace: registeredBirthPlace,
                location: `${registeredCurrentCity || registeredNativePlace || 'Chennai'}, ${registeredState || 'Tamil Nadu'}`,
                nativePlace: registeredNativePlace,
                nativeDistrict: registeredNativeDistrict,
                country: registeredCountry,
                state: registeredState,
                currentCity: registeredCurrentCity,
                residencyStatus: registeredResidencyStatus,
                education: registeredHighestQualification,
                college: registeredCollege,
                employedIn: registeredEmployedIn,
                profession: registeredOccupation,
                company: registeredCompany,
                income: registeredAnnualIncome,
                fatherName: 'Father',
                fatherOccupation: data.fatherOccupation,
                motherName: 'Mother',
                motherOccupation: data.motherOccupation,
                brothersCount: parseInt(data.brothers.replace(/\D/g, '') || '0', 10),
                sistersCount: parseInt(data.sisters.replace(/\D/g, '') || '0', 10),
                familyType: data.familyType,
                familyValues: data.familyValues,
                familyStatus: data.familyStatus,
                step: 5,
              });
              setCurrentScreen('lifestyle_details');
            }}
            onBackPress={() => setCurrentScreen('education_career')}
          />
        );

      case 'lifestyle_details':
        return (
          <LifestyleDetailsScreen
            language={language}
            initialData={{
              diet: registeredDiet,
              smoking: registeredSmoking,
              drinking: registeredDrinking,
              hobbies: registeredHobbies,
              aboutMe: registeredAboutMe,
            }}
            onNext={data => {
              setRegisteredDiet(data.diet);
              setRegisteredSmoking(data.smoking);
              setRegisteredDrinking(data.drinking);
              setRegisteredHobbies(data.hobbies);
              setRegisteredAboutMe(data.aboutMe);

              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                gender: registeredGender === 'male' ? 'groom' : 'bride',
                createdFor: registeredCreatedFor,
                dateOfBirth: registeredDob,
                age: registeredAge,
                height: registeredHeight,
                maritalStatus: registeredMaritalStatus,
                phone: registeredMobile,
                religion: registeredReligion,
                caste: registeredCommunity,
                subCaste: registeredSubCommunity,
                nakshatram: registeredNakshatra,
                rasi: registeredRaasi,
                dosham: registeredDosham,
                birthTime: registeredBirthTime,
                birthPlace: registeredBirthPlace,
                location: `${registeredCurrentCity || registeredNativePlace || 'Chennai'}, ${registeredState || 'Tamil Nadu'}`,
                nativePlace: registeredNativePlace,
                nativeDistrict: registeredNativeDistrict,
                country: registeredCountry,
                state: registeredState,
                currentCity: registeredCurrentCity,
                residencyStatus: registeredResidencyStatus,
                education: registeredHighestQualification,
                college: registeredCollege,
                employedIn: registeredEmployedIn,
                profession: registeredOccupation,
                company: registeredCompany,
                income: registeredAnnualIncome,
                fatherName: 'Father',
                fatherOccupation: registeredFatherOccupation,
                motherName: 'Mother',
                motherOccupation: registeredMotherOccupation,
                brothersCount: parseInt(registeredBrothers.replace(/\D/g, '') || '0', 10),
                sistersCount: parseInt(registeredSisters.replace(/\D/g, '') || '0', 10),
                familyType: registeredFamilyType,
                familyValues: registeredFamilyValues,
                familyStatus: registeredFamilyStatus,
                diet: data.diet,
                smoking: data.smoking,
                drinking: data.drinking,
                hobbies: data.hobbies,
                aboutMe: data.aboutMe,
                step: 6,
              });
              setCurrentScreen('partner_preferences');
            }}
            onBackPress={() => setCurrentScreen('family_details')}
          />
        );

      case 'partner_preferences':
        return (
          <PartnerPreferencesScreen
            language={language}
            initialData={{
              ageMin: registeredPrefAgeMin,
              ageMax: registeredPrefAgeMax,
              height: registeredPrefHeight,
              maritalStatus: registeredPrefMaritalStatus,
              religionCommunity: registeredPrefReligionCommunity,
              minimumEducation: registeredPrefMinEducation,
              preferredLocation: registeredPrefLocation,
              diet: registeredPrefDiet,
              otherExpectations: registeredPrefOtherExpectations,
            }}
            onNext={data => {
              setRegisteredPrefAgeMin(data.ageMin);
              setRegisteredPrefAgeMax(data.ageMax);
              setRegisteredPrefHeight(data.height);
              setRegisteredPrefMaritalStatus(data.maritalStatus);
              setRegisteredPrefReligionCommunity(data.religionCommunity);
              setRegisteredPrefMinEducation(data.minimumEducation);
              setRegisteredPrefLocation(data.preferredLocation);
              setRegisteredPrefDiet(data.diet);
              setRegisteredPrefOtherExpectations(data.otherExpectations);

              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                gender: registeredGender === 'male' ? 'groom' : 'bride',
                createdFor: registeredCreatedFor,
                dateOfBirth: registeredDob,
                age: registeredAge,
                height: registeredHeight,
                maritalStatus: registeredMaritalStatus,
                phone: registeredMobile,
                religion: registeredReligion,
                caste: registeredCommunity,
                subCaste: registeredSubCommunity,
                nakshatram: registeredNakshatra,
                rasi: registeredRaasi,
                dosham: registeredDosham,
                birthTime: registeredBirthTime,
                birthPlace: registeredBirthPlace,
                location: `${registeredCurrentCity || registeredNativePlace || 'Chennai'}, ${registeredState || 'Tamil Nadu'}`,
                nativePlace: registeredNativePlace,
                nativeDistrict: registeredNativeDistrict,
                country: registeredCountry,
                state: registeredState,
                currentCity: registeredCurrentCity,
                residencyStatus: registeredResidencyStatus,
                education: registeredHighestQualification,
                college: registeredCollege,
                employedIn: registeredEmployedIn,
                profession: registeredOccupation,
                company: registeredCompany,
                income: registeredAnnualIncome,
                fatherName: 'Father',
                fatherOccupation: registeredFatherOccupation,
                motherName: 'Mother',
                motherOccupation: registeredMotherOccupation,
                brothersCount: parseInt(registeredBrothers.replace(/\D/g, '') || '0', 10),
                sistersCount: parseInt(registeredSisters.replace(/\D/g, '') || '0', 10),
                familyType: registeredFamilyType,
                familyValues: registeredFamilyValues,
                familyStatus: registeredFamilyStatus,
                diet: registeredDiet,
                smoking: registeredSmoking,
                drinking: registeredDrinking,
                hobbies: registeredHobbies,
                aboutMe: registeredAboutMe,
                prefAgeMin: parseInt(data.ageMin, 10) || 18,
                prefAgeMax: parseInt(data.ageMax, 10) || 35,
                prefHeight: data.height,
                prefMaritalStatus: data.maritalStatus,
                prefReligionCommunity: data.religionCommunity,
                prefEducation: data.minimumEducation,
                prefLocation: data.preferredLocation,
                prefDiet: data.diet,
                prefOtherExpectations: data.otherExpectations,
                step: 7,
              });
              setCurrentScreen('photos_verification');
            }}
            onBackPress={() => setCurrentScreen('lifestyle_details')}
          />
        );

      case 'photos_verification':
        return (
          <PhotosVerificationScreen
            language={language}
            userGender={registeredGender}
            onFinish={async data => {
              const profileGender = registeredGender === 'male' ? 'groom' : 'bride';
              const createdForMap: any = {
                Myself: 'self',
                Son: 'son',
                Daughter: 'daughter',
                Brother: 'brother',
                Sister: 'sister',
                Relative: 'relative',
              };
              const maritalStatusMap: any = {
                'Never married': 'never_married',
                Divorced: 'divorced',
                Widowed: 'widowed',
                'Awaiting divorce': 'awaiting_divorce',
              };

              const newProfile: MatrimonyProfile = {
                id: `usr_${Date.now()}`,
                userId: currentUser?.id || 'usr_registered',
                matrimonyId: `MM-TN-${Math.floor(1000 + Math.random() * 9000)}`,
                name: registeredName,
                gender: profileGender,
                createdFor: createdForMap[registeredCreatedFor] || 'self',
                age: registeredAge,
                dateOfBirth: registeredDob,
                maritalStatus: maritalStatusMap[registeredMaritalStatus] || 'never_married',
                physicalStatus: 'normal',
                motherTongue: 'Tamil',
                religion: registeredReligion || 'Hindu',
                caste: registeredCommunity || 'Kongu Vellalar',
                subCaste: registeredSubCommunity || '',
                allowIntercaste: false,
                nativeDistrict: registeredNativeDistrict || 'Coimbatore',
                currentCity: registeredCurrentCity || 'Chennai',
                currentCountry: registeredCountry || 'India',
                photos: data.photos,
                about: registeredAboutMe || `${registeredName} is looking for a caring, compatible life partner from a traditional Tamil family.`,
                isVerified: data.isMobileVerified || data.isIdVerified,
                verificationBadgeType: data.isIdVerified ? 'aadhar' : undefined,
                membershipTier: 'free',
                profileCompleteness: 90,
                phone: registeredMobile || '+91 9876543210',
                email: registeredEmail,
                educationCareer: {
                  qualification: registeredHighestQualification || 'B.E. / B.Tech',
                  institution: registeredCollege || 'Anna University',
                  occupation: registeredOccupation || 'Software Engineer',
                  employer: registeredCompany || 'Tech Corp',
                  annualIncome: registeredAnnualIncome || '₹7.5 - ₹10 Lakhs',
                  workLocation: registeredCurrentCity || 'Chennai',
                },
                family: {
                  fatherOccupation: registeredFatherOccupation || 'Retired',
                  motherOccupation: registeredMotherOccupation || 'Homemaker',
                  siblings: `${registeredBrothers} Brother(s), ${registeredSisters} Sister(s)`,
                  siblingsMarried: 'No',
                  familyType: registeredFamilyType === 'Joint' ? 'joint' : 'nuclear',
                  familyValues: registeredFamilyValues.toLowerCase() as any,
                  familyStatus: registeredFamilyStatus || 'Middle class',
                  nativeDistrict: registeredNativeDistrict || 'Coimbatore',
                },
                horoscope: {
                  rasi: registeredRaasi || 'Mesham (மேஷம்)',
                  nakshatram: registeredNakshatra || 'Ashwini (அஸ்வினி)',
                  lagnam: 'Mesham',
                  gothram: 'Shiva',
                  chevvaiDosham: registeredDosham === 'Chevvai dosham',
                  sarpaDosham: registeredDosham === 'Rahu-Ketu',
                  birthDate: registeredDob,
                  birthTime: registeredBirthTime || '09:30 AM',
                  birthPlace: registeredBirthPlace || registeredNativePlace || 'Chennai',
                },
                lifestyle: {
                  diet: registeredDiet === 'Vegetarian' ? 'vegetarian' : registeredDiet === 'Eggetarian' ? 'eggetarian' : 'non_vegetarian',
                  smoking: registeredSmoking === 'Yes',
                  drinking: registeredDrinking === 'Yes',
                  hobbies: registeredHobbies,
                  languagesKnown: ['Tamil', 'English'],
                  heightCm: 167,
                  heightFeet: registeredHeight || "5' 6\"",
                  complexion: 'Wheatish',
                },
                partnerPreferences: {
                  ageMin: parseInt(registeredPrefAgeMin, 10) || 18,
                  ageMax: parseInt(registeredPrefAgeMax, 10) || 35,
                  heightMinCm: 152,
                  heightMaxCm: 185,
                  maritalStatus: ['never_married'],
                  religions: [registeredReligion || 'Hindu'],
                  castes: registeredCommunity ? [registeredCommunity] : [],
                  allowIntercaste: false,
                  educationLevels: [registeredPrefMinEducation || 'Any'],
                  occupations: ['Any'],
                  locations: registeredPrefLocation ? [registeredPrefLocation] : ['Tamil Nadu'],
                  diet: registeredPrefDiet === 'Vegetarian' ? ['vegetarian'] : ['vegetarian', 'non_vegetarian'],
                },
                privacy: {
                  hidePhoneUntilInterestAccepted: true,
                  hideHoroscopeUntilRequested: false,
                  showPhotoToRegisteredOnly: false,
                },
                createdAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
              };

              await StorageService.saveProfile(newProfile);
              await StorageService.updateCurrentUser({
                email: registeredEmail,
                phone: registeredMobile,
                activeProfileId: newProfile.id,
              });

              setSelectedProfile(newProfile);
              await initApp();
              setCurrentScreen('post_registration_welcome');
            }}
            onBackPress={() => setCurrentScreen('partner_preferences')}
          />
        );

      case 'gender_selection':
        return (
          <GenderSelectionScreen
            language={language}
            initialGender={registeredGender}
            onNext={gender => {
              setRegisteredGender(gender);
              setCurrentScreen('age_selection');
            }}
            onBackPress={() => setCurrentScreen('create_account')}
          />
        );

      case 'age_selection':
        return (
          <AgeSelectionScreen
            language={language}
            initialAge={registeredAge}
            onNext={age => {
              setRegisteredAge(age);
              setCurrentScreen('interests_selection');
            }}
            onBackPress={() => setCurrentScreen('gender_selection')}
          />
        );

      case 'interests_selection':
        return (
          <InterestsSelectionScreen
            language={language}
            initialInterests={registeredInterests}
            onNext={interests => {
              setRegisteredInterests(interests);
              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                gender: registeredGender === 'male' ? 'groom' : 'bride',
                age: registeredAge,
                interests,
                step: 1,
              });
              setCurrentScreen('wizard');
            }}
            onBackPress={() => setCurrentScreen('age_selection')}
          />
        );

      case 'verify_code':
        return (
          <VerifyCodeScreen
            language={language}
            email={registeredEmail}
            onVerifySuccess={() => {
              setWizardInitialData({
                name: registeredName,
                email: registeredEmail,
                password: registeredPassword,
                step: 1,
              });
              setCurrentScreen('wizard');
            }}
            onBackPress={() => setCurrentScreen('create_account')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onLoginSuccess={() => {
              initApp();
              setCurrentScreen('main');
            }}
            onRegisterPress={() => setCurrentScreen('create_account')}
            onForgotPasswordPress={() => setCurrentScreen('forgot_password')}
            onBackPress={() => setCurrentScreen('create_account')}
          />
        );

      case 'forgot_password':
        return (
          <NewPasswordScreen
            language={language}
            onPasswordResetSuccess={() => setCurrentScreen('login')}
            onBackPress={() => setCurrentScreen('login')}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            language={language}
            onToggleLanguage={handleToggleLanguage}
            initialCreatedFor={registerInitialCreatedFor}
            initialStep={registerInitialStep}
            onContinueToWizard={data => {
              setWizardInitialData(data);
              setRegisterInitialStep('account_exists');
              setCurrentScreen('wizard');
            }}
            onLoginPress={() => {
              setRegisterInitialStep('select_for');
              setCurrentScreen('login');
            }}
            onBackPress={() => {
              setRegisterInitialStep('select_for');
              setCurrentScreen('login');
            }}
          />
        );

      case 'wizard':
        return (
          <ProfileWizardScreen
            initialData={wizardInitialData}
            initialStep={wizardInitialData?.step || 1}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onComplete={newProfile => {
              setSelectedProfile(newProfile);
              initApp();
              setCurrentScreen('post_registration_welcome');
            }}
            onBack={() => setCurrentScreen('register')}
          />
        );

      case 'post_registration_welcome':
        return (
          <PostRegistrationWelcomeScreen
            userProfile={selectedProfile}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onExploreMatches={async () => {
              await StorageService.setPostRegistrationWelcomeSeen(true);
              setActiveTab('home');
              setCurrentScreen('main');
            }}
          />
        );

      case 'profile_detail':
        return selectedProfile ? (
          <ProfileDetailScreen
            profile={selectedProfile}
            language={language}
            onBack={() => setCurrentScreen('main')}
            onViewHoroscopePorutham={handleOpenHoroscopeReport}
            onUpgradeMembership={() => setCurrentScreen('membership')}
            onChatPress={() => handleOpenChat(selectedProfile)}
          />
        ) : null;

      case 'horoscope_report':
        return selectedPorutham ? (
          <HoroscopeMatchDetailScreen
            porutham={selectedPorutham}
            language={language}
            onBack={() => setCurrentScreen(selectedProfile ? 'profile_detail' : 'main')}
          />
        ) : null;

      case 'choose_plan':
        return (
          <ChoosePlanScreen
            language={language}
            onBack={() => setCurrentScreen('main')}
            onSelectPlan={() => setCurrentScreen('membership')}
          />
        );

      case 'membership':
        return (
          <MembershipScreen
            language={language}
            onBack={() => setCurrentScreen('main')}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen
            language={language}
            onBack={() => {
              initApp();
              setCurrentScreen('main');
            }}
            onSelectNotification={async item => {
              if (item.senderProfileId) {
                const p = await StorageService.getProfileById(item.senderProfileId);
                if (p) handleOpenProfile(p);
              }
            }}
          />
        );

      case 'chat':
        return chatPartner ? (
          <ChatScreen
            partnerProfile={chatPartner}
            language={language}
            onBack={() => setCurrentScreen('main')}
          />
        ) : null;

      case 'edit_profile':
        return selectedProfile ? (
          <EditProfileScreen
            profile={selectedProfile}
            language={language}
            onBack={() => setCurrentScreen('main')}
            onSaved={updated => {
              setSelectedProfile(updated);
              setCurrentScreen('main');
            }}
          />
        ) : null;

      case 'admin':
        return (
          <AdminDashboardScreen
            language={language}
            onBack={() => setCurrentScreen('main')}
            onViewProfile={handleOpenProfile}
            onOperationsPress={() => setCurrentScreen('operations_management')}
          />
        );

      case 'daily_recommendations':
        return (
          <DailyRecommendationsScreen
            language={language}
            onBack={() => setCurrentScreen('main')}
            onProfilePress={handleOpenProfile}
            onUpgradeMembership={() => setCurrentScreen('membership')}
            onChatPress={handleOpenChat}
          />
        );

      case 'family_circle':
        return (
          <FamilyDecisionCircleScreen
            language={language}
            onBack={() => setCurrentScreen('main')}
            onViewProfile={handleOpenProfile}
          />
        );

      case 'relationship_manager':
        return (
          <RelationshipManagerPortalScreen
            language={language}
            onBack={() => setCurrentScreen('main')}
            onViewProfile={async profileId => {
              const p = await StorageService.getProfileById(profileId);
              if (p) handleOpenProfile(p);
            }}
          />
        );

      case 'operations_management':
        return (
          <OperationsManagementScreen
            language={language}
            onBack={() => setCurrentScreen('main')}
          />
        );

      case 'main':
      default:
        return (
          <View style={styles.mainLayout}>
            <View style={styles.tabContent}>
              {activeTab === 'home' && (
                <HomeScreen
                  language={language}
                  onToggleLanguage={handleToggleLanguage}
                  onNotificationPress={() => setCurrentScreen('notifications')}
                  onAdminPress={handleToggleAdmin}
                  onProfilePress={handleOpenProfile}
                  onSearchPress={handleSearchTrigger}
                  onMembershipPress={() => setCurrentScreen('membership')}
                  onInterestsTabPress={() => setActiveTab('interests')}
                  onChatPress={handleOpenChat}
                  onDailyRecommendationsPress={() => setCurrentScreen('daily_recommendations')}
                  onFamilyCirclePress={() => setCurrentScreen('family_circle')}
                  onRelationshipManagerPress={() => setCurrentScreen('relationship_manager')}
                  unreadCount={unreadNotifCount}
                  isAdmin={isAdmin}
                />
              )}

              {activeTab === 'search' && (
                <SearchScreen
                  language={language}
                  onToggleLanguage={handleToggleLanguage}
                  onNotificationPress={() => setCurrentScreen('notifications')}
                  onAdminPress={handleToggleAdmin}
                  onProfilePress={handleOpenProfile}
                  initialQuery={searchInitialQuery}
                  unreadCount={unreadNotifCount}
                  isAdmin={isAdmin}
                />
              )}

              {activeTab === 'interests' && (
                <InterestsScreen
                  language={language}
                  onToggleLanguage={handleToggleLanguage}
                  onNotificationPress={() => setCurrentScreen('notifications')}
                  onAdminPress={handleToggleAdmin}
                  onProfilePress={handleOpenProfile}
                  onChatPress={handleOpenChat}
                  onBack={() => setActiveTab('home')}
                  unreadCount={unreadNotifCount}
                  isAdmin={isAdmin}
                />
              )}

              {activeTab === 'matches' && (
                <MatchesScreen
                  language={language}
                  onToggleLanguage={handleToggleLanguage}
                  onNotificationPress={() => setCurrentScreen('notifications')}
                  onAdminPress={handleToggleAdmin}
                  onProfilePress={handleOpenProfile}
                  onChatPress={handleOpenChat}
                  onBack={() => setActiveTab('home')}
                  onDailyRecommendationsPress={() => setCurrentScreen('daily_recommendations')}
                  unreadCount={unreadNotifCount}
                  isAdmin={isAdmin}
                />
              )}

              {activeTab === 'profile' && (
                <UserProfileScreen
                  language={language}
                  onToggleLanguage={handleToggleLanguage}
                  onNotificationPress={() => setCurrentScreen('notifications')}
                  onAdminPress={handleToggleAdmin}
                  onBack={() => setActiveTab('home')}
                  onEditProfile={async () => {
                    const u = await StorageService.getCurrentUser();
                    const p = await StorageService.getProfileById(u.activeProfileId);
                    if (p) {
                      setSelectedProfile(p);
                      setCurrentScreen('edit_profile');
                    }
                  }}
                  onMembershipPress={() => setCurrentScreen('choose_plan')}
                  onPaymentMethodsPress={() => setCurrentScreen('membership')}
                  onViewMyProfile={handleOpenProfile}
                  onFamilyCirclePress={() => setCurrentScreen('family_circle')}
                  onRelationshipManagerPress={() => setCurrentScreen('relationship_manager')}
                  onOperationsPress={() => setCurrentScreen('operations_management')}
                  onLogout={() => setCurrentScreen('welcome')}
                  unreadCount={unreadNotifCount}
                  isAdmin={isAdmin}
                />
              )}
            </View>

            {/* Curved Wave Bottom Tab Bar (Pinterest Reference: 1044694444808570386) */}
            <CurvedWaveTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              unreadCount={unreadNotifCount}
            />
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderCurrentScreen()}</View>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ManamaalaiApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.stylistBg,
  },
  mainLayout: {
    flex: 1,
    backgroundColor: Colors.stylistBg,
  },
  tabContent: {
    flex: 1,
  },
});
