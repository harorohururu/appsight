import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext({});

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [routeParams, setRouteParams] = useState(null);

  const navigate = (route, params = null) => {
    setCurrentRoute(route);
    setRouteParams(params);
  };

  const replace = (route, params = null) => {
    setCurrentRoute(route);
    setRouteParams(params);
  };

  const goBack = () => {
    setCurrentRoute('dashboard'); // Default back to dashboard
    setRouteParams(null);
  };

  const push = (route, params = null) => {
    setCurrentRoute(route);
    setRouteParams(params);
  };

  const value = {
    currentRoute,
    routeParams,
    navigate,
    replace,
    goBack,
    push,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
