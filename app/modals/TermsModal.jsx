import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import theme from '../config/theme';

import { Animated, Easing, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
const TermsModal = ({ visible, onClose }) => {
  const translateY = useRef(new Animated.Value(600)).current;
  const scrollRef = useRef();

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(600);
    }
  }, [visible, translateY]);

  // Animate out when X button is clicked
  const handleAnimatedClose = () => {
    Animated.timing(translateY, {
      toValue: 600,
      duration: 320,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  const handleScrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenOverlay}>
        <Animated.View style={[styles.fullScreenCard, { transform: [{ translateY }] }]}> 
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.agreement}>AGREEMENT</Text>
              <Text style={styles.heading}>Terms & Conditions</Text>
              <Text style={styles.updated}>Last updated: July 18, 2025</Text>
            </View>
            <TouchableOpacity onPress={handleAnimatedClose} style={styles.closeBtn} accessibilityLabel="Close Terms & Conditions Modal">
              {/* Use MaterialIcons close icon for better UX */}
              <MaterialIcons name="close" size={28} color="#4B85F5" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <Text style={styles.text}>
              Welcome to SIGHT-Lipa. Please review these Terms & Conditions carefully. As an admin, your access to and use of SIGHT-Lipa is subject to the following terms, which are designed to protect the privacy and rights of data subjects, including landmark owners.
            </Text>
            <Text style={styles.clauseTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>By using SIGHT-Lipa, you agree to comply with these Terms & Conditions and our Privacy Policy.</Text>
            <Text style={styles.clauseTitle}>2. Data Subject Protection</Text>
            <Text style={styles.text}>You must handle all personal and sensitive information, such as landmark names, locations, and owner contact details, with strict confidentiality.</Text>
            <Text style={styles.text}>Do not share, disclose, or misuse any data obtained through SIGHT-Lipa. Only use data for authorized purposes related to SIGHT-Lipa operations.</Text>
            <Text style={styles.clauseTitle}>3. Data Access and Usage</Text>
            <Text style={styles.text}>Access to data is restricted to authorized admins only.</Text>
            <Text style={styles.text}>You are responsible for ensuring that data is accessed and used in accordance with applicable data protection laws. Any unauthorized access, copying, or distribution of data is strictly prohibited.</Text>
            <Text style={styles.clauseTitle}>4. Data Accuracy and Updates</Text>
            <Text style={styles.text}>Admins must ensure that all information entered into SIGHT-Lipa is accurate and up-to-date. Promptly correct any errors or outdated information regarding landmarks or owners.</Text>
            <Text style={styles.clauseTitle}>5. Confidentiality</Text>
            <Text style={styles.text}>All information about landmarks and their owners must be kept confidential. Do not disclose owner contact details or sensitive location information to unauthorized parties.</Text>
            <Text style={styles.clauseTitle}>6. Security</Text>
            <Text style={styles.text}>You must take reasonable steps to protect data from unauthorized access, loss, or misuse. Report any data breaches or incidents to SIGHT-Lipa management immediately.</Text>
            <Text style={styles.clauseTitle}>7. Changes to Terms</Text>
            <Text style={styles.text}>SIGHT-Lipa may update these Terms & Conditions at any time. Continued use of the system after changes means you accept the revised terms.</Text>
            <Text style={styles.clauseTitle}>8. Contact</Text>
            <Text style={styles.text}>For questions or concerns about these Terms & Conditions or data protection practices, please contact the SIGHT-Lipa management team.</Text>
          </ScrollView>
          {/* Removed Scroll to Bottom button */}
        </Animated.View>
      </View>
    </Modal>
  );

}
export default TermsModal;
const styles = {
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fullScreenCard: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 18,
    borderLeftWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
    maxHeight: '100%',
    // Remove swipe down to close logic by not handling gestures
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 0,
    marginTop: 24,
  },
  agreement: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6C7D7D',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#4B85F5',
    marginBottom: 2,
  },
  updated: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6C7D7D',
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 10,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#4B85F5',
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  content: {
    paddingBottom: 18,
  },
  clauseTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#4B85F5',
    marginTop: 12,
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.tertiary,
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 8,
  },
};
