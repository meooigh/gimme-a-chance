import { View, Text } from 'react-native'
import React, { useReducer } from 'react'
import { ACTIONTYPE, GET_ALL_POSTS_ACTIONTYPE, GET_COMMENT_POST_ACTIONTYPE, GET_FRIENDS_INFOR_ACTIONTYPE, REGISTER_ACTIONTYPE } from './action';
import reducer, { initialState, typeOfState } from './reducer';

export const context = React.createContext<{
  state: typeOfState; 
  dispatch: React.Dispatch<ACTIONTYPE| REGISTER_ACTIONTYPE| GET_ALL_POSTS_ACTIONTYPE| GET_COMMENT_POST_ACTIONTYPE| GET_FRIENDS_INFOR_ACTIONTYPE>}>({
    state: initialState,
    dispatch: () => undefined || Object
})
const Provider = ({children} : any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <context.Provider value={{state, dispatch}}>
      {children}
    </context.Provider>
  )
}

export default Provider