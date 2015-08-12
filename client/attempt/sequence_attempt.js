Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('sequences');

Template.sequence_attempt.helpers({
  measures: function() {

    var measures = _.map(_.filter(this.currentSequence.items, function(item){ return item.type === 'measure' }), function(item){
      return Measures.findOne({ _id: item._id });
    });

    return _.map(measures, function(m,i){
      var measure = m;

      measure.position = i+1;
      measure.answers = _.map(measure.answers, function(answer){
        return _.assign(answer, { measure_id: measure._id });
      });
      measure.embedded = Resources.findOne(measure.embedded_resource);

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
  },
  inReview: function(){
    var currentAttempt = this.currentAttempt;
    var isComplete = currentAttempt && currentAttempt.attempt.completed_at;

    Session.set('currentSequenceComplete', isComplete);

    return Session.get('currentSequenceComplete');
  }
});

Template.sequence_attempt.rendered = function(){
  var currentSequence = this.data && this.data.currentSequence;
  var currentAttempt = this.data && this.data.currentAttempt;

  Session.set('currentSequenceId', currentSequence._id);

  if(currentAttempt){
    Session.set('currentAttemptId', currentAttempt._id);
  } else {
    Meteor.promise('createAttempt', Session.get('currentSequenceId'), Meteor.user()).then(function(attemptId){
      Session.set('currentAttemptId', attemptId);
    });
  }


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

  $('.snap').fadeTo(200,0.2);
  $('.snap').first().fadeTo(0,1);
};

Template.sequence_attempt.events({
  'click .scroll-prev': function(event) {
    var $el = $(event.target);
        $parentSection = $el.closest('.snap');
        $prevSection = $parentSection.prev('.snap');

    if($prevSection.offset()){
      $('html, body').animate({
        scrollTop: $prevSection.offset().top - 100
      }, 500);
    }
  },
  'click .scroll-next': function(event){
    var $el = $(event.target);
        $parentSection = $el.closest('.snap');
        $nextSection = $parentSection.next('.snap');

    if($nextSection.offset()){
      $('html, body').animate({ scrollTop: $nextSection.offset().top - 100
      }, 500);
    }
  },
  'click #begin-button': function(event){
    $('html, body').animate({ scrollTop: $( ".snap:eq(1)" ).offset().top - 100 }, 500);

  },
  'click #dashboard-button': function(event){
    Router.go('/all_sequences')
  },
  'click #attempt-submit': function(event){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    var measureAnswersMap = _.map(currentAttempt.attempt.items, function(item){ return item.answer_id; });
    var allMeasuresAnswered = !_.some(measureAnswersMap, function(answer){ return answer === null });

    var unansweredMeasures = _.filter( _.map(currentAttempt.attempt.items, function(item, index){ return { data: item.data, answer_id: item.answer_id, index: index + 1 } }), function(item){ return item.answer_id === null } );

    if(allMeasuresAnswered){
      Meteor.call('updateAttempt', Session.get('currentAttemptId'), { isComplete: true }, function(err, currentAttemptId) {
        if (err){
          alert(err);
        } else {
          Session.set('currentSequenceComplete', Sequences.findOne({ _id: currentAttemptId }).attempt.completed_at);
          Router.go("/sequence/" + Session.get('currentSequenceId') + "/attempt/" + Session.get('currentAttemptId'));
          window.scrollTo(0 /* x-coord */, 0 /* y-coord */);
        }
      });
    } else {
      alert('Make sure to answer all questions before submitting. You have not answered ' + _.map(unansweredMeasures, function(measure){ return measure.index }).join(','))
    }
  },
  'click #return-to-results': function(event){
    window.scrollTo(0 /* x-coord */, 0 /* y-coord */);
  }
});

Template.review_display.helpers({
  currentAttemptsCount: function(){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    return currentAttempt.attempt.count;
  },
  possibleAttemptsCount: function(){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    return currentAttempt.attempts_allowed;
  },
  currentScore: function(){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    return currentAttempt.attempt.score;
  },
  totalScore: function(){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    return currentAttempt.total_possible_score;
  }
});

Template.introduction_display.helpers({
  sequence: function(){
    var currentSequence = Sequences.findOne({ _id: Session.get('currentSequenceId') });

    return currentSequence;
  }
});