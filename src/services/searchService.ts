import { MatrimonyProfile, SearchFilterState } from '../types';
import { calculateTenPoruthams } from './horoscopeService';

export class SearchService {
  static filterProfiles(
    profiles: MatrimonyProfile[],
    filters: SearchFilterState,
    currentProfile?: MatrimonyProfile | null
  ): MatrimonyProfile[] {
    let result = profiles.slice();

    // 1. Exclude self
    if (currentProfile) {
      result = result.filter(p => p.id !== currentProfile.id);
    }

    // 2. Gender
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender);
    } else if (currentProfile) {
      // By default show opposite gender
      const oppositeGender = currentProfile.gender === 'groom' ? 'bride' : 'groom';
      result = result.filter(p => p.gender === oppositeGender);
    }

    // 3. Search query (Name, Matrimony ID, Caste, Occupation, City)
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.matrimonyId.toLowerCase().includes(q) ||
          p.caste.toLowerCase().includes(q) ||
          p.subCaste.toLowerCase().includes(q) ||
          p.educationCareer.occupation.toLowerCase().includes(q) ||
          p.currentCity.toLowerCase().includes(q) ||
          p.nativeDistrict.toLowerCase().includes(q)
      );
    }

    // 4. Age range
    result = result.filter(p => p.age >= filters.ageMin && p.age <= filters.ageMax);

    // 5. Height range
    result = result.filter(
      p => p.lifestyle.heightCm >= filters.heightMinCm && p.lifestyle.heightCm <= filters.heightMaxCm
    );

    // 6. Caste filter
    if (filters.caste && filters.caste.length > 0) {
      result = result.filter(
        p =>
          filters.caste?.some(c => p.caste.toLowerCase().includes(c.toLowerCase())) ||
          (p.allowIntercaste && filters.caste?.includes('Intercaste'))
      );
    }

    // 7. District / City filter
    if (filters.district && filters.district.length > 0) {
      result = result.filter(p =>
        filters.district?.some(
          d =>
            p.nativeDistrict.toLowerCase().includes(d.toLowerCase()) ||
            p.currentCity.toLowerCase().includes(d.toLowerCase())
        )
      );
    }

    // 8. Education filter
    if (filters.education && filters.education.length > 0) {
      result = result.filter(p =>
        filters.education?.some(e =>
          p.educationCareer.qualification.toLowerCase().includes(e.toLowerCase())
        )
      );
    }

    // 9. Verified Only
    if (filters.verifiedOnly) {
      result = result.filter(p => p.isVerified);
    }

    // 10. With Photo Only
    if (filters.withPhotoOnly) {
      result = result.filter(p => p.photos && p.photos.length > 0);
    }

    // 11. Diet
    if (filters.diet && filters.diet.length > 0) {
      result = result.filter(p => filters.diet?.includes(p.lifestyle.diet));
    }

    // 12. Horoscope Porutham Only (7+ Poruthams)
    if (filters.horoscopePoruthamOnly && currentProfile) {
      result = result.filter(target => {
        const bride = currentProfile.gender === 'bride' ? currentProfile : target;
        const groom = currentProfile.gender === 'groom' ? currentProfile : target;
        const res = calculateTenPoruthams(
          bride.horoscope.rasi,
          bride.horoscope.nakshatram,
          groom.horoscope.rasi,
          groom.horoscope.nakshatram
        );
        return res.totalScore >= 7;
      });
    }

    // 13. Sorting
    if (filters.sortBy === 'age_asc') {
      result.sort((a, b) => a.age - b.age);
    } else if (filters.sortBy === 'age_desc') {
      result.sort((a, b) => b.age - a.age);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'porutham' && currentProfile) {
      result.sort((a, b) => {
        const brideA = currentProfile.gender === 'bride' ? currentProfile : a;
        const groomA = currentProfile.gender === 'groom' ? currentProfile : a;
        const scoreA = calculateTenPoruthams(
          brideA.horoscope.rasi,
          brideA.horoscope.nakshatram,
          groomA.horoscope.rasi,
          groomA.horoscope.nakshatram
        ).totalScore;

        const brideB = currentProfile.gender === 'bride' ? currentProfile : b;
        const groomB = currentProfile.gender === 'groom' ? currentProfile : b;
        const scoreB = calculateTenPoruthams(
          brideB.horoscope.rasi,
          brideB.horoscope.nakshatram,
          groomB.horoscope.rasi,
          groomB.horoscope.nakshatram
        ).totalScore;

        return scoreB - scoreA;
      });
    }

    return result;
  }
}
