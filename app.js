const express = require('express');
const Mongoose = require('mongoose');
const bodyparser = require('body-parser');
const usersRouter = require('./Routes/signup-login')
const session = require('express-session')
const newLocal = require('custom-env');

newLocal.env(process.env.NODE_ENV, './config');
Mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))
const usersRouter = require('./Routes/signup-login');
const restRouter = require("./Routes/restaurantRoutes");

app.use(usersRouter);
app.use(restRouter);

app.listen(process.env.PORT, (err) => {
    if (err) console.error(err)
    console.log("Server Running on Port 80...");
});