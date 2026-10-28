import React, { useEffect, useState } from 'react';
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
import { ChatScreen } from './src/screens/ChatScreen';
import { DailyRecommendationsScreen } from './src/screens/DailyRecommendationsScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { HoroscopeMatchDetailScreen } from './src/screens/HoroscopeMatchDetailScreen';
import { InterestsScreen } from './src/screens/InterestsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MatchesScreen } from './src/screens/MatchesScreen';
import { MembershipScreen } from './src/screens/MembershipScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileDetailScreen } from './src/screens/ProfileDetailScreen';
import { ProfileWizardScreen } from './src/screens/ProfileWizardScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { AuthService } from './src/services/authService';
import { StorageService } from './src/services/storage';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from './src/theme';
import { CurrentUser, MatrimonyProfile, PoruthamResult } from './src/types';

type ScreenName =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'register'
  | 'wizard'
  | 'main'
  | 'profile_detail'
  | 'horoscope_report'
  | 'membership'
  | 'notifications'
  | 'chat'
  | 'edit_profile'
  | 'admin'
  | 'daily_recommendations';

type TabName = 'home' | 'search' | 'interests' | 'matches' | 'profile';

function ManamaalaiApp() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('login');
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
    const adminActive = await AuthService.toggleAdminMode();
    setIsAdmin(adminActive);
    if (adminActive) {
      setCurrentScreen('admin');
    }
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
              setCurrentScreen('login');
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
              setCurrentScreen('register');
            }}
            onLoginPress={() => setCurrentScreen('login')}
            onGuestBrowse={() => setCurrentScreen('main')}
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
            onRegisterPress={() => setCurrentScreen('register')}
            onBackPress={() => setCurrentScreen('welcome')}
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
              setCurrentScreen('main');
            }}
            onBack={() => setCurrentScreen('register')}
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
                  onViewHoroscopePorutham={handleOpenHoroscopeReport}
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
                  onEditProfile={async () => {
                    const u = await StorageService.getCurrentUser();
                    const p = await StorageService.getProfileById(u.activeProfileId);
                    if (p) {
                      setSelectedProfile(p);
                      setCurrentScreen('edit_profile');
                    }
                  }}
                  onMembershipPress={() => setCurrentScreen('membership')}
                  onViewMyProfile={handleOpenProfile}
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
