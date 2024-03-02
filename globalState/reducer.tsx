import {
    ACTIONTYPE,
    GET_PAYLOAD_STATE,
    GET_USERNAME,
    GET_PASSWORD,
    REGISTER_ACTIONTYPE,
    GET_REGISTER_STATE,
    GET_CREATE_POST_STATE,
    ObjectPayloadGetPosts,
    GET_ALL_POSTS,
    GET_ALL_POSTS_ACTIONTYPE,
    ObjectPayloadComment,
    GET_COMMENT_POST,
    GET_COMMENT_POST_ACTIONTYPE,
    ObjectPayloadFriendInfo,
    GET_FRIEND_INFOR,
    GET_FRIENDS_INFOR_ACTIONTYPE,
  } from "./action";
  
  export type typeOfState = {
    setState: string;
    setUsername: string;
    setPassword: string;
    registerState: {
      UserName: string;
      Password: string;
      email: string;
      name: string;
      date: string;
    };
    createPostState: {
      Title: string;
      Image: string;
    };
    AllPosts: Array<ObjectPayloadGetPosts>;
    CommentPost: Array<ObjectPayloadComment>,
    FriendInfor: Array<ObjectPayloadFriendInfo>
  };
  
  export const initialState: typeOfState = {
    setState: "",
    setUsername: "",
    setPassword: "",
    registerState: {
      UserName: "",
      Password: "",
      email: "",
      name: "",
      date: ""
    },
    createPostState: {
      Title: "",
      Image: "",
    },
    AllPosts: [],
    CommentPost: [],
    FriendInfor: []
  };
  
  const reducer: React.Reducer<typeOfState, ACTIONTYPE | REGISTER_ACTIONTYPE| GET_ALL_POSTS_ACTIONTYPE| GET_COMMENT_POST_ACTIONTYPE| GET_FRIENDS_INFOR_ACTIONTYPE> = (
    state = initialState,
    action: ACTIONTYPE | REGISTER_ACTIONTYPE | GET_ALL_POSTS_ACTIONTYPE| GET_COMMENT_POST_ACTIONTYPE | GET_FRIENDS_INFOR_ACTIONTYPE
  ) => {
    switch (action.type) {
      case GET_PAYLOAD_STATE: {
        return {
          ...state,
          setState: action.payload as string || state.setState
        };
      }
      case GET_USERNAME: {
        return {
          ...state,
          setUsername: action.payload as string || state.setUsername
        };
      }
      case GET_PASSWORD: {
        return {
          ...state,
          setPassword: action.payload as string || state.setPassword
        };
      }
      case GET_REGISTER_STATE: {
        return {
          ...state,
          registerState: {
            ...state.registerState,
            ...(action.payload as object)
          }
        };
      }
      case GET_CREATE_POST_STATE: {
        return {
          ...state,
          createPostState: {
            ...state.createPostState,
            ...(action.payload as object)
          }
        };
      }
      case GET_ALL_POSTS:{
        const payloadArray = Array.isArray(action.payload)? action.payload: [action.payload];
        return{
          ...state,
          AllPosts:[...state.AllPosts, ...payloadArray]
        }
      }
      case GET_COMMENT_POST:{
        return{
          ...state,
          CommentPost:[...(action.payload as [])]
        }
      }
      case GET_FRIEND_INFOR:{
        return{
          ...state,
          FriendInfor:[...(action.payload as [])]
        }
      }
        
      default:
        return state;
    }
  };
  
  export default reducer;
  