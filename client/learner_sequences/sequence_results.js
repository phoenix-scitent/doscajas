Template.sequence_results.helpers({
  log: function(something){
    console.log(something)
  },
  isAdaptive: function(){
    return this.adaptive_retries;
  },
  currentSequence: function(){
    return this; // this (should be sequence from parent template)
  },
  currentSequenceId: function(){
    return this.attempt ? this.attempt.original : this._id;
  },
  attemptIds: function(templateHash){
    var sequence = templateHash.hash.sequence;
    return _.sortByOrder(Sequences.find({ 'attempt.original': sequence._id }).fetch(), ['created_at'], ['desc']);
  },
  hasAttempts: function(templateHash){
    var attempts = templateHash.hash.sequence;
    return _.sortByOrder(Sequences.find({ 'attempt.original': sequence._id }).fetch(), ['created_at'], ['desc']);
  },
  attemptCompletion: function(templateHash){
    var attemptId = templateHash.hash.attemptId;
    return Sequences.findOne({ _id: attemptId }).attempt.completed_at;
  },
  latestAttempt: function(){
    var sequence = this;
    var latestAttempt = _.last(Sequences.find({ 'attempt.original': sequence._id }).fetch());

    return latestAttempt ? latestAttempt._id : latestAttempt;
  }
});

Template.sequence_results.render = function(){

};

Template.sequence_results.events({
  'click .collapse-link': function(e){
    var $icon = $(e.target);
    var $content = $(e.target).closest('.ibox-title').siblings('.ibox-content');

    if($icon.hasClass("fa-chevron-up")){
      $icon.removeClass("fa-chevron-up");
      $icon.addClass("fa-chevron-down");
      $content.slideDown()
    } else {
      $icon.removeClass("fa-chevron-down");
      $icon.addClass("fa-chevron-up");
      $content.slideUp()
    }

  },
  'click .ibox': function(e){

  }
});

