const express = require('express');
const expressEdge = require('express-edge');
const edge = require('edge.js');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectFlash = require('connect-flash');

const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require('./controllers/createUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const aboutController = require('./controllers/about');
const contactController = require('./controllers/contact');
const logoutController = require('./controllers/logout');

const app = new express();

mongoose
  .connect("mongodb://localhost:27017/node-blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => "Connected to mongo!")
  .catch((err) => console.error("Something went wrong", err));

// mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=fa
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/node-blog"
  })
}));

app.use(connectFlash());
app.use(fileupload());
app.use(express.static("public"));
app.use(expressEdge.engine);
app.set("views", __dirname + "/views");

app.use('*', (req, res, next) => {
  edge.global('auth', req.session.userId)
  next()
});

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

const auth = require('./middleware/auth');
const storePost = require('./middleware/storePost');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');

app.get("/", homePageController);
app.get("/posts/new", auth, createPostController);
app.get("/post/:id", getPostController);
app.post("/posts/store", auth, storePost, storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/about", aboutController);
app.get("/contact", contactController);
app.get("/auth/logout", logoutController);

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
