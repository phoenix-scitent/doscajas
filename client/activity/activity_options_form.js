Session.set('attempts_allowed_type', 'Unlimited');
Session.set('passing_rate_type', '%');

Template.activity_options_form.rendered = function(){

  $("#activity-type").selectize({
    placeholder: "choose the type...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'slug',
    searchField: 'name',
    options: ACTIVITY_TYPES,
    items: [ (this.data.activity && this.data.activity.type) ]
  });

  var typeSelectizeAPI = $('#activity-type')[0].selectize;

  typeSelectizeAPI.on("item_add", function(value, $item){
    var activityId = Session.get('currentActivityId'),
        type = value;

    Meteor.call("submitActivity", activityId, {
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
Template.activity_options_form.helpers({
  act: function(){
    return Template.parentData(1);
  },
  checkbox_for: function(attr, label) {
    var act = Template.parentData(1);
    var build = '<input name="'+attr+'" value="'+attr+'" id="'+attr+'" data-attribute-name="'+attr+'" type="checkbox" ';
    if (act[attr] === true)
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


Template.activity_options_form.events({
  'keyup input:not([type=submit]):not([type=file]):not([type=checkbox])': _.debounce(function(e) {
      var act = this.activity;
      var attr = $(e.target).data("attribute-name");
      var mini_doc = {};
      mini_doc[attr] = $(e.target).val();
      Meteor.call("submitActivity", act._id, mini_doc, function(err, resp) {
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });
    }, 300),
  'click input[type=checkbox]': _.debounce(function(e) {
      var act = this.activity;
      var attr = $(e.target).data("attribute-name");
      var mini_doc = {};
      mini_doc[attr] = $(e.target).is(':checked');
      Meteor.call("submitActivity", act._id, mini_doc, function(err, resp) {
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });
    }, 300),
    'click .pr': function(e){
      var act = this.activity;
      var attr = 'passing_rate_type';
      var mini_doc = {};
      var value = $(e.target).data('value');

      mini_doc[attr] = value;

      Meteor.call("submitActivity", act._id, mini_doc, function(err, resp){
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });

      Session.set('passing_rate_type', value)
    },
    'click .aa': function(e){
      var act = this.activity;
      var attr = 'attempts_allowed';
      var mini_doc = {};
      var value = $(e.target).data('value');
      var formattedValue = value === 'limited' ? 'Limited' : 'Unlimited';

      if(value === 'limited'){
        mini_doc[attr] = parseInt($('#attempts-allowed').val()) || 1;
      } else {
        mini_doc[attr] = Infinity;
      }

      Meteor.call("submitActivity", act._id, mini_doc, function(err, resp){
        if (err){
          console.log(err);
        } else {
          console.log(resp)
        }
      });

      Session.set('attempts_allowed_type', formattedValue);
    }
});
