CreateAttemptController = RouteController.extend({
  layoutTemplate: "attempt_layout",

  subscriptions: function(){
    this.subscribe('sequences_and_attempts_for_user', Meteor.userId());
  },

  data: function() {
    return Sequences.findOne({_id: this.params._id})
  },

  begin: function() {
    this.render("begin_sequence");
  }
});