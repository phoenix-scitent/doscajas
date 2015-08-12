LoginController = RouteController.extend({
	layoutTemplate: "blankLayout",

	subscriptions: function(){

	},
	creator_login: function() {
		Session.set("login_context", "creator");
		this.render("account_login");
	},
	learner_login: function() {
		Session.set("login_context", "learner");
		this.render("account_login");
	}
})