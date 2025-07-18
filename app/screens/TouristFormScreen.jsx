import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HelperText, Button as PaperButton, Text, TextInput } from 'react-native-paper';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import { useNavigation } from '../context/NavigationContext';
import countries from '../data/countries';
import landmarks from '../data/landmarks';
import landmarkTypes from '../data/landmarkTypes';
import AlertModal from '../modals/AlertModal';
import PrivacyConsentModal from '../modals/PrivacyConsentModal';

const TouristFormScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    allocation: '',
    nationality: '',
    num_male: '',
    num_female: '',
    num_foreign_male: '',
    num_foreign_female: '',
    visited_landmark: '',
    stay_duration: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const allocationRef = useRef(null);
  const nationalityRef = useRef(null);
  const landmarkRef = useRef(null);
  const stayDurationRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.allocation) newErrors.allocation = 'Required';
    if (!formData.nationality) newErrors.nationality = 'Required';
    if (!formData.visited_landmark) newErrors.visited_landmark = 'Required';
    // Visitor counts: at least one required
    if (!formData.num_male && !formData.num_female && !formData.num_foreign_male && !formData.num_foreign_female) {
      newErrors.num_male = 'Required';
      newErrors.num_female = 'Required';
      newErrors.num_foreign_male = 'Required';
      newErrors.num_foreign_female = 'Required';
    }
    // Stay duration required for hotel/resort
    if ((landmarkTypes.find(t => t.type_id === (landmarks.find(l => l.info_id === formData.visited_landmark)?.landmark_type))?.type_name === 'Hotel' ||
         landmarkTypes.find(t => t.type_id === (landmarks.find(l => l.info_id === formData.visited_landmark)?.landmark_type))?.type_name === 'Resort') &&
        (!formData.stay_duration || parseInt(formData.stay_duration) <= 0)) {
      newErrors.stay_duration = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertVisible(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <AlertModal
        visible={alertVisible}
        title="Validation Error"
        message="Please fill all required fields."
        type="error"
        onConfirm={() => setAlertVisible(false)}
      />
      <Header 
        title="Tourist Registration Form"
        navigation={navigation}
        showBackButton
        onBackPress={() => navigation.navigate('qrcode')}
      />
      <Breadcrumbs items={['Home', 'QR Code', 'Tourist Form']} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Tourist Preview Form</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Allocation Type</Text>
        <Text style={{ fontSize: 12, color: '#888', marginBottom: 8, alignSelf: 'flex-start', marginLeft: 2 }}>
          Select the type of residency or visitor allocation for this tourist.
        </Text>
          <View style={styles.picker}>
            <Picker
              ref={allocationRef}
              selectedValue={formData.allocation}
              onValueChange={value => setFormData({ ...formData, allocation: value })}
              style={{ minHeight: 44, height: 'auto' }}
              onBlur={() => handleBlur('allocation')}
            >
              <Picker.Item label="Select type..." value="" color="#aaa" />
              {['Lipa Residency','Lipa Residency with Foreign','Other Province','Other Province with Foreign','Foreign Residency'].map(type => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          {!!errors.allocation && touched.allocation && <HelperText type="error" visible style={styles.helperText}>{errors.allocation}</HelperText>}
          {/* Nationality only for 'with foreigner' or 'foreigner' allocation types */}
          {['Lipa Residency with Foreign','Other Province with Foreign','Foreign Residency'].includes(formData.allocation) && (
            <>
              <Text style={styles.label}>Nationality</Text>
              <Text style={{ fontSize: 12, color: '#888', marginBottom: 8, alignSelf: 'flex-start', marginLeft: 2 }}>
                Choose the nationality of the foreign visitor.
              </Text>
              <View style={styles.picker}>
                <Picker
                  ref={nationalityRef}
                  selectedValue={formData.nationality}
                  onValueChange={value => setFormData({ ...formData, nationality: value })}
                  style={{ minHeight: 44, height: 'auto' }}
                  onBlur={() => handleBlur('nationality')}
                >
                  <Picker.Item label="Select nationality..." value="" color="#aaa" />
                  {countries.map(country => (
                    <Picker.Item key={country} label={country} value={country} />
                  ))}
                </Picker>
              </View>
              {!!errors.nationality && touched.nationality && <HelperText type="error" visible style={styles.helperText}>{errors.nationality}</HelperText>}
            </>
          )}
          <Text style={styles.label}>Visitor Count</Text>
        <Text style={{ fontSize: 12, color: '#888', marginBottom: 8, alignSelf: 'flex-start', marginLeft: 2 }}>
          Enter the number of male and female visitors. For foreign visitors, fill in the respective fields.
        </Text>
          {/* Foreign visitor count only for 'with foreigner' or 'foreigner' allocation types */}
          {['Lipa Residency with Foreign','Other Province with Foreign','Foreign Residency'].includes(formData.allocation) && (
            <>
              <TextInput
                value={formData.num_foreign_male}
                onChangeText={text => setFormData({ ...formData, num_foreign_male: text })}
                onBlur={() => handleBlur('num_foreign_male')}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                placeholder="Foreign Male"
                left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#888" />} />}
                returnKeyType="next"
                onSubmitEditing={() => null}
              />
              {!!errors.num_foreign_male && touched.num_foreign_male && <HelperText type="error" visible style={styles.helperText}>{errors.num_foreign_male}</HelperText>}
              <TextInput
                value={formData.num_foreign_female}
                onChangeText={text => setFormData({ ...formData, num_foreign_female: text })}
                onBlur={() => handleBlur('num_foreign_female')}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                placeholder="Foreign Female"
                left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#888" />} />}
                returnKeyType="next"
                onSubmitEditing={() => null}
              />
              {!!errors.num_foreign_female && touched.num_foreign_female && <HelperText type="error" visible style={styles.helperText}>{errors.num_foreign_female}</HelperText>}
            </>
          )}
          {!!errors.num_female && touched.num_female && <HelperText type="error" visible style={styles.helperText}>{errors.num_female}</HelperText>}
          {!!errors.num_female && touched.num_female && <HelperText type="error" visible style={styles.helperText}>{errors.num_female}</HelperText>}
          <TextInput
            value={formData.num_foreign_male}
            onChangeText={text => setFormData({ ...formData, num_foreign_male: text })}
            onBlur={() => handleBlur('num_foreign_male')}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            placeholder="Male"
            left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#888" />} />}
            returnKeyType="next"
            onSubmitEditing={() => null}
          />
          {!!errors.num_foreign_male && touched.num_foreign_male && <HelperText type="error" visible style={styles.helperText}>{errors.num_foreign_male}</HelperText>}
          {!!errors.num_foreign_male && touched.num_foreign_male && <HelperText type="error" visible style={styles.helperText}>{errors.num_foreign_male}</HelperText>}
          <TextInput
            value={formData.num_foreign_female}
            onChangeText={text => setFormData({ ...formData, num_foreign_female: text })}
            onBlur={() => handleBlur('num_foreign_female')}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            placeholder="Female"
            left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#888" />} />}
            returnKeyType="next"
            onSubmitEditing={() => null}
          />
          {!!errors.num_foreign_female && touched.num_foreign_female && <HelperText type="error" visible style={styles.helperText}>{errors.num_foreign_female}</HelperText>}
          {!!errors.num_foreign_female && touched.num_foreign_female && <HelperText type="error" visible style={styles.helperText}>{errors.num_foreign_female}</HelperText>}
          {!!errors.general && <HelperText type="error" visible style={styles.helperText}>{errors.general}</HelperText>}

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            <MaterialIcons name="groups" size={18} color="#888" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, color: '#888', fontWeight: '500', fontFamily: 'Poppins-Regular' }}>
              Tourist Count: {' '}
            </Text>
            <Text style={{ fontSize: 13, color: '#888', fontWeight: '500', fontFamily: 'Poppins-Regular' }}>
              {['num_male','num_female','num_foreign_male','num_foreign_female'].reduce((sum, key) => sum + (parseInt(formData[key]) || 0), 0)}
            </Text>
          </View>
          <Text style={styles.label}>Current Landmark</Text>
        <Text style={{ fontSize: 12, color: '#888', marginBottom: 8, alignSelf: 'flex-start', marginLeft: 2 }}>
          Select the landmark currently being visited by the tourist.
        </Text>
          <View style={styles.picker}>
            <Picker
              ref={landmarkRef}
              selectedValue={formData.visited_landmark}
              onValueChange={value => setFormData({ ...formData, visited_landmark: value })}
              style={{ minHeight: 44, height: 'auto' }}
              onBlur={() => handleBlur('visited_landmark')}
            >
              <Picker.Item label="Select landmark..." value="" color="#aaa" />
              {landmarks.map(landmark => {
                const type = landmarkTypes.find(t => t.type_id === landmark.landmark_type);
                return (
                  <Picker.Item key={landmark.info_id} label={`${landmark.name} (${type?.type_name})`} value={landmark.info_id} />
                );
              })}
            </Picker>
          </View>
          {!!errors.visited_landmark && touched.visited_landmark && <HelperText type="error" visible style={styles.helperText}>{errors.visited_landmark}</HelperText>}
          {(landmarkTypes.find(t => t.type_id === (landmarks.find(l => l.info_id === formData.visited_landmark)?.landmark_type))?.type_name === 'Hotel' ||
            landmarkTypes.find(t => t.type_id === (landmarks.find(l => l.info_id === formData.visited_landmark)?.landmark_type))?.type_name === 'Resort') && (
            <>
              <Text style={styles.label}>Stay Duration</Text>
              <Text style={{ fontSize: 12, color: '#888', marginBottom: 8, alignSelf: 'flex-start', marginLeft: 2 }}>
                Enter the number of days the tourist will stay (only for hotels and resorts).
              </Text>
              <TextInput
                ref={stayDurationRef}
                value={formData.stay_duration}
                onChangeText={text => setFormData({ ...formData, stay_duration: text })}
                onBlur={() => handleBlur('stay_duration')}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                placeholder="Number of Days"
                left={<TextInput.Icon icon={() => <MaterialIcons name="hotel" size={20} color="#888" />} />}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              {!!errors.stay_duration && touched.stay_duration && <HelperText type="error" visible style={styles.helperText}>{errors.stay_duration}</HelperText>}
            </>
          )}
        </View>
        {/* Consent Checkbox and Statement */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 20, width: 280, alignSelf: 'center', paddingHorizontal: 0 }}>
          <TouchableOpacity
            onPress={() => setConsentChecked(!consentChecked)}
            style={{ marginRight: 8, width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: consentChecked ? '#8B0000' : '#ccc', backgroundColor: consentChecked ? '#8B0000' : '#fff', justifyContent: 'center', alignItems: 'center' }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consentChecked }}
          >
            {consentChecked && (
              <MaterialIcons name="check" size={18} color="#fff" />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 12, color: '#444', flex: 1, fontFamily: 'Poppins-Regular' }}>
            I have read and agree to the{' '}
            <Text style={{ color: '#8B0000', textDecorationLine: 'underline' }} onPress={() => setPrivacyVisible(true)}>
              Privacy Policy
            </Text>
            {' '}and consent to the collection and processing of my data.
          </Text>
        </View>
        <PaperButton
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.saveButton}
          icon="check"
          contentStyle={{ flexDirection: 'row-reverse' }}
          disabled={!consentChecked}
        >
          Submit
        </PaperButton>
        </ScrollView>
      {/* PrivacyConsentModal for Data Privacy & Consent */}
      <PrivacyConsentModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  saveButton: {
    flex: 1,
    borderRadius: 8,
    maxWidth: 200,
  },
});

export default TouristFormScreen;
