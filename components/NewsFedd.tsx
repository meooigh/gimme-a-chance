import {View, Text, FlatList, SectionList, RefreshControl} from 'react-native';
import React from 'react';
import NewsFeedComponent from './NewsFeedComponent';

import {context} from '../globalState/Provider';
import {getAllPosts} from '../globalState/action';
import {BASE_URL} from '../App';
import eventEmitter from '../event/event';
// import {BASE_URL} from '../socket/SocketClient';

const NewsFedd = (props: any) => {
  const {state, dispatch} = React.useContext(context);
  const [pageOfPost, setPageOfPost] = React.useState<number>(2);

  const getPostsFromNewFeed = async () => {
    try {
      const response = await fetch(
        `http://${BASE_URL}:3000/users/getAllPosts?page=${pageOfPost}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserID: props.idOfAccount,
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
        setPageOfPost(pre => pre + 1);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  React.useEffect(() => {
    eventEmitter.on('reload_posts', getPostsFromNewFeed);
    return () => {
      eventEmitter.off('reload_posts', getPostsFromNewFeed);
    };
  }, []);
  return (
    <View>
      {state.AllPosts.length === 0 ? (
        <View
          style={{height: 500, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Let's make friends to see other posts</Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={state.AllPosts}
            renderItem={({item}) => (
              <NewsFeedComponent
                nameOfUser={item.NickName}
                title={item.Title}
                image={item.Image}
                time={item.TimeOfPost}
                postID={item.PostID}
                author={item.Author}
                idOfAccount={props.idOfAccount}
              />
            )}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={false}
            //     onRefresh={() => getPostsFromNewFeed()}
            //   />
            // }
            keyExtractor={(item: any) => item.PostID.toString()}
            onEndReachedThreshold={0.3}
            onEndReached={() => getPostsFromNewFeed()}
          />
        </View>
      )}
    </View>
  );
};

export default NewsFedd;
