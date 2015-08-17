Template.begin_sequence.rendered = function(){

  //var currentAttempt = this.data && this.data.currentAttempt;

  Session.set('currentSequenceId', this.data._id);

  //if(currentAttempt){
    //Session.set('currentAttemptId', currentAttempt._id);
  //} else {
    Meteor.promise('createAttempt', this.data._id, Meteor.user()).then(function(attemptId){
      Session.set('currentAttemptId', attemptId);
    });
  //}

};

Template.begin_sequence.events({
  'click #begin-button': function(event){
    //console.log(["#begin-button",Session.get('currentAttemptId')]);
    Router.go("/a/"+Session.get('currentAttemptId'));
  }
});

