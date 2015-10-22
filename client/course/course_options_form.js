Template.course_options_form.helpers({
  cou: function () {
    return Template.parentData(1);
  }
});

Template.course_options_form.events({
  'keyup .input-option': _.debounce(function(e) {
      var cou = this.course;
      var attr = $(e.target).data("attribute-name");
      var mini_doc = {};
      mini_doc[attr] = $(e.target).val();
      Meteor.call("submitCourse", cou._id, mini_doc, function(err, resp) {
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });
    }, 300)
});
