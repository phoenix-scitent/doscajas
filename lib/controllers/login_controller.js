LoginController = RouteController.extend({
	layoutTemplate: "blankLayout",

	subscriptions: function(){

	},
	creator_login: function() {
		if (Meteor.user()){
			Router.go('boks');	
		} else {
			Session.set("login_context", "creator");
			this.render("account_login");		
		}
	},
	learner_login: function() {
		if (Meteor.user()){
			Router.go('all_sequences');
		} else {
			Session.set("login_context", "learner");
			this.render("account_login");		
		}
	}
});
