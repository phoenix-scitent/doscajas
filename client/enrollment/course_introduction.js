Template.course_introduction.helpers({
  course: function(){
    return Template.parentData(1);
  }
});

Template.course_introduction.events({
  'click #begin-button': function(event){
    Router.go("/e/"+Session.get('currentEnrollmentId'));
  }
});
