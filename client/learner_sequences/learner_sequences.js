Template.learner_sequences.helpers({
	sequences: function() {
		return Sequences.find({attempt:{"$exists":false}});
	}
});