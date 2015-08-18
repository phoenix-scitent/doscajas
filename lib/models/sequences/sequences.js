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
    //TODO: we handle positioning outside of the DB via sequence_attempt.js (measures template helper), is this necessary?
    //'items.$.position': {
    //  type: Number,
    //  label: "Items | Position",
    //  defaultValue: 1
    //},
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