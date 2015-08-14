Template.multiple_choice_answers_progress.helpers({
	feedback_shown: function() {
		console.log(["feedback_shown",Template.parentData(1)]);
		return this;
	}
});