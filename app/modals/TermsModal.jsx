import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../config/theme';

const TermsModal = ({ visible, onClose }) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Terms & Conditions</Text>
          <Text style={styles.text}>
            By logging in, you agree to abide by the app’s rules and usage policies. All data entered in the app, including contacts and landmarks, will be handled securely and used only for app purposes. Your credentials and activity are not shared with third parties. For more details, please review our Privacy Policy.
          </Text>
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  content: {
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
    textAlign: 'left',
  },
  closeButton: {
    marginTop: theme.spacing.lg,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default TermsModal;
