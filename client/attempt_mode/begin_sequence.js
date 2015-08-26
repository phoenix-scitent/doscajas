Template.begin_sequence.rendered = function(){

  Session.set('currentSequenceId', this.data._id);

  Meteor.promise('createAttempt', this.data._id, Meteor.user()).then(function(attemptId){
    Session.set('currentAttemptId', attemptId);
  });

};

Template.begin_sequence.events({
  'click #begin-button': function(event){
    //console.log(["#begin-button",Session.get('currentAttemptId')]);
    Router.go("/a/"+Session.get('currentAttemptId'));
  }
});

