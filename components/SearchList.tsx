import { View, Text, TouchableOpacity, TextInput, Image, FlatList, Alert } from 'react-native';
import React from 'react';
import {ArrowLeftIcon, UserPlusIcon} from 'react-native-heroicons/solid';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/Navigation';

type props = NativeStackScreenProps<HomeStackParamList, 'SearchList'>
const SearchList = ({navigation, route}: props) => {
    const [page, setPage] = React.useState<number>(1);
    const [users, setUsers] = React.useState<any>([]);
    const [textFindUser, setTextFindUser] = React.useState<string>('');

    const getUserInfor = async () =>{
        const response = await fetch(`http://10.0.2.2:3000/users/getAllAccounts?page=${page}`);
        const result = await response.json();
        setUsers(result.data);
        setPage(prePage => prePage +1);
    };

    const filterUsers = React.useCallback(
        (user: any) => user.NameOfUser.includes(textFindUser),
        [textFindUser]
      );
      const userLookingFor = users.filter(filterUsers);

    const handleAddNewFriend = async(itemID: number) =>{
        try{
            const response = await fetch('http://10.0.2.2:3000/users/addNewFriend',
            {
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: route.params.idOfUser,
                    friendID: itemID
                })
            })
            if(!response.ok)
            {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }
            const result = await response.json();
            if(result.success)
            {
                Alert.alert('Notification', result.message,[
                    {
                        text: 'OK',
                        style: 'cancel'
                    }
                ])
            }
        }catch(error)
        {
            console.error('Error fetching data:', error);
        }
    }

    React.useEffect(() =>{
        getUserInfor();
    },[]);

  return (
    <View>
        <View className='mt-1 mb-3 flex-row items-center justify-around'>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeftIcon size={25} color='black'/>
            </TouchableOpacity>
            <View className='w-10/12 h-10'>
                <TextInput onChangeText={text => setTextFindUser(text)} className='bg-gray-300 rounded-full' placeholder='Search'/>
            </View>
        </View>
        <View>
            <FlatList
                data={userLookingFor}
                renderItem={({item}) =>(
                    <View key={item.PersonID} className = 'mb-2'>
                        <View className='flex-row mx-2 items-center justify-between'>
                            <TouchableOpacity className='flex-row items-center'>
                                <Image source={{
                                    uri:'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'
                                }} 
                                className = 'h-14 w-14 rounded-full'
                                />
                                <Text className='text-base font-bold mx-3'>{item.NameOfUser}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>handleAddNewFriend(item.AccountID)}>
                                <UserPlusIcon size={25} color='green'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.PersonID}
                onEndReachedThreshold={0.3}
                onEndReached={() => getUserInfor()}
            />
        </View>
    </View>
  )
}

export default SearchList