Meteor.publish('enrollments', function() {
  return Enrollments.find();
});

Enrollments.allow({
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
