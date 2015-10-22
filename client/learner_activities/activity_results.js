Template.activity_results.helpers({
  log: function(something){
    console.log(something)
  },
  isAdaptive: function(){
    return this.adaptive_retries;
  },
  currentActivity: function(){
    console.log('CURRENT ACTIVITY: ', this)
    return this; // this (should be activity from parent template)
  },
  currentActivityId: function(){
    return this.attempt ? this.attempt.original : this._id;
  },
  attemptIds: function(templateHash){
    var activity = templateHash.hash.activity;
    return _.sortByOrder(Activities.find({ 'attempt.original': activity._id, 'attempt.completed_at': {"$ne":null} }).fetch(), ['created_at'], ['desc']);
  },
  hasAttempts: function(templateHash){
    var attempts = templateHash.hash.activity;
    return _.sortByOrder(Activities.find({ 'attempt.original': activity._id }).fetch(), ['created_at'], ['desc']);
  },
  attemptCompletion: function(templateHash){
    var attemptId = templateHash.hash.attemptId;
    return Activities.findOne({ _id: attemptId }).attempt.completed_at;
  },
  latestAttempt: function(){
    var activity = this;
    var latestAttempt = _.last(Activities.find({ 'attempt.original': activity._id, 'attempt.completed_at': {"$ne":null} }).fetch());

    return latestAttempt && latestAttempt._id;
  }
});

Template.activity_results.render = function(){

};

Template.activity_results.events({
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

