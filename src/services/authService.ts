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

    throw new Error('Verification failed. Please check your account status.');
  }

  static async loginWithEmail(email: string, pass: string): Promise<CurrentUser> {
    if (!email || !pass) {
      throw new Error('Please enter email and password');
    }

    // Connect to AWS Backend and enforce admin approval & suspension checks
    const res = await apiService.login({ email: email.trim(), password: pass });

    if (res && res.success && res.user) {
      // Double-check profile moderation status on client side as well
      const profile = res.profile;
      const status = (
        profile?.status ||
        res.user?.status ||
        (profile?.isVerified === true ? 'approved' : 'pending')
      ).toLowerCase();

      if (status === 'suspended') {
        await apiService.clearAuthToken();
        throw new Error(
          'Your account has been suspended by the administrator. Please contact support.'
        );
      }

      if (status === 'rejected') {
        await apiService.clearAuthToken();
        throw new Error(
          profile?.rejectionReason
            ? `Your profile verification was rejected: ${profile.rejectionReason}`
            : 'Your profile verification was rejected by the administrator.'
        );
      }

      if (status !== 'approved' && status !== 'active' && profile?.isVerified !== true) {
        await apiService.clearAuthToken();
        throw new Error(
          'Your profile is currently pending admin approval. You can log in once the administrator approves your profile.'
        );
      }

      if (profile) {
        await StorageService.saveProfile(profile);
      }
      const updated = await StorageService.updateCurrentUser({
        ...res.user,
        activeProfileId: profile?.id || res.user.activeProfileId,
      });
      return updated;
    }

    throw new Error(res?.message || 'Sign in failed');
  }

  static async registerUserWithBackend(registrationPayload: any): Promise<any> {
    try {
      // Call AWS Backend to register profile (created with status: 'pending')
      const res = await apiService.register(registrationPayload);
      // Clear token immediately after registration because user must wait for Admin approval before logging in
      await apiService.clearAuthToken();
      if (res && res.success) {
        if (res.profile) {
          await StorageService.saveProfile(res.profile);
        }
        return res;
      }
    } catch (err: any) {
      console.warn('[AuthService] Backend registration error:', err?.message);
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
