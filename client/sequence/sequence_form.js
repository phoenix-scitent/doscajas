Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('sequences');

Template.sequence_form.helpers({
  measures: function(){
    return this.measures;
  },
  resources: function(){
    return this.resources;
  }
});

Template.sequence_form.rendered = function(){
  // Initialize sortable
  $(".sortable-list").sortable({
    connectWith: ".connectList",
    receive: function( event, ui ) {
      if($(event.target).attr('id') === 'sequence-list'){
        var content = $(this).sortable("toArray", { attribute: "data-content" });

        var elements =_.map(content, function(c){
          var data = c.split('|');
          return { type: data[0], _id: data[1] };
        });

        Session.set('currentSequenceList', elements);
      }
    }
  }).disableSelection();
};