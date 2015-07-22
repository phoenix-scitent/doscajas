Template.bokAddNode.rendered = function(){

  //TODO: remove

  //$( document ).on('nestableChanged', function(){
  //  var currentBokData = Session.get('bokNodes'),
  //      bokRoot = Session.get('bokRoot');
  //
  //  var listBok = function(json){
  //    var bok = [];
  //
  //    var createNodes = function(json, parent){
  //      _.forEach(json, function(node){
  //        var structuredNode = {
  //          _id: node._id ,
  //          name: node.name,
  //          ancestors: parent.ancestors.concat([parent._id])
  //        };
  //
  //        bok.push(structuredNode);
  //
  //        createNodes(node['children'], structuredNode);
  //      })
  //    };
  //
  //    createNodes(json, bokRoot);
  //
  //    return bok;
  //
  //  };
  //
  //  var current = listBok(currentBokData);
  //  var serial = listBok( Session.get('nestableSerialized') );
  //
  //  _.forEach(serial, function(node){
  //    var updateNode = function(currentNode, newNode){
  //          Boks.update(currentNode._id,
  //              {
  //                $set: {
  //                  ancestors: newNode.ancestors
  //                }
  //              });
  //        },
  //        cur = _.select(current, function(curNode){  return curNode._id === node._id })[0];
  //
  //    if(!_.isEqual(cur.ancestors, node.ancestors)){
  //      updateNode(cur, node);
  //    }
  //  });
  //
  //});

};

Template.bokAddNode.events({
  'click #add-tag-button': function(e){
    var currentBokData = Session.get('bokNodes'),
        bokRoot = Session.get('bokRoot'),
        $newTagInput = $( '#add-tag-input'),
        newTag = $newTagInput.val();
        //$bokList = $('#nestable2 > .dd-list'),
        //buildTagMarkup = function(tagName){
        //  return "<li class='dd-item' data-id='' data-name='"+ tagName +"'>" +
        //      "<div class='dd-handle'>" +
        //        "<span class='label label-primary pull-right'></span>" +
        //        "<span class='label label-info pull-right'></span>" +
        //        "<span class='label label-info'><i class='fa fa-users'></i></span>" + tagName +
        //      "</div>" +
        //    "</li>"
        //},
        //addTagToDOM = function(itemMarkup){
        //  $bokList.prepend(itemMarkup);
        //}

    //var listBok = function(json){
    //  var bok = [];
    //
    //  var createNodes = function(json, parent){
    //    _.forEach(json, function(node){
    //      var structuredNode = {
    //        _id: node._id ,
    //        name: node.name,
    //        ancestors: parent.ancestors.concat([parent._id])
    //      };
    //
    //      bok.push(structuredNode);
    //
    //      createNodes(node['children'], structuredNode);
    //    })
    //  };
    //
    //  createNodes(json, bokRoot);
    //
    //  return bok;
    //
    //};

    //TODO: VALIDATION

    // addTagToDOM( buildTagMarkup(newTag) );

    Boks.insert({
      "name" : newTag,
      "ancestors" : [ bokRoot._id ],
      "public": true,
      "date_created": Date.now()
    }, function(){
      $( document).trigger('addNode');
    });

    $newTagInput.val('');

  }

});