import React from 'react';
import { Language } from '../localization';
import { SignInScreen } from './SignInScreen';

export interface LoginScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onLoginSuccess: () => void;
  onRegisterPress: () => void;
  onForgotPasswordPress?: () => void;
  onBackPress?: () => void;
}

/**
 * LoginScreen displays the dedicated modern Sign In screen matching user's reference design.
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onToggleLanguage,
  onLoginSuccess,
  onRegisterPress,
  onForgotPasswordPress,
  onBackPress,
}) => {
  return (
    <SignInScreen
      language={language}
      onToggleLanguage={onToggleLanguage}
      onLoginSuccess={onLoginSuccess}
      onSignUpPress={onRegisterPress}
      onForgotPasswordPress={onForgotPasswordPress}
      onBackPress={onBackPress}
    />
  );
};
