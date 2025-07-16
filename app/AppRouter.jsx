import { useAuth } from './context/AuthContext';
import { useNavigation } from './context/NavigationContext';

// Import existing screens
import AddLandmarkModal from './modals/AddLandmarkModal';
import EditLandmarkModal from './modals/EditLandmarkModal';
import DashboardScreen from './screens/DashboardScreen';
import LandmarksScreen from './screens/LandmarksScreen';
import LoginScreen from './screens/LoginScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import ReportExportScreen from './screens/ReportExportScreen';
import TouristFormScreen from './screens/TouristFormScreen';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  const { currentRoute, routeParams } = useNavigation();

  // Debug log to trace route changes
  console.log('AppRouter: currentRoute =', currentRoute);

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Route to appropriate authenticated screen
  switch (currentRoute) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'landmarks':
      return <LandmarksScreen />;
    case 'qrcode':
      return <QRCodeScreen />;
    case 'touristForm':
      return <TouristFormScreen />;
    case 'addLandmark':
      return <AddLandmarkModal route={{ params: routeParams }} />;
    case 'editLandmark':
      return <EditLandmarkModal route={{ params: routeParams }} />;
    case 'reports':
      return <ReportExportScreen />;
    default:
      return <DashboardScreen />; // Default to dashboard
  }
};

export default AppRouter;
