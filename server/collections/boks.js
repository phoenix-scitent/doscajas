Meteor.publish('boks', function() {
  return Boks.find();
});

Boks.allow({
  insert: function(userId, doc) {
    return true;
  }
});