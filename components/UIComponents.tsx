import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  TextInputProps,
  TouchableOpacityProps,
} from 'react-native';
import { Check, AlertCircle } from 'lucide-react-native';

// Colors
export const colors = {
  primary: '#0A84FF',
  primaryDark: '#0071e3',
  secondary: '#34C759',
  accent: '#FF9500',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8A8A8E',
  border: '#D1D1D6',
  disabled: '#C7C7CC',
};

// Button Component
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...rest
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    
    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.disabled;
    return variant === 'outline' ? colors.primary : 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          ...getPadding(),
        },
        style,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.buttonContent}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.buttonText, { color: getTextColor(), fontSize: getFontSize() }]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Input Component
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.inputIconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            style,
            leftIcon && { paddingLeft: 40 },
            rightIcon && { paddingRight: 40 },
          ]}
          placeholderTextColor={colors.textSecondary}
          {...rest}
        />
        {rightIcon && <View style={styles.inputIconRight}>{rightIcon}</View>}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  style?: any;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

// Status Indicator
interface StatusIndicatorProps {
  isActive: boolean;
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isActive,
  label,
}) => {
  return (
    <View style={styles.statusContainer}>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: isActive ? colors.success : colors.error },
        ]}
      />
      {label && (
        <Text
          style={[
            styles.statusText,
            { color: isActive ? colors.success : colors.error },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Button styles
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  
  // Input styles
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    position: 'relative',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  inputIconLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  inputIconRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginLeft: 4,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Status indicator
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});