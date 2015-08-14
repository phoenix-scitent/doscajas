Template.multiple_choice_answers_progress.helpers({
  feedback_shown: function() {
    var attempt = Template.parentData(2);
    var measure = Template.parentData(1);
    var answer = this;
    if (attempt.attempt.completed_at && attempt.show_feedback_after) {
      // if it is in review, show the user's chosen answer feedback 
      // as well as the correct feedback
      return answer.chosen || answer.correct;
    }
    if (!attempt.attempt.completed_at && attempt.show_feedback_during) {
      // if it is in progress, show feedback of the chosen answer
      // only when the whole question is done
      return measure.is_answered && answer.chosen;
    }
    return false;
  },
  measure_id: function() {
    return Template.parentData(1)._id;
  },
  correct_feedback_class: function() {
    return this.correct ? "alert-success" : "alert-danger";
  },
  correct_checkbox_class: function() {
    if (Template.parentData(2).show_feedback_during) {
      return this.correct ? "btn-primary" : "btn-danger btn-outline";  
    }
    return "btn-info";
  },
  correct_checkbox_icon: function() {
    if (Template.parentData(2).show_feedback_during) {
      return this.correct ? "fa-check" : "fa-times";
    }
    return "fa-check";
  }
});

Template.multiple_choice_answers_progress.events({
  'click .mc_answer': function(e, tmpl) {
    Meteor.call("selectAnswer", parseInt($(e.target).data("choice")), $(e.target).data("measure"), Template.parentData(1)._id, function(err, resp){
      if(err) {
        console.log(["Thou art a stupid head",err])
      }
    });
  }
});