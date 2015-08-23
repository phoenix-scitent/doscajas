Template.review_display.helpers({
  hasUnlimitedAttempts: function(){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    return currentAttempt.attempts_allowed === Infinity;
  },
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
  },
  hasPassed: function(){
    var currentAttempt = Sequences.findOne({ _id: Session.get('currentAttemptId') });

    if(currentAttempt.passing_rate_type === 'score'){
      return currentAttempt.attempt.score >= currentAttempt.passing_rate;
    } else /* percentage */ {
      return true;
    }
    //currentAttempt.total_possible_score
  }
});
