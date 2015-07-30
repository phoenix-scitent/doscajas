Meteor.subscribe('resources');
Meteor.subscribe('users');

Template.resource_inspect.helpers({
  resource: function() {
    return this;
  },
  title: function() {
    return this.title.substring(0,30);
  },
  owner: function() {
    return Meteor.users.findOne(this.owner);
  },
  tag_list: function() {
    return _.map(this.tags, function(tag){ return Boks.findOne({ _id: tag }) });
  }
});

Template.resource_inspect.rendered = function(){

};