import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import {ArrowUturnLeftIcon, PaperAirplaneIcon, VideoCameraIcon} from 'react-native-heroicons/solid'
import SocketClient from '../socket/SocketClient'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ChatStackParamList, HomeStackParamList, RootStackParamList } from '../navigation/Navigation'

export interface typeOfData{
    ChatContentSendID: number,
    AccountID: number,
    ChatContent: string,
    ToAccountID: number
}
const data : typeOfData[] =[
  {
    ChatContentSendID: 1,
    AccountID : 3,
    ChatContent: 'hello, my name is Trung',
    ToAccountID: 4
  },
  {
    ChatContentSendID: 2,
    AccountID : 4,
    ChatContent: 'hi',
    ToAccountID: 3
  },
  {
    ChatContentSendID: 6,
    AccountID : 3,
    ChatContent: 'wanna be friend',
    ToAccountID: 4
  },
  {
    ChatContentSendID: 4,
    AccountID : 4,
    ChatContent: 'yehh',
    ToAccountID: 3
  }
]
type chatHistory ={
  messageID: number,
  idAccount: number,
  ToAccountID: number,
  message: string
}
type props = NativeStackScreenProps<ChatStackParamList, 'ChatScreen'>
const ChatComponent = ({route, navigation}: props) => {
  const [message, setMessage] = React.useState<string>();
  const [receivedMessage, setReceivedMessage] = React.useState<Array<chatHistory>>([]);

  const idAccount = route.params.idAccount;
  const ToAccountID = route.params.ToAccountID;

  const renderChatText = (item: typeOfData) => {
    const sendByMe = item.AccountID == idAccount? true: false;

  switch (sendByMe) {
    case true:
      return (
        <View className='items-end mx-2'>
          <View className='bg-blue-600 rounded-full p-2'>
            <Text className='text-white text-base'>{item.ChatContent}</Text>
          </View>
        </View>
      );

    case false:
      return (
        <View className=' flex-row my-4'>
          <View className='mx-2'>
            <Image
              source={{
                uri:
                  'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
              }}
              className='h-10 w-10 rounded-full'
            />
          </View>
          <View className='bg-blue-500 justify-center p-2 rounded-full'>
            <Text className='text-white text-base'>{item.ChatContent}</Text>
          </View>
        </View>
      );

    default:
      return null;
  }
};

  const renderChatMessage = (item: chatHistory) => {
    const sendByMe = item.messageID == idAccount? true: false;

  switch (sendByMe) {
    case false:
      return (
        <View className='items-end mx-2 my-2'>
          <View className='bg-blue-600 rounded-full p-2'>
            <Text className='text-white text-base'>{item.message}</Text>
          </View>
        </View>
      );

    case true:
      return (
        <View className=' flex-row my-4'>
          <View className='mx-2'>
            <Image
              source={{
                uri:
                  'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
              }}
              className='h-10 w-10 rounded-full'
            />
          </View>
          <View className='bg-blue-500 justify-center p-2 rounded-full'>
            <Text className='text-white text-base'>{item.message}</Text>
          </View>
        </View>
      );

    default:
      return null
  }
};

React.useEffect(() => {
  SocketClient.initialize({
    query: {
      idAccount: idAccount,
      ToAccountID: ToAccountID
    }
  });

  SocketClient.on('received-message', (data: chatHistory) => {
    setReceivedMessage(prevMessages => [...prevMessages, data]);
  });
}, []);

const sendMessage = () => {
  const newMessage = {
    idAccount: idAccount,
    ToAccountID: ToAccountID,
    message: message,
    messageID: Math.random() 
  };
  SocketClient.emit('send-message', newMessage);
  return () =>{
    SocketClient.emit('user-disconnect', {reason: 'a user left the room.'})
  }
}

  return (
    <View className='flex-1'>
      {/* header */}
        <View className='flex-row justify-between p-1 shadow shadow-neutral-950'>
          <View className='flex-row items-center'>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
              <ArrowUturnLeftIcon size={30} color='black'/>
            </TouchableOpacity>
            <View className='flex-row items-center'>
              <TouchableOpacity>
                <Image 
                  source={{
                    uri:'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'

                  }}
                  className='h-14 w-14 rounded-full ml-4'
                />
              </TouchableOpacity>
              <View className='mx-2'>
                <Text className='text-lg font-bold'>Trung</Text>
                <Text>Active now</Text>
              </View>
            </View>
          </View>
          <View className='flex-row items-center mx-2'>
            <TouchableOpacity className=''>
              <VideoCameraIcon size={30} color='black'/>
            </TouchableOpacity>
          </View>
        </View>
      {/* render chat history */}
      <View>
        <FlatList 
          data={data}
          renderItem={({item}) =>(
            <View key={item.ChatContentSendID}>
              {renderChatText(item)}
            </View>
          )}
          keyExtractor={(item) => item.ChatContentSendID.toString()}
        />
      </View>
      {/* render chat message */}
      <View>
         <FlatList 
          data={receivedMessage}
          renderItem={({item}) =>(
            <View key={item.messageID}>
              {renderChatMessage(item)}
            </View>
          )}
          keyExtractor={(item) => item.messageID.toString()}
        />
      </View>
      {/* text input */}
      <View className='justify-between w-full flex-row items-center absolute bottom-4 px-1'>
        <TextInput 
        onChangeText={text => setMessage(text)}
        className='w-5/6 h-10 rounded-full text-black border' 
        placeholder='hi'/>
        <TouchableOpacity onPress={() => sendMessage()} className='mr-2'>
            <PaperAirplaneIcon size={30} color='black'/>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default ChatComponent