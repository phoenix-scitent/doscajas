Meteor.publish('boks', function() {
  return Boks.find();
});
Meteor.publish('my_boks', function() {
  var me = this.userId;
  return Boks.find({$or: [ { 'permissions.authors': me }, { 'permissions.editors': me }, { 'permissions.publishers': me }, { 'permissions.admins': me } ]});
});

Boks.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});