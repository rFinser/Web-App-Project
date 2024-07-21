const express = require('express');
const Mongoose = require('mongoose');
const bodyparser = require('body-parser');

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

const restRouter = require("./Routes/restaurantRoutes");
const loginSignupRouter = require('./Routes/signup-login')
const mainPageRoutes = require('./Routes/mainPage')
const cartRouter = require("./Routes/cartRoutes");
const ordersRouter = require('./Routes/ordersRoutes')
const usersRouter = require("./Routes/usersRouter");
const productsRouter = require("./Routes/productRoutes");
const facbookApiRouter = require('./Routes/FacebookApiRouter')
const openCageApiRouter = require('./Routes/openCageAPI')
const reviewsRouter = require("./Routes/reviewsRoutes");

app.use(restRouter);
app.use(loginSignupRouter);
app.use(mainPageRoutes);
app.use(cartRouter);
app.use(ordersRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(facbookApiRouter);
app.use(reviewsRouter);
app.use(openCageApiRouter);

app.listen(process.env.PORT, (err) => {
    if (err) console.error(err)
    console.log("Server Running on Port 80...");
});
