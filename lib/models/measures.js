Measures = new Mongo.Collection('measures');


// Help exists here:  https://github.com/aldeed/meteor-collection2
Schemas.Measure = new SimpleSchema({
    question_text: {
      type: String,
      label: "Question",
      index: true
    },
    description: {
      type: String,
      label: "Description",
      optional: true
    },
    type: {
      type: String,
      label: "Response Type",
    },
    performance_type: {
      type: String,
      label: "Performance Type",
      optional: true
    },
    embedded_resource: {
      type: String,
      label: "Embedded Resource",
      optional: true
    },
    linked_resources: {
      type: [String],
      label: "Linked Resources",
      optional: true
    },
    weight: {
      type: Number,
      label: "Weighting",
      optional: true
    },
    difficulty: {
      type: Number,
      label: "Difficulty",
      optional: true
    },
    status: {
      type: String,
      label: "Status",
      optional: true,
      autoValue: function() {
        if (this.isInsert) {
          return "draft";
        }
      }
    },
    owner: {
      type: String,
      label: "Owner"
    },
    answers: {
      type: [Object],
      label: "Answers",
      optional: true
    },
    tags: {
      type: [String],
      label: "Tags",
    },
    comments: {
      type: [String],
      label: "Comments",
      optional: true
    },
    suggestions: {
      type: [String],
      label: "Suggestions",
      optional: true
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

Measures.attachSchema(Schemas.Measure);