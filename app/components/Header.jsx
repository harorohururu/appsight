import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import theme from '../config/theme';

const Header = ({ title }) => {
  return (
    <Appbar.Header style={styles.header}>
      <View style={styles.leftSectionWrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.secondary,
    elevation: 0,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  leftSectionWrapper: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    color: theme.colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    textAlign: 'left',
    letterSpacing: -1,
    paddingHorizontal: 14
  },
});

export default Header;
