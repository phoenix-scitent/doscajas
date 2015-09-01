Template.topic_stats.helpers({
  currentSequenceId: function(){
    return Session.get('currentSequenceId');
  },
  currentAttemptId: function(){
    return Session.get('currentAttemptId');
  },
  log: function(something){
    console.log(something)
  }
});
