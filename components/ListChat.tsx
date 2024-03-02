import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import {MagnifyingGlassIcon} from 'react-native-heroicons/solid'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ChatStackParamList, HomeStackParamList } from '../navigation/Navigation'
import { ObjectPayloadFriendInfo, getAllFriend } from '../globalState/action'
import { context } from '../globalState/Provider'

type props = NativeStackScreenProps<ChatStackParamList, 'ListChat'>
const ListChat = ({route, navigation} : props) => {
    const {state, dispatch} = React.useContext(context);
    const getFriends = async() =>{
      try {
        const response = await fetch('http://10.0.2.2:3000/users/getListChatFriend', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            UserID: route.params.idAccount
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
            dispatch(getAllFriend(result.data));
          }else
          {
            console.log(result.message);
          }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const chatBar = (item : ObjectPayloadFriendInfo) =>{
        return (
            <TouchableOpacity onPress={() =>navigation.navigate('ChatScreen', {
                idAccount: route.params.idAccount,
                ToAccountID: item.AccountID
            })} className='flex-row mb-3'>
                <View className='ml-2'>
                    <Image 
                        className='h-14 w-14 rounded-full'
                        source={{
                            uri:"https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
                        }}
                    />
                </View>
                <View className='mx-2'>
                    <Text className='text-lg font-bold'>{item.NameOfUser}</Text>
                    <Text>hello</Text>
                </View>
            </TouchableOpacity>
        )
    };

    React.useEffect(() =>{
      getFriends();
    },[]);
  return (
    <View className='flex-1'>
      <View className='my-2 ml-2'>
        <Text className='text-2xl font-bold'>Đoạn chat</Text>
      </View>
      <View className='bg-gray-300 rounded-full flex-row items-center mb-3'>
        <MagnifyingGlassIcon className='mx-2' size={30} color='black' />
        <TextInput
        placeholder='Tìm kiếm chat box'
        />
      </View>
      {/* list friend */}
      <View>
        <FlatList
            data = {state.FriendInfor}
            renderItem={({item}) => 
                <View key={item.AccountID}>{chatBar(item)}</View>
        }
            keyExtractor={item => item.AccountID.toString()}
        />
      </View>
    </View>
  )
}

export default ListChat;