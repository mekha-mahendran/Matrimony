import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

interface IconProps {
  size?: number;
}

// 1. Kolam: Intricate symmetrical auspicious Tamil rice flour loop pattern
export const KolamIllustration: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#B08A4F" />
        <Stop offset="50%" stopColor="#D8C4AC" />
        <Stop offset="100%" stopColor="#B08A4F" />
      </LinearGradient>
    </Defs>
    {/* Outer ornamental border */}
    <Circle cx="50" cy="50" r="44" stroke="#D8C4AC" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
    <Circle cx="50" cy="50" r="38" stroke="#B08A4F" strokeWidth="1" fill="none" opacity={0.6} />

    {/* Symmetrical flower loops */}
    <Path
      d="M50,14 C62,28 72,38 86,50 C72,62 62,72 50,86 C38,72 28,62 14,50 C28,38 38,28 50,14 Z"
      fill="none"
      stroke="#B08A4F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M50,22 C58,34 66,42 78,50 C66,58 58,66 50,78 C42,66 34,58 22,50 C34,42 42,34 50,22 Z"
      fill="none"
      stroke="#C8A49F"
      strokeWidth="1.5"
    />

    {/* Diagonal Petals */}
    <Path
      d="M26,26 C38,36 44,42 50,50 C44,58 38,64 26,74"
      fill="none"
      stroke="#B08A4F"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M74,26 C62,36 56,42 50,50 C56,58 62,64 74,74"
      fill="none"
      stroke="#B08A4F"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Central Bindu & Auspicious Dots */}
    <Circle cx="50" cy="50" r="4.5" fill="#4D0E13" />
    <Circle cx="50" cy="50" r="2" fill="#B08A4F" />

    {/* Cardinal Dots */}
    <Circle cx="50" cy="30" r="2.5" fill="#B08A4F" />
    <Circle cx="50" cy="70" r="2.5" fill="#B08A4F" />
    <Circle cx="30" cy="50" r="2.5" fill="#B08A4F" />
    <Circle cx="70" cy="50" r="2.5" fill="#B08A4F" />

    {/* Diagonal Dots */}
    <Circle cx="36" cy="36" r="2" fill="#C8A49F" />
    <Circle cx="64" cy="36" r="2" fill="#C8A49F" />
    <Circle cx="36" cy="64" r="2" fill="#C8A49F" />
    <Circle cx="64" cy="64" r="2" fill="#C8A49F" />
  </Svg>
);

// 2. Jasmine (Malli Poo): Delicate fragrant jasmine buds & blooms strung together
export const JasmineIllustration: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="budGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#FFFDF9" />
        <Stop offset="70%" stopColor="#EEE4DA" />
        <Stop offset="100%" stopColor="#D8C4AC" />
      </LinearGradient>
      <LinearGradient id="sepalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#B08A4F" />
        <Stop offset="100%" stopColor="#7D685E" />
      </LinearGradient>
    </Defs>
    {/* Strung thread */}
    <Path d="M12,48 Q32,54 50,48 T88,48" stroke="#D8C4AC" strokeWidth="2" fill="none" strokeDasharray="3,2" />

    {/* Center full flower bloom */}
    <G transform="translate(50, 48)">
      {/* 5 Petals */}
      <Path d="M0,0 C-5,-16 5,-16 0,-22 C-5,-16 -1,-8 0,0" fill="url(#budGrad)" stroke="#B08A4F" strokeWidth="1" />
      <Path d="M0,0 C12,-12 18,-4 22,-8 C16,-2 8,0 0,0" fill="url(#budGrad)" stroke="#B08A4F" strokeWidth="1" />
      <Path d="M0,0 C16,5 16,14 20,18 C12,14 4,6 0,0" fill="url(#budGrad)" stroke="#B08A4F" strokeWidth="1" />
      <Path d="M0,0 C-4,14 -12,14 -16,20 C-14,12 -6,4 0,0" fill="url(#budGrad)" stroke="#B08A4F" strokeWidth="1" />
      <Path d="M0,0 C-14,-2 -16,-10 -22,-6 C-14,-2 -6,2 0,0" fill="url(#budGrad)" stroke="#B08A4F" strokeWidth="1" />
      {/* Yellow/Gold core */}
      <Circle cx="0" cy="0" r="4.5" fill="#B08A4F" />
      <Circle cx="0" cy="0" r="2.5" fill="#FFFDF9" />
    </G>

    {/* Left Jasmine Bud */}
    <G transform="translate(26, 44)">
      <Path d="M-6,8 C-4,-4 0,-14 2,-18 C4,-14 6,-4 8,8 Z" fill="url(#budGrad)" stroke="#B08A4F" strokeWidth="0.8" />
      <Path d="M-4,8 C-2,14 6,14 8,8" fill="url(#sepalGrad)" />
      <Circle cx="1" cy="-6" r="1.5" fill="#B08A4F" />
    </G>

    {/* Right Jasmine Bud */}
    <G transform="translate(74, 44)">
      <Path d="M-6,8 C-4,-4 0,-14 2,-18 C4,-14 6,-4 8,8 Z" fill="url(#budGrad)" stroke="#B08A4F" strokeWidth="0.8" />
      <Path d="M-4,8 C-2,14 6,14 8,8" fill="url(#sepalGrad)" />
      <Circle cx="1" cy="-6" r="1.5" fill="#B08A4F" />
    </G>

    {/* Auspicious Kumkum Dots */}
    <Circle cx="50" cy="80" r="3" fill="#4D0E13" />
    <Circle cx="32" cy="76" r="2" fill="#C8A49F" />
    <Circle cx="68" cy="76" r="2" fill="#C8A49F" />
  </Svg>
);

// 3. Temple Arch (Thorana Vaayil / Gopuram Gateway): Majestic Dravidian wedding mandapam entrance
export const TempleArchIllustration: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="archGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#B08A4F" />
        <Stop offset="100%" stopColor="#4D0E13" />
      </LinearGradient>
    </Defs>
    {/* Base Pedestal */}
    <Rect x="14" y="82" width="72" height="6" rx="2" fill="#B08A4F" />
    <Rect x="18" y="78" width="64" height="4" fill="#D8C4AC" />

    {/* Left Pillar */}
    <Rect x="22" y="38" width="8" height="40" fill="#B08A4F" />
    <Path d="M20,38 L32,38 L30,42 L22,42 Z" fill="#4D0E13" />
    <Path d="M20,74 L32,74 L30,78 L22,78 Z" fill="#4D0E13" />

    {/* Right Pillar */}
    <Rect x="70" y="38" width="8" height="40" fill="#B08A4F" />
    <Path d="M68,38 L80,38 L78,42 L70,42 Z" fill="#4D0E13" />
    <Path d="M68,74 L80,74 L78,78 L70,78 Z" fill="#4D0E13" />

    {/* Sculpted Arch Curves */}
    <Path
      d="M26,38 C26,20 74,20 74,38"
      stroke="#B08A4F"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M32,38 C32,26 68,26 68,38"
      stroke="#C8A49F"
      strokeWidth="2"
      fill="none"
    />

    {/* Top Kalasams atop the arch */}
    <G transform="translate(50, 16)">
      <Circle cx="0" cy="0" r="5" fill="#B08A4F" />
      <Path d="M-2,0 L0,-6 L2,0 Z" fill="#B08A4F" />
    </G>
    <G transform="translate(36, 20)">
      <Circle cx="0" cy="0" r="3.5" fill="#B08A4F" />
      <Path d="M-1.5,0 L0,-4 L1.5,0 Z" fill="#B08A4F" />
    </G>
    <G transform="translate(64, 20)">
      <Circle cx="0" cy="0" r="3.5" fill="#B08A4F" />
      <Path d="M-1.5,0 L0,-4 L1.5,0 Z" fill="#B08A4F" />
    </G>

    {/* Center Hanging Bell/Thoranam */}
    <Path d="M50,24 L50,40" stroke="#B08A4F" strokeWidth="1.5" />
    <Path d="M46,40 C46,40 50,46 54,40 Z" fill="#4D0E13" />
    <Circle cx="50" cy="47" r="1.5" fill="#B08A4F" />
  </Svg>
);

// 4. Kuthuvilakku Lamp: Auspicious 5-wick traditional brass lamp with radiant flame
export const KuthuvilakkuIllustration: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="lampFlame" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#4D0E13" />
        <Stop offset="30%" stopColor="#B08A4F" />
        <Stop offset="70%" stopColor="#D8C4AC" />
        <Stop offset="100%" stopColor="#FFFDF9" />
      </LinearGradient>
      <LinearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#B08A4F" />
        <Stop offset="50%" stopColor="#EEE4DA" />
        <Stop offset="100%" stopColor="#B08A4F" />
      </LinearGradient>
    </Defs>
    {/* Base Pedestal (Aasanam) */}
    <Path d="M28,86 C36,82 64,82 72,86 L74,88 L26,88 Z" fill="#B08A4F" />
    <Circle cx="50" cy="80" r="6" fill="#B08A4F" />

    {/* Slender Fluted Stem */}
    <Path d="M48,80 L48,46 L52,46 L52,80 Z" fill="url(#brassGrad)" />
    <Circle cx="50" cy="62" r="4" fill="#B08A4F" />

    {/* Oil Bowl (Thattu with 5 wick troughs) */}
    <Path
      d="M24,46 C32,52 68,52 76,46 C72,42 28,42 24,46 Z"
      fill="url(#brassGrad)"
      stroke="#B08A4F"
      strokeWidth="1.2"
    />

    {/* Center Top Pinnacle (Annam bird / crown finial) */}
    <Path d="M47,42 L50,30 L53,42 Z" fill="#B08A4F" />
    <Circle cx="50" cy="28" r="4.5" fill="#B08A4F" />
    <Path d="M48,24 L50,18 L52,24 Z" fill="#B08A4F" />

    {/* Flames on wicks */}
    {/* Center Top Flame */}
    <Path
      d="M50,18 C47,12 47,8 50,4 C53,8 53,12 50,18 Z"
      fill="url(#lampFlame)"
    />
    {/* Left Wick Flame */}
    <Path
      d="M26,44 C22,39 23,35 25,31 C28,35 29,39 26,44 Z"
      fill="url(#lampFlame)"
    />
    {/* Right Wick Flame */}
    <Path
      d="M74,44 C77,39 76,35 74,31 C71,35 70,39 74,44 Z"
      fill="url(#lampFlame)"
    />

    {/* Aura rays */}
    <Circle cx="50" cy="11" r="9" stroke="#C8A49F" strokeWidth="0.8" strokeDasharray="2,2" fill="none" opacity={0.6} />
  </Svg>
);

// 5. Kalasam: Auspicious Kumbham with coconut, mango leaves, and sacred threads
export const KalasamIllustration: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#B08A4F" />
        <Stop offset="30%" stopColor="#EEE4DA" />
        <Stop offset="70%" stopColor="#D8C4AC" />
        <Stop offset="100%" stopColor="#B08A4F" />
      </LinearGradient>
    </Defs>
    {/* Pot Base */}
    <Rect x="36" y="82" width="28" height="4" rx="2" fill="#B08A4F" />

    {/* Kalasa Pot Body */}
    <Path
      d="M34,82 C22,76 22,54 36,46 L64,46 C78,54 78,76 66,82 Z"
      fill="url(#potGrad)"
      stroke="#B08A4F"
      strokeWidth="1.5"
    />
    {/* Pot Neck & Rim */}
    <Rect x="38" y="42" width="24" height="4" rx="1.5" fill="#4D0E13" />

    {/* Sacred Threads (Nooru / Kanganam criss-cross) */}
    <Path d="M30,62 Q50,70 70,62" stroke="#4D0E13" strokeWidth="1.5" fill="none" />
    <Path d="M30,68 Q50,76 70,68" stroke="#C8A49F" strokeWidth="1.2" fill="none" />
    <Path d="M42,50 L58,78" stroke="#B08A4F" strokeWidth="1" />
    <Path d="M58,50 L42,78" stroke="#B08A4F" strokeWidth="1" />

    {/* Mango Leaves (Maavilai) radiating from rim */}
    <Path d="M38,42 C30,34 22,28 18,24 C26,28 34,36 39,42 Z" fill="#B08A4F" stroke="#7D685E" strokeWidth="0.8" />
    <Path d="M44,42 C40,30 38,20 38,12 C44,20 46,30 46,42 Z" fill="#B08A4F" stroke="#7D685E" strokeWidth="0.8" />
    <Path d="M62,42 C70,34 78,28 82,24 C74,28 66,36 61,42 Z" fill="#B08A4F" stroke="#7D685E" strokeWidth="0.8" />
    <Path d="M56,42 C60,30 62,20 62,12 C56,20 54,30 54,42 Z" fill="#B08A4F" stroke="#7D685E" strokeWidth="0.8" />

    {/* Auspicious Coconut (Thengai) */}
    <Path
      d="M42,42 C40,32 44,22 50,18 C56,22 60,32 58,42 Z"
      fill="#7D685E"
      stroke="#4D0E13"
      strokeWidth="1.5"
    />
    {/* Turmeric / Kumkum tilak on coconut */}
    <Circle cx="50" cy="30" r="3.5" fill="#4D0E13" />
    <Circle cx="50" cy="30" r="1.5" fill="#B08A4F" />
  </Svg>
);

// 6. Garland (Maalai): Lush bridal wedding garland with roses, jasmine and gold zari
export const GarlandIllustration: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="roseRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4D0E13" />
        <Stop offset="70%" stopColor="#6B1B22" />
        <Stop offset="100%" stopColor="#C8A49F" />
      </LinearGradient>
    </Defs>
    {/* U-shaped garland drape */}
    {/* Left Strand Flowers */}
    <Circle cx="24" cy="22" r="7" fill="url(#roseRed)" stroke="#B08A4F" strokeWidth="1" />
    <Circle cx="22" cy="36" r="6" fill="#FFFDF9" stroke="#D8C4AC" strokeWidth="1" />
    <Circle cx="24" cy="48" r="7" fill="url(#roseRed)" stroke="#B08A4F" strokeWidth="1" />
    <Circle cx="28" cy="62" r="6" fill="#FFFDF9" stroke="#D8C4AC" strokeWidth="1" />
    <Circle cx="36" cy="74" r="7" fill="url(#roseRed)" stroke="#B08A4F" strokeWidth="1" />

    {/* Right Strand Flowers */}
    <Circle cx="76" cy="22" r="7" fill="url(#roseRed)" stroke="#B08A4F" strokeWidth="1" />
    <Circle cx="78" cy="36" r="6" fill="#FFFDF9" stroke="#D8C4AC" strokeWidth="1" />
    <Circle cx="76" cy="48" r="7" fill="url(#roseRed)" stroke="#B08A4F" strokeWidth="1" />
    <Circle cx="72" cy="62" r="6" fill="#FFFDF9" stroke="#D8C4AC" strokeWidth="1" />
    <Circle cx="64" cy="74" r="7" fill="url(#roseRed)" stroke="#B08A4F" strokeWidth="1" />

    {/* Center Medallion Pendant (Padhakkam) */}
    <Circle cx="50" cy="80" r="9" fill="url(#roseRed)" stroke="#B08A4F" strokeWidth="1.5" />
    <Circle cx="50" cy="80" r="5" fill="#FFFDF9" />
    <Circle cx="50" cy="80" r="2.5" fill="#4D0E13" />

    {/* Gold Zari Tassels (Kunchalam) */}
    <Path d="M46,88 L44,98 L56,98 L54,88 Z" fill="#B08A4F" />
    <Path d="M44,98 L40,100 M47,98 L47,100 M50,98 L50,100 M53,98 L53,100 M56,98 L60,100" stroke="#B08A4F" strokeWidth="1.5" />

    {/* Jasmine string accents between roses */}
    <Path d="M22,22 Q30,30 22,36" stroke="#D8C4AC" strokeWidth="2" fill="none" />
    <Path d="M78,22 Q70,30 78,36" stroke="#D8C4AC" strokeWidth="2" fill="none" />
  </Svg>
);

// 7. Bangles (Valaiyal): Symmetrical stack of gold and silk thread bangles
export const BanglesIllustration: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="goldBangle" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#B08A4F" />
        <Stop offset="40%" stopColor="#EEE4DA" />
        <Stop offset="70%" stopColor="#D8C4AC" />
        <Stop offset="100%" stopColor="#B08A4F" />
      </LinearGradient>
      <LinearGradient id="redBangle" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4D0E13" />
        <Stop offset="50%" stopColor="#C8A49F" />
        <Stop offset="100%" stopColor="#4D0E13" />
      </LinearGradient>
    </Defs>
    {/* Stack of 4 nested overlapping 3D bangles */}
    {/* Bangle 1 (Back) */}
    <Path
      d="M26,30 C26,20 74,20 74,30 C74,40 26,40 26,30 Z"
      fill="none"
      stroke="#B08A4F"
      strokeWidth="3.5"
    />
    {/* Bangle 2 */}
    <Path
      d="M23,42 C23,31 77,31 77,42 C77,53 23,53 23,42 Z"
      fill="none"
      stroke="url(#redBangle)"
      strokeWidth="4"
    />
    {/* Bangle 3 */}
    <Path
      d="M20,54 C20,42 80,42 80,54 C80,66 20,66 20,54 Z"
      fill="none"
      stroke="url(#goldBangle)"
      strokeWidth="4.5"
    />
    {/* Bangle 4 (Front) */}
    <Path
      d="M17,66 C17,53 83,53 83,66 C83,79 17,79 17,66 Z"
      fill="none"
      stroke="url(#redBangle)"
      strokeWidth="4"
    />

    {/* Sparkle Gems / Dot filigree on the front bangle */}
    <Circle cx="32" cy="71" r="1.8" fill="#FFFDF9" />
    <Circle cx="44" cy="72.5" r="2" fill="#B08A4F" />
    <Circle cx="50" cy="72.8" r="2.2" fill="#FFFDF9" />
    <Circle cx="56" cy="72.5" r="2" fill="#B08A4F" />
    <Circle cx="68" cy="71" r="1.8" fill="#FFFDF9" />
  </Svg>
);
