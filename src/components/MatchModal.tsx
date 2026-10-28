import React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors, Shadows, Typography } from '../theme';
import { CustomIcon } from './CustomIcon';
import { MatrimonyProfile } from '../types';

const { width } = Dimensions.get('window');

interface MatchModalProps {
  visible: boolean;
  matchProfile: MatrimonyProfile | null;
  currentUserPhoto?: string;
  onClose: () => void;
  onStartChat: (profile: MatrimonyProfile) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  matchProfile,
  currentUserPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  onClose,
  onStartChat,
}) => {
  if (!matchProfile) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Decorative Dashed Orbit Paths */}
        <View style={styles.svgContainer} pointerEvents="none">
          <Svg width={width} height={360} viewBox={`0 0 ${width} 360`}>
            {/* Dashed Orbital Arc */}
            <Path
              d={`M -20 220 Q ${width * 0.3} 80 ${width * 0.55} 120 T ${width + 30} 240`}
              fill="none"
              stroke={Colors.sandDark}
              strokeWidth="1.8"
              strokeDasharray="6,6"
            />
            {/* Floating Hearts / Dots */}
            <Circle cx={width * 0.28} cy={95} r={7} fill={Colors.burgundy} />
            <Circle cx={width * 0.76} cy={235} r={5} fill={Colors.dustyPink} />
          </Svg>
        </View>

        {/* Dual Overlapping Tilted Cards */}
        <View style={styles.cardsWrapper}>
          {/* Back Card (Warm Sand) */}
          <View style={[styles.cardContainer, styles.backCard]}>
            <Image source={{ uri: currentUserPhoto }} style={styles.cardImage} />
          </View>

          {/* Front Card (Tilted with Heart Badge) */}
          <View style={[styles.cardContainer, styles.frontCard]}>
            <Image
              source={{
                uri:
                  matchProfile.photos?.[0] ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
              }}
              style={styles.cardImage}
            />
            {/* Small Floating Red Heart Badge */}
            <View style={styles.floatingHeartBadge}>
              <CustomIcon name="heart-filled" size={16} color={Colors.creme} />
            </View>
          </View>
        </View>

        {/* Match Announcement Text */}
        <View style={styles.contentSection}>
          <Text style={styles.matchTitle}>It's a Match!!</Text>
          <Text style={styles.matchTamilTitle}>வாழ்த்துகள் • பொருத்தம் உருவானது!</Text>
          <Text style={styles.matchSubtitle}>
            Both you and {matchProfile.name} have expressed mutual interest. Start a conversation with their family now!
          </Text>

          {/* Primary Action Button: Say Hello */}
          <TouchableOpacity
            style={styles.sayHelloButton}
            activeOpacity={0.88}
            onPress={() => onStartChat(matchProfile)}
          >
            <Text style={styles.sayHelloText}>Start Conversation</Text>
            <CustomIcon name="message" size={18} color={Colors.creme} />
          </TouchableOpacity>

          {/* Secondary Action: Not now */}
          <TouchableOpacity style={styles.laterButton} activeOpacity={0.7} onPress={onClose}>
            <Text style={styles.laterText}>Not now, I'll Do It Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  svgContainer: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardsWrapper: {
    width: width * 0.85,
    height: 290,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  cardContainer: {
    width: 175,
    height: 235,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'absolute',
    ...Shadows.cardHover,
  },
  backCard: {
    backgroundColor: Colors.sandLight,
    transform: [{ rotate: '12deg' }, { translateX: 28 }, { translateY: -12 }],
    zIndex: 1,
    borderWidth: 3,
    borderColor: Colors.sand,
  },
  frontCard: {
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-8deg' }, { translateX: -24 }, { translateY: 10 }],
    zIndex: 2,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  floatingHeartBadge: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: Colors.burgundy,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  contentSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  matchTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: Colors.burgundy,
    fontFamily: Typography.fontSerif,
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  matchTamilTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  matchSubtitle: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  sayHelloButton: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.burgundy,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
    gap: 8,
    ...Shadows.card,
  },
  sayHelloText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.creme,
  },
  laterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  laterText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
