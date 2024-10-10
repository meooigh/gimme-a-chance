import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React from 'react';
import {
  Cog6ToothIcon,
  PhotoIcon,
  ArrowLeftIcon,
} from 'react-native-heroicons/solid';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/Navigation';
import ImagePicker from 'react-native-image-crop-picker';
import {context} from '../globalState/Provider';
import {getAllPosts, getCreatePostState} from '../globalState/action';
import {BASE_URL} from '../App';
// import {BASE_URL} from '../socket/SocketClient';

type props = NativeStackScreenProps<HomeStackParamList, 'CreatePost'>;

const CreatePost = ({navigation, route}: props) => {
  const {state, dispatch} = React.useContext(context);

  const chooseImageFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log('Selected image:', image);
        dispatch(getCreatePostState({Image: image}));
      })
      .catch(error => {
        console.error('Image picker error:', error);
      });
  };

  const handleCreatePost = async () => {
    const date = new Date().toLocaleDateString();

    const response = await fetch(`http://${BASE_URL}:3000/users/createPost`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Title: state.createPostState.Title,
        Image: state.createPostState.Image,
        TimeOfPost: date,
        Author: route.params.PersonID,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return;
    }
    const result = await response.json();
    console.log(result);
    if (result.success) {
      Alert.alert('Alert', result.message, [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
            const onePostCreated = route.params.onePostCreated;
            onePostCreated();
          },
        },
      ]);
    }
  };
  console.log('-_-', state.createPostState.Image.path);
  return (
    <View className="my-2">
      <View className="flex-row justify-between border-b border-gray-400 my-1 items-center">
        <TouchableOpacity
          className="flex-row"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={30} color="black" />
          <Text className="text-lg mx-2">Create your post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCreatePost()}
          className="mb-1 p-3 bg-blue-400 mr-2 rounded-md">
          <Text>POST</Text>
        </TouchableOpacity>
      </View>
      {/*header*/}
      <View className="flex-row ">
        <View className="ml-2">
          <Image
            source={{
              uri: 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
            }}
            className="h-16 w-16 rounded-full"
          />
        </View>
        <View className="mx-2">
          <Text className="text-base font-bold mb-1">meooigh</Text>
          <TouchableOpacity className="flex-row rounded-md bg-blue-200 items-center p-2">
            <Text>Custom</Text>
            <Cog6ToothIcon size={15} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="my-3 h-3/5 w-full border-b border-gray-400">
        <TextInput
          onChangeText={text => dispatch(getCreatePostState({Title: text}))}
          className="w-full h-1/5"
          placeholder="whats on your mind"
          style={{textAlignVertical: 'top'}}
        />
        <Image
          source={{uri: state.createPostState.Image?.path}}
          className="h-4/5 w-full"
          resizeMode="cover"
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => chooseImageFromLibrary()}
          className="flex-row w-full p-1 border-b border-gray-400 items-center">
          <PhotoIcon size={30} color="green" />
          <Text className="mx-2 text-sm">Add new photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePost;
