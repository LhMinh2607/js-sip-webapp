import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import JsSIP from "jssip";
import CallLog from '../entities/CallLog.js';


const callRouter = express.Router();
callRouter.get('/log/list', expressAsyncHandler(async (req, res)=>{
    // const calllog = await CallLog.find({}).sort({createdAt: -1});

    const calllog = await CallLog.aggregate([
    {$sort: {createdAt: -1}},
    {$group: {
        _id:{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} },
        // detailDate :{ date: "$createdAt"},
        list: { $push: "$$ROOT" },
        count: { $sum: 1 },
    }}, 
    {$sort: {
        _id: -1
    }}
    ]);

    

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