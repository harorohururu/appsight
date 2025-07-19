# SIGHT-Lipa Tourist Monitoring App

A React Native mobile application for managing tourist data and landmarks in Lipa City, Batangas.

---

## 📁 Project Structure

```
app/
├── components/            # Reusable UI components (buttons, headers, navigation bars, etc.)
│   ├── BottomNavigationBar.jsx   # Bottom tab navigation for main app sections
│   ├── Breadcrumbs.jsx           # Breadcrumb navigation for contextual feedback
│   ├── Button.jsx                # Custom button component
│   ├── Header.jsx                # App header with title and navigation
│   └── ...                       # Other shared UI components
│
├── config/                # App configuration files
│   ├── config.js                # App-wide constants and URLs
│   └── theme.js                 # Color palette, font, and spacing definitions
│
├── context/               # React context providers
│   └── NavigationContext.jsx    # Custom navigation and role-based routing logic
│
├── data/                  # Static/mock data for dropdowns and forms
│   ├── countries.js              # List of countries for nationality selection
│   ├── landmarks.js              # Landmark data for forms and analytics
│   └── landmarkTypes.js          # Landmark type definitions (e.g., Resort, Church)
│
├── layouts/               # Layout wrappers for consistent app structure
│   └── MainLayout.jsx            # Provides SafeArea, PaperProvider, and theming
│
├── modals/                # Modal dialogs for alerts, terms, and privacy
│   ├── AlertModal.jsx             # Custom alert modal for feedback
│   ├── PrivacyConsentModal.jsx    # Modal for privacy policy and consent
│   └── TermsModal.jsx             # Modal for terms and conditions
│
├── screens/               # Main app screens
│   ├── DashboardScreen.jsx        # Dashboard with analytics and summary cards
│   ├── LandmarkScreen.jsx         # Landmark list, add/edit/delete functionality
│   ├── LoginScreen.jsx            # Login form with validation and modals
│   ├── ProfileScreen.jsx          # User profile view and edit
│   ├── QRCodeScreen.jsx           # QR code generation and download
│   ├── ReportExportScreen.jsx     # Exportable analytics and visitor reports (PDF)
│   └── TouristFormScreen.jsx      # Tourist registration form with validation
│
├── utils/                  # Utility/helper functions
│   └── ReportPdfGenerator.js      # Generates HTML for PDF export from report data
│
├── AppRouter.jsx           # Main app router with role-based navigation logic
├── App.js                  # App entry point, wraps everything in providers
└── README.md               # Project documentation (this file)
```

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the app**
   ```bash
   npx expo start
   ```

   Open the app in:
   - [Expo Go](https://expo.dev/go) (scan QR code)
   - Android emulator
   - iOS simulator
   - Development build

---

## 🛠️ Libraries Used

| Library Name                | Purpose                                                      |
|-----------------------------|--------------------------------------------------------------|
| react-native-paper          | Buttons, layout, forms, theming, modals                      |
| @expo/vector-icons          | Icons for navigation, buttons, and feedback                  |
| @react-native-picker/picker | Dropdowns/selection menus in forms and modals                |
| react-native-chart-kit      | Charts for dashboard analytics                               |
| expo-print                  | PDF export functionality                                     |
| expo-sharing                | Sharing exported PDF files                                   |
| expo-file-system            | File handling for PDF export                                 |
| react-native-qrcode-svg     | QR code generation for QR Code screen                        |
| react-native-svg            | Underlying SVG support for charts and QR codes               |

---

## 📚 Documentation & Resources

- ☑ **Project Structure Screenshot**  
  *(Attach a screenshot of your file explorer or IDE showing the above structure)*

- ☑ **Source Code Repository with UI Comments**  
  🔗 GitHub/Repo link: [https://github.com/harorohururu/appsight](https://github.com/harorohururu/appsight)

---

## 📝 Features

- Role-based login (Admin, Staff)
- Dashboard with analytics and charts
- Landmark management (add, edit, delete)
- QR code generation for tourist registration
- Tourist registration form with validation and privacy consent
- PDF report export and sharing
- Responsive and accessible UI

---

## 🌐 Changing WiFi or Network

If you change WiFi, your computer’s IP address may change.

- Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your new IPv4 address.
- Update the API URL in your frontend code to use the new IP address (e.g., `http://<NEW_IP>:5000`).
- Restart your frontend app.

Example:
```js
fetch('http://NEW_IP_ADDRESS:5000/api/users/login', { ... })
```

If you are running the app on a mobile device or emulator, always use your computer’s IP address, not `localhost`.

---

## 🤝 Join the Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)

---

**Note:**  
- Remove any files or folders from this list that are empty in your actual project.
- Each file and folder is commented above to describe its purpose in the project.