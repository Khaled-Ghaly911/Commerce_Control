const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { name } = require('ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Default User
app.use((req, res, next) => {
    User.findById('6721e90d96211c68b7e02e6a')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose
    .connect('mongodb+srv://khaledghaly000:GBB0E51tpBaccRPa@cluster0.s5xgw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Khaled',
                        email: 'kahled@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            })
        app.listen(4000);
    })
    .catch(err => { console.log(err) });