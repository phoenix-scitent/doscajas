LearnerActivitiesController = RouteController.extend({
	layoutTemplate: "blankLayout",

	subscriptions: function(){
    this.subscribe('activities_and_attempts_for_user', Meteor.userId());
	},

	action: function() {
		// Session.set("login_context", null);
		this.render("learner_activities");
	}
});
