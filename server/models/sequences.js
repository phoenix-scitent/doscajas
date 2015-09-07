Meteor.publish('sequences', function() {
  return Sequences.find();
});

Meteor.publish('sequences_and_attempts_for_user', function(userId) {
  //TODO: scope sequence (attempt exists false) to only those 'published' AND? only those the user has ACCESS/PERMISSIONS to
  return Sequences.find({$or: [{attempt:{"$exists":false}}, {'attempt.user':userId}]});
});

Sequences.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});