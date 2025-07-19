import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { HelperText, Button as PaperButton, Text, TextInput } from 'react-native-paper';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import { API_URL } from '../config/config';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import AlertModal from './AlertModal';

// Remove mock types

const AddLandmarkModal = ({ visible, onClose, animationType, fullHeight }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    landmark_type: '',
    address: '',
    total_rooms: '',
    attraction_code: '',
  });
  const [contactPerson, setContactPerson] = useState({
    name: '',
    contact_type: 'phone',
    value: '',
  });
  const [landmarkTypes, setLandmarkTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'error' });
  const [touched, setTouched] = useState({});
  const contactTypes = ['phone', 'telephone', 'email'];

  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const addressRef = useRef(null);
  const totalRoomsRef = useRef(null);
  const contactNameRef = useRef(null);
  const contactTypeRef = useRef(null);
  const contactValueRef = useRef(null);

  useEffect(() => {
    // Fetch landmark types from backend
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${API_URL}/landmark_type`);
        const data = await res.json();
        console.log('[AddLandmarkModal] Fetched landmark types:', data);
        setLandmarkTypes(data);
      } catch (err) {
        console.error('[AddLandmarkModal] Error fetching landmark types:', err);
        setLandmarkTypes([]);
      }
    };
    fetchTypes();
    setFormData(f => ({ ...f, landmark_type: '' }));
    setContactPerson(c => ({ ...c, contact_type: '' }));
  }, []);

  // Step 1: Validate all form fields before saving
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.landmark_type) newErrors.landmark_type = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    const selectedType = landmarkTypes.find(t => t.type_id === formData.landmark_type);
    if (selectedType && (selectedType.type_name === 'Hotel' || selectedType.type_name === 'Resort' || selectedType.type_name === 'Hotels' || selectedType.type_name === 'Resorts')) {
      if (!formData.total_rooms || isNaN(formData.total_rooms) || parseInt(formData.total_rooms) <= 0) {
        newErrors.total_rooms = 'Required';
      }
    }
    if (!contactPerson.name.trim()) newErrors.contactPersonName = 'Required';
    if (!contactPerson.contact_type) newErrors.contactPersonType = 'Required';
    if (!contactPerson.value.trim()) newErrors.contactPersonValue = 'Required';
    else if (contactPerson.contact_type === 'email' && !isValidEmail(contactPerson.value)) {
      newErrors.contactPersonValue = 'Invalid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Step 2: When user presses Add, validate and then create the landmark and contact
  const handleSave = async () => {
    console.log('[AddLandmarkModal] handleSave called');
    if (!validateForm()) {
      console.log('[AddLandmarkModal] Validation failed', { formData, contactPerson, errors });
      setAlert({ visible: true, title: 'Validation Error', message: 'Please fill all required fields', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      // Only send the selected contact type and value
      let contactPayload = null;
      if (contactPerson.name && contactPerson.contact_type && contactPerson.value) {
        contactPayload = {
          name: contactPerson.name,
          contact_type: contactPerson.contact_type,
          value: contactPerson.value
        };
      }
      const payload = {
        name: formData.name,
        landmark_type: formData.landmark_type,
        address: formData.address,
        total_rooms: formData.total_rooms,
        attraction_code: formData.attraction_code,
        contact_person: contactPayload,
      };
      console.log('[AddLandmarkModal] Sending POST /landmarks payload:', payload);
      const res = await fetch(`${API_URL}/landmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setLoading(false);
        setFormData({ name: '', landmark_type: '', address: '', total_rooms: '', attraction_code: '' });
        setContactPerson({ name: '', contact_type: '', value: '' });
        console.log('[AddLandmarkModal] Landmark added successfully');
        navigation.replace('landmarks');
      } else {
        setLoading(false);
        let errorMsg = 'Failed to add landmark.';
        try {
          const errorData = await res.json();
          if (errorData.details) errorMsg += `\nReason: ${errorData.details}`;
        } catch {}
        console.error('[AddLandmarkModal] Error adding landmark:', errorMsg);
        setAlert({ visible: true, title: 'Error', message: errorMsg, type: 'error' });
      }
    } catch (err) {
      setLoading(false);
      console.error('[AddLandmarkModal] Network error:', err);
      setAlert({ visible: true, title: 'Error', message: 'Network error.', type: 'error' });
    }
  };

  const requiresRooms = () => {
    const selectedType = landmarkTypes.find(t => t.type_id === formData.landmark_type);
    return [2, 3, 4, 5, 6].includes(Number(formData.landmark_type));
  };

  // Progressive validation: validate onBlur for each field
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // Validate a single field
  const validateField = (field) => {
    let error = '';
    if (field === 'name' && !formData.name.trim()) error = 'Required';
    if (field === 'address' && !formData.address.trim()) error = 'Required';
    if (field === 'total_rooms' && requiresRooms() && (!formData.total_rooms || isNaN(formData.total_rooms) || parseInt(formData.total_rooms) <= 0)) error = 'Required';
    if (field === 'contactPersonName' && !contactPerson.name.trim()) error = 'Required';
    if (field === 'contactPersonValue') {
      if (!contactPerson.value.trim()) error = 'Required';
      else if (contactPerson.contact_type === 'email' && !isValidEmail(contactPerson.value)) error = 'Invalid email';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType || "slide"}
      transparent={true}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={[styles.modalOverlay, fullHeight && styles.modalFullHeight]}>
          <View style={[styles.modalContent, fullHeight && styles.modalContentFullHeight]}>
            <Header 
              title="Add Landmark"
              navigation={navigation}
              showBackButton
              onBackPress={() => navigation.navigate('landmarks')}
            />
            <Breadcrumbs items={['Dashboard', 'Landmarks', 'Add Landmark']} />
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.sectionTitle}>Landmark Details</Text>
              <View style={styles.formContainer}>
                <Text style={styles.label}>Landmark Name</Text>
                <TextInput
                  ref={nameRef}
                  value={formData.name}
                  onChangeText={text => setFormData({ ...formData, name: text })}
                  onBlur={() => handleBlur('name')}
                  style={styles.input}
                  mode="outlined"
                  error={!!errors.name && (touched.name || loading)}
                  placeholder="e.g. Grand Hotel"
                  left={<TextInput.Icon icon={() => <MaterialIcons name="place" size={20} color="#888" />} />}
                  returnKeyType="next"
                  onSubmitEditing={() => typeRef.current?.focus()}
                />
                {!!errors.name && (touched.name || loading) && <HelperText type="error" visible style={styles.helperText}>{errors.name}</HelperText>}
                <Text style={styles.label}>Landmark Type</Text>
                <View
                  style={[styles.picker, touched.landmark_type && !!errors.landmark_type && styles.pickerError]}
                  onTouchEnd={() => {
                    setTouched(t => ({ ...t, landmark_type: true }));
                    if (!formData.landmark_type) setErrors(e => ({ ...e, landmark_type: 'Required' }));
                  }}
                >
                  <Picker
                    ref={typeRef}
                    selectedValue={formData.landmark_type}
                    onValueChange={value => {
                      setFormData({ ...formData, landmark_type: value });
                      setTouched(t => ({ ...t, landmark_type: true }));
                      if (!value) {
                        setErrors(e => ({ ...e, landmark_type: 'Required' }));
                      } else {
                        setErrors(e => ({ ...e, landmark_type: undefined }));
                      }
                    }}
                    style={{ minHeight: 44, height: 'auto' }}
                    onBlur={() => {
                      setTouched(t => ({ ...t, landmark_type: true }));
                      if (!formData.landmark_type) setErrors(e => ({ ...e, landmark_type: 'Required' }));
                    }}
                  >
                    <Picker.Item label="Select type..." value="" color="#aaa" />
                    {landmarkTypes.map(type => (
                      <Picker.Item key={type.type_id} label={type.type_name} value={type.type_id} />
                    ))}
                  </Picker>
                </View>
                {!!errors.landmark_type && (touched.landmark_type || loading) && (
                  <HelperText type="error" visible style={styles.helperText}>{errors.landmark_type}</HelperText>
                )}

                <Text style={styles.label}>Attraction Code</Text>
                <TextInput
                  value={formData.attraction_code}
                  onChangeText={text => setFormData({ ...formData, attraction_code: text })}
                  style={styles.input}
                  mode="outlined"
                  error={!!errors.attraction_code && (touched.attraction_code || loading)}
                  placeholder="e.g. ATX-001"
                />
                <Text style={styles.label}>Address</Text>
                <TextInput
                  ref={addressRef}
                  value={formData.address}
                  onChangeText={text => setFormData({ ...formData, address: text })}
                  onBlur={() => handleBlur('address')}
                  style={styles.input}
                  mode="outlined"
                  multiline={false}
                  contentStyle={{ justifyContent: 'center' }}
                  error={!!errors.address && (touched.address || loading)}
                  placeholder="Street, City, Country"
                  left={<TextInput.Icon icon={() => <MaterialIcons name="location-on" size={20} color="#888" />} />}
                  returnKeyType="next"
                  onSubmitEditing={() => requiresRooms() ? totalRoomsRef.current?.focus() : Keyboard.dismiss()}
                />
                {!!errors.address && (touched.address || loading) && <HelperText type="error" visible style={styles.helperText}>{errors.address}</HelperText>}
                {requiresRooms() && (
                  <>
                    <Text style={styles.label}>Total Rooms (optional)</Text>
                    <TextInput
                      ref={totalRoomsRef}
                      value={formData.total_rooms}
                      onChangeText={text => setFormData({ ...formData, total_rooms: text })}
                      onBlur={() => handleBlur('total_rooms')}
                      style={styles.input}
                      mode="outlined"
                      keyboardType="numeric"
                      error={!!errors.total_rooms && (touched.total_rooms || loading)}
                      placeholder="e.g. 100"
                      left={<TextInput.Icon icon={() => <MaterialIcons name="hotel" size={20} color="#888" />} />}
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    {/* Only show error if user entered something invalid, not if left blank */}
                    {!!errors.total_rooms && formData.total_rooms && (touched.total_rooms || loading) && <HelperText type="error" visible style={styles.helperText}>{errors.total_rooms}</HelperText>}
                  </>
                )}
              </View>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              <View style={styles.formContainer}>
                <Text style={styles.label}>Contact Name</Text>
                <TextInput
                  ref={contactNameRef}
                  value={contactPerson.name}
                  onChangeText={text => setContactPerson({ ...contactPerson, name: text })}
                  onBlur={() => handleBlur('contactPersonName')}
                  style={styles.input}
                  mode="outlined"
                  error={!!errors.contactPersonName && (touched.contactPersonName || loading)}
                  placeholder="e.g. John Doe"
                  left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#888" />} />}
                  returnKeyType="next"
                  onSubmitEditing={() => contactTypeRef.current?.focus()}
                />
                {!!errors.contactPersonName && (touched.contactPersonName || loading) && <HelperText type="error" visible style={styles.helperText}>{errors.contactPersonName}</HelperText>}
                <Text style={styles.label}>Type</Text>
                <View style={[styles.picker, touched.contactPersonType && !!errors.contactPersonType && styles.pickerError]}> 
                  <Picker
                    ref={contactTypeRef}
                    selectedValue={contactPerson.contact_type}
                    onValueChange={value => {
                      setContactPerson({ ...contactPerson, contact_type: value, value: '' });
                      setTouched(t => ({ ...t, contactPersonType: true }));
                      if (!value) {
                        setErrors(e => ({ ...e, contactPersonType: 'Required' }));
                      } else {
                        setErrors(e => ({ ...e, contactPersonType: undefined }));
                      }
                    }}
                    style={{ minHeight: 44, height: 'auto' }}
                    onBlur={() => {
                      setTouched(t => ({ ...t, contactPersonType: true }));
                      if (!contactPerson.contact_type) setErrors(e => ({ ...e, contactPersonType: 'Required' }));
                    }}
                  >
                    <Picker.Item label="Select type..." value="" color="#aaa" />
                    {contactTypes.map(type => (
                      <Picker.Item
                        key={type}
                        label={type.charAt(0).toUpperCase() + type.slice(1)}
                        value={type}
                      />
                    ))}
                  </Picker>
                </View>
                {!!errors.contactPersonType && (touched.contactPersonType || loading) && <HelperText type="error" visible style={styles.helperText}>{errors.contactPersonType}</HelperText>}
                <Text style={styles.label}>Contact</Text>
                <TextInput
                  ref={contactValueRef}
                  value={contactPerson.value}
                  onChangeText={text => setContactPerson({ ...contactPerson, value: text })}
                  onBlur={() => handleBlur('contactPersonValue')}
                  style={styles.input}
                  mode="outlined"
                  keyboardType={contactPerson.contact_type === 'email' ? 'email-address' : 'default'}
                  error={!!errors.contactPersonValue && (touched.contactPersonValue || loading)}
                  placeholder={contactPerson.contact_type === 'email' ? 'e.g. john@email.com' : 'e.g. 09123456789'}
                  left={<TextInput.Icon icon={() => <MaterialIcons name={contactPerson.contact_type === 'email' ? 'email' : 'phone'} size={20} color="#888" />} />}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                {!!errors.contactPersonValue && (touched.contactPersonValue || loading) && <HelperText type="error" visible style={styles.helperText}>{errors.contactPersonValue}</HelperText>}
              </View>
              <PaperButton
                mode="contained"
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
                icon="check"
                contentStyle={{ flexDirection: 'row-reverse' }}
              >
                Add
              </PaperButton>
            </ScrollView>
            <AlertModal
              visible={alert.visible}
              title={alert.title}
              message={alert.message}
              type={alert.type}
              confirmText="OK"
              onConfirm={alert.onClose ? alert.onClose : () => setAlert(a => ({ ...a, visible: false }))}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalFullHeight: {
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 320,
    maxHeight: '90%',
  },
  modalContentFullHeight: {
    borderRadius: 0,
    minHeight: '100%',
    maxHeight: '100%',
    paddingTop: 32,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 32,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#8B0000',
    marginTop: 15,
    marginBottom: 18,
  },
  formContainer: {
    width: 280,
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
    color: '#8B0000',
    fontSize: 14,
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    width: '100%',
    alignSelf: 'center',
    textAlignVertical: 'center',
    height: 48,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F7F8FA',
    width: '100%',
    alignSelf: 'center',
    minHeight: 44,
    height: 'auto',
    paddingVertical: 2,
    marginBottom: 18,
  },
  pickerError: {
    borderWidth: 2,
    borderColor: '#B91C1C',
  },
  helperText: {
    marginBottom: 10,
    color: '#B91C1C',
    textAlign: 'left',
    marginLeft: 2,
  },
  stickyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    maxWidth: 200,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
    maxWidth: 200,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  reviewText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#8B0000',
    marginBottom: 6,
  },
  reviewValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#222',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepperStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
  },
  stepCircleActive: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  stepNumber: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    marginLeft: 7,
    marginRight: 0,
    color: '#aaa',
    fontSize: 15,
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'left',
  },
  stepLabelActive: {
    color: '#8B0000',
  },
  stepLine: {
    width: 38,
    height: 2,
    backgroundColor: '#eee',
    marginHorizontal: -2,
    borderRadius: 1,
  },
  stepLineActive: {
    backgroundColor: '#eee',
  },
});

export default AddLandmarkModal;
