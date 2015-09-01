Template.sequence_interact.helpers({
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
      return '(Attempts used: ' + Sequences.find({ 'attempt.original': this._id, 'attempt.user': Meteor.userId() }).count() + ' of ' + this.attempts_allowed + ')';
    }
  },
  hasAttemptsLeft: function(){
    return Sequences.find({ 'attempt.original': this._id, 'attempt.user': Meteor.userId() }).count() < this.attempts_allowed;
  }
});

Template.sequence_interact.events({
  'click #reset-attempts': function(event){
    _.forEach(Sequences.find({ 'attempt.original': $(event.target).data('sequence') }).fetch(), function(attempt){
      console.log('deleting: ', attempt);
      Meteor.call('removeSequence', attempt._id);
    })
  }
});