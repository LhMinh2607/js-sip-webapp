import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
    name: {type: String},
    phoneNum: {type: String, required: true},
    callType: {type: String, required: true},
},
    {
        timestamps: true,
    },
);

const CallLog = mongoose.model('CallLog', callLogSchema);

export default CallLog;