import { MaterialIcons } from '@expo/vector-icons';
// ...existing code...
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import theme from '../config/theme';

const BottomNavigationBar = ({ navigation, currentRoute = 'dashboard' }) => {
  const routes = [
    { key: 'dashboard', title: 'Dashboard', icon: 'dashboard' },
    { key: 'landmarks', title: 'Landmark', icon: 'home' },
    { key: 'qrcode', title: 'QR Code', icon: 'qr-code' },
    { key: 'reports', title: 'Reports', icon: 'folder' },
  ];

  const handlePress = (routeKey) => {
    if (navigation && navigation.navigate) {
      navigation.navigate(routeKey);
    } else if (navigation && navigation.replace) {
      navigation.replace(routeKey);
    } else if (navigation && navigation.push) {
      navigation.push(routeKey);
    } else if (navigation && navigation.setCurrentRoute) {
      navigation.setCurrentRoute(routeKey);
    }
  };

  return (
    <View style={styles.navBarWrapper}>
      <View style={styles.navBarPill}>
        {routes.map((route) => {
          const isActive = currentRoute === route.key;
          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.navBarItem, isActive && styles.navBarItemActive, isActive ? styles.navBarItemActiveFlex : styles.navBarItemInactiveFlex]}
              onPress={() => handlePress(route.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconLabelWrapper, isActive && styles.iconLabelActive]}>
                <MaterialIcons
                  name={route.icon}
                  size={isActive ? 24 : 20}
                  color={isActive ? theme.colors.primary : '#fff'}
                />
                {isActive && (
                  <Text style={styles.activeLabel}>{route.title}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: 'center',
    zIndex: 100,
  },
  navBarPill: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 345,
  },
  navBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderRadius: 24,
  },
  navBarItemActive: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  navBarItemActiveFlex: {
    flex: 1.3,
  },
  navBarItemInactiveFlex: {
    flex: 0.7,
  },
  iconLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeLabel: {
    fontFamily: 'Poppins-Bold',
    color: theme.colors.primary,
    fontSize: 13,
  },
});

export default BottomNavigationBar;
