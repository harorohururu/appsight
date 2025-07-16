import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from 'react-native-paper';
import BottomNavigationBar from '../components/BottomNavigationBar';
import Breadcrumbs from '../components/Breadcrumbs';
import Card from '../components/Card';
import Header from '../components/Header';
import theme from '../config/theme';
import { useNavigation } from '../context/NavigationContext';
import landmarkAnalysisData from '../data/landmarkAnalysisData';
import landmarkAnalysisOptions from '../data/landmarkAnalysisOptions';
import landmarks from '../data/landmarks';
import { top3LandmarksData } from '../data/top3Landmarks';
import touristData from '../data/touristData';
import { chartConfig, dailyVisitTrends, monthlyVisitTrends, weeklyVisitTrends } from '../data/visitTrends';
import DateRangePickerModal from '../modals/DateRangePickerModal';

  const DashboardScreen = () => {
    const navigation = useNavigation();
    const scrollRef = useRef(null);
    const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
    const [selectedLandmark, setSelectedLandmark] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showDateRangeModal, setShowDateRangeModal] = useState(false);
    
    const screenData = Dimensions.get("window");
    const chartWidth = screenData.width + 100; // Wider chart for scrolling

    // Get chart data based on selected period
    const getChartData = () => {
      switch (selectedPeriod) {
        case 'Daily':
          return dailyVisitTrends;
        case 'Weekly':
          return weeklyVisitTrends;
        case 'Monthly':
        default:
          return monthlyVisitTrends;
      }
    };

    const totalLandmarks = landmarks.length;
    const totalVisitors = touristData.reduce((total, tourist) => 
      total + tourist.num_male + tourist.num_female + tourist.num_foreign_male + tourist.num_foreign_female, 0
    );
    const todayVisitors = touristData
      .filter(tourist => tourist.form_date === new Date().toISOString().split('T')[0])
      .reduce((total, tourist) => 
        total + tourist.num_male + tourist.num_female + tourist.num_foreign_male + tourist.num_foreign_female, 0
      );
    const foreignVisitors = touristData.reduce((total, tourist) => 
      total + tourist.num_foreign_male + tourist.num_foreign_female, 0
    );

    // Mock data for top 3 most visited landmarks
    const getTop3Landmarks = () => {
      // Using imported mock data
      return top3LandmarksData;
    };

    const top3Landmarks = getTop3Landmarks();

    const dashboardCards = [
      {
        title: 'Total Tourists',
        value: totalVisitors.toString(),
        icon: 'people',
        description: 'All-time tourist count',
      },
      {
        title: 'Total Landmarks',
        value: totalLandmarks.toString(),
        icon: 'place',
        description: 'Registered tourist destinations',
      },
      {
        title: 'Today\'s Tourists',
        value: todayVisitors.toString(),
        icon: 'today',
        description: 'Tourists today',
      },
      {
        title: 'Foreign Visitors',
        value: foreignVisitors.toString(),
        icon: 'flight',
        description: 'International tourists',
      },
    ];

    // Helper to get filtered chart data for selected landmark
    const getFilteredLandmarkChart = () => {
      if (!selectedLandmark || !landmarkAnalysisData[selectedLandmark]) return null;
      const chart = landmarkAnalysisData[selectedLandmark].chart;
      if (!dateFrom && !dateTo) return chart;
      // Try to filter by date range if possible (labels must be parseable dates)
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      // Try to parse each label as a date, fallback to show all if not possible
      const filtered = { ...chart, labels: [], datasets: chart.datasets.map(ds => ({ ...ds, data: [] })) };
      chart.labels.forEach((label, i) => {
        // Try to parse label as date
        let labelDate = new Date(label);
        if (isNaN(labelDate)) {
          // Try MM/DD/YYYY
          labelDate = new Date(label + '/2024');
        }
        if (
          (!from || labelDate >= from) &&
          (!to || labelDate <= to)
        ) {
          filtered.labels.push(label);
          chart.datasets.forEach((ds, dsi) => {
            filtered.datasets[dsi].data.push(ds.data[i]);
          });
        }
      });
      // If filtering results in empty, fallback to all
      if (filtered.labels.length === 0) return chart;
      return filtered;
    };

    useEffect(() => {
      // Scroll to top on mount
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
    }, []);

    return (
      <View style={styles.container}>
        <Header title="Dashboard" />
        
        <Breadcrumbs items={['Dashboard']} />
        
        <ScrollView 
          ref={scrollRef}
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Overview</Text>
            </View>
            <View style={styles.grid1Container}>
              {dashboardCards.map((card, index) => (
                <View key={index} style={styles.grid1CardWrapper}>
                  <Card
                    title={card.value}
                    subtitle={card.title}
                    description={card.description}
                    icon={card.icon}
                    iconColor={theme.colors.primary}
                    style={styles.unifiedCard}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Tourist Visit Trends</Text>
            </View>
            
            {/* Time Period Selection Buttons */}
            <View style={styles.periodButtonsContainer}>
              {['Daily', 'Weekly', 'Monthly'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chart Container */}
            <View style={styles.chartContainer}>
              <ScrollView 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chartScrollContent}
                style={styles.chartScrollView}
              >
                <LineChart
                  data={getChartData()}
                  width={chartWidth}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 10,
                    paddingBottom: 30,
                    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                    propsForLabels: {
                      fontSize: 9,
                      fontFamily: 'Poppins-Regular',
                      rotation: -45, // Tilt labels to the left
                    }
                  }}
                  bezier
                  style={styles.chart}
                  withDots={true}
                  withShadow={false}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                  segments={4}
                  yAxisInterval={1}
                  fromZero={false}
                  getDotColor={() => '#458ED1'}
                />
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Top 3 Visited Landmarks</Text>
              <TouchableOpacity onPress={() => navigation.navigate('landmarks')} style={styles.viewAllButton}>
                <Text style={styles.viewAllButtonText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.grid3Container}>
              <View style={styles.landmarkListContainer}>
                {top3Landmarks.length > 0 ? (
                  top3Landmarks.map((landmark, index) => (
                    <View key={landmark.id} style={styles.landmarkItem}>
                      <View style={styles.landmarkRank}>
                        <Text style={[
                          styles.rankNumber,
                          index === 0 ? styles.rank1 :
                          index === 1 ? styles.rank2 : styles.rank3
                        ]}>
                          #{index + 1}
                        </Text>
                      </View>
                      <View style={styles.landmarkDetails}>
                        <Text style={styles.landmarkName}>{landmark.name}</Text>
                        <View style={styles.landmarkStats}>
                          <Text style={styles.landmarkVisitors}>
                            👥 {landmark.visits.toLocaleString()} visitors
                          </Text>
                          <Text style={styles.landmarkPercentage}>
                            📈 {landmark.percentage}%
                          </Text>
                        </View>
                        <View style={[
                          styles.progressBar,
                          index === 0 ? styles.progressBar1 :
                          index === 1 ? styles.progressBar2 : styles.progressBar3
                        ]}>
                          <View
                            style={[
                              styles.progressFill,
                              index === 0 ? styles.progressFill1 :
                              index === 1 ? styles.progressFill2 : styles.progressFill3,
                              { width: `${landmark.percentage}%` }
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No landmark data available</Text>
                )}
              </View>
            </View>
          </View>

          {/* Landmark Analysis Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Landmark Analysis</Text>
            </View>
            <View style={styles.grid4Container}>
              <View style={styles.analysisCard}>
                <Text style={styles.analysisLabel}>Select Landmark</Text>
                <View style={styles.analysisDropdownRow}>
                  <View style={{flex: 1}}>
                    <Picker
                      selectedValue={selectedLandmark}
                      onValueChange={itemValue => setSelectedLandmark(itemValue)}
                      style={styles.analysisDropdown}
                    >
                      <Picker.Item label="Choose a landmark..." value="" />
                      {landmarkAnalysisOptions.map(option => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <Text style={styles.analysisLabel}>Date Range</Text>
                <View style={styles.analysisDateRow}>
                  <TouchableOpacity
                    style={[styles.analysisDateInputBox]}
                    onPress={() => setShowDateRangeModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.analysisDateText} numberOfLines={1} ellipsizeMode="tail">
                      {dateFrom ? dateFrom : 'mm/dd/yyyy'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.analysisDateToLabel}>to</Text>
                  <TouchableOpacity
                    style={[styles.analysisDateInputBox]}
                    onPress={() => setShowDateRangeModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.analysisDateText} numberOfLines={1} ellipsizeMode="tail">
                      {dateTo ? dateTo : 'mm/dd/yyyy'}
                    </Text>
                  </TouchableOpacity>
                  {(dateFrom || dateTo) && (
                    <TouchableOpacity
                      style={styles.removeFilterButton}
                      onPress={() => { setDateFrom(''); setDateTo(''); }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeFilterButtonText}>Remove Filter</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <DateRangePickerModal
                  visible={showDateRangeModal}
                  onClose={() => setShowDateRangeModal(false)}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onChangeFrom={(event, selectedDate) => {
                    if (selectedDate) setDateFrom(selectedDate.toISOString().split('T')[0]);
                  }}
                  onChangeTo={(event, selectedDate) => {
                    if (selectedDate) setDateTo(selectedDate.toISOString().split('T')[0]);
                  }}
                />
              </View>
              {selectedLandmark && landmarkAnalysisData[selectedLandmark] && (
                <View style={styles.analysisStatsContainer}>
                  <Text style={styles.analysisStatsTitle}>{landmarkAnalysisData[selectedLandmark].name}</Text>
                  <View style={styles.analysisStatsRow}>
                    <View style={styles.analysisStatsCol}>
                      <Text style={styles.analysisStatsLabel}>Total Visitors</Text>
                      <Text style={styles.analysisStatsValue}>{landmarkAnalysisData[selectedLandmark].totalVisitors.toLocaleString()}</Text>
                    </View>
                    <View style={styles.analysisStatsCol}>
                      <Text style={styles.analysisStatsLabel}>Daily Average</Text>
                      <Text style={styles.analysisStatsValue}>{landmarkAnalysisData[selectedLandmark].dailyAverage}</Text>
                    </View>
                    <View style={styles.analysisStatsCol}>
                      <Text style={styles.analysisStatsLabel}>Peak Day</Text>
                      <Text style={styles.analysisStatsValue}>{
                        new Date(landmarkAnalysisData[selectedLandmark].peakDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                      } ({landmarkAnalysisData[selectedLandmark].peakDay.count} visitors)</Text>
                    </View>
                  </View>
                  <View style={styles.analysisChartContainer}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.chartScrollContent}
                      style={styles.chartScrollView}
                    >
                      <LineChart
                        data={getFilteredLandmarkChart()}
                        width={chartWidth}
                        height={260}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.analysisChart}
                        withDots={true}
                        withShadow={false}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLines={true}
                        withHorizontalLines={true}
                        segments={5}
                        yAxisInterval={1}
                        fromZero={true}
                        getDotColor={() => '#458ED1'}
                      />
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        
        <BottomNavigationBar navigation={navigation} currentRoute="dashboard" />
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
      paddingHorizontal: theme.spacing.md,
    },
    scrollContent: {
      paddingBottom: 110,
    },
    section: {
      marginVertical: 4,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#8B0000',
      flex: 1,
      textAlign: 'left',
    },
    // Grid 1 Styles (Overview Grid)
    grid1Container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      marginHorizontal: '1.5%',
      gap: 6, // Reduced gap between cards
          marginBottom: 6, // Reduced bottom margin
    },
    grid1CardWrapper: {
      width: '48.5%', // Slightly wider cards
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    unifiedCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      padding: 16,
      marginTop: 4,
      marginBottom: 8,
      alignSelf: 'stretch',
      maxWidth: '100%',
    },
    // Chart Styles
    periodButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
      backgroundColor: '#F5F5F5',
      borderRadius: 25,
      padding: 4,
      marginHorizontal: '1.5%',
      marginTop: 8,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    periodButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
      fontSize: 12,
      fontFamily: 'Poppins-Medium',
      color: '#666666',
    },
    periodButtonTextActive: {
      color: '#FFFFFF',
      fontFamily: 'Poppins-SemiBold',
    },
    chartContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      marginHorizontal: '1.5%',
      paddingVertical: 5,
      paddingHorizontal: 0,
      overflow: 'hidden',
      minHeight: 240,
      alignSelf: 'stretch',
      marginBottom: 6, // Reduced bottom margin
    },
    chartScrollView: {
      flexGrow: 0,
      flexShrink: 0,
      margin: 0,
      padding: 0,
    },
    chartScrollContent: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingHorizontal: 0,
      paddingVertical: 0,
      margin: 0,
      flexGrow: 0,
    },
    chart: {
      marginLeft: -15,
      marginRight: 20,
      marginTop: 15,
      marginBottom: 10,
      alignSelf: 'flex-start',
    },
    // Grid 3 Styles (Blank Grid)
    grid3Container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      marginHorizontal: '1.5%',
      marginBottom: 6, // Reduced bottom margin
    },
    grid3CardWrapper: {
      marginBottom: 5, // Reduced bottom margin
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    grid3Card: {
      margin: 0,
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    // Landmark Analysis Styles
    grid4Container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      marginHorizontal: '1.5%',
      marginTop: 6, // Reduced bottom margin
    },
    analysisCard: {
      width: '100%',
      backgroundColor: theme.colors.surface, // white
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant, // light gray
      padding: 16,
      marginTop: 2,
      marginBottom: 6, // Reduced gap below analysis card
      alignSelf: 'stretch',
      maxWidth: '100%',
    },
    analysisLabel: {
      fontSize: 15,
      fontFamily: 'Poppins-Medium',
      color: theme.colors.primary,
    },
    analysisDropdownRow: {
      marginBottom: 18,
    },
    analysisDropdown: {
      width: '100%',
      fontSize: 16,
      paddingVertical: 2, // Reduced vertical padding for lower height
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#B6D2F7',
      backgroundColor: '#F8FAFF',
      outline: 'none',
      marginBottom: 0,
    },
    analysisDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 2,
      flexWrap: 'wrap',
      width: '100%',
    },
    analysisDateInputBox: {
      flex: 1,
      minWidth: 90,
      maxWidth: 120,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 2,
    },
    analysisDateText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#222',
      width: '100%',
    },
    analysisDateToLabel: {
      fontSize: 13,
      fontFamily: 'Poppins-Medium',
      color: '#444',
      marginHorizontal: 4,
      alignSelf: 'center',
    },
    removeFilterButton: {
      marginLeft: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: '#E53935',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    removeFilterButtonText: {
      color: '#fff',
      fontSize: 13,
      fontFamily: 'Poppins-SemiBold',
    },
    // Top 3 Landmarks Styles
    landmarkListContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      marginHorizontal: 0, // Remove extra margin to align with grid containers
      padding: theme.spacing.md,
      paddingBottom: 1, // Reduce bottom padding
      flex: 1, // Take full width within grid3Container
    },
    landmarkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    landmarkRank: {
      marginRight: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rankNumber: {
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
      color: '#FFFFFF',
      backgroundColor: '#3776AB',
      borderRadius: 12,
      width: 32,
      height: 32,
      textAlign: 'center',
      lineHeight: 32,
    },
    rank1: {
      backgroundColor: '#3776AB', // Blue
    },
    rank2: {
      backgroundColor: '#4CAF50', // Green
    },
    rank3: {
      backgroundColor: '#FF9800', // Orange
    },
    landmarkDetails: {
      flex: 1,
    },
    landmarkName: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#333333',
      marginBottom: 4,
    },
    landmarkStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    landmarkVisitors: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#666666',
    },
    landmarkPercentage: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#666666',
    },
    progressBar: {
      height: 6,
      backgroundColor: '#F0F0F0',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBar1: {
      backgroundColor: '#E3F2FD',
    },
    progressBar2: {
      backgroundColor: '#E8F5E8',
    },
    progressBar3: {
      backgroundColor: '#FFF3E0',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressFill1: {
      backgroundColor: '#3776AB',
    },
    progressFill2: {
      backgroundColor: '#4CAF50',
    },
    progressFill3: {
      backgroundColor: '#FF9800',
    },
    noDataText: {
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#666666',
      padding: theme.spacing.lg,
    },
    analysisStatsContainer: {
      marginTop: 24,
      marginBottom: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      padding: 15,
      alignItems: 'stretch',
    },
    analysisStatsTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: '#222',
      marginBottom: 12,
    },
    analysisStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    analysisStatsCol: {
      flex: 1,
      alignItems: 'flex-start',
      marginRight: 12,
    },
    analysisStatsLabel: {
      fontSize: 13,
      color: '#6B7280',
      fontFamily: 'Poppins-Medium',
      marginBottom: 2,
    },
    analysisStatsValue: {
      fontSize: 20,
      color: '#222',
      fontFamily: 'Poppins-SemiBold',
      marginBottom: 2,
    },
    analysisChartContainer: {
      marginTop: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    analysisChart: {
      marginLeft: -15,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
      alignSelf: 'flex-start',
    },
    landmarkHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      width: '100%',
    },
    viewAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: 'transparent',
      alignSelf: 'flex-end',
    },
    viewAllButtonText: {
      color: '#8B0000',
      fontWeight: '600',
      fontSize: 14,
    },
  });

  export default DashboardScreen;
