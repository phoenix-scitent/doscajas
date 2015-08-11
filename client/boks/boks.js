Meteor.subscribe('boks');

Template.boks.helpers({
  boks: function() {
    //TODO: this.fetch(); ... this is not found when trying to use what the router passes in?
    //TODO: scope this to only those owned by current user
    return Boks.find({ancestors: []}, {sort: {date_created : -1} });
  },
  bok_count: function() {
    return Boks.find({ancestors: []}).count();
  }
});

Template.boks.rendered = function(){

};