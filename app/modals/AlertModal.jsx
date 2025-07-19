import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
// ...existing code...
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import theme from '../config/theme';

const AlertModal = ({ visible, title, message, confirmText = 'OK', cancelText, onConfirm, onCancel, type = 'info' }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);
  const isError = type === 'error';
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';
  let iconName = 'info';
  let iconColor = '#F04349'; // tertiary color
  let borderColor = '#F04349';
  let headerColor = theme.colors.tertiary;
  if (isError) {
    iconName = 'error';
    iconColor = '#F04349';
    borderColor = '#F04349';
    headerColor = '#F04349';
  } else if (isSuccess) {
    iconName = 'check-circle';
    iconColor = '#01E17B';
    borderColor = '#01E17B';
    headerColor = '#01E17B';
  } else if (isWarning) {
    iconName = 'warning';
    iconColor = '#FDCD0F';
    borderColor = '#FDCD0F';
    headerColor = '#FDCD0F';
  }
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { borderLeftColor: borderColor, opacity: opacityAnim }]}> 
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <MaterialIcons name={iconName} size={24} color={iconColor} />
            </View>
            <Text style={[styles.heading, { color: headerColor }]}>{title}</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <MaterialIcons name="close" size={24} color={theme.colors.tertiary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{message}</Text>
          <View style={styles.buttonRow}>
            {cancelText && (
              <TouchableOpacity style={styles.dismissBtn} onPress={onCancel}>
                <Text style={styles.dismissText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmBtn, isWarning && styles.confirmBtnWarning]}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText, isWarning && styles.confirmTextWarning]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  
  );
};

const styles = StyleSheet.create({
  // learnBtn and learnText removed
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 9999,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    width: '90%',
    maxWidth: 340,
    borderLeftWidth: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'left',
    justifyContent: 'center',
    marginRight: 6
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: theme.colors.tertiary,
    flex: 1,
    marginRight: 8,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.tertiary,
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    marginLeft: 39, // Align with icon
    width: '80%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  confirmBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  confirmBtnWarning: {
    backgroundColor: '#fff',
    borderColor: '#FDCD0F',
    borderWidth: 2,
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  confirmTextWarning: {
    color: theme.colors.tertiary,
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  dismissBtn: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  dismissText: {
    color: theme.colors.tertiary,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
});

export default AlertModal;
