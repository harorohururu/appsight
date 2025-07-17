import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
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
  const [viewShotRef, setViewShotRef] = useState(null);

  const handleDownloadQR = async () => {
    if (Platform.OS === 'web') {
      if (!qrRef) return;
      qrRef.toDataURL((dataURL) => {
        // ...existing code for web download...
        // Short bond paper size: 612x792 px
        const canvas = document.createElement('canvas');
        const paperWidth = 612;
        const paperHeight = 792;
        const qrSize = 240;
        const title = 'Lipa City Tourist Monitoring';
        const linkText = 'https://forms.gle/your-google-form-id';
        const fontSize = 32;
        const linkFontSize = 20;
        canvas.width = paperWidth;
        canvas.height = paperHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, paperWidth, paperHeight);
        // Center QR code
        const qrImg = new window.Image();
        qrImg.src = `data:image/png;base64,${dataURL}`;
        qrImg.onload = () => {
          const qrX = (paperWidth - qrSize) / 2;
          const qrY = paperHeight / 2 - qrSize / 2 - 60;
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          // Title below QR
          ctx.font = `bold ${fontSize}px Poppins, Arial, sans-serif`;
          ctx.fillStyle = '#8B0000';
          ctx.textAlign = 'center';
          ctx.fillText(title, paperWidth / 2, qrY + qrSize + fontSize + 24);
          // Link below title
          ctx.font = `${linkFontSize}px Poppins, Arial, sans-serif`;
          ctx.fillStyle = '#666';
          ctx.fillText(linkText, paperWidth / 2, qrY + qrSize + fontSize + 24 + linkFontSize + 16);
          const outData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = outData;
          link.download = 'lipa-tourist-qr.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
      });
      return;
    }
    // Mobile: use view-shot
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot save image without media library permission.');
        return;
      }
      if (!viewShotRef) {
        Alert.alert('Error', 'QR view not ready.');
        return;
      }
      const uri = await viewShotRef.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
      Alert.alert('Success', 'QR Code saved to your device!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save QR code.');
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
        {/* Hidden composite view for view-shot capture on mobile */}
        <ViewShot
          ref={ref => setViewShotRef(ref)}
          options={{ format: 'png', quality: 1.0, width: 612, height: 792 }}
          style={{ position: 'absolute', left: -9999, width: 612, height: 792, backgroundColor: '#fff' }}
        >
          <View style={{ width: 612, height: 792, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ marginTop: 60, marginBottom: 24 }}>
              <QRCode
                value={qrValue}
                size={240}
                backgroundColor="white"
                color={theme.colors.primary}
              />
            </View>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#8B0000', marginBottom: 16, textAlign: 'center' }}>
              Lipa City Tourist Monitoring
            </Text>
            <Text style={{ fontSize: 20, color: '#666', textAlign: 'center' }}>{qrValue}</Text>
          </View>
        </ViewShot>
        {/* Visible QR and controls */}
        <View style={styles.qrCodeWrapper}>
          <QRCode
            value={qrValue}
            size={200}
            backgroundColor="white"
            color={theme.colors.primary}
            getRef={ref => setQrRef(ref)}
          />
          <Text style={styles.qrTitle}>Lipa City Tourist Monitoring</Text>
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
    marginTop: 100,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  qrCodeWrapper: {
    marginBottom: theme.spacing.xs,
    alignSelf: 'center',
    width: 240,
    alignItems: 'center',
    marginTop: theme.spacing.md,
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
  qrTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 12,
    marginBottom: 2,
    textAlign: 'center',
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