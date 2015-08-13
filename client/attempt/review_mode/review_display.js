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
