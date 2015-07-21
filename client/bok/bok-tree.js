Template.bokTree.rendered = function(){

  this.autorun(function(){
    Template.currentData(); // autorun reactivity source

    if($('#container').jstree(true)){
      $('#container').jstree(true).destroy();
    }

    $('#container').on('loaded.jstree', function(e, data){
      $(this).jstree("open_all");
    }).on('refresh.jstree', function(e, data){
      $(this).jstree("open_all");
    }).on('move_node.jstree', function(e, data){
      var bokRootId = Session.get('bokRoot')._id,
          nodeId = data.node.id,
          nodeParent = data.parent,
          nodeParents = data.node.parents,
          nodeOldParent = data.old_parent,
          formatAncestors = function(parents){
            return _.map(parents.reverse(), function(id){
              if(id === '#'){
                return bokRootId;
              } else {
                return id;
              }
            });
          },
          updateNode = function(currentNodeId, newAncestors){
            Boks.update(currentNodeId, {
              $set: {
                ancestors: newAncestors
              }
            });
          };

      if(!(nodeParent === nodeOldParent)){
        updateNode( nodeId, formatAncestors(nodeParents) )
      }

    }).jstree({
      'core' : {
        'check_callback' : true,
        'data' : Session.get('bokNodes')
      },
      'types' : {
        "public" : {
          "icon" : "glyphicon glyphicon-tag"
        },
        "private" : {
          "icon" : "glyphicon glyphicon-lock"
        }
      },
      'plugins' : ["dnd", "types"]
    });

    $( document).off('addNode');

    $( document ).on('addNode', function(){
      $('#container').jstree(true).settings.core.data = Session.get('bokNodes');
      $('#container').jstree(true).refresh();
      $('#container').jstree("open_all");
    });

  });
};

Template.bokTree.events({

});