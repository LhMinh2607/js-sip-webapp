import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { userSigninReducer, userSignupReducer } from './reducers/accountReducers';
import { cancelCallReducer, historyListReducer, loggingACallReducer, makingACallReducer, updatingACallReducer } from './reducers/callingReducers';
import { contactDetailReducer, contactEditingReducer, contactListReducer, contactRemovingReducer, contactSavingReducer, contactSearchingReducer } from './reducers/contactReducers';



const initialState = {
    userSignin: {
        userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    },
};

const reducer = combineReducers({
    callingStatus: makingACallReducer,
    loggingACall: loggingACallReducer,
    cancelingCall: cancelCallReducer,
    contactSaving: contactSavingReducer,
    contactList: contactListReducer,
    contactDetail: contactDetailReducer,
    historyList: historyListReducer,
    updatingACall: updatingACallReducer,
    contactEditing: contactEditingReducer,
    contactRemoving: contactRemovingReducer,
    userSignup: userSignupReducer,
    userSignin: userSigninReducer,
    contactSearching: contactSearchingReducer,
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    reducer, 
    initialState, 
    composeEnhancer(applyMiddleware(thunk)));

export default store;
