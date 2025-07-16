// Mock data for Landmark Analysis chart and stats
const landmarkAnalysisData = {
  'lipa_cathedral': {
    name: 'Lipa Cathedral',
    totalVisitors: 1778,
    dailyAverage: 7.53,
    peakDay: {
      date: '2024-04-25',
      count: 31
    },
    chart: {
      labels: [
        'Jan 2', 'Jan 25', 'Feb 14', 'Feb 24', 'Mar 10', 'Mar 17', 'Apr 2', 'Apr 11', 'Apr 25', 'May 8',
        'Jun 1', 'Jun 14', 'Jun 23', 'Jul 17', 'Aug 1', 'Aug 27', 'Sep 6', 'Sep 21', 'Oct 10', 'Nov 8',
        'Nov 22', 'Dec 2', 'Dec 19', 'Jan 14', 'Jan 25', 'Feb 11', 'Feb 18', 'Mar 5', 'Mar 20', 'Apr 7', 'Apr 24', 'May 2'
      ],
      datasets: [
        {
          data: [12, 18, 7, 15, 10, 9, 14, 8, 31, 6, 11, 5, 8, 29, 7, 21, 10, 13, 8, 12, 9, 6, 10, 8, 13, 7, 9, 11, 8, 10, 25, 20],
          color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`,
          strokeWidth: 2
        }
      ]
    }
  },
  'mount_malarayat': {
    name: 'Mount Malarayat',
    totalVisitors: 1797,
    dailyAverage: 8.1,
    peakDay: {
      date: '2024-03-15',
      count: 28
    },
    chart: {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [
        {
          data: [120, 140, 180, 160, 150, 130, 120, 140, 110, 100, 120, 127],
          color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`,
          strokeWidth: 2
        }
      ]
    }
  },
  'the_farm_at_san_benito': {
    name: 'The Farm at San Benito',
    totalVisitors: 1749,
    dailyAverage: 7.9,
    peakDay: {
      date: '2024-05-10',
      count: 25
    },
    chart: {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [
        {
          data: [110, 120, 150, 140, 135, 120, 110, 120, 100, 90, 110, 124],
          color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`,
          strokeWidth: 2
        }
      ]
    }
  },
  'taal_basilica': {
    name: 'Taal Basilica',
    totalVisitors: 1600,
    dailyAverage: 6.5,
    peakDay: {
      date: '2024-04-01',
      count: 22
    },
    chart: {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [
        {
          data: [100, 110, 130, 120, 115, 100, 90, 110, 80, 70, 90, 94],
          color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`,
          strokeWidth: 2
        }
      ]
    }
  },
  'malvar_shrine': {
    name: 'Malvar Shrine',
    totalVisitors: 1500,
    dailyAverage: 6.1,
    peakDay: {
      date: '2024-02-20',
      count: 20
    },
    chart: {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [
        {
          data: [90, 100, 120, 110, 105, 90, 80, 100, 70, 60, 80, 84],
          color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`,
          strokeWidth: 2
        }
      ]
    }
  },
  // Add more landmarks as needed
};

export default landmarkAnalysisData;
