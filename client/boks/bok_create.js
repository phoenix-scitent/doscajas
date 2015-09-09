Template.bok_create.events({
  'click #bok-create-button': function(e){
    var $rootNameInput = $('#bok-create-input'),
        rootName = $rootNameInput.val(),
        rootNode = function(name){
          return {
            "name" : name,
            "ancestors" : [],
            "permissions" : {
              "admins" : [
                Meteor.user()._id
              ],
              "publishers" : [],
              "editors" : [],
              "authors" : []
            }
          };
        };

    if(rootName !== ""){
      Meteor.call('addNode', rootNode(rootName), function(err, docId){
        if(err){
          console.log('addNode ERROR: ', err)
        } else {
          $rootNameInput.val('');
          Router.go('bok', {_id: docId});
        }
      });
    }
  }
});
