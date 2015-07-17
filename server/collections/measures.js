Meteor.publish('measures', function() {
  return Measures.find();
});

Measures.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return true;
  }
});