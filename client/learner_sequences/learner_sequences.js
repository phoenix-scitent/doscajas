Template.learner_sequences.helpers({
	sequences: function() {
		return SEQUENCES.getAvailable({ userId: Meteor.userId() });
	}
});
