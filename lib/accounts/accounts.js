if (Meteor.isClient) {
  Accounts.onLogin(function () {
    Router.go('home')
  });
};