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
    'click #build-a-course-nav': function() {
      course_id = Meteor.call("buildBlankCourse", function(err, _id){
        if (!err) {
          Router.go("courseEdit", {_id:_id});
        }
      });
    },
    'click #build-an-activity-nav': function() {
      activity_id = Meteor.call("buildBlankActivity", function(err, _id){
        if (!err) {
          Router.go("activityEdit", {_id:_id});
        }
      });
    }

});
