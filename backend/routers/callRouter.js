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
    // console.log(req.body.phoneNumber);
    res.send({status: 'call is in progress', calllog: newCallLog});
    
}));

callRouter.post('/log', expressAsyncHandler(async (req, res)=>{
    // const calllog = new CallLog({
    //     name: req.body.name,
    //     phoneNum: req.body.phoneNumber,
    //     callType: "call",
    // });
    // const newCallLog = await calllog.save();
    // console.log(req.body.phoneNumber);

    // res.send({status: 'call ended', calllog: newCallLog});
    res.send({status: 'call ended', calllog: "testing phase, logging is temporarily stopped"});

}));

export default callRouter;