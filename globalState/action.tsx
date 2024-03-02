export const GET_PAYLOAD_STATE = 'GET_PAYLOAD_STATE ';
export const GET_USERNAME = 'GET_USERNAME';
export const GET_PASSWORD = 'GET_PASSWORD';
export const GET_REGISTER_STATE = 'GET_REGISTER_STATE';
export const GET_CREATE_POST_STATE = 'GET_CREATE_POST_STATE';
export const GET_ALL_POSTS = 'GET_ALL_POSTS';
export const GET_COMMENT_POST = 'GET_COMMENT_POST';
export const GET_FRIEND_INFOR = 'GET_FRIEND_INFOR';

export type ACTIONTYPE = {
    type: string,
    payload?: string
};

{/***********type of register's data that the user has entered********************/}
export type REGISTER_ACTIONTYPE={
    type: string,
    payload:{
        UserName?: string,
        Password?: string,
        email?: string,
        name?: string,
        date?: string
    }
};
export interface ObjectPayloadRegister {
    UserName?: string,
    Password?: string,
    email?: string,
    name?: string,
    date?: string
};

{/***********type of create post********************/}
export type CREATE_POST_ACTIONTYPE ={
    type: string,
    payload: {
        Title?: string,
        Image?: string
    }    
};
export interface ObjectPayloadCreatePost{
    Title?: string,
    Image?: string
};
{/***********type of account of user********************/}
export interface ObjectPayloadGetPosts{
    PostID?: number,
    Title?: string,
    Image?: string,
    LikesOfPost?: number,
    CommentsOfPost?: number,
    TimeOfPost?: string,
    Author?: number,
    NickName?: string
};

export type GET_ALL_POSTS_ACTIONTYPE ={
    type: string,
    payload: ObjectPayloadGetPosts | ObjectPayloadCreatePost[]
};
{/***********type of comment********************/}
export interface ObjectPayloadComment{
    CommentID: number,
    NameOfUser: string,
    Image: string,
    ContentOfComment: string 
}
export type GET_COMMENT_POST_ACTIONTYPE={
    type: string,
    payload: ObjectPayloadComment[]
}
{/***********type of friend********************/}
export interface ObjectPayloadFriendInfo{
    AccountID: number,
    NameOfUser: string,
}
export type GET_FRIENDS_INFOR_ACTIONTYPE={
    type: string,
    payload: ObjectPayloadFriendInfo[]
}
{/******************************************************************************************** */}
export const getPayloadState = (payload: string): ACTIONTYPE =>{
    return {
        type: GET_PAYLOAD_STATE,
        payload: payload
    }
}
export const getUsername = (payload: string): ACTIONTYPE =>{
    return {
        type: GET_USERNAME,
        payload: payload
    }
}
export const getPassword = (payload: string): ACTIONTYPE =>{
    return {
        type: GET_PASSWORD,
        payload: payload
    }
}

export const getRegisterState = (payload: ObjectPayloadRegister): REGISTER_ACTIONTYPE =>{
    return {
        type: GET_REGISTER_STATE,
        payload: payload
    }
}

export const getCreatePostState = (payload: ObjectPayloadCreatePost) : CREATE_POST_ACTIONTYPE =>{
    return {
        type: GET_CREATE_POST_STATE,
        payload: payload
    }
}

export const getAllPosts = (payload : ObjectPayloadGetPosts | ObjectPayloadCreatePost[]) : GET_ALL_POSTS_ACTIONTYPE =>{
    return{
        type: GET_ALL_POSTS,
        payload: payload
    }
}

export const getCommentOfPost = (payload : ObjectPayloadComment[]) : GET_COMMENT_POST_ACTIONTYPE =>{
    return{
        type: GET_COMMENT_POST,
        payload: payload
    }
}
export const getAllFriend = (payload: ObjectPayloadFriendInfo[]): GET_FRIENDS_INFOR_ACTIONTYPE =>{
    return{
        type: GET_FRIEND_INFOR,
        payload: payload
    }
}