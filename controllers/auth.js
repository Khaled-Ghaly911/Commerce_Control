const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const path = require('path');
const { error } = require('console');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "khaledghaly000@gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: "khaledghaly000@gmail.com",
        pass: "umfmpzcwievkjvvd",
    },
});

const emailOptions = {
    from: 'khaledghaly000@gmail.com', // sender address
    to: 'khaledghaly000@gmail.com', // list of receivers
    subject: "Hello ✔", // Subject line
    text: "you signed up successfully", // plain text body
    html: "<b>you signed up successfully</b>", // html body
}

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isAuthenticated = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'E-Mail exists already, please pick a different one.');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(result => {
                    transporter.sendMail(emailOptions);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};


exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    console.log(message[0])
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No user with that email')
                    return res.redirect('/reset')
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/')
                transporter.sendMail({
                    from: 'khaledghaly000@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: "Password Reset", // Subject line
                    text: "Reset Password", // plain text body
                    html: `
                                <h1>you signed up successfully</h1>
                                <p>Click this <a href="http://localhost:4000/reset/${token}">link for Reseting your password</a></p>
                            `, // html body
                });
            })
            .catch(err => {
                console.log(err)
            })
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            console.log(message[0])
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log(err);
        })
}


exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    }).then(user => {
            bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    return user.save()
                }).then(result => {
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        })
}