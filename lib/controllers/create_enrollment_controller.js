CreateEnrollmentController = RouteController.extend({
  layoutTemplate: "course_layout",

  subscriptions: function(){
    this.subscribe('courses');
    this.subscribe('enrollments');
  },

  data: function() {
    return Courses.findOne({_id: this.params._id})
  },

  begin: function() {
    this.render("begin_course");
  }
});
