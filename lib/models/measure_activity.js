MeasureActivity = new Mongo.Collection('measure_activity');

// Help exists here:  https://github.com/aldeed/meteor-collection2
Schemas.MeasureActivity = new SimpleSchema({
    measure_id: {
      type: String,
      label: "Measure",
      index: true
    },
    activities: {
      type: [Object],
      label: "Activities",
      optional: true
    },
    'activities.$.attempt_id': {
      type: String,
      label: "Activity | Attempt",
      optional: true
    },
    'activities.$.user': {
      type: Object,
      label: "Activity | User",
      optional: true
    },
    'activities.$.user._id': {
      type: String,
      label: "activities | User | id",
      optional: true
    },
    'activities.$.user.name': {
      type: String,
      label: "activities | User | Name",
      optional: true
    },
    'activities.$.user.avatar': {
      type: String,
      label: "activities | User | Avatar",
      optional: true
    },
    'activities.$.text': {
      type: String,
      label: "Activity | Text",
      optional: true
    },
    'activities.$.correct': {
      type: Boolean,
      label: "activities | Correct",
      optional: true
    },
    'activities.$.points': {
      type: Number,
      label: "Answers | Points",
      optional: true
    },
    'activities.$.created_at': {
      type: Date,
      label: "Answers | Created",
      optional: true
    },
});

MeasureActivity.attachSchema(Schemas.MeasureActivity);

Meteor.methods({
  measure_activity_log: function(user_id, measure_id, attempt_id, answer) {
    var existing = MeasureActivity.findOne({measure_id: measure_id});
    var user = Meteor.user();
    var activity = {};
    answer["user"] = {
      _id: user_id,
      name: user.profile.name
    }; // avatar to come later
    answer["created_at"] = new Date();
    answer["attempt_id"] = attempt_id;
    delete answer.feedback;
    if (existing) {
      activity = MeasureActivity.update({measure_id: measure_id}, {$push: {activities: answer} });
    } else {
      activity = MeasureActivity.insert({measure_id: measure_id, activities: [answer]});
    }
    return activity;
  }
});