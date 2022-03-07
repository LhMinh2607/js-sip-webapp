import jwt from 'jsonwebtoken';

export const generateToken = (account) =>{
    return jwt.sign({
        _id: account._id,
        uri: account.uri,
        displayName: account.displayName,
        displayPass: account.password,
    }, process.env.JWT_SECRET || 'secretmessage', {
        expiresIn: '30d', //expires in 30 days
    }); //jsonwebtoken
};