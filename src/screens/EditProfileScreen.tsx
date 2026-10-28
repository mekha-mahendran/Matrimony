import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomIcon } from '../components/CustomIcon';
import { Header } from '../components/Header';
import { Language, Translations } from '../localization';
import { StorageService } from '../services/storage';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../theme';
import { MatrimonyProfile } from '../types';

interface EditProfileScreenProps {
  profile: MatrimonyProfile;
  language: Language;
  onBack: () => void;
  onSaved: (updated: MatrimonyProfile) => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  profile,
  language,
  onBack,
  onSaved,
}) => {
  const t = Translations[language];
  const [name, setName] = useState(profile.name);
  const [occupation, setOccupation] = useState(profile.educationCareer.occupation);
  const [employer, setEmployer] = useState(profile.educationCareer.employer);
  const [income, setIncome] = useState(profile.educationCareer.annualIncome);
  const [currentCity, setCurrentCity] = useState(profile.currentCity);
  const [about, setAbout] = useState(profile.about);
  const [fatherOcc, setFatherOcc] = useState(profile.family.fatherOccupation);
  const [motherOcc, setMotherOcc] = useState(profile.family.motherOccupation);

  const handleSave = async () => {
    const updated: MatrimonyProfile = {
      ...profile,
      name,
      currentCity,
      about,
      educationCareer: {
        ...profile.educationCareer,
        occupation,
        employer,
        annualIncome: income,
        workLocation: currentCity,
      },
      family: {
        ...profile.family,
        fatherOccupation: fatherOcc,
        motherOccupation: motherOcc,
      },
    };

    await StorageService.saveProfile(updated);
    Alert.alert('Profile Saved', 'Your profile details have been updated successfully.');
    onSaved(updated);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        language={language}
        onToggleLanguage={() => {}}
        showBack={true}
        onBackPress={onBack}
        title="Edit Profile"
        subtitle={profile.matrimonyId}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={[styles.label, { marginTop: Spacing.md }]}>Current City</Text>
          <TextInput style={styles.input} value={currentCity} onChangeText={setCurrentCity} />

          <Text style={[styles.label, { marginTop: Spacing.md }]}>About Candidate</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            multiline
            value={about}
            onChangeText={setAbout}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Career & Income</Text>

          <Text style={styles.label}>Occupation</Text>
          <TextInput style={styles.input} value={occupation} onChangeText={setOccupation} />

          <Text style={[styles.label, { marginTop: Spacing.md }]}>Employer</Text>
          <TextInput style={styles.input} value={employer} onChangeText={setEmployer} />

          <Text style={[styles.label, { marginTop: Spacing.md }]}>Annual Income</Text>
          <TextInput style={styles.input} value={income} onChangeText={setIncome} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Family Information</Text>

          <Text style={styles.label}>Father's Occupation</Text>
          <TextInput style={styles.input} value={fatherOcc} onChangeText={setFatherOcc} />

          <Text style={[styles.label, { marginTop: Spacing.md }]}>Mother's Occupation</Text>
          <TextInput style={styles.input} value={motherOcc} onChangeText={setMotherOcc} />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.md,
    ...Shadows.editorial,
  },
  sectionTitle: {
    fontFamily: Typography.fontSerif,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.burgundy,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.sandLight,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: Typography.bodyRegular,
    color: Colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: Colors.burgundy,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadows.editorial,
  },
  saveBtnText: {
    color: Colors.creme,
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
  },
});
