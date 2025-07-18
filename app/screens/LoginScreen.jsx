import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  ActivityIndicator,
  Text
} from 'react-native-paper';
import config from '../config/config';
import theme from '../config/theme';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import AlertModal from '../modals/AlertModal';
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal';
import TermsModal from '../modals/TermsModal';

const LoginScreen = () => {
  const [consentChecked, setConsentChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);

  const passwordRef = useRef(null);

  const { login } = useAuth();
  const navigation = useNavigation();



  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('info');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() && !password.trim()) {
      setAlertType('error');
      setAlertTitle('Error');
      setAlertMessage('Please enter both username and password');
      setAlertVisible(true);
      return;
    }
    if (!username.trim()) {
      setAlertType('error');
      setAlertTitle('Error');
      setAlertMessage('Please enter your username');
      setAlertVisible(true);
      return;
    }
    if (!password.trim()) {
      setAlertType('error');
      setAlertTitle('Error');
      setAlertMessage('Please enter your password');
      setAlertVisible(true);
      return;
    }
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (result.success) {
      navigation.replace('dashboard');
    } else {
      setAlertType('error');
      setAlertTitle('Login Failed');
      setAlertMessage('Invalid username or password. Please try again.');
      setAlertVisible(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <KeyboardAvoidingView 
      style={styles.fullScreen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={false}
      />
      <View style={styles.container}>
        <View style={styles.appTitle}>
          <Text style={styles.appTitleText}>{config.APP_NAME}</Text>
          <Text style={styles.appSubtitle}>
            Continue your journey with {config.APP_NAME}
          </Text>
        </View>
        {/* Username Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={[styles.inputWrapper, focusedField === 'username' && styles.inputFocused]}>
            <MaterialIcons 
              name="person-outline" 
              size={20} 
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <RNTextInput
              placeholder="Enter your username"
              placeholderTextColor="#8E8E93"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>
        </View>
        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputFocused]}>
            <MaterialIcons 
              name="lock-outline" 
              size={20} 
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <RNTextInput
              ref={passwordRef}
              placeholder="Enter your password"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              style={styles.input}
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              onKeyPress={handleKeyPress}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIconContainer}
            >
              <MaterialIcons 
                name={showPassword ? "visibility-off" : "visibility"} 
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Consent Checkbox and Statement */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 20, paddingHorizontal: 8 }}>
          <TouchableOpacity
            onPress={() => setConsentChecked(!consentChecked)}
            style={{ marginRight: 8, width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: consentChecked ? theme.colors.primary : '#ccc', backgroundColor: consentChecked ? theme.colors.primary : '#fff', justifyContent: 'center', alignItems: 'center' }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consentChecked }}
          >
            {consentChecked && (
              <MaterialIcons name="check" size={18} color="#fff" />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 13, color: '#222', flex: 1, fontFamily: 'Poppins-Regular' }}>
            I agree to our{' '}
            <Text style={{ color: theme.colors.primary, textDecorationLine: 'underline' }} onPress={() => setTermsVisible(true)}>
              Terms of service
            </Text>
            {' '} &{' '}
            <Text style={{ color: theme.colors.primary, textDecorationLine: 'underline' }} onPress={() => setPrivacyVisible(true)}>
              Privacy Policy
            </Text>
            {' '}guideline.
          </Text>
        </View>
        {/* Login Button */}
        <View className="buttonContainer">
          <TouchableOpacity
            onPress={handleLogin}
            onPressIn={() => setButtonPressed(true)}
            onPressOut={() => setButtonPressed(false)}
            disabled={loading || !consentChecked}
            activeOpacity={1}
            style={[styles.loginButton, buttonPressed && styles.loginButtonPressed, !consentChecked && { opacity: 0.5 }]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* AlertModal for login error only */}
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
        onConfirm={() => setAlertVisible(false)}
      />
      {/* TermsModal for Terms & Conditions */}
      <TermsModal visible={termsVisible} onClose={() => setTermsVisible(false)} />
      {/* PrivacyPolicyModal for Privacy Policy */}
      <PrivacyPolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.secondary, // 30% secondary
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  appTitle: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  appTitleText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: theme.colors.primary, // 60% primary
    textAlign: 'left',
    letterSpacing: -1,
  },
  appSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.tertiary, // 10% tertiary
    textAlign: 'left',
    lineHeight: 22,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: theme.colors.primary, // 60% primary
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    paddingVertical: 0,
    paddingRight: 40,
  },
  inputFocused: {
    borderColor: theme.colors.primary, // 60% primary
    backgroundColor: theme.colors.secondary, // 30% secondary
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
  loginButton: {
    backgroundColor: theme.colors.primary, // 60% primary
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  loginButtonPressed: {
    backgroundColor: theme.colors.tertiary, // 10% tertiary
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default LoginScreen;
