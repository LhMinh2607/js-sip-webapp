import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
    name: {type: String},
    phoneNum: {type: String, required: true},
    callType: {type: String, required: true},
    length: {type: Number},
    endedBy: {type: String, required: true},
    startedBy: {type: String, required: true},
    callEnded: {type: String},
},
    {
        timestamps: true,
    },
);

const CallLog = mongoose.model('CallLog', callLogSchema);

export default CallLog;