import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import BottomNavigationBar from '../components/BottomNavigationBar';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import theme from '../config/theme';
import { useNavigation } from '../context/NavigationContext';
import generateReportHtml from '../utils/ReportPdfGenerator';

const mockLandmarkTypes = [
  { type_name: 'Churches' },
  { type_name: 'Golf Courses' },
  { type_name: 'Hotels' },
  { type_name: 'Others' },
  { type_name: 'Restaurants' },
  { type_name: 'Resorts' },
];

const mockReportByType = {
  Churches: {
    local: { male: 320, female: 280 },
    foreign: { male: 60, female: 40 },
    topLandmarks: ['St. John Church', 'St. Peter Chapel'],
    movementPatterns: ['Hotel → Church', 'Resort → Church'],
    focusAreas: ['Promote local churches for foreign visitors'],
  },
  'Golf Courses': {
    local: { male: 210, female: 180 },
    foreign: { male: 30, female: 20 },
    topLandmarks: ['Summit Point', 'Malarayat Golf Course'],
    movementPatterns: ['Hotel → Golf Course'],
    focusAreas: ['Increase signage at golf courses'],
  },
  Hotels: {
    local: { male: 400, female: 350 },
    foreign: { male: 80, female: 70 },
    topLandmarks: ['Abu’s Resort and Hotel', 'AVM Garden Resort'],
    movementPatterns: ['Hotel → Resort', 'Hotel → Church'],
    focusAreas: ['Improve transport between hotels and landmarks'],
  },
  Others: {
    local: { male: 100, female: 90 },
    foreign: { male: 10, female: 8 },
    topLandmarks: ['Local Park', 'Museum'],
    movementPatterns: ['Hotel → Park'],
    focusAreas: ['Add more tourist info at parks'],
  },
  Restaurants: {
    local: { male: 150, female: 130 },
    foreign: { male: 20, female: 15 },
    topLandmarks: ['Casa Carlita', 'Local Diner'],
    movementPatterns: ['Hotel → Restaurant'],
    focusAreas: ['Promote local cuisine'],
  },
  Resorts: {
    local: { male: 300, female: 270 },
    foreign: { male: 50, female: 40 },
    topLandmarks: ['Cachos Resort', 'Anahaw Coco Farm'],
    movementPatterns: ['Resort → Church', 'Hotel → Resort'],
    focusAreas: ['Increase signage at resorts'],
  },
};

const ReportExportScreen = () => {
  const [exported, setExported] = useState(false);
  const navigation = useNavigation();

  // Example: Replace with your real mock data for the table
  const mockTableData = [
    {
      municipality: 'Lipa City',
      attraction: 'Malarayat Golf Course',
      code: '401',
      local_male: 230,
      local_female: 111,
      other_male: 120,
      other_female: 65,
      foreign_male: 150,
      foreign_female: 172,
      total: 786,
    },
    {
      municipality: 'Lipa City',
      attraction: 'Summit Point',
      code: '401',
      local_male: 504,
      local_female: 380,
      other_male: 825,
      other_female: 301,
      foreign_male: 282,
      foreign_female: 1200,
      total: 1986,
    },
    // ...add more rows as needed
  ];

  const handleExport = async () => {
    setExported(true);
    const html = generateReportHtml(mockTableData);
    if (Platform.OS === 'web') {
      // Use html2pdf.js for web
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        const element = document.createElement('div');
        element.innerHTML = html;
        document.body.appendChild(element);
        window.html2pdf()
          .set({
            margin: 10,
            filename: 'lipa-tourist-report.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
          })
          .from(element)
          .save()
          .then(() => {
            document.body.removeChild(element);
            setTimeout(() => setExported(false), 2000);
          });
      };
      document.body.appendChild(script);
      return;
    }
    try {
      // Generate PDF and get URI
      const { uri } = await Print.printToFileAsync({ html });
      // Save to device and open share dialog
      if (uri && (await FileSystem.getInfoAsync(uri)).exists) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Tourist Report PDF',
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (_e) {
      // Handle error
    }
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Tourist Reports & Export" 
        showBackButton
        navigation={navigation}
        onBackPress={() => navigation.replace('dashboard')}
      />
      <Breadcrumbs items={["Dashboard", "Reports"]} />
      <View style={styles.stickyExportWrapper}>
        <Button mode="contained" onPress={handleExport} style={styles.exportButton}>
          {exported ? "Exported!" : "Export Report"}
        </Button>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {mockLandmarkTypes.map((type) => {
          const report = mockReportByType[type.type_name];
          return (
            <Card style={styles.card} key={type.type_name}>
              <Text style={styles.title}>{type.type_name}</Text>
              <Text style={styles.value}>
                Total Tourists: {(
                  report.local.male + report.local.female + report.foreign.male + report.foreign.female
                ).toLocaleString()}
              </Text>
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.value}>Local Tourists (Philippines):</Text>
                <Text style={styles.pattern}>Male: {report.local.male.toLocaleString()}</Text>
                <Text style={styles.pattern}>Female: {report.local.female.toLocaleString()}</Text>
                <Text style={styles.value}>Foreign Tourists:</Text>
                <Text style={styles.pattern}>Male: {report.foreign.male.toLocaleString()}</Text>
                <Text style={styles.pattern}>Female: {report.foreign.female.toLocaleString()}</Text>
              </View>
              <Text style={styles.subtitle}>Top Landmarks:</Text>
              {report.topLandmarks.map((landmark, idx) => (
                <Text key={idx} style={styles.pattern}>• {landmark}</Text>
              ))}
              <Text style={styles.subtitle}>Movement Patterns:</Text>
              {report.movementPatterns.map((pattern, idx) => (
                <Text key={idx} style={styles.pattern}>• {pattern}</Text>
              ))}
              <Text style={styles.subtitle}>Focus Areas:</Text>
              {report.focusAreas.map((area, idx) => (
                <Text key={idx} style={styles.area}>• {area}</Text>
              ))}
            </Card>
          );
        })}
      </ScrollView>
      <BottomNavigationBar navigation={navigation} currentRoute="reports" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    marginTop: theme.spacing.md,
    boxSizing: 'border-box',
    
  },
    card: {
        width: '100%',
        maxWidth: 480,
        minWidth: 320,
        alignSelf: 'center',
        margin: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.medium,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        // No shadow or elevation for flat card appearance
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 2,
    color: theme.colors.primary,
  },
  pattern: {
    fontSize: 12,
    marginBottom: 2,
    color: theme.colors.onSurface,
  },
  area: {
    fontSize: 12,
    marginBottom: 2,
    color: theme.colors.onSurfaceVariant,
  },
  stickyExportWrapper: {
    position: 'sticky',
    zIndex: 5,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exportButton: {
    borderRadius: theme.borderRadius.medium,
    alignSelf: 'center',
    minWidth: 180,
    maxWidth: 240,
  },
});

export default ReportExportScreen;
