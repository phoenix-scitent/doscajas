if (Boks.find().count() === 0) {

 var json = [
   {"name": 'Algebra',"children":[{"name": 'Variables', "children": [{"name": 'x'}, {"name": 'y'}]}, {"name": "Methods"}]},
   {"name": 'Geometry',"children":[{"name": 'Circles'}, {"name": "Polygons"}, {"name": "Angles"}]},
   {"name": 'Calculus',"children":[]}
  ];

var ownerId = new Meteor.Collection.ObjectID("34b3e681ae08b1da6ee665d2");

var createBok = function(json, rootName, ownerId){
    var rootId = Boks.insert({
      '__testdata': true,
      "name" : rootName,
      "ancestors" : [],
      "roles" : {
        "admins" : [
          ownerId
        ],
        "publishers" : [],
        "editors" : [],
        "authors" : []
      },
      "date_created": Date.now()
    });

    var createNode = function(node, parent){

      var childId = Boks.insert({
        '__testdata': true,
        "name" : node.name,
        "ancestors" : parent.ancestors.concat([parent._id]),
        "public": true,
        "date_created": Date.now()
      });

      return childId;
    };

    var createNodes = function(json, parentId){
      var parent = Boks.findOne({_id: parentId});

      _.forEach(json, function(child){
        var createdChildId = createNode(child, parent);
        createNodes(child['children'], createdChildId);
      })

    };

    createNodes(json, rootId);

    return rootId;
  };

createBok(json, 'Mathematics', ownerId);
}