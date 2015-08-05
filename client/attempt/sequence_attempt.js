/*


Meteor.call("createAttempt", ); // parent sequence ID

*/

Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('sequences');

Template.sequence_attempt.helpers({
  measures: function() {
    return _.map(Measures.find().fetch(), function(m,i){
      var measure = m;

      measure.position = i+1;
      measure.answers = _.map(measure.answers, function(answer){
        return _.assign(answer, { measure_id: measure._id });
      });

      return measure;
    });
  },
  measure_linked_resources: function(){
    return _.map(this.linked_resources, function(id){ return Resources.findOne({_id: id}) });
  },
  measure_count: function(){
    return Measures.find().count();
  },
  isMultipleChoice: function(){
    return this.type === 'multiplechoice';
  }
});

Template.sequence_attempt.rendered = function(){

  Session.set('currentSequence', Sequences.find().fetch()[0] /*TODO: get from router*/ );

  Meteor.promise('createAttempt', Session.get('currentSequence')._id).then(function(attemptId){
    Session.set('currentAttempt', Sequences.findOne({ _id: attemptId }));
  });

  $(document).scrollsnap({
    snaps: '.snap',
    proximity: 200,
    offset: -100,
    onSnap: function($snappedElement, silent) {
      var measureId = $snappedElement.data('measure');
      var state = $snappedElement.data('state');
      var stateUpdated = $snappedElement.data('state-updated');

      if(state === 'unseen'){
        $snappedElement.data('state', 'seen');
        $snappedElement.data('state-updated', Date.now());
      }

      console.log('onSnap', measureId, state, stateUpdated);

      $snappedElement.fadeTo(0,1);
      $('.snap').not($snappedElement).fadeTo(200,0.2);
    }
  });
};

Template.sequence_attempt.events({
  'click .scroll-prev': function() {
    var $el = $(event.target);
        $parentSection = $el.closest('.snap');
        $prevSection = $parentSection.prev('.snap');

    if($prevSection.offset()){
      $('html, body').animate({
        scrollTop: $prevSection.offset().top
      }, 500);
    }
  },
  'click .scroll-next': function(event){
    var $el = $(event.target);
        $parentSection = $el.closest('.snap');
        $nextSection = $parentSection.next('.snap');

    if($nextSection.offset()){
      $('html, body').animate({
        scrollTop: $nextSection.offset().top
      }, 500);
    }
  }
});