Template.learner_sequences.helpers({
	sequences: function() {
		return SEQUENCES.getAvailable(Meteor.userId());
	}
});