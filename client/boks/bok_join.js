Template.bok_join.events({
  'click #bok-join-button': function(e){
    var $invitationCodeInput = $('#bok-join-input'),
        invitationCode = $invitationCodeInput.val();

    if(invitationCode !== ""){
      Meteor.call('acceptPermissionInvitation', invitationCode, Meteor.userId(), function(err, docId){ if(err){ alert(err.details); $invitationCodeInput.val(''); } else { alert('Joined!'); $invitationCodeInput.val(''); } });
    } else {
      alert('Please enter a code.');
    }
  }
});
