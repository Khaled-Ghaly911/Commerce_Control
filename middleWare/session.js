const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI = 'mongodb+srv://khaledghaly000:dI42unaOVTuDuQ22@cluster0.s5xgw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0';

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
});

module.exports = session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
});