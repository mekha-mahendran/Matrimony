/**
 * Manamaalai Matrimony — Home Cultural & Matrimonial Features
 *
 * Renders directly below the swipe cards/posts on the Home screen:
 * 1. Quick 10-Porutham (Dasa Porutham) Horoscope Matcher
 * 2. Tamil Nadu Community & Native District Hubs
 * 3. Daily Subha Muhurtham & Auspicious Times (நல்ல நேரம்)
 * 4. Kalyana Vaibhogam — Real Marriage Success Stories
 * 5. Family Decision Circle & VIP Relationship Manager Banners
 * 6. Aadhaar Trust & Safety Guarantee
 */

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Language } from '../localization';
import {
  TAMIL_NAKSHATRAMS,
  TAMIL_RASIS,
  calculateTenPoruthams,
} from '../services/horoscopeService';
import { MatrimonyProfile, PoruthamResult } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_PURPLE = '#6D53F5';
const BRAND_GOLD = '#F59E0B';

interface HomeMatrimonyFeaturesProps {
  language: Language;
  onSearchPress: (query?: string) => void;
  onProfilePress?: (profile: MatrimonyProfile) => void;
  onFamilyCirclePress?: () => void;
  onRelationshipManagerPress?: () => void;
  onMembershipPress?: () => void;
  onViewHoroscopePorutham?: (porutham: any) => void;
}

const TN_COMMUNITIES = [
  { name: 'Saiva Pillai', count: '320+', tamil: 'சைவ பிள்ளை' },
  { name: 'Kongu Vellalar', count: '410+', tamil: 'கொங்கு வெள்ளாளர்' },
  { name: 'Mudaliar', count: '290+', tamil: 'முதலியார்' },
  { name: 'Chettiar', count: '180+', tamil: 'செட்டியார்' },
  { name: 'Brahmin (Iyer/Iyengar)', count: '260+', tamil: 'பிராமின்' },
  { name: 'Nadar', count: '340+', tamil: 'நாடார்' },
  { name: 'Vanniyar', count: '220+', tamil: 'வன்னியர்' },
  { name: 'Naidu', count: '190+', tamil: 'நாயுடு' },
  { name: 'Viswakarma', count: '150+', tamil: 'விஸ்வகர்மா' },
];

const TN_DISTRICT_HUBS = [
  {
    city: 'Chennai',
    region: 'Capital Metro',
    profiles: '680+ Varans',
    tamil: 'சென்னை',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
  },
  {
    city: 'Coimbatore',
    region: 'Kongu Region',
    profiles: '430+ Varans',
    tamil: 'கோயம்புத்தூர்',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=400&q=80',
  },
  {
    city: 'Madurai',
    region: 'Temple City',
    profiles: '390+ Varans',
    tamil: 'மதுரை',
    image: 'https://images.unsplash.com/photo-1621644827995-6b45a05b32f2?auto=format&fit=crop&w=400&q=80',
  },
  {
    city: 'Tiruchirappalli',
    region: 'Cauvery Delta',
    profiles: '280+ Varans',
    tamil: 'திருச்சிராப்பள்ளி',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
  },
  {
    city: 'Tirunelveli',
    region: 'South Tamil Nadu',
    profiles: '210+ Varans',
    tamil: 'திருநெல்வேலி',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    city: 'Salem',
    region: 'Steel City',
    profiles: '170+ Varans',
    tamil: 'சேலம்',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
];

const SUCCESS_STORIES = [
  {
    id: 's1',
    couple: 'Karthik & Deepa',
    city: 'Chennai',
    stars: 'Magam & Rohini',
    score: '9/10 Porutham',
    date: 'Solemnized at Kapaleeshwarar Temple',
    image: require('../assets/images/tamil_couple_1.jpg'),
    story: 'We connected in July and both our families agreed within 3 weeks after matching 9/10 poruthams!',
  },
  {
    id: 's2',
    couple: 'Dr. Vignesh & Dr. Priya',
    city: 'Madurai',
    stars: 'Hastham & Swathi',
    score: '10/10 Porutham',
    date: 'Solemnized at Meenakshi Amman Temple',
    image: require('../assets/images/tamil_couple_2.jpg'),
    story: 'Our horoscopes and family traditions aligned seamlessly through the Saiva Pillai Community Hub.',
  },
  {
    id: 's3',
    couple: 'Suresh & Keerthana',
    city: 'Coimbatore',
    stars: 'Anusham & Uthiram',
    score: '8/10 Porutham',
    date: 'Solemnized at Marudhamalai Temple',
    image: require('../assets/images/wedding_couple.jpg'),
    story: 'Our parents used the Family Decision Circle to review profiles together every evening!',
  },
];

export const HomeMatrimonyFeatures: React.FC<HomeMatrimonyFeaturesProps> = ({
  language,
  onSearchPress,
  onFamilyCirclePress,
  onRelationshipManagerPress,
  onMembershipPress,
  onViewHoroscopePorutham,
}) => {
  const isTa = language === 'ta';

  // State for Quick 10-Porutham Matcher
  const [groomStar, setGroomStar] = useState('Magam (மகம்)');
  const [groomRasi, setGroomRasi] = useState('Simmam (சிம்மம்)');
  const [brideStar, setBrideStar] = useState('Rohini (ரோகிணி)');
  const [brideRasi, setBrideRasi] = useState('Rishabam (ரிஷபம்)');

  // Calculate live Porutham match
  const poruthamResult: PoruthamResult = useMemo(() => {
    return calculateTenPoruthams(brideRasi, brideStar, groomRasi, groomStar);
  }, [brideRasi, brideStar, groomRasi, groomStar]);

  // Individual porutham compatibility
  const isRajjuMatch = poruthamResult.poruthams?.find(p => p.name.includes('Rajju'))?.isCompatible ?? true;
  const isDinamMatch = poruthamResult.poruthams?.find(p => p.name.includes('Dinam'))?.isCompatible ?? true;
  const isGanamMatch = poruthamResult.poruthams?.find(p => p.name.includes('Ganam'))?.isCompatible ?? true;
  const isRasiMatch = poruthamResult.poruthams?.find(p => p.name.includes('Rasi'))?.isCompatible ?? true;
  const isYoniMatch = poruthamResult.poruthams?.find(p => p.name.includes('Yoni'))?.isCompatible ?? true;

  return (
    <View style={styles.featuresWrapper}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. QUICK 10-PORUTHAM (DASA PORUTHAM) HOROSCOPE CALCULATOR    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionIconBadge}>
            <Text style={{ fontSize: 18 }}>🪐</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {isTa ? '10 பொருத்தக் கால்குலேட்டர்' : '10-Porutham Match Calculator'}
            </Text>
            <Text style={styles.sectionSub}>
              {isTa ? 'நட்சத்திரப் பொருத்தத்தை உடனே சரிபார்க்கவும்' : 'Instant Vedic Star Compatibility Checker'}
            </Text>
          </View>
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>{isTa ? 'நேரலை' : 'LIVE'}</Text>
          </View>
        </View>

        {/* Star Selector Box */}
        <View style={styles.poruthamBox}>
          <View style={styles.starRow}>
            {/* Groom Star */}
            <View style={styles.starCol}>
              <Text style={styles.starColLabel}>
                {isTa ? 'ஆண் நட்சத்திரம்' : "Groom's Star"}
              </Text>
              <TouchableOpacity
                style={styles.starDropdownBtn}
                activeOpacity={0.8}
                onPress={() => {
                  const idx = TAMIL_NAKSHATRAMS.indexOf(groomStar);
                  const next = TAMIL_NAKSHATRAMS[(idx + 1) % TAMIL_NAKSHATRAMS.length];
                  setGroomStar(next);
                }}
              >
                <Text style={styles.starDropdownText} numberOfLines={1}>
                  {groomStar.split(' ')[0]}
                </Text>
                <Text style={styles.starDropdownChevron}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Match Circle */}
            <View style={styles.matchScoreCircle}>
              <Text style={styles.matchScoreNum}>
                {poruthamResult.totalScore}/{poruthamResult.maxScore || 10}
              </Text>
              <Text style={styles.matchScoreWord}>
                {isTa ? poruthamResult.verdictTamil : poruthamResult.verdict}
              </Text>
            </View>

            {/* Bride Star */}
            <View style={styles.starCol}>
              <Text style={styles.starColLabel}>
                {isTa ? 'பெண் நட்சத்திரம்' : "Bride's Star"}
              </Text>
              <TouchableOpacity
                style={styles.starDropdownBtn}
                activeOpacity={0.8}
                onPress={() => {
                  const idx = TAMIL_NAKSHATRAMS.indexOf(brideStar);
                  const next = TAMIL_NAKSHATRAMS[(idx + 1) % TAMIL_NAKSHATRAMS.length];
                  setBrideStar(next);
                }}
              >
                <Text style={styles.starDropdownText} numberOfLines={1}>
                  {brideStar.split(' ')[0]}
                </Text>
                <Text style={styles.starDropdownChevron}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Porutham Vital Pills */}
          <View style={styles.vitalPillsRow}>
            <View style={[styles.vitalPill, isRajjuMatch && styles.vitalPillSuccess]}>
              <Text style={[styles.vitalPillText, isRajjuMatch && styles.vitalPillTextSuccess]}>
                {isRajjuMatch ? '✓' : '✕'} {isTa ? 'ரஜ்ஜு' : 'Rajju'}
              </Text>
            </View>
            <View style={[styles.vitalPill, isDinamMatch && styles.vitalPillSuccess]}>
              <Text style={[styles.vitalPillText, isDinamMatch && styles.vitalPillTextSuccess]}>
                {isDinamMatch ? '✓' : '✕'} {isTa ? 'தினம்' : 'Dinam'}
              </Text>
            </View>
            <View style={[styles.vitalPill, isGanamMatch && styles.vitalPillSuccess]}>
              <Text style={[styles.vitalPillText, isGanamMatch && styles.vitalPillTextSuccess]}>
                {isGanamMatch ? '✓' : '✕'} {isTa ? 'கணம்' : 'Ganam'}
              </Text>
            </View>
            <View style={[styles.vitalPill, isRasiMatch && styles.vitalPillSuccess]}>
              <Text style={[styles.vitalPillText, isRasiMatch && styles.vitalPillTextSuccess]}>
                {isRasiMatch ? '✓' : '✕'} {isTa ? 'ராசி' : 'Rasi'}
              </Text>
            </View>
            <View style={[styles.vitalPill, isYoniMatch && styles.vitalPillSuccess]}>
              <Text style={[styles.vitalPillText, isYoniMatch && styles.vitalPillTextSuccess]}>
                {isYoniMatch ? '✓' : '✕'} {isTa ? 'யோனி' : 'Yoni'}
              </Text>
            </View>
          </View>

          {/* Full Chart Trigger */}
          <TouchableOpacity
            style={styles.poruthamActionBtn}
            activeOpacity={0.85}
            onPress={() => {
              if (onViewHoroscopePorutham) {
                onViewHoroscopePorutham(poruthamResult);
              } else {
                Alert.alert(
                  isTa ? 'ஜாதகப் பொருத்தம் அறிக்கை' : 'Horoscope Porutham Report',
                  isTa
                    ? `${groomStar} மற்றும் ${brideStar} பொருத்தம்: ${poruthamResult.totalScore}/10 பொருத்தங்கள் உள்ளன (${poruthamResult.verdictTamil}).`
                    : `${groomStar} and ${brideStar} match score: ${poruthamResult.totalScore} out of 10 poruthams match (${poruthamResult.verdict}).`
                );
              }
            }}
          >
            <Text style={styles.poruthamActionBtnText}>
              {isTa ? 'முழுமையான ஜாதகக் கட்டம் பார்க்க' : 'View Detailed Astrological Compatibility'}
            </Text>
            <Text style={styles.poruthamActionBtnArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. TAMIL NADU REGIONAL COMMUNITY HUBS                        */}
      {/* ──────────────────────────────────────────────────────────── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionIconBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={{ fontSize: 18 }}>🪷</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {isTa ? 'தமிழ்நாடு சமுதாய வரன்கள்' : 'Tamil Community Directories'}
            </Text>
            <Text style={styles.sectionSub}>
              {isTa ? 'உங்கள் சமூகத்தின் கீழ் வரன்களைத் தேடுங்கள்' : 'Explore verified profiles by community lineage'}
            </Text>
          </View>
        </View>

        {/* Horizontal Community Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.communityScroll}
        >
          {TN_COMMUNITIES.map((c, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.communityChip}
              activeOpacity={0.8}
              onPress={() => onSearchPress(c.name)}
            >
              <Text style={styles.communityChipName}>
                {isTa ? c.tamil : c.name}
              </Text>
              <View style={styles.communityChipCountBadge}>
                <Text style={styles.communityChipCountText}>{c.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. TAMIL NADU NATIVE DISTRICT HUBS                           */}
      {/* ──────────────────────────────────────────────────────────── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionIconBadge, { backgroundColor: '#EDE9FE' }]}>
            <Text style={{ fontSize: 18 }}>🏛️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {isTa ? 'வட்டார வாரியாக வரன்கள்' : 'Explore by District Hubs'}
            </Text>
            <Text style={styles.sectionSub}>
              {isTa ? 'சொந்த ஊர் மற்றும் மாவட்ட அடிப்படையில்' : 'Find matches from your native Tamil Nadu district'}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.districtScroll}
        >
          {TN_DISTRICT_HUBS.map((hub, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.districtCard}
              activeOpacity={0.88}
              onPress={() => onSearchPress(hub.city)}
            >
              <Image source={{ uri: hub.image }} style={styles.districtCardImg} />
              <View style={styles.districtCardOverlay} />
              <View style={styles.districtCardInfo}>
                <Text style={styles.districtCardCity}>{isTa ? hub.tamil : hub.city}</Text>
                <Text style={styles.districtCardRegion}>{hub.region}</Text>
                <View style={styles.districtCardCountPill}>
                  <Text style={styles.districtCardCountText}>{hub.profiles}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. DAILY SUBHA MUHURTHAM & NALLA NERAM PANCHANGAM            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionIconBadge, { backgroundColor: '#FFFBEB' }]}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {isTa ? 'இன்றைய நல்ல நேரம் & பஞ்சாங்கம்' : 'Daily Auspicious Times & Muhurtham'}
            </Text>
            <Text style={styles.sectionSub}>
              {isTa ? 'இன்றைய சுப ஹோரைகள் மற்றும் முகூர்த்த நாட்கள்' : 'Traditional Tamil Vedic Panchangam Guide'}
            </Text>
          </View>
        </View>

        <View style={styles.muhurthamGrid}>
          {/* Nalla Neram */}
          <View style={styles.muhurthamCol}>
            <Text style={styles.muhurthamLabel}>
              {isTa ? 'நல்ல நேரம் (காலை)' : 'Nalla Neram (AM)'}
            </Text>
            <Text style={styles.muhurthamTime}>09:15 - 10:15 AM</Text>
          </View>

          {/* Evening Nalla Neram */}
          <View style={styles.muhurthamCol}>
            <Text style={styles.muhurthamLabel}>
              {isTa ? 'நல்ல நேரம் (மாலை)' : 'Nalla Neram (PM)'}
            </Text>
            <Text style={styles.muhurthamTime}>04:30 - 05:30 PM</Text>
          </View>

          {/* Gowri Nalla Neram */}
          <View style={styles.muhurthamCol}>
            <Text style={styles.muhurthamLabel}>
              {isTa ? 'கௌரி நல்ல நேரம்' : 'Gowri Nalla Neram'}
            </Text>
            <Text style={styles.muhurthamTime}>10:30 - 11:30 AM</Text>
          </View>

          {/* Rahu Kalam */}
          <View style={styles.muhurthamCol}>
            <Text style={[styles.muhurthamLabel, { color: '#EF4444' }]}>
              {isTa ? 'இராகு காலம் (தவிர்க்க)' : 'Rahu Kalam (Avoid)'}
            </Text>
            <Text style={[styles.muhurthamTime, { color: '#DC2626' }]}>01:30 - 03:00 PM</Text>
          </View>
        </View>

        {/* Upcoming Subha Muhurtham Dates */}
        <View style={styles.muhurthamBanner}>
          <Text style={styles.muhurthamBannerTitle}>
            ✨ {isTa ? 'அடுத்த சுப முகூர்த்த நாட்கள்:' : 'Upcoming Subha Muhurtham Dates:'}
          </Text>
          <Text style={styles.muhurthamBannerDates}>
            Nov 22 (Valarpirai) • Dec 04 (Shukla) • Jan 28 (Thai 14)
          </Text>
        </View>
      </View>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. KALYANA VAIBHOGAM — REAL WEDDING SUCCESS STORIES          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionIconBadge, { backgroundColor: '#FCE7F3' }]}>
            <Text style={{ fontSize: 18 }}>💑</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {isTa ? 'மணமாலை வெற்றிக் கதைகள்' : 'Kalyana Vaibhogam — Success Stories'}
            </Text>
            <Text style={styles.sectionSub}>
              {isTa ? 'மணமாலையில் கைகோர்த்த தமிழ் தம்பதிகள்' : 'Real couples who solemnized their marriages here'}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesScroll}
        >
          {SUCCESS_STORIES.map(story => (
            <View key={story.id} style={styles.successStoryCard}>
              <Image source={story.image} style={styles.successStoryImg} />
              <View style={styles.successStoryBody}>
                <View style={styles.successStoryHeader}>
                  <Text style={styles.successStoryCouple}>{story.couple}</Text>
                  <View style={styles.successStoryBadge}>
                    <Text style={styles.successStoryBadgeText}>{story.score}</Text>
                  </View>
                </View>

                <Text style={styles.successStoryVenue}>📍 {story.date}</Text>
                <Text style={styles.successStoryQuote}>"{story.story}"</Text>

                <View style={styles.successStoryFooter}>
                  <Text style={styles.successStoryStars}>⭐ {story.stars}</Text>
                  <Text style={styles.successStoryCity}>{story.city}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. FAMILY DECISION CIRCLE & VIP RELATIONSHIP MANAGER         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <View style={styles.servicesGrid}>
        {/* Family Decision Circle Card */}
        <TouchableOpacity
          style={styles.serviceCard}
          activeOpacity={0.88}
          onPress={() => {
            if (onFamilyCirclePress) onFamilyCirclePress();
            else Alert.alert('Family Decision Circle', 'Invite parents & elders to review varans together.');
          }}
        >
          <View style={[styles.serviceIconWrap, { backgroundColor: '#F3E8FF' }]}>
            <Text style={{ fontSize: 22 }}>👨‍👩‍👧‍👦</Text>
          </View>
          <Text style={styles.serviceTitle}>
            {isTa ? 'குடும்ப முடிவு வட்டம்' : 'Family Decision Circle'}
          </Text>
          <Text style={styles.serviceDesc}>
            {isTa
              ? 'பெற்றோர், மாமா மற்றும் குடும்பத்தினரைச் சேர்த்து வரன்களை வாக்களித்து தேர்ந்தெடுக்கவும்.'
              : 'Invite parents & elders to vote and discuss prospective profiles together.'}
          </Text>
          <View style={styles.serviceActionRow}>
            <Text style={styles.serviceActionText}>{isTa ? 'இணைக்கவும்' : 'Open Circle'}</Text>
            <Text style={styles.serviceActionArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Relationship Manager Desk Card */}
        <TouchableOpacity
          style={styles.serviceCard}
          activeOpacity={0.88}
          onPress={() => {
            if (onRelationshipManagerPress) onRelationshipManagerPress();
            else if (onMembershipPress) onMembershipPress();
            else Alert.alert('VIP Relationship Manager', 'Our dedicated Tamil matchmakers will assist your family.');
          }}
        >
          <View style={[styles.serviceIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Text style={{ fontSize: 22 }}>👑</Text>
          </View>
          <Text style={styles.serviceTitle}>
            {isTa ? 'தனிப்பட்ட மேலாளர் உதவி' : 'VIP Matchmaker Desk'}
          </Text>
          <Text style={styles.serviceDesc}>
            {isTa
              ? 'அனுபவம் வாய்ந்த மேட்ரிமனி மேலாளர் நேரடியாக ஜாதகப் பரிமாற்றம் மற்றும் சந்திப்புகளை ஏற்பாடு செய்வார்.'
              : 'Dedicated manager coordinates direct horoscope exchange & family meetings.'}
          </Text>
          <View style={styles.serviceActionRow}>
            <Text style={[styles.serviceActionText, { color: BRAND_GOLD }]}>
              {isTa ? 'ஆலோசனை பெற' : 'Consult Manager'}
            </Text>
            <Text style={[styles.serviceActionArrow, { color: BRAND_GOLD }]}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. TRUST & SAFETY SEAL ASSURANCE                             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <View style={styles.trustBanner}>
        <View style={styles.trustIconContainer}>
          <Text style={{ fontSize: 24 }}>🛡️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.trustBannerTitle}>
            {isTa ? '100% பாதுகாப்பான & ஆதார் சரிபார்க்கப்பட்ட தளம்' : '100% Aadhaar Verified & Safe Matrimony'}
          </Text>
          <Text style={styles.trustBannerSub}>
            {isTa
              ? 'போலி கணக்குகள் இல்லை • குடும்ப புகைப்படம் ரகசியத்தன்மை • 256-பிட் பாதுகாப்பு'
              : 'Zero Fake Profiles • Photo Privacy Shield • End-to-End Encrypted Family Matching'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuresWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 20,
  },

  /* Standard Section Containers */
  sectionContainer: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0F0F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FAF9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181D',
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 1,
  },
  livePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#DEF7EC',
  },
  livePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#03543F',
    letterSpacing: 0.5,
  },

  /* Porutham Box */
  poruthamBox: {
    backgroundColor: '#FAF9FF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE8FF',
    gap: 14,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starCol: {
    flex: 1,
  },
  starColLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  starDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  starDropdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181D',
    flex: 1,
  },
  starDropdownChevron: {
    fontSize: 9,
    color: BRAND_PURPLE,
    marginLeft: 4,
  },
  matchScoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BRAND_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  matchScoreNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  matchScoreWord: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#FEEBC8',
  },

  /* Vital Porutham Pills */
  vitalPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  vitalPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  vitalPillSuccess: {
    backgroundColor: '#DEF7EC',
  },
  vitalPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6B7280',
  },
  vitalPillTextSuccess: {
    color: '#03543F',
  },

  /* Porutham Action */
  poruthamActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_PURPLE,
    borderRadius: 14,
    paddingVertical: 10,
    gap: 6,
  },
  poruthamActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  poruthamActionBtnArrow: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Community Chips */
  communityScroll: {
    gap: 8,
    paddingRight: 16,
  },
  communityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  communityChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181D',
  },
  communityChipCountBadge: {
    backgroundColor: '#F4F2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  communityChipCountText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: BRAND_PURPLE,
  },

  /* District Hub Cards */
  districtScroll: {
    gap: 12,
    paddingRight: 16,
  },
  districtCard: {
    width: 140,
    height: 170,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  districtCardImg: {
    width: '100%',
    height: '100%',
  },
  districtCardOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },
  districtCardInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  districtCardCity: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  districtCardRegion: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },
  districtCardCountPill: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  districtCardCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Muhurtham Grid */
  muhurthamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  muhurthamCol: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FD',
    borderRadius: 14,
    padding: 10,
  },
  muhurthamLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6B7280',
  },
  muhurthamTime: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#18181D',
    marginTop: 3,
  },
  muhurthamBanner: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 14,
    padding: 10,
  },
  muhurthamBannerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B21A8',
  },
  muhurthamBannerDates: {
    fontSize: 11,
    fontWeight: '500',
    color: '#7E22CE',
    marginTop: 2,
  },

  /* Success Stories Carousel */
  storiesScroll: {
    gap: 14,
    paddingRight: 16,
  },
  successStoryCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0F0F5',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  successStoryImg: {
    width: '100%',
    height: 140,
  },
  successStoryBody: {
    padding: 12,
    gap: 4,
  },
  successStoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  successStoryCouple: {
    fontSize: 13,
    fontWeight: '800',
    color: '#18181D',
  },
  successStoryBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  successStoryBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#03543F',
  },
  successStoryVenue: {
    fontSize: 10,
    fontWeight: '600',
    color: BRAND_PURPLE,
    marginTop: 1,
  },
  successStoryQuote: {
    fontSize: 10.5,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 15,
    marginTop: 2,
  },
  successStoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  successStoryStars: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  successStoryCity: {
    fontSize: 10,
    fontWeight: '700',
    color: '#18181D',
  },

  /* Services Grid (Family Circle & VIP Manager) */
  servicesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0F0F5',
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#18181D',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 10.5,
    lineHeight: 15,
    color: '#6B7280',
    marginBottom: 10,
  },
  serviceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAND_PURPLE,
  },
  serviceActionArrow: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BRAND_PURPLE,
  },

  /* Trust Banner */
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 12,
  },
  trustIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  trustBannerTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#18181D',
  },
  trustBannerSub: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 2,
  },
});
