import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native'
import Home from '../screens/Home'
import Provider from '../globalState/Provider'
import CreatePost from '../components/CreatePost'
import RegisterComponent from '../screens/RegisterComponent'
import SearchList from '../components/SearchList'
import CommentPost from '../components/CommentPost'
import NewsFeedComponent from '../components/NewsFeedComponent'
import ChatComponent from '../components/ChatComponent'
import ListChat from '../components/ListChat'

export type ChatStackParamList = {
  ListChat: {
    idAccount: number
  },
  ChatScreen: {
    idAccount: number,
    ToAccountID: number
  }
}

export type HomeStackParamList = {
  Home: {
    idOfAccount: number
  },
  CreatePost: {
    PersonID: number,
    onePostCreated: () => void
  },
  SearchList: {
    idOfUser: number
  },
  commentScreen:{
    AccountID: number,
    PostID: number,
    author: number
  },
  NewsFeedComponent: undefined,
  ChatStack: NavigatorScreenParams<ChatStackParamList>
}


export type RootStackParamList = {
  LoginScreen: undefined,
  HomeStack: NavigatorScreenParams<HomeStackParamList>,
  RegisterScreen: undefined
}
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ChatStackParam = () =>{
  return(
    <ChatStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <ChatStack.Screen name='ListChat' component={ListChat}/>
      <ChatStack.Screen name='ChatScreen' component={ChatComponent}/>
    </ChatStack.Navigator>
  )
}
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackParam = () =>{
  return (
      <HomeStack.Navigator screenOptions={{
        headerShown: false
      }}>
        <HomeStack.Screen name='Home' component={Home}/>
        <HomeStack.Screen name='CreatePost' component={CreatePost} />
        <HomeStack.Screen name ='SearchList' component={SearchList} />
        <HomeStack.Screen name='commentScreen' component={CommentPost} />
        <HomeStack.Screen name='NewsFeedComponent' component={NewsFeedComponent} />
        <HomeStack.Screen name='ChatStack' component={ChatStackParam} />
      </HomeStack.Navigator>
  )
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <Provider>
    <NavigationContainer>
        <RootStack.Navigator initialRouteName='LoginScreen' screenOptions={{
          headerShown: false
        }}>
          <RootStack.Screen name = 'LoginScreen' component = {LoginScreen}/>
          <RootStack.Screen name = 'HomeStack' component = {HomeStackParam} />
          <RootStack.Screen name= 'RegisterScreen' component={RegisterComponent}/>
        </RootStack.Navigator> 
    </NavigationContainer>
    </Provider>
  )
}

export default Navigation