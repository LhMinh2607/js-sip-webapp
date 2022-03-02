import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { loggingACallReducer, makingACallReducer } from './reducers/callingReducers';



const initialState = {
    
};

const reducer = combineReducers({
    callingStatus: makingACallReducer,
    loggingACall: loggingACallReducer,

})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    reducer, 
    initialState, 
    composeEnhancer(applyMiddleware(thunk)));

export default store;
