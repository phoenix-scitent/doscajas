Template.begin_activity.rendered = function(){

  Meteor.promise('createAttempt', this.data._id, Meteor.user()).then(function(attemptId){
    Session.set('currentAttemptId', attemptId);
  });

};

