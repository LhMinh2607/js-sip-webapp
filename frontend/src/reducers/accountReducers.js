import { CLEAR_ALL, USER_SIGNIN_FAILED, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESSFUL, USER_SIGNOUT, USER_SIGN_UP_FAILED, USER_SIGN_UP_REQUEST, USER_SIGN_UP_SUCCESSFUL } from "../consts.js/AccountConsts";


export const userSignupReducer = (state = {}, action)=>{
    switch(action.type){
        case USER_SIGN_UP_REQUEST:
            return {loading: true};
        case USER_SIGN_UP_SUCCESSFUL:
            return {loading: false, userInfo: action.payload};
        case USER_SIGN_UP_FAILED:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
};

export const userSigninReducer = (state = {}, action)=>{
    switch(action.type){
        case USER_SIGNIN_REQUEST:
            return {loading: true};
        case USER_SIGNIN_SUCCESSFUL:
            return {loading: false, userInfo: action.payload};
        case USER_SIGNIN_FAILED:
            return {loading: false, error: action.payload};
        case USER_SIGNOUT:
            return {};
        default:
            return state;
    }
};

export const userSignOutReducer = (state={}, action)=>{
    switch(action.type){
        case CLEAR_ALL:
            return {};
        default:
            return state;
    }
}