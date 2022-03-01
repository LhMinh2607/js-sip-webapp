import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {type: String},
    phoneNum: {type: String, required: true},
},
    {
        timestamps: true,
    },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;