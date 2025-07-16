import { MaterialIcons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import theme from '../config/theme';

const Card = ({ 
  title, 
  subtitle, 
  description, 
  icon, 
  iconColor = theme.colors.primary,
  onPress, 
  style,
  elevation = 0,
  children 
}) => {
  return (
    <PaperCard 
      style={[styles.card, style]} 
      onPress={onPress}
      elevation={0}
    >
      <PaperCard.Content style={styles.content}>
        <View style={styles.contentWrapper}>
          <View style={styles.leftSection}>
            {icon && (
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name={icon} 
                  size={Platform.OS === 'android' ? 18 : 20} 
                  color={iconColor} 
                  style={styles.icon}
                />
              </View>
            )}
          </View>
          <View style={styles.rightSection}>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">{subtitle}</Text>
            )}
            {title && (
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            )}
            {children}
          </View>
        </View>
      </PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 0,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    flex: 1,
    height: '100%',
  },
  content: {
    padding: 0,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  leftSection: {
    marginRight: Platform.OS === 'android' ? theme.spacing.sm : theme.spacing.md,
  },
  iconContainer: {
    width: Platform.OS === 'android' ? 32 : 36,
    height: Platform.OS === 'android' ? 32 : 36,
    borderRadius: Platform.OS === 'android' ? 16 : 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    minWidth: 0,
  },
  icon: {
    margin: 0,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: Platform.OS === 'android' ? 20 : 24,
    color: theme.colors.onSurface,
    marginBottom: 0,
    textAlign: 'left',
    lineHeight: Platform.OS === 'android' ? 22 : 26,
    flexShrink: 1,
    numberOfLines: 1,
  },
  subtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: Platform.OS === 'android' ? 11 : 13,
    color: theme.colors.primary,
    marginBottom: 2,
    textAlign: 'left',
    lineHeight: Platform.OS === 'android' ? 14 : 16,
    flexShrink: 1,
    numberOfLines: 2,
  },
});

export default Card;
