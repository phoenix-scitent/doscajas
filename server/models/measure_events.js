Meteor.publish('measure_events', function() {
  return MeasureEvents.find();
});

MeasureEvents.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc) {
    return false;
  }
});
