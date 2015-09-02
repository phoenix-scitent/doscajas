Meteor.subscribe('my_boks');

Template.boks.helpers({
  boks: function() {
    var me = Meteor.user()._id;
    return BOK.getAllRootsByUser({ userId: me, sort: 'desc' });
  },
  bok_count: function() {
    var me = Meteor.user()._id;
    return BOK.getAllRootsByUser({ userId: me, sort: 'desc' }).count();
  }
});
