import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { ActivityIndicator, Text } from 'react-native-paper';
import config from '../config/config';
import theme from '../config/theme';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import AlertModal from './AlertModal';

const LoginModal = ({ visible, onClose, termsVisible, privacyVisible, setTermsVisible, setPrivacyVisible }) => {
  // ...existing code...
  const [alertVisible, setAlertVisible] = useState(false);

  // Clear password validation error when alert modal closes
  useEffect(() => {
    if (!alertVisible) {
      setPasswordError('');
    }
  }, [alertVisible]);
  const [alertMessage, setAlertMessage] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // Removed successLoading state
  const [focusedField, setFocusedField] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);
  // termsVisible and privacyVisible now come from parent
  const [showing, setShowing] = useState(visible); // controls render
  const passwordRef = useRef(null);
  const { login } = useAuth();
  const navigation = useNavigation();

  // Animation for modal slide up/down
  const translateY = useRef(new Animated.Value(500)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  // Keyboard event listeners
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: Animated.event([
        null,
        { dy: translateY },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Only allow closing if no overlay modal is open
          if (!termsVisible && !privacyVisible) {
            Animated.timing(translateY, {
              toValue: 500,
              duration: 200,
              useNativeDriver: true,
            }).start(() => onClose && onClose());
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Animate modal in/out
  useEffect(() => {
    // Only allow closing if no overlay modal is open
    if (visible) {
      setShowing(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // Prevent closing if overlay modal is open
      if (!termsVisible && !privacyVisible) {
        Animated.timing(translateY, {
          toValue: 500,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          setShowing(false);
        });
      } else {
        // If overlay modal is open, keep showing
        setShowing(true);
      }
    }
  }, [visible, translateY, termsVisible, privacyVisible]);

  // Reopen LoginModal if overlay modal is closed and LoginModal should be visible
  useEffect(() => {
    if (visible && !termsVisible && !privacyVisible) {
      setShowing(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [termsVisible, privacyVisible, visible, translateY]);

  useEffect(() => {
    if (!visible) {
      setUsernameError('');
      setPasswordError('');
    }
  }, [visible]);

  const clearFields = () => {
    setUsername('');
    setPassword('');
  };

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Username validation on blur
  const handleUsernameBlur = () => {
    setFocusedField('');
    if (!username.trim()) {
      setUsernameError('Please enter your username');
    } else {
      setUsernameError('');
    }
  };
  // Password validation on blur
  const handlePasswordBlur = () => {
    setFocusedField('');
    if (!password.trim()) {
      setPasswordError('Please enter your password');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    // Only validate if input is empty
    let valid = true;
    if (!username.trim()) {
      setUsernameError('Please enter your username');
      valid = false;
    } else {
      setUsernameError('');
    }
    if (!password.trim()) {
      setPasswordError('Please enter your password');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (!consentChecked) {
      valid = false;
    }
    if (!valid) return;
    setLoading(true);
    console.log('Login attempt (UI):', { username: username.trim(), password });
    const result = await login(username.trim(), password);
    console.log('Login result (UI):', result);
    setLoading(false);
    if (result.success) {
      navigation.replace('dashboard');
      onClose && onClose();
    } else {
      // Use AlertModal for wrong credentials
      if (!username.trim() && !password.trim()) {
        setAlertMessage('Please enter your username and password.');
      } else if (!username.trim()) {
        setAlertMessage('Please enter your username.');
      } else if (!password.trim()) {
        setAlertMessage('Please enter your password.');
      } else {
        setAlertMessage('Invalid username or password. Please try again.');
      }
      setAlertVisible(true);
      setUsernameError('');
      setPasswordError('');
      Keyboard.dismiss();
      clearFields();
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      handleLogin();
    }
  };

  if (!showing) return null;


  // Modal position logic
  // If keyboard is visible and an input is focused, move modal up just enough to keep input and error visible
  // Otherwise, keep modal at bottom
  // Adjust modal position so password input and error are visible, but not fully to the top
  let modalBottom = 0;
  let modalMinHeight = undefined;
  if (keyboardVisible && focusedField) {
    modalBottom = Platform.OS === 'ios' ? 320 : 260; // stick modal to keyboard height
    modalMinHeight = 400; // just enough for content
  }
  const modalStyle = [
    styles.modal,
    { bottom: modalBottom },
    modalMinHeight ? { minHeight: modalMinHeight } : {},
    { transform: [{ translateY }] }
  ];

  // Animate out before closing
  const handleOverlayPress = () => {
    // Only allow closing if no overlay modal is open
    if (!termsVisible && !privacyVisible) {
      Animated.timing(translateY, {
        toValue: 500,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setShowing(false);
        if (onClose) onClose();
      });
    }
  };

  return (
    <View style={styles.overlay}>
      <AlertModal
        visible={alertVisible}
        title="Login Error"
        message={alertMessage}
        type="error"
        onConfirm={() => setAlertVisible(false)}
      />
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="auto" />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 80}
      >
        <Animated.View
          style={modalStyle}
          {...panResponder.panHandlers}
        >
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
          <View style={styles.container}>
            <View style={styles.dragHandle} />
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
                <MaterialIcons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your username"
                  placeholderTextColor="#8E8E93"
                  value={username}
                  onChangeText={text => { setUsername(text); if (text.trim()) setUsernameError(''); }}
                  onFocus={() => setFocusedField('username')}
                  onBlur={handleUsernameBlur}
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
              {usernameError ? <Text style={styles.inputError}>{usernameError}</Text> : null}
            </View>
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputFocused]}>
                <MaterialIcons name="lock-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  placeholder="Enter your password"
                  placeholderTextColor="#8E8E93"
                  value={password}
                  onChangeText={text => { setPassword(text); if (text.trim()) setPasswordError(''); }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={handlePasswordBlur}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onKeyPress={handleKeyPress}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                  <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>
              {(passwordError && !alertVisible) ? <Text style={styles.inputError}>{passwordError}</Text> : null}
            </View>
            {/* Consent Checkbox and Statement */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 10, paddingHorizontal: 6 }}>
              <TouchableOpacity
                onPress={() => setConsentChecked(!consentChecked)}
                style={{ marginRight: 12, width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: consentChecked ? '#4B85F5' : '#ccc', backgroundColor: consentChecked ? '#4B85F5' : '#fff', justifyContent: 'center', alignItems: 'center' }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: consentChecked }}
              >
                {consentChecked && (
                  <MaterialIcons name="check" size={15} color="#fff" />
                )}
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: '#222', flex: 1, fontFamily: 'Poppins-Regular' }}>
                I agree to our{' '}
                <Text style={{ color: '#4B85F5', textDecorationLine: 'underline' }} onPress={() => setTermsVisible(true)}>
                  Terms & Conditions
                </Text>
                {' '}&{' '}
                <Text style={{ color: '#4B85F5', textDecorationLine: 'underline' }} onPress={() => setPrivacyVisible(true)}>
                  Privacy Policy
                </Text>
                {' '}guideline.
              </Text>
            </View>
            {/* Login Button */}
            <View style={styles.buttonContainer}>
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
          {/* Overlay modals are now rendered in WelcomeScreen for proper stacking/locking */}
          {/* Removed success loading overlay */}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modal: {
    backgroundColor: theme.colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 16,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  appTitle: {
    marginBottom: 25,
    paddingHorizontal: 4,
  },
  appTitleText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: theme.colors.primary,
    textAlign: 'left',
    letterSpacing: -1,
  },
  appSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.tertiary,
    textAlign: 'left',
    lineHeight: 22,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-regular',
    color: theme.colors.primary,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: theme.colors.tertiary,
    paddingVertical: 0,
    paddingRight: 40,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
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
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  loginButtonPressed: {
    backgroundColor: theme.colors.tertiary,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -1,
  },
  inputError: {
    color: '#F04349',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  successLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  successLoadingText: {
    marginTop: 18,
    fontSize: 18,
    color: theme.colors.primary,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -1,
  },
});

export default LoginModal;
