import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import theme from '../config/theme';
import { useNavigation } from '../context/NavigationContext';

const DashboardScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <Breadcrumbs />
      <BottomNavigationBar navigation={navigation} currentRoute={navigation.currentRoute} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
});

export default DashboardScreen;
