import { CurrentUser, Gender, ProfileCreatedFor } from '../types';
import { StorageService } from './storage';

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

    // In development/test mode, use deterministic safe mock OTP
    const mockOtp = '123456';
    this.generatedOtp = mockOtp;
    this.otpTargetPhone = cleanPhone;

    return {
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone.slice(-10)}`,
      demoOtp: mockOtp,
    };
  }

  static async verifyOtp(phone: string, enteredOtp: string): Promise<CurrentUser> {
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Allow 123456 or matching OTP
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

    // Return current user session
    return currentUser;
  }

  static async loginWithEmail(email: string, pass: string): Promise<CurrentUser> {
    if (!email || !pass) {
      throw new Error('Please enter email and password');
    }
    const user = await StorageService.getCurrentUser();
    return user;
  }

  static async logout(): Promise<void> {
    // Keep data intact but reset session flags
  }

  static async toggleAdminMode(): Promise<boolean> {
    const user = await StorageService.getCurrentUser();
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await StorageService.updateCurrentUser({ role: newRole });
    return newRole === 'admin';
  }
}
