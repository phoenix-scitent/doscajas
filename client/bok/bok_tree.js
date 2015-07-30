Template.bok_tree.rendered = function(){

  $('.modal').appendTo("body");


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

    }).on('changed.jstree', function (e, data) {
      var i, j, r = [];
      for(i = 0, j = data.selected.length; i < j; i++) {
        r.push(data.instance.get_node(data.selected[i]).id);
      }
      Session.set('selected_leaf_node', r[0]);
    }).jstree({
      'core' : {
        'check_callback' : true,
        'data' : Session.get('bokNodes'),
        "themes" : {
          "variant" : "large"
        }
      },
      'types' : {
        "public" : {
          "icon" : "fa fa-globe"
        },
        "private" : {
          "icon" : "fa fa-lock"
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

Template.bok_tree.events({

});