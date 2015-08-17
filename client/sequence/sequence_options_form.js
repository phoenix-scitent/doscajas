Template.sequence_options_form.rendered = function(){

  console.log(["Session.get('currentSequenceId')",Session.get('currentSequenceId')]);

  $("#sequence-type").selectize({
    placeholder: "choose the type...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'slug',
    searchField: 'name',
    options: SEQUENCE_TYPES,
    items: [ (this.data.sequence && this.data.sequence.type) ]
  });

  var typeSelectizeAPI = $('#sequence-type')[0].selectize;

  typeSelectizeAPI.on("item_add", function(value, $item){
    var sequenceId = Session.get('currentSequenceId'),
        type = value;

    Meteor.call("submitSequence", sequenceId, {
      type: type
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  });

};
Template.sequence_options_form.helpers({
  seq: function(){
    return Template.parentData(1);
  },
  checkbox_for: function(attr, label) {
    var seq = Template.parentData(1);
    var build = '<input name="'+attr+'" value="'+attr+'" id="'+attr+'" data-attribute-name="'+attr+'" type="checkbox" ';
    if (seq[attr] === true)
      build += "checked";
    build += '/> <label for="'+attr+'">'+label+'</label>';
    return build;
  },
  checked: function(attr) {
    return '';
  }
});


Template.sequence_options_form.events({
  'keyup input:not([type=submit]):not([type=file]):not([type=checkbox])': _.debounce(function(e) {
      var seq = this.sequence;
      var attr = $(e.target).data("attribute-name");
      var mini_doc = {};
      mini_doc[attr] = $(e.target).val();
      Meteor.call("submitSequence", seq._id, mini_doc, function(err, resp) {
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });
    }, 300),
  'click input[type=checkbox]': _.debounce(function(e) {
      var seq = this.sequence;
      var attr = $(e.target).data("attribute-name");
      var mini_doc = {};
      mini_doc[attr] = $(e.target).is(':checked');
      Meteor.call("submitSequence", seq._id, mini_doc, function(err, resp) {
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });
    }, 300)
});