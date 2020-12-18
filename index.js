const express = require('express');
const moment = require('moment');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const SECRET = 'S3cr3tK3yD0ntSh4r31t'
const FACEBOOK_ID = ''
const FACEBOOK_SECRET = ''

app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SECRET
  }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_ID,
    clientSecret: FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/oauth-redirect'
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

app.get('/', function (req, res) {
    res.send('<a href="/login">Login</a>')
});

app.get('/login', passport.authenticate('facebook', {
    scope: ['public_profile']
}));
  
app.get('/oauth-redirect',
    passport.authenticate('facebook', {
      successRedirect: '/action',
      failureRedirect: '/error'
    })
);

app.get('/action', isLoggedIn, function (req, res) {
    // register a user.
    
    res.json(books)
});

/**
 * Demo Data START
 */
const users = [
  {
      "first_name": "Doe",
      "last_name": "John",
      "mail": "john.doe@studi.fr",
      "books": [ ],
  },
  {
      "first_name": "Doe",
      "last_name": "Jane",
      "mail": "jane.doe@studi.fr",
      "books": [ ],
  },
  {
      "first_name": "Mickaël",
      "last_name": "Andrieu",
      "mail": "mickael.andrieu@exemple.fr",
      "books": ["0-7975-8110-3", "0-7975-8110-4"],
  },
]

const books = [
  {
      "title": "Book 1",
      "author": "Jonathan",
      "isbn": "0-7975-8110-3",
      "availability": true,
      "return_date": null
  },
  {
      "title": "Book 2",
      "author": "Elise",
      "isbn": "0-7975-8110-4",
      "availability": false,
      "return_date": moment()
  },
  {
      "title": "Book 3",
      "author": "Zineb",
      "isbn": "0-7975-8110-5",
      "availability": false,
      "return_date": null
  },
]

/**
* Demo Data END
*/

/**
* Books CRUD
*/
app.get('/', isLoggedIn, (req, res) => {
  res.json({'message': "Home, nothing interesting here."})
})

app.get('/books/', isLoggedIn, (req, res) => {
  res.json(books)
})

app.get('/books/:isbn', isLoggedIn, (req, res) => {
  const isbn = req.params.isbn
  const book = books.find(book => book.isbn === isbn)

  res.json(book)
})

app.post('/books', isLoggedIn, (req, res) => {
  books.push(req.body)
  res.status(200).json(books)
})

app.put('/books/:isbn', isLoggedIn, (req,res) => {
  const isbn = req.params.isbn
  let book = books.find(book => book.isbn === isbn)

  // Book update
  book.title = req.body.title
  book.author = req.body.author
  book.availability = req.body.availability
  book.return_date = req.body.return_date

  res.status(200).json(book)
})

app.delete('/books/:isbn', isLoggedIn, (req, res) => {
  const isbn = req.params.isbn
  const book = books.find(book => book.isbn === isbn)
  books.splice(books.indexOf(book), 1)

  res.json(books)
})

/**
* Users CRUD
*/
app.get('/users/', isLoggedIn, (req, res) => {
  res.json(users)
})

app.get('/users/:mail', isLoggedIn, (req, res) => {
  const mail = req.params.mail
  const user = users.find(user => user.mail === mail)

  res.json(user)
})

app.post('/users', isLoggedIn, (req, res) => {
  users.push(req.body)
  res.json(users)
})

app.put('/users/:mail', isLoggedIn, (req,res) => {
  const mail = req.params.mail
  const user = users.find(user => user.mail === mail)

 // Update of the user
 user.first_name = req.body.first_name
 user.last_name = req.body.last_name
 user.mail = req.body.mail
 user.books = req.body.books

 res.json(user)
})

app.delete('/users/:mail', isLoggedIn, (req, res) => {
  const mail = req.params.mail
  const user = users.find(user => user.mail === mail)
  users.splice(users.indexOf(user), 1)

  res.json(users)
})

/**
* Book Store management
*/

app.post('/borrow/:mail/:isbn', isLoggedIn, (req, res) => {
  const mail = req.params.mail
  const isbn = req.params.isbn

  const user = users.find(user => user.mail === mail)
  const book = books.find(book => book.isbn === isbn)

  user.books.push(book.isbn)
  book.availability = false
  book.return_date = moment().add(14, 'days');

  return res.json(book)
})

app.post('/bring-back/:mail/:isbn', isLoggedIn, (req, res) => {
  const mail = req.params.mail
  const isbn = req.params.isbn

  const user = users.find(user => user.mail === mail)
  const book = books.find(book => book.isbn === isbn)

  user.books.splice(user.books.indexOf(book), 1)
  book.availability = true
  book.return_date = null;

  return res.json(user)
})

app.get('/error', isLoggedIn, function (req, res) {
    res.send('Login error');
});
  
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

app.listen(port, () => {
  console.log('[OAuth BookStore Server] Started.')
})
