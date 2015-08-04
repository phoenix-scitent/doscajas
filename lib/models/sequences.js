Sequences = new Mongo.Collection('sequences');

Schemas.Sequence = new SimpleSchema({
  attempt: {
    type: Object,
    label: "Attempt",
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
    optional: true
  },
  'attempt.items.$.data': {
    type: Object,
    optional: true
  },
  'attempt.items.$.answer_choice': {
    type: String,
    optional: true
  },
  type: {
    type: String,
    label: "Type",
    autoValue: function(){
      if(!this.value){
        return "linear";
      } else {
        return this.value;
      }
    }
  },
  items: {
    type: [String],
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
    label: "Owner",
    autoValue: function() {
      if(!this.value){
        return this.userId;
      } else {
        return this.value;
      }
    }
  },
  tags: {
    type: [String],
    label: "Tags",
    autoValue: function(){
      return [Boks.find().fetch()[0]._id];
    }
  },
  total_possible_score: {
    type: Number,
    label: "Total Possible Score"
  },
  attempts_allowed: {
    type: Number,
    label: "Attempts Allowed"
  },
  passing_rate: {
    type: Number,
    label: "Passing Rate"
  },
  passing_rate_type: {
    type: String,
    label: "Passing Rate Type",
    autoValue: function(){
      if(!this.value){
        return 'score'; // [percent, score]
      } else {
        return this.value;
      }
    }
  },
  randomize_items: {
    type: Boolean,
    label: "Randomize Items"
  },
  randomize_answers: {
    type: Boolean,
    label: "Randomize Answers"
  },
  allow_incorrect_answers: {
    type: Boolean,
    label: "Allow Incorrect Answers"
  },
  show_linked_resources_during: {
    type: Boolean,
    label: "Show Linked Resources During"
  },
  show_linked_resources_after: {
    type: Boolean,
    label: "Show Linked Resources After"
  },
  show_feedback_during: {
    type: Boolean,
    label: "Show Feedback During"
  },
  show_feedback_after: {
    type: Boolean,
    label: "Show Feedback After"
  },
  show_score_after: {
    type: Boolean,
    label: "Show Score After"
  },
  allow_skip_ahead: {
    type: Boolean,
    label: "Allow Skip Ahead"
  },
  use_measure_weighting: {
    type: Boolean,
    label: "Use Measure Weighting"
  },
  allow_score_scaling_on_incorrect_attempts: {
    type: Boolean,
    label: "Score Scaling On Incorrect Attempts"
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
  submitSequence: function(id, sequence) {
    if (id) {
      console.log("Updating Sequence: " + JSON.stringify(sequence));
      Sequences.update(id, {$set: sequence});
      return id;
    } else {
      console.log("Inserting Sequence: " + JSON.stringify(sequence));
      return Sequences.insert(sequence);
    }
  },
  createAttempt: function(sequenceId){
    console.log("Inserting Attempt from source " + sequenceId);

    var source = Sequences.find({ _id: sequenceId });

    attempt = {
      attempt: {
        user: Meteor.user()._id,
        count: 1, //TODO: make this dynamic +1 for each new attempt passed in from last attempt
        score: null,
        items: _.map(source.items, function(item){
          var data;

          if(item.type === 'measure'){
            data = Measures.find({ _id: item._id });
          } else {
            data = Resources.find({ _id: item._id });
          }

          return { data: data, answer_choice: null };
        })
      },
      type: source.type,
      items: source.items,
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

    return Sequences.insert(attempt);
  },
  updateAttempt: function(attemptId, attemptConfig) {
    //console.log("Updating Attempt: " + JSON.stringify(attemptConfig));
    //Sequences.update(id, {$set: attemptConfig});
    //return id;
  },
  isAttempt: function(sequence){
    return sequence.attempt ? true : false;
  }
});