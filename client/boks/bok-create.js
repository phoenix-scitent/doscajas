Template.bokCreate.rendered = function(){

  //TODO: pull this info from true logged in user
  Session.set('userId', new Meteor.Collection.ObjectID("34b3e681ae08b1da6ee665d2"))

};

Template.bokCreate.events({
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
            },
            "date_created": Date.now()
          };
        };

    //TODO: VALIDATION

    Boks.insert(rootNode(rootName), function(error, docId){
      $rootNameInput.val('');
      Router.go('bok', {_id: docId});
    });
  }
});