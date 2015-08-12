Meteor.subscribe('boks');

Template.navigation.helpers({
  boks: function() {
    //TODO: scope this to only those owned by current user...
    return Boks.find({ancestors: []});
  }
});

Template.navigation.rendered = function(){

    // Initialize metisMenu
    $('#side-menu').metisMenu();

};

// Used only on OffCanvas layout
Template.navigation.events({

    'click .close-canvas-menu': function(){
        $('body').toggleClass("mini-navbar");
    },
    'click #navigation-logout-button': function(){
      Meteor.logout();
      Router.go('/');
    }

});