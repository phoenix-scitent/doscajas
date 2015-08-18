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

      //TODO: (in progress below) handle moving nodes, reordering and saving child order to db
      //TODO: make sure to also account for new nodes added via data and nodes removed via data, reshuffle order

      _.forEach(_.uniq([nodeParent, nodeOldParent]), function(parent){
        var node = function(id){
          if(id === '#'){
            return bokRootId;
          } else {
            return id;
          }
        };
        var childrenLength = $('#container').jstree(true).get_children_dom(parent).length;

        if((childrenLength === 0) && (nodeParent === parent)){
          // get_children_dom method will not recognize the case when the first child is added to an empty parent,
          // need to manually handle this case
          console.log('child ' + 0 + ' of ' + node(parent), nodeId)

          //TODO: update each child in database with new order value (parent was already updated above)
        }

        _.forEach($('#container').jstree(true).get_children_dom(parent), function(child, index){
          console.log('child ' + index + ' of ' + node(parent), $(child).attr('id'))

          //TODO: update each child in database with new order value (parent was already updated above)
        })
      });

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