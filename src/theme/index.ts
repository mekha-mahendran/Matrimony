import { Platform } from 'react-native';

export const Colors = {
  // Royal Midnight Sapphire & Auspicious Sun Gold Design System
  creme: '#F8FAFC',           // Crisp Diamond Porcelain background
  sand: '#E2E8F0',            // Clean Platinum silver border
  dustyPink: '#F43F5E',       // Vibrant Rose accent
  burgundy: '#0B192C',        // Imperial Midnight Sapphire (Primary brand)

  // Tinted & Shaded Luxury Variants
  cremeLight: '#FFFFFF',      // Pure crisp white card surface
  cremeDark: '#F1F5F9',       // Clean slate pearl tone
  sandLight: '#F1F5F9',       // Modern slate surface for inputs & chips
  sandDark: '#CBD5E1',        // Brushed platinum for borders
  dustyPinkLight: '#FFF1F2',  // Ultra-soft rose silk
  dustyPinkDark: '#9F1239',   // Deep royal rose
  burgundyLight: '#1E3E62',   // Vivid royal sapphire blue
  burgundyDark: '#060E1A',    // Deep obsidian sapphire for header & nav dock
  burgundySoft: '#162E4D',    // Velvet midnight sapphire

  // Canonical Semantic Mappings
  bgMain: '#F8FAFC',          // Main luxury crisp background
  cardBg: '#FFFFFF',          // Crisp floating card surface
  cardSurface: '#F8FAFC',     // Elevated secondary card surface
  inputBg: '#F1F5F9',         // Clean slate input background
  border: '#E2E8F0',          // Subtle modern border
  borderLight: '#F1F5F9',     // Whisper-soft divider

  // Text Hierarchy
  textPrimary: '#0F172A',     // Slate 900 for ultra-crisp modern reading
  textSecondary: '#334155',   // Slate 700 secondary text
  textMuted: '#64748B',       // Slate 500 metadata
  textLight: '#FFFFFF',       // Clean inverted white
  textBurgundy: '#0B192C',    // Imperial Sapphire text
  textDustyPink: '#E11D48',   // Vibrant Rose accent text
  textGold: '#D97706',        // Rich sun gold text

  // Matrimonial Accents & Badges
  goldAccent: '#F59E0B',      // Radiant Auspicious Sun Gold
  goldLight: '#FEF3C7',       // Warm golden aura surface
  verifiedBlue: '#2563EB',    // Official verification royal blue
  verifiedBg: '#EFF6FF',      // Soft blue trust badge surface
  terracotta: '#E11D48',      // Vibrant Auspicious Kumkum Crimson for CTAs
  whatsappGreen: '#10B981',   // WhatsApp direct contact
  phoneAmber: '#F59E0B',      // Call button amber
  onlineGreen: '#10B981',     // Auspicious online jade green

  // Semantic Feedback
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  info: '#0B192C',
  infoLight: '#EFF6FF',

  // Overlays
  overlayDark: 'rgba(6, 14, 26, 0.72)',
  overlayCard: 'rgba(255, 255, 255, 0.98)',
  scrimGradient: 'rgba(6, 14, 26, 0.88)',

  // Chips & Badges
  chipPink: '#FFF1F2',
  chipPinkText: '#E11D48',
  chipBlue: '#EFF6FF',
  chipBlueText: '#2563EB',
  chipYellow: '#FEF3C7',
  chipYellowText: '#D97706',
  chipPurple: '#F5F3FF',
  chipPurpleText: '#7C3AED',

  // Backward-compatibility Aliases
  paletteDarkEspresso: '#060E1A',
  paletteBerryBurgundy: '#0B192C',
  paletteSandstone: '#E2E8F0',
  paletteCream: '#F8FAFC',
  stylistCoral: '#E11D48',
  stylistCoralLight: '#FFF1F2',
  stylistCoralDark: '#060E1A',
  stylistDark: '#060E1A',
  stylistDarkLight: '#0B192C',
  stylistBg: '#F8FAFC',
  stylistCard: '#FFFFFF',
  stylistCardSoft: '#F8FAFC',
  stylistCompatibilityBg: '#FEF3C7',
  stylistTextPrimary: '#0F172A',
  stylistTextSecondary: '#334155',
  stylistTextMuted: '#64748B',
  manamaalaiCreme: '#F8FAFC',
  manamaalaiSand: '#E2E8F0',
  manamaalaiDustyPink: '#F43F5E',
  manamaalaiBurgundy: '#0B192C',
  manamaalaiTerracotta: '#E11D48',
  manamaalaiVerifiedBlue: '#2563EB',
  manamaalaiPhoneAmber: '#F59E0B',
  manamaalaiWhatsappGreen: '#10B981',
  maroon: '#0B192C',
  maroonDark: '#060E1A',
  gold: '#F59E0B',
  goldDark: '#D97706',
  borderGold: '#E2E8F0',
  premiumGold: '#F59E0B',
  royalRed: '#E11D48',
  ivoryBg: '#F8FAFC',
  ivoryCard: '#FFFFFF',
  ivoryMuted: '#F1F5F9',
  bloomyPorcelain: '#F8FAFC',
  bloomyPeach: '#F1F5F9',
  bloomyRose: '#0B192C',
  bloomyMauve: '#FFF1F2',
  bloomyLilac: '#0B192C',
  bloomyLilacLight: '#EFF6FF',
  bloomyLilacDark: '#060E1A',
  bloomyPlum: '#060E1A',
  bloomyCedar: '#1E3E62',
  bloomyTaupe: '#E2E8F0',
  bloomyEspresso: '#334155',
  bloomyDark: '#060E1A',
  purelyRed: '#E11D48',
  purelyDark: '#060E1A',
  purelyPass: '#334155',
  purelyBg: '#F8FAFC',
  purelySand: '#E2E8F0',
  purelyGray: '#CBD5E1',
  purelyGrayLight: '#F1F5F9',
  verifiedBadge: '#2563EB',
  premiumBadge: '#F59E0B',
  premiumBg: '#FEF3C7',
};

export const MatrimonyTheme = {
  creme: '#EEE4DA',
  sand: '#D8C4AC',
  dustyPink: '#C8A49F',
  burgundy: '#4D0E13',
  burgundyDark: '#3A0A0E',
  burgundyLight: '#6B1B22',
  cremeCard: '#F7F2EC',
  inputBg: '#F5ECE3',
  textBurgundy: '#4D0E13',
  textMuted: '#7D685E',
  textSecondary: '#6E5A50',
  borderSand: '#D8C4AC',
  lotusPink: '#C8A49F',
  antiqueGold: '#B08A4F',
  ivory: '#FFFDF9',
  cardIvory: '#FFFCF7',
};


export const Typography = {
  fontSerif: Platform.select({ ios: 'Georgia', android: 'serif' }) || 'serif',
  fontSans: Platform.select({ ios: 'System', android: 'sans-serif' }) || 'System',

  // Custom typography
  fontCormorant: Platform.select({ ios: 'Cormorant Garamond', android: 'CormorantGaramond-Regular' }) || 'serif',
  fontPoppins: Platform.select({ ios: 'Poppins-Regular', android: 'Poppins-Regular' }) || 'sans-serif',
  fontPoppinsMedium: Platform.select({ ios: 'Poppins-Medium', android: 'Poppins-Medium' }) || 'sans-serif',
  fontPoppinsSemiBold: Platform.select({ ios: 'Poppins-SemiBold', android: 'Poppins-SemiBold' }) || 'sans-serif',
  fontNotoSerifTamil: Platform.select({ ios: 'Noto Serif Tamil', android: 'NotoSerifTamil-Regular' }) || 'serif',
  fontNotoSansTamil: Platform.select({ ios: 'Noto Sans Tamil', android: 'NotoSansTamil-Regular' }) || 'sans-serif',

  titleHero: 28,
  titleXLarge: 23,
  titleLarge: 19,
  titleMedium: 17,
  bodyLarge: 15,
  bodyRegular: 13.5,
  bodySmall: 12,
  caption: 11,
  tiny: 9.5,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const Shadows = {
  editorial: {
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  card: {
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 4,
  },
  cardHover: {
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#0B192C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
};
