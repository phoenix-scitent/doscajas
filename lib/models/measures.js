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
      label: 'Caja Type',
      autoValue: function(){
        return 'measure'
      }
    },
    response_type: {
      type: String,
      label: "Response Type"
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
        if(!this.value){
          if (this.isInsert) {
            return "draft";
          }
        } else {
          return this.value;
        }
      }
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
    answers: {
      type: [Object],
      label: "Answers",
      optional: true
    },
    'answers.$.id': {
      type: Number,
      label: "Answers | Id"
    },
    'answers.$.text': {
      type: String,
      label: "Answers | Text"
    },
    'answers.$.feedback': {
      type: String,
      label: "Answers | Feedback",
      optional: true
    },
    'answers.$.correct': {
      type: Boolean,
      label: "Answers | Correct"
    },
    'answers.$.linked_resource': {
      type: String,
      label: "Answers | Linked Resource",
      optional: true
    },
    'answers.$.points': {
      type: Number,
      label: "Answers | Points",
      autoValue: function() {
        if(!this.value){
          return 1;
        } else {
          return this.value;
        }
      }
    },
    allow_multiple_selection: {
      type: Boolean,
      label: "Allow Multiple Selection",
      defaultValue: false 
    },
    tags: {
      type: [String],
      label: "Tags"
    },
    comments: {
      type: [String],
      label: "Comments",
      optional: true
    },
    suggestions: {
      type: [String],
      label: "Suggestions",
      autoValue: function() {
        if(!this.value){
          return [];
        } else {
          return this.value;
        }
      }
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

Meteor.methods({
  submitMeasure: function(id, measure) {
    if (id) {
      console.log("Updating Measure: " + JSON.stringify(measure));
      Measures.update(id, {$set: measure});
      return id;
    } else {
      console.log("Inserting Measure: " + JSON.stringify(measure));
      return Measures.insert(measure);
    }
  }
});