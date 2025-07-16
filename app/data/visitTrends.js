// Mock data for tourist visit trends
export const monthlyVisitTrends = {
  labels: ["Jan 2024", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan 2025", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      data: [950, 1010, 1150, 1040, 1060, 1080, 990, 1020, 870, 980, 1170, 520, 850, 920, 1100, 1200, 1150, 1300, 1250],
      color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`, // Blue color matching your image
      strokeWidth: 3
    }
  ]
};

export const weeklyVisitTrends = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
  datasets: [
    {
      data: [2800, 3200, 2900, 3100, 2750, 3400, 3000, 3250],
      color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`,
      strokeWidth: 3
    }
  ]
};

export const dailyVisitTrends = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [450, 520, 480, 610, 580, 750, 680, 520, 590, 510, 650, 620, 780, 720],
      color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`,
      strokeWidth: 3
    }
  ]
};

export const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(69, 142, 209, ${opacity})`, // Matching the blue from your image
  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  style: {
    borderRadius: 0,
    marginVertical: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 10,
    paddingBottom: 30,
  },
  propsForDots: {
    r: "3",
    strokeWidth: "2",
    stroke: "#458ED1"
  },
  propsForBackgroundLines: {
    strokeDasharray: "", // solid lines
    stroke: "#f0f0f0",
    strokeWidth: 1
  },
  propsForLabels: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    rotation: -45, // Tilt labels to the left
  },
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 10,
  paddingBottom: 30
};
