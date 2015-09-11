Meteor.subscribe('measures');
Meteor.subscribe('measure_events');
Meteor.subscribe('users');

Template.measure_inspect.helpers({
  measure: function() {
    return this;
  },
  measure_event: function() {
    return _.sortByOrder(MeasureEvents.findOne({measure_id: this._id}).events, ['created_at'], ['desc']);
  },
  title: function() {
    return this.question_text.substring(0,30);
  },
  owner: function() {
    return Meteor.users.findOne(this.owner);
  },
  tag_list: function() {
    return _.map(this.tags, function(tag){ return Boks.findOne({ _id: tag }) });
  }
});

Template.measure_inspect.rendered = function(){

};
