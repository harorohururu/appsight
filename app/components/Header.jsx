import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import config from '../config/config';
import theme from '../config/theme';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../modals/AlertModal';

const Header = ({ title, showBackButton = false, onBackPress, navigation }) => {
  const { logout } = useAuth();
  const [alertVisible, setAlertVisible] = React.useState(false);

  const handleLogout = () => {
    setAlertVisible(false);
    logout();
  };

  return (
    <Appbar.Header style={styles.header}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <Appbar.BackAction onPress={onBackPress ? onBackPress : () => navigation && navigation.replace && navigation.replace('landmarks')} color={theme.colors.onSurface} />
        )}
      </View>

      <View style={styles.centerSectionWrapper}>
        <View style={styles.centerSection}>
          <Text style={styles.title}>{config.APP_NAME}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Appbar.Action
          icon={() => <MaterialIcons name="logout" size={24} color="#8B0000" />}
          onPress={() => setAlertVisible(true)}
        />
      </View>

      <AlertModal
        visible={alertVisible}
        title="Logout?"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        type="info"
        onConfirm={handleLogout}
        onCancel={() => setAlertVisible(false)}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSectionWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: theme.colors.primary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: -1,
  },
});

export default Header;
