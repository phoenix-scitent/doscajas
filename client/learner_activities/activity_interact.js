Template.activity_interact.helpers({
  adaptiveInfo: function(){
    if(this.adaptive_retries){
      return '[adaptive]';
    } else {
      return '';
    }
  },
  attemptsLeft: function(){
    if(this.attempts_allowed === Infinity){
      return '(Unlimited attempts)';
    } else {
      return '(Attempts used: ' + Activities.find({ 'attempt.original': this._id, 'attempt.user': Meteor.userId() }).count() + ' of ' + this.attempts_allowed + ')';
    }
  },
  hasAttemptsLeft: function(){
    return Activities.find({ 'attempt.original': this._id, 'attempt.user': Meteor.userId() }).count() < this.attempts_allowed;
  }
});

Template.activity_interact.events({
  'click #reset-attempts': function(event){
    _.forEach(Activities.find({ 'attempt.original': $(event.target).data('activity') }).fetch(), function(attempt){
      console.log('deleting: ', attempt);
      Meteor.call('removeActivity', attempt._id);
    })
  }
});
