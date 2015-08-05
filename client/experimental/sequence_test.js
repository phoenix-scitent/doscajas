Meteor.subscribe('measures');

Template.sequence_test.helpers({
  measures: function() {
    return Measures.find();
  }
});

Template.sequence_test.rendered = function(){
  $('#slides').panelSnap({
    directionThreshold: 100,
    slideSpeed: 500,
    onSnapStart: function($el){
      var state = $el.data('state');
      var slide = $el.data('panel');

      console.log('snap start', slide, state);

      if(state === 'unseen'){
        $el.data('state', 'seen')
      }
    },
    onSnapFinish: function($el){
      var state = $el.data('state');
      var slide = $el.data('panel');

      console.log('snap finish', slide, state);
    },
    onActivate: function($el){
      var state = $el.data('state');
      var slide = $el.data('panel');

      console.log('activate', slide, state);
    }
  });
};