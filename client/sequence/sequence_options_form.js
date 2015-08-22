Session.set('attempts_allowed_type', 'Unlimited');
Session.set('passing_rate_type', '%');

Template.sequence_options_form.rendered = function(){

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
  },
  attempts_allowed_type: function(){
    return Session.get('attempts_allowed_type');
  },
  passing_rate_percentage: function(){
    return Session.get('passing_rate_type') === 'percentage';
  },
  hasUnlimitedAttempts: function(){
    return Session.get('attempts_allowed_type') === 'Unlimited';
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
    }, 300),
    'click .pr': function(e){
      var seq = this.sequence;
      var attr = 'passing_rate_type';
      var mini_doc = {};
      var value = $(e.target).data('value');

      mini_doc[attr] = value;

      Meteor.call("submitSequence", seq._id, mini_doc, function(err, resp){
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });

      Session.set('passing_rate_type', value)
    },
    'click .aa': function(e){
      var seq = this.sequence;
      var attr = 'attempts_allowed';
      var mini_doc = {};
      var value = $(e.target).data('value');
      var formattedValue = value === 'limited' ? 'Limited' : 'Unlimited';

      if(value === 'limited'){
        mini_doc[attr] = parseInt($('#attempts-allowed').val()) || 1;
      } else {
        mini_doc[attr] = Infinity;
      }

      Meteor.call("submitSequence", seq._id, mini_doc, function(err, resp){
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });

      Session.set('attempts_allowed_type', formattedValue);
    }
});