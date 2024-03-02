import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native'
import React from 'react'
import { HomeIcon , MagnifyingGlassIcon, ChatBubbleBottomCenterIcon, VideoCameraIcon } from 'react-native-heroicons/solid'
import NewsFedd from '../components/NewsFedd'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { HomeStackParamList, RootStackParamList} from '../navigation/Navigation'
import { context } from '../globalState/Provider'
import { getAllPosts } from '../globalState/action'
import { useNavigation } from '@react-navigation/native';

type props = NativeStackScreenProps<HomeStackParamList, 'Home'>;
const Home = ({route, navigation}: props) => {
  const {state, dispatch} = React.useContext(context);

  const getPosts = async() =>{
    try {
      const response = await fetch(`http://10.0.2.2:3000/users/getAllPosts?page=${1}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserID: route.params.idOfAccount
        })
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
  
      const result = await response.json();
        if(result.success)
        {
          dispatch(getAllPosts(result.data))
        }else
        {
          console.log(result.message);
        }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  React.useEffect(() =>{
    getPosts();
  },[])
  return (
    <View className='bg-white'>
      {/* title */}
      <View className='bg-slate-300'>
        <View className='flex-row justify-between items-center mx-4'>
          <Text className='text-white text-3xl'>
            <Text className='text-yellow-300'>B</Text>adass
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchList', {
            idOfUser: route.params.idOfAccount
          })}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* task bar*/}
      <View className='bg-slate-300 '>
        <View className='flex-row justify-between items-center mx-4'>
          <TouchableOpacity>
            <HomeIcon size="30" strokeWidth={2} color='white'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatStack',{
            screen:'ListChat',
            params:{
              idAccount: route.params.idOfAccount
            }
          })}>
            <ChatBubbleBottomCenterIcon size="30" strokeWidth={2} color='white'/>
          </TouchableOpacity>
          <TouchableOpacity>
            <VideoCameraIcon size="30" strokeWidth={2} color='white'/>
          </TouchableOpacity>
        </View>
      </View>
      {/*image icon and status bar */}
        <View className='flex-row mx-3 mt-3 justify-self-center'>
          <TouchableOpacity className='h-15 w-15'>
            <Image
            className='h-14 w-14 rounded-full border'
            source={{
              uri: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
            }}/>
          </TouchableOpacity>
          <TouchableOpacity className='mt-2 h-14 w-10/12 ml-5' onPress={() => navigation.navigate('CreatePost',{
            PersonID: route.params.idOfAccount,
            onePostCreated:() => getPosts()
          })}>
              <View className='h-10 w-10/12 border rounded-xl justify-center'>
                <Text className='ml-1'>What are you thinking</Text>
              </View>
          </TouchableOpacity>
      </View>
      {/* newfeeds */}
      <View>
        <NewsFedd
        idOfAccount={route.params.idOfAccount} />
      </View>
    </View>

  )
}

export default Home