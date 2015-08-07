Template.sequence_submit.events({
  'click #sequence-submit-button': function(e){
    console.log(Session.get('currentSequenceList'));
  }
});