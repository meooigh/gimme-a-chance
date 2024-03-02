import { View, Text, FlatList, SectionList } from 'react-native'
import React from 'react'
import NewsFeedComponent from './NewsFeedComponent'

import { context } from '../globalState/Provider'
import { getAllPosts } from '../globalState/action'

const NewsFedd = (props: any) => {
  const {state, dispatch} = React.useContext(context);
  const [pageOfPost, setPageOfPost] = React.useState<number>(2);

  const getPostsFromNewFeed = async() =>{
    try {
      const response = await fetch(`http://10.0.2.2:3000/users/getAllPosts?page=${pageOfPost}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserID: props.idOfAccount
        })
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
  
      const result = await response.json();
        if(result.success)
        {
          dispatch(getAllPosts(result.data));
          setPageOfPost(pre => pre + 1)
        }else
        {
          console.log(result.message);
        }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <View>
        <FlatList 
            data = {state.AllPosts}
            renderItem={({item}) =>(
                    <NewsFeedComponent 
                    nameOfUser={item.NickName} 
                    title={item.Title} 
                    image={item.Image} 
                    time={item.TimeOfPost}
                    postID={item.PostID}
                    author={item.Author}
                    idOfAccount={props.idOfAccount}/>
            )}
            keyExtractor={(item :any) => item.PostID.toString()}
            onEndReachedThreshold={0.3}
            onEndReached={() => getPostsFromNewFeed() }
        />
    </View>
  )
}

export default NewsFedd