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

  $("#current-owner").selectize({
    plugins: ['remove_button'],
    placeholder: "Choose the current owner...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'name',
    searchField: 'name',
    options: [],
    items: []
  });

  var ownerSelectizeAPI = $('#current-owner')[0].selectize;

  ownerSelectizeAPI.on("item_add", function(value, $item){
    var sequenceId = Session.get('currentSequenceId'),
        owner = value;

    Meteor.call("submitSequence", sequenceId, {
      owner: owner
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  });

  $("#passing-rate-type").selectize({
    plugins: ['remove_button'],
    placeholder: "Choose passing rate type...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'slug',
    searchField: 'name',
    options: [{ name: 'Score', slug: 'score' }, { name: 'Percent', slug: 'percent' }],
    items: [ (this.data.sequence && this.data.sequence.passing_rate_type) ]
  });

  var passingratetypeSelectizeAPI = $('#passing-rate-type')[0].selectize;

  passingratetypeSelectizeAPI.on("item_add", function(value, $item){
    var sequenceId = Session.get('currentSequenceId'),
        passing_rate_type = value;

    Meteor.call("submitSequence", sequenceId, {
      passing_rate_type: passing_rate_type
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  });

  ///////////////////
  // number inputs \\
  ///////////////////

  if(this.data.sequence){
    $('#sequence-name').val(this.data.sequence.name);
    $('#total-possible-score').val(this.data.sequence.total_possible_score);
    $('#attempts-allowed').val(this.data.sequence.attempts_allowed);
    $('#passing-rate').val(this.data.sequence.passing_rate);
  }

  var sequenceNameInput = $('#sequence-name').asEventStream("keyup").debounce(1000).flatMapLatest(function(event){
    return $(event.target).val();
  });
  var totalPossibleScoreInput = $('#total-possible-score').asEventStream("keyup").debounce(1000).flatMapLatest(function(event){
    return $(event.target).val();
  });
  var attemptsAllowedInput = $('#attempts-allowed').asEventStream("keyup").debounce(1000).flatMapLatest(function(event){
    return $(event.target).val();
  });
  var passingRateInput = $('#passing-rate').asEventStream("keyup").debounce(1000).flatMapLatest(function(event){
    return $(event.target).val();
  });

  sequenceNameInput.onValue(function(value){
    var sequenceId = Session.get('currentSequenceId');

    if(!(value === '')){
      Meteor.call("submitSequence", sequenceId, {
        name: value
      }, function(err, response) {
        if (err){
          console.log(err);
        } else {
          // success
        }
      });
    }
  });
  totalPossibleScoreInput.onValue(function(value){
    var sequenceId = Session.get('currentSequenceId');

    if(!(value === '')){
      Meteor.call("submitSequence", sequenceId, {
        total_possible_score: value
      }, function(err, response) {
        if (err){
          console.log(err);
        } else {
          // success
        }
      });
    }
  });
  attemptsAllowedInput.onValue(function(value){
    var sequenceId = Session.get('currentSequenceId');

    if(!(value === '')){
      Meteor.call("submitSequence", sequenceId, {
        attempts_allowed: value
      }, function(err, response) {
        if (err){
          console.log(err);
        } else {
          // success
        }
      });
    }
  });
  passingRateInput.onValue(function(value){
    var sequenceId = Session.get('currentSequenceId');

    if(!(value === '')){
      Meteor.call("submitSequence", sequenceId, {
        passing_rate: value
      }, function(err, response) {
        if (err){
          console.log(err);
        } else {
          // success
        }
      });
    }
  });

  ////////////////////
  // boolean inputs //
  ////////////////////

  if(this.data.sequence){
    $('#randomize-items').prop('checked', this.data.sequence.randomize_items);
    $('#randomize-answers').prop('checked', this.data.sequence.randomize_answers);
    $('#allow-incorrect-answers').prop('checked', this.data.sequence.allow_incorrect_answers);
    $('#show-linked-resources-during').prop('checked', this.data.sequence.show_linked_resources_during);
    $('#show-linked-resources-after').prop('checked', this.data.sequence.show_linked_resources_after);
    $('#show-feedback-during').prop('checked', this.data.sequence.show_feedback_during);
    $('#show-feedback-after').prop('checked', this.data.sequence.show_feedback_after);
    $('#show-score-after').prop('checked', this.data.sequence.show_score_after);
    $('#allow-skip-ahead').prop('checked', this.data.sequence.allow_skip_ahead);
    $('#use-measure-weighting').prop('checked', this.data.sequence.use_measure_weighting);
    $('#allow-score-scaling-on-incorrect-attempts').prop('checked', this.data.sequence.allow_score_scaling_on_incorrect_attempts);
  }

};

Template.sequence_options_form.events({
  'click #randomize-items': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      randomize_items: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #randomize-answers': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      randomize_answers: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #allow-incorrect-answers': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      allow_incorrect_answers: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #show-linked-resources-during': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      show_linked_resources_during: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #show-linked-resources-after': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      show_linked_resources_after: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #show-feedback-during': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      show_feedback_during: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #show-feedback-after': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      show_feedback_after: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #show-score-after': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      show_score_after: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #allow-skip-ahead': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      allow_skip_ahead: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #use-measure-weighting': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      use_measure_weighting: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  },
  'click #allow-score-scaling-on-incorrect-attempts': function(e){
    var sequenceId = Session.get('currentSequenceId');
    var value = $(e.target).is(':checked');

    Meteor.call("submitSequence", sequenceId, {
      allow_score_scaling_on_incorrect_attempts: value
    }, function(err, response) {
      if (err){
        console.log(err);
      } else {
        // success
      }
    });
  }
});