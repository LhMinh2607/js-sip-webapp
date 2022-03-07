import express from 'express';
import mongoose from 'mongoose';
import callRouter from './routers/callRouter.js';
import dotenv from 'dotenv';
import contactRouter from './routers/contactRouter.js';
import accountRouter from './routers/accountRouter.js';

// const express = require('express')
dotenv.config();
const app = express();
app.use(express.json()); //http
app.use(express.urlencoded({extended: true}));

//connect to mongodb database
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/js-sip-webapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    },
err => {
    if(err) throw err;
    console.log('connected to MongoDB')
});

app.use('/api/call', callRouter);
app.use('/api/contact', contactRouter);
app.use('/api/account', accountRouter);

app.get('/', (req, res) => {
    res.send('Server is ready!');
});


app.use((err, req, res, next)=>{
    res.status(500).send({message: err.message});
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});

