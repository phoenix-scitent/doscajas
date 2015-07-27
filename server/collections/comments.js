Meteor.publish('comments', function() {
  return Comments.find();
});

Comments.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});