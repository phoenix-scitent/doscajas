LearnerCoursesController = RouteController.extend({
  layoutTemplate: "blankLayout",

  subscriptions: function(){
    this.subscribe('courses', Meteor.userId());
  },

  action: function() {
    // Session.set("login_context", null);
    this.render("learner_courses");
  }
});
