Template.activity_submit.events({
  'click #activity-submit-button': function(e){
    Router.go("/activity/"+ Session.get('currentActivityId') +"/inspect");
  }
});
