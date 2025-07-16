import { MaterialIcons } from '@expo/vector-icons';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import theme from '../config/theme';

const BottomNavigationBar = ({ navigation, currentRoute = 'dashboard' }) => {
  const routes = [
    { 
      key: 'dashboard', 
      title: 'Dashboard', 
      icon: 'dashboard'
    },
    { 
      key: 'landmarks', 
      title: 'Landmarks', 
      icon: 'place'
    },
    { 
      key: 'qrcode', 
      title: 'QR Code', 
      icon: 'qr-code'
    },
    {
      key: 'reports',
      title: 'Reports',
      icon: 'bar-chart', // Use a suitable Material icon
    },
  ];

  const handlePress = (routeKey) => {
    if (navigation && navigation.replace) {
      navigation.replace(routeKey);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingNav}>
        <View style={styles.navContent}>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.key}
              style={styles.navItem}
              onPress={() => handlePress(route.key)}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={route.icon} 
                size={24} 
                color={currentRoute === route.key ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <Text 
                style={[
                  styles.navLabel, 
                  { color: currentRoute === route.key ? theme.colors.primary : theme.colors.onSurfaceVariant }
                ]}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  floatingNav: {
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    ...(Platform.OS === 'android' && {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    }),
  },
  navContent: {
    flexDirection: 'row',
    height: 75,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default BottomNavigationBar;
