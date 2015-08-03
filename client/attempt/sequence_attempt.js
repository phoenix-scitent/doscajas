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
    proximity: 200,
    offset: -100,
    onSnap: function(t) {
      t.fadeTo(0, 1);
      $('.snap').not(t).fadeTo( 200, 0.2 );
    }
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

