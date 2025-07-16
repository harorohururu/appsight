import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const DateRangePickerModal = ({ visible, onClose, dateFrom, dateTo, onChangeFrom, onChangeTo }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Date Range</Text>
          <Text style={styles.label}>From</Text>
          <DateTimePicker
            value={dateFrom ? new Date(dateFrom) : new Date()}
            mode="date"
            display="default"
            onChange={onChangeFrom}
            style={styles.picker}
          />
          <Text style={styles.label}>To</Text>
          <DateTimePicker
            value={dateTo ? new Date(dateTo) : new Date()}
            mode="date"
            display="default"
            onChange={onChangeTo}
            style={styles.picker}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: 'stretch',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginTop: 8,
    marginBottom: 4,
  },
  picker: {
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#458ED1',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default DateRangePickerModal;
