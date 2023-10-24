const express = require("express");
const passport = require('./configs/passport'); 
const session = require('express-session');
const cors = require("cors");
const { connection } = require("./models");
const router = require("./routes");
const config = require('./configs/config')

const app = express();

// Use express-session middleware
app.use(session({
    secret: config.misc.sessionSecret, 
    resave: false,
    saveUninitialized: true,
}));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// multer 
// app.use(upload.single());

app.use(cors())

app.use(express.json());

app.use('/', router)

app.listen(config.port, async () => {
     try {
          await connection;
          console.log(`server is running on port ${config.port}`);
     } catch (error) {
          console.log('error: ', error);
     }
})