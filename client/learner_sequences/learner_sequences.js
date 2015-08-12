Template.learner_sequences.helpers({
	sequences: function() {
		return Sequences.find({attempt:{"$exists":false}});
	},
  attemptsLeft: function(){
    return '(Attempt: ' + Sequences.find({ 'attempt.parent': this._id, 'attempt.user': Meteor.userId() }).count() + ' of ' + this.attempts_allowed + ')';
  },
  hasAttemptsLeft: function(){
    return Sequences.find({ 'attempt.parent': this._id, 'attempt.user': Meteor.userId() }).count() < this.attempts_allowed;
  }
});

Template.learner_sequences.events({
  'click #reset-attempts': function(event){
    _.forEach(Sequences.find({ 'attempt.parent': $(event.target).data('sequence') }).fetch(), function(attempt){
      console.log('deleted: ', attempt)
      Sequences.remove(attempt._id);
    })
  }
});