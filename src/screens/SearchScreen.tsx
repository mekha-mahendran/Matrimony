import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { FilterModal } from '../components/FilterModal';
import { Header } from '../components/Header';
import { ProfileCard } from '../components/ProfileCard';
import { Language, Translations } from '../localization';
import { SearchService } from '../services/searchService';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { MatrimonyProfile, SearchFilterState } from '../types';

interface SearchScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onNotificationPress: () => void;
  onAdminPress: () => void;
  onProfilePress: (profile: MatrimonyProfile) => void;
  initialQuery?: string;
  unreadCount: number;
  isAdmin: boolean;
}

const DEFAULT_FILTERS: SearchFilterState = {
  ageMin: 21,
  ageMax: 38,
  heightMinCm: 150,
  heightMaxCm: 195,
  verifiedOnly: false,
  withPhotoOnly: false,
  horoscopePoruthamOnly: false,
  searchQuery: '',
  sortBy: 'relevance',
};

export const SearchScreen: React.FC<SearchScreenProps> = ({
  language,
  onToggleLanguage,
  onNotificationPress,
  onAdminPress,
  onProfilePress,
  initialQuery = '',
  unreadCount,
  isAdmin,
}) => {
  const t = Translations[language];
  const [allProfiles, setAllProfiles] = useState<MatrimonyProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<MatrimonyProfile | null>(null);
  const [shortlists, setShortlists] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilterState>({
    ...DEFAULT_FILTERS,
    searchQuery: initialQuery,
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const loadData = async () => {
    const user = await StorageService.getCurrentUser();
    const curr = await StorageService.getProfileById(user.activeProfileId);
    setCurrentProfile(curr);

    const profiles = await StorageService.getAllProfiles();
    setAllProfiles(profiles);

    const sl = await StorageService.getShortlists();
    setShortlists(sl);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleShortlist = async (profileId: string) => {
    await StorageService.toggleShortlist(profileId);
    const updated = await StorageService.getShortlists();
    setShortlists(updated);
  };

  const handleSendInterest = async (targetProfileId: string) => {
    if (!currentProfile) return;
    await StorageService.sendInterest(currentProfile.id, targetProfileId);
    await loadData();
  };

  // Perform dynamic real-time filtering
  const filteredProfiles = SearchService.filterProfiles(allProfiles, filters, currentProfile);

  const activeFilterCount =
    (filters.gender ? 1 : 0) +
    (filters.caste && filters.caste.length > 0 ? 1 : 0) +
    (filters.district && filters.district.length > 0 ? 1 : 0) +
    (filters.education && filters.education.length > 0 ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.withPhotoOnly ? 1 : 0) +
    (filters.horoscopePoruthamOnly ? 1 : 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={onToggleLanguage}
        unreadNotificationsCount={unreadCount}
        onNotificationPress={onNotificationPress}
        onAdminPress={onAdminPress}
        isAdmin={isAdmin}
        title={language === 'ta' ? 'வரன் தேடல்' : 'Partner Search'}
        subtitle={`${filteredProfiles.length} ${t.resultsFound}`}
      />

      {/* Search Input Bar + Filter Trigger */}
      <View style={styles.searchBarRow}>
        <View style={styles.inputContainer}>
          <CustomIcon name="search" size={18} color={Colors.burgundy} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={filters.searchQuery}
            onChangeText={txt => setFilters({ ...filters, searchQuery: txt })}
            placeholderTextColor={Colors.textMuted}
          />
          {filters.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setFilters({ ...filters, searchQuery: '' })}>
              <CustomIcon name="close" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <CustomIcon
            name="filter"
            size={18}
            color={activeFilterCount > 0 ? Colors.creme : Colors.burgundy}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Category Chips Bar */}
      <View style={styles.quickChipsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsContent}>
          <TouchableOpacity
            style={[styles.quickChip, !filters.gender && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, gender: undefined })}
          >
            <Text style={[styles.quickChipText, !filters.gender && styles.quickChipTextActive]}>
              {language === 'ta' ? 'அனைத்தும்' : 'All'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.gender === 'bride' && styles.quickChipActive]}
            onPress={() =>
              setFilters({
                ...filters,
                gender: filters.gender === 'bride' ? undefined : 'bride',
              })
            }
          >
            <Text style={[styles.quickChipText, filters.gender === 'bride' && styles.quickChipTextActive]}>
              {language === 'ta' ? 'மணமகள்' : 'Brides'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.gender === 'groom' && styles.quickChipActive]}
            onPress={() =>
              setFilters({
                ...filters,
                gender: filters.gender === 'groom' ? undefined : 'groom',
              })
            }
          >
            <Text style={[styles.quickChipText, filters.gender === 'groom' && styles.quickChipTextActive]}>
              {language === 'ta' ? 'மணமகன்' : 'Grooms'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.verifiedOnly && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
          >
            <CustomIcon
              name="shield"
              size={12}
              color={filters.verifiedOnly ? Colors.creme : Colors.verifiedBlue}
            />
            <Text style={[styles.quickChipText, filters.verifiedOnly && styles.quickChipTextActive]}>
              {language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.withPhotoOnly && styles.quickChipActive]}
            onPress={() => setFilters({ ...filters, withPhotoOnly: !filters.withPhotoOnly })}
          >
            <Text style={[styles.quickChipText, filters.withPhotoOnly && styles.quickChipTextActive]}>
              {language === 'ta' ? 'புகைப்படத்துடன்' : 'With Photo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, filters.horoscopePoruthamOnly && styles.quickChipActive]}
            onPress={() =>
              setFilters({ ...filters, horoscopePoruthamOnly: !filters.horoscopePoruthamOnly })
            }
          >
            <CustomIcon
              name="sparkles"
              size={12}
              color={filters.horoscopePoruthamOnly ? Colors.creme : Colors.burgundy}
            />
            <Text
              style={[
                styles.quickChipText,
                filters.horoscopePoruthamOnly && styles.quickChipTextActive,
              ]}
            >
              {language === 'ta' ? '10 பொருத்தம்' : '10-Porutham'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Sorting Quick Bar */}
      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>{t.sort}:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { id: 'relevance', label: 'Relevance' },
            { id: 'porutham', label: '10-Porutham Match' },
            { id: 'newest', label: 'Recently Joined' },
            { id: 'age_asc', label: 'Age: Low to High' },
            { id: 'age_desc', label: 'Age: High to Low' },
          ].map(s => {
            const active = filters.sortBy === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.sortChip, active && styles.sortChipActive]}
                onPress={() => setFilters({ ...filters, sortBy: s.id as any })}
              >
                <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Profiles List */}
      <FlatList
        data={filteredProfiles}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            currentProfile={currentProfile}
            language={language}
            isShortlisted={shortlists.includes(item.id)}
            onPress={() => onProfilePress(item)}
            onToggleShortlist={() => handleToggleShortlist(item.id)}
            onSendInterest={() => handleSendInterest(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <CustomIcon name="search" size={30} color={Colors.burgundy} />
            </View>
            <Text style={styles.emptyTitle}>No Matching Profiles</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your caste, district, or age filters to see more Tamil varans.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => setFilters(DEFAULT_FILTERS)}
            >
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        language={language}
        onClose={() => setFilterModalVisible(false)}
        onApply={newF => setFilters(newF)}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        totalMatchesCount={filteredProfiles.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  searchBarRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  filterBtn: {
    width: 46,
    height: 46,
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.dustyPink,
    borderRadius: 8,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  filterBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.burgundy,
  },
  quickChipsBar: {
    paddingTop: Spacing.sm,
    paddingBottom: 2,
  },
  quickChipsContent: {
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.cardBg,
    gap: 4,
    ...Shadows.subtle,
  },
  quickChipActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  quickChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quickChipTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  sortLabel: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginRight: 8,
  },
  sortChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.creme,
    marginRight: 6,
  },
  sortChipActive: {
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
  },
  sortChipText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: Colors.creme,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dustyPinkLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dustyPink,
  },
  emptyTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.titleMedium,
    fontWeight: '700',
    color: Colors.burgundy,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  resetBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.burgundy,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
  },
  resetBtnText: {
    color: Colors.creme,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
  },
});
