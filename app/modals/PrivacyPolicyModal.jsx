import React, { useEffect, useRef } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Easing, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import theme from '../config/theme';

const PrivacyPolicyModal = ({ visible, onClose }) => {
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
              <Text style={styles.heading}>Privacy Policy</Text>
              <Text style={styles.updated}>Last updated: July 18, 2025</Text>
            </View>
            <TouchableOpacity onPress={handleAnimatedClose} style={styles.closeBtn} accessibilityLabel="Close Privacy Policy Modal">
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
            <Text style={[styles.clauseTitle, { marginTop: 0 }]}>Data Privacy Act Compliance</Text>
            <Text style={styles.text}>
              As developers, we strictly comply with the Philippine Data Privacy Act of 2012 (RA 10173). This law protects your right to privacy and ensures that all personal information collected, processed, and stored by SIGHT-Lipa is handled lawfully, transparently, and securely.
            </Text>
            <Text style={styles.text}>
              We only process data with your consent and for legitimate purposes. Our team implements technical, organizational, and physical safeguards to prevent unauthorized access, alteration, or disclosure of your information. You have the right to access, correct, or request deletion of your data at any time. We are committed to regular security reviews and prompt response to any privacy concerns or incidents.
            </Text>
            <Text style={styles.text}>
              We ensure that all personal and sensitive information such as login credentials, contact details, and landmark data is handled with the highest level of confidentiality and security. For more information, visit privacy.gov.ph or contact our support team.
            </Text>
            <Text style={styles.clauseTitle}>1. Data Collection and Usage</Text>
            <Text style={styles.text}>We collect only the necessary information required for user authentication, landmark management, and service improvement.</Text>
            <Text style={styles.text}>Login credentials are securely stored using industry-standard encryption and are never shared with third parties.</Text>
            <Text style={styles.text}>Any data gathered, such as landmark details, contact information, and user activity, is used solely for the purpose of providing and enhancing our services.</Text>
            <Text style={styles.clauseTitle}>2. Data Protection</Text>
            <Text style={styles.text}>All personal and sensitive data is encrypted both in transit and at rest.</Text>
            <Text style={styles.text}>Access to user data is strictly limited to authorized personnel and is protected by robust authentication mechanisms.</Text>
            <Text style={styles.text}>Regular security audits are conducted to ensure the integrity and safety of our systems.</Text>
            <Text style={styles.clauseTitle}>3. User Rights</Text>
            <Text style={styles.text}>Users have the right to access, update, or request deletion of their personal information at any time.</Text>
            <Text style={styles.text}>We do not sell, trade, or disclose user data to external parties without explicit consent, except as required by law.</Text>
            <Text style={styles.clauseTitle}>4. Commitment to Privacy</Text>
            <Text style={styles.text}>The development team is dedicated to maintaining the highest standards of data privacy and security.</Text>
            <Text style={styles.text}>We continuously monitor and update our security practices to address emerging threats</Text>
            <Text style={styles.clauseTitle}>5. Contact Information</Text>
            <Text style={styles.text}>For any questions or concerns regarding data privacy, users may contact our support team at support@sight-lipa.com.</Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

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

export default PrivacyPolicyModal;
