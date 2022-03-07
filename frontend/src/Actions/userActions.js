import axios from "axios";
import { CLEAR_ALL, USER_SIGNIN_FAILED, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESSFUL, USER_SIGNOUT, USER_SIGN_UP_FAILED, USER_SIGN_UP_REQUEST, USER_SIGN_UP_SUCCESSFUL } from "../consts.js/AccountConsts";



export const signup = (uri, password, displayName) => async(dispatch) =>{
    dispatch({type: USER_SIGN_UP_REQUEST, payload: {uri, password, displayName}});
    try {
        const {data} = await axios.post('/api/account/signup', {uri, password, displayName});
        dispatch({type: USER_SIGN_UP_SUCCESSFUL, payload: data});
        //dispatch({type: USER_SIGNIN_SUCCESSFUL, payload: data});
        //localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({type: USER_SIGN_UP_FAILED, 
            payload: error.response 
            && error.response.data.message 
            ? error.response.data.message
            : error.message,
        });
    }
};

export const signin = (uri, password) => async(dispatch) =>{
    dispatch({type: USER_SIGNIN_REQUEST, payload: {uri, password}});
    try {
        const {data} = await axios.post('/api/account/signin', {uri, password});
        dispatch({type: USER_SIGNIN_SUCCESSFUL, payload: data});
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({type: USER_SIGNIN_FAILED, 
            payload: error.response 
            && error.response.data.message 
            ? error.response.data.message
            : error.message,
        });
    }
};

export const signout = () => (dispatch) =>{
    localStorage.removeItem('userInfo');
    localStorage.clear();
    dispatch({type: USER_SIGNOUT});
    dispatch({type: CLEAR_ALL});
}