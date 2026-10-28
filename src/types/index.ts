export type Gender = 'bride' | 'groom' | 'male' | 'female';
export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'separated' | 'awaiting_divorce' | 'widow';
export type PhysicalStatus = 'normal' | 'physically_challenged';
export type ProfileCreatedFor = 'self' | 'son' | 'daughter' | 'brother' | 'sister' | 'relative' | 'friend';
export type FamilyType = 'nuclear' | 'joint';
export type FamilyValues = 'orthodox' | 'traditional' | 'moderate' | 'liberal';
export type DietPreference = 'vegetarian' | 'non_vegetarian' | 'eggetarian';
export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn';
export type MembershipTier = 'free' | 'silver' | 'gold' | 'platinum';

export interface HoroscopeDetails {
  rasi: string;
  nakshatram: string;
  lagnam?: string;
  gothram?: string;
  chevvaiDosham: boolean;
  sarpaDosham: boolean;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  jathagamChartUrl?: string;
}

export interface FamilyDetails {
  fatherName?: string;
  fatherOccupation: string;
  motherName?: string;
  motherOccupation: string;
  siblings: string;
  siblingsMarried: string;
  familyType: FamilyType;
  familyValues: FamilyValues;
  familyStatus: string; // Middle Class, Upper Middle, Affluent
  nativeDistrict: string;
}

export interface EducationCareer {
  qualification: string;
  institution: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  workLocation: string;
}

export interface LifestyleDetails {
  diet: DietPreference;
  smoking: boolean;
  drinking: boolean;
  hobbies: string[];
  languagesKnown: string[];
  heightCm: number;
  heightFeet: string;
  weightKg?: number;
  complexion?: string;
  physicalStatus?: PhysicalStatus;
}

export interface PartnerPreferences {
  ageMin: number;
  ageMax: number;
  heightMinCm: number;
  heightMaxCm: number;
  maritalStatus: MaritalStatus[];
  religions: string[];
  castes: string[];
  allowIntercaste: boolean;
  educationLevels: string[];
  occupations: string[];
  locations: string[];
  diet: DietPreference[];
}

export interface PrivacySettings {
  hidePhoneUntilInterestAccepted: boolean;
  hideHoroscopeUntilRequested: boolean;
  showPhotoToRegisteredOnly: boolean;
}

export interface MatrimonyProfile {
  id: string;
  userId: string;
  matrimonyId: string; // e.g. "MM-TN-1024"
  name: string;
  gender: Gender;
  createdFor: ProfileCreatedFor;
  age: number;
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  physicalStatus?: PhysicalStatus;
  religion: string;
  caste: string;
  subCaste: string;
  allowIntercaste: boolean;
  motherTongue: string;
  nativeDistrict: string;
  currentCity: string;
  currentCountry: string;
  photos: string[];
  about: string;
  horoscope: HoroscopeDetails;
  family: FamilyDetails;
  educationCareer: EducationCareer;
  lifestyle: LifestyleDetails;
  partnerPreferences: PartnerPreferences;
  privacy: PrivacySettings;
  isVerified: boolean;
  verificationBadgeType?: 'aadhar' | 'id_card' | 'community' | 'premium';
  membershipTier: MembershipTier;
  profileCompleteness: number; // 0 - 100
  phone: string;
  email: string;
  lastActive: string;
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  phone: string;
  email: string;
  role: 'user' | 'admin';
  activeProfileId: string;
  membershipTier: MembershipTier;
  membershipExpiresAt?: string;
  contactsViewedRemaining: number;
  interestsRemaining: number;
}

export interface InterestRecord {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  status: InterestStatus;
  createdAt: string;
  updatedAt: string;
  message?: string;
}

export interface ShortlistRecord {
  id: string;
  userId: string;
  profileId: string;
  addedAt: string;
}

export interface ProfileViewRecord {
  id: string;
  viewerProfileId: string;
  viewedProfileId: string;
  viewedAt: string;
}

export interface PoruthamCheck {
  name: string;
  tamilName: string;
  isCompatible: boolean;
  score: number; // 0, 0.5, 1
  description: string;
  importance: 'Essential' | 'Secondary' | 'Important';
}

export interface PoruthamResult {
  brideRasi: string;
  brideNakshatram: string;
  groomRasi: string;
  groomNakshatram: string;
  totalScore: number;
  maxScore: number;
  verdict: 'Uthama' | 'Madhyama' | 'Adhama';
  verdictTamil: string;
  summary: string;
  poruthams: PoruthamCheck[];
  disclaimer: string;
}

export interface NotificationItem {
  id: string;
  recipientProfileId: string;
  type: 'interest_received' | 'interest_accepted' | 'interest_declined' | 'profile_view' | 'match_recommendation' | 'system_alert' | 'membership';
  title: string;
  message: string;
  senderProfileId?: string;
  read: boolean;
  createdAt: string;
}

export interface MembershipPlan {
  id: MembershipTier;
  name: string;
  tamilName: string;
  priceInr: number;
  originalPriceInr: number;
  durationMonths: number;
  interestsCount: number | 'Unlimited';
  contactsViewCount: number;
  verifiedBadge: boolean;
  priorityPlacement: boolean;
  directAstrologerAdvice: boolean;
  chatEnabled: boolean;
  features: string[];
}

export interface SearchFilterState {
  gender?: Gender;
  ageMin: number;
  ageMax: number;
  heightMinCm: number;
  heightMaxCm: number;
  maritalStatus?: MaritalStatus[];
  caste?: string[];
  education?: string[];
  occupation?: string[];
  district?: string[];
  diet?: DietPreference[];
  verifiedOnly: boolean;
  withPhotoOnly: boolean;
  horoscopePoruthamOnly: boolean;
  searchQuery: string;
  sortBy: 'relevance' | 'newest' | 'age_asc' | 'age_desc' | 'porutham';
}
