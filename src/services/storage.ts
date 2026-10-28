import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_PROFILES } from '../data/mockProfiles';
import { Language } from '../localization';
import {
  CurrentUser,
  InterestRecord,
  MatrimonyProfile,
  MembershipTier,
  NotificationItem,
  ProfileViewRecord,
  ShortlistRecord,
} from '../types';

const KEYS = {
  PROFILES: '@manamaalai_profiles_v1',
  CURRENT_USER: '@manamaalai_current_user_v1',
  INTERESTS: '@manamaalai_interests_v1',
  SHORTLISTS: '@manamaalai_shortlists_v1',
  VIEWS: '@manamaalai_views_v1',
  NOTIFICATIONS: '@manamaalai_notifications_v1',
  LANGUAGE: '@manamaalai_language_v1',
  ADMIN_REPORTS: '@manamaalai_reports_v1',
  DONT_SHOW: '@manamaalai_dont_show_v1',
  UNLOCKED_CONTACTS: '@manamaalai_unlocked_contacts_v1',
};

// Initial default logged-in user profile (Groom: Karthik Senthilnathan or Bride: Dr. Soundarya)
export const DEFAULT_CURRENT_USER: CurrentUser = {
  id: 'u-g-01',
  phone: '9840198712',
  email: 'karthik.senthil.iim@gmail.com',
  role: 'user',
  activeProfileId: 'mm-g-01', // Karthik
  membershipTier: 'gold',
  membershipExpiresAt: '2025-12-31',
  contactsViewedRemaining: 42,
  interestsRemaining: 98,
};

// Seed initial interests
const INITIAL_INTERESTS: InterestRecord[] = [
  {
    id: 'int-01',
    senderProfileId: 'mm-g-01',
    receiverProfileId: 'mm-b-01', // Soundarya
    status: 'accepted',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-02T14:30:00Z',
    message: 'Vanakkam. We reviewed your profile and horoscope. Very keen to take discussions forward.',
  },
  {
    id: 'int-02',
    senderProfileId: 'mm-b-02', // Kavitha
    receiverProfileId: 'mm-g-01',
    status: 'pending',
    createdAt: '2024-03-12T09:15:00Z',
    updatedAt: '2024-03-12T09:15:00Z',
    message: 'Hello Karthik, I found your profile very interesting and our career interests align nicely.',
  },
  {
    id: 'int-03',
    senderProfileId: 'mm-g-01',
    receiverProfileId: 'mm-b-03', // Harini
    status: 'pending',
    createdAt: '2024-03-14T11:20:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
    message: 'Vanakkam, our family is pleased with your background and values.',
  },
];

const INITIAL_SHORTLISTS: ShortlistRecord[] = [
  { id: 'sh-01', userId: 'u-g-01', profileId: 'mm-b-01', addedAt: '2024-03-01' },
  { id: 'sh-02', userId: 'u-g-01', profileId: 'mm-b-02', addedAt: '2024-03-04' },
];

const INITIAL_VIEWS: ProfileViewRecord[] = [
  { id: 'vw-01', viewerProfileId: 'mm-b-01', viewedProfileId: 'mm-g-01', viewedAt: 'Today, 10:15 AM' },
  { id: 'vw-02', viewerProfileId: 'mm-b-02', viewedProfileId: 'mm-g-01', viewedAt: 'Yesterday, 04:30 PM' },
  { id: 'vw-03', viewerProfileId: 'mm-b-04', viewedProfileId: 'mm-g-01', viewedAt: '2 days ago' },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    recipientProfileId: 'mm-g-01',
    type: 'interest_accepted',
    title: 'Interest Accepted! 🎉',
    message: 'Dr. Soundarya Natarajan accepted your interest. You can now exchange messages & contact details.',
    senderProfileId: 'mm-b-01',
    read: false,
    createdAt: '2 hours ago',
  },
  {
    id: 'notif-02',
    recipientProfileId: 'mm-g-01',
    type: 'interest_received',
    title: 'New Interest Request 💌',
    message: 'Kavitha Ramachandran (Software Engineer) expressed interest in your profile.',
    senderProfileId: 'mm-b-02',
    read: false,
    createdAt: '5 hours ago',
  },
  {
    id: 'notif-03',
    recipientProfileId: 'mm-g-01',
    type: 'profile_view',
    title: 'Profile Viewed 👁️',
    message: 'Deepika Subramanian (Architect) viewed your profile recently.',
    senderProfileId: 'mm-b-04',
    read: true,
    createdAt: '1 day ago',
  },
  {
    id: 'notif-04',
    recipientProfileId: 'mm-g-01',
    type: 'system_alert',
    title: 'Aadhar Verification Approved ✅',
    message: 'Your profile has received the Manamaalai Verified Trust Badge.',
    read: true,
    createdAt: '3 days ago',
  },
];

export class StorageService {
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const existingProfiles = await AsyncStorage.getItem(KEYS.PROFILES);
      if (!existingProfiles) {
        await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
      } else {
        try {
          const parsed: MatrimonyProfile[] = JSON.parse(existingProfiles);
          const missing = INITIAL_PROFILES.filter(p => !parsed.some(ep => ep.id === p.id));
          if (missing.length > 0) {
            parsed.push(...missing);
            await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(parsed));
          }
        } catch {}
      }
      const existingUser = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      if (!existingUser) {
        await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_CURRENT_USER));
      }
      const existingInterests = await AsyncStorage.getItem(KEYS.INTERESTS);
      if (!existingInterests) {
        await AsyncStorage.setItem(KEYS.INTERESTS, JSON.stringify(INITIAL_INTERESTS));
      }
      const existingShortlists = await AsyncStorage.getItem(KEYS.SHORTLISTS);
      if (!existingShortlists) {
        await AsyncStorage.setItem(KEYS.SHORTLISTS, JSON.stringify(INITIAL_SHORTLISTS));
      }
      const existingViews = await AsyncStorage.getItem(KEYS.VIEWS);
      if (!existingViews) {
        await AsyncStorage.setItem(KEYS.VIEWS, JSON.stringify(INITIAL_VIEWS));
      }
      const existingNotifs = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
      if (!existingNotifs) {
        await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
      const existingLang = await AsyncStorage.getItem(KEYS.LANGUAGE);
      if (!existingLang) {
        await AsyncStorage.setItem(KEYS.LANGUAGE, 'en');
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('StorageService.initialize error:', e);
    }
  }

  // --- Profiles ---
  static async getAllProfiles(): Promise<MatrimonyProfile[]> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.PROFILES);
      return data ? JSON.parse(data) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  }

  static async getProfileById(id: string): Promise<MatrimonyProfile | null> {
    const list = await this.getAllProfiles();
    return list.find(p => p.id === id) || null;
  }

  static async saveProfile(profile: MatrimonyProfile): Promise<void> {
    const list = await this.getAllProfiles();
    const index = list.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      list[index] = profile;
    } else {
      list.unshift(profile);
    }
    await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(list));
  }

  // --- Current User ---
  static async getCurrentUser(): Promise<CurrentUser> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_CURRENT_USER;
    } catch {
      return DEFAULT_CURRENT_USER;
    }
  }

  static async updateCurrentUser(user: Partial<CurrentUser>): Promise<CurrentUser> {
    const current = await this.getCurrentUser();
    const updated = { ...current, ...user };
    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updated));
    return updated;
  }

  // --- Interests ---
  static async getInterests(): Promise<InterestRecord[]> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.INTERESTS);
      return data ? JSON.parse(data) : INITIAL_INTERESTS;
    } catch {
      return INITIAL_INTERESTS;
    }
  }

  static async sendInterest(senderProfileId: string, receiverProfileId: string, message?: string): Promise<InterestRecord> {
    const list = await this.getInterests();
    const existing = list.find(
      i => i.senderProfileId === senderProfileId && i.receiverProfileId === receiverProfileId
    );
    if (existing) {
      return existing;
    }
    const newRecord: InterestRecord = {
      id: `int-${Date.now()}`,
      senderProfileId,
      receiverProfileId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      message,
    };
    list.unshift(newRecord);
    await AsyncStorage.setItem(KEYS.INTERESTS, JSON.stringify(list));

    // Also deduct quota for current user
    const user = await this.getCurrentUser();
    if (user.interestsRemaining > 0) {
      await this.updateCurrentUser({ interestsRemaining: user.interestsRemaining - 1 });
    }

    // Add notification to receiver
    await this.addNotification({
      recipientProfileId: receiverProfileId,
      type: 'interest_received',
      title: 'New Interest Received 💖',
      message: 'A member has expressed interest in your profile.',
      senderProfileId,
      read: false,
    });

    return newRecord;
  }

  static async updateInterestStatus(interestId: string, status: 'accepted' | 'declined'): Promise<void> {
    const list = await this.getInterests();
    const item = list.find(i => i.id === interestId);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(KEYS.INTERESTS, JSON.stringify(list));

      // Notify the original sender
      await this.addNotification({
        recipientProfileId: item.senderProfileId,
        type: status === 'accepted' ? 'interest_accepted' : 'interest_declined',
        title: status === 'accepted' ? 'Interest Accepted! 🎉' : 'Interest Update',
        message:
          status === 'accepted'
            ? 'Your interest has been accepted! You can now communicate.'
            : 'Your interest was declined. Keep exploring other auspicious matches.',
        senderProfileId: item.receiverProfileId,
        read: false,
      });
    }
  }

  // --- Shortlists ---
  static async getShortlists(): Promise<string[]> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.SHORTLISTS);
      const records: ShortlistRecord[] = data ? JSON.parse(data) : INITIAL_SHORTLISTS;
      return records.map(r => r.profileId);
    } catch {
      return [];
    }
  }

  static async toggleShortlist(profileId: string): Promise<boolean> {
    await this.initialize();
    const data = await AsyncStorage.getItem(KEYS.SHORTLISTS);
    let records: ShortlistRecord[] = data ? JSON.parse(data) : INITIAL_SHORTLISTS;
    const exists = records.some(r => r.profileId === profileId);

    if (exists) {
      records = records.filter(r => r.profileId !== profileId);
    } else {
      records.unshift({
        id: `sh-${Date.now()}`,
        userId: 'u-g-01',
        profileId,
        addedAt: new Date().toISOString(),
      });
    }
    await AsyncStorage.setItem(KEYS.SHORTLISTS, JSON.stringify(records));
    return !exists;
  }

  // --- Profile Views ---
  static async recordProfileView(viewerProfileId: string, viewedProfileId: string): Promise<void> {
    if (viewerProfileId === viewedProfileId) return;
    try {
      const data = await AsyncStorage.getItem(KEYS.VIEWS);
      const list: ProfileViewRecord[] = data ? JSON.parse(data) : [];
      list.unshift({
        id: `vw-${Date.now()}`,
        viewerProfileId,
        viewedProfileId,
        viewedAt: 'Just now',
      });
      // Keep last 50
      await AsyncStorage.setItem(KEYS.VIEWS, JSON.stringify(list.slice(0, 50)));
    } catch {}
  }

  static async getViewsForProfile(profileId: string): Promise<ProfileViewRecord[]> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.VIEWS);
      const list: ProfileViewRecord[] = data ? JSON.parse(data) : INITIAL_VIEWS;
      return list.filter(v => v.viewedProfileId === profileId);
    } catch {
      return [];
    }
  }

  // --- Notifications ---
  static async getNotifications(): Promise<NotificationItem[]> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static async addNotification(item: Omit<NotificationItem, 'id' | 'createdAt'>): Promise<void> {
    const list = await this.getNotifications();
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      createdAt: 'Just now',
    };
    list.unshift(newItem);
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  static async markAllNotificationsRead(): Promise<void> {
    const list = await this.getNotifications();
    list.forEach(n => (n.read = true));
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  // --- Language ---
  static async getLanguage(): Promise<Language> {
    await this.initialize();
    try {
      const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
      return (lang as Language) || 'en';
    } catch {
      return 'en';
    }
  }

  static async setLanguage(lang: Language): Promise<void> {
    await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
  }

  // --- Membership Upgrade ---
  static async upgradeMembership(tier: MembershipTier): Promise<CurrentUser> {
    const quotaMap: Record<MembershipTier, { interests: number; contacts: number }> = {
      free: { interests: 15, contacts: 0 },
      silver: { interests: 50, contacts: 25 },
      gold: { interests: 150, contacts: 75 },
      platinum: { interests: 999, contacts: 200 },
    };
    const updated = await this.updateCurrentUser({
      membershipTier: tier,
      interestsRemaining: quotaMap[tier].interests,
      contactsViewedRemaining: quotaMap[tier].contacts,
      membershipExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    await this.addNotification({
      recipientProfileId: updated.activeProfileId,
      type: 'membership',
      title: 'Plan Upgraded Successfully! 🌟',
      message: `Your account is now activated with ${tier.toUpperCase()} membership benefits.`,
      read: false,
    });

    return updated;
  }

  // --- Moderation / Admin ---
  static async verifyProfile(profileId: string): Promise<void> {
    const profile = await this.getProfileById(profileId);
    if (profile) {
      profile.isVerified = true;
      profile.verificationBadgeType = 'aadhar';
      await this.saveProfile(profile);

      await this.addNotification({
        recipientProfileId: profileId,
        type: 'system_alert',
        title: 'Profile Verified! 🛡️',
        message: 'Your Aadhar & credentials have been verified by Manamaalai Trust Desk.',
        read: false,
      });
    }
  }

  static async suspendProfile(profileId: string): Promise<void> {
    const list = await this.getAllProfiles();
    const filtered = list.filter(p => p.id !== profileId);
    await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(filtered));
  }

  // --- Don't Show / Exclude ---
  static async getDontShowProfiles(): Promise<string[]> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.DONT_SHOW);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async addDontShowProfile(profileId: string): Promise<void> {
    await this.initialize();
    const list = await this.getDontShowProfiles();
    if (!list.includes(profileId)) {
      list.push(profileId);
      await AsyncStorage.setItem(KEYS.DONT_SHOW, JSON.stringify(list));
    }
  }

  // --- Contact Access Authorization ---
  static async getUnlockedContacts(): Promise<string[]> {
    await this.initialize();
    try {
      const data = await AsyncStorage.getItem(KEYS.UNLOCKED_CONTACTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async unlockContactAccess(profileId: string): Promise<{ success: boolean; message: string; remaining: number }> {
    await this.initialize();
    const user = await this.getCurrentUser();
    const unlocked = await this.getUnlockedContacts();
    if (unlocked.includes(profileId)) {
      return { success: true, message: 'Contact already authorized', remaining: user.contactsViewedRemaining };
    }

    if (user.contactsViewedRemaining > 0) {
      const updated = await this.updateCurrentUser({
        contactsViewedRemaining: user.contactsViewedRemaining - 1,
      });
      unlocked.push(profileId);
      await AsyncStorage.setItem(KEYS.UNLOCKED_CONTACTS, JSON.stringify(unlocked));
      return { success: true, message: 'Contact authorized successfully!', remaining: updated.contactsViewedRemaining };
    }

    return { success: false, message: 'No contact view balance remaining. Upgrade to view direct contacts.', remaining: 0 };
  }

  static async isContactAuthorized(targetProfile: MatrimonyProfile): Promise<boolean> {
    await this.initialize();
    const currentUser = await this.getCurrentUser();
    if (currentUser.activeProfileId === targetProfile.id) return true;

    // Check unlocked list
    const unlocked = await this.getUnlockedContacts();
    if (unlocked.includes(targetProfile.id)) return true;

    // Check mutual interest accepted
    const interests = await this.getInterests();
    const isAccepted = interests.some(
      i =>
        ((i.senderProfileId === currentUser.activeProfileId && i.receiverProfileId === targetProfile.id) ||
          (i.senderProfileId === targetProfile.id && i.receiverProfileId === currentUser.activeProfileId)) &&
        i.status === 'accepted'
    );
    if (isAccepted) return true;

    // Check privacy setting of target profile
    if (!targetProfile.privacy?.hidePhoneUntilInterestAccepted) {
      return true;
    }

    return false;
  }

  static async resetDontShowProfiles(): Promise<void> {
    await this.initialize();
    await AsyncStorage.removeItem(KEYS.DONT_SHOW);
  }

  // --- Daily Match Recommendations Engine ---
  static async getDailyRecommendations(limit = 9, targetGenderOverride?: 'bride' | 'groom'): Promise<MatrimonyProfile[]> {
    await this.initialize();
    const allProfiles = await this.getAllProfiles();
    const currentUser = await this.getCurrentUser();
    const currentProfile = allProfiles.find(p => p.id === currentUser.activeProfileId);
    const dontShow = await this.getDontShowProfiles();

    const targetGender = targetGenderOverride || (currentProfile?.gender === 'bride' ? 'groom' : 'bride');
    const myPrefs = currentProfile?.partnerPreferences;

    // Filter out self, excluded profiles, and same gender
    const eligible = allProfiles.filter(p => {
      if (p.id === currentProfile?.id) return false;
      if (dontShow.includes(p.id)) return false;
      if (p.gender !== targetGender) return false;
      return true;
    });

    // Score candidate profiles against partner preferences
    const scored = eligible.map(candidate => {
      let score = 50; // base score

      if (myPrefs) {
        // Age range match
        if (candidate.age >= myPrefs.ageMin && candidate.age <= myPrefs.ageMax) {
          score += 20;
        }
        // Height range match
        if (
          candidate.lifestyle?.heightCm &&
          candidate.lifestyle.heightCm >= myPrefs.heightMinCm &&
          candidate.lifestyle.heightCm <= myPrefs.heightMaxCm
        ) {
          score += 15;
        }
        // Marital status match
        if (myPrefs.maritalStatus?.includes(candidate.maritalStatus)) {
          score += 10;
        }
        // Caste / allowIntercaste match
        if (
          myPrefs.allowIntercaste ||
          candidate.allowIntercaste ||
          myPrefs.castes?.some(c => candidate.caste.toLowerCase().includes(c.toLowerCase()))
        ) {
          score += 15;
        }
        // Education match
        if (
          myPrefs.educationLevels?.some(edu =>
            candidate.educationCareer?.qualification?.toLowerCase().includes(edu.toLowerCase())
          )
        ) {
          score += 10;
        }
        // Location match
        if (
          myPrefs.locations?.some(
            loc =>
              candidate.currentCity?.toLowerCase().includes(loc.toLowerCase()) ||
              candidate.nativeDistrict?.toLowerCase().includes(loc.toLowerCase())
          )
        ) {
          score += 10;
        }
      }

      if (candidate.isVerified) score += 10;
      if (candidate.photos && candidate.photos.length > 0) score += 10;
      if (candidate.id === 'mm-g-deva') score += 25; // Priority placement for reference groom

      return { profile: candidate, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const result = scored.slice(0, limit).map(s => s.profile);

    // Fallback if list is empty or fewer than requested: provide other available candidates
    if (result.length === 0) {
      return eligible.slice(0, limit);
    }

    return result;
  }
}
