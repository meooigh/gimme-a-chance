import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/Navigation'
import { context } from '../globalState/Provider'
import { getRegisterState } from '../globalState/action'

type props = NativeStackScreenProps<RootStackParamList, 'RegisterScreen'>
const RegisterComponent = ({navigation} : props) => {
  const {state, dispatch} = React.useContext(context);

  const handleRegister = async() =>{
    const response = await fetch('http://10.0.2.2:3000/users/register', {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          UserName: state.registerState.UserName,
          Password: state.registerState.Password,
          email: state.registerState.email,
          name: state.registerState.name,
          date: state.registerState.date
        })
    })
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
      const result = await response.json()
      if(result.success)
      {
        Alert.alert('Alert', result.message, [
          {
            text:'Login now',
            onPress: ()=> navigation.navigate('LoginScreen')
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]);
      }
  }

  return (
    <View className='justify-center'>
      <View className='my-4'>
        <View className='flex-row my-2 justify-around items-center'>
          <Text className='mr-1 text-lg '>Username:</Text>
          <TextInput 
          onChangeText={(text) => dispatch(getRegisterState({UserName: text}))} 
          className='w-4/6 h-10 border rounded-md' 
          placeholder='Enter you username'/>
        </View>
        <View className='flex-row my-2 justify-around items-center'>
          <Text className='mr-1 text-lg '>Password:</Text>
          <TextInput
          onChangeText={text => dispatch(getRegisterState({Password: text}))} 
          className='w-4/6 h-10 border rounded-md' 
          placeholder='Enter you Password'/>
        </View>
      </View>
      <View className='my-4'>
        <View className='items-center'>
          <TextInput
          onChangeText={(text) => dispatch(getRegisterState({email: text}))} 
          className='w-11/12 h-11 border rounded-sm' 
          placeholder='Enter your email' />
        </View>
        <View className='flex-row items-center justify-around my-4'>
          <TextInput
          onChangeText={(text) => dispatch(getRegisterState({name: text}))} 
          className='w-1/3 h-10 border rounded-sm' 
          placeholder='Enter your name' />
          <TextInput
          onChangeText={(text) => dispatch(getRegisterState({date: text}))} 
          className='w-1/3 h-10 border rounded-sm' 
          placeholder='yyyy-mm-dd' />
        </View>
        <View className='my-4 items-center'>
          <TouchableOpacity onPress={() => handleRegister()}  className='p-3 w-4/6 bg-blue-400 rounded-full items-center my-2'>
            <Text>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} className='p-3 w-4/6 bg-blue-400 rounded-full items-center my-2'>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default RegisterComponent