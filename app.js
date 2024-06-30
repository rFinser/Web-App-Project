const express = require('express');
const Mongoose = require('mongoose');
const bodyparser = require('body-parser');

Mongoose.connect('mongodb://127.0.0.1:27017/storeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static("public"));

app.set('view engine', 'ejs');

const usersRouter = require('./Routes/signup-login');
const restRouter = require("./Routes/restaurantRoutes");

app.use(usersRouter);
app.use(restRouter);


app.listen(80, (err) => {
    if (err) console.error(err)
    console.log("Server Running on Port 80...");
});