Template.topic_stats.helpers({
  currentActivityId: function(){
    return Template.parentData(1).attempt.original;
  },
  currentAttemptId: function(){
    return Template.parentData(1)._id;
  },
  log: function(something){
    console.log(something)
  }
});
