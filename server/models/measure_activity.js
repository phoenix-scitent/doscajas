Meteor.publish('measure_activity', function() {
  return MeasureActivity.find();
});

MeasureActivity.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc) {
    return false;
  }
});