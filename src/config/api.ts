import { Platform } from 'react-native';

/**
 * Backend API Configuration
 * 
 * - Android Emulator uses: 10.0.2.2:5000
 * - iOS Simulator / Web uses: localhost:5000
 * - Physical Device on LAN uses your machine's IP (e.g. 10.145.103.45:5000)
 */
export const API_BASE_URL = 'https://d77b-106-192-65-218.ngrok-free.app/api'
// export const API_BASE_URL = ''

// LAN IP alternative for physical Android/iOS test devices
export const LAN_API_BASE_URL = 'http://10.145.103.45:5000/api';

