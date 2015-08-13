if (Meteor.isClient) {
	Accounts.onLogin(function () {
		var context = Session.get("login_context");
		Session.set("login_context", null);
		if (context === "learner") {
			Router.go('all_sequences');				
		} else if (context === "creator") {
			Router.go('boks');	
		}
	});
};