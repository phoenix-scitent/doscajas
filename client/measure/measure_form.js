Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('boks');

Template.measure_form.helpers({
  title: function(){
    if (this._id){
      return "Editing: "+ this.question_text;
    } else {
      return "Create a new Measure";
    }
  },
  category: function(){
    if (this._id) {
      return "Measures";
    } else {
      return null;
    }
  }
});

