const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to Database
mongoose.connect(config.database);

// On Database Connection
mongoose.connection.on('connected', function(){
    console.log('Connected to Database ' + config.database);
});

mongoose.connection.on('error', function(err){
    console.log('Database error: ' + err);
});

const app = express();

const users = require('./routes/users');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);

// Index Route
app.get('/', function(req,res){
    res.send("Invalid Endpoint");
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// Start Server
app.listen(port, function() {
    console.log('Server started at Port: '+port);
});
