Template.multiple_choice_answers.events({
  'click .answer-option': function(event){
    var $el = $(event.target);
        measure_id = $el.attr('name');
        answer_id = $el.val() - 1;

    var items = Session.get('currentAttempt').attempt.items;

    _.forEach(items, function(item){
      if(item.data._id === measure_id){
        item.answer_id = answer_id;
      }
    });

    Meteor.call('updateAttempt', Session.get('currentAttempt')._id, { 'attempt.items': items }, function(err, currentAttemptId) {
      if (err){
        alert(err);
      } else {

        //TODO: session did not update itself with the data update... find way to do this without manual set?
        Session.set('currentAttempt', Sequences.findOne({ _id: currentAttemptId }));

        console.log(Session.get('currentAttempt').attempt.items);

        if(Measures.findOne({ _id: measure_id }).answers[answer_id].correct){
          console.log('Correct!')
        } else {
          console.log('You are wrong')
        }
      }
    });
  }
});