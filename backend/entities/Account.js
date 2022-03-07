import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    uri: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    displayName: {type: String},
},
    {
        timestamps: true,
    },
);

const Account = mongoose.model('Account', accountSchema);

export default Account;