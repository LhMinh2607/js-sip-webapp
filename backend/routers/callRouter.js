import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import JsSIP from "jssip";
import CallLog from '../entities/CallLog.js';


const callRouter = express.Router();
callRouter.get('/', expressAsyncHandler(async (req, res)=>{
    const calllog = await CallLog.find({});

    res.send(calllog);
}));

callRouter.post('/number', expressAsyncHandler(async (req, res)=>{
    const calllog = new CallLog({
        name: req.body.name,
        phoneNum: req.body.phoneNumber,
        callType: "call",
    });
    const newCallLog = await calllog.save();
    // console.log(req.body.phoneNumber);

    res.send({status: 'call is in progress', calllog: newCallLog});
    
    // var socket = new JsSIP.WebSocketInterface('wss://sbc03.tel4vn.com:7444');

    // var configuration = {
    //     sockets  : [ socket ],
    //     uri      : '105@2-test1.gcalls.vn:50061',
    //     password : 'test1105'
    // };

    // var ua = new JsSIP.UA(configuration);

    // ua.start();

    // // Register callbacks to desired call events
    // var eventHandlers = {
    //     progress: function(e) {
    //         console.log('call is in progress');
    //     },
    //     failed: function(e) {
    //         console.log('call failed with cause: '+ e.data.cause);
    //     },
    //     ended: function(e) {
    //         console.log('call ended with cause: '+ e.data.cause);
    //     },
    //     confirmed: function(e) {
    //         console.log('call confirmed');
    //     }
    // };

    // var options = {
    //     'eventHandlers': eventHandlers,
    //     'mediaConstraints' : { 'audio': true, 'video': true }
    // };

    // ua.call(req.body.phoneNumber, options);
    // if(eventHandlers.progress){
    //     res.send({status: 'call is in progress', calllog: newCallLog});
    // }
    
}));

export default callRouter;