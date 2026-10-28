import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Rect } from 'react-native-svg';
import { Colors } from '../theme';

interface IconProps {
  name:
    | 'home'
    | 'search'
    | 'heart'
    | 'heart-filled'
    | 'user'
    | 'star'
    | 'verified'
    | 'shield'
    | 'bell'
    | 'filter'
    | 'lock'
    | 'unlock'
    | 'crown'
    | 'location'
    | 'briefcase'
    | 'education'
    | 'phone'
    | 'message'
    | 'chevron-right'
    | 'chevron-left'
    | 'chevron-down'
    | 'close'
    | 'check'
    | 'sparkles'
    | 'garland'
    | 'compass'
    | 'share'
    | 'eye'
    | 'admin'
    | 'bolt'
    | 'menu'
    | 'sliders'
    | 'chat-bubble'
    | 'grid'
    | 'deck'
    | 'dots-horizontal'
    | 'arrow-left'
    | 'whatsapp'
    | 'bookmark'
    | 'bookmark-filled'
    | 'skip-forward'
    | 'info'
    | 'phone-call';
  size?: number;
  color?: string;
}

export const CustomIcon: React.FC<IconProps> = ({ name, size = 20, color = Colors.burgundy }) => {
  switch (name) {
    case 'arrow-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 12H5M12 19L5 12L12 5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'whatsapp':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20.5 11.88C20.5 16.64 16.64 20.5 11.88 20.5C10.3 20.5 8.81 20.08 7.51 19.34L3.5 20.5L4.69 16.59C3.9 15.24 3.44 13.68 3.44 12C3.44 7.24 7.3 3.38 12.06 3.38C16.82 3.38 20.68 7.24 20.68 12L20.5 11.88Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9.5 8.5C9.3 8.1 9.1 8.1 8.8 8.1C8.6 8.1 8.4 8.1 8.2 8.3C7.9 8.6 7.2 9.2 7.2 10.5C7.2 11.8 8.1 13 8.3 13.2C8.5 13.4 10.1 16 12.6 17C14.7 17.8 15.1 17.6 15.6 17.5C16.1 17.4 17.1 16.8 17.3 16.1C17.5 15.4 17.5 14.8 17.4 14.7C17.3 14.6 17.1 14.5 16.7 14.3C16.3 14.1 14.4 13.2 14.1 13C13.8 12.8 13.5 12.7 13.3 13.1C13.1 13.5 12.5 14.3 12.3 14.5C12.1 14.7 11.9 14.7 11.5 14.5C11.1 14.3 9.9 13.9 8.5 12.6C7.4 11.6 6.7 10.4 6.5 10C6.3 9.6 6.5 9.4 6.7 9.2C6.9 9 7.1 8.7 7.3 8.5C7.5 8.3 7.6 8.1 7.7 7.9"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'bookmark':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z"
            stroke={color}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'bookmark-filled':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path
            d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z"
            fill={color}
            stroke={color}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'skip-forward':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 18L11 12L5 6M13 18L19 12L13 6"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'info':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
          <Line x1="12" y1="16" x2="12" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="12" cy="8" r="1.2" fill={color} />
        </Svg>
      );
    case 'phone-call':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 16.92V19.92C22 20.48 21.54 20.93 20.98 20.92C10.49 20.44 2.06 12.01 1.58 1.52C1.57 0.96 2.02 0.5 2.58 0.5H5.58C6.09 0.5 6.52 0.88 6.57 1.39C6.67 2.37 6.89 3.32 7.22 4.22C7.36 4.6 7.25 5.03 6.94 5.32L5.27 6.99C7.07 10.53 9.97 13.43 13.51 15.23L15.18 13.56C15.47 13.25 15.9 13.14 16.28 13.28C17.18 13.61 18.13 13.83 19.11 13.93C19.62 13.98 20 14.41 20 14.92V16.92Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'grid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="7" height="7" rx="2" fill={color} />
          <Rect x="14" y="3" width="7" height="7" rx="2" fill={color} />
          <Rect x="3" y="14" width="7" height="7" rx="2" fill={color} />
          <Rect x="14" y="14" width="7" height="7" rx="2" fill={color} />
        </Svg>
      );
    case 'deck':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="2" width="13" height="17" rx="3" stroke={color} strokeWidth="1.8" />
          <Path d="M4 6V19C4 20.1 4.9 21 6 21H16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      );
    case 'dots-horizontal':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Circle cx="5" cy="12" r="2" />
          <Circle cx="12" cy="12" r="2" />
          <Circle cx="19" cy="12" r="2" />
        </Svg>
      );
    case 'bolt':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        </Svg>
      );
    case 'menu':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="3" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </Svg>
      );
    case 'sliders':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Line x1="4" y1="10" x2="4" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Line x1="12" y1="8" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Line x1="20" y1="12" x2="20" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="4" cy="12" r="2.2" fill={color} />
          <Circle cx="12" cy="10" r="2.2" fill={color} />
          <Circle cx="20" cy="14" r="2.2" fill={color} />
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'chat-bubble':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V14H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
          <Line
            x1="16.5"
            y1="16.5"
            x2="21.5"
            y2="21.5"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'heart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'heart-filled':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </Svg>
      );
    case 'user':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.8" />
          <Path
            d="M4 21C4 17 8 14 12 14C16 14 20 17 20 21"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </Svg>
      );
    case 'verified':
    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L4 5V11C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11V5L12 2Z"
            fill={Colors.verifiedBg}
            stroke={color}
            strokeWidth="1.6"
          />
          <Path
            d="M9 11.5L11 13.5L15 9.5"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M13.73 21A2 2 0 0 1 10.27 21"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'filter':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'crown':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 18H21L19 7L14 11L12 4L10 11L5 7L3 18Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={Colors.sandLight}
          />
          <Circle cx="12" cy="3.5" r="1.5" fill={color} />
        </Svg>
      );
    case 'location':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="9" r="2.2" fill={color} />
        </Svg>
      );
    case 'briefcase':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.6" />
          <Path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke={color} strokeWidth="1.6" />
        </Svg>
      );
    case 'education':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 10L12 5L2 10L12 15L22 10Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M6 12V17C6 17 8 19 12 19C16 19 18 17 18 17V12"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'phone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 16.92V19.92C22 20.48 21.54 20.93 20.98 20.92C10.49 20.44 2.06 12.01 1.58 1.52C1.57 0.96 2.02 0.5 2.58 0.5H5.58C6.09 0.5 6.52 0.88 6.57 1.39C6.67 2.37 6.89 3.32 7.22 4.22C7.36 4.6 7.25 5.03 6.94 5.32L5.27 6.99C7.07 10.53 9.97 13.43 13.51 15.23L15.18 13.56C15.47 13.25 15.9 13.14 16.28 13.28C17.18 13.61 18.13 13.83 19.11 13.93C19.62 13.98 20 14.41 20 14.92V16.92Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'message':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 11.5C21 16.19 16.97 20 12 20C10.38 20 8.86 19.59 7.54 18.88L3 20L4.24 16.03C3.46 14.71 3 13.17 3 11.5C3 6.81 7.03 3 12 3C16.97 3 21 6.81 21 11.5Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth="1.6" />
          <Path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </Svg>
      );
    case 'unlock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth="1.6" />
          <Path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'sparkles':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <Path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
        </Svg>
      );
    case 'compass':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
          <Polygon points="16 8 13.5 13.5 8 16 10.5 10.5 16 8" fill={color} />
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
        </Svg>
      );
    case 'admin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.6" />
          <Path d="M7 8H17M7 12H17M7 16H13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </Svg>
      );
    case 'garland':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 4C5 12 19 12 19 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <Circle cx="7" cy="6" r="1.6" fill={Colors.sand} />
          <Circle cx="10" cy="8" r="1.6" fill={Colors.dustyPink} />
          <Circle cx="12" cy="8.5" r="2" fill={color} />
          <Circle cx="14" cy="8" r="1.6" fill={Colors.dustyPink} />
          <Circle cx="17" cy="6" r="1.6" fill={Colors.sand} />
          <Path d="M12 11V16M10 16H14L12 19L10 16Z" fill={Colors.sandDark} stroke={color} strokeWidth="1" />
        </Svg>
      );
  }
};
