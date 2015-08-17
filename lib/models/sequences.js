Sequences = new Mongo.Collection('sequences');

Schemas.Sequence = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  attempt: {
    type: Object,
    label: "Attempt",
    optional: true
  },
    'attempt.completed_at': {
      type: Date,
      label: "Attempt | Date Completed",
      optional: true
    },
    'attempt.parent': {
      type: String,
      label: "Attempt | Parent",
      optional: true
    },
    'attempt.user': {
      type: String,
      label: "Attempt | User",
      optional: true
    },
    'attempt.count': {
      type: Number,
      label: "Attempt | Count",
      optional: true
    },
    'attempt.score': {
      type: Number,
      label: "Attempt | Score",
      optional: true
    },
    //'attempt.topic_stats': {
    //  type: [],  // copy of full BOK, for each level cache scores based on measure/resource tags...
    //  optional: true
    //},
    'attempt.items': {
      type: [Object],
      optional: true,
      blackbox: true
    },
  type: {
    type: String,
    label: "Type",
    optional: true
  },
  items: {
    type: [Object],
    label: "Items"
  },
    'items.$._id': {
      type: String,
      label: "Items | Id"
    },
    'items.$.type': {
      type: String,
      label: "Items | Type"
    },
  owner: {
    type: String,
    label: "Owner"
  },
  tags: {
    type: [String],
    label: "Tags",
    defaultValue: [],
    optional: true
  },
  style: {
    type: Object,
    label: "Style Properties",
    optional: true
  },
    'style.theme': {
      type: String,
      label: "Style | Theme",
      optional: true
    },
    'style.background-url': {
      type: String,
      label: "Style | Background URL",
      optional: true
    },
    'style.background-color': {
      type: String,
      label: "Style | Background Color",
      optional: true
    },
    'style.primary-color': {
      type: String,
      label: "Style | Primary Color",
      optional: true
    },
  total_possible_score: {
    type: Number,
    label: "Total Possible Score",
    defaultValue: 0
  },
  attempts_allowed: {
    type: Number,
    label: "Attempts Allowed",
    defaultValue: 1
  },
  passing_rate: {
    type: Number,
    label: "Passing Rate",
    defaultValue: 100
  },
  passing_rate_type: {
    type: String,
    label: "Passing Rate Type",
    defaultValue: "percent"
  },
  randomize_items: {
    type: Boolean,
    label: "Randomize Items",
    defaultValue: false
  },
  randomize_answers: {
    type: Boolean,
    label: "Randomize Answers",
    defaultValue: false
  },
  allow_incorrect_answers: {
    type: Boolean,
    label: "Allow Incorrect Answers",
    defaultValue: true
  },
  show_linked_resources_during: {
    type: Boolean,
    label: "Show Linked Resources During",
    defaultValue: false
  },
  show_linked_resources_after: {
    type: Boolean,
    label: "Show Linked Resources After",
    defaultValue: true
  },
  show_feedback_during: {
    type: Boolean,
    label: "Show Feedback During",
    defaultValue: false
  },
  show_feedback_after: {
    type: Boolean,
    label: "Show Feedback After",
    defaultValue: true
  },
  show_score_after: {
    type: Boolean,
    label: "Show Score After",
    defaultValue: true
  },
  allow_skip_ahead: {
    type: Boolean,
    label: "Allow Skip Ahead",
    defaultValue: true
  },
  use_measure_weighting: {
    type: Boolean,
    label: "Use Measure Weighting",
    defaultValue: false
  },
  allow_score_scaling_on_incorrect_attempts: {
    type: Boolean,
    label: "Score Scaling On Incorrect Attempts",
    defaultValue: false
  },
  created_at: {
    type: Date,
    label: "Date Created",
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    optional: true
  },
  updated_at: {
    type: Date,
    label: "Date Changed",
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});

Sequences.attachSchema(Schemas.Sequence);

Meteor.methods({
  buildBlankSequence: function() {
    now = new Date();
    return Sequences.insert(
      { owner: Meteor.userId(), 
        tags:  [BOK.current()._id], 
        name:  now.toDateString(),
        type:  "linear",
        items: [],
      });
  },
  //TODO: set defaults per sequence type creation as seperate create functions, no if statements
  submitSequence: function(id, sequence) {
    console.log("Updating Sequence: " + id + " , " + JSON.stringify(sequence));
    if (id) {
      return Sequences.update(id, {$set: sequence});
    } else {
      //console.log("Inserting Sequence: " + JSON.stringify(sequence));

      /////////////////////////////
      // default creation values // (split out of collection2 in order to get more programmatic control over how they are handled)
      /////////////////////////////

      if(!sequence.name){
        sequence.name = String(Date.now());
      }

      if(!sequence.type){
        sequence.type = 'linear';
      }

      if(!sequence.items){
        sequence.items = [];
      }

      if(!sequence.owner){
        sequence.owner = this.userId;
      }

      if(!sequence.total_possible_score){
        sequence.total_possible_score = 100;
      }

      if(!sequence.attempts_allowed){
        sequence.attempts_allowed = 3;
      }

      if(!sequence.passing_rate){
        sequence.passing_rate = 100;
      }

      if(!sequence.passing_rate_type){
        sequence.passing_rate_type = 'score';
      }

      if(!sequence.randomize_items){
        sequence.randomize_items = false;
      }

      if(!sequence.randomize_answers){
        sequence.randomize_answers = false;
      }

      if(!sequence.allow_incorrect_answers){
        sequence.allow_incorrect_answers = false;
      }

      if(!sequence.show_linked_resources_during){
        sequence.show_linked_resources_during = false;
      }

      if(!sequence.show_linked_resources_after){
        sequence.show_linked_resources_after = true;
      }

      if(!sequence.show_feedback_during){
        sequence.show_feedback_during = false;
      }

      if(!sequence.show_feedback_after){
        sequence.show_feedback_after = true;
      }

      if(!sequence.show_score_after){
        sequence.show_score_after = true;
      }

      if(!sequence.allow_skip_ahead){
        sequence.allow_skip_ahead = false;
      }

      if(!sequence.use_measure_weighting){
        sequence.use_measure_weighting = false;
      }

      if(!sequence.allow_score_scaling_on_incorrect_attempts){
        sequence.allow_score_scaling_on_incorrect_attempts = false;
      }

      return Sequences.insert(sequence);
    }
  },
  createAttempt: function(sequenceId, user){
    var existing = Sequences.findOne({'attempt.parent': sequenceId, 'attempt.user': user._id, 'attempt.completed_at': { $exists: false }});
    if (existing) {
      return existing._id;
    }
    console.log("Inserting Attempt from source " + sequenceId);

    var source = Sequences.findOne({ _id: sequenceId });

    attempt = {
      attempt: {
        parent: source._id,
        user: user._id,
        count: Sequences.find({ "attempt.parent": source._id, "attempt.user": user._id }).count() + 1,
        score: 0,
        completed_at: null,
        items: _.map(source.items, function(item){
          if(item.type === 'measure'){
            return Measures.findOne({ _id: item._id });
          } else {
            return Resources.findOne({ _id: item._id });
          }
        })
      },
      type: source.type,
      name: source.name,   //TODO, remove but fix validation,
      items: source.items,
      owner: source.owner, //TODO, remove but fix validation,
      tags: source.tags,
      attempts_allowed: source.attempts_allowed,
      total_possible_score: source.total_possible_score,
      passing_rate: source.passing_rate,
      passing_rate_type: source.passing_rate_type,
      randomize_items: source.randomize_items,
      randomize_answers: source.randomize_answers,
      allow_incorrect_answers: source.allow_incorrect_answers,
      show_linked_resources_during: source.show_linked_resources_during,
      show_linked_resources_after: source.show_linked_resources_after,
      show_feedback_during: source.show_feedback_during,
      show_feedback_after: source.show_feedback_after,
      show_score_after: source.show_score_after,
      allow_skip_ahead: source.allow_skip_ahead,
      use_measure_weighting: source.use_measure_weighting,
      allow_score_scaling_on_incorrect_attempts: source.allow_score_scaling_on_incorrect_attempts
    };

    //console.log(attempt)

    return Sequences.insert(attempt);
  },
  updateAttempt: function(attemptId, attemptConfig) {
    //console.log("Updating Attempt: " + JSON.stringify(attemptConfig));

    var currentScore = null;

    if(attemptConfig.isComplete){
      Sequences.update(attemptId, {$set: _.assign(attemptConfig, { 'attempt.completed_at': Date.now() }) });
    }

    if(attemptConfig.hasOwnProperty('attempt.items')){

      var scoreMap = _.map(attemptConfig['attempt.items'], function(item){
        var answers = item.data.answers;

        if(_.isNumber(item.answer_id)){
          var answer = answers[item.answer_id];
          var isCorrect = answer.correct;
          var points = answer.points;

          if(isCorrect){
            //TODO: use measure weighting to factor into tallying points per measure
            return points
          } else {
            return 0;
          }
        } else {
          // still unanswered
          return 0;
        }
      });

      currentScore = _.reduce(scoreMap, function(total, n){
        //TODO: use passing_rate_type and passing_rate to properly calculate out of total_possible_score
        return total + n;
      });
    }

    if(_.isNumber(currentScore)){
      Sequences.update(attemptId, {$set: _.assign(attemptConfig, { 'attempt.score': currentScore }) });
    } else {
      Sequences.update(attemptId, {$set: attemptConfig});
    }

    return attemptId;
  },
  selectAnswer: function(choice, measure_id, attempt_id) {
    // console.log(["selectAnswer",choice,measure_id,attempt_id]);
    var sequence = Sequences.findOne({_id: attempt_id});
    var measure = _.find(sequence.attempt.items, function(i){
      return i._id == measure_id;
    });
    if (measure.allow_multiple_selection !== true) {
      _.each(measure.answers, function(a){
        a.chosen = false;
      });
      measure.is_answered = true;
    }
    measure.answers[choice - 1].chosen = true;
    return Sequences.update(attempt_id, {$set: {'attempt.items': sequence.attempt.items }});
  },
  isAttempt: function(sequence){
    return sequence.attempt ? true : false;
  }
});