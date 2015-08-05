Meteor.publish('sequences', function() {
  return Sequences.find();
});

Sequences.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});