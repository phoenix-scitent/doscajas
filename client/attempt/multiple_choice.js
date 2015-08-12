Template.multiple_choice.helpers({
  inProgress: function(){
    return !Session.get('currentSequenceComplete');
  },
  inReview: function(){
    return Session.get('currentSequenceComplete');
  }
});