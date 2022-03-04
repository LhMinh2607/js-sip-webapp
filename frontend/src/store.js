import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { cancelCallReducer, loggingACallReducer, makingACallReducer } from './reducers/callingReducers';
import { contactDetailReducer, contactListReducer, contactSavingReducer } from './reducers/contactReducers';



const initialState = {
    
};

const reducer = combineReducers({
    callingStatus: makingACallReducer,
    loggingACall: loggingACallReducer,
    cancelingCall: cancelCallReducer,
    contactSaving: contactSavingReducer,
    contactList: contactListReducer,
    contactDetail: contactDetailReducer,
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    reducer, 
    initialState, 
    composeEnhancer(applyMiddleware(thunk)));

export default store;
