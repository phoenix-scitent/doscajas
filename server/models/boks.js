Meteor.publish('boks', function() {
  return Boks.find();
});
Meteor.publish('my_boks', function() {
  var me = Meteor.user()._id;
  return Boks.find({$or: [ { authors: me }, { editors: me }, { publishers: me }, { admins: me } ]});
});

Boks.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});