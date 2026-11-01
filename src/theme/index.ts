import { Platform } from 'react-native';

export const Colors = {
  // Official Manamaalai Wedding Palette:
  // Plum Burgundy: #49141C | Lime Olive: #93A220 | Dusty Rose: #D17575 | Vanilla: #FFFBE2
  // NOTE: App backgrounds are pure white per latest direction. `vanilla` now resolves to
  // white and is used for backgrounds AND for light text on plum/olive buttons.
  vanilla: '#FFFFFF',
  vanillaTint: '#FFFBE2',     // Original brand vanilla (use only for rare decorative accents)
  plumBurgundy: '#49141C',
  limeOlive: '#93A220',
  dustyRose: '#D17575',

  // Core Theme Aliases
  creme: '#FFFFFF',           // White background
  sand: '#E6E2CF',            // Soft neutral border / subtle container
  dustyPink: '#D17575',       // Dusty Rose accent
  burgundy: '#49141C',        // Plum Burgundy primary brand

  // Tinted & Shaded Luxury Variants
  cremeLight: '#FFFFFF',      // White card surface
  cremeDark: '#F6F5F0',       // Slightly deeper neutral
  sandLight: '#F7F6F1',       // Soft neutral input/chip background
  sandDark: '#D9D5BF',        // Neutral sand border
  dustyPinkLight: '#FBF0F0',  // Soft rose silk
  dustyPinkDark: '#A65252',   // Deeper dusty rose
  burgundyLight: '#631E27',   // Lighter plum burgundy
  burgundyDark: '#350C12',    // Deep plum burgundy
  burgundySoft: '#541922',    // Velvet plum burgundy

  // Canonical Semantic Mappings
  bgMain: '#FFFFFF',          // White background throughout app
  cardBg: '#FFFFFF',          // Crisp floating card surface
  cardSurface: '#FFFFFF',     // Elevated secondary card surface
  inputBg: '#F7F6F1',         // Clean neutral input background
  border: '#E6E2CF',          // Soft neutral border
  borderLight: '#EEEBDD',     // Whisper-soft divider

  // Text Hierarchy (High-contrast, dark readable text)
  textPrimary: '#231215',     // Deepest readable plum-black
  textSecondary: '#523E42',   // Warm secondary reading text
  textMuted: '#7E6C70',       // Balanced metadata text
  textLight: '#FFFFFF',       // White text for dark buttons
  textBurgundy: '#49141C',    // Plum Burgundy text
  textDustyPink: '#B84F4F',   // Dusty Rose accent text
  textGold: '#6A7513',        // Dark readable Lime Olive text

  // Matrimonial Accents & Badges
  limeOliveLight: '#F4F6D8',  // Soft lime olive aura surface
  limeOliveDark: '#6A7513',   // High-contrast lime olive
  goldAccent: '#93A220',      // Lime Olive for highlights, badges & selected states
  goldLight: '#F4F6D8',       // Light lime olive highlight
  verifiedBlue: '#6A7513',    // Verified badge in Lime Olive trust shade
  verifiedBg: '#F4F6D8',      // Soft lime olive badge surface
  terracotta: '#D17575',      // Dusty Rose secondary accent
  whatsappGreen: '#25D366',   // WhatsApp direct contact
  phoneAmber: '#93A220',      // Lime Olive interactive phone
  onlineGreen: '#758A18',     // Auspicious online lime green

  // Semantic Feedback
  success: '#758A18',
  successLight: '#F4F7DA',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#D17575',
  dangerLight: '#FBF0F0',
  info: '#49141C',
  infoLight: '#F4F6D8',

  // Overlays
  overlayDark: 'rgba(35, 12, 18, 0.72)',
  overlayCard: 'rgba(255, 255, 255, 0.98)',
  scrimGradient: 'rgba(35, 12, 18, 0.88)',

  // Chips & Badges
  chipPink: '#FBF0F0',
  chipPinkText: '#B84F4F',
  chipBlue: '#F4F6D8',
  chipBlueText: '#6A7513',
  chipYellow: '#F8F3CE',
  chipYellowText: '#6A7513',
  chipPurple: '#F6EFF1',
  chipPurpleText: '#49141C',

  // Backward-compatibility Aliases
  paletteDarkEspresso: '#231215',
  paletteBerryBurgundy: '#49141C',
  paletteSandstone: '#E6E2CF',
  paletteCream: '#FFFFFF',
  stylistCoral: '#D17575',
  stylistCoralLight: '#FBF0F0',
  stylistCoralDark: '#49141C',
  stylistDark: '#231215',
  stylistDarkLight: '#49141C',
  stylistBg: '#FFFFFF',
  stylistCard: '#FFFFFF',
  stylistCardSoft: '#FFFFFF',
  stylistCompatibilityBg: '#F4F6D8',
  stylistTextPrimary: '#231215',
  stylistTextSecondary: '#523E42',
  stylistTextMuted: '#7E6C70',
  manamaalaiCreme: '#FFFFFF',
  manamaalaiSand: '#E6E2CF',
  manamaalaiDustyPink: '#D17575',
  manamaalaiBurgundy: '#49141C',
  manamaalaiTerracotta: '#D17575',
  manamaalaiVerifiedBlue: '#6A7513',
  manamaalaiPhoneAmber: '#93A220',
  manamaalaiWhatsappGreen: '#25D366',
  maroon: '#49141C',
  maroonDark: '#350C12',
  gold: '#93A220',
  goldDark: '#6A7513',
  borderGold: '#D8E07A',
  premiumGold: '#93A220',
  royalRed: '#49141C',
  ivoryBg: '#FFFFFF',
  ivoryCard: '#FFFFFF',
  ivoryMuted: '#F7F6F1',
  bloomyPorcelain: '#FFFFFF',
  bloomyPeach: '#F7F6F1',
  bloomyRose: '#D17575',
  bloomyMauve: '#FBF0F0',
  bloomyLilac: '#49141C',
  bloomyLilacLight: '#F4F6D8',
  bloomyLilacDark: '#350C12',
  bloomyPlum: '#49141C',
  bloomyCedar: '#631E27',
  bloomyTaupe: '#E6E2CF',
  bloomyEspresso: '#231215',
  bloomyDark: '#231215',
  purelyRed: '#49141C',
  purelyDark: '#231215',
  purelyPass: '#523E42',
  purelyBg: '#FFFFFF',
  purelySand: '#E6E2CF',
  purelyGray: '#D9D5BF',
  purelyGrayLight: '#F7F6F1',
  verifiedBadge: '#6A7513',
  premiumBadge: '#93A220',
  premiumBg: '#F4F6D8',
};

export const MatrimonyTheme = {
  creme: '#FFFFFF',
  sand: '#E6E2CF',
  dustyPink: '#D17575',
  burgundy: '#49141C',
  limeOlive: '#93A220',
  vanilla: '#FFFFFF',
  plumBurgundy: '#49141C',
  dustyRose: '#D17575',
  burgundyDark: '#350C12',
  burgundyLight: '#631E27',
  cremeCard: '#FFFFFF',
  inputBg: '#F7F6F1',
  textBurgundy: '#49141C',
  textMuted: '#7E6C70',
  textSecondary: '#523E42',
  borderSand: '#E6E2CF',
  lotusPink: '#D17575',
  antiqueGold: '#93A220',
  ivory: '#FFFFFF',
  cardIvory: '#FFFFFF',
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
  fontCalligraphy: Platform.select({ ios: 'GreatVibes-Regular', android: 'GreatVibes-Regular' }) || 'cursive',
  fontBrushScript: Platform.select({ ios: 'AlexBrush-Regular', android: 'AlexBrush-Regular' }) || 'cursive',

  titleHero: 24,
  titleXLarge: 20,
  titleLarge: 17,
  titleMedium: 15,
  bodyLarge: 14,
  bodyRegular: 13,
  bodySmall: 11.5,
  caption: 10.5,
  tiny: 9,
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
    shadowColor: '#350C12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  card: {
    shadowColor: '#350C12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  cardHover: {
    shadowColor: '#350C12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#350C12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
};
