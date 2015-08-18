//Meteor.subscribe('measures');
//Meteor.subscribe('resources');
//Meteor.subscribe('sequences');

Template.sequence_attempt.helpers({
  measures: function() {
    if (this.attempt === undefined)
      return [];
    return _.map( _.filter(this.attempt.items, function(item){ return item.type === 'measure' }) , function(item,index) {
      item.position = index + 1;
      return item;
    });
  },
  isMultipleChoice: function(){
    return this.response_type === 'multiplechoice';
  },
  inReview: function(){
    return this.attempt && this.attempt.completed_at;
  }
});

Template.sequence_attempt.rendered = function(){

  $(document).scrollsnap({
    snaps: '.snap',
    proximity: 300,
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
  'click #attempt-submit': function(event, templ){

    var measures = _.filter(this.attempt.items, function(item){ return item.type === 'measure' });

    var answered = _.partition(measures, function(measure){
      return measure.is_answered;
    });

    var answeredMeasures = answered[0];
    var unansweredMeasures = answered[1];

    if(unansweredMeasures.length === 0){
      Meteor.call('completeAttempt', this._id, function(err, currentAttemptId) {
        if (err){
          alert(err);
        } else {
          window.scrollTo(0 /* x-coord */, 0 /* y-coord */);
        }
      });
    } else {
      alert('Make sure to answer all questions before submitting. You have not answered ' + _.map(unansweredMeasures, function(measure){ return measure.position }).join(','))
    }
  },
  'click #return-to-results': function(event){
    window.scrollTo(0 /* x-coord */, 0 /* y-coord */);
  }
});

