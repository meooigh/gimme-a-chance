import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
  VideoCameraIcon,
} from 'react-native-heroicons/solid';
import NewsFedd from '../components/NewsFedd';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/Navigation';
import {context} from '../globalState/Provider';
import {getAllPosts} from '../globalState/action';
import {BASE_URL} from '../App';

type props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const Home = ({route, navigation}: props) => {
  const {state, dispatch} = React.useContext(context);
  const [isVisible, setIsVisible] = useState(true); // Track visibility of header and taskbar
  const scrollY = useRef(0); // Keep track of the last scroll position
  const lastOffsetY = useRef(0); // Keep track of the last scroll offset

  const getPosts = async () => {
    try {
      const response = await fetch(
        `http://${BASE_URL}:3000/users/getAllPosts?page=${1}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserID: route.params.idOfAccount,
          }),
        },
      );

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      if (result.success) {
        dispatch(getAllPosts(result.data));
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    getPosts();
  }, []);

  // Detect scroll and toggle visibility based on 50px threshold
  const handleScroll = event => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const deltaY = currentOffsetY - lastOffsetY.current;

    // Toggle visibility every 50px scroll
    if (Math.abs(deltaY) > 50) {
      setIsVisible(deltaY < 0); // Show when scrolling up, hide when scrolling down
      lastOffsetY.current = currentOffsetY;
    }
  };

  return (
    <View className="bg-white">
      {/* Animated header and taskbar */}
      {isVisible && (
        <Animated.View className="bg-slate-300">
          <View className="flex-row justify-between items-center mx-4">
            <Text className="text-white text-3xl">
              <Text className="text-yellow-300">B</Text>adass
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchList', {
                  idOfUser: route.params.idOfAccount,
                })
              }>
              <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {isVisible && (
        <Animated.View className="bg-slate-300">
          <View className="flex-row justify-between items-center mx-4">
            <TouchableOpacity>
              <HomeIcon size="30" strokeWidth={2} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChatStack', {
                  screen: 'ListChat',
                  params: {
                    idAccount: route.params.idOfAccount,
                  },
                })
              }>
              <ChatBubbleBottomCenterIcon
                size="30"
                strokeWidth={2}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <VideoCameraIcon size="30" strokeWidth={2} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Scrollable content */}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16} // Ensure smooth scroll event handling
      >
        {/* image icon and status bar */}
        <View className="flex-row mx-3 mt-3 justify-self-center">
          <TouchableOpacity className="h-15 w-15">
            <Image
              className="h-14 w-14 rounded-full border"
              source={{
                uri: 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-2 h-14 w-10/12 ml-5"
            onPress={() =>
              navigation.navigate('CreatePost', {
                PersonID: route.params.idOfAccount,
                onePostCreated: () => getPosts(),
              })
            }>
            <View className="h-10 w-10/12 border rounded-xl justify-center">
              <Text className="ml-1">What are you thinking</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Newsfeed */}
        <NewsFedd idOfAccount={route.params.idOfAccount} />
      </ScrollView>
    </View>
  );
};

export default Home;
