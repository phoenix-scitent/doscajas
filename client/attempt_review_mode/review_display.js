Template.review_display.helpers({
  hasUnlimitedAttempts: function(){
    return this.attempts_allowed === Infinity;
  },
  currentAttemptsCount: function(){
    return this.attempt.count;
  },
  possibleAttemptsCount: function(){
    return this.attempts_allowed;
  },
  currentScore: function(){
    return this.attempt.score;
  },
  totalScore: function(){
    return this.total_possible_score;
  },
  hasPassed: function(){
    return ATTEMPTS.passed(this);
  },
  shouldShowResults: function(){
    return this.show_score_after;
  },
  originalActivityId: function(){
    return Activities.findOne({ _id: this.attempt.original })._id;
  }
});
