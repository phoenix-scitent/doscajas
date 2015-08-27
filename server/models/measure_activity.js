Meteor.publish('measure_activity', function(measure_id) {
  return MeasureActivity.find({measure_id: measure_id});
});

MeasureActivity.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc) {
    return false;
  }
});