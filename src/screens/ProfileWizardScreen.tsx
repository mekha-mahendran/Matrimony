import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language, Translations } from '../localization';
import { TAMIL_NAKSHATRAMS, TAMIL_RASIS } from '../services/horoscopeService';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import {
  DietPreference,
  FamilyType,
  FamilyValues,
  Gender,
  MaritalStatus,
  MatrimonyProfile,
  PhysicalStatus,
} from '../types';

interface ProfileWizardProps {
  initialData: any;
  initialStep?: number;
  language: Language;
  onToggleLanguage?: () => void;
  onComplete: (profile: MatrimonyProfile) => void;
  onBack: () => void;
}

export interface HeightOption {
  ft: string;
  cm: number;
  label: string;
}

export const HEIGHT_OPTIONS: HeightOption[] = [
  { ft: '4 ft', cm: 122, label: '4 ft (122 cm)' },
  { ft: '4 ft 1 in', cm: 124, label: '4 ft 1 in (124 cm)' },
  { ft: '4 ft 2 in', cm: 127, label: '4 ft 2 in (127 cm)' },
  { ft: '4 ft 3 in', cm: 129, label: '4 ft 3 in (129 cm)' },
  { ft: '4 ft 4 in', cm: 132, label: '4 ft 4 in (132 cm)' },
  { ft: '4 ft 5 in', cm: 134, label: '4 ft 5 in (134 cm)' },
  { ft: '4 ft 6 in', cm: 137, label: '4 ft 6 in (137 cm)' },
  { ft: '4 ft 7 in', cm: 139, label: '4 ft 7 in (139 cm)' },
  { ft: '4 ft 8 in', cm: 142, label: '4 ft 8 in (142 cm)' },
  { ft: '4 ft 9 in', cm: 144, label: '4 ft 9 in (144 cm)' },
  { ft: '4 ft 10 in', cm: 147, label: '4 ft 10 in (147 cm)' },
  { ft: '4 ft 11 in', cm: 149, label: '4 ft 11 in (149 cm)' },
  { ft: '5 ft', cm: 152, label: '5 ft (152 cm)' },
  { ft: '5 ft 1 in', cm: 154, label: '5 ft 1 in (154 cm)' },
  { ft: '5 ft 2 in', cm: 157, label: '5 ft 2 in (157 cm)' },
  { ft: '5 ft 3 in', cm: 160, label: '5 ft 3 in (160 cm)' },
  { ft: '5 ft 4 in', cm: 162, label: '5 ft 4 in (162 cm)' },
  { ft: '5 ft 5 in', cm: 165, label: '5 ft 5 in (165 cm)' },
  { ft: '5 ft 6 in', cm: 167, label: '5 ft 6 in (167 cm)' },
  { ft: '5 ft 7 in', cm: 170, label: '5 ft 7 in (170 cm)' },
  { ft: '5 ft 8 in', cm: 173, label: '5 ft 8 in (173 cm)' },
  { ft: '5 ft 9 in', cm: 175, label: '5 ft 9 in (175 cm)' },
  { ft: '5 ft 10 in', cm: 178, label: '5 ft 10 in (178 cm)' },
  { ft: '5 ft 11 in', cm: 180, label: '5 ft 11 in (180 cm)' },
  { ft: '6 ft', cm: 183, label: '6 ft (183 cm)' },
  { ft: '6 ft 1 in', cm: 185, label: '6 ft 1 in (185 cm)' },
  { ft: '6 ft 2 in', cm: 188, label: '6 ft 2 in (188 cm)' },
  { ft: '6 ft 3 in', cm: 191, label: '6 ft 3 in (191 cm)' },
  { ft: '6 ft 4 in', cm: 193, label: '6 ft 4 in (193 cm)' },
  { ft: '6 ft 5 in', cm: 196, label: '6 ft 5 in (196 cm)' },
  { ft: '6 ft 6 in', cm: 198, label: '6 ft 6 in (198 cm)' },
  { ft: '6 ft 7 in', cm: 201, label: '6 ft 7 in (201 cm)' },
  { ft: '6 ft 8 in', cm: 203, label: '6 ft 8 in (203 cm)' },
  { ft: '6 ft 9 in', cm: 206, label: '6 ft 9 in (206 cm)' },
  { ft: '6 ft 10 in', cm: 208, label: '6 ft 10 in (208 cm)' },
  { ft: '6 ft 11 in', cm: 211, label: '6 ft 11 in (211 cm)' },
  { ft: '7 ft', cm: 213, label: '7 ft (213 cm)' },
];

const MONTHS_DATA = [
  { val: '01', en: 'Jan', ta: 'ஜன' },
  { val: '02', en: 'Feb', ta: 'பிப்' },
  { val: '03', en: 'Mar', ta: 'மார்' },
  { val: '04', en: 'Apr', ta: 'ஏப்' },
  { val: '05', en: 'May', ta: 'மே' },
  { val: '06', en: 'Jun', ta: 'ஜூன்' },
  { val: '07', en: 'Jul', ta: 'ஜூலை' },
  { val: '08', en: 'Aug', ta: 'ஆக' },
  { val: '09', en: 'Sep', ta: 'செப்' },
  { val: '10', en: 'Oct', ta: 'அக்' },
  { val: '11', en: 'Nov', ta: 'நவ' },
  { val: '12', en: 'Dec', ta: 'டிச' },
];

const DAYS_DATA = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const currentYear = new Date().getFullYear();
const YEARS_DATA = Array.from({ length: 48 }, (_, i) => String(currentYear - 18 - i));

export const RELIGIONS_LIST = [
  'Hindu',
  'Jain - Digambar',
  'Jain - Shwetambar',
  'Jain',
  'Christian - Roman Catholic',
  'Christian - CSI',
  'Christian - Protestant',
  'Christian - Others',
  'Christian',
  'Muslim - Sunni',
  'Muslim - Shia',
  'Muslim - Others',
  'Muslim',
  'Sikh',
  'Buddhist',
  'Parsi',
  'Jewish',
  'Inter-Religion / Any',
  'Other',
];

export const DEFAULT_CASTES = [
  'Mudaliar',
  'Pillai',
  'Chettiar',
  'Brahmin - Iyer',
  'Brahmin - Iyengar',
  'Nadar',
  'Vanniyar',
  'Gounder',
  'Thevar / Mukkulathor',
  'Viswakarma',
  'Naidu',
  'Reddiar',
  'Yadav',
  'Sengunthar / Kaikolar',
  'Devanga Chettiar',
  'Maravar',
  'Kallar',
  'Agamudayar',
  'SC / ST',
  'Arya Vysya',
  'Saurashtra',
  'Muthuraja',
  'Parkavakulam / Udayar',
  'Nair',
  'Ezhava',
  'Caste No Bar / Any Caste',
  'Other',
];

export const CASTES_BY_RELIGION: Record<string, string[]> = {
  Hindu: DEFAULT_CASTES,
  'Jain - Digambar': [
    'Jain - Kutchi',
    'Jain - Digambar',
    'Jain - Oswal',
    'Jain - Porwal',
    'Jain - Khandelwal',
    'Jain - Agarwal',
    'Jain - Bania',
    'Jain - Vaishya',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Jain - Shwetambar': [
    'Jain - Kutchi',
    'Jain - Shwetambar',
    'Jain - Oswal',
    'Jain - Porwal',
    'Jain - Khandelwal',
    'Jain - Agarwal',
    'Jain - Bania',
    'Jain - Vaishya',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  Jain: [
    'Jain - Kutchi',
    'Jain - Digambar',
    'Jain - Shwetambar',
    'Jain - Oswal',
    'Jain - Porwal',
    'Jain - Agarwal',
    'Jain - Bania',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Christian - Roman Catholic': [
    'Roman Catholic',
    'Latin Catholic',
    'Syrian Catholic',
    'Anglo-Indian',
    'Nadar Christian',
    'Pillai Christian',
    'Mukkuvar Christian',
    'Fernando',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Christian - CSI': [
    'CSI (Church of South India)',
    'Nadar CSI',
    'Pillai CSI',
    'Vellalar CSI',
    'Protestant',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Christian - Protestant': [
    'Protestant',
    'Pentecostal',
    'Baptist',
    'Methodist',
    'Adventist',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Christian - Others': [
    'Christian - General',
    'Orthodox',
    'Jacobite',
    'Mar Thoma',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  Christian: [
    'Roman Catholic',
    'CSI (Church of South India)',
    'Protestant',
    'Pentecostal',
    'Latin Catholic',
    'Syrian Catholic',
    'Nadar Christian',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Muslim - Sunni': [
    'Sunni - Hanafi',
    'Sunni - Shafi',
    'Rawther',
    'Marakkayar',
    'Lebbai',
    'Syed',
    'Pathan',
    'Sheikh',
    'Ansari',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Muslim - Shia': [
    'Shia - Ithna Ashari',
    'Shia - Ismaili / Bohra',
    'Syed',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  'Muslim - Others': [
    'Muslim - General',
    'Rawther',
    'Marakkayar',
    'Lebbai',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  Muslim: [
    'Sunni',
    'Shia',
    'Rawther',
    'Marakkayar',
    'Lebbai',
    'Syed',
    'Pathan',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  Sikh: [
    'Jat',
    'Ramgharia',
    'Khatri',
    'Arora',
    'Ahluwalia',
    'Saini',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  Buddhist: [
    'Neo Buddhist',
    'Tibetan',
    'Mahayana',
    'Theravada',
    'Caste No Bar / Any Caste',
    'Other',
  ],
  Parsi: ['Irani', 'Parsi Zoroastrian', 'Other'],
  Jewish: ['Bene Israel', 'Cochin Jewish', 'Baghdadi', 'Other'],
  'Inter-Religion / Any': ['Any Caste / Community', 'No Caste / Agnostic'],
  Other: ['Any Caste', 'Other'],
};

export const COUNTRIES_LIST: string[] = [
  'India',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Singapore',
  'Malaysia',
  'Canada',
  'Australia',
  'Qatar',
  'Kuwait',
  'Saudi Arabia',
  'Sri Lanka',
  'Other',
];

export const INDIAN_STATES: string[] = [
  'Andaman & Nicobar',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra & Nagar Haveli',
  'Daman & Diu',
  'Delhi / NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const DEFAULT_MAJOR_CITIES: string[] = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tirunelveli',
  'Bengaluru',
  'Hyderabad',
  'Mumbai',
  'New Delhi',
  'Kochi',
  'Kolkata',
  'Pune',
  'Ahmedabad',
];

export const CITIES_BY_STATE: Record<string, string[]> = {
  Assam: [
    'Abhayapuri',
    'Amguri',
    'Amin Gaon (Amingaon)',
    'Azara',
    'Badarpur',
    'Bajali',
    'Baksa',
    'Barpeta',
    'Barpeta Road',
    'Bongaigaon',
    'Cachar',
    'Charaideo',
    'Chirang',
    'Darrang',
    'Dhemaji',
    'Dhubri',
    'Dibrugarh',
    'Digboi',
    'Diphu',
    'Goalpara',
    'Golaghat',
    'Guwahati',
    'Haflong',
    'Hailakandi',
    'Hojai',
    'Jorhat',
    'Kamrup',
    'Karimganj',
    'Kokrajhar',
    'Lakhimpur',
    'Lumding',
    'Mangaldai',
    'Morigaon',
    'Nagaon',
    'Nalbari',
    'North Lakhimpur',
    'Rangia',
    'Sibsagar',
    'Silchar',
    'Sonitpur',
    'Tezpur',
    'Tinsukia',
    'Udalguri',
  ],
  'Tamil Nadu': [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli (Trichy)',
    'Salem',
    'Tirunelveli',
    'Tiruppur',
    'Erode',
    'Vellore',
    'Thoothukudi (Tuticorin)',
    'Dindigul',
    'Thanjavur',
    'Ranipet',
    'Sivakasi',
    'Karur',
    'Udhagamandalam (Ooty)',
    'Hosur',
    'Nagercoil',
    'Kanchipuram',
    'Kumarapalayam',
    'Karaikkudi',
    'Neyveli',
    'Cuddalore',
    'Kumbakonam',
    'Tiruvannamalai',
    'Pollachi',
    'Rajapalayam',
    'Gudiyatham',
    'Pudukkottai',
    'Vaniyambadi',
    'Ambur',
    'Nagapattinam',
    'Chengalpattu',
    'Tenkasi',
    'Kallakurichi',
    'Mayiladuthurai',
    'Ariyalur',
    'Perambalur',
    'Krishnagiri',
    'Dharmapuri',
    'Namakkal',
    'Ramanathapuram',
    'Theni',
    'Tirupattur',
    'Tiruvarur',
    'Villupuram',
    'Virudhunagar',
  ],
  'Andhra Pradesh': [
    'Visakhapatnam',
    'Vijayawada',
    'Guntur',
    'Nellore',
    'Kurnool',
    'Rajahmundry',
    'Tirupati',
    'Kakinada',
    'Kadapa',
    'Anantapur',
    'Eluru',
    'Ongole',
    'Vizianagaram',
    'Machilipatnam',
    'Chittoor',
    'Tenali',
    'Proddatur',
    'Hindupur',
    'Bhimavaram',
    'Srikakulam',
  ],
  Karnataka: [
    'Bengaluru',
    'Mysuru',
    'Mangaluru',
    'Hubballi',
    'Belagavi',
    'Shivamogga',
    'Davanagere',
    'Ballari',
    'Tumakuru',
    'Udupi',
    'Kalaburagi (Gulbarga)',
    'Bidar',
    'Hassan',
    'Mandya',
    'Chikkamagaluru',
    'Raichur',
    'Vijayapura',
    'Gadag',
  ],
  Kerala: [
    'Thiruvananthapuram',
    'Kochi / Ernakulam',
    'Kozhikode',
    'Thrissur',
    'Kollam',
    'Palakkad',
    'Alappuzha',
    'Kannur',
    'Kottayam',
    'Malappuram',
    'Pathanamthitta',
    'Kasaragod',
    'Wayanad',
    'Idukki',
  ],
  Telangana: [
    'Hyderabad',
    'Warangal',
    'Nizamabad',
    'Karimnagar',
    'Khammam',
    'Ramagundam',
    'Mahbubnagar',
    'Nalgonda',
    'Adilabad',
    'Suryapet',
    'Siddipet',
    'Miryalaguda',
  ],
  Maharashtra: [
    'Mumbai',
    'Pune',
    'Nagpur',
    'Thane',
    'Nashik',
    'Chhatrapati Sambhajinagar',
    'Solapur',
    'Navi Mumbai',
    'Kolhapur',
    'Amravati',
    'Nanded',
    'Sangli',
    'Jalgaon',
    'Akola',
    'Latur',
    'Dhule',
    'Ahmednagar',
    'Chandrapur',
  ],
  'Delhi / NCR': [
    'New Delhi',
    'Central Delhi',
    'North Delhi',
    'South Delhi',
    'West Delhi',
    'East Delhi',
    'Noida',
    'Greater Noida',
    'Gurgaon / Gurugram',
    'Faridabad',
    'Ghaziabad',
  ],
  Gujarat: [
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Rajkot',
    'Bhavnagar',
    'Jamnagar',
    'Gandhinagar',
    'Junagadh',
    'Anand',
    'Navsari',
    'Morbi',
    'Bharuch',
  ],
  'West Bengal': [
    'Kolkata',
    'Howrah',
    'Durgapur',
    'Asansol',
    'Siliguri',
    'Kharagpur',
    'Bardhaman',
    'Malda',
    'Darjeeling',
    'Haldia',
    'Kalyani',
  ],
  Bihar: [
    'Patna',
    'Gaya',
    'Bhagalpur',
    'Muzaffarpur',
    'Purnia',
    'Darbhanga',
    'Bihar Sharif',
    'Arrah',
    'Begusarai',
    'Katihar',
    'Munger',
  ],
  'Uttar Pradesh': [
    'Lucknow',
    'Kanpur',
    'Varanasi',
    'Agra',
    'Prayagraj (Allahabad)',
    'Meerut',
    'Noida',
    'Bareilly',
    'Aligarh',
    'Moradabad',
    'Gorakhpur',
    'Ayodhya',
    'Jhansi',
  ],
  Rajasthan: [
    'Jaipur',
    'Jodhpur',
    'Kota',
    'Bikaner',
    'Ajmer',
    'Udaipur',
    'Bhilwara',
    'Alwar',
    'Sikar',
  ],
  'Madhya Pradesh': [
    'Indore',
    'Bhopal',
    'Jabalpur',
    'Gwalior',
    'Ujjain',
    'Sagar',
    'Dewas',
    'Satna',
  ],
  Punjab: [
    'Ludhiana',
    'Amritsar',
    'Jalandhar',
    'Patiala',
    'Bathinda',
    'Mohali',
    'Hoshiarpur',
  ],
  Haryana: [
    'Gurugram',
    'Faridabad',
    'Panipat',
    'Ambala',
    'Yamunanagar',
    'Rohtak',
    'Hisar',
    'Karnal',
    'Sonipat',
  ],
  Odisha: [
    'Bhubaneswar',
    'Cuttack',
    'Rourkela',
    'Berhampur',
    'Sambalpur',
    'Puri',
    'Balasore',
  ],
  Chhattisgarh: [
    'Raipur',
    'Bhilai',
    'Bilaspur',
    'Korba',
    'Rajnandgaon',
    'Durg',
    'Jagdalpur',
  ],
  Jharkhand: [
    'Ranchi',
    'Jamshedpur',
    'Dhanbad',
    'Bokaro',
    'Deoghar',
    'Hazaribagh',
  ],
  Goa: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  Puducherry: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  Chandigarh: ['Chandigarh', 'Manimajra'],
  'Andaman & Nicobar': ['Port Blair', 'Diglipur', 'Car Nicobar', 'Mayabunder'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'],
  'Dadra & Nagar Haveli': ['Silvassa', 'Amli', 'Khanvel'],
  'Daman & Diu': ['Daman', 'Diu'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu', 'Manali'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'],
  Ladakh: ['Leh', 'Kargil'],
  Lakshadweep: ['Kavaratti', 'Agatti'],
  Manipur: ['Imphal', 'Churachandpur', 'Thoubal'],
  Meghalaya: ['Shillong', 'Tura', 'Jowai'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung'],
  Sikkim: ['Gangtok', 'Namchi', 'Geyzing'],
  Tripura: ['Agartala', 'Dharmanagar', 'Udaipur'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh', 'Nainital'],
};

export const ProfileWizardScreen: React.FC<ProfileWizardProps> = ({
  initialData,
  initialStep = 1,
  language: parentLanguage,
  onToggleLanguage,
  onComplete,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  );
  const bottomInset = Math.max(insets.bottom, 16);

  // Local language state
  const [lang, setLang] = useState<Language>(parentLanguage || 'en');
  const isTa = lang === 'ta';
  const t = Translations[lang];

  const handleToggleLang = () => {
    const next: Language = lang === 'en' ? 'ta' : 'en';
    setLang(next);
    if (onToggleLanguage) {
      onToggleLanguage();
    }
  };

  // 5 Wizard Steps
  const [step, setStep] = useState(initialStep);

  // ==========================================
  // Step 1: Personal Details (1/5)
  // Progressive Disclosure:
  // 1. Gender -> 2. DOB -> 3. Height -> 4. Physical Status -> 5. Marital Status
  // ==========================================
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  // Date of Birth
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Dropdown Picker Modals
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);

  // Height Dropdown
  const [selectedHeight, setSelectedHeight] = useState<HeightOption | null>(null);
  const [heightModalVisible, setHeightModalVisible] = useState(false);

  // Physical Status
  const [physicalStatus, setPhysicalStatus] = useState<PhysicalStatus | null>(null);

  // Marital Status
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | null>(null);

  // Progressive Disclosure Visibility Checks
  const isDobVisible = gender !== null;
  const isDobComplete = Boolean(selectedDay && selectedMonth && selectedYear);
  const isHeightVisible = isDobComplete;
  const isPhysicalStatusVisible = Boolean(selectedHeight);
  const isMaritalStatusVisible = Boolean(physicalStatus);
  const isStep1Complete = Boolean(
    gender && isDobComplete && selectedHeight && physicalStatus && maritalStatus
  );

  // ==========================================
  // ==========================================
  // Step 2: Religious Details (2/5)
  // Progressive Disclosure:
  // 1. Religion Dropdown -> 2. Caste Dropdown -> 3. Subcaste (Optional) + Willing to marry from any caste checkbox + Dosham (Optional)
  // ==========================================
  const [religion, setReligion] = useState<string>(initialData?.religion || '');
  const [religionModalVisible, setReligionModalVisible] = useState(false);
  const [religionSearchQuery, setReligionSearchQuery] = useState('');

  const [caste, setCaste] = useState<string>(initialData?.caste || '');
  const [casteModalVisible, setCasteModalVisible] = useState(false);
  const [casteSearchQuery, setCasteSearchQuery] = useState('');

  const [subCaste, setSubCaste] = useState<string>(initialData?.subCaste || '');
  const [willingToMarryAnyCaste, setWillingToMarryAnyCaste] = useState<boolean>(
    initialData?.allowIntercaste || false
  );
  const [dosham, setDosham] = useState<'no' | 'yes' | 'dont_know'>('no');
  const [motherTongue, setMotherTongue] = useState('Tamil');

  const filteredReligions = RELIGIONS_LIST.filter(r =>
    r.toLowerCase().includes(religionSearchQuery.trim().toLowerCase())
  );

  const availableCastes = religion
    ? (CASTES_BY_RELIGION[religion] || DEFAULT_CASTES)
    : DEFAULT_CASTES;

  const filteredCastes = availableCastes.filter(c =>
    c.toLowerCase().includes(casteSearchQuery.trim().toLowerCase())
  );

  const isStep2Complete = Boolean(religion && caste);

  // ==========================================
  // Step 3: Location Details (3/5)
  // Progressive Disclosure:
  // 1. Country (Notch box) -> 2. State (Unselected -> Notch box) -> 3. City (Unselected -> Notch box)
  // ==========================================
  const [residingCountry, setResidingCountry] = useState<string>(
    initialData?.currentCountry || 'India'
  );
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  const [residingState, setResidingState] = useState<string>('');
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  const [residingCity, setResidingCity] = useState<string>(
    initialData?.currentCity || ''
  );
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const filteredCountries = COUNTRIES_LIST.filter(c =>
    c.toLowerCase().includes(countrySearchQuery.trim().toLowerCase())
  );

  const filteredStates = INDIAN_STATES.filter(s =>
    s.toLowerCase().includes(stateSearchQuery.trim().toLowerCase())
  );

  const availableCities = residingState
    ? (CITIES_BY_STATE[residingState] || DEFAULT_MAJOR_CITIES)
    : DEFAULT_MAJOR_CITIES;

  const filteredCities = availableCities.filter(c =>
    c.toLowerCase().includes(citySearchQuery.trim().toLowerCase())
  );

  const isStep3Complete = Boolean(residingCountry && residingState && residingCity);

  // Education & Career (retained for profile data completeness)
  const [qualification, setQualification] = useState('B.Tech / B.E.');
  const [institution, setInstitution] = useState('Anna University');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [employer, setEmployer] = useState('TCS / Tech Solutions');
  const [annualIncome, setAnnualIncome] = useState('₹ 15 - 20 Lakhs');
  const [workLocation, setWorkLocation] = useState(initialData?.currentCity || 'Chennai');

  // ==========================================
  // Step 4: Family Details (4/5)
  // ==========================================
  const [familyType, setFamilyType] = useState<FamilyType>('nuclear');
  const [familyValues, setFamilyValues] = useState<FamilyValues>('traditional');
  const [fatherOccupation, setFatherOccupation] = useState('Business');
  const [motherOccupation, setMotherOccupation] = useState('Homemaker');
  const [siblings, setSiblings] = useState('1 Younger Brother');
  const [nativeDistrict, setNativeDistrict] = useState(initialData?.currentCity || 'Chennai');

  // ==========================================
  // Step 5: Horoscope & Lifestyle (5/5)
  // ==========================================
  const [rasi, setRasi] = useState(TAMIL_RASIS[0]);
  const [nakshatram, setNakshatram] = useState(TAMIL_NAKSHATRAMS[0]);
  const [lagnam, setLagnam] = useState('Mesham');
  const [chevvaiDosham, setChevvaiDosham] = useState(false);
  const [sarpaDosham, setSarpaDosham] = useState(false);
  const [diet, setDiet] = useState<DietPreference>('vegetarian');
  const [about, setAbout] = useState('');
  const [hidePhoneUntilAccepted, setHidePhoneUntilAccepted] = useState(true);

  // Helpline trigger
  const handleCallSupport = () => {
    Linking.openURL('tel:8144998877').catch(() => {
      Alert.alert(
        isTa ? 'மணமாலை உதவி மையம்' : 'Manamaalai Matrimony Helpline',
        isTa
          ? 'எங்கள் உதவி எண்: 8144-99-88-77\nகாலை 9:00 முதல் இரவு 8:00 வரை செயல்படுகிறது.'
          : 'Our support number: 8144-99-88-77\nActive from 9:00 AM to 8:00 PM.'
      );
    });
  };

  const handleNextPress = () => {
    if (step === 1) {
      if (!gender) {
        Alert.alert(
          isTa ? 'பாலினம் தேவை' : 'Gender Required',
          isTa ? 'தயவுசெய்து பாலினத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select your gender.'
        );
        return;
      }
      if (!isDobComplete) {
        Alert.alert(
          isTa ? 'பிறந்த தேதி தேவை' : 'Date of Birth Required',
          isTa ? 'நாள், மாதம், ஆண்டு ஆகியவற்றை முழுமையாக தேர்வு செய்யவும்.' : 'Please select day, month and year of birth.'
        );
        return;
      }
      if (!selectedHeight) {
        Alert.alert(
          isTa ? 'உயரம் தேவை' : 'Height Required',
          isTa ? 'தயவுசெய்து உங்கள் உயரத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select your height.'
        );
        return;
      }
      if (!physicalStatus) {
        Alert.alert(
          isTa ? 'உடல் நிலை தேவை' : 'Physical Status Required',
          isTa ? 'தயவுசெய்து உங்கள் உடல் நிலையைத் தேர்ந்தெடுக்கவும்.' : 'Please select your physical status.'
        );
        return;
      }
      if (!maritalStatus) {
        Alert.alert(
          isTa ? 'திருமண நிலை தேவை' : 'Marital Status Required',
          isTa ? 'தயவுசெய்து உங்கள் திருமண நிலையைத் தேர்ந்தெடுக்கவும்.' : 'Please select your marital status.'
        );
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!religion) {
        Alert.alert(
          isTa ? 'மதம் தேவை' : 'Religion Required',
          isTa ? 'தயவுசெய்து உங்கள் மதத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select your religion.'
        );
        return;
      }
      if (!caste) {
        Alert.alert(
          isTa ? 'சாதி தேவை' : 'Caste Required',
          isTa ? 'தயவுசெய்து உங்கள் சாதியைத் தேர்ந்தெடுக்கவும்.' : 'Please select your caste.'
        );
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!residingCountry) {
        Alert.alert(
          isTa ? 'நாடு தேவை' : 'Country Required',
          isTa ? 'தயவுசெய்து உங்கள் வசிக்கும் நாட்டைத் தேர்ந்தெடுக்கவும்.' : 'Please select your residing country.'
        );
        return;
      }
      if (!residingState) {
        Alert.alert(
          isTa ? 'மாநிலம் தேவை' : 'State Required',
          isTa ? 'தயவுசெய்து உங்கள் வசிக்கும் மாநிலத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select your residing state.'
        );
        return;
      }
      if (!residingCity) {
        Alert.alert(
          isTa ? 'நகரம் தேவை' : 'City Required',
          isTa ? 'தயவுசெய்து உங்கள் வசிக்கும் நகரத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select your residing city.'
        );
        return;
      }
      setWorkLocation(`${residingCity}, ${residingState}`);
      setNativeDistrict(residingCity);
      setStep(4);
      return;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      finalizeProfile();
    }
  };

  const finalizeProfile = async () => {
    const dobString = `${selectedYear || '1995'}-${selectedMonth || '01'}-${selectedDay || '01'}`;
    const calculatedAge = currentYear - (parseInt(selectedYear || '1995', 10) || 1995);

    const profileGender: Gender = gender === 'female' ? 'bride' : 'groom';
    const finalMaritalStatus: MaritalStatus =
      maritalStatus === 'widow'
        ? 'widowed'
        : maritalStatus || 'never_married';
    const allowIntercaste = willingToMarryAnyCaste;

    const newProfile: MatrimonyProfile = {
      id: `profile_${Date.now()}`,
      userId: `user_${Date.now()}`,
      matrimonyId: `MM-TN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: initialData?.name || (gender === 'female' ? 'Mekha M' : 'Karthik S'),
      gender: profileGender,
      createdFor: initialData?.createdFor || 'self',
      age: calculatedAge,
      dateOfBirth: dobString,
      maritalStatus: finalMaritalStatus,
      physicalStatus: physicalStatus || 'normal',
      religion,
      caste,
      subCaste,
      allowIntercaste,
      motherTongue,
      nativeDistrict: residingCity || nativeDistrict,
      currentCity: residingCity || initialData?.currentCity || 'Chennai',
      currentCountry: residingCountry || 'India',
      photos: [
        gender === 'female'
          ? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      ],
      about:
        about.trim() ||
        (isTa
          ? 'பாரம்பரிய தமிழ் கலாச்சாரத்தை மதிக்கும் நல்வாழ்க்கைத் துணையை எதிர்பார்க்கிறேன்.'
          : 'Looking for an understanding partner who values Tamil traditions and family harmony.'),
      horoscope: {
        rasi,
        nakshatram,
        lagnam,
        chevvaiDosham,
        sarpaDosham,
        birthDate: dobString,
        birthTime: '06:30 AM',
        birthPlace: nativeDistrict,
      },
      family: {
        fatherOccupation,
        motherOccupation,
        siblings,
        siblingsMarried: 'None',
        familyType,
        familyValues,
        familyStatus: 'Upper Middle Class',
        nativeDistrict,
      },
      educationCareer: {
        qualification,
        institution,
        occupation,
        employer,
        annualIncome,
        workLocation,
      },
      lifestyle: {
        diet,
        smoking: false,
        drinking: false,
        hobbies: ['Music', 'Travel', 'Reading'],
        languagesKnown: ['Tamil', 'English'],
        heightCm: selectedHeight?.cm || 165,
        heightFeet: selectedHeight?.ft || "5' 5\"",
        physicalStatus: physicalStatus || 'normal',
      },
      partnerPreferences: {
        ageMin: profileGender === 'groom' ? 21 : 25,
        ageMax: profileGender === 'groom' ? 28 : 33,
        heightMinCm: profileGender === 'groom' ? 150 : 165,
        heightMaxCm: profileGender === 'groom' ? 175 : 190,
        maritalStatus: [finalMaritalStatus],
        religions: [religion],
        castes: [caste],
        allowIntercaste,
        educationLevels: ['B.Tech', 'MBA', 'MS', 'CA', 'MD'],
        occupations: ['Tech', 'Corporate', 'Medical'],
        locations: [nativeDistrict, 'Chennai'],
        diet: [diet],
      },
      privacy: {
        hidePhoneUntilInterestAccepted: hidePhoneUntilAccepted,
        hideHoroscopeUntilRequested: false,
        showPhotoToRegisteredOnly: true,
      },
      isVerified: true,
      verificationBadgeType: 'aadhar',
      membershipTier: 'gold',
      profileCompleteness: 98,
      phone: initialData?.phone || '6385901512',
      email: initialData?.email || 'mekha.m@manamaalai.mock',
      lastActive: 'Just now',
      createdAt: new Date().toISOString(),
    };

    await StorageService.saveProfile(newProfile);
    await StorageService.updateCurrentUser({
      activeProfileId: newProfile.id,
      phone: newProfile.phone,
      email: newProfile.email,
    });

    Alert.alert(
      isTa ? 'வாழ்க வளமுடன்! 🌺' : 'Vazhga Valamudan! 🌺',
      isTa
        ? 'உங்கள் மணமாலை மேட்ரிமோனி சுயவிவரம் வெற்றிகரமாக உருவாக்கப்பட்டது.'
        : 'Your Manamaalai Matrimony profile has been created successfully.'
    );
    onComplete(newProfile);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return isTa ? 'தனிப்பட்ட விவரங்கள் (1/5)' : 'Personal Details (1/5)';
      case 2:
        return isTa ? 'மத விவரங்கள் (2/5)' : 'Religious Details (2/5)';
      case 3:
        return isTa ? 'இருப்பிட விவரங்கள் (3/5)' : 'Location Details (3/5)';
      case 4:
        return isTa ? 'குடும்ப விவரங்கள் (4/5)' : 'Family Background (4/5)';
      case 5:
        return isTa ? 'ஜாதகம் & வாழ்க்கை முறை (5/5)' : 'Horoscope & Lifestyle (5/5)';
      default:
        return isTa ? 'விவரங்கள் (1/5)' : 'Personal Details (1/5)';
    }
  };

  const progressPercentage = step * 20;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ============================================================ */}
      {/* 1. TOP HEADER: Back Arrow, Title (1/5), Language Pill [A / அ] */}
      {/* ============================================================ */}
      <View style={[styles.header, { paddingTop: topInset + 6 }]}>
        {/* Left: Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={step > 1 ? () => setStep(step - 1) : onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Back"
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Center: Title e.g. "Personal Details (1/5)" */}
        <Text
          style={[
            styles.headerTitle,
            { fontFamily: isTa ? Typography.fontNotoSerifTamil : Typography.fontPoppins },
          ]}
          numberOfLines={1}
        >
          {getStepTitle()}
        </Text>

        {/* Right: Language Pill [ 🌐 A / அ ] */}
        <TouchableOpacity
          style={styles.langBtn}
          onPress={handleToggleLang}
          activeOpacity={0.7}
          accessibilityLabel="Toggle language"
        >
          <Text style={styles.langGlobe}>🌐</Text>
          <Text style={styles.langText}>A / அ</Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================ */}
      {/* 2. PROGRESS BAR: 20% on Step 1, with fill and percentage label */}
      {/* ============================================================ */}
      <View style={styles.progressBarRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.percentText}>{progressPercentage}%</Text>
      </View>

      {/* ============================================================ */}
      {/* 3. SCROLLABLE BODY CONTENT                                   */}
      {/* ============================================================ */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollBody,
          { paddingBottom: bottomInset + 30 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ========================================================== */}
        {/* STEP 1: PERSONAL DETAILS (1/5) - PROGRESSIVE DISCLOSURE    */}
        {/* ========================================================== */}
        {step === 1 && (
          <View style={styles.stepOneContent}>
            {/* 1. GENDER */}
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>
                {t.genderTitle || (isTa ? 'பாலினம்' : 'Gender')}
              </Text>
              <View style={styles.pillsRow}>
                {/* Male */}
                <TouchableOpacity
                  style={[
                    styles.pill,
                    gender === 'male' && styles.pillSelected,
                  ]}
                  onPress={() => setGender('male')}
                  activeOpacity={0.8}
                >
                  {gender === 'male' ? (
                    <View style={styles.pillCheckCircle}>
                      <Text style={styles.pillCheckIcon}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.pillRadioCircle} />
                  )}
                  <Text
                    style={[
                      styles.pillText,
                      gender === 'male' && styles.pillTextSelected,
                    ]}
                  >
                    {t.male || (isTa ? 'ஆண்' : 'Male')}
                  </Text>
                </TouchableOpacity>

                {/* Female */}
                <TouchableOpacity
                  style={[
                    styles.pill,
                    gender === 'female' && styles.pillSelected,
                  ]}
                  onPress={() => setGender('female')}
                  activeOpacity={0.8}
                >
                  {gender === 'female' ? (
                    <View style={styles.pillCheckCircle}>
                      <Text style={styles.pillCheckIcon}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.pillRadioCircle} />
                  )}
                  <Text
                    style={[
                      styles.pillText,
                      gender === 'female' && styles.pillTextSelected,
                    ]}
                  >
                    {t.female || (isTa ? 'பெண்' : 'Female')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. DATE OF BIRTH - Appears when Gender is selected */}
            {isDobVisible && (
              <View style={styles.questionSection}>
                <Text style={styles.questionTitle}>
                  {t.dateOfBirthTitle || (isTa ? 'பிறந்த தேதி' : 'Date of birth')}
                </Text>
                <View style={styles.dobRow}>
                  {/* Day Button */}
                  <TouchableOpacity
                    style={[
                      styles.dobDropdownBtn,
                      selectedDay ? styles.dobDropdownBtnActive : null,
                    ]}
                    onPress={() => setDayModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dobDropdownText,
                        selectedDay ? styles.dobDropdownTextActive : null,
                      ]}
                    >
                      {selectedDay || (isTa ? 'நாள்' : 'Day')}
                    </Text>
                    <Text style={styles.dropdownChevron}>∨</Text>
                  </TouchableOpacity>

                  {/* Month Button */}
                  <TouchableOpacity
                    style={[
                      styles.dobDropdownBtn,
                      selectedMonth ? styles.dobDropdownBtnActive : null,
                    ]}
                    onPress={() => setMonthModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dobDropdownText,
                        selectedMonth ? styles.dobDropdownTextActive : null,
                      ]}
                    >
                      {selectedMonth
                        ? (isTa
                            ? MONTHS_DATA.find(m => m.val === selectedMonth)?.ta
                            : MONTHS_DATA.find(m => m.val === selectedMonth)?.en)
                        : (isTa ? 'மாதம்' : 'Month')}
                    </Text>
                    <Text style={styles.dropdownChevron}>∨</Text>
                  </TouchableOpacity>

                  {/* Year Button */}
                  <TouchableOpacity
                    style={[
                      styles.dobDropdownBtn,
                      selectedYear ? styles.dobDropdownBtnActive : null,
                    ]}
                    onPress={() => setYearModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dobDropdownText,
                        selectedYear ? styles.dobDropdownTextActive : null,
                      ]}
                    >
                      {selectedYear || (isTa ? 'ஆண்டு' : 'Year')}
                    </Text>
                    <Text style={styles.dropdownChevron}>∨</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 3. HEIGHT - Appears when Date of Birth is selected */}
            {isHeightVisible && (
              <View style={styles.questionSection}>
                <Text style={styles.questionTitle}>
                  {t.heightLabel || (isTa ? 'உயரம்' : 'Height')}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.heightDropdownBtn,
                    selectedHeight ? styles.heightDropdownBtnActive : null,
                  ]}
                  onPress={() => setHeightModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.heightDropdownText,
                      selectedHeight ? styles.heightDropdownTextActive : null,
                    ]}
                  >
                    {selectedHeight
                      ? selectedHeight.label
                      : (t.selectYourHeightPlaceholder || (isTa ? 'உங்கள் உயரத்தை தேர்வு செய்க' : 'Select your height'))}
                  </Text>
                  <Text style={styles.dropdownChevron}>∨</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 4. PHYSICAL STATUS - Appears when Height is selected */}
            {isPhysicalStatusVisible && (
              <View style={styles.questionSection}>
                <Text style={styles.questionTitle}>
                  {t.physicalStatusTitle || (isTa ? 'உடல் நிலை' : 'Physical status')}
                </Text>
                <View style={styles.pillsRowWrap}>
                  {/* Normal */}
                  <TouchableOpacity
                    style={[
                      styles.pill,
                      physicalStatus === 'normal' && styles.pillSelected,
                    ]}
                    onPress={() => setPhysicalStatus('normal')}
                    activeOpacity={0.8}
                  >
                    {physicalStatus === 'normal' ? (
                      <View style={styles.pillCheckCircle}>
                        <Text style={styles.pillCheckIcon}>✓</Text>
                      </View>
                    ) : (
                      <View style={styles.pillRadioCircle} />
                    )}
                    <Text
                      style={[
                        styles.pillText,
                        physicalStatus === 'normal' && styles.pillTextSelected,
                      ]}
                    >
                      {t.statusNormal || (isTa ? 'இயல்பானது' : 'Normal')}
                    </Text>
                  </TouchableOpacity>

                  {/* Physically Challenged */}
                  <TouchableOpacity
                    style={[
                      styles.pill,
                      physicalStatus === 'physically_challenged' && styles.pillSelected,
                    ]}
                    onPress={() => setPhysicalStatus('physically_challenged')}
                    activeOpacity={0.8}
                  >
                    {physicalStatus === 'physically_challenged' ? (
                      <View style={styles.pillCheckCircle}>
                        <Text style={styles.pillCheckIcon}>✓</Text>
                      </View>
                    ) : (
                      <View style={styles.pillRadioCircle} />
                    )}
                    <Text
                      style={[
                        styles.pillText,
                        physicalStatus === 'physically_challenged' && styles.pillTextSelected,
                      ]}
                    >
                      {t.statusPhysicallyChallenged || (isTa ? 'மாற்றுத்திறனாளி' : 'Physically Challenged')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 5. MARITAL STATUS - Appears when Physical Status is selected */}
            {isMaritalStatusVisible && (
              <View style={styles.questionSection}>
                <Text style={styles.questionTitle}>
                  {t.maritalStatusTitle || (isTa ? 'திருமண நிலை' : 'Marital status')}
                </Text>
                <View style={styles.pillsRowWrap}>
                  {[
                    {
                      id: 'never_married' as MaritalStatus,
                      label: t.neverMarriedOption || (isTa ? 'மணமாகாதவர்' : 'Never Married'),
                    },
                    {
                      id: 'widow' as MaritalStatus,
                      label: t.widowOption || (isTa ? 'விதவை / விதவையர்' : 'Widow'),
                    },
                    {
                      id: 'awaiting_divorce' as MaritalStatus,
                      label: t.awaitingDivorceOption || (isTa ? 'விவாகரத்து எதிர்பார்ப்பவர்' : 'Awaiting Divorce'),
                    },
                    {
                      id: 'divorced' as MaritalStatus,
                      label: t.divorcedOption || (isTa ? 'விவாகரத்தானவர்' : 'Divorced'),
                    },
                  ].map(item => {
                    const active = maritalStatus === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.pill,
                          active && styles.pillSelected,
                        ]}
                        onPress={() => setMaritalStatus(item.id)}
                        activeOpacity={0.8}
                      >
                        {active ? (
                          <View style={styles.pillCheckCircle}>
                            <Text style={styles.pillCheckIcon}>✓</Text>
                          </View>
                        ) : (
                          <View style={styles.pillRadioCircle} />
                        )}
                        <Text
                          style={[
                            styles.pillText,
                            active && styles.pillTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Spacing before bottom CTA */}
            <View style={{ height: 20 }} />

            {/* CTA Button: Next in Manamaalai Matrimony theme */}
            <TouchableOpacity
              style={[
                styles.primaryNextBtn,
                !isStep1Complete && styles.primaryNextBtnIncomplete,
              ]}
              onPress={handleNextPress}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryNextBtnText}>
                {t.next || (isTa ? 'அடுத்து' : 'Next')}
              </Text>
            </TouchableOpacity>

            {/* Dashed Helpline Divider */}
            <View style={styles.dashedLine} />

            {/* Helpline Call Row */}
            <TouchableOpacity
              style={styles.helplineRow}
              onPress={handleCallSupport}
              activeOpacity={0.7}
            >
              <Text style={styles.helplineLabel}>
                {t.needHelpCall || (isTa ? 'உதவி தேவையா? அழையுங்கள்' : 'Need help? Call')}
              </Text>
              <Text style={styles.helplinePhone}>  📞 8144-99-88-77</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================== */}
        {/* STEP 2: RELIGIOUS DETAILS (2/5)                           */}
        {/* Progressive Disclosure: Religion -> Caste -> Subcaste/Checkbox/Dosham */}
        {/* ========================================================== */}
        {step === 2 && (
          <View style={styles.stepOneContent}>
            {/* Heading: Religion */}
            <Text style={styles.page2SectionTitle}>
              {t.religionLabel || (isTa ? 'மதம்' : 'Religion')}
            </Text>

            {/* 1. RELIGION NOTCH DROPDOWN */}
            <View style={styles.notchBoxContainer}>
              <TouchableOpacity
                style={[
                  styles.notchBox,
                  Boolean(religion) && styles.notchBoxActive,
                ]}
                onPress={() => {
                  setReligionSearchQuery('');
                  setReligionModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.notchLabelWrapper} pointerEvents="none">
                  <Text style={[styles.notchLabelText, Boolean(religion) && styles.notchLabelTextActive]}>
                    {t.religionLabel || (isTa ? 'மதம்' : 'Religion')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.notchValueText,
                    !religion && styles.notchPlaceholderText,
                  ]}
                  numberOfLines={1}
                >
                  {religion || (t.selectReligionPlaceholder || (isTa ? 'மதத்தைத் தேர்ந்தெடுக்கவும்' : 'Select your religion'))}
                </Text>
                <Text style={styles.notchChevron}>∨</Text>
              </TouchableOpacity>
            </View>

            {/* 2. CASTE NOTCH DROPDOWN - Appears after Religion is selected */}
            {Boolean(religion) && (
              <View style={styles.notchBoxContainer}>
                <TouchableOpacity
                  style={[
                    styles.notchBox,
                    Boolean(caste) && styles.notchBoxActive,
                  ]}
                  onPress={() => {
                    setCasteSearchQuery('');
                    setCasteModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.notchLabelWrapper} pointerEvents="none">
                    <Text style={[styles.notchLabelText, Boolean(caste) && styles.notchLabelTextActive]}>
                      {t.casteLabel || (isTa ? 'சாதி' : 'Caste')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.notchValueText,
                      !caste && styles.notchPlaceholderText,
                    ]}
                    numberOfLines={1}
                  >
                    {caste || (t.selectCastePlaceholder || (isTa ? 'சாதியைத் தேர்ந்தெடுக்கவும்' : 'Select your caste'))}
                  </Text>
                  <Text style={styles.notchChevron}>∨</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 3. SUBCASTE, CHECKBOX & DOSHAM - Appears after Caste is selected */}
            {Boolean(caste) && (
              <>
                {/* Outlined text box: Enter subcaste (Optional) */}
                <View style={styles.subcasteInputContainer}>
                  <TextInput
                    style={styles.subcasteInput}
                    placeholder={t.enterSubcasteOptional || (isTa ? 'உட்பிரிவு (விருப்பத்தேர்வு)' : 'Enter subcaste (Optional)')}
                    placeholderTextColor="#94A3B8"
                    value={subCaste}
                    onChangeText={setSubCaste}
                  />
                </View>

                {/* Checkbox: Willing to marry from any caste */}
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setWillingToMarryAnyCaste(!willingToMarryAnyCaste)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      willingToMarryAnyCaste && styles.checkboxBoxChecked,
                    ]}
                  >
                    {willingToMarryAnyCaste && (
                      <Text style={styles.checkboxCheckmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    {t.willingToMarryAnyCaste || (isTa ? 'எந்த சாதியினரையும் திருமணம் செய்ய சம்மதம்' : 'Willing to marry from any caste')}
                  </Text>
                </TouchableOpacity>

                {/* Question: Do you have any dosham? (Optional) */}
                <View style={styles.doshamSection}>
                  <View style={styles.doshamTitleRow}>
                    <Text style={styles.doshamTitle}>
                      {t.doYouHaveAnyDosham || (isTa ? 'உங்களுக்கு ஏதேனும் தோஷம் உள்ளதா?' : 'Do you have any dosham?')}
                    </Text>
                    <Text style={styles.optionalText}>
                      {' '}{t.optionalTag || (isTa ? '(விருப்பத்தேர்வு)' : '(Optional)')}
                    </Text>
                  </View>

                  <View style={styles.doshamPillsRow}>
                    {[
                      { id: 'no' as const, label: t.doshamNo || (isTa ? 'இல்லை' : 'No') },
                      { id: 'yes' as const, label: t.doshamYes || (isTa ? 'ஆம்' : 'Yes') },
                      { id: 'dont_know' as const, label: t.doshamDontKnow || (isTa ? 'தெரியாது' : "Don't know") },
                    ].map(item => {
                      const isSelected = dosham === item.id;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.doshamPill,
                            isSelected && styles.doshamPillSelected,
                          ]}
                          onPress={() => setDosham(item.id)}
                          activeOpacity={0.8}
                        >
                          {isSelected ? (
                            <View style={styles.pillCheckCircle}>
                              <Text style={styles.pillCheckIcon}>✓</Text>
                            </View>
                          ) : (
                            <View style={styles.pillRadioCircle} />
                          )}
                          <Text
                            style={[
                              styles.doshamPillText,
                              isSelected && styles.doshamPillTextSelected,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* Spacing before bottom CTA */}
            <View style={{ height: 28 }} />

            {/* CTA Button: Next */}
            <TouchableOpacity
              style={[
                styles.primaryNextBtn,
                !isStep2Complete && styles.primaryNextBtnIncomplete,
              ]}
              onPress={handleNextPress}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryNextBtnText}>
                {t.next || (isTa ? 'அடுத்து' : 'Next')}
              </Text>
            </TouchableOpacity>

            {/* Dashed Helpline Divider */}
            <View style={styles.dashedLine} />

            {/* Helpline Call Row */}
            <TouchableOpacity
              style={styles.helplineRow}
              onPress={handleCallSupport}
              activeOpacity={0.7}
            >
              <Text style={styles.helplineLabel}>
                {t.needHelpCall || (isTa ? 'உதவி தேவையா? அழையுங்கள்' : 'Need help? Call')}
              </Text>
              <Text style={styles.helplinePhone}>  📞 8144-99-88-77</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================== */}
        {/* STEP 3: LOCATION DETAILS (3/5)                             */}
        {/* Progressive Disclosure: Country -> State -> City           */}
        {/* ========================================================== */}
        {step === 3 && (
          <View style={styles.stepOneContent}>
            {/* 1. COUNTRY NOTCH DROPDOWN */}
            <View style={styles.notchBoxContainer}>
              <TouchableOpacity
                style={[
                  styles.notchBox,
                  Boolean(residingCountry) && styles.notchBoxActive,
                ]}
                onPress={() => {
                  setCountrySearchQuery('');
                  setCountryModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.notchLabelWrapper} pointerEvents="none">
                  <Text
                    style={[
                      styles.notchLabelText,
                      Boolean(residingCountry) && styles.notchLabelTextActive,
                    ]}
                  >
                    {t.yourResidingCountry || (isTa ? 'உங்கள் வசிக்கும் நாடு' : 'Your residing country')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.notchValueText,
                    !residingCountry && styles.notchPlaceholderText,
                  ]}
                  numberOfLines={1}
                >
                  {residingCountry || (t.selectResidingCountry || (isTa ? 'நாட்டைத் தேர்ந்தெடுக்கவும்' : 'Select residing country'))}
                </Text>
                <Text style={styles.notchChevron}>∨</Text>
              </TouchableOpacity>
            </View>

            {/* 2. STATE DROPDOWN (Revealed when Country is present) */}
            {Boolean(residingCountry) && (
              <>
                {Boolean(residingState) ? (
                  /* Floating Notch Box when selected (Screenshot 3) */
                  <View style={styles.notchBoxContainer}>
                    <TouchableOpacity
                      style={[styles.notchBox, styles.notchBoxActive]}
                      onPress={() => {
                        setStateSearchQuery('');
                        setStateModalVisible(true);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.notchLabelWrapper} pointerEvents="none">
                        <Text style={[styles.notchLabelText, styles.notchLabelTextActive]}>
                          {t.yourResidingState || (isTa ? 'உங்கள் வசிக்கும் மாநிலம்' : 'Your residing state')}
                        </Text>
                      </View>
                      <Text style={styles.notchValueText} numberOfLines={1}>
                        {residingState}
                      </Text>
                      <Text style={styles.notchChevron}>∨</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Unselected Select Box (Screenshot 1) */
                  <TouchableOpacity
                    style={styles.unselectedSelectBox}
                    onPress={() => {
                      setStateSearchQuery('');
                      setStateModalVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.unselectedSelectPlaceholder}>
                      {t.selectYourResidentState || (isTa ? 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்' : 'Select your resident state')}
                    </Text>
                    <Text style={styles.notchChevron}>∨</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* 3. CITY DROPDOWN (Revealed when State is selected - Screenshot 3) */}
            {Boolean(residingState) && (
              <>
                {Boolean(residingCity) ? (
                  /* Floating Notch Box when selected */
                  <View style={styles.notchBoxContainer}>
                    <TouchableOpacity
                      style={[styles.notchBox, styles.notchBoxActive]}
                      onPress={() => {
                        setCitySearchQuery('');
                        setCityModalVisible(true);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.notchLabelWrapper} pointerEvents="none">
                        <Text style={[styles.notchLabelText, styles.notchLabelTextActive]}>
                          {t.yourResidingCity || (isTa ? 'உங்கள் வசிக்கும் நகரம்' : 'Your residing city')}
                        </Text>
                      </View>
                      <Text style={styles.notchValueText} numberOfLines={1}>
                        {residingCity}
                      </Text>
                      <Text style={styles.notchChevron}>∨</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Unselected Select Box (Screenshot 3) */
                  <TouchableOpacity
                    style={styles.unselectedSelectBox}
                    onPress={() => {
                      setCitySearchQuery('');
                      setCityModalVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.unselectedSelectPlaceholder}>
                      {t.selectYourResidentCity || (isTa ? 'நகரத்தைத் தேர்ந்தெடுக்கவும்' : 'Select your resident city')}
                    </Text>
                    <Text style={styles.notchChevron}>∨</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* 4. MATCH PREVIEW BANNER (Screenshots 1 & 3) */}
            <View style={styles.matchBanner}>
              <Text style={styles.matchBannerTitle}>
                {t.matchesWaitingTitle || (isTa ? '3,400 பொருத்தங்கள் உங்களுக்காக காத்திருக்கின்றன' : '3,400 Matches Waiting for You')}
              </Text>
              <Text style={styles.matchBannerSubtitle}>
                {t.matchesWaitingSub || (isTa ? 'பதிவை முடித்து மேலும் பொருத்தங்களைக் காண்க' : 'Complete your registration and see more matches')}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.matchCardsScroll}
              >
                {[
                  {
                    id: 'm1',
                    age: 37,
                    height: "5'7\"",
                    community: religion ? `${religion} - ${caste || 'Any'}` : 'Jain - Digambar, Jain - Kut...',
                    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                  },
                  {
                    id: 'm2',
                    age: 36,
                    height: "5'8\"",
                    community: religion ? `${religion} - ${caste || 'Any'}` : 'Jain - Digambar, Jain - Kut...',
                    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                  },
                  {
                    id: 'm3',
                    age: 34,
                    height: "5'9\"",
                    community: religion ? `${religion} - ${caste || 'Any'}` : 'Jain - Digambar, Jain - Kut...',
                    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
                  },
                  {
                    id: 'm4',
                    age: 32,
                    height: "5'6\"",
                    community: religion ? `${religion} - ${caste || 'Any'}` : 'Jain - Digambar, Jain - Kut...',
                    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
                  },
                ].map(item => (
                  <View key={item.id} style={styles.matchCard}>
                    <Image
                      source={{ uri: item.photo }}
                      style={styles.matchCardAvatar}
                    />
                    <View style={styles.matchCardDetails}>
                      <Text style={styles.matchCardAgeHeight}>
                        {item.age}yrs • {item.height}
                      </Text>
                      <Text style={styles.matchCardCommunity} numberOfLines={1}>
                        {item.community}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Dashed Helpline Divider */}
            <View style={styles.dashedLine} />

            {/* CTA Button: Next */}
            <TouchableOpacity
              style={[
                styles.primaryNextBtn,
                !isStep3Complete && styles.primaryNextBtnIncomplete,
              ]}
              onPress={handleNextPress}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryNextBtnText}>
                {t.next || (isTa ? 'அடுத்து' : 'Next')}
              </Text>
            </TouchableOpacity>

            {/* Helpline Call Row */}
            <TouchableOpacity
              style={[styles.helplineRow, { marginTop: 14 }]}
              onPress={handleCallSupport}
              activeOpacity={0.7}
            >
              <Text style={styles.helplineLabel}>
                {t.needHelpCall || (isTa ? 'உதவி தேவையா? அழையுங்கள்' : 'Need help? Call')}
              </Text>
              <Text style={styles.helplinePhone}>  📞 8144-99-88-77</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================== */}
        {/* STEP 4: FAMILY BACKGROUND (4/5)                            */}
        {/* ========================================================== */}
        {step === 4 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepSectionHeader}>
              {isTa ? 'குடும்பப் பின்னணி விவரங்கள்' : 'Family Background Details'}
            </Text>

            <Text style={styles.fieldLabel}>{t.familyType}</Text>
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={[styles.pill, familyType === 'nuclear' && styles.pillSelected]}
                onPress={() => setFamilyType('nuclear')}
              >
                <Text
                  style={[
                    styles.pillText,
                    familyType === 'nuclear' && styles.pillTextSelected,
                  ]}
                >
                  {t.nuclearFamily || (isTa ? 'தனிக்குடும்பம்' : 'Nuclear Family')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pill, familyType === 'joint' && styles.pillSelected]}
                onPress={() => setFamilyType('joint')}
              >
                <Text
                  style={[
                    styles.pillText,
                    familyType === 'joint' && styles.pillTextSelected,
                  ]}
                >
                  {t.jointFamily || (isTa ? 'கூட்டுக்குடும்பம்' : 'Joint Family')}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>{t.familyValues}</Text>
            <View style={styles.chipRow}>
              {['orthodox', 'traditional', 'moderate', 'liberal'].map(v => {
                const active = familyValues === v;
                return (
                  <TouchableOpacity
                    key={v}
                    style={[styles.pill, active && styles.pillSelected]}
                    onPress={() => setFamilyValues(v as FamilyValues)}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextSelected]}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>{t.fatherOccupation}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Business, Govt Officer, Retired..."
              value={fatherOccupation}
              onChangeText={setFatherOccupation}
            />

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>{t.motherOccupation}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Homemaker, Teacher, Professor..."
              value={motherOccupation}
              onChangeText={setMotherOccupation}
            />

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>{t.siblings}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 1 Elder Sister (Married), 1 Brother"
              value={siblings}
              onChangeText={setSiblings}
            />

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>{t.nativeDistrict}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Tirunelveli, Madurai, Thanjavur..."
              value={nativeDistrict}
              onChangeText={setNativeDistrict}
            />

            <TouchableOpacity
              style={styles.primaryNextBtn}
              onPress={handleNextPress}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryNextBtnText}>
                {t.next || (isTa ? 'அடுத்து' : 'Next')} →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================== */}
        {/* STEP 5: HOROSCOPE & LIFESTYLE (5/5)                        */}
        {/* ========================================================== */}
        {step === 5 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepSectionHeader}>
              {isTa ? 'ஜாதகம் & வாழ்க்கை முறை' : 'Horoscope & Lifestyle Details'}
            </Text>
            <Text style={styles.stepSectionSub}>
              {isTa
                ? 'தானியங்கி 10-பொருத்தம் கணக்கீட்டிற்கு பயன்படுகிறது'
                : 'Used for automated 10-Porutham horoscope calculations'}
            </Text>

            <Text style={styles.fieldLabel}>{t.rasi}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={styles.horizontalChipsRow}>
                {TAMIL_RASIS.map(r => {
                  const active = rasi === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[styles.pill, active && styles.pillSelected]}
                      onPress={() => setRasi(r)}
                    >
                      <Text style={[styles.pillText, active && styles.pillTextSelected]}>{r}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <Text style={styles.fieldLabel}>{t.nakshatram}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={styles.horizontalChipsRow}>
                {TAMIL_NAKSHATRAMS.map(n => {
                  const active = nakshatram === n;
                  return (
                    <TouchableOpacity
                      key={n}
                      style={[styles.pill, active && styles.pillSelected]}
                      onPress={() => setNakshatram(n)}
                    >
                      <Text style={[styles.pillText, active && styles.pillTextSelected]}>{n}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <Text style={styles.fieldLabel}>{t.lagnam}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Mesham, Dhanusu, Simmam..."
              value={lagnam}
              onChangeText={setLagnam}
            />

            <View style={styles.switchRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.switchLabel}>{t.chevvaiDosham}</Text>
                <Text style={styles.switchSub}>Mars Dosham in 2, 4, 7, 8, 12th houses</Text>
              </View>
              <Switch
                value={chevvaiDosham}
                onValueChange={setChevvaiDosham}
                trackColor={{ false: '#E2E8F0', true: Colors.burgundy }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.switchLabel}>{t.sarpaDosham}</Text>
                <Text style={styles.switchSub}>Rahu-Ketu / Naga Dosham</Text>
              </View>
              <Switch
                value={sarpaDosham}
                onValueChange={setSarpaDosham}
                trackColor={{ false: '#E2E8F0', true: Colors.burgundy }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>{t.diet}</Text>
            <View style={styles.chipRow}>
              {[
                { id: 'vegetarian', label: t.vegetarian },
                { id: 'non_vegetarian', label: t.nonVegetarian },
                { id: 'eggetarian', label: t.eggetarian },
              ].map(d => {
                const active = diet === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.pill, active && styles.pillSelected]}
                    onPress={() => setDiet(d.id as DietPreference)}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextSelected]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>{t.aboutMe}</Text>
            <TextInput
              style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
              multiline
              placeholder={
                isTa
                  ? 'உங்கள் வாழ்க்கை முறை, குடும்பப் பின்னணி பற்றிய சிறு குறிப்பு...'
                  : 'Share a short introduction about your lifestyle, family values, and partner expectations...'
              }
              value={about}
              onChangeText={setAbout}
            />

            <View style={[styles.switchRow, { marginTop: 18 }]}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.switchLabel}>{t.hidePhone}</Text>
                <Text style={styles.switchSub}>
                  {isTa
                    ? 'விருப்பத்தை நீங்கள் ஏற்கும் வரை மொபைல் எண் மறைக்கப்பட்டிருக்கும்'
                    : 'Phone number remains hidden until you accept an interest'}
                </Text>
              </View>
              <Switch
                value={hidePhoneUntilAccepted}
                onValueChange={setHidePhoneUntilAccepted}
                trackColor={{ false: '#E2E8F0', true: Colors.burgundy }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryNextBtn, { marginTop: 24 }]}
              onPress={finalizeProfile}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryNextBtnText}>
                {isTa ? 'சுயவிவரத்தை நிறைவு செய்து வெளியிடுக 🌺' : 'Complete & Publish Profile 🌺'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ============================================================ */}
      {/* 4. MODALS FOR DAY, MONTH, YEAR, AND HEIGHT PICKERS           */}
      {/* ============================================================ */}

      {/* DAY PICKER MODAL */}
      <Modal
        visible={dayModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDayModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDayModalVisible(false)}
        >
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                {isTa ? 'நாளைத் தேர்ந்தெடுக்கவும்' : 'Select Day'}
              </Text>
              <TouchableOpacity
                onPress={() => setDayModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.gridContainer}>
              {DAYS_DATA.map(d => {
                const isSelected = selectedDay === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.gridItem,
                      isSelected && styles.gridItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedDay(d);
                      setDayModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.gridItemText,
                        isSelected && styles.gridItemTextSelected,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MONTH PICKER MODAL */}
      <Modal
        visible={monthModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthModalVisible(false)}
        >
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                {isTa ? 'மாதத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Month'}
              </Text>
              <TouchableOpacity
                onPress={() => setMonthModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.gridContainerMonths}>
              {MONTHS_DATA.map(m => {
                const isSelected = selectedMonth === m.val;
                return (
                  <TouchableOpacity
                    key={m.val}
                    style={[
                      styles.monthGridItem,
                      isSelected && styles.gridItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedMonth(m.val);
                      setMonthModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.monthGridItemText,
                        isSelected && styles.gridItemTextSelected,
                      ]}
                    >
                      {isTa ? `${m.ta} (${m.val})` : `${m.en} (${m.val})`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* YEAR PICKER MODAL */}
      <Modal
        visible={yearModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setYearModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearModalVisible(false)}
        >
          <View style={[styles.pickerModalCard, { maxHeight: '70%' }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                {isTa ? 'ஆண்டைத் தேர்ந்தெடுக்கவும்' : 'Select Year'}
              </Text>
              <TouchableOpacity
                onPress={() => setYearModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={YEARS_DATA}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
              renderItem={({ item: yr }) => {
                const isSelected = selectedYear === yr;
                return (
                  <TouchableOpacity
                    style={[
                      styles.yearListItem,
                      isSelected && styles.yearListItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedYear(yr);
                      setYearModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.yearListItemText,
                        isSelected && styles.yearListItemTextSelected,
                      ]}
                    >
                      {yr}
                    </Text>
                    {isSelected && <Text style={styles.yearCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* HEIGHT PICKER MODAL (Matching Image 5) */}
      <Modal
        visible={heightModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setHeightModalVisible(false)}
      >
        <View style={styles.heightModalContainer}>
          <TouchableOpacity
            style={styles.heightModalBackdrop}
            activeOpacity={1}
            onPress={() => setHeightModalVisible(false)}
          />
          <View style={styles.heightBottomSheet}>
            {/* Modal Title Row */}
            <View style={styles.heightSheetHeader}>
              <Text style={styles.heightSheetTitle}>
                {t.selectYourHeightModalTitle || (isTa ? 'உங்கள் உயரத்தை தேர்வு செய்க' : 'Select your height')}
              </Text>
              <TouchableOpacity
                onPress={() => setHeightModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* List of Heights */}
            <FlatList
              data={HEIGHT_OPTIONS}
              keyExtractor={item => item.label}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => {
                const isSelected = selectedHeight?.label === item.label;
                return (
                  <TouchableOpacity
                    style={[
                      styles.heightRowItem,
                      isSelected && styles.heightRowItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedHeight(item);
                      setHeightModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.heightRowText,
                        isSelected && styles.heightRowTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Text style={styles.heightSelectedCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* RELIGION PICKER BOTTOM SHEET MODAL */}
      <Modal
        visible={religionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReligionModalVisible(false)}
      >
        <View style={styles.bottomSheetContainer}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setReligionModalVisible(false)}
          />
          <View style={styles.bottomSheetCard}>
            {/* Modal Title Row */}
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>
                {t.selectReligionModalTitle || (isTa ? 'உங்கள் மதத்தைத் தேர்ந்தெடுக்கவும்' : 'Select your religion')}
              </Text>
              <TouchableOpacity
                onPress={() => setReligionModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.modalSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder={t.searchReligion || (isTa ? 'மதத்தைத் தேடுக...' : 'Search religion...')}
                placeholderTextColor="#94A3B8"
                value={religionSearchQuery}
                onChangeText={setReligionSearchQuery}
                autoCorrect={false}
              />
              {Boolean(religionSearchQuery) && (
                <TouchableOpacity onPress={() => setReligionSearchQuery('')}>
                  <Text style={styles.modalSearchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* List of Religions */}
            <FlatList
              data={filteredReligions}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = religion === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalRowItem,
                      isSelected && styles.modalRowItemSelected,
                    ]}
                    onPress={() => {
                      if (religion !== item) {
                        setReligion(item);
                        setCaste(''); // reset caste when religion changes
                      }
                      setReligionModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        isSelected && styles.modalRowTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Text style={styles.modalRowCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* CASTE PICKER BOTTOM SHEET MODAL */}
      <Modal
        visible={casteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCasteModalVisible(false)}
      >
        <View style={styles.bottomSheetContainer}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setCasteModalVisible(false)}
          />
          <View style={styles.bottomSheetCard}>
            {/* Modal Title Row */}
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>
                {t.selectCasteModalTitle || (isTa ? 'உங்கள் சாதியைத் தேர்ந்தெடுக்கவும்' : 'Select your caste')}
              </Text>
              <TouchableOpacity
                onPress={() => setCasteModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.modalSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder={t.searchCaste || (isTa ? 'சாதியைத் தேடுக...' : 'Search caste...')}
                placeholderTextColor="#94A3B8"
                value={casteSearchQuery}
                onChangeText={setCasteSearchQuery}
                autoCorrect={false}
              />
              {Boolean(casteSearchQuery) && (
                <TouchableOpacity onPress={() => setCasteSearchQuery('')}>
                  <Text style={styles.modalSearchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* List of Castes */}
            <FlatList
              data={filteredCastes}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                casteSearchQuery.trim() && !filteredCastes.includes(casteSearchQuery.trim()) ? (
                  <TouchableOpacity
                    style={styles.customCasteItem}
                    onPress={() => {
                      setCaste(casteSearchQuery.trim());
                      setCasteModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.customCasteText}>
                      + {isTa ? 'சேர்க்க:' : 'Use custom caste:'} "{casteSearchQuery.trim()}"
                    </Text>
                  </TouchableOpacity>
                ) : undefined
              }
              renderItem={({ item }) => {
                const isSelected = caste === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalRowItem,
                      isSelected && styles.modalRowItemSelected,
                    ]}
                    onPress={() => {
                      setCaste(item);
                      setCasteModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        isSelected && styles.modalRowTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Text style={styles.modalRowCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* COUNTRY PICKER BOTTOM SHEET MODAL */}
      <Modal
        visible={countryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.bottomSheetContainer}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setCountryModalVisible(false)}
          />
          <View style={styles.bottomSheetCard}>
            {/* Search Input Box */}
            <View style={styles.sheetTopSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder={t.searchResidingCountry || (isTa ? 'நாட்டைத் தேடுக...' : 'Search residing country')}
                placeholderTextColor="#94A3B8"
                value={countrySearchQuery}
                onChangeText={setCountrySearchQuery}
                autoCorrect={false}
              />
              {Boolean(countrySearchQuery) && (
                <TouchableOpacity onPress={() => setCountrySearchQuery('')}>
                  <Text style={styles.modalSearchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Subheading Title */}
            <View style={styles.sheetSubheadingRow}>
              <Text style={styles.sheetSubheadingTitle}>
                {t.selectYourResidentCountry || (isTa ? 'உங்கள் வசிக்கும் நாட்டைத் தேர்வு செய்க' : 'Select your resident country')}
              </Text>
              <TouchableOpacity
                onPress={() => setCountryModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* List of Countries */}
            <FlatList
              data={filteredCountries}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = residingCountry === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalRowItem,
                      isSelected && styles.modalRowItemSelected,
                    ]}
                    onPress={() => {
                      if (residingCountry !== item) {
                        setResidingCountry(item);
                        setResidingState('');
                        setResidingCity('');
                      }
                      setCountryModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        isSelected && styles.modalRowTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Text style={styles.modalRowCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* STATE PICKER BOTTOM SHEET MODAL (Screenshot 2) */}
      <Modal
        visible={stateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.bottomSheetContainer}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setStateModalVisible(false)}
          />
          <View style={styles.bottomSheetCard}>
            {/* Search Input Box (Screenshot 2) */}
            <View style={styles.sheetTopSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder={t.searchResidingState || (isTa ? 'மாநிலத்தைத் தேடுக...' : 'Search residing state')}
                placeholderTextColor="#94A3B8"
                value={stateSearchQuery}
                onChangeText={setStateSearchQuery}
                autoCorrect={false}
              />
              {Boolean(stateSearchQuery) && (
                <TouchableOpacity onPress={() => setStateSearchQuery('')}>
                  <Text style={styles.modalSearchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Subheading Title (Screenshot 2) */}
            <View style={styles.sheetSubheadingRow}>
              <Text style={styles.sheetSubheadingTitle}>
                {t.selectYourResidentStateTitle || (isTa ? 'உங்கள் வசிக்கும் மாநிலத்தைத் தேர்வு செய்க' : 'Select your resident state')}
              </Text>
              <TouchableOpacity
                onPress={() => setStateModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* List of States */}
            <FlatList
              data={filteredStates}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = residingState === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalRowItem,
                      isSelected && styles.modalRowItemSelected,
                    ]}
                    onPress={() => {
                      if (residingState !== item) {
                        setResidingState(item);
                        setResidingCity('');
                      }
                      setStateModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        isSelected && styles.modalRowTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Text style={styles.modalRowCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* CITY PICKER BOTTOM SHEET MODAL (Screenshot 4) */}
      <Modal
        visible={cityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.bottomSheetContainer}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setCityModalVisible(false)}
          />
          <View style={styles.bottomSheetCard}>
            {/* Search Input Box (Screenshot 4) */}
            <View style={styles.sheetTopSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder={t.searchResidingCity || (isTa ? 'நகரத்தைத் தேடுக...' : 'Search residing city')}
                placeholderTextColor="#94A3B8"
                value={citySearchQuery}
                onChangeText={setCitySearchQuery}
                autoCorrect={false}
              />
              {Boolean(citySearchQuery) && (
                <TouchableOpacity onPress={() => setCitySearchQuery('')}>
                  <Text style={styles.modalSearchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Subheading Title (Screenshot 4) */}
            <View style={styles.sheetSubheadingRow}>
              <Text style={styles.sheetSubheadingTitle}>
                {t.selectYourResidentCityTitle || (isTa ? 'உங்கள் வசிக்கும் நகரத்தைத் தேர்வு செய்க' : 'Select your resident city')}
              </Text>
              <TouchableOpacity
                onPress={() => setCityModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.pickerModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* List of Cities */}
            <FlatList
              data={filteredCities}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                citySearchQuery.trim() && !filteredCities.includes(citySearchQuery.trim()) ? (
                  <TouchableOpacity
                    style={styles.customCasteItem}
                    onPress={() => {
                      setResidingCity(citySearchQuery.trim());
                      setCityModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.customCasteText}>
                      + {isTa ? 'தேர்ந்தெடுக்க:' : 'Select custom city:'} "{citySearchQuery.trim()}"
                    </Text>
                  </TouchableOpacity>
                ) : undefined
              }
              renderItem={({ item }) => {
                const isSelected = residingCity === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalRowItem,
                      isSelected && styles.modalRowItemSelected,
                    ]}
                    onPress={() => {
                      setResidingCity(item);
                      setCityModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        isSelected && styles.modalRowTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Text style={styles.modalRowCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backArrow: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginLeft: 12,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  langGlobe: {
    fontSize: 13,
    marginRight: 6,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  /* Progress Bar */
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  track: {
    flex: 1,
    height: 7,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4D0E13', // Auspicious Manamaalai Theme Burgundy
    borderRadius: 4,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    minWidth: 34,
    textAlign: 'right',
  },

  /* Scroll Body */
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /* Step 1 Content */
  stepOneContent: {
    flex: 1,
  },
  questionSection: {
    marginBottom: 26,
  },
  questionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },

  /* Pills Row */
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pillsRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  pillSelected: {
    backgroundColor: '#4D0E13', // Manamaalai Theme Colour
    borderColor: '#4D0E13',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pillRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: '#1F2937',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  pillCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pillCheckIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4D0E13',
  },
  pillText: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#1F2937',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* DOB Dropdown Row */
  dobRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dobDropdownBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  dobDropdownBtnActive: {
    borderColor: '#4D0E13',
    backgroundColor: '#FFFDF9',
  },
  dobDropdownText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  dobDropdownTextActive: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 15.5,
  },
  dropdownChevron: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '700',
  },

  /* Height Dropdown */
  heightDropdownBtn: {
    height: 54,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  heightDropdownBtnActive: {
    borderColor: '#4D0E13',
    backgroundColor: '#FFFDF9',
  },
  heightDropdownText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  heightDropdownTextActive: {
    fontSize: 15.5,
    color: '#111827',
    fontWeight: '700',
  },

  /* Primary Next Button (Image 2, 3, 4) in Manamaalai Theme */
  primaryNextBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4D0E13', // Manamaalai Theme Colour
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4D0E13',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 4,
  },
  primaryNextBtnIncomplete: {
    opacity: 0.95,
  },
  primaryNextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFDF9',
    letterSpacing: 0.3,
  },

  /* Dashed Divider Line */
  dashedLine: {
    marginVertical: 18,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },

  /* Helpline Row */
  helplineRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  helplineLabel: {
    fontSize: 14.5,
    color: '#374151',
    fontWeight: '500',
  },
  helplinePhone: {
    fontSize: 15,
    color: '#D97706', // Auspicious Temple Gold / Amber
    fontWeight: '700',
  },

  /* Step Card (Steps 2 - 5) */
  stepCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Shadows.subtle,
  },
  stepSectionHeader: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4D0E13',
    marginBottom: 6,
  },
  stepSectionSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  horizontalChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#111827',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  switchSub: {
    fontSize: 12.5,
    color: '#6B7280',
    marginTop: 2,
  },

  /* Picker Modals (Day / Month / Year) */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  pickerModalClose: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  gridContainerMonths: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  gridItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthGridItem: {
    width: '30%',
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemSelected: {
    backgroundColor: '#4D0E13',
    borderColor: '#4D0E13',
  },
  gridItemText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111827',
  },
  monthGridItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  gridItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  yearListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  yearListItemSelected: {
    backgroundColor: '#FFF7ED',
  },
  yearListItemText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  yearListItemTextSelected: {
    color: '#4D0E13',
    fontWeight: '700',
  },
  yearCheck: {
    fontSize: 16,
    color: '#4D0E13',
    fontWeight: 'bold',
  },

  /* Height Modal (Matching Image 5) */
  heightModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heightModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  heightBottomSheet: {
    height: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
  },
  heightSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  heightSheetTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#111827',
  },
  heightRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  heightRowItemSelected: {
    backgroundColor: '#FFF7ED',
  },
  heightRowText: {
    fontSize: 15.5,
    color: '#1F2937',
    fontWeight: '500',
  },
  heightRowTextSelected: {
    color: '#4D0E13',
    fontWeight: '700',
  },
  heightSelectedCheck: {
    fontSize: 16,
    color: '#4D0E13',
    fontWeight: 'bold',
  },

  /* Step 2: Religious Details Styles */
  page2SectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  notchBoxContainer: {
    marginTop: 18,
    position: 'relative',
  },
  notchBox: {
    height: 56,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  notchBoxActive: {
    borderColor: '#334155',
  },
  notchLabelWrapper: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    zIndex: 2,
  },
  notchLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  notchLabelTextActive: {
    color: '#334155',
  },
  notchValueText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
    flex: 1,
  },
  notchPlaceholderText: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  notchChevron: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 8,
  },
  subcasteInputContainer: {
    marginTop: 18,
  },
  subcasteInput: {
    height: 54,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14.5,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 1.8,
    borderColor: '#94A3B8',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  checkboxBoxChecked: {
    backgroundColor: '#4D0E13',
    borderColor: '#4D0E13',
  },
  checkboxCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: -1,
  },
  checkboxLabel: {
    fontSize: 14.5,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  doshamSection: {
    marginTop: 26,
    marginBottom: 10,
  },
  doshamTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  doshamTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionalText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '400',
  },
  doshamPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doshamPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  doshamPillSelected: {
    backgroundColor: '#4D0E13',
    borderColor: '#4D0E13',
  },
  doshamPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 5,
  },
  doshamPillTextSelected: {
    color: '#FFFFFF',
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  bottomSheetCard: {
    height: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  bottomSheetTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#111827',
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginHorizontal: 18,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  modalSearchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  modalSearchClear: {
    fontSize: 15,
    color: '#94A3B8',
    paddingHorizontal: 6,
    fontWeight: 'bold',
  },
  modalRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalRowItemSelected: {
    backgroundColor: '#FFF7ED',
  },
  modalRowText: {
    fontSize: 15.5,
    color: '#1E293B',
    fontWeight: '500',
  },
  modalRowTextSelected: {
    color: '#4D0E13',
    fontWeight: '700',
  },
  modalRowCheck: {
    fontSize: 16,
    color: '#4D0E13',
    fontWeight: 'bold',
  },
  customCasteItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  customCasteText: {
    fontSize: 15,
    color: '#4D0E13',
    fontWeight: '600',
  },

  /* Step 3: Location Details Styles */
  unselectedSelectBox: {
    height: 56,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginTop: 18,
  },
  unselectedSelectPlaceholder: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '400',
  },
  matchBanner: {
    marginTop: 24,
    backgroundColor: '#F0FAF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  matchBannerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  matchBannerSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 3,
    marginBottom: 14,
  },
  matchCardsScroll: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 12,
    minWidth: 200,
  },
  matchCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: '#E2E8F0',
  },
  matchCardDetails: {
    flex: 1,
  },
  matchCardAgeHeight: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  matchCardCommunity: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sheetTopSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 18,
    marginTop: 6,
    marginBottom: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  sheetSubheadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sheetSubheadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
});
