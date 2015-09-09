Template.bok_invitations.helpers({
  admins: function(){
    var permission_invitations = _.find(this.fetch(), function(node){ return node.ancestors.length === 0 }).permission_invitations || {};

    var invitations = _.map(permission_invitations['admin'], function(val, key){
      var user = Meteor.users.findOne({_id:val});

      if(user && user.profile.name){
        return user.profile.name;
      } else {
        return key + ' (unclaimed)';
      }
    });

    return invitations;
  },
  publishers: function(){
    var permission_invitations = _.find(this.fetch(), function(node){ return node.ancestors.length === 0 }).permission_invitations || {};

    var invitations = _.map(permission_invitations['publisher'], function(val, key){
      var user = Meteor.users.findOne({_id:val});

      if(user && user.profile.name){
        return user.profile.name;
      } else {
        return key + ' (unclaimed)';
      }
    });

    return invitations;
  },
  editors: function(){
    var permission_invitations = _.find(this.fetch(), function(node){ return node.ancestors.length === 0 }).permission_invitations || {};

    var invitations = _.map(permission_invitations['editor'], function(val, key){
      var user = Meteor.users.findOne({_id:val});

      if(user && user.profile.name){
        return user.profile.name;
      } else {
        return key + ' (unclaimed)';
      }
    });

    return invitations;
  },
  authors: function(){
    var permission_invitations = _.find(this.fetch(), function(node){ return node.ancestors.length === 0 }).permission_invitations || {};

    var invitations = _.map(permission_invitations['author'], function(val, key){
      var user = Meteor.users.findOne({_id:val});

      if(user && user.profile.name){
        return user.profile.name;
      } else {
        return key + ' (unclaimed)';
      }
    });

    return invitations;
  }
});
