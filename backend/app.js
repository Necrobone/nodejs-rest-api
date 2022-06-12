const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const MONGODB_URI = 'mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/feeds';

const app = express();

app.use(bodyParser.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(8080);
    })
    .catch(error => console.log(error));
