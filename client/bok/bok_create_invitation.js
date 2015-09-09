Template.bok_create_invitation.rendered = function(){

  $("#bok-permissions").selectize({
    plugins: ['remove_button'],
    placeholder: "Choose permissions type...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'slug',
    searchField: 'name',
    options: BOK_PERMISSIONS,
    items: [ ]
  });

};

Template.bok_create_invitation.events({
  'click #create-invitation-button': function(e){
    var bokRoot = Session.get('bokRoot'),
        permissionTypeSelectize = $('#bok-permissions')[0].selectize,
        permissionType = permissionTypeSelectize.getValue();

    if(permissionType === ''){
      alert('Choose permission type.')
    } else {
      Meteor.call('createPermissionInvitation', bokRoot._id, permissionType, function(err, doc){ if(err){ console.log('createPermissionCode ERROR: ', err) } else { /* noop */ } });
      permissionTypeSelectize.clear()
    }
  }
});
