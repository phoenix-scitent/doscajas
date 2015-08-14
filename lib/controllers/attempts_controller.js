AttemptsController = RouteController.extend({
  layoutTemplate: "attempt_layout",

  subscriptions: function(){
    this.subscribe('sequences');
  },

  data: function() {
    return Sequences.findOne({_id: this.params._id});
  },

  take: function() {
    this.render("sequence_attempt");
  }
});