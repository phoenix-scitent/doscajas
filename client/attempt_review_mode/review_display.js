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
    if(this.passing_rate_type === 'score'){
      console.log(this.attempt.score, this.passing_rate)
      return this.attempt.score >= this.passing_rate;
    } else /* percentage */ {
      return true;
    }
  },
  shouldShowResults: function(){
    return this.show_score_after;
  }
});