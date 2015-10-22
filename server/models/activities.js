Meteor.publish('activities', function() {
  return Activities.find();
});

Meteor.publish('activities_and_attempts_for_user', function(userId) {
  //TODO: scope activity (attempt exists false) to only those 'published' AND? only those the user has ACCESS/PERMISSIONS to
  return Activities.find({$or: [{attempt:{"$exists":false}}, {'attempt.user':userId}]});
});

Activities.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc) {
    return false;
  },
  remove: function(userId, doc) {
    return false;
  }
});
