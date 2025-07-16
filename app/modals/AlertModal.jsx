import { MaterialIcons } from '@expo/vector-icons';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const AlertModal = ({ visible, title, message, confirmText = 'OK', cancelText, onConfirm, onCancel, type = 'info' }) => {
  const isError = type === 'error';
  const isSuccess = type === 'success';
  const isInfo = type === 'info';
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconRow}>
            <MaterialIcons
              name={isError ? 'error-outline' : isSuccess ? 'check-circle-outline' : 'info-outline'}
              size={28}
              color={isError ? '#B91C1C' : isSuccess ? '#059669' : '#2563EB'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.title, isError && styles.errorTitle, isSuccess && styles.successTitle, isInfo && styles.infoTitle]}>{title}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            {cancelText && onCancel && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                isError ? styles.errorButton : isSuccess ? styles.successButton : styles.infoButton,
                styles.confirmButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
  },
  errorTitle: {
    color: '#B91C1C',
  },
  successTitle: {
    color: '#059669',
  },
  infoTitle: {
    color: '#2563EB',
  },
  message: {
    fontSize: 15,
    color: '#444',
    marginBottom: 24,
    textAlign: 'left',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 0,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  confirmButton: {
    marginLeft: 8,
  },
  cancelText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 15,
  },
  confirmText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default AlertModal;
