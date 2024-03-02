import { View, Text, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React from 'react'
import {PaperAirplaneIcon} from 'react-native-heroicons/solid'
import { context } from '../globalState/Provider'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Navigation, { HomeStackParamList } from '../navigation/Navigation'
import { getCommentOfPost } from '../globalState/action';
import {ArrowLeftIcon} from 'react-native-heroicons/solid'

type props = NativeStackScreenProps<HomeStackParamList, 'commentScreen'>;

const CommentPost = ({route, navigation} : props) => {
  const {state, dispatch} = React.useContext(context);
  const [comment, setComment] = React.useState<string>('')

  
  const handleComment = async() =>{
    try {
      const response = await fetch(`http://10.0.2.2:3000/users/saveComment`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          AccountID: route.params.AccountID,
          ToAccountID: route.params.author,
          PostID: route.params.PostID,
          ContentOfComment: comment
        })
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
  
      const result = await response.json();
        if(result.success)
        {
          console.log(result.message);
          getCommentPost();
        }else
        {
          console.log(result.message);
        }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCommentPost = async() =>{
    try {
      const response = await fetch('http://10.0.2.2:3000/users/getCommentOfPost', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          PostID: route.params.PostID,
        })
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
  
      const result = await response.json();
        if(result.success)
        {
          console.log(result.message)
          dispatch(getCommentOfPost(result.data));
        }else
        {
          console.log(result.message);
        }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() =>{
    getCommentPost();
  }, []);

  return (
    <View className='flex-1'>
      <TouchableOpacity onPress={() => navigation.goBack()} className='border-b border-gray-400'>
        <ArrowLeftIcon size={30} color='black' />
      </TouchableOpacity>
      <FlatList 
        data={state.CommentPost}
        renderItem={({item}) =>(
          <View key={item.CommentID} className = 'w-full my-2'>
            <TouchableOpacity className='flex-row mx-2'>
              <View>
                <Image source={{
                  uri: item.Image
                }} 
                className = 'h-14 w-14 rounded-full'
                />
              </View>
              <View className='mx-2'>
                <Text className='text-base font-bold'>{item.NameOfUser}</Text>
                <Text>{item.ContentOfComment}</Text>
              </View>
            </TouchableOpacity>
        </View>

        )}
      />
      <View className='justify-between w-full flex-row items-center absolute bottom-4'>
        <TextInput 
        onChangeText={text => setComment(text)} 
        className='w-5/6 h-10 rounded-full text-black border' 
        placeholder='hi'/>
        <TouchableOpacity onPress={() => handleComment()} className='mr-2'>
            <PaperAirplaneIcon size={26} color='black'/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CommentPost