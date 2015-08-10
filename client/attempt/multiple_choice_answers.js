Template.multiple_choice_answers.events({
  'click .answer-option': function(event){
    var $el = $(event.target);
        measure_id = $el.attr('name');
        answer_id = $el.val() - 1;

    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    var items = currentAttempt.attempt.items;

    (function(){ //TODO: FEEDBACK -- refactor this into cleaner specific logic
      if(currentAttempt.show_feedback_during){
        $('.feedback').remove();

        var $option = $el.parent().parent();

        var measure = Measures.findOne({ _id: $el.attr('name') });

        var answer = _.find(measure.answers, function(answer){ return answer.id === parseInt($el.attr('value')) });

        var linkedResource = Resources.findOne({ _id: answer.linked_resource });

        var resource = '<div style="padding-top:3px;"><a type="button" class="btn btn-block btn-outline btn-primary btn-small"><i class="fa fa-external-link"></i>'+(linkedResource && linkedResource.title)+'</a></div>';

        $option.append('<div class="feedback" style="width:100%;padding:3px;border:1px dotted darkgrey;background-color:#eee;float:right;color:'+ (answer.correct ? 'green' : 'red') +';">'+
        (answer.correct ? 'Correct: ' : 'Incorrect: ') + answer.feedback +
        ((currentAttempt.show_linked_resources_during && linkedResource) ? resource : '') +
        '</div>').show('slow');
      }
    }());

    _.forEach(items, function(item){
      if(item.data._id === measure_id){
        item.answer_id = answer_id;
      }
    });

    Meteor.call('updateAttempt', Session.get('currentAttemptId'), { 'attempt.items': items }, function(err, currentAttemptId) {
      if (err){
        alert(err);
      } else {

      }
    });
  }
});