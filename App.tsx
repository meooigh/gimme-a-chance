import React from 'react';
import Navigation from './navigation/Navigation';
export const BASE_URL = '192.168.61.187';
export const SOCKET_URL = `http://${BASE_URL}:3000`;
const App = () => {
  return <Navigation />;
};

export default App;
