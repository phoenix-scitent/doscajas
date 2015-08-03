Template.multiple_choice_answers.events({
  'click .answer-option': function(event){
    var $el = $(event.target);
        measure_id = $el.attr('name');
        answer_id = $el.val() - 1;

    if(Measures.findOne({ _id: measure_id }).answers[answer_id].correct){
      console.log('You are correct.')
    } else {
      console.log('You are wrong')
    }
  }
});