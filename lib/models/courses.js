Courses = new Mongo.Collection('courses');

Schemas.Course = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  description: {
    type: String,
    label: "Description",
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
    'items.$.prerequisite': {
      type: String,
      label: "Items | Prerequisite",
      optional: true
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

Courses.attachSchema(Schemas.Course);

Meteor.methods({
  buildBlankCourse: function() {
    now = new Date();
    return Courses.insert(
        { owner: Meteor.userId(), // pass in?
          tags:  [BOK.current()._id],
          name:  now.toDateString() + ' ' + now.getHours() + now.getMinutes() + now.getSeconds(),
          description: '',
          items: []
        });
  },
  submitCourse: function(id, course) {
    console.log("Updating Course: " + id + " , " + JSON.stringify(course));
    return Courses.update(id, {$set: course});
  }
});
