Template.measure_linked_resources.helpers({
  linked_resources: function(){
    return  _.map(this.linked_resources, function(id){ return Resources.findOne({_id: id}) });
  }
});