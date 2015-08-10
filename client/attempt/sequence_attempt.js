Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('sequences');

Session.set('currentAttemptMeasures', Measures.find().fetch());

Template.sequence_attempt.helpers({
  measures: function() {
    return _.map(Session.get('currentAttemptMeasures'), function(m,i){
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

  Session.set('currentSequenceId', Sequences.find().fetch()[0]._id /*TODO: get from router*/ );

  //TODO: improve createAttempt placement, dont create a new attempt on each entry, only when the last attempt is 'complete'
  Meteor.promise('createAttempt', Session.get('currentSequenceId'), Meteor.user()).then(function(attemptId){
    Session.set('currentAttemptId', attemptId);
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
  'click .scroll-prev': function(event) {
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
  },
  'click #attempt-submit': function(event){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    var measureAnswersMap = _.map(currentAttempt.attempt.items, function(item){ return item.answer_id; });
    var allMeasuresAnswered = !_.some(measureAnswersMap, function(answer){ return answer === null });

    var unansweredMeasures = _.filter( _.map(currentAttempt.attempt.items, function(item, index){ return { data: item.data, answer_id: item.answer_id, index: index + 1 } }), function(item){ return item.answer_id === null } );

    if(allMeasuresAnswered){
      // REMOVE RADIOBUTTONS, READ ONLY, SHOW ALL FEEDBACK
      //alert('SCORE: ' + currentAttempt.attempt.score + ' out of possible ' + currentAttempt.total_possible_score);
    } else {
      alert('Make sure to answer all questions before submitting. You have not answered ' + _.map(unansweredMeasures, function(measure){ return measure.index }).join(','))
    }
  }
});