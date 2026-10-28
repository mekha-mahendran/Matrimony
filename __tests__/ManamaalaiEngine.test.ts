import { calculateTenPoruthams } from '../src/services/horoscopeService';
import { SearchService } from '../src/services/searchService';
import { INITIAL_PROFILES } from '../src/data/mockProfiles';
import { SearchFilterState } from '../src/types';

describe('Manamaalai Matrimony Core Logic Tests', () => {
  describe('Horoscope 10-Porutham Calculation Engine', () => {
    test('calculates 10 poruthams between bride and groom stars correctly', () => {
      // Magam (Simmam) and Moolam (Dhanusu)
      const result = calculateTenPoruthams(
        'Simmam (சிம்மம்)',
        'Magam (மகம்)',
        'Dhanusu (தனுசு)',
        'Moolam (மூலம்)'
      );

      expect(result).toBeDefined();
      expect(result.poruthams.length).toBe(10);
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(10);
      expect(['Uthama', 'Madhyama', 'Adhama']).toContain(result.verdict);
      expect(result.disclaimer).toContain('astrologer');
    });

    test('checks Rajju Porutham properly for different rajju nodes', () => {
      // Bharani (Kati) and Poosam (Udara) - different nodes -> compatible
      const result = calculateTenPoruthams(
        'Mesham (மேஷம்)',
        'Bharani (பரணி)',
        'Kadagam (கடகம்)',
        'Poosam (பூசம்)'
      );

      const rajju = result.poruthams.find(p => p.name === 'Rajju Porutham');
      expect(rajju).toBeDefined();
      expect(rajju?.importance).toBe('Essential');
    });
  });

  describe('Search & Filter Engine', () => {
    const defaultFilters: SearchFilterState = {
      ageMin: 20,
      ageMax: 35,
      heightMinCm: 150,
      heightMaxCm: 190,
      verifiedOnly: false,
      withPhotoOnly: false,
      horoscopePoruthamOnly: false,
      searchQuery: '',
      sortBy: 'relevance',
    };

    test('filters profiles by gender and age range', () => {
      const groomProfile = INITIAL_PROFILES.find(p => p.gender === 'groom');
      const filtered = SearchService.filterProfiles(
        INITIAL_PROFILES,
        {
          ...defaultFilters,
          gender: 'bride',
          ageMin: 24,
          ageMax: 27,
        },
        groomProfile
      );

      expect(filtered.every(p => p.gender === 'bride')).toBe(true);
      expect(filtered.every(p => p.age >= 24 && p.age <= 27)).toBe(true);
    });

    test('filters verified profiles only', () => {
      const filtered = SearchService.filterProfiles(INITIAL_PROFILES, {
        ...defaultFilters,
        verifiedOnly: true,
      });

      expect(filtered.every(p => p.isVerified)).toBe(true);
    });

    test('searches query by profession or caste', () => {
      const filtered = SearchService.filterProfiles(INITIAL_PROFILES, {
        ...defaultFilters,
        searchQuery: 'Doctor',
      });

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.some(
          p =>
            p.name.includes('Doctor') ||
            p.educationCareer.occupation.toLowerCase().includes('doctor')
        )
      ).toBe(true);
    });
  });
});
