import { View,
         Text, 
         ImageBackground, 
         TextInput,  
         TouchableOpacity 
} from 'react-native'
import React from 'react'
import {UserIcon, LockClosedIcon, CameraIcon} from "react-native-heroicons/solid";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { context } from '../globalState/Provider';
import { getPassword, getUsername } from '../globalState/action';

type props = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>

const LoginScreen = ({navigation}:props) => {
  const {state, dispatch} = React.useContext(context);
  
  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/users/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: state.setUsername,
          password: state.setPassword
        })
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
  
      const result = await response.json();
        if(result.success)
        {
            navigation.navigate('HomeStack',{
              screen: 'Home',
              params: {
                idOfAccount: result.data.AccountID
              }
          })
        }else
        {
          console.log(result.message)
        }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <View className='flex-1'>
      <ImageBackground
        className='flex-1'
        resizeMode='cover'
        source={require('../images/background.png')}
      >
        <View className='h-1/3 w-full justify-center items-center'>
          <TouchableOpacity className='absolute left-0 top-0'>
            <CameraIcon size={40} color='yellow'/>
          </TouchableOpacity>
          <Text className='text-white text-5xl'>badass</Text>
        </View>
        <View className='items-center justify-end pb-20 h-1/3 w-full'>
          <View className='h-22 w-5/6 border-b border-yellow-300' >
              <Text className='text-white'>USERNAME</Text>
              <View className='flex-row'>
                <UserIcon size={30} color='yellow' />
                <TextInput 
                onChangeText={text => dispatch(getUsername(text))}
                className='w-5/6 h-18 text-white' 
              />
              </View>
          </View>
          <View className='h-22 w-5/6 border-b border-yellow-300 mt-5' >
              <Text className='text-white'>PASSWORD</Text>
              <View className='flex-row'>
                <LockClosedIcon size={30} color='yellow' />
                <TextInput
                onChangeText={text => dispatch(getPassword(text))} 
                className='w-5/6 h-18 text-white' 
              />
              </View>
          </View>
        </View>
        <View className='items-center h-1/3 w-full'>
          <TouchableOpacity 
          className='
          h-11 
          w-5/6 bg-yellow-300 rounded-xl
          border shadow-lg shadow-yellow-300
          items-center
          justify-center
          '
          onPress={() =>{
            handleLogin()
          }}
          >
            <Text className='text-lg font-bold '>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')} className='mt-2'>
            <Text className='text-white'>Do you have any account?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen