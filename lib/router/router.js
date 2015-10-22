Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound'
});

Router.route('/guide', {
  name: 'guide',
  template: 'guide'
});

Router.route('/learners', {
  name: 'learner_login',
  controller: 'LoginController',
  action: 'learner_login'
});

Router.route('/creators', {
  name: 'creator_login',
  controller: 'LoginController',
  action: 'creator_login'
});

Router.route('/all_courses', {
  name: 'all_courses',
  controller: 'LearnerCoursesController',
  action: 'action'
});

Router.route('/all_activities', {
  name: 'all_activities',
  controller: 'LearnerActivitiesController',
  action: 'action'
});

Router.route('/activity_test', {
  name: 'activity_test',
  template: 'activity_test'
});

Router.route('/bok/:_id', {
   name: 'bok',
   data: function() {
     Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.last_bok': this.params._id }} );
     return Boks.find({ $or: [{ _id: this.params._id }, {ancestors: this.params._id}] });
   }
});

Router.route('/boks', {
   name: 'boks',
   data: function() { return Boks.find({ancestors: []}); }
});

Router.route('/measures', {
   name: 'measures',
   data: function() { return Measures.find(); }
});

Router.route('/measure/new', {
  name: 'measure_new',
  template: 'measure_form'
});

Router.route('/measure/:_id/edit', {
  name: 'measureEdit',
  template: 'measure_form',
  data: function() {
    return Measures.findOne({ _id: this.params._id });
  }
});

Router.route('/measure/:_id/inspect', {
  name: 'measure_inspect',
  template: 'measure_inspect',
  data: function() {
    return Measures.findOne({ _id: this.params._id });
  }
});

Router.route('/courses', {
  name: 'courses',
  data: function() {
    return Courses.find();
  }
});

Router.route('/course/new', {
  name: 'course_new',
  template: 'course_form'
});

Router.route('/course/:_id/edit', {
  name: 'courseEdit',
  template: 'course_form',
  data: function() {
    return Courses.findOne({ _id: this.params._id });
  }
});

Router.route('/course/:_id/inspect', {
  name: 'course_inspect',
  template: 'course_inspect',
  data: function() {
    return Courses.findOne({ _id: this.params._id });
  }
});

Router.route('/activities', {
  name: 'activities',
  data: function() {
    return Activities.find();
  }
});

Router.route('/activity/new', {
  name: 'activity_new',
  template: 'activity_form'
});

Router.route('/activity/:_id/edit', {
  name: 'activityEdit',
  template: 'activity_form',
  data: function() {
    return Activities.findOne({ _id: this.params._id });
  }
});

Router.route('/activity/:_id/inspect', {
  name: 'activity_inspect',
  template: 'activity_inspect',
  data: function() {
    return Activities.findOne({ _id: this.params._id });
  }
});

Router.route('/begin_course/:_id', {
  name: 'begin_course',
  controller: 'CreateEnrollmentController',
  action: 'begin'
});

Router.route('/begin_activity/:_id', {
  name: 'begin_activity',
  controller: 'CreateAttemptController',
  action: 'begin'
});

Router.route('/a/:_id', {
  name: 'attempt_activity',
  controller: 'AttemptsController',
  action: 'take'
});

Router.route('/e/:_id', {
  name: 'enrolled_course',
  controller: 'EnrollmentsController',
  action: 'take'
});

Router.route('/resources', {
  name: 'resources',
  data: function() { return Resources.find(); }
});

Router.route('/resource/new', {
  name: 'resource_new',
  template: 'resource_form'
});

Router.route('/resource/:_id', {
  name: 'resource_show',
  template: 'resource_show',
  layoutTemplate: 'resource_layout',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/r/:_id', {
  name: 'resource_popup',
  template: 'resource_show',
  layoutTemplate: 'resource_layout',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/resource/:_id/edit', {
  name: 'resourceEdit',
  template: 'resource_form',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/resource/:_id/inspect', {
  name: 'resource_inspect',
  template: 'resource_inspect',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/home', function() {
  this.render('boks');
});



Router.route('/activity', function() {
    this.render('activity');
});
Router.route('/intro_lesson', function() {
    this.render('intro_lesson');
});
Router.route('/adaptive_quiz', function() {
    this.render('adaptive_quiz');
});
Router.route('/final_quiz', function() {
    this.render('final_quiz');
});
//
// Landing page
//

Router.route('/landing', function () {
    this.render('landing');
    this.layout('blankLayout')
});

//
// Other pages routes
//
Router.route('/notFound', function () {
    this.render('notFound');
});

// Default route
// You can use direct this.render('template')
// We use Router.go method because dashboard1 is our nested view in menu
Router.route('/', function () {
  this.render('root');
  this.layout('layout2');
});


