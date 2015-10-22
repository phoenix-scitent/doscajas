Meteor.subscribe('activities');
Meteor.subscribe('users');

Template.activity_inspect.helpers({
  activity: function() {
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
    var item = item.hash.item,
        name;

    if(item.type === 'measure'){
      name = Measures.findOne({ _id: item._id }).question_text;
    } else {
      name = Resources.findOne({ _id: item._id }).title;
    }

    return name;
  }
});
