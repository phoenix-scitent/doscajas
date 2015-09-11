MeasureEvents = new Mongo.Collection('measure_events');

// Help exists here:  https://github.com/aldeed/meteor-collection2
Schemas.MeasureEvents = new SimpleSchema({
    measure_id: {
      type: String,
      label: "Measure",
      index: true
    },
    events: {
      type: [Object],
      label: "Events",
      optional: true
    },
    'events.$.attempt_id': {
      type: String,
      label: "Events | Attempt",
      optional: true
    },
    'events.$.user': {
      type: Object,
      label: "Events | User",
      optional: true
    },
    'events.$.user._id': {
      type: String,
      label: "Events | User | id",
      optional: true
    },
    'events.$.user.name': {
      type: String,
      label: "Events | User | Name",
      optional: true
    },
    'events.$.user.avatar': {
      type: String,
      label: "Events | User | Avatar",
      optional: true
    },
    'events.$.text': {
      type: String,
      label: "Events | Text",
      optional: true
    },
    'events.$.correct': {
      type: Boolean,
      label: "Events | Correct",
      optional: true
    },
    'events.$.points': {
      type: Number,
      label: "Answers | Points",
      optional: true
    },
    'events.$.created_at': {
      type: Date,
      label: "Answers | Created",
      optional: true
    },
});

MeasureEvents.attachSchema(Schemas.MeasureEvents);

Meteor.methods({
  measure_events_log: function(user_id, measure_id, attempt_id, answer) {
    var existing = MeasureEvents.findOne({measure_id: measure_id});
    var user = Meteor.user();
    var event = {};
    answer["user"] = {
      _id: user_id,
      name: user.profile.name
    }; // avatar to come later
    answer["created_at"] = new Date();
    answer["attempt_id"] = attempt_id;
    delete answer.feedback;
    if (existing) {
      event = MeasureEvents.update({measure_id: measure_id}, {$push: {events: answer} });
    } else {
      event = MeasureEvents.insert({measure_id: measure_id, events: [answer]});
    }
    return event;
  }
});
