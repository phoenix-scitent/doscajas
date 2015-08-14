Template.multiple_choice_answers_review.helpers({
  isCorrect: function(helperParams){
    var params = helperParams.hash;

    var measure = Measures.findOne({ _id: params.measureId });

    var answer = _.find(measure.answers, function(answer){ return answer.id === params.answerChoiceId });

    return answer.correct;
  },
  isYourAnswer: function(helperParams){
    var params = helperParams.hash;

    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    var yourItem = _.find(currentAttempt.attempt.items, function(item){ return item.data._id === params.measureId });

    return (params.answerChoiceId === (yourItem.answer_id + 1));
  },
  displayResource: function(helperParams){
    var params = helperParams.hash;

    return Resources.findOne({ _id: params.resourceId }).title;
  }
});