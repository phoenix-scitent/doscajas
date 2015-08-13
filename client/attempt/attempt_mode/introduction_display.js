
Template.introduction_display.helpers({
  sequence: function(){
    var currentSequence = Sequences.findOne({ _id: Session.get('currentSequenceId') });

    return currentSequence;
  }
});