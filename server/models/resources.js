Meteor.publish('resources', function() {
  return Resources.find();
});

Resources.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});