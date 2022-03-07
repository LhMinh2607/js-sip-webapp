import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import Account from '../entities/Account.js';
import { generateToken } from './utils.js';


const accountRouter = express.Router();
accountRouter.get('/list', expressAsyncHandler(async (req, res)=>{
    const account = await Account.find({});

    res.send(account);
    
}));
accountRouter.post('/signup', expressAsyncHandler(async(req, res)=>
{
    const account = new Account({
        uri: req.body.uri, 
        displayName: req.body.displayName, 
        password: bcrypt.hashSync(req.body.password, 8),
        displayPass: req.body.password,
    });
    const createdAccount = await account.save();
    res.send({
        _id: createdAccount._id,
        uri: createdAccount.uri,
        displayName: createdAccount.displayName,
        token: generateToken(createdAccount),
    });
}));

accountRouter.post('/signin', 
expressAsyncHandler(async (req, res)=>{
    const account = await Account.findOne({uri: req.body.uri});
    if(account){
        if(bcrypt.compareSync(req.body.password, account.password))
        {
            res.send({
                _id: account._id,
                uri: account.uri,
                displayName: account.displayName,
                displayPass: req.body.password,
                token: generateToken(account),
            });
            return;
        }
    }
    res.status(401).send({message: 'Your Uri or password is invalid. Please check again!'});
    })
);


export default accountRouter;