Template.sequence_attempt.helpers({
  cajas: function() {
    if (this.attempt === undefined) {
      return [];      
    }

    return _.map(this.attempt.items, function(item,index) {
      item.position = index + 1;
      return item;
    });
  },
  isMeasure: function(){
    return this.caja_type === 'measure';
  },
  progress_percentage: function(){
    var times = this.attempt.items.length;
    return Math.round(_.sum(this.attempt.items, function(i){
      return (i.is_answered) ? (100 / times) : 0;
    }, 0));
  },
  shouldDisplay: function(){
    var attempt = Template.parentData(1).attempt;
    var wasAnsweredCorrectly = this.adaptive_completion;
    var thisAttempt = attempt && attempt.count;
    var wasAnsweredPreviously = (this.adaptive_completion != thisAttempt);
    var shouldDisplay = !(wasAnsweredCorrectly && wasAnsweredPreviously);

    return shouldDisplay;
  },
  isMultipleChoice: function(){
    return this.response_type === 'multiplechoice';
  },
  inReview: function(){
    return Template.parentData(1).attempt && Template.parentData(1).attempt.completed_at;
  },
  showResourcesDuring: function(){
    return Template.parentData(1).show_linked_resources_during;
  },
  showResourcesAfter: function(){
    return Template.parentData(1).show_linked_resources_after;
  },
  log: function(something) {
    console.log(something);
  }
});

Template.sequence_attempt.rendered = function(){

  $(document).scrollsnap({
    snaps: '.snap',
    proximity: 300,
    offset: -100,
    easing: 'easeInOutQuint',
    onSnap: function($snappedElement, silent) {
      var measureId = $snappedElement.data('id');
      var state = $snappedElement.data('state');
      var stateUpdated = $snappedElement.data('state-updated');

      if(state === 'unseen'){
        $snappedElement.data('state', 'seen');
        $snappedElement.data('state-updated', Date.now());
      }

      window.focused_caja = $snappedElement;

      $('button.scroll-prev').prop("disabled", ($('.snap').first()[0] == $snappedElement[0]));
      $('button.scroll-next').prop("disabled", ($('.snap').last()[0] == $snappedElement[0]));

      console.log('onSnap', measureId, state, stateUpdated);


      $snappedElement.fadeTo(0,1);
      $('.snap').not($snappedElement).fadeTo(200,0.2);
    }

  });

  $(document).on('keyup', function (e) {
    if (e.which === 13) {
      alert("you pressed enter");
    }
  });

  $('.snap').fadeTo(0,0.2);
  // $('.snap').first().fadeTo(0,1);
  // window.focused_caja = $('.snap').first();
  // $('button.scroll-prev').prop("disabled", true);

  $('html, body').animate({
    scrollTop: 1
  }, 400);

};

Template.sequence_attempt.events({
  'click .scroll-prev': function(event) {
    var $el = window.focused_caja;
        $parentSection = $el.closest('.snap');
        $prevSection = $parentSection.prev('.snap');

    $('.snap').fadeTo(200,0.2);
    $prevSection.fadeTo(200,1);

    if($prevSection.offset()){
      $('html, body').animate({
        scrollTop: $prevSection.offset().top - 100
      }, 500);
    }
  },
  'click .scroll-next': function(event){
    var $el = window.focused_caja;
        $parentSection = $el.closest('.snap');
        $nextSection = $parentSection.next('.snap');

    $('.snap').fadeTo(200,0.2);
    $nextSection.fadeTo(200,1);

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
      $('#measures-unanswered').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }
  },
  'click #return-to-results': function(event){
    window.scrollTo(0 /* x-coord */, 0 /* y-coord */);
  }
});

