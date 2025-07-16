import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
        <Button mode="contained" onPress={handleExport} style={styles.exportButton}>
          {exported ? "Exported!" : "Export Report"}
        </Button>
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
  card: {
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    backgroundColor: '#fff',
    width: '90%',
    maxWidth: 400,
    minWidth: 260,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 2,
    color: theme.colors.primary,
  },
  pattern: {
    fontSize: 14,
    marginBottom: 2,
    color: theme.colors.onSurface,
  },
  area: {
    fontSize: 14,
    marginBottom: 2,
    color: theme.colors.onSurfaceVariant,
  },
  exportButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignSelf: 'center',
  },
});

export default ReportExportScreen;
