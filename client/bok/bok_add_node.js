Template.bok_add_node.rendered = function(){


};

Template.bok_add_node.events({
  'click #add-tag-button': function(e){
    var currentBokData = Session.get('bokNodes'),
        bokRoot = Session.get('bokRoot'),
        $newTagInput = $( '#add-tag-input'),
        newTag = $newTagInput.val();

    boks.addNode({
      data: {
        "name" : newTag,
        "ancestors" : [ bokRoot._id ],
        "position": Boks.find({ $and: [{ancestors: bokRoot._id}, {ancestors: { $size: 1 }}] }).count(),
        "public": true,
        "date_created": Date.now()
      },
      onSuccess: function(){
        $(document).trigger('addNode');
      },
      onError: function(errors){
        _.forEach(errors, function(error){
          alert(error.message);
        })
      }
    });

    $newTagInput.val('');

  }

});