Template.learner_activities.helpers({
	activities: function() {
		return ACTIVITIES.getAvailable({ userId: Meteor.userId() });
	}
});
