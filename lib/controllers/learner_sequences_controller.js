LearnerSequencesController = RouteController.extend({
	layoutTemplate: "blankLayout",

	subscriptions: function(){
		this.subscribe('sequences');
	},

	action: function() {
		// Session.set("login_context", null);
		this.render("learner_sequences");
	}
});