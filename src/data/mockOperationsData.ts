/**
 * Manamaalai Matrimony (மணமாலை) — Assisted Matchmaking & Operations Mock Data
 *
 * Provides realistic operational data across Tamil Nadu:
 * - Branches: Chennai (T. Nagar), Coimbatore (Gandhipuram), Madurai (KK Nagar), Trichy (Cantonment), Salem
 * - Senior Relationship Managers
 * - Agents & Marriage Bureaus
 * - Referral & Commission records
 * - Family Decision Circle data
 */

import {
  CommissionRecord,
  FamilyDecisionNote,
  JathagamDocument,
  MatrimonyAgent,
  MatrimonyBranch,
  RelationshipManager,
  RMHandpickedMatch,
} from '../types';

/* ─── Branches Across Tamil Nadu ───────────────────────────────────────────── */
export const MOCK_BRANCHES: MatrimonyBranch[] = [
  {
    id: 'br-chn-01',
    name: 'Chennai Central Flagship',
    city: 'Chennai',
    district: 'Chennai',
    address: '42, Venkatnarayana Road, T. Nagar, Chennai - 600017',
    phone: '+91 44 2815 9001',
    managerName: 'K. Balasubramanian, MA',
    activeAgentsCount: 24,
    registeredProfilesCount: 14200,
    successfulMarriages: 1850,
    monthlyRevenueInr: 1240000,
  },
  {
    id: 'br-cbe-02',
    name: 'Coimbatore Kongu Regional Center',
    city: 'Coimbatore',
    district: 'Coimbatore',
    address: '118, Cross Cut Road, Gandhipuram, Coimbatore - 641012',
    phone: '+91 422 249 8200',
    managerName: 'S. Shanmugam, MBA',
    activeAgentsCount: 18,
    registeredProfilesCount: 9800,
    successfulMarriages: 1420,
    monthlyRevenueInr: 890000,
  },
  {
    id: 'br-mdu-03',
    name: 'Madurai Pandiya Mandalam Hub',
    city: 'Madurai',
    district: 'Madurai',
    address: '75, 80 Feet Road, KK Nagar, Madurai - 625020',
    phone: '+91 452 258 4100',
    managerName: 'R. Meenakshisundaram',
    activeAgentsCount: 14,
    registeredProfilesCount: 8100,
    successfulMarriages: 1100,
    monthlyRevenueInr: 680000,
  },
  {
    id: 'br-try-04',
    name: 'Tiruchirappalli Delta Branch',
    city: 'Tiruchirappalli',
    district: 'Tiruchirappalli',
    address: '22, Williams Road, Cantonment, Trichy - 620001',
    phone: '+91 431 241 7300',
    managerName: 'V. Senthil Nathan',
    activeAgentsCount: 11,
    registeredProfilesCount: 6400,
    successfulMarriages: 860,
    monthlyRevenueInr: 510000,
  },
  {
    id: 'br-slm-05',
    name: 'Salem West Regional Office',
    city: 'Salem',
    district: 'Salem',
    address: '88, Saradha College Road, Fairlands, Salem - 636016',
    phone: '+91 427 233 4500',
    managerName: 'P. Ravichandran',
    activeAgentsCount: 9,
    registeredProfilesCount: 4900,
    successfulMarriages: 620,
    monthlyRevenueInr: 390000,
  },
];

/* ─── Assigned Relationship Managers ───────────────────────────────────────── */
export const MOCK_RELATIONSHIP_MANAGERS: RelationshipManager[] = [
  {
    id: 'rm-01',
    name: 'Smt. Meenakshi Ramanathan',
    role: 'Senior Relationship Manager (Elite Assisted)',
    branch: 'Chennai Central Flagship',
    phone: '+91 98401 23456',
    whatsapp: '+91 98401 23456',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    experienceYears: 12,
    specialization: 'Iyer, Iyengar & Chettiar Community Matrimony',
    activeClientsCount: 28,
    successfulMarriagesCount: 340,
  },
  {
    id: 'rm-02',
    name: 'Thiru. K. Anandha Kumar',
    role: 'Relationship Advisor (Kongu & Western TN)',
    branch: 'Coimbatore Kongu Regional Center',
    phone: '+91 94432 78901',
    whatsapp: '+91 94432 78901',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    rating: 4.8,
    experienceYears: 9,
    specialization: 'Kongu Vellalar & Mudaliar Assisted Matchmaking',
    activeClientsCount: 24,
    successfulMarriagesCount: 220,
  },
];

/* ─── RM Handpicked Varans for Member ──────────────────────────────────────── */
export const MOCK_RM_HANDPICKED_MATCHES: RMHandpickedMatch[] = [
  {
    id: 'rm-match-01',
    profileId: 'mm-b-01',
    candidateName: 'Dr. Soundarya Natarajan, MD',
    candidatePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    candidateAge: 27,
    candidateCity: 'Chennai',
    candidateProfession: 'Consultant Dermatologist • Apollo Hospitals',
    matchScore: 94,
    curatedAt: 'Today, 11:30 AM',
    rmNotes:
      'Spoke with Soundarya\'s father (Retd. TNEB Chief Engineer). Both families share similar cultural values. 10-Porutham compatibility is 8.5/10 (Uthama). Father is welcoming of an introduction call.',
    status: 'intro_call_scheduled',
    scheduledDate: 'Sunday, 4:00 PM (Family Call)',
  },
  {
    id: 'rm-match-02',
    profileId: 'mm-b-02',
    candidateName: 'Deepa Muthukumar, B.Tech, MS',
    candidatePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    candidateAge: 26,
    candidateCity: 'Coimbatore',
    candidateProfession: 'Senior Data Scientist • Target Labs',
    matchScore: 89,
    curatedAt: 'Yesterday',
    rmNotes:
      'High educational synergy. Native of Pollachi, family is well-settled. Horoscopes matched thoroughly by our senior astrologer with zero doshams.',
    status: 'horoscope_exchanged',
  },
  {
    id: 'rm-match-03',
    profileId: 'mm-b-04',
    candidateName: 'Ananya Sridharan, CA',
    candidatePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    candidateAge: 25,
    candidateCity: 'Chennai',
    candidateProfession: 'Senior Financial Analyst • Ernst & Young',
    matchScore: 91,
    curatedAt: '2 days ago',
    rmNotes:
      'Both families have expressed interest in arranging a direct meeting at Kapaleeshwarar Temple premises.',
    status: 'temple_meeting_fixed',
    scheduledDate: 'Next Saturday, 10:30 AM (Mylapore Temple)',
  },
];

/* ─── Active Agents & Marriage Bureaus ─────────────────────────────────────── */
export const MOCK_AGENTS: MatrimonyAgent[] = [
  {
    id: 'ag-01',
    agentCode: 'MMA-CHN-101',
    name: 'Sri Ganapathy Matrimonial Services',
    phone: '+91 98410 44221',
    email: 'ganapathy.matrimony@gmail.com',
    branchId: 'br-chn-01',
    branchName: 'Chennai Central Flagship',
    territory: 'Mylapore, Mandaveli & Alwarpet',
    totalProfilesEnrolled: 312,
    activeConversions: 84,
    totalCommissionEarned: 168000,
    pendingPayout: 24000,
    status: 'active',
    rating: 4.9,
  },
  {
    id: 'ag-02',
    agentCode: 'MMA-CBE-204',
    name: 'Marutham Kalyana Sevai Bureau',
    phone: '+91 94431 55667',
    email: 'marutham.kalyanam@gmail.com',
    branchId: 'br-cbe-02',
    branchName: 'Coimbatore Kongu Regional Center',
    territory: 'RS Puram & Saibaba Colony',
    totalProfilesEnrolled: 245,
    activeConversions: 62,
    totalCommissionEarned: 124000,
    pendingPayout: 18000,
    status: 'active',
    rating: 4.8,
  },
  {
    id: 'ag-03',
    agentCode: 'MMA-MDU-310',
    name: 'Sri Meenakshi Subha Muhurtham',
    phone: '+91 98940 33441',
    email: 'meenakshi.subham@gmail.com',
    branchId: 'br-mdu-03',
    branchName: 'Madurai Pandiya Mandalam Hub',
    territory: 'Anna Nagar, Melur & Teppakulam',
    totalProfilesEnrolled: 188,
    activeConversions: 46,
    totalCommissionEarned: 92000,
    pendingPayout: 14000,
    status: 'active',
    rating: 4.7,
  },
  {
    id: 'ag-04',
    agentCode: 'MMA-TRY-402',
    name: 'Cauvery Wedding Consultancy',
    phone: '+91 94860 11223',
    email: 'cauvery.weddings@gmail.com',
    branchId: 'br-try-04',
    branchName: 'Tiruchirappalli Delta Branch',
    territory: 'Thillai Nagar & Srirangam',
    totalProfilesEnrolled: 140,
    activeConversions: 35,
    totalCommissionEarned: 70000,
    pendingPayout: 10000,
    status: 'active',
    rating: 4.6,
  },
];

/* ─── Referral and Commission Records ──────────────────────────────────────── */
export const MOCK_COMMISSION_RECORDS: CommissionRecord[] = [
  {
    id: 'com-01',
    agentCode: 'MMA-CHN-101',
    clientProfileId: 'mm-b-01',
    clientName: 'Dr. Soundarya Natarajan',
    planName: 'Platinum Manamaalai VIP',
    planAmount: 8999,
    commissionRate: 20,
    commissionAmount: 1800,
    date: '2026-10-26',
    status: 'paid',
    paymentReference: 'UPI-MM-948123910',
  },
  {
    id: 'com-02',
    agentCode: 'MMA-CHN-101',
    clientProfileId: 'mm-g-01',
    clientName: 'Karthik Senthilnathan',
    planName: 'Gold Maangalyam',
    planAmount: 4999,
    commissionRate: 20,
    commissionAmount: 1000,
    date: '2026-10-24',
    status: 'paid',
    paymentReference: 'UPI-MM-847291048',
  },
  {
    id: 'com-03',
    agentCode: 'MMA-CBE-204',
    clientProfileId: 'mm-b-02',
    clientName: 'Deepa Muthukumar',
    planName: 'Gold Maangalyam',
    planAmount: 4999,
    commissionRate: 20,
    commissionAmount: 1000,
    date: '2026-10-28',
    status: 'processing',
    paymentReference: 'NEFT-PENDING-041',
  },
  {
    id: 'com-04',
    agentCode: 'MMA-MDU-310',
    clientProfileId: 'mm-g-03',
    clientName: 'Vigneshwaran S',
    planName: 'Silver Kalyanam',
    planAmount: 2499,
    commissionRate: 20,
    commissionAmount: 500,
    date: '2026-10-29',
    status: 'pending',
  },
];

/* ─── Family Decision Circle Notes ─────────────────────────────────────────── */
export const MOCK_FAMILY_NOTES: FamilyDecisionNote[] = [
  {
    id: 'fn-01',
    profileId: 'mm-b-01',
    authorRole: 'Father',
    authorName: 'Senthilnathan (Appa)',
    status: 'approved',
    noteText:
      'Very respectable family. Father retired as TNEB Chief Engineer in Thanjavur. Horoscope match is Uthama (8.5/10). Approved to initiate talks.',
    createdAt: 'Today, 09:15 AM',
  },
  {
    id: 'fn-02',
    profileId: 'mm-b-01',
    authorRole: 'Mother',
    authorName: 'Meenakshi (Amma)',
    status: 'temple_meeting_fixed',
    noteText:
      'Spoke warmly with Soundarya\'s mother. They suggested meeting at Mylapore temple this Sunday.',
    createdAt: 'Today, 11:45 AM',
  },
  {
    id: 'fn-03',
    profileId: 'mm-b-02',
    authorRole: 'Brother',
    authorName: 'Praveen Senthil',
    status: 'under_review',
    noteText:
      'Checked LinkedIn and mutual college alumni. Good reputation in Coimbatore tech circle.',
    createdAt: 'Yesterday, 06:30 PM',
  },
];

/* ─── Jathagam Document Preset (Sample Chart) ─────────────────────────────── */
export const MOCK_JATHAGAM_DOCUMENT: JathagamDocument = {
  id: 'jath-doc-01',
  fileName: 'Karthik_Senthilnathan_Jathagam_Original.pdf',
  fileType: 'pdf',
  uploadDate: '2024-03-01',
  fileSize: '1.8 MB',
  verifiedByAstrologer: true,
  astrologerName: 'Brahmashri Narayana Sastrigal (Chief Astrologer)',
  astrologerNotes:
    'Suddha Jathagam with Guru Paarthal (Jupiter Aspect). Sukra and Budha in 10th house indicating prosperous career. Chevvai Dosham is absent.',
  lagnam: 'Thulam (துலாம்)',
  dhasaBalance: 'Raghu Dhasa 4 Years, 2 Months, 18 Days remaining at birth',
  rasiChart: {
    '1': ['Lagnam', 'Guru'],
    '4': ['Chandran'],
    '7': ['Sani'],
    '9': ['Sooriyan', 'Sevvai'],
    '10': ['Budhan', 'Sukran'],
    '11': ['Kethu'],
    '5': ['Raghu'],
  },
  navamsamChart: {
    '1': ['Lagnam'],
    '3': ['Guru'],
    '5': ['Sukran'],
    '7': ['Sooriyan'],
    '9': ['Chandran'],
    '10': ['Budhan'],
  },
};

