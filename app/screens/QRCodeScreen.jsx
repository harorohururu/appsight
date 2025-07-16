import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import BottomNavigationBar from '../components/BottomNavigationBar';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import Header from '../components/Header';
import config from '../config/config';
import theme from '../config/theme';
import { useNavigation } from '../context/NavigationContext';

const QRCodeScreen = () => {
  const navigation = useNavigation();
  const TOURIST_FORM_URL = 'https://forms.gle/your-google-form-id';
  const [qrValue] = useState(TOURIST_FORM_URL);
  const [qrRef, setQrRef] = useState(null);

  const handleDownloadQR = () => {
    if (qrRef) {
      qrRef.toDataURL((dataURL) => {
        Alert.alert(
          'QR Code Generated',
          'QR Code has been generated successfully. In a real app, this would trigger a download.',
          [{ text: 'OK' }]
        );
      });
    }
  };

  const handlePreviewForm = () => {
    navigation.navigate('touristForm');
  };

  const handleOpenWebForm = () => {
    Linking.openURL(config.QR_CODE_URL).catch(() => {
      Alert.alert('Error', 'Unable to open the tourist form URL');
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="QR Code Generator"
        navigation={navigation}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <Breadcrumbs items={['Dashboard', 'QR Code']} />
      <ScrollView
        contentContainerStyle={styles.centeredContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.qrCodeWrapper}>
          <QRCode
            value={qrValue}
            size={200}
            backgroundColor="white"
            color={theme.colors.primary}
            getRef={ref => setQrRef(ref)}
          />
        </View>
        <Text style={styles.qrUrl}>{qrValue}</Text>
        <View style={styles.buttonsContainer}>
          <Button
            title="Download QR Code"
            icon="download"
            onPress={handleDownloadQR}
            style={styles.button}
          />
          <Button
            title="Preview Tourist Form"
            icon="preview"
            mode="outlined"
            onPress={handlePreviewForm}
            style={styles.button}
          />
          <Button
            title="Open Web Form"
            icon="open-in-browser"
            mode="text"
            onPress={handleOpenWebForm}
            style={styles.button}
          />
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} currentRoute="qrcode" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginTop: 100,
  },
  qrCodeWrapper: {
    marginBottom: theme.spacing.xs,
    alignSelf: 'center',
    width: 240,
    alignItems: 'center',
  },
  qrUrl: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  buttonsContainer: {
    marginVertical: theme.spacing.sm,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    marginVertical: 4,
    width: 240,
    borderRadius: theme.borderRadius.medium,
    elevation: 1,
    alignSelf: 'center',
  },
});

export default QRCodeScreen;