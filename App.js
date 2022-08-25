import React from 'react';
import {StatusBar} from 'react-native';
import Navigation from './src/components/Navigation';
import {AuthProvider} from './src/context/AuthContext';
import {enableLatestRenderer} from 'react-native-maps';

const App = () => {
  enableLatestRenderer();
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#4b636e" />
      <Navigation />
    </AuthProvider>
  );
};

export default App;
