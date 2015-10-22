EnrollmentsController = RouteController.extend({
  layoutTemplate: "enrollment_layout",

  subscriptions: function(){
  },

  data: function() {
    return {};
  },

  take: function() {
    this.render("enrolled_course");
  }
});
