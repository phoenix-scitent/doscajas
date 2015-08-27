Meteor.subscribe('measures');
Meteor.subscribe('measure_activity');
Meteor.subscribe('users');

Template.measure_inspect.helpers({
  measure: function() {
    return this;
  },
  measure_activity: function() {
    return _.sortByOrder(MeasureActivity.findOne({measure_id: this._id}).activities, ['created_at'], ['desc']);
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