import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import React from 'react';
import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
  VideoCameraIcon,
} from 'react-native-heroicons/solid';
import SocketClient from '../socket/SocketClient';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ChatStackParamList,
  HomeStackParamList,
  RootStackParamList,
} from '../navigation/Navigation';
import {context} from '../globalState/Provider';
import {BASE_URL} from '../App';
import {v4 as uuidv4} from 'uuid';
export interface typeOfChatHistory {
  ChatContentID: number;
  ContentOfChat: number;
  AccountID: number;
  // ChatContent: string;
  // ToAccountID: number;
}
// const data: typeOfData[] = [
//   {
//     ChatContentSendID: 1,
//     AccountID: 3,
//     ChatContent: 'hello, my name is Trung',
//     ToAccountID: 4,
//   },
//   {
//     ChatContentSendID: 2,
//     AccountID: 4,
//     ChatContent: 'hi',
//     ToAccountID: 3,
//   },
//   {
//     ChatContentSendID: 6,
//     AccountID: 3,
//     ChatContent: 'wanna be friend',
//     ToAccountID: 4,
//   },
//   {
//     ChatContentSendID: 4,
//     AccountID: 4,
//     ChatContent: 'yehh',
//     ToAccountID: 3,
//   },
// ];
type chatText = {
  messageID: number;
  idAccount: number;
  ToAccountID: number;
  message: string;
};
type props = NativeStackScreenProps<ChatStackParamList, 'ChatScreen'>;
const ChatComponent = ({route, navigation}: props) => {
  const [message, setMessage] = React.useState<string>();
  const [receivedMessage, setReceivedMessage] = React.useState<Array<chatText>>(
    [],
  );
  // const {state, dispatch} = React.useContext(context);
  const [chatHistory, setChatHistory] = React.useState<
    Array<typeOfChatHistory>
  >([]);
  const idAccount = route.params.idAccount;
  const ToAccountID = route.params.ToAccountID;

  React.useEffect(() => {
    getChatHistory();
  }, []);
  const getChatHistory = async () => {
    try {
      // console.log('Data being sent: ', receivedMessage); // Log data to verify
      const response = await fetch(
        `http://${BASE_URL}:3000/users/getAllChatHistory`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserID: idAccount,
            PartnerID: ToAccountID,
          }),
        },
      );

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      if (result.success) {
        setChatHistory(result.data);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  console.log('alo', chatHistory);
  const renderChatText = (item: typeOfChatHistory) => {
    // console.log('dasg', item);
    const sendByMe = item.AccountID == idAccount ? true : false;

    switch (sendByMe) {
      case true:
        return (
          <View className="items-end mx-2">
            <View className="bg-blue-600 rounded-full p-2">
              <Text className="text-white text-base">{item.ContentOfChat}</Text>
            </View>
          </View>
        );

      case false:
        return (
          <View className=" flex-row my-4">
            <View className="mx-2">
              <Image
                source={{
                  uri: 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
                }}
                className="h-10 w-10 rounded-full"
              />
            </View>
            <View className="bg-blue-500 justify-center p-2 rounded-full">
              <Text className="text-white text-base">{item.ContentOfChat}</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderChatMessage = (item: chatText) => {
    const sendByMe = item.messageID == idAccount ? true : false;

    switch (sendByMe) {
      case false:
        return (
          <View className="items-end mx-2 my-2">
            <View className="bg-blue-600 rounded-full p-2">
              <Text className="text-white text-base">{item.message}</Text>
            </View>
          </View>
        );

      case true:
        return (
          <View className=" flex-row my-4">
            <View className="mx-2">
              <Image
                source={{
                  uri: 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
                }}
                className="h-10 w-10 rounded-full"
              />
            </View>
            <View className="bg-blue-500 justify-center p-2 rounded-full">
              <Text className="text-white text-base">{item.message}</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };
  const saveChatHistory = async () => {
    try {
      console.log('Data being sent: ', receivedMessage); // Log data to verify
      const response = await fetch(`http://${BASE_URL}:3000/users/saveChat`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: receivedMessage, // Ensure this is not empty
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      if (result.success) {
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    SocketClient.initialize({
      query: {
        idAccount: idAccount,
        ToAccountID: ToAccountID,
      },
    });

    SocketClient.on('received-message', (data: chatText) => {
      setReceivedMessage(prevMessages => [...prevMessages, data]);
      setChatHistory(prevMessages => [
        ...prevMessages,
        {
          ChatContentID: data.messageID,
          ContentOfChat: data.message,
          AccountID: data.idAccount,
        },
      ]);
    });
    return () => {
      SocketClient.emit('user-disconnect', {reason: 'a user left the room.'});
    };
  }, []);
  // console.log('receivedMessage: ', uuidv4());
  const sendMessage = () => {
    const newMessage = {
      idAccount: idAccount,
      ToAccountID: ToAccountID,
      message: message,
      messageID: Date.now() + Math.floor(Math.random() * 100000000),
    };
    SocketClient.emit('send-message', newMessage);
    setChatHistory(prevMessages => [
      ...prevMessages,
      {
        ChatContentID: newMessage.messageID,
        ContentOfChat: newMessage.message,
        AccountID: newMessage.idAccount,
      },
    ]);
    setMessage('');
    // Keyboard.dismiss();
  };
  // console.log('daga', receivedMessage);
  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
      <View style={{flex: 1}}>
        {/* Header */}
        <View className="flex-row justify-between p-1 shadow shadow-neutral-950">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
                // saveChatHistory();
              }}>
              <ArrowUturnLeftIcon size={30} color="black" />
            </TouchableOpacity>
            <View className="flex-row items-center">
              <TouchableOpacity>
                <Image
                  source={{
                    uri: 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
                  }}
                  className="h-14 w-14 rounded-full ml-4"
                />
              </TouchableOpacity>
              <View className="mx-2">
                <Text className="text-lg font-bold">
                  {route.params.NameOfUser}
                </Text>
                <Text>Active now</Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center mx-2">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CallVideo', {
                  idAccount: idAccount,
                  ToAccountID: ToAccountID,
                })
              }>
              <VideoCameraIcon size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat History */}
        <View style={{flex: 1, zIndex: 1000}}>
          <FlatList
            data={chatHistory}
            renderItem={({item}) => renderChatText(item)}
            keyExtractor={item => item.ChatContentID.toString()}
          />
        </View>

        {/* Input */}
        <View className="h-10 justify-between flex-row items-center bottom-4 px-1">
          <TextInput
            onChangeText={text => setMessage(text)}
            className="w-5/6 h-10 rounded-full text-black border"
            placeholder="Type a message"
            value={message}
          />
          <TouchableOpacity onPress={sendMessage} className="mr-2">
            <PaperAirplaneIcon size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};
export default ChatComponent;
