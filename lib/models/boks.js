Boks = new Mongo.Collection('boks');

// Help exists here:  https://github.com/aldeed/meteor-collection2
Schemas.Bok = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    index: true
  },
  position: {
    type: Number,
    label: "Position",
    optional: true
  },
  ancestors: {
    type: [String],
    label: "Ancestors"
  },
  permission_invitations: {
    type: Object, // { codes: [ ... ], admin: { <code>: (null|userId), ... }, publisher: { ... }, editor: { ... }, author: { ... } }
    label: "Permission Invitations",
    optional: true,
    blackbox: true
  },
  permissions: {
    type: Object, // { admins: [ userId, ... ], publishers: [ ... ], editors: [ ... ], authors: [ ... ] }
    label: "Permissions",
    optional: true,
    blackbox: true
  },
  public: {
    type: Boolean,
    label: "Public",
    defaultValue: true
  },
  created_at: {
    type: Date,
    label: "Date Created",
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    optional: true
  },
  updated_at: {
    type: Date,
    label: "Date Changed",
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});

Boks.attachSchema(Schemas.Bok);

Meteor.methods({
  submitBok: function(id, bok) {
    console.log("Updating Bok: " + id + " , " + JSON.stringify(bok));
    return Boks.update(id, {$set: bok});
  },
  addNode: function(node){
    console.log("Inserting Bok Node: " + JSON.stringify(node));
    return Boks.insert(node);
  },
  updateNodeAncestors: function(currentNodeId, newAncestors){
    return Boks.update(currentNodeId, { $set: { ancestors: newAncestors } });
  },
  updateNodePosition: function(currentNodeId, newPosition){
    return Boks.update(currentNodeId, { $set: { position: newPosition } });
  },
  createPermissionInvitation: function(rootId, permissionType){
    var chance = new Chance;
    var code = chance.hash({length: 5});

    var invitations = Boks.findOne({ _id: rootId }).permission_invitations || {};

    invitations[permissionType] = invitations[permissionType] || {};

    invitations[permissionType][code] = null;

    invitations['codes'] = invitations['codes'] || [];

    invitations['codes'].push(code);

    return Boks.update(rootId, {$set: {permission_invitations: invitations}});
  },
  acceptPermissionInvitation: function(invitationCode, userId){

    var rootNode = Boks.findOne({ 'permission_invitations.codes': invitationCode });

    if(_.isUndefined(rootNode)){
      throw new Meteor.Error(500, 'Error 500: Invitation code does not exist', 'Invitation code does not exist.');
    }

    var invitations = rootNode.permission_invitations || {};
    var permissions = rootNode.permissions || {};
    var type = null;

    // update permission inv
    // { codes: [ ... ], admin: { <code>: (null|userId), ... }, publisher: { ... }, editor: { ... }, author: { ... } }
    _.forEach(invitations, function(value, key){
      if(key !== 'codes'){
        if(_.has(value, invitationCode)){
          if(value[invitationCode]){
            type = null;
          } else {
            type = key;
            value[invitationCode] = userId;
          }
        }
      }
    });

    // update permissions
    // { admins: [ userId, ... ], publishers: [ ... ], editors: [ ... ], authors: [ ... ] }
    if(_.isNull(type)){
      throw new Meteor.Error(500, 'Error 500: Invitation already in use', 'Invitation is already in use.');
    } else {
      permissions[type + 's'] = permissions[type + 's'] || [];
      permissions[type + 's'].push(userId);
    }

    return Boks.update(rootNode._id, {$set: {permissions: permissions, permission_invitations: invitations}});
  }
});
