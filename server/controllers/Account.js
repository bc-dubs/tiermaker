/*
    Controls the sending and recieving of all account-related data
    Code in this file mostly from Cody Van De Mark / Austin Willoughby
*/

const models = require('../models');

const { Account } = models;

// Displays the login page when called
const loginPage = (req, res) => res.render('login');

// Destroys the user's session to log them out
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Attempts to log the user in with given information
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // Errors if the user left fields empty
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required to log in!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    // Errors if the user's info was invalid
    if (err || !account) {
      return res.status(401).json({ error: 'No user found with that username and password' });
    }

    // Storing username & id as session data
    // Keeps user logged in if server restarts
    req.session.account = Account.toAPI(account);
    // Take user to their "homepage"
    return res.json({ redirect: '/lists' });
  });
};

// Attempts to sign the user up with given information
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!(username && pass && pass2)) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();

    // Storing username & id as session data
    // Keeps user logged in if server restarts
    req.session.account = Account.toAPI(newAccount);
    // Take user to their "homepage"
    return res.json({ redirect: '/lists' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'That username is already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
};
