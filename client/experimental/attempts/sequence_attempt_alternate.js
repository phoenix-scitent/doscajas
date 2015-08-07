Meteor.subscribe('measures');

Template.sequence_attempt_alternate.helpers({
  measures: function() {
    return _.map(Measures.find().fetch(), function(m,i){ m.position = i+1; return m; });
  },
  measure_count: function(){
    return Measures.find().count();
  }
});

Template.sequence_attempt_alternate.rendered = function(){
  // setupScrollify();
  // // $('body').panelSnap();
  // function setupScrollify(){
  //   $.scrollify({
  //       section : "section",
  //       sectionName: "question-order",
  //       afterResize: resetScrollify
  //   });
  // }
  $(document).scrollsnap({
    snaps: '.snap',
    proximity: 200
  });
};

Template.sequence_attempt_alternate.events({
  'click .scroll-prev': function() {
    //$.scrollify.previous();
  },
  'click .scroll-next': function(){
    //$.scrollify.next();
  }
});

