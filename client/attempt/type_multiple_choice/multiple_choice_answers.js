Template.multiple_choice_answers.helpers({
  inProgress: function(){
    return !Session.get('currentSequenceComplete');
  },
  inReview: function(){
    return Session.get('currentSequenceComplete');
  }
});

Template.multiple_choice_answers.events({

});

