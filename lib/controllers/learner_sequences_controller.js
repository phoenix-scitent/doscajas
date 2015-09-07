LearnerSequencesController = RouteController.extend({
	layoutTemplate: "blankLayout",

	subscriptions: function(){
    this.subscribe('sequences_and_attempts_for_user', Meteor.userId());
	},

	action: function() {
		// Session.set("login_context", null);
		this.render("learner_sequences");
	}
});