Template.bok_add_node.rendered = function(){


};

Template.bok_add_node.events({
  'click #add-tag-button': function(e){
    var currentBokData = Session.get('bokNodes'),
        bokRoot = Session.get('bokRoot'),
        $newTagInput = $( '#add-tag-input'),
        newTag = $newTagInput.val();

    var node = {
      "name" : newTag,
      "ancestors" : [ bokRoot._id ],
      "position": Boks.find({ $and: [{ancestors: bokRoot._id}, {ancestors: { $size: 1 }}] }).count(),
      "public": true
    };

    if(newTag !== ""){
      Meteor.call('addNode', node, function(err, doc){ if(err){ console.log('addNode ERROR: ', err) } else { $(document).trigger('addNode'); } });
    }

    $newTagInput.val('');

  }
});
