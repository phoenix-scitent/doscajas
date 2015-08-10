Template.multiple_choice_answers.events({
  'click .answer-option': function(event){
    var $el = $(event.target);
        measure_id = $el.attr('name');
        answer_id = $el.val() - 1;

    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    var items = currentAttempt.attempt.items;

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