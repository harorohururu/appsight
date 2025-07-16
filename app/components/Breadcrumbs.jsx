import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import theme from '../config/theme';

const BreadcrumbsComponent = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.breadcrumbItem}>
          <Text style={styles.breadcrumbText}>{item}</Text>
          {index < items.length - 1 && (
            <MaterialIcons 
              name="chevron-right" 
              size={16} 
              color={'#8E8E93'} 
              style={styles.separator}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 5,
    backgroundColor: 'transparent',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  separator: {
    marginHorizontal: theme.spacing.xs,
  },
});

export default BreadcrumbsComponent;
