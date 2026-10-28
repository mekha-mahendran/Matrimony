import { PoruthamCheck, PoruthamResult } from '../types';

export const TAMIL_RASIS = [
  'Mesham (மேஷம்)',
  'Rishabam (ரிஷபம்)',
  'Mithunam (மிதுனம்)',
  'Kadagam (கடகம்)',
  'Simmam (சிம்மம்)',
  'Kanni (கன்னி)',
  'Thulaam (துலாம்)',
  'Viruchigam (விருச்சிகம்)',
  'Dhanusu (தனுசு)',
  'Magaram (மகரம்)',
  'Kumbam (கும்பம்)',
  'Meenam (மீனம்)',
];

export const TAMIL_NAKSHATRAMS = [
  'Ashwini (அஸ்வினி)',
  'Bharani (பரணி)',
  'Krithigai (கார்த்திகை)',
  'Rohini (ரோகிணி)',
  'Mrigashirsham (மிருகசீரிஷம்)',
  'Thiruvathirai (திருவாதிரை)',
  'Punarpoosam (புனர்பூசம்)',
  'Poosam (பூசம்)',
  'Aayilyam (ஆயில்யம்)',
  'Magam (மகம்)',
  'Pooram (பூரம்)',
  'Uthiram (உத்திரம்)',
  'Hastham (அஸ்தம்)',
  'Chithirai (சித்திரை)',
  'Swathi (சுவாதி)',
  'Visakam (விசாகம்)',
  'Anusham (அனுஷம்)',
  'Kettai (கேட்டை)',
  'Moolam (மூலம்)',
  'Pooradam (பூராடம்)',
  'Uthiradam (உத்திராடம்)',
  'Thiruvonam (திருவோணம்)',
  'Avittam (அவிட்டம்)',
  'Sathayam (சதயம்)',
  'Poorattathi (பூரட்டாதி)',
  'Uthirattathi (உத்திரட்டாதி)',
  'Revathi (ரேவதி)',
];

// Ganam classification
// Deva: 1, 5, 7, 8, 13, 15, 17, 22, 27
// Manusha: 2, 4, 6, 11, 12, 20, 21, 25, 26
// Rakshasa: 3, 9, 10, 14, 16, 18, 19, 23, 24
const GANAM_MAP: Record<number, 'Deva' | 'Manusha' | 'Rakshasa'> = {
  1: 'Deva', 2: 'Manusha', 3: 'Rakshasa', 4: 'Manusha', 5: 'Deva', 6: 'Manusha',
  7: 'Deva', 8: 'Deva', 9: 'Rakshasa', 10: 'Rakshasa', 11: 'Manusha', 12: 'Manusha',
  13: 'Deva', 14: 'Rakshasa', 15: 'Deva', 16: 'Rakshasa', 17: 'Deva', 18: 'Rakshasa',
  19: 'Rakshasa', 20: 'Manusha', 21: 'Manusha', 22: 'Deva', 23: 'Rakshasa', 24: 'Rakshasa',
  25: 'Manusha', 26: 'Manusha', 27: 'Deva',
};

// Rajju classification (Shiro, Kanta, Udara, Kati, Pada)
// Crucial: Rajju must be different!
const RAJJU_MAP: Record<number, string> = {
  1: 'Pada', 2: 'Kati', 3: 'Udara', 4: 'Kanta', 5: 'Shiro',
  6: 'Shiro', 7: 'Kanta', 8: 'Udara', 9: 'Kati', 10: 'Pada',
  11: 'Kati', 12: 'Udara', 13: 'Kanta', 14: 'Shiro', 15: 'Shiro',
  16: 'Kanta', 17: 'Udara', 18: 'Kati', 19: 'Pada', 20: 'Kati',
  21: 'Udara', 22: 'Kanta', 23: 'Shiro', 24: 'Shiro', 25: 'Kanta',
  26: 'Udara', 27: 'Pada',
};

function getNakshatraIndex(name: string): number {
  const clean = name.toLowerCase();
  const idx = TAMIL_NAKSHATRAMS.findIndex(n => clean.includes(n.split(' ')[0].toLowerCase()));
  return idx >= 0 ? idx + 1 : 1;
}

function getRasiIndex(name: string): number {
  const clean = name.toLowerCase();
  const idx = TAMIL_RASIS.findIndex(r => clean.includes(r.split(' ')[0].toLowerCase()));
  return idx >= 0 ? idx + 1 : 1;
}

export function calculateTenPoruthams(
  brideRasi: string,
  brideNakshatram: string,
  groomRasi: string,
  groomNakshatram: string
): PoruthamResult {
  const bStar = getNakshatraIndex(brideNakshatram);
  const gStar = getNakshatraIndex(groomNakshatram);
  const bRasi = getRasiIndex(brideRasi);
  const gRasi = getRasiIndex(groomRasi);

  // 1. Dinam Porutham (Health & Longevity)
  // Count from Bride star to Groom star
  const starCount = ((gStar - bStar + 27) % 27) + 1;
  const badDinam = [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 24];
  const isDinam = !badDinam.includes(starCount % 9);

  // 2. Ganam Porutham (Temperament Harmony)
  const bGanam = GANAM_MAP[bStar] || 'Manusha';
  const gGanam = GANAM_MAP[gStar] || 'Manusha';
  let isGanam = false;
  if (bGanam === gGanam) isGanam = true;
  else if (bGanam === 'Deva' && gGanam === 'Manusha') isGanam = true;
  else if (bGanam === 'Manusha' && gGanam === 'Deva') isGanam = true;

  // 3. Mahendram Porutham (Children & Family Lineage)
  const isMahendram = [4, 7, 10, 13, 16, 19, 22, 25].includes(starCount);

  // 4. Sthree Dheergam (Prosperity for the Bride)
  const isSthreeDheergam = starCount > 13;

  // 5. Yoni Porutham (Physical Affinity)
  // Simplified friendly calculation based on star difference
  const yoniScore = (Math.abs(gStar - bStar) % 3 !== 0);

  // 6. Rasi Porutham (Mental Affinity & Family Unity)
  // Count from bride's rasi to groom's rasi
  const rasiCount = ((gRasi - bRasi + 12) % 12) + 1;
  const badRasi = [2, 6, 8, 12]; // Sashtashtakam (6/8) and Dwirdwadasam (2/12)
  const isRasi = !badRasi.includes(rasiCount) || rasiCount === 7;

  // 7. Rasi Adhipathi (Lord Friendship)
  const isRasiAdhipathi = (gRasi === bRasi) || [1, 5, 7, 9].includes(rasiCount);

  // 8. Vasya Porutham (Mutual Attraction)
  const isVasya = [1, 3, 4, 7, 10].includes(rasiCount);

  // 9. Rajju Porutham (Mangalya Bhagyam - Most Important!)
  const bRajju = RAJJU_MAP[bStar] || 'Udara';
  const gRajju = RAJJU_MAP[gStar] || 'Kanta';
  const isRajju = bRajju !== gRajju; // Auspicious when in different Rajju

  // 10. Vedhai Porutham (Freedom from Afflictions)
  // Stars that repel each other (e.g. Ashwini - Kettai, etc.)
  const isVedhai = (bStar + gStar) % 7 !== 0;

  const checks: PoruthamCheck[] = [
    {
      name: 'Rajju Porutham',
      tamilName: 'ரஜ்ஜு பொருத்தம்',
      isCompatible: isRajju,
      score: isRajju ? 1 : 0,
      importance: 'Essential',
      description: isRajju
        ? 'Auspicious. Bride and Groom belong to different Rajju nodes, ensuring strong Mangalya Bhagyam.'
        : 'Same Rajju detected. Traditionally advised to consult a family astrologer for pariharams.',
    },
    {
      name: 'Dinam Porutham',
      tamilName: 'தினப் பொருத்தம்',
      isCompatible: isDinam,
      score: isDinam ? 1 : 0,
      importance: 'Important',
      description: isDinam
        ? 'Promotes physical longevity, good health, and prosperous living together.'
        : 'Neutral Dinam strength.',
    },
    {
      name: 'Ganam Porutham',
      tamilName: 'கணப் பொருத்தம்',
      isCompatible: isGanam,
      score: isGanam ? 1 : 0,
      importance: 'Important',
      description: `Bride (${bGanam}) & Groom (${gGanam}) temperaments blend smoothly with mutual understanding.`,
    },
    {
      name: 'Rasi Porutham',
      tamilName: 'ராசிப் பொருத்தம்',
      isCompatible: isRasi,
      score: isRasi ? 1 : 0,
      importance: 'Essential',
      description: isRasi
        ? 'Harmonious planetary positioning fostering cordial family understanding.'
        : 'Distance requires thoughtful adjustments between respective family circles.',
    },
    {
      name: 'Rasi Adhipathi',
      tamilName: 'ராசி அதிபதி பொருத்தம்',
      isCompatible: isRasiAdhipathi,
      score: isRasiAdhipathi ? 1 : 0,
      importance: 'Important',
      description: isRasiAdhipathi
        ? 'Planetary lords share friendly mutual relations.'
        : 'Planetary lords have neutral relations.',
    },
    {
      name: 'Yoni Porutham',
      tamilName: 'யோனிப் பொருத்தம்',
      isCompatible: yoniScore,
      score: yoniScore ? 1 : 0,
      importance: 'Important',
      description: yoniScore
        ? 'Good mutual physical attraction and marital affection.'
        : 'Average affinity score.',
    },
    {
      name: 'Mahendram Porutham',
      tamilName: 'மகேந்திரப் பொருத்தம்',
      isCompatible: isMahendram,
      score: isMahendram ? 1 : 0,
      importance: 'Secondary',
      description: isMahendram
        ? 'Blessed with righteous lineage, offspring, and thriving family legacy.'
        : 'Standard indicator.',
    },
    {
      name: 'Sthree Dheergam',
      tamilName: 'ஸ்திரீ தீர்க்கப் பொருத்தம்',
      isCompatible: isSthreeDheergam,
      score: isSthreeDheergam ? 1 : 0,
      importance: 'Secondary',
      description: isSthreeDheergam
        ? 'Bestows long-lasting wealth and peace to the bride in the marital home.'
        : 'Moderate indicator.',
    },
    {
      name: 'Vasya Porutham',
      tamilName: 'வசியப் பொருத்தம்',
      isCompatible: isVasya,
      score: isVasya ? 1 : 0,
      importance: 'Secondary',
      description: isVasya
        ? 'Promotes mutual admiration, devotion, and gentle emotional affinity.'
        : 'Neutral score.',
    },
    {
      name: 'Vedhai Porutham',
      tamilName: 'வேதைப் பொருத்தம்',
      isCompatible: isVedhai,
      score: isVedhai ? 1 : 0,
      importance: 'Important',
      description: isVedhai
        ? 'Free from mutual astrological affliction and obstacles.'
        : 'Astrological counseling suggested.',
    },
  ];

  const totalScore = checks.reduce((sum, item) => sum + item.score, 0);

  let verdict: 'Uthama' | 'Madhyama' | 'Adhama' = 'Adhama';
  let verdictTamil = 'ஜோதிடரை அணுகவும்';
  let summary = 'Requires detailed personal horoscope reading with a family astrologer.';

  if (totalScore >= 7 && isRajju) {
    verdict = 'Uthama';
    verdictTamil = 'உத்தம பொருத்தம் (மிகச் சிறப்பு)';
    summary = 'Excellent astrological compatibility! 10 Porutham criteria are strongly satisfied.';
  } else if (totalScore >= 5) {
    verdict = 'Madhyama';
    verdictTamil = 'மத்திம பொருத்தம் (நன்று)';
    summary = 'Good compatibility. Suitable for marriage with standard elders’ blessings.';
  }

  return {
    brideRasi,
    brideNakshatram,
    groomRasi,
    groomNakshatram,
    totalScore,
    maxScore: 10,
    verdict,
    verdictTamil,
    summary,
    poruthams: checks,
    disclaimer:
      'Note: This 10-Porutham calculation is algorithmic guidance. In Tamil tradition, families typically share full Jathagam charts with an experienced astrologer for Dhasa Sandhi and Chevvai Dosham verification.',
  };
}
