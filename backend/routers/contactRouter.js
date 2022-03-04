import express from 'express';
import expressAsyncHandler from 'express-async-handler';
// import JsSIP from "jssip";
import Contact from '../entities/Contact.js';

const contactRouter = express.Router();
contactRouter.get('/', expressAsyncHandler(async (req, res)=>{
    const contacts = await Contact.find({});

    res.send(contacts);
}));

contactRouter.post('/save', expressAsyncHandler(async (req, res)=>{
    var re = new RegExp("[0-9]{10}");
    if(req.body.phoneNumber.length!==10 || !re.test(req.body.phoneNumber)){
        res.status(400).send({message: "10 Digit-number only"});
    }
    
    const contact = new Contact({
        name: req.body.name,
        phoneNum: req.body.phoneNumber,
    });

    const newContact = await contact.save();

    if(newContact){
        res.send({success: true, message:"SAVED SUCCESSFULLY", content: newContact});
    }else{
        res.send({message: "ERROR"});
    }
}));

contactRouter.get('/number/:num', expressAsyncHandler(async (req, res)=>{
    const contact = await Contact.findOne({phoneNum: req.params.num});

    if(contact){
        res.send(contact);
    }else{
        res.status(404).send({message: "404"});
    }
}));



export default contactRouter;

