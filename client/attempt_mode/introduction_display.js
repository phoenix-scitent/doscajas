Template.introduction_display.helpers({
  sequence: function(){
    return Template.parentData(1);
  }
});

Template.introduction_display.events({
  'click #begin-button': function(event){
    Router.go("/a/"+Session.get('currentAttemptId'));
  }
});