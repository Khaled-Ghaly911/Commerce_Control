const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const User = require('./models/user');

const csrfProtectionMiddleware = require('./middleWare/csrf');
const flashMiddleware = require('./middleWare/flash');
const sessionMiddleware = require('./middleWare/session');
const userMiddleware = require('./middleWare/user');
const errorMiddleware = require('./middleWare/error');

const MONGODB_URI = 'mongodb+srv://khaledghaly000:OYvOq3XIriylQ16A@cluster0.s5xgw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sessionMiddleware)
app.use(csrfProtectionMiddleware);
app.use(flashMiddleware);

// Custom middleware to set local variables
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(userMiddleware);
// Routes
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

// Error handling
// app.get("/500", errorController.get500);
app.use(errorController.get404);


// app.use(errorMiddleware);

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {
        app.listen(4000);
    })
    .catch(err => console.log(err));
