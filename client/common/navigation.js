Meteor.subscribe('my_boks');

Template.navigation.helpers({
  boks: function() {
    var me = Meteor.user()._id;
    return BOK.getAllRootsByUser({ userId: me });
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
    },
    'click #build-a-sequence-nav': function() {
      sequence_id = Meteor.call("buildBlankSequence", function(err, _id){
        if (!err) {
          Router.go("sequenceEdit", {_id:_id});
        }
      });
    }

});
