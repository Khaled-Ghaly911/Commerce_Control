const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};


exports.postLogin = (req, res, next) => {
    User.findById('6721e90d96211c68b7e02e6a').then(user => {
        console.log(req.session);
        req.session.isAuthenticated = true;
        req.session.user = user;
        req.session.save(() => {
            res.redirect('/');
        })
    }).catch(err => console.log(err))
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
} 
