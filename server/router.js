/*
    Router to direct requests and responses in our server
*/

const controllers = require('./controllers');
const mid = require('./middleware');

const { Account, Tierlist } = controllers;

const router = (app) => {
  // Login/signup/logout requests
  app.get('/', mid.requiresSecure, mid.requiresLogout, Account.loginPage);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, Account.signup);

  app.get('/logout', mid.requiresLogin, Account.logout);

  // Tierlist page serving
  app.get('/lists', mid.requiresLogin, Tierlist.listPage);

  // Tier getting/creation/editing
  app.get('/tiers', mid.requiresLogin, Tierlist.getTiers);
  app.post('/tiers', mid.requiresLogin, Tierlist.createTier);
  app.post('/deleteTier', mid.requiresLogin, Tierlist.deleteTier);

  // Entry getting/creation/editing
  app.get('/entries', mid.requiresLogin, Tierlist.getEntries);
  app.post('/entries', mid.requiresLogin, Tierlist.createEntry);
  //   app.delete('/entries', mid.requiresLogin, Tierlist.deleteEntry);
  //   app.post('/swapEntries', mid.requiresLogin, Tierlist.swapEntries);
  //   app.post('/moveEntry', mid.requiresLogin, Tierlist.moveEntry);

  // Tierlist and Pool object getting/creation/editing
  app.get('/tierlist', mid.requiresLogin, Tierlist.getTierlist);
  app.get('/pool', mid.requiresLogin, Tierlist.getPool);
  // 404?
};

module.exports = router;
