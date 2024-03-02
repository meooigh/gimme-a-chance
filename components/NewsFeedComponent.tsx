import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import {HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, ShareIcon} from'react-native-heroicons/solid'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/Navigation';
import { useNavigation } from '@react-navigation/native';


const {height, width} = Dimensions.get('window');
type propsNavigation = NativeStackScreenProps<HomeStackParamList, 'NewsFeedComponent'>
const NewsFeedComponent = (props : any) => {
  const navigation = useNavigation<propsNavigation>();
  return (
    <View className='my-2 bg-white'>
      {/* header */}
      <View className = 'w-full my-2'>
        <View>
          <TouchableOpacity className='flex-row mx-2'>
            <View>
              <Image source={{
                uri:'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'
              }} 
              className = 'h-14 w-14 rounded-full'
              />
            </View>
            <View className='mx-2'>
              <Text className='text-base font-bold'>{props.nameOfUser}</Text>
              <Text>{props.time}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className='mx-1 my-1'>
            <Text>{props.title}</Text>
        </View>   
      </View>
      {/* body */}
      <View>
        <TouchableOpacity className='border'>
          <Image source={{
            uri: props.image
          }}
          style={{
            resizeMode:'cover',
            height: height/2,
            width: width
        }}
          />
        </TouchableOpacity>
      </View>
      {/* foot */}
      <View className = 'w-full flex-row justify-between p-2 border'>
        <TouchableOpacity className='flex-row items-center '>
          <HandThumbUpIcon size={30} color='black'/>
          <Text className='text-base mx-1'>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={() => navigation.navigation.navigate('commentScreen',{
          AccountID: props.idOfAccount,
          PostID: props.postID,
          author: props.author
        })}
        className='flex-row items-center '>
          <ChatBubbleBottomCenterTextIcon size={30} color='black'/>
          <Text className='text-base mx-1'>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row items-center '>
          <ShareIcon size={30} color='black'/>
          <Text className='text-base mx-1'>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NewsFeedComponent