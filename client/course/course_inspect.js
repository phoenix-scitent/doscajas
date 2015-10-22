Meteor.subscribe('courses');
Meteor.subscribe('users');

Template.course_inspect.helpers({
  course: function() {
    return this;
  },
  title: function() {
    return this.name.substring(0,30);
  },
  owner: function() {
    return Meteor.users.findOne(this.owner);
  },
  tag_list: function() {
    return _.map(this.tags, function(tag){ return Boks.findOne({ _id: tag }) });
  },
  itemName: function(item){
    return Activities.findOne({ _id: item.hash.item._id }).name;
  }
});
