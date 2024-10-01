import React from 'react';
import Navigation from './navigation/Navigation';
import CommentPost from './components/CommentPost';
import ListChat from './components/ListChat';
import ChatComponent from './components/ChatComponent';
export const BASE_URL = '192.168.58.187';
export const SOCKET_URL = `http://${BASE_URL}:3000`;
const App = () => {
  return <Navigation />;
};

export default App;
