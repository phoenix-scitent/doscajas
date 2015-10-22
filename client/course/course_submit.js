Template.course_submit.events({
  'click #course-submit-button': function(e){
    Router.go("/course/"+ Session.get('currentCourseId') +"/inspect");
  }
});
