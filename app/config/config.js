const API_URL = 'http://192.168.18.170:5000/api'; // Updated to local IP for phone access

const config = {
  APP_NAME: 'SIGHT-Lipa',
  CITY: 'Lipa City',
  PROVINCE: 'Batangas',
  DEFAULT_COORDINATES: {
    latitude: 13.941089469045563,
    longitude: 121.16354084417924,
  },
  QR_CODE_URL: 'http://localhost:8081/touristForm', // Update this to your actual QR code URL
};

export { API_URL };
export default config;
