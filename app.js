const express = require('express');
const app = express();
const request = require('request');
const rp = require('request-promise');
const mongoose = require('mongoose');
const moment = require('moment');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/Secret', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(require('express-session')({
    secret: 'ribe ne govore',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname + '/themes'));
app.use(bodyParser.urlencoded({extend: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============
// ROUTES
//================

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/secret', function (req, res) {
    res.render('secret');
});

//===========
// Auth Routes
//============

app.get('/register', function (req, res) {
    res.render('register')
});

app.post('/register', function (req, res) {
    User.register(new User({username: req.body.user.username}), req.body.user.password, function (err, user) {
        if(err){
            console.log(err);
            return res.render('register')
        } else {
            passport.authenticate('local')(req, res, function () {
                console.log(user);
                res.redirect('/secret');
            })
        }
    })
});

// app.get('/log-in', function (req, res) {
//     res.render('log-in')
// });
//
// app.post('/log-in', passport.authenticate('local',{
//     successRedirect: '/secret',
//     failureRedirect: '/log-in'
// }), function (req, res) {
// });


app.get('*', function (req, res) {
    res.send('404');
});


app.listen(3092);
