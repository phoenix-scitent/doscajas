Template.bok_leaf_edit.rendered = function(){
};

Template.bok_leaf_edit.events({
});

Template.bok_leaf_edit.helpers({
  selected_leaf_measure_count: function() {
    if (Session.get('selected_leaf_node')){
      return Measures.find({tags: Session.get('selected_leaf_node')}).count();
    }
  },
  selected_leaf_resource_count: function() {
    console.log("selected_leaf_resource_count");
    console.log(Session.get('selected_leaf_node'))
    if (Session.get('selected_leaf_node')){
      return Resources.find({tags: Session.get('selected_leaf_node')}).count();      
    }
  }
})