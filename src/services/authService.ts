import { CurrentUser, Gender, ProfileCreatedFor } from '../types';
import { StorageService } from './storage';
import { apiService } from './apiService';

export interface RegisterInput {
  phone: string;
  email: string;
  password?: string;
  name: string;
  gender: Gender;
  createdFor: ProfileCreatedFor;
  dob: string;
  currentCity: string;
}

export class AuthService {
  private static generatedOtp: string | null = null;
  private static otpTargetPhone: string | null = null;

  static async sendOtp(phone: string): Promise<{ success: boolean; message: string; demoOtp: string }> {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }

    try {
      const res = await apiService.sendOtp(cleanPhone);
      return {
        success: true,
        message: res.message || `OTP sent successfully to +91 ${cleanPhone.slice(-10)}`,
        demoOtp: res.demoOtp || '123456',
      };
    } catch {
      // Offline / fallback mode
      const mockOtp = '123456';
      this.generatedOtp = mockOtp;
      this.otpTargetPhone = cleanPhone;

      return {
        success: true,
        message: `OTP sent successfully to +91 ${cleanPhone.slice(-10)}`,
        demoOtp: mockOtp,
      };
    }
  }

  static async verifyOtp(phone: string, enteredOtp: string): Promise<CurrentUser> {
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    try {
      const res = await apiService.verifyOtp(cleanPhone, enteredOtp);
      if (res && res.user) {
        if (res.profile) {
          await StorageService.saveProfile(res.profile);
        }
        return await StorageService.updateCurrentUser({
          ...res.user,
          phone: cleanPhone,
          activeProfileId: res.profile?.id || res.user.activeProfileId,
        });
      }
    } catch (err: any) {
      console.warn('[AuthService] Backend verifyOtp failed, trying local fallback:', err?.message);
    }

    // Local fallback check
    if (enteredOtp !== '123456' && enteredOtp !== this.generatedOtp) {
      throw new Error('Invalid verification code. Please enter 123456.');
    }

    // Check if user already exists
    const currentUser = await StorageService.getCurrentUser();
    if (currentUser.phone.includes(cleanPhone.slice(-10))) {
      return currentUser;
    }

    // Find if any profile has this phone
    const profiles = await StorageService.getAllProfiles();
    const existing = profiles.find(p => p.phone.replace(/[^0-9]/g, '').includes(cleanPhone.slice(-10)));

    if (existing) {
      const updated = await StorageService.updateCurrentUser({
        phone: cleanPhone,
        activeProfileId: existing.id,
      });
      return updated;
    }

    return currentUser;
  }

  static async loginWithEmail(email: string, pass: string): Promise<CurrentUser> {
    if (!email || !pass) {
      throw new Error('Please enter email and password');
    }

    try {
      // Connect to AWS Backend
      const res = await apiService.login({ email: email.trim(), password: pass });
      if (res && res.success && res.user) {
        if (res.profile) {
          await StorageService.saveProfile(res.profile);
        }
        const updated = await StorageService.updateCurrentUser({
          ...res.user,
          activeProfileId: res.profile?.id || res.user.activeProfileId,
        });
        return updated;
      }
    } catch (err: any) {
      console.warn('[AuthService] Backend login error:', err?.message);
      // If server returned a clear rejection (e.g. invalid credentials), re-throw
      if (err.message && (err.message.includes('credentials') || err.message.includes('not found') || err.message.includes('password'))) {
        throw err;
      }
    }

    // Fallback to local session
    const user = await StorageService.getCurrentUser();
    return user;
  }

  static async registerUserWithBackend(registrationPayload: any): Promise<any> {
    try {
      // Call AWS Backend
      const res = await apiService.register(registrationPayload);
      if (res && res.success) {
        if (res.profile) {
          await StorageService.saveProfile(res.profile);
        }
        if (res.user) {
          await StorageService.updateCurrentUser({
            ...res.user,
            activeProfileId: res.profile?.id || res.user.activeProfileId,
          });
        }
        return res;
      }
    } catch (err: any) {
      console.warn('[AuthService] Backend registration failed, continuing locally:', err?.message);
      throw err;
    }
  }

  static async logout(): Promise<void> {
    await apiService.clearAuthToken();
  }

  static async toggleAdminMode(): Promise<boolean> {
    const user = await StorageService.getCurrentUser();
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await StorageService.updateCurrentUser({ role: newRole });
    return newRole === 'admin';
  }
}
