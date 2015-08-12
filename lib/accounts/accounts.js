if (Meteor.isClient) {
	Accounts.onLogin(function () {
		if (Session.get("login_context") === "learner") {
			Router.go('all_sequences');				
		} else {
			Router.go('boks');	
		}
	});
};