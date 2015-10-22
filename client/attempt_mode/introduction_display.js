Template.introduction_display.helpers({
  activity: function(){
    return Template.parentData(1);
  }
});

Template.introduction_display.events({
  'click #begin-button': function(event){
    Router.go("/a/"+Session.get('currentAttemptId'));
  },
  'click #course-dashboard-button': function(event){
    Router.go("/e/"+Session.get('currentEnrollmentId'));
  }
});
