Template.boks.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('my_boks');
  });
});

Template.boks.helpers({
  boks: function() {
    var me = Meteor.user()._id;
    return BOK.getAllRootsByUser({ userId: me, sort: 'desc' });
  },
  bok_count: function() {
    var me = Meteor.user()._id;
    return BOK.getAllRootsByUser({ userId: me, sort: 'desc' }).count();
  },
  bok_permission: function(){
    var me = Meteor.user()._id,
        bok = this,
        permission = null;

    _.forEach(this.permissions, function(value, key){
      if(_.some(value, function(id){ return id === me })){
        permission = key;
      }
    });

    return (function(p){
      if(p === 'publishers'){
        return 'you are a ' + p.substring(0, p.length - 1);
      } else {
        return 'you are an ' + p.substring(0, p.length - 1);
      }
    }(permission));
  }
});
