Meteor.subscribe('measures');

Template.sequence_attempt.helpers({
  measures: function() {
    return _.map(Measures.find().fetch(), function(m,i){ m.position = i+1; return m; });
  },
  measure_count: function(){
    return Measures.find().count();
  }
});

Template.sequence_attempt.rendered = function(){
  $.scrollify({
      section : "section",
      sectionName: "question-order"
  });
};

Template.sequence_attempt.events({
  'click .scroll-prev': function() {
    $.scrollify.previous();
  },
  'click .scroll-next': function(){
    $.scrollify.next();
  }
});