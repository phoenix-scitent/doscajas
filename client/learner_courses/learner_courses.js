Template.learner_courses.helpers({
	courses: function() {
		return COURSES.getAvailable({ userId: Meteor.userId() });
	}
});
