Template.sequence_submit.events({
  'click #sequence-submit-button': function(e){
    Router.go("/sequence/"+ Session.get('currentSequenceId') +"/inspect");
  }
});