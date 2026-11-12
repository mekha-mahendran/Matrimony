import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, LAN_API_BASE_URL } from '../config/api';

const TOKEN_KEY = '@manamaalai_jwt_token';

class ApiService {
  private activeBaseUrl = API_BASE_URL;

  constructor() {
    // Attempt ping to activeBaseUrl, fallback to LAN if needed
    this.detectWorkingUrl();
  }

  private async detectWorkingUrl() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${this.activeBaseUrl}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return;
    } catch {
      // If emulator URL fails, try LAN IP
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 1500);
        const res2 = await fetch(`${LAN_API_BASE_URL}/health`, { signal: controller2.signal });
        clearTimeout(timeoutId2);
        if (res2.ok) {
          this.activeBaseUrl = LAN_API_BASE_URL;
        }
      } catch {}
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch {}
  }

  async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch {}
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(`${this.activeBaseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // --- Auth APIs ---

  async register(registrationData: any): Promise<any> {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
    if (res.token) {
      await this.setAuthToken(res.token);
    }
    return res;
  }

  async login(credentials: { email?: string; phone?: string; identifier?: string; password?: string }): Promise<any> {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      await this.setAuthToken(res.token);
    }
    return res;
  }

  async sendOtp(phone: string): Promise<any> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(phone: string, otp: string): Promise<any> {
    const res = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
    if (res.token) {
      await this.setAuthToken(res.token);
    }
    return res;
  }

  async getMe(): Promise<any> {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  // --- AWS S3 Photo Upload ---

  async uploadPhotoBase64(base64: string, contentType = 'image/jpeg'): Promise<{ url: string; key: string }> {
    return this.request('/upload/base64', {
      method: 'POST',
      body: JSON.stringify({ base64, contentType }),
    });
  }

  // --- Profiles API ---

  async getProfiles(gender?: 'groom' | 'bride'): Promise<any[]> {
    const query = gender ? `?gender=${gender}` : '';
    const res = await this.request(`/profiles${query}`, { method: 'GET' });
    return res.profiles || [];
  }

  async getProfileById(id: string): Promise<any> {
    const res = await this.request(`/profiles/${id}`, { method: 'GET' });
    return res.profile;
  }
}

export const apiService = new ApiService();

