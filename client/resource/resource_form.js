Meteor.subscribe('resources');
Meteor.subscribe('boks');

Template.resource_form.helpers({
  title: function(){
    if (this._id){
      return "Editing: "+ this.title;
    } else {
      return "Create a new Resource";
    }
  },
  category: function(){
    if (this._id) {
      return "Resources";
    } else {
      return null;
    }
  }
});

Template.resource_form.events({

});