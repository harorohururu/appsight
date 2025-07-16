import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../config/theme';

const Button = ({ 
  title,
  onPress,
  icon,
  disabled = false,
  loading = false,
  style,
  buttonColor,
  textColor,
  size = 'medium',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (size === 'small') {
      baseStyle.push(styles.smallButton);
    } else if (size === 'large') {
      baseStyle.push(styles.largeButton);
    }
    
    if (disabled && !loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (buttonColor) {
      baseStyle.push({ backgroundColor: buttonColor });
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getLabelStyle = () => {
    const baseStyle = [styles.label];
    
    if (size === 'small') {
      baseStyle.push(styles.smallLabel);
    } else if (size === 'large') {
      baseStyle.push(styles.largeLabel);
    }
    
    if (textColor) {
      baseStyle.push({ color: textColor });
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={1}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {icon && <MaterialIcons name={icon} size={18} color={textColor || theme.colors.onPrimary} style={{ marginRight: 6 }} />}
        <Text style={getLabelStyle()}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.small,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  largeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  disabledButton: {
    opacity: 0.6,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    letterSpacing: 0.5,
    color: theme.colors.onPrimary,
  },
  smallLabel: {
    fontSize: 12,
  },
  largeLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default Button;
